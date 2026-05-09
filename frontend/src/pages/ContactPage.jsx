import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';
import { PublicLayout } from '../components/layout/PublicLayout.jsx';
import { Button, Card, Input, Spinner } from '../components/ui/index.js';
import { cn } from '../utils/cn.js';
import { toast } from 'sonner';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  category: z.enum(['general', 'technical', 'billing', 'feature', 'bug'], {
    errorMap: () => ({ message: 'Please select a category' })
  }),
  message: z.string().min(20, 'Message must be at least 20 characters')
});

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Your message has been sent ✅ We will get back to you within 24 hours');
      setIsSuccess(true);
      reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-surface-950 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute left-[-10%] top-[-15%] h-96 w-96 rounded-full bg-primary-500/20 blur-3xl animate-blob" />
          <div className="absolute right-[-8%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-accent-500/20 blur-3xl animate-blob" />

          <div className="mx-auto max-w-4xl px-4 text-center py-12 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              We would love to hear from you, whether you have a question about features, pricing, or anything else our team is ready to answer
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Info Cards */}
            <div className="space-y-6">
              {/* Email Card */}
              <Card className="border border-white/10 bg-white/5">
                <div className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white flex-shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email Us</h3>
                    <p className="mt-2 text-slate-300">support@zenbooking.app</p>
                    <p className="text-sm text-slate-400">We reply within 24 hours</p>
                  </div>
                </div>
              </Card>

              {/* Chat Card */}
              <Card className="border border-white/10 bg-white/5">
                <div className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white flex-shrink-0">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Live Chat</h3>
                    <p className="mt-2 text-slate-300">Use the chat widget on any booking page</p>
                    <p className="text-sm text-slate-400">Available 24/7</p>
                  </div>
                </div>
              </Card>

              {/* Location Card */}
              <Card className="border border-white/10 bg-white/5">
                <div className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-white flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Based In</h3>
                    <p className="mt-2 text-slate-300">India</p>
                    <p className="text-sm text-slate-400">Serving businesses worldwide</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mb-4"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600">
                      <motion.svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    </div>
                  </motion.div>
                  <p className="text-center text-white font-semibold">Message sent successfully</p>
                  <p className="mt-2 text-center text-slate-400">We will get back to you soon</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Input
                      label="Full Name"
                      placeholder="Your name"
                      {...register('fullName')}
                      error={errors.fullName?.message}
                    />
                  </div>

                  <div>
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="your@email.com"
                      {...register('email')}
                      error={errors.email?.message}
                    />
                  </div>

                  <div>
                    <Input
                      label="Subject"
                      placeholder="What is this about?"
                      {...register('subject')}
                      error={errors.subject?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
                    <select
                      {...register('category')}
                      className={cn(
                        'w-full rounded-xl border px-4 py-3 bg-white/5 text-white placeholder:text-slate-400',
                        'border-white/10 transition-colors duration-200',
                        'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                        'dark:bg-white/5 dark:border-white/10 dark:text-white',
                        errors.category && 'border-red-500/50'
                      )}
                    >
                      <option value="">Select a category</option>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us more..."
                      {...register('message')}
                      className={cn(
                        'w-full rounded-xl border px-4 py-3 bg-white/5 text-white placeholder:text-slate-400',
                        'border-white/10 transition-colors duration-200',
                        'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                        'dark:bg-white/5 dark:border-white/10 dark:text-white',
                        'resize-none',
                        errors.message && 'border-red-500/50'
                      )}
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export { ContactPage };
