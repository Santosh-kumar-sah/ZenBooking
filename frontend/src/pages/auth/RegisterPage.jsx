import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Store, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { getMe, registerOwner } from '../../api/auth.api.js';
import { Button, Card, Input } from '../../components/ui/index.js';
import ThemeToggle from '../../components/layout/ThemeToggle.jsx';
import { ROUTES } from '../../constants/routes.js';
import { useAuthStore } from '../../store/authStore.js';

const schema = z.object({
  name: z.string().min(1, 'Your name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessName: z.string().min(1, 'Studio name is required'),
  businessType: z.string().min(1, 'Please select a business type')
});

const businessTypes = ['Salon', 'Barbershop', 'Clinic', 'Spa', 'Fitness & Wellness', 'Other'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateOwner = useAuthStore((state) => state.updateOwner);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { businessType: 'Salon' }
  });

  const registerMutation = useMutation({
    mutationFn: registerOwner,
    onSuccess: async (response) => {
      const token = response?.accessToken || response?.token || response?.data?.accessToken || response?.data?.token;
      if (!token) {
        toast.error('Something went wrong during registration');
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

      toast.success('Studio account created successfully!');
      navigate(ROUTES.DASHBOARD_HOME);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create studio account');
    }
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-atelier-50 px-4 py-12 dark:bg-atelier-950">
      <div className="fixed top-5 right-5 z-20">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-lg border border-atelier-200 bg-white p-8 shadow-card dark:border-atelier-800 dark:bg-atelier-900">
        <div className="mb-6 text-center space-y-2">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-atelier-900 font-editorial text-xl font-bold text-white dark:bg-white dark:text-atelier-950 mb-2">
            B
          </Link>
          <h1 className="font-editorial text-2xl font-bold tracking-tight text-atelier-900 dark:text-white">
            Create Your Studio
          </h1>
          <p className="text-xs text-atelier-500 dark:text-atelier-400">
            Set up your professional booking page in under two minutes.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit((values) => registerMutation.mutate(values))}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Your Full Name"
              placeholder="Jane Doe"
              leftIcon={<User className="h-4 w-4" />}
              {...register('name')}
              error={errors.name?.message}
            />

            <Input
              label="Business Name"
              placeholder="Atelier Lumière"
              leftIcon={<Store className="h-4 w-4" />}
              {...register('businessName')}
              error={errors.businessName?.message}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-atelier-600 dark:text-atelier-400">
              Studio Category
            </label>
            <select
              {...register('businessType')}
              className="w-full rounded-xl border border-atelier-200 bg-white px-3.5 py-2.5 text-sm text-atelier-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-atelier-700 dark:bg-atelier-800/90 dark:text-atelier-100"
            >
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.businessType?.message && (
              <p className="mt-1 text-xs text-red-500">{errors.businessType.message}</p>
            )}
          </div>

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
              label="Password (min. 8 characters)"
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
              loading={registerMutation.isPending}
            >
              Launch Studio Booking Page
            </Button>
          </div>
        </form>

        <div className="mt-6 border-t border-atelier-100 pt-5 text-center text-xs text-atelier-500 dark:border-atelier-800">
          <span>Already have an account? </span>
          <Link to={ROUTES.LOGIN} className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export { RegisterPage };
