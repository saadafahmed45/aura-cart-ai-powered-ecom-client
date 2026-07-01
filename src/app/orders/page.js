'use client';

import { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useAuthStore } from '../../store/authStore';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  ChevronRight, 
  CheckCircle,
  Truck,
  AlertTriangle,
  XCircle,
  Search,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { getMyOrdersQuery, getOrderDetailsQuery } = useOrders();
  const { data: ordersData, isLoading } = getMyOrdersQuery(page);

  const orders = ordersData?.orders || [];
  const totalPages = ordersData?.pages || 1;

  const handleViewDetails = async (orderId) => {
    setSelectedOrder(orderId);
  };

  const { data: orderDetails, isLoading: detailsLoading } = getOrderDetailsQuery(selectedOrder);

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

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-foreground mb-8">My Orders</h1>

      {!isAuthenticated ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground">Sign In Required</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
            You must be logged in to view your orders history and track packages.
          </p>
          <Link href="/login?redirect=orders" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer">
            Sign In Now
          </Link>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground">No Orders Placed</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
            You haven't placed any orders yet. Visit our shop catalog to get started.
          </p>
          <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => handleViewDetails(order._id)}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border cursor-pointer transition-all hover:bg-secondary/40 shadow-sm ${selectedOrder === order._id ? 'border-primary ring-2 ring-primary/10 bg-secondary/20' : 'border-border bg-card'}`}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground bg-secondary px-1.5 py-0.5 rounded border">
                      #{order._id.substring(12)}
                    </span>
                    <span className={`text-[10px] font-bold border rounded px-2 py-0.5 ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-0.5"><DollarSign className="h-3.5 w-3.5" /> Total: ${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0">
                  <span className="text-xs text-muted-foreground">{order.orderItems.length} items</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded border px-3 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded border px-3 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="bg-card border border-border p-6 rounded-xl shadow-sm h-fit">
            {!selectedOrder ? (
              <div className="text-center py-12 text-muted-foreground text-xs leading-relaxed">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p>Click on any order in the list to open live tracking progress and purchase receipt details.</p>
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
              <div className="flex flex-col gap-6">
                
                <div className="border-b border-border pb-4">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-1">Receipt details</span>
                  <h3 className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
                    Order #{orderDetails._id.substring(12)}
                  </h3>
                  <span className="text-[11px] text-muted-foreground block mt-1">Placed on {new Date(orderDetails.createdAt).toLocaleString()}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider">Tracking Status</h4>
                  
                  {orderDetails.orderStatus === 'Cancelled' ? (
                    <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 border border-rose-500/20 text-rose-500 text-xs font-bold">
                      <XCircle className="h-4.5 w-4.5" /> Order Cancelled
                    </div>
                  ) : (
                    <div className="space-y-4 pl-4 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                      
                      <div className="flex items-center gap-3 relative">
                        <span className={`absolute -left-4.5 h-3.5 w-3.5 rounded-full border-2 ${getStatusStepIndex(orderDetails.orderStatus) >= 1 ? 'bg-primary border-primary' : 'bg-background border-border'}`}></span>
                        <span className="text-xs font-bold text-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> Order Placed</span>
                      </div>

                      <div className="flex items-center gap-3 relative">
                        <span className={`absolute -left-4.5 h-3.5 w-3.5 rounded-full border-2 ${getStatusStepIndex(orderDetails.orderStatus) >= 2 ? 'bg-primary border-primary' : 'bg-background border-border'}`}></span>
                        <span className="text-xs font-bold text-foreground flex items-center gap-1"><Package className="h-3.5 w-3.5 text-muted-foreground" /> Processing Pack</span>
                      </div>

                      <div className="flex items-center gap-3 relative">
                        <span className={`absolute -left-4.5 h-3.5 w-3.5 rounded-full border-2 ${getStatusStepIndex(orderDetails.orderStatus) >= 3 ? 'bg-primary border-primary' : 'bg-background border-border'}`}></span>
                        <span className="text-xs font-bold text-foreground flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-muted-foreground" /> Dispatched</span>
                      </div>

                      <div className="flex items-center gap-3 relative">
                        <span className={`absolute -left-4.5 h-3.5 w-3.5 rounded-full border-2 ${getStatusStepIndex(orderDetails.orderStatus) >= 4 ? 'bg-emerald-500 border-emerald-500' : 'bg-background border-border'}`}></span>
                        <span className="text-xs font-bold text-foreground flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Delivered</span>
                      </div>

                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Items</h4>
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

                <div className="border-t border-border pt-4 text-xs">
                  <h4 className="text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">Shipping Address</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {orderDetails.shippingAddress.street}<br />
                    {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}<br />
                    {orderDetails.shippingAddress.country}
                  </p>
                </div>

                <div className="border-t border-border pt-4 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="font-bold text-foreground">Cash on Delivery ({orderDetails.paymentMethod})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <span className={`font-bold border rounded px-1.5 py-0.5 text-[10px] ${orderDetails.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>{orderDetails.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/40 pt-2 text-sm font-extrabold text-foreground">
                    <span>Amount Paid</span>
                    <span>${orderDetails.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
