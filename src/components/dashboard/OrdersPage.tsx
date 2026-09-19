import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRightLeft, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fetchUserDashboardData, type UserOrder } from '../../lib/dashboard';
import { savePaymentRequestContext, generateReferenceId } from '../../lib/paymentContext';
import { navigate } from '../../lib/navigation';

export const OrdersPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Cash-Out Modal State
  const [selectedOrderForCashOut, setSelectedOrderForCashOut] = useState<UserOrder | null>(null);
  const [cashOutAmount, setCashOutAmount] = useState<string>('5000');
  const [cashOutReason, setCashOutReason] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    if (user?.id) {
      fetchUserDashboardData(user.id).then((data) => {
        if (mounted) {
          setOrders(data.orders);
          setLoading(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const handleOpenCashOutModal = (order: UserOrder) => {
    setSelectedOrderForCashOut(order);
    setCashOutAmount(order.part_payment_amount.toString());
    setCashOutReason('');
  };

  const handleConfirmCashOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForCashOut || !user) return;

    const numAmount = parseFloat(cashOutAmount) || selectedOrderForCashOut.part_payment_amount;
    const ref = generateReferenceId('cash_out');
    const customerName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : undefined;

    savePaymentRequestContext({
      request_type: 'cash_out',
      reference_id: ref,
      order_id: selectedOrderForCashOut.id,
      vehicle_name: selectedOrderForCashOut.vehicle_name,
      item_name: `Cash-Out: ${selectedOrderForCashOut.vehicle_name}`,
      amount: numAmount,
      currency: 'USD',
      reason: cashOutReason,
      customer_name: customerName,
      customer_email: user.email,
      is_submitted: false,
    });

    setSelectedOrderForCashOut(null);
    navigate(`/payment?ref=${ref}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
        <p className="text-xs uppercase font-mono tracking-widest text-white/50">Loading Vehicle Orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-red-500" />
            Vehicle <span className="text-white/40">Orders</span>
          </h1>
          <p className="text-xs text-white/50 font-light mt-1">
            Track your reserved vehicle orders, cash-out options, and settlement status.
          </p>
        </div>
        <a
          href="/shop"
          className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
        >
          Browse Shop &amp; Order
        </a>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center space-y-4 max-w-xl mx-auto">
          <ShoppingBag className="w-12 h-12 text-white/20 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Vehicle Orders Recorded</h2>
          <p className="text-xs text-white/50 leading-relaxed">
            You have not reserved any vehicles yet. Explore our vehicle catalog to place an order.
          </p>
          <a
            href="/shop"
            className="inline-block px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10"
          >
            Explore Tesla Vehicles
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-white/40">Order #{order.id.slice(0, 8)}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                    {order.status || 'Pending Review'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{order.vehicle_name}</h3>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-white/60">
                  <span>Quantity: <strong>{order.quantity}</strong></span>
                  <span>Full Price: <strong>${order.full_price.toLocaleString()}</strong></span>
                  <span className="text-emerald-400">Part Payment: <strong>${order.part_payment_amount.toLocaleString()}</strong></span>
                </div>
                <p className="text-[10px] text-white/40 font-mono pt-1">
                  Confirmation and settlement instructions will be sent to <strong>{user?.email}</strong>.
                </p>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => handleOpenCashOutModal(order)}
                  className="w-full md:w-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-red-500" />
                  Request Vehicle Cash-Out
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vehicle Cash-Out Modal */}
      {selectedOrderForCashOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-white/15 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400">Vehicle Cash-Out Request</span>
              <h3 className="text-xl font-black text-white uppercase mt-1">{selectedOrderForCashOut.vehicle_name}</h3>
              <p className="text-xs text-white/50 font-light mt-1">
                Submit a cash-out request for your reserved vehicle order and proceed to the Payment Page.
              </p>
            </div>

            <form onSubmit={handleConfirmCashOut} className="space-y-4">
              <div>
                <label htmlFor="cashOutAmountInput" className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                  Requested Cash-Out Amount (USD)
                </label>
                <input
                  id="cashOutAmountInput"
                  type="number"
                  required
                  value={cashOutAmount}
                  onChange={(e) => setCashOutAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="cashOutReasonInput" className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                  Reason / Payout Preference (Optional)
                </label>
                <textarea
                  id="cashOutReasonInput"
                  rows={3}
                  placeholder="Provide preferred bank wire details or payout currency notes..."
                  value={cashOutReason}
                  onChange={(e) => setCashOutReason(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForCashOut(null)}
                  className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
