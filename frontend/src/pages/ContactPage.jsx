import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';
import { PublicLayout } from '../components/layout/PublicLayout.jsx';
import { Button, Card, Input } from '../components/ui/index.js';
import { toast } from 'sonner';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  category: z.enum(['general', 'technical', 'billing', 'feature', 'bug'], {
    errorMap: () => ({ message: 'Please select a category' })
  }),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { category: 'general' }
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success('Your message has been sent. Our team will respond within 24 hours.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-atelier-50 text-atelier-900 dark:bg-atelier-950 dark:text-atelier-100 pt-20">
        {/* Hero Section */}
        <section className="py-16 text-center border-b border-atelier-200/80 dark:border-atelier-850">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Studio Support
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl font-bold tracking-tight text-atelier-900 dark:text-white">
              Get in Touch
            </h1>
            <p className="text-sm text-atelier-600 dark:text-atelier-400 leading-relaxed">
              Have questions about setting up your studio, scheduling workflows, or integrations? We're here to assist.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            {/* Info Cards */}
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-atelier-100 text-atelier-800 dark:bg-atelier-800 dark:text-atelier-200">
                    <Mail className="h-4 w-4 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-base font-bold text-atelier-900 dark:text-white">Email Us</h3>
                    <p className="text-xs text-atelier-600 dark:text-atelier-300 mt-0.5">support@bookai.studio</p>
                    <p className="text-[11px] text-atelier-400 mt-1">Direct support within 24 hours</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-atelier-100 text-atelier-800 dark:bg-atelier-800 dark:text-atelier-200">
                    <MessageCircle className="h-4 w-4 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-base font-bold text-atelier-900 dark:text-white">Studio Concierge</h3>
                    <p className="text-xs text-atelier-600 dark:text-atelier-300 mt-0.5">Available on all live public booking pages</p>
                    <p className="text-[11px] text-atelier-400 mt-1">Real-time availability answers</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-atelier-100 text-atelier-800 dark:bg-atelier-800 dark:text-atelier-200">
                    <MapPin className="h-4 w-4 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-base font-bold text-atelier-900 dark:text-white">Worldwide Support</h3>
                    <p className="text-xs text-atelier-600 dark:text-atelier-300 mt-0.5">Serving boutique studios and clinics globally</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="p-8">
              <h2 className="font-editorial text-xl font-bold text-atelier-900 dark:text-white">
                Send a Message
              </h2>
              <p className="mt-1 text-xs text-atelier-500">
                Fill in the details below and an atelier specialist will follow up with you.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Your Name *"
                    placeholder="Jane Doe"
                    {...register('fullName')}
                    error={errors.fullName?.message}
                  />

                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="jane@example.com"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Subject *"
                    placeholder="How do I set up recurring slots?"
                    {...register('subject')}
                    error={errors.subject?.message}
                  />

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-atelier-600 dark:text-atelier-400">
                      Topic Category
                    </label>
                    <select
                      {...register('category')}
                      className="w-full rounded-xl border border-atelier-200 bg-white px-3.5 py-2.5 text-xs text-atelier-900 focus:border-primary-500 focus:outline-none dark:border-atelier-700 dark:bg-atelier-800 dark:text-white"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Pricing & Plans</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Report an Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-atelier-600 dark:text-atelier-400">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    {...register('message')}
                    placeholder="Provide details about your question or inquiry..."
                    className="w-full rounded-xl border border-atelier-200 bg-white p-3.5 text-xs text-atelier-900 focus:border-primary-500 focus:outline-none dark:border-atelier-700 dark:bg-atelier-800 dark:text-white leading-relaxed"
                  />
                  {errors.message?.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="w-full sm:w-auto text-xs font-semibold gap-2"
                >
                  <Send className="h-3.5 w-3.5" /> Send Message
                </Button>
              </form>
            </Card>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export { ContactPage };
