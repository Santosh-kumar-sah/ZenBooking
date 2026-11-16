import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Copy, ExternalLink, Check, User, Store, Lock, Globe } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { getMe, updateMe } from '../../api/auth.api.js';
import { sendChatMessage } from '../../api/ai.api.js';
import { Button, Card, Input } from '../../components/ui/index.js';
import { useAuthStore } from '../../store/authStore.js';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  timezone: z.string().optional()
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm your new password')
}).refine((values) => values.newPassword === values.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

const timezones = ['UTC', 'Asia/Kolkata', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Europe/Paris', 'Asia/Dubai'];
const businessTypes = ['Salon', 'Barbershop', 'Clinic', 'Spa', 'Fitness & Wellness', 'Other'];

const SettingsPage = () => {
  const owner = useAuthStore((state) => state.owner);
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateOwnerLocal = useAuthStore((state) => state.updateOwner);
  const [copied, setCopied] = useState(false);

  const profileDefaults = useMemo(() => ({
    name: owner?.name || '',
    phone: owner?.phone || '',
    timezone: owner?.timezone || 'UTC'
  }), [owner]);

  const businessDefaults = useMemo(() => ({
    businessName: owner?.businessName || '',
    businessType: owner?.businessType || 'Salon',
    businessDescription: owner?.businessDescription || ''
  }), [owner]);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profileDefaults
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
  });

  const { register: registerBusiness, handleSubmit: handleBusinessSubmit, setValue: setBusinessValue, watch: watchBusiness } = useForm({
    defaultValues: businessDefaults
  });

  useEffect(() => {
    resetProfile(profileDefaults);
    setBusinessValue('businessName', businessDefaults.businessName);
    setBusinessValue('businessType', businessDefaults.businessType);
    setBusinessValue('businessDescription', businessDefaults.businessDescription);
  }, [profileDefaults, businessDefaults, resetProfile, setBusinessValue]);

  const profileMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: async () => {
      const refreshed = await getMe();
      const nextOwner = refreshed?.data || refreshed?.owner || refreshed;
      setAuth({ token: useAuthStore.getState().token, refreshToken: useAuthStore.getState().refreshToken, owner: nextOwner });
      updateOwnerLocal(nextOwner || {});
      toast.success('Profile updated successfully');
    },
    onError: () => toast.error('Failed to update profile')
  });

  const businessMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      const updated = response?.data || response;
      updateOwnerLocal(updated || {});
      setBusinessValue('businessDescription', updated?.businessDescription || '');
      toast.success('Studio information updated');
    },
    onError: () => toast.error('Failed to save studio details')
  });

  const passwordMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      toast.success('Password updated successfully');
      resetPassword();
    },
    onError: () => toast.error('Failed to update password')
  });

  const regenerateBioMutation = useMutation({
    mutationFn: () => sendChatMessage({
      message: `Write a compelling, sophisticated 2-sentence studio description for ${owner?.businessName || 'my studio'}, specializing in ${owner?.businessType || 'hair and wellness'}. Return ONLY the 2 sentences in a warm, welcoming tone.`,
      ownerId: owner?._id,
      role: 'owner',
      conversationHistory: []
    }),
    onSuccess: (response) => {
      const reply = response?.data?.reply || response?.reply || '';
      setBusinessValue('businessDescription', reply);
      businessMutation.mutate({ ...owner, businessDescription: reply });
      toast.success('Studio description regenerated');
    },
    onError: () => toast.error('Could not generate description. Try again.')
  });

  const bookingLink = `${window.location.origin}/${owner?._id || ''}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    toast.success('Booking link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-atelier-500">Preferences</span>
        <h1 className="font-editorial text-2xl font-bold text-atelier-900 dark:text-white">
          Studio Settings & Profile
        </h1>
        <p className="mt-1 text-xs text-atelier-500">
          Manage your personal account, studio bio, public booking link, and password security.
        </p>
      </div>

      {/* Shareable Booking Link Card */}
      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Live Public Booking Link
            </span>
            <p className="mt-1 font-mono text-xs text-atelier-800 dark:text-atelier-200">
              {bookingLink}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={copyLink} className="text-xs gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy Link'}
            </Button>
            <a href={bookingLink} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="text-xs gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" /> View Live Page
              </Button>
            </a>
          </div>
        </div>
      </Card>

      {/* Studio Profile Details */}
      <Card className="p-6">
        <div className="mb-5 border-b border-atelier-100 pb-4 dark:border-atelier-800">
          <h2 className="font-editorial text-lg font-bold text-atelier-900 dark:text-white">
            Studio Information
          </h2>
          <p className="text-xs text-atelier-500">
            This information is shown to your clients on your public booking page.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleBusinessSubmit((values) => businessMutation.mutate(values))}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Business / Studio Name"
              placeholder="Atelier Lumière"
              leftIcon={<Store className="h-4 w-4" />}
              {...registerBusiness('businessName')}
            />

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-atelier-600 dark:text-atelier-400">
                Studio Category
              </label>
              <select
                {...registerBusiness('businessType')}
                className="w-full rounded-xl border border-atelier-200 bg-white px-3.5 py-2.5 text-sm text-atelier-900 focus:border-primary-500 focus:outline-none dark:border-atelier-700 dark:bg-atelier-800 dark:text-white"
              >
                {businessTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-atelier-600 dark:text-atelier-400">
                Studio Description / Bio
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-primary-600 dark:text-primary-400 gap-1.5"
                loading={regenerateBioMutation.isPending}
                onClick={() => regenerateBioMutation.mutate()}
              >
                <Sparkles className="h-3.5 w-3.5" /> Enhance with Studio Concierge
              </Button>
            </div>
            <textarea
              rows={3}
              {...registerBusiness('businessDescription')}
              placeholder="Describe your studio's services, atmosphere, and specialties..."
              className="w-full rounded-xl border border-atelier-200 bg-white p-3 text-xs text-atelier-900 focus:border-primary-500 focus:outline-none dark:border-atelier-700 dark:bg-atelier-800 dark:text-white leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="sm"
              loading={businessMutation.isPending}
              className="text-xs font-semibold"
            >
              Save Studio Information
            </Button>
          </div>
        </form>
      </Card>

      {/* Owner Account Details */}
      <Card className="p-6">
        <div className="mb-5 border-b border-atelier-100 pb-4 dark:border-atelier-800">
          <h2 className="font-editorial text-lg font-bold text-atelier-900 dark:text-white">
            Owner Profile
          </h2>
          <p className="text-xs text-atelier-500">
            Your personal contact details and regional timezone.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleProfileSubmit((values) => profileMutation.mutate(values))}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Owner Full Name"
              leftIcon={<User className="h-4 w-4" />}
              {...registerProfile('name')}
            />

            <Input
              label="Contact Phone"
              placeholder="+1 (555) 012-3456"
              {...registerProfile('phone')}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-atelier-600 dark:text-atelier-400">
              Studio Operating Timezone
            </label>
            <select
              {...registerProfile('timezone')}
              className="w-full rounded-xl border border-atelier-200 bg-white px-3.5 py-2.5 text-sm text-atelier-900 focus:border-primary-500 focus:outline-none dark:border-atelier-700 dark:bg-atelier-800 dark:text-white"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="sm"
              loading={profileMutation.isPending}
              className="text-xs font-semibold"
            >
              Save Owner Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Password & Security */}
      <Card className="p-6">
        <div className="mb-5 border-b border-atelier-100 pb-4 dark:border-atelier-800">
          <h2 className="font-editorial text-lg font-bold text-atelier-900 dark:text-white">
            Security & Credentials
          </h2>
          <p className="text-xs text-atelier-500">
            Update your studio access password.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handlePasswordSubmit((values) => passwordMutation.mutate(values))}>
          <Input
            label="Current Password"
            type="password"
            leftIcon={<Lock className="h-4 w-4" />}
            {...registerPassword('currentPassword')}
            error={passwordErrors.currentPassword?.message}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 8 characters"
              leftIcon={<Lock className="h-4 w-4" />}
              {...registerPassword('newPassword')}
              error={passwordErrors.newPassword?.message}
            />

            <Input
              label="Confirm New Password"
              type="password"
              leftIcon={<Lock className="h-4 w-4" />}
              {...registerPassword('confirmPassword')}
              error={passwordErrors.confirmPassword?.message}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="sm"
              loading={passwordMutation.isPending}
              className="text-xs font-semibold"
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export { SettingsPage };
