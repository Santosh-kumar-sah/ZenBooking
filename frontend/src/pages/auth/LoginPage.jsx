import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { loginOwner, getMe } from '../../api/auth.api.js';
import { Button, Card, Input } from '../../components/ui/index.js';
import { ROUTES } from '../../constants/routes.js';
import { useAuthStore } from '../../store/authStore.js';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateOwner = useAuthStore((state) => state.updateOwner);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const loginMutation = useMutation({
    mutationFn: loginOwner,
    onSuccess: async (response) => {
      const token = response?.accessToken || response?.token || response?.data?.accessToken || response?.data?.token;
      if (!token) {
        toast.error('Invalid email or password');
        return;
      }

      setAuth({ token, refreshToken: null, owner: null });
      try {
        const me = await getMe();
        const owner = me?.data || me?.owner || me;
        setAuth({ token, refreshToken: null, owner });
        updateOwner(owner || {});
      } catch {
        setAuth({ token, refreshToken: null, owner: null });
      }

      navigate(ROUTES.DASHBOARD_HOME);
    },
    onError: () => {
      toast.error('Invalid email or password');
    }
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-950 px-4 py-12">
      <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-primary-500/20 blur-3xl animate-blob" />
      <div className="absolute right-[-5%] top-[15%] h-[28rem] w-[28rem] rounded-full bg-accent-500/20 blur-3xl animate-blob [animation-delay:2s]" />

      <Card className="relative z-10 w-full max-w-md rounded-3xl p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-xl font-black text-white">BA</div>
          <h1 className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-3xl font-black text-transparent">BookAI</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to your dashboard</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
          <Input label="Email" type="email" placeholder="you@example.com" leftIcon={<Mail className="h-4 w-4" />} {...register('email')} error={errors.email?.message} />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={<button type="button" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" className="h-4 w-4 rounded bg-white/5" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <a href="#" className="text-sm text-primary-300">Forgot password?</a>
          </div>

          <Button type="submit" className="w-full" loading={loginMutation.isPending}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account? <Link to={ROUTES.REGISTER} className="font-semibold text-primary-400">Register here</Link>
        </p>
      </Card>
    </div>
  );
};

export { LoginPage };