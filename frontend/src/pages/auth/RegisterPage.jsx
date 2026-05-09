import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { BriefcaseBusiness, Mail, Lock, UserRound, Store, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { getMe, registerOwner } from '../../api/auth.api.js';
import { Button, Card, Input } from '../../components/ui/index.js';
import { ROUTES } from '../../constants/routes.js';
import { useAuthStore } from '../../store/authStore.js';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.string().min(1, 'Business type is required')
});

const businessTypes = ['Salon', 'Barbershop', 'Clinic', 'Spa', 'Fitness', 'Other'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateOwner = useAuthStore((state) => state.updateOwner);
  const [generating, setGenerating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const registerMutation = useMutation({
    mutationFn: registerOwner,
    onSuccess: async (response) => {
      const token = response?.accessToken || response?.token || response?.data?.accessToken || response?.data?.token;
      if (!token) {
        toast.error('Something went wrong');
        return;
      }

      setGenerating(true);
      setAuth({ token, refreshToken: null, owner: null });
      try {
        const me = await getMe();
        const owner = me?.data || me?.owner || me;
        setAuth({ token, refreshToken: null, owner });
        updateOwner(owner || {});
      } catch {
        setAuth({ token, refreshToken: null, owner: null });
      }

      window.setTimeout(() => {
        setGenerating(false);
        toast.success('Welcome! Your AI booking page is ready 🎉');
        navigate(ROUTES.DASHBOARD_HOME);
      }, 1200);
    },
    onError: (error) => {
      setGenerating(false);
      toast.error(error?.response?.data?.message || 'Failed to register');
    }
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-12 dark:bg-surface-950">
      <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-primary-500/20 blur-3xl animate-blob" />
      <div className="absolute right-[-5%] top-[15%] h-[28rem] w-[28rem] rounded-full bg-accent-500/20 blur-3xl animate-blob [animation-delay:2s]" />

      <Card className="relative z-10 w-full max-w-md rounded-3xl p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-xl font-black text-white">BA</div>
          <h1 className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-3xl font-black text-transparent">Create account</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Launch your AI booking page in minutes</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit((values) => registerMutation.mutate(values))}>
          <Input label="Name" placeholder="Your name" leftIcon={<UserRound className="h-4 w-4" />} {...register('name')} error={errors.name?.message} />
          <Input label="Email" type="email" placeholder="you@example.com" leftIcon={<Mail className="h-4 w-4" />} {...register('email')} error={errors.email?.message} />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimum 8 characters"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={<button type="button" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
            {...register('password')}
            error={errors.password?.message}
          />
          <Input label="Business name" placeholder="Glow Salon" leftIcon={<Store className="h-4 w-4" />} {...register('businessName')} error={errors.businessName?.message} />

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Business type</span>
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 dark:border-white/10 dark:bg-white/5">
              <BriefcaseBusiness className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <select className="w-full bg-transparent py-3 text-slate-900 outline-none dark:text-white" {...register('businessType')}>
                <option value="" className="bg-surface-900">Select one</option>
                {businessTypes.map((businessType) => <option key={businessType} value={businessType} className="bg-surface-900">{businessType}</option>)}
              </select>
            </div>
            {errors.businessType?.message ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.businessType.message}</p> : null}
          </label>

          {!generating ? (
            <Button type="submit" className="w-full" loading={registerMutation.isPending}>
              Create account
            </Button>
          ) : (
            <div className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <span>✨ AI is generating your business page</span>
              <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity }} className="inline-flex gap-1">
                <span>•</span><span>•</span><span>•</span>
              </motion.span>
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account? <Link to={ROUTES.LOGIN} className="font-semibold text-primary-400">Sign in</Link>
        </p>
      </Card>
    </div>
  );
};

export { RegisterPage };