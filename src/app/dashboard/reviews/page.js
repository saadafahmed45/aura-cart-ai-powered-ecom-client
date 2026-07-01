'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { MessageSquare, Trash2, CheckCircle2, XCircle, Star, Search } from 'lucide-react';

export default function ReviewsManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: reviewsData, isLoading, error } = useQuery({
    queryKey: ['reviews', 'admin', page, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page);
      if (search) params.append('search', search);
      const res = await api.get(`/reviews?${params.toString()}`);
      return res.data;
    }
  });

  const reviews = reviewsData?.reviews || [];
  const totalPages = reviewsData?.pages || 1;

  const approveMutation = useMutation({
    mutationFn: async ({ id, isApproved }) => {
      const res = await api.put(`/reviews/${id}/approve`, { isApproved });
      return res.data.review;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });

  const handleToggleApprove = async (id, currentApproved) => {
    try {
      await approveMutation.mutateAsync({ id, isApproved: !currentApproved });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update review approval status.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this review permanently?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete review.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-xl font-bold text-foreground">Review Moderation</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Approve comments, audit product ratings, and delete inappropriate content.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search reviews by comment content..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1.5 text-xs focus:border-ring focus:outline-none text-foreground"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded bg-muted"></div>
          ))}
        </div>
      ) : error ? (
        <p className="text-xs text-destructive text-center py-6">Failed to load reviews.</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">No reviews matched your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left border-collapse text-xs text-foreground bg-card">
            <thead>
              <tr className="border-b border-border bg-secondary/50 font-semibold text-muted-foreground">
                <th className="p-4">Product</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Comment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((rev) => (
                <tr key={rev._id} className="hover:bg-secondary/25 transition-colors">
                  <td className="p-4 font-bold text-foreground truncate max-w-[120px]">{rev.product?.name || 'Deleted Product'}</td>
                  <td className="p-4">
                    <span className="font-semibold text-foreground">{rev.user?.name}</span>
                    <span className="block text-[10px] text-muted-foreground">{rev.user?.email}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-amber-500 gap-0.5">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-3 w-3 ${idx < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-border'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground max-w-xs truncate" title={rev.comment}>
                    {rev.comment}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 font-semibold rounded px-2 py-0.5 text-[10px] ${rev.isApproved ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                      {rev.isApproved ? 'Approved' : 'Disapproved'}
                    </span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-1.5">
                    
                    <button
                      onClick={() => handleToggleApprove(rev._id, rev.isApproved)}
                      className={`rounded p-1.5 border border-border hover:bg-secondary cursor-pointer bg-card ${rev.isApproved ? 'text-rose-500' : 'text-emerald-500'}`}
                      title={rev.isApproved ? 'Disapprove Review' : 'Approve Review'}
                    >
                      {rev.isApproved ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    </button>

                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="rounded p-1.5 border border-border hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer bg-card"
                      title="Delete Review"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

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
  );
}
