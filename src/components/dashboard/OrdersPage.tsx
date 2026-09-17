import React, { useEffect, useState } from 'react';
import { ShoppingBag, Loader2, Send, ExternalLink } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fetchUserDashboardData, type UserOrder } from '../../lib/dashboard';
import { buildVehicleOrderTelegramUrl } from '../../lib/telegram';

export const OrdersPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleOpenTelegram = (order: UserOrder) => {
    const customerName = profile?.first_name
      ? `${profile.first_name} ${profile.last_name || ''}`.trim()
      : user?.email?.split('@')[0] || 'Customer';
    const customerEmail = user?.email || '';

    const telegramUrl = buildVehicleOrderTelegramUrl({
      orderId: order.id,
      vehicleName: order.vehicle_name,
      vehicleId: order.vehicle_id || order.vehicle_name.toLowerCase().replace(/\s+/g, '-'),
      quantity: order.quantity,
      fullPrice: order.full_price,
      partPayment: order.part_payment_amount,
      customerName,
      customerEmail,
    });

    window.open(telegramUrl, '_blank');
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
            Track your reserved vehicle orders and settlement status.
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
                    {order.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{order.vehicle_name}</h3>
                <div className="flex flex-wrap gap-4 text-xs font-mono text-white/60">
                  <span>Quantity: <strong>{order.quantity}</strong></span>
                  <span>Full Price: <strong>${order.full_price.toLocaleString()}</strong></span>
                  <span className="text-emerald-400">Part Payment: <strong>${order.part_payment_amount.toLocaleString()}</strong></span>
                </div>
                <p className="text-[10px] text-white/30 font-mono">
                  Created on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => handleOpenTelegram(order)}
                  className="w-full md:w-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-red-500" />
                  Contact Settlement on Telegram
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
