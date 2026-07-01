'use client';

import { useState } from 'react';
import { useUsers } from '../../../hooks/useUsers';
import { useAuthStore } from '../../../store/authStore';
import { Search, UserX, UserCheck, Trash2, ArrowLeftRight } from 'lucide-react';

export default function UsersManagement() {
  const { user: currentUser } = useAuthStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { getUsersQuery, updateUser, deleteUser } = useUsers();
  const { data: usersData, isLoading, error } = getUsersQuery({ page, search });

  const users = usersData?.users || [];
  const totalPages = usersData?.pages || 1;

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'blocked' : 'active';
    try {
      await updateUser({ id: user._id, status: nextStatus });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user status.');
    }
  };

  const handleToggleRole = async (user) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    if (user._id === currentUser._id) {
      alert('You cannot change your own admin role!');
      return;
    }
    try {
      await updateUser({ id: user._id, role: nextRole });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user role.');
    }
  };

  const handleDelete = async (userId) => {
    if (userId === currentUser._id) {
      alert('You cannot delete your own admin account!');
      return;
    }
    if (confirm('Are you sure you want to delete this user permanently?')) {
      try {
        await deleteUser(userId);
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete user.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-xl font-bold text-foreground">User Management</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Moderate accounts, swap access roles, block bad actors, and audit details.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1.5 text-xs focus:border-ring focus:outline-none text-foreground"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-muted"></div>
          ))}
        </div>
      ) : error ? (
        <p className="text-xs text-destructive text-center py-6">Failed to load user accounts.</p>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">No user accounts found matching your query.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left border-collapse text-xs text-foreground bg-card">
            <thead>
              <tr className="border-b border-border bg-secondary/50 font-semibold text-muted-foreground">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Join Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-secondary/25 transition-colors">
                  <td className="p-4 font-bold text-foreground">{u.name}</td>
                  <td className="p-4 text-muted-foreground">{u.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 font-semibold rounded px-2 py-0.5 text-[10px] ${u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 font-semibold rounded px-2 py-0.5 text-[10px] ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-1.5">
                    
                    <button
                      onClick={() => handleToggleRole(u)}
                      disabled={u._id === currentUser._id}
                      className="rounded p-1.5 border border-border hover:bg-secondary hover:text-foreground text-muted-foreground disabled:opacity-40 cursor-pointer bg-card"
                      title="Swap Access Role"
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(u)}
                      disabled={u._id === currentUser._id}
                      className={`rounded p-1.5 border border-border hover:bg-secondary disabled:opacity-40 cursor-pointer bg-card ${u.status === 'active' ? 'text-rose-500 hover:text-rose-600' : 'text-emerald-500 hover:text-emerald-600'}`}
                      title={u.status === 'active' ? 'Block Account' : 'Unblock Account'}
                    >
                      {u.status === 'active' ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                    </button>

                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={u._id === currentUser._id}
                      className="rounded p-1.5 border border-border hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 disabled:opacity-40 cursor-pointer bg-card"
                      title="Delete User"
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
