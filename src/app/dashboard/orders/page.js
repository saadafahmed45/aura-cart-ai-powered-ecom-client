'use client';

import { useState } from 'react';
import { useOrders } from '../../../hooks/useOrders';
import { Receipt, ChevronRight } from 'lucide-react';

export default function OrdersManagement() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { getAdminOrdersQuery, updateOrderStatus, isUpdatingStatus, getOrderDetailsQuery } = useOrders();
  const { data: ordersData, isLoading, error } = getAdminOrdersQuery({ page, status: statusFilter });
  const { data: orderDetails, isLoading: detailsLoading } = getOrderDetailsQuery(selectedOrderId);

  const orders = ordersData?.orders || [];
  const totalPages = ordersData?.pages || 1;

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      await updateOrderStatus({ id, orderStatus: nextStatus });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update order status.');
    }
  };

  const handleUpdatePayment = async (id, nextPaymentStatus) => {
    try {
      await updateOrderStatus({ id, paymentStatus: nextPaymentStatus });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update payment status.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Shipped': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500';
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-xl font-bold text-foreground">Order Fulfillment</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Audit cash transactions, update package status, and track distributions.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-semibold ${statusFilter === status ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-foreground bg-card'}`}
            >
              {status === '' ? 'All Orders' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded bg-muted"></div>
              ))}
            </div>
          ) : error ? (
            <p className="text-xs text-destructive text-center">Failed to load orders.</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Receipt className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No orders matching this status filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left border-collapse text-xs text-foreground bg-card">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 font-semibold text-muted-foreground">
                    <th className="p-4">ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((o) => (
                    <tr
                      key={o._id}
                      onClick={() => setSelectedOrderId(o._id)}
                      className={`hover:bg-secondary/25 transition-colors cursor-pointer ${selectedOrderId === o._id ? 'bg-secondary/40 font-semibold' : ''}`}
                    >
                      <td className="p-4 font-mono text-[10px] text-foreground">#{o._id.substring(12)}</td>
                      <td className="p-4">
                        <span className="font-bold text-foreground block">{o.user?.name}</span>
                        <span className="text-[10px] text-muted-foreground block">{o.user?.email}</span>
                      </td>
                      <td className="p-4 font-bold text-foreground">${o.totalPrice.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`inline-flex border rounded px-2 py-0.5 text-[9px] font-bold ${getStatusColor(o.orderStatus)}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex border rounded px-2 py-0.5 text-[9px] font-bold ${o.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded border px-3 py-1 text-xs font-semibold disabled:opacity-40 cursor-pointer bg-card text-foreground"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded border px-3 py-1 text-xs font-semibold disabled:opacity-40 cursor-pointer bg-card text-foreground"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm h-fit">
          {!selectedOrderId ? (
            <div className="text-center py-12 text-muted-foreground text-xs leading-relaxed">
              <Receipt className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p>Click on any order in the table to display shipping addresses, item breakdowns, and update statuses.</p>
            </div>
          ) : detailsLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-28 bg-muted rounded"></div>
            </div>
          ) : !orderDetails ? (
            <p className="text-xs text-destructive text-center">Failed to fetch order details.</p>
          ) : (
            <div className="flex flex-col gap-6 text-xs text-muted-foreground bg-card">
              
              <div className="border-b border-border pb-4">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-1">Receipt details</span>
                <h3 className="font-extrabold text-foreground text-sm">
                  Order #{orderDetails._id.substring(12)}
                </h3>
                <span className="text-[11px] text-muted-foreground block mt-1">Customer: <strong>{orderDetails.user?.name} ({orderDetails.user?.email})</strong></span>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-2 uppercase tracking-wider">Update Order Status</label>
                <select
                  value={orderDetails.orderStatus}
                  onChange={(e) => handleUpdateStatus(orderDetails._id, e.target.value)}
                  disabled={isUpdatingStatus}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-2 uppercase tracking-wider">Update Payment Status</label>
                <select
                  value={orderDetails.paymentStatus}
                  onChange={(e) => handleUpdatePayment(orderDetails._id, e.target.value)}
                  disabled={isUpdatingStatus}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Items Breakdown</h4>
                <div className="divide-y divide-border/60 max-h-36 overflow-y-auto">
                  {orderDetails.orderItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center py-2 text-xs">
                      <div className="flex gap-2 items-center pr-4">
                        {item.image && <img src={item.image} className="w-8 h-8 rounded object-cover" />}
                        <div className="flex flex-col truncate">
                          <span className="truncate text-foreground font-semibold">{item.name}</span>
                          <span className="text-[10px] text-muted-foreground">{item.quantity}x @ ${item.price}</span>
                        </div>
                      </div>
                      <span className="font-bold text-foreground shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Shipping Destination</h4>
                <p className="leading-relaxed">
                  {orderDetails.shippingAddress.street}<br />
                  {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}<br />
                  {orderDetails.shippingAddress.country}
                </p>
              </div>

              <div className="border-t border-border pt-4 space-y-1.5 text-xs text-muted-foreground border-b border-border pb-4">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-bold text-foreground">Cash on Delivery ({orderDetails.paymentMethod})</span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-2 text-sm font-extrabold text-foreground">
                  <span>Total Amount</span>
                  <span>${orderDetails.totalPrice.toFixed(2)}</span>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
