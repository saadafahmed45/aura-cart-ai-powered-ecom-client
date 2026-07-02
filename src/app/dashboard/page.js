'use client';

import { useOrders } from '../../hooks/useOrders';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart as BarIcon,
  ArrowUpRight,
  Plus,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  BarChart, 
  Bar 
} from 'recharts';

export default function DashboardHome() {
  const { getAnalyticsQuery, getAdminOrdersQuery } = useOrders();
  const { data: analyticsData, isLoading: isAnalyticsLoading, error: analyticsError } = getAnalyticsQuery();
  const { data: ordersData, isLoading: isOrdersLoading } = getAdminOrdersQuery({ limit: 5 });

  const recentOrders = ordersData?.orders || [];

  if (isAnalyticsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1.5 animate-pulse">
          <div className="h-6 w-48 bg-muted rounded-md"></div>
          <div className="h-4 w-96 bg-muted rounded-md mt-1"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
          <div className="lg:col-span-2 h-[400px] bg-muted rounded-xl"></div>
          <div className="h-[400px] bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (analyticsError || !analyticsData) {
    return (
      <div className="text-center py-12 text-destructive font-semibold">
        Failed to fetch analytics statistics data. Ensure server and DB are online.
      </div>
    );
  }

  const { stats, monthlySales, categoryDistribution, statusDistribution } = analyticsData;

  const cardStats = [
    { 
      name: 'Total Revenue', 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      trend: '+12.4%', 
      isPositive: true,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' 
    },
    { 
      name: 'Total Orders', 
      value: stats.totalOrders.toLocaleString(), 
      icon: ShoppingBag, 
      trend: '+8.2%', 
      isPositive: true,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' 
    },
    { 
      name: 'Total Customers', 
      value: stats.totalUsers.toLocaleString(), 
      icon: Users, 
      trend: '+5.7%', 
      isPositive: true,
      color: 'text-violet-500 bg-violet-500/10 border-violet-500/20' 
    },
    { 
      name: 'Active Catalog', 
      value: `${stats.totalProducts.toLocaleString()} items`, 
      icon: Package, 
      trend: 'Optimal', 
      isPositive: true,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' 
    }
  ];

  const PIE_COLORS = ['#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

  const statusColors = {
    'Pending': '#6b7280',
    'Processing': '#3b82f6',
    'Shipped': '#f59e0b',
    'Delivered': '#10b981',
    'Cancelled': '#ef4444'
  };

  const statusBgColors = {
    'Pending': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    'Processing': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Shipped': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Delivered': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    'Cancelled': 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  };

  const statusChartData = statusDistribution?.map(item => ({
    name: item.status,
    count: item.count,
    fill: statusColors[item.status] || '#6b7280'
  })) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 bg-background"
    >
      
      {/* Top Banner Header with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Live updates on revenue flow, customer acquisitions, and stock inventory statistics.</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-center">
          <Link
            href="/dashboard/products"
            className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/95 transition-all shadow-sm hover:shadow active:scale-95"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1.5 text-xs font-semibold border border-border bg-card hover:bg-secondary px-4 py-2 rounded-lg transition-all active:scale-95 text-foreground"
          >
            View Orders <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardStats.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div 
              variants={itemVariants}
              key={kpi.name} 
              className="bg-card border border-border/60 hover:border-border p-6 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{kpi.name}</span>
                <span className="text-2xl font-extrabold text-foreground tracking-tight">{kpi.value}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {kpi.name !== 'Active Catalog' ? (
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                      <ArrowUpRight className="h-3 w-3" /> {kpi.trend}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-500">
                      {kpi.trend}
                    </span>
                  )}
                  <span className="text-[9px] text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className={`rounded-xl p-3 border transition-transform duration-300 group-hover:scale-110 ${kpi.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Line Area Chart */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-card border border-border/60 p-6 rounded-xl shadow-xs flex flex-col gap-5"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Sales Trend Over Time</h3>
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">Last 6 Months</span>
          </div>
          
          <div className="h-80 w-full pr-4">
            {monthlySales?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySales}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(99, 102, 241)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="rgb(99, 102, 241)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} dx={-8} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                    labelStyle={{ fontWeight: 'bold', color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="sales" name="Sales ($)" stroke="rgb(99, 102, 241)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No orders history recorded yet for trending charts.
              </div>
            )}
          </div>
        </motion.div>

        {/* Category Pie Chart */}
        <motion.div 
          variants={itemVariants}
          className="bg-card border border-border/60 p-6 rounded-xl shadow-xs flex flex-col gap-5"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
                <PieIcon className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-foreground text-sm">Category Share</h3>
            </div>
          </div>

          <div className="h-80 w-full flex items-center justify-center">
            {categoryDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} className="focus:outline-none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                  />
                  <Legend verticalAlign="bottom" height={44} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No product distribution records cataloged yet.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid Row: Recent Orders & Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders List */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-card border border-border/60 p-6 rounded-xl shadow-xs flex flex-col gap-4"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground text-sm">Recent Storefront Orders</h3>
            </div>
            <Link href="/dashboard/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs bg-card">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold">
                    <th className="pb-3 pr-2">Order ID</th>
                    <th className="pb-3 px-2">Customer</th>
                    <th className="pb-3 px-2">Price</th>
                    <th className="pb-3 pl-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-secondary/15 transition-colors">
                      <td className="py-3 pr-2 font-mono text-[10px] text-muted-foreground">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>
                      <td className="py-3 px-2 truncate max-w-[120px] font-medium text-foreground">
                        {order.shippingAddress?.street ? `${order.shippingAddress.city}, ${order.shippingAddress.country}` : 'Guest Customer'}
                      </td>
                      <td className="py-3 px-2 font-bold text-foreground">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${statusBgColors[order.orderStatus] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No recent orders placed yet.
              </div>
            )}
          </div>
        </motion.div>

        {/* Fulfillment Status Chart */}
        <motion.div 
          variants={itemVariants}
          className="bg-card border border-border/60 p-6 rounded-xl shadow-xs flex flex-col gap-5"
        >
          <div className="flex items-center gap-2 border-b border-border/40 pb-4">
            <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
              <BarIcon className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-foreground text-sm">Fulfillment Status</h3>
          </div>

          <div className="h-56 w-full pr-2">
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} dy={8} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} dx={-8} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                  />
                  <Bar dataKey="count" name="Total Orders" radius={[4, 4, 0, 0]} maxBarSize={30}>
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No status stats logged.
              </div>
            )}
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
}
