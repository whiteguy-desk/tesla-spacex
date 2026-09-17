/**
 * Telegram & Support Contact Helper Module
 *
 * Contact Destinations:
 * Telegram: https://t.me/elonmusk2580900
 * Email fallback: elonmusk2580800@gmail.com
 *
 * Note: Neither destination is described as an official Tesla, SpaceX, Elon Musk, or corporate channel.
 */

export const TELEGRAM_USERNAME = 'elonmusk2580900';
export const TELEGRAM_URL = 'https://t.me/elonmusk2580900';
export const SUPPORT_EMAIL = 'elonmusk2580800@gmail.com';

export interface VehicleOrderSummary {
  orderId: string;
  vehicleName: string;
  vehicleId: string;
  quantity: number;
  fullPrice: number;
  partPayment: number;
  customerName: string;
  customerEmail: string;
}

export interface DepositSummary {
  referenceId: string;
  amount: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
}

export interface WithdrawalSummary {
  referenceId: string;
  amount: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
}

/**
 * Builds a URL-encoded Telegram link for a Vehicle Order summary.
 */
export function buildVehicleOrderTelegramUrl(summary: VehicleOrderSummary): string {
  const message = [
    `🚘 *NEW VEHICLE ORDER REQUEST*`,
    `----------------------------------------`,
    `*Order ID:* ${summary.orderId}`,
    `*Vehicle:* ${summary.vehicleName} (ID: ${summary.vehicleId})`,
    `*Quantity:* ${summary.quantity}`,
    `*Full Price:* $${summary.fullPrice.toLocaleString()}`,
    `*Part Payment:* $${summary.partPayment.toLocaleString()}`,
    `*Customer Name:* ${summary.customerName || 'N/A'}`,
    `*Customer Email:* ${summary.customerEmail || 'N/A'}`,
    `----------------------------------------`,
    `Please confirm my vehicle order and provide payment settlement instructions.`,
  ].join('\n');

  return `${TELEGRAM_URL}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a URL-encoded Telegram link for a Deposit request.
 */
export function buildDepositTelegramUrl(summary: DepositSummary): string {
  const message = [
    `💳 *NEW DEPOSIT REQUEST*`,
    `----------------------------------------`,
    `*Reference ID:* ${summary.referenceId}`,
    `*Amount:* $${summary.amount.toLocaleString()} ${summary.currency || 'USD'}`,
    `*Customer Email:* ${summary.customerEmail || 'N/A'}`,
    `----------------------------------------`,
    `Please provide settlement instructions to complete my deposit request.`,
  ].join('\n');

  return `${TELEGRAM_URL}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a URL-encoded Telegram link for a Withdrawal request.
 */
export function buildWithdrawalTelegramUrl(summary: WithdrawalSummary): string {
  const message = [
    `💸 *NEW WITHDRAWAL REQUEST*`,
    `----------------------------------------`,
    `*Reference ID:* ${summary.referenceId}`,
    `*Amount:* $${summary.amount.toLocaleString()} ${summary.currency || 'USD'}`,
    `*Customer Email:* ${summary.customerEmail || 'N/A'}`,
    `----------------------------------------`,
    `I have initiated a withdrawal request. Please review and process settlement.`,
  ].join('\n');

  return `${TELEGRAM_URL}?text=${encodeURIComponent(message)}`;
}

/**
 * Returns email fallback mailto link.
 */
export function buildEmailFallbackUrl(subject: string, body: string): string {
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
