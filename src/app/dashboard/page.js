'use client';

import { useOrders } from '../../hooks/useOrders';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart as BarIcon 
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
  const { getAnalyticsQuery } = useOrders();
  const { data: analyticsData, isLoading, error } = getAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="lg:col-span-2 h-96 bg-muted rounded-xl"></div>
          <div className="h-96 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="text-center py-12 text-destructive font-semibold">
        Failed to fetch analytics statistics data. Ensure server and DB are online.
      </div>
    );
  }

  const { stats, monthlySales, categoryDistribution, statusDistribution } = analyticsData;

  const cardStats = [
    { name: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10' },
    { name: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'Total Customers', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-violet-500 bg-violet-500/10' },
    { name: 'Active Catalog', value: `${stats.totalProducts.toLocaleString()} items`, icon: Package, color: 'text-amber-500 bg-amber-500/10' }
  ];

  const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const statusColors = {
    'Pending': '#6b7280',
    'Processing': '#3b82f6',
    'Shipped': '#f59e0b',
    'Delivered': '#10b981',
    'Cancelled': '#ef4444'
  };

  const statusChartData = statusDistribution?.map(item => ({
    name: item.status,
    count: item.count,
    fill: statusColors[item.status] || '#6b7280'
  })) || [];

  return (
    <div className="space-y-8 bg-background">
      
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Live updates on revenue flow, customer acquisitions, and stock inventory statistics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardStats.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.name} className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{kpi.name}</span>
                <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
              </div>
              <div className={`rounded-xl p-3.5 ${kpi.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">Sales Trend Over Time</h3>
          </div>
          
          <div className="h-80 w-full">
            {monthlySales?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySales}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} 
                    labelStyle={{ fontWeight: 'bold', fontSize: '12px', color: 'var(--foreground)' }}
                  />
                  <Area type="monotone" dataKey="sales" name="Sales ($)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No orders history recorded yet for trending charts.
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <PieIcon className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">Category Distribution</h3>
          </div>

          <div className="h-80 w-full flex items-center justify-center">
            {categoryDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} 
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No product distribution records cataloged yet.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <BarIcon className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">Fulfillment Status Distribution</h3>
          </div>

          <div className="h-64 w-full">
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} 
                  />
                  <Bar dataKey="count" name="Total Orders" radius={[4, 4, 0, 0]}>
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                No orders fulfillment status records cataloged yet.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
