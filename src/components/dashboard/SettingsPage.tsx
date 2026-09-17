import React, { useState, useEffect } from 'react';
import { Settings, User, LogOut, CheckCircle, Loader2, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../lib/auth';

export const SettingsPage: React.FC = () => {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    phone: profile?.phone || '',
    country: profile?.country || '',
    currency: profile?.currency || 'USD',
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        currency: profile.currency || 'USD',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setStatusMessage(null);

    const { error } = await updateProfile(user.id, {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      country: formData.country,
      currency: formData.currency,
    });

    setSaving(false);

    if (error) {
      alert(`Error updating settings: ${error.message}`);
    } else {
      setStatusMessage('Profile preferences updated successfully.');
      await refreshProfile();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/invest/login';
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2">
          <Settings className="w-7 h-7 text-red-500" />
          Account <span className="text-white/40">Settings</span>
        </h1>
        <p className="text-xs text-white/50 font-light mt-1">
          Manage your account profile details, preferences, and session state.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* Account Info Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <User className="w-5 h-5 text-red-500" />
          <h2 className="text-base font-bold text-white tracking-tight">Personal Information</h2>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-white/40 mb-1">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={user?.email || ''}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/50 cursor-not-allowed outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500 transition-colors"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500 transition-colors"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500 transition-colors"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
              Preferred Currency
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Settings...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Preferences
            </>
          )}
        </button>
      </form>

      {/* Session Actions Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Account Session</h3>
          <p className="text-xs text-white/40 mt-0.5">Sign out of your account on this browser session.</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
