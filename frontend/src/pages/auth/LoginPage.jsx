import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { loginOwner, getMe } from '../../api/auth.api.js';
import { Button, Card, Input } from '../../components/ui/index.js';
import ThemeToggle from '../../components/layout/ThemeToggle.jsx';
import { ROUTES } from '../../constants/routes.js';
import { useAuthStore } from '../../store/authStore.js';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateOwner = useAuthStore((state) => state.updateOwner);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [showPassword, setShowPassword] = useState(false);

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

      toast.success('Signed in successfully');
      navigate(ROUTES.DASHBOARD_HOME);
    },
    onError: () => {
      toast.error('Invalid email or password. Please try again.');
    }
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-atelier-50 px-4 py-12 dark:bg-atelier-950">
      <div className="fixed top-5 right-5 z-20">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md border border-atelier-200 bg-white p-8 shadow-card dark:border-atelier-800 dark:bg-atelier-900">
        <div className="mb-8 text-center space-y-2">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-atelier-900 font-editorial text-xl font-bold text-white dark:bg-white dark:text-atelier-950 mb-2">
            B
          </Link>
          <h1 className="font-editorial text-2xl font-bold tracking-tight text-atelier-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-xs text-atelier-500 dark:text-atelier-400">
            Sign in to access your studio appointments and schedule.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
          <Input
            label="Email Address"
            type="email"
            placeholder="owner@yourstudio.com"
            leftIcon={<Mail className="h-4 w-4" />}
            {...register('email')}
            error={errors.email?.message}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-atelier-400 hover:text-atelier-600 dark:hover:text-atelier-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              {...register('password')}
              error={errors.password?.message}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold"
              loading={loginMutation.isPending}
            >
              Sign In to Studio
            </Button>
          </div>
        </form>

        <div className="mt-6 border-t border-atelier-100 pt-5 text-center text-xs text-atelier-500 dark:border-atelier-800">
          <span>New to BookAI? </span>
          <Link to={ROUTES.REGISTER} className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
            Create a studio account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export { LoginPage };
