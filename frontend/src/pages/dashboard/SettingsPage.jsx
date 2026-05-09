import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Link2, ExternalLink } from 'lucide-react';
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

const timezones = ['UTC', 'Asia/Kolkata', 'Europe/London', 'America/New_York', 'America/Los_Angeles'];

const SettingsPage = () => {
  const owner = useAuthStore((state) => state.owner);
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateOwnerLocal = useAuthStore((state) => state.updateOwner);
  const [promptRole, setPromptRole] = useState('owner');
  const [promptText, setPromptText] = useState('');
  const [promptReply, setPromptReply] = useState('');

  const profileDefaults = useMemo(() => ({
    name: owner?.name || '',
    phone: owner?.phone || '',
    timezone: owner?.timezone || 'UTC'
  }), [owner]);

  const businessDefaults = useMemo(() => ({
    businessName: owner?.businessName || '',
    businessType: owner?.businessType || '',
    businessDescription: owner?.businessDescription || ''
  }), [owner]);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm({ resolver: zodResolver(profileSchema), defaultValues: profileDefaults });
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' } });
  const { register: registerBusiness, handleSubmit: handleBusinessSubmit, setValue: setBusinessValue } = useForm({ defaultValues: businessDefaults });

  useEffect(() => {
    resetProfile(profileDefaults);
    setBusinessValue('businessDescription', businessDefaults.businessDescription);
  }, [profileDefaults, businessDefaults.businessDescription, resetProfile, setBusinessValue]);

  const profileMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: async () => {
      const refreshed = await getMe();
      const nextOwner = refreshed?.data || refreshed?.owner || refreshed;
      setAuth({ token: useAuthStore.getState().token, refreshToken: useAuthStore.getState().refreshToken, owner: nextOwner });
      updateOwnerLocal(nextOwner || {});
      toast.success('Settings saved');
    },
    onError: () => toast.error('Failed to save settings')
  });

  const businessMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      const updated = response?.data || response;
      updateOwnerLocal(updated || {});
      setBusinessValue('businessDescription', updated?.businessDescription || '');
      toast.success('Business info saved');
    },
    onError: () => toast.error('Failed to save business info')
  });

  const passwordMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      toast.success('Password updated');
      resetPassword();
    },
    onError: () => toast.error('Failed to update password')
  });

  const regenerateMutation = useMutation({
    mutationFn: () => sendChatMessage({ message: `Regenerate the business description for ${owner?.businessName || 'my business'} in a polished, friendly tone.`, ownerId: owner?._id, role: 'owner', conversationHistory: [] }),
    onSuccess: (response) => {
      const reply = response?.data?.reply || response?.reply || '';
      setBusinessValue('businessDescription', reply);
      businessMutation.mutate({ ...owner, businessDescription: reply });
      toast.success('Business description updated');
    },
    onError: () => toast.error('Could not generate description')
  });

  const promptMutation = useMutation({
    mutationFn: () => sendChatMessage({
      message: promptText,
      ownerId: owner?._id,
      role: promptRole,
      conversationHistory: []
    }),
    onSuccess: (response) => {
      const reply = response?.data?.reply || response?.reply || '';
      setPromptReply(reply);
      toast.success('AI response ready');
    },
    onError: () => toast.error('Could not generate AI response')
  });

  const bookingLink = `${window.location.origin}/${owner?._id || ''}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(bookingLink);
    toast.success('Link copied!');
  };

  const openPage = () => window.open(bookingLink, '_blank', 'noopener,noreferrer');

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">AI Prompt Panel</h2>
            <p className="text-sm text-slate-400">Type a prompt and choose whether the AI should answer as customer support or owner support.</p>
          </div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setPromptRole('owner')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${promptRole === 'owner' ? 'bg-primary-500 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Owner
            </button>
            <button
              type="button"
              onClick={() => setPromptRole('customer')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${promptRole === 'customer' ? 'bg-primary-500 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Customer
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-400">Prompt</span>
            <textarea
              rows={4}
              value={promptText}
              onChange={(event) => setPromptText(event.target.value)}
              placeholder={promptRole === 'owner' ? 'Example: Write a short reply for a customer asking about weekend availability.' : 'Example: Explain the public booking process in simple words.'}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary-500"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              loading={promptMutation.isPending}
              disabled={!promptText.trim()}
              onClick={() => promptMutation.mutate()}
            >
              <Sparkles className="h-4 w-4" />
              Ask AI
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPromptText('');
                setPromptReply('');
              }}
            >
              Clear
            </Button>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">AI response</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
              {promptReply || 'Your response will appear here.'}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-xl font-semibold text-white">Profile</h2>
        <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleProfileSubmit((values) => profileMutation.mutate({ ...owner, ...values }))}>
          <Input label="Name" {...registerProfile('name')} />
          <Input label="Phone" {...registerProfile('phone')} />
          <label className="block">
            <span className="mb-1 block text-sm text-slate-400">Timezone</span>
            <select className="h-[50px] w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none" {...registerProfile('timezone')}>
              {timezones.map((timezone) => <option key={timezone} value={timezone} className="bg-surface-900">{timezone}</option>)}
            </select>
          </label>
          <div className="md:col-span-2">
            <Button type="submit" loading={profileMutation.isPending}>Save changes</Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="text-xl font-semibold text-white">Business Info</h2>
        <div className="mt-5 grid gap-4">
          <Input label="Business name" value={businessDefaults.businessName} readOnly />
          <Input label="Business type" value={businessDefaults.businessType} readOnly />
          <label className="block">
            <span className="mb-1 block text-sm text-slate-400">Business description</span>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary-500"
              {...registerBusiness('businessDescription')}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleBusinessSubmit((values) => businessMutation.mutate({ ...owner, ...values }))}>
              Save description
            </Button>
            <Button variant="secondary" loading={regenerateMutation.isPending} onClick={() => regenerateMutation.mutate()}>
              <Sparkles className="h-4 w-4" /> Regenerate AI Description
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Share Booking Link</h2>
            <p className="text-sm text-slate-400">Your public page customers can use to book appointments.</p>
          </div>
          <Link2 className="h-5 w-5 text-primary-400" />
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input value={bookingLink} readOnly />
          <Button onClick={copyLink}>Copy Link</Button>
          <Button variant="secondary" onClick={openPage}><ExternalLink className="h-4 w-4" /> Open Page</Button>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-xl font-semibold text-white">Change Password</h2>
        <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handlePasswordSubmit((values) => passwordMutation.mutate({ ...values }))}>
          <Input label="Current password" type="password" {...registerPassword('currentPassword')} />
          <Input label="New password" type="password" {...registerPassword('newPassword')} />
          <Input label="Confirm password" type="password" {...registerPassword('confirmPassword')} />
          <div className="md:col-span-2">
            <Button type="submit" loading={passwordMutation.isPending}>Update Password</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export { SettingsPage };