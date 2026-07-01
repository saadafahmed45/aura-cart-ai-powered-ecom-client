'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { profileSchema, addressSchema } from '../../validators/schemas';
import { User, MapPin, Lock, Plus, Trash2 } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { profile, updateProfile, addAddress, deleteAddress } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [addressSuccess, setAddressSuccess] = useState('');
  const [addressError, setAddressError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, setValue: setProfileValue, formState: { errors: profileErrors, isSubmitting: profileSubmitting } } = useForm({
    resolver: zodResolver(profileSchema)
  });

  const { register: registerAddress, handleSubmit: handleAddressSubmit, reset: resetAddress, formState: { errors: addressErrors, isSubmitting: addressSubmitting } } = useForm({
    resolver: zodResolver(addressSchema)
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=account');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (profile) {
      setProfileValue('name', profile.name);
      setProfileValue('email', profile.email);
    }
  }, [profile, setProfileValue]);

  const onProfileSubmit = async (data) => {
    setProfileSuccess('');
    setProfileError('');
    try {
      await updateProfile({
        name: data.name,
        email: data.email,
        password: data.password || undefined
      });
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Failed to update profile details.');
    }
  };

  const onAddressSubmit = async (data) => {
    setAddressSuccess('');
    setAddressError('');
    try {
      await addAddress(data);
      setAddressSuccess('New address added successfully!');
      resetAddress();
      setShowAddressForm(false);
    } catch (err) {
      setAddressError(err.response?.data?.error || 'Failed to add address.');
    }
  };

  const handleRemoveAddress = async (addressId) => {
    setAddressSuccess('');
    setAddressError('');
    try {
      await deleteAddress(addressId);
      setAddressSuccess('Address removed successfully!');
    } catch (err) {
      setAddressError(err.response?.data?.error || 'Failed to delete address.');
    }
  };

  if (!profile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-10 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded w-full max-w-lg mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-64 shrink-0 bg-card border border-border p-4 rounded-xl h-fit">
          <div className="border-b border-border pb-4 mb-4">
            <h2 className="font-extrabold text-foreground text-base">Account Panel</h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{profile.name}</p>
          </div>

          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer w-full text-left shrink-0 ${activeTab === 'profile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <User className="h-4 w-4" /> Personal Profile
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer w-full text-left shrink-0 ${activeTab === 'addresses' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <MapPin className="h-4 w-4" /> Shipping Addresses
            </button>
          </div>
        </aside>

        <div className="flex-1">
          
          {activeTab === 'profile' && (
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm max-w-lg">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 border-b border-border pb-3">
                <User className="h-5 w-5 text-primary" /> Profile Settings
              </h2>

              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    {...registerProfile('name')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                  />
                  {profileErrors.name && <span className="text-xs text-destructive mt-1 block">{profileErrors.name.message}</span>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    {...registerProfile('email')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                  />
                  {profileErrors.email && <span className="text-xs text-destructive mt-1 block">{profileErrors.email.message}</span>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">New Password (Leave blank to keep same)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...registerProfile('password')}
                      className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                    />
                  </div>
                  {profileErrors.password && <span className="text-xs text-destructive mt-1 block">{profileErrors.password.message}</span>}
                </div>

                {profileSuccess && (
                  <div className="rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-500 font-semibold border border-emerald-500/25">
                    {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive font-semibold">
                    {profileError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/95 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {profileSubmitting ? 'Saving Changes...' : 'Save Settings'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="flex flex-col gap-6">
              
              <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-3">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" /> Delivery Addresses
                  </h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add New Address
                  </button>
                </div>

                {addressSuccess && (
                  <div className="rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-500 font-semibold mb-4 border border-emerald-500/20">
                    {addressSuccess}
                  </div>
                )}
                {addressError && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive font-semibold mb-4 border border-destructive/20">
                    {addressError}
                  </div>
                )}

                {profile.addresses?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">You haven't saved any addresses yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className="flex flex-col justify-between p-4 rounded-xl border border-border bg-card relative shadow-sm hover:shadow-md transition-shadow text-xs text-muted-foreground leading-relaxed bg-card"
                      >
                        <button
                          onClick={() => handleRemoveAddress(addr._id)}
                          className="absolute right-4 top-4 rounded-full border border-border p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all cursor-pointer"
                          title="Remove Address"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        <div className="pr-8 mb-4">
                          <span className="font-bold text-foreground text-sm flex items-center gap-1 mb-1.5">
                            Address {addr.isDefault && <span className="bg-primary/10 text-primary text-[9px] font-bold rounded px-1.5 py-0.5">DEFAULT</span>}
                          </span>
                          <span>{addr.street}</span><br />
                          <span>{addr.city}, {addr.state} {addr.zip}</span><br />
                          <span>{addr.country}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {showAddressForm && (
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm max-w-lg">
                  <h3 className="font-bold text-foreground text-sm mb-4 border-b border-border pb-3">New Address Details</h3>
                  
                  <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Street Address</label>
                      <input
                        type="text"
                        placeholder="123 Main St, Apt 4B"
                        {...registerAddress('street')}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                      />
                      {addressErrors.street && <span className="text-xs text-destructive mt-1 block">{addressErrors.street.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">City</label>
                        <input
                          type="text"
                          placeholder="New York"
                          {...registerAddress('city')}
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                        />
                        {addressErrors.city && <span className="text-xs text-destructive mt-1 block">{addressErrors.city.message}</span>}
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">State / Province</label>
                        <input
                          type="text"
                          placeholder="NY"
                          {...registerAddress('state')}
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                        />
                        {addressErrors.state && <span className="text-xs text-destructive mt-1 block">{addressErrors.state.message}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">ZIP / Postal Code</label>
                        <input
                          type="text"
                          placeholder="10001"
                          {...registerAddress('zip')}
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                        />
                        {addressErrors.zip && <span className="text-xs text-destructive mt-1 block">{addressErrors.zip.message}</span>}
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Country</label>
                        <input
                          type="text"
                          placeholder="USA"
                          {...registerAddress('country')}
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none text-foreground"
                        />
                        {addressErrors.country && <span className="text-xs text-destructive mt-1 block">{addressErrors.country.message}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        {...registerAddress('isDefault')}
                        className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                      />
                      <label htmlFor="isDefault" className="text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                        Set as default shipping address
                      </label>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button
                        type="submit"
                        disabled={addressSubmitting}
                        className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/95 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {addressSubmitting ? 'Saving...' : 'Add Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { resetAddress(); setShowAddressForm(false); }}
                        className="rounded-lg border border-border bg-card px-6 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
