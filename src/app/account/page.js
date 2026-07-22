'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { profileSchema, addressSchema } from '../../validators/schemas';
import { User, MapPin, Lock, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

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
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8 font-sans">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded w-full max-w-lg mt-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 font-sans">
      
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block">CUSTOMER HOUSE</span>
        <h1 className="text-4xl font-serif text-foreground font-light tracking-wide">My Account</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 bg-card border border-border/40 p-5 rounded-xs h-fit">
          <div className="border-b border-border/40 pb-4 mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground font-sans">Menu Panel</h2>
            <p className="text-xs text-muted-foreground mt-1 truncate">{profile.name}</p>
          </div>

          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest py-2.5 px-3.5 rounded-xs transition-colors cursor-pointer w-full text-left shrink-0 ${activeTab === 'profile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <User className="h-4 w-4 stroke-[1.5]" /> Personal Profile
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest py-2.5 px-3.5 rounded-xs transition-colors cursor-pointer w-full text-left shrink-0 ${activeTab === 'addresses' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <MapPin className="h-4 w-4 stroke-[1.5]" /> Delivery Addresses
            </button>
          </div>
        </aside>

        {/* Content area */}
        <div className="flex-1">
          
          {activeTab === 'profile' && (
            <div className="bg-card border border-border/40 p-6 rounded-xs max-w-lg">
              <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-6 flex items-center gap-2 border-b border-border/40 pb-4">
                <User className="h-4.5 w-4.5 text-accent stroke-[1.5]" /> Profile Details
              </h2>

              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Full Name</label>
                  <input
                    type="text"
                    {...registerProfile('name')}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground"
                  />
                  {profileErrors.name && <span className="text-xs text-destructive mt-1.5 block">{profileErrors.name.message}</span>}
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Email Address</label>
                  <input
                    type="email"
                    {...registerProfile('email')}
                    className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground"
                  />
                  {profileErrors.email && <span className="text-xs text-destructive mt-1.5 block">{profileErrors.email.message}</span>}
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Change Password (Leave blank to keep current)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <Lock className="h-4 w-4 stroke-[1.5]" />
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...registerProfile('password')}
                      className="w-full rounded-xs border border-border bg-background pl-9 pr-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground"
                    />
                  </div>
                  {profileErrors.password && <span className="text-xs text-destructive mt-1.5 block">{profileErrors.password.message}</span>}
                </div>

                {profileSuccess && (
                  <div className="rounded-xs bg-emerald-500/5 p-3 text-xs text-emerald-600 dark:text-emerald-500 font-semibold border border-emerald-500/20">
                    {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="rounded-xs bg-destructive/5 p-3 text-xs text-destructive font-semibold border border-destructive/20">
                    {profileError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={profileSubmitting}
                >
                  {profileSubmitting ? 'Saving Settings...' : 'Save Settings'}
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="flex flex-col gap-6">
              
              <div className="bg-card border border-border/40 p-6 rounded-xs">
                <div className="flex justify-between items-center mb-6 border-b border-border/40 pb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                    <MapPin className="h-4.5 w-4.5 text-accent stroke-[1.5]" /> Saved Addresses
                  </h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:underline cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Address
                  </button>
                </div>

                {addressSuccess && (
                  <div className="rounded-xs bg-emerald-500/5 p-3 text-xs text-emerald-600 dark:text-emerald-500 font-semibold mb-4 border border-emerald-500/20">
                    {addressSuccess}
                  </div>
                )}
                {addressError && (
                  <div className="rounded-xs bg-destructive/5 p-3 text-xs text-destructive font-semibold mb-4 border border-destructive/20">
                    {addressError}
                  </div>
                )}

                {profile.addresses?.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">You haven&apos;t saved any delivery addresses yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className="flex flex-col justify-between p-4 rounded-xs border border-border/40 bg-card relative shadow-xs hover:shadow-sm transition-all duration-300 text-xs text-muted-foreground leading-relaxed bg-card"
                      >
                        <button
                          onClick={() => handleRemoveAddress(addr._id)}
                          className="absolute right-4 top-4 rounded-full border border-border p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all cursor-pointer"
                          title="Remove Address"
                        >
                          <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>

                        <div className="pr-8 mb-2">
                          <span className="font-bold text-foreground text-xs flex items-center gap-1 mb-1.5 uppercase tracking-wider">
                            Address {addr.isDefault && <span className="bg-accent text-accent-foreground text-[8px] font-extrabold rounded-xs px-1.5 py-0.5 tracking-widest">DEFAULT</span>}
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
                <div className="bg-card border border-border/40 p-6 rounded-xs max-w-lg">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4 border-b border-border/40 pb-4">New Address Details</h3>
                  
                  <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="space-y-4">
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Street Address</label>
                      <input
                        type="text"
                        placeholder="123 Main St, Apt 4B"
                        {...registerAddress('street')}
                        className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                      />
                      {addressErrors.street && <span className="text-xs text-destructive mt-1.5 block">{addressErrors.street.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">City</label>
                        <input
                          type="text"
                          placeholder="New York"
                          {...registerAddress('city')}
                          className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                        />
                        {addressErrors.city && <span className="text-xs text-destructive mt-1.5 block">{addressErrors.city.message}</span>}
                      </div>

                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">State / Province</label>
                        <input
                          type="text"
                          placeholder="NY"
                          {...registerAddress('state')}
                          className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                        />
                        {addressErrors.state && <span className="text-xs text-destructive mt-1.5 block">{addressErrors.state.message}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">ZIP / Postal Code</label>
                        <input
                          type="text"
                          placeholder="10001"
                          {...registerAddress('zip')}
                          className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                        />
                        {addressErrors.zip && <span className="text-xs text-destructive mt-1.5 block">{addressErrors.zip.message}</span>}
                      </div>

                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Country</label>
                        <input
                          type="text"
                          placeholder="USA"
                          {...registerAddress('country')}
                          className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                        />
                        {addressErrors.country && <span className="text-xs text-destructive mt-1.5 block">{addressErrors.country.message}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        id="isDefault"
                        {...registerAddress('isDefault')}
                        className="rounded border-border/80 text-accent focus:ring-accent cursor-pointer"
                      />
                      <label htmlFor="isDefault" className="text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                        Set as default shipping address
                      </label>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <Button
                        type="submit"
                        disabled={addressSubmitting}
                        size="sm"
                      >
                        {addressSubmitting ? 'Saving...' : 'Add Address'}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => { resetAddress(); setShowAddressForm(false); }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
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
