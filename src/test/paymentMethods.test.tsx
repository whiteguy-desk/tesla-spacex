import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaymentPage } from '../components/PaymentPage';
import { savePaymentRequestContext } from '../lib/paymentContext';
import { supabase } from '../lib/supabase';

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-uuid', email: 'testuser@tesla.com' },
    profile: { first_name: 'Test', last_name: 'User' },
    isLoading: false,
  }),
}));

vi.mock('../lib/navigation', () => ({
  navigate: vi.fn(),
}));

describe('Payment Methods Integration Requirements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('renders payment method options without Bank/Wire', () => {
    savePaymentRequestContext({
      request_type: 'deposit',
      reference_id: 'DEP-1001',
      amount: 2000,
      currency: 'USD',
      payment_method: 'Crypto',
      customer_name: 'Test User',
      customer_email: 'testuser@tesla.com',
      is_submitted: false,
    });

    render(<PaymentPage />);

    expect(screen.getByText('Telegram')).toBeTruthy();
    expect(screen.getByText('Crypto')).toBeTruthy();
    expect(screen.getByText('Gift Card')).toBeTruthy();
    expect(screen.getByText('Email')).toBeTruthy();

    expect(screen.queryByText(/Bank Wire/i)).toBeNull();
    expect(screen.queryByText(/Wire Transfer/i)).toBeNull();
  });

  it('handles Telegram payment method selection with exact URL', () => {
    savePaymentRequestContext({
      request_type: 'deposit',
      reference_id: 'DEP-1002',
      amount: 2000,
      currency: 'USD',
      customer_name: 'Test User',
      customer_email: 'testuser@tesla.com',
      is_submitted: false,
    });

    render(<PaymentPage />);

    const telegramBtn = screen.getByText('Telegram');
    fireEvent.click(telegramBtn);

    const telegramLink = screen.getByRole('link', { name: /Open Telegram Chat/i });
    expect(telegramLink.getAttribute('href')).toBe('https://t.me/elonmusk2580900');
  });

  it('handles Email payment method with mailto: link', () => {
    savePaymentRequestContext({
      request_type: 'deposit',
      reference_id: 'DEP-1003',
      amount: 3000,
      currency: 'USD',
      customer_name: 'Test User',
      customer_email: 'testuser@tesla.com',
      is_submitted: false,
    });

    render(<PaymentPage />);

    const emailBtn = screen.getByText('Email');
    fireEvent.click(emailBtn);

    const emailLink = screen.getByRole('link', { name: /Open Email Client/i });
    const href = emailLink.getAttribute('href');
    expect(href).toContain('mailto:elonmusk2580800@gmail.com');
    expect(href).toContain('DEP-1003');
  });

  it('validates Gift Card file type and file size limits', async () => {
    savePaymentRequestContext({
      request_type: 'deposit',
      reference_id: 'DEP-1004',
      amount: 1500,
      currency: 'USD',
      customer_name: 'Test User',
      customer_email: 'testuser@tesla.com',
      is_submitted: false,
    });

    render(<PaymentPage />);

    const giftCardBtn = screen.getByText('Gift Card');
    fireEvent.click(giftCardBtn);

    const fileInput = document.getElementById('giftCardFile') as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    // Test invalid mime type
    const invalidFile = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    expect(screen.getByText(/Invalid file format/i)).toBeTruthy();

    // Test file larger than 10MB
    const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'huge.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    expect(screen.getByText(/exceeds the 10 MB limit/i)).toBeTruthy();
  });

  it('submits Gift Card image to Supabase Storage and inserts record into gift_card_submissions', async () => {
    const mockUpload = vi.spyOn(supabase.storage, 'from').mockReturnValue({
      upload: vi.fn().mockResolvedValue({
        data: { path: 'test-user-uuid/DEP-1005/1234_card.png' },
        error: null,
      }),
      remove: vi.fn().mockResolvedValue({ data: {}, error: null }),
    } as any);

    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
    vi.spyOn(supabase, 'from').mockReturnValue({
      insert: mockInsert,
    } as any);

    savePaymentRequestContext({
      request_type: 'deposit',
      reference_id: 'DEP-1005',
      amount: 1000,
      currency: 'USD',
      customer_name: 'Test User',
      customer_email: 'testuser@tesla.com',
      is_submitted: false,
    });

    render(<PaymentPage />);

    fireEvent.click(screen.getByText('Gift Card'));

    const fileInput = document.getElementById('giftCardFile') as HTMLInputElement;
    const validFile = new File(['valid image bytes'], 'mycard.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    const submitBtn = screen.getByRole('button', { name: /Submit Gift Card for Review/i });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Gift Card Submitted Successfully/i)).toBeTruthy();
    });

    expect(mockUpload).toHaveBeenCalledWith('gift-card-submissions');
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'test-user-uuid',
        reference_id: 'DEP-1005',
        original_filename: 'mycard.jpg',
        mime_type: 'image/jpeg',
        status: 'pending',
      })
    );
  });
});
