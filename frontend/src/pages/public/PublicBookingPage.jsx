import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Check, ChevronRight, User, Phone, Mail, ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';
import { useNavigate, useParams, Navigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { getBusinessPage, createBooking } from '../../api/public.api.js';
import { BookingCalendar, SlotPicker } from '../../components/booking/index.js';
import { ChatWidget } from '../../components/chat/index.js';
import { PublicLayout } from '../../components/layout/PublicLayout.jsx';
import { Button, Card, Input, Skeleton } from '../../components/ui/index.js';
import { formatDate, formatTime } from '../../utils/dateUtils.js';
import { routes } from '../../constants/routes.js';
import { toast } from 'sonner';

const schema = z.object({
  customerName: z.string().min(2, 'Please enter your full name'),
  customerPhone: z.string().trim().optional().or(z.literal('')),
  customerEmail: z.string().trim().email('Please enter a valid email').optional().or(z.literal('')),
  bookingDate: z.string().min(1, 'Please select a date'),
  startTime: z.string().min(1, 'Please pick a start time'),
  endTime: z.string().min(1, 'Please pick an end time'),
  slotConfigId: z.string().min(1, 'Missing slot ID')
}).refine((data) => Boolean(data.customerPhone?.trim()) || Boolean(data.customerEmail?.trim()), {
  message: 'Please provide either a phone number or an email address',
  path: ['customerPhone']
});

const steps = [
  { num: 1, title: 'Date' },
  { num: 2, title: 'Time' },
  { num: 3, title: 'Details' }
];

const PublicBookingPage = () => {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const businessQuery = useQuery({
    queryKey: ['public-business', ownerId],
    queryFn: () => getBusinessPage(ownerId),
    enabled: Boolean(ownerId)
  });

  const business = businessQuery.data?.data?.owner;
  const availableSlots = businessQuery.data?.data?.availableSlots || businessQuery.data?.data?.slots || [];

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (_, variables) => {
      navigate(`/${ownerId}/confirm`, {
        state: {
          customerName: variables.customerName,
          businessName: business?.businessName,
          bookingDate: variables.bookingDate,
          startTime: variables.startTime,
          endTime: variables.endTime
        }
      });
    },
    onError: (error) => {
      if (error?.response?.status === 409) {
        toast.error('This appointment was just booked by someone else. Please pick an alternative time.');
        setStep(2);
        setSelectedSlot(null);
        return;
      }
      toast.error('Could not complete appointment. Please check your network and try again.');
    }
  });

  const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { customerName: '', customerPhone: '', customerEmail: '', bookingDate: '', startTime: '', endTime: '', slotConfigId: '' }
  });

  const filteredSlots = useMemo(() => {
    if (!selectedDate) return [];
    return availableSlots.filter(
      (slot) => new Date(slot.date).toDateString() === new Date(selectedDate).toDateString()
    );
  }, [availableSlots, selectedDate]);

  if (!ownerId) return <Navigate to={routes.login} replace />;

  if (businessQuery.isLoading) {
    return (
      <div className="min-h-screen bg-atelier-50 p-6 dark:bg-atelier-950">
        <div className="mx-auto max-w-5xl space-y-6 pt-12">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (businessQuery.isError || !business) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-atelier-50 px-4 text-center dark:bg-atelier-950">
        <Card className="max-w-md p-8">
          <h2 className="font-editorial text-2xl font-bold text-atelier-900 dark:text-white">Studio Not Found</h2>
          <p className="mt-2 text-sm text-atelier-600 dark:text-atelier-400">
            This booking link may be expired or invalid. Please check the URL and try again.
          </p>
          <div className="mt-6">
            <Link to={routes.landing}>
              <Button variant="secondary">Go to Homepage</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const handleDateSelect = (date) => {
    const isoString = new Date(date).toISOString();
    setSelectedDate(isoString);
    setValue('bookingDate', isoString);
    setSelectedSlot(null);
    setValue('startTime', '');
    setValue('endTime', '');
    setValue('slotConfigId', '');
    setStep(2);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setValue('slotConfigId', slot.slotConfigId);
    setValue('startTime', slot.startTime);
    setValue('endTime', slot.endTime);
  };

  const handleProceedToDetails = async () => {
    const isValid = await trigger(['bookingDate', 'startTime', 'endTime', 'slotConfigId']);
    if (isValid) {
      setStep(3);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-atelier-50 text-atelier-900 dark:bg-atelier-950 dark:text-atelier-100">
        {/* Top Minimal Studio Navigation */}
        <header className="sticky top-0 z-30 border-b border-atelier-200/80 bg-white/90 backdrop-blur-md dark:border-atelier-800 dark:bg-atelier-900/90">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
            <Link to={routes.landing} className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 font-editorial text-sm font-bold text-white">
                {business.businessName.charAt(0)}
              </span>
              <span className="font-editorial text-lg font-bold tracking-tight text-atelier-900 dark:text-atelier-100">
                {business.businessName}
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-2.5 py-1 text-[11px] font-medium text-accent-700 dark:border-accent-800 dark:bg-accent-950/40 dark:text-accent-300">
                <ShieldCheck className="h-3 w-3" /> Verified Studio
              </span>
            </div>
          </div>
        </header>

        {/* Studio Hero Profile Banner */}
        <section className="border-b border-atelier-200/80 bg-atelier-100/50 py-10 dark:border-atelier-850 dark:bg-atelier-900/30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="space-y-3">
              <div className="inline-block text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                {business.businessType || 'Boutique Atelier'}
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-atelier-900 dark:text-white">
                {business.businessName}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-atelier-600 dark:text-atelier-300">
                {business.businessDescription || 'Schedule your upcoming appointment in a few effortless steps.'}
              </p>
            </div>
          </div>
        </section>

        {/* Step Progress Tracker */}
        <div className="border-b border-atelier-200/60 bg-white dark:border-atelier-800 dark:bg-atelier-900">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-6 sm:gap-10">
              {steps.map((s) => {
                const isCompleted = step > s.num;
                const isCurrent = step === s.num;
                return (
                  <button
                    key={s.num}
                    type="button"
                    disabled={s.num > step}
                    onClick={() => setStep(s.num)}
                    className="flex items-center gap-2 text-xs font-medium transition-colors select-none"
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-all ${
                        isCompleted
                          ? 'bg-accent-600 text-white'
                          : isCurrent
                          ? 'bg-primary-500 text-white'
                          : 'border border-atelier-300 text-atelier-400 dark:border-atelier-700'
                      }`}
                    >
                      {isCompleted ? <Check className="h-3 w-3" /> : s.num}
                    </span>
                    <span className={isCurrent ? 'font-semibold text-atelier-900 dark:text-white' : 'text-atelier-500'}>
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-1 text-xs font-medium text-atelier-500 hover:text-atelier-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}
          </div>
        </div>

        {/* Main Booking Content Grid */}
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
            {/* Step 1: Calendar View */}
            {step === 1 && (
              <div className="space-y-4">
                <BookingCalendar
                  availableSlots={availableSlots}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                />
              </div>
            )}

            {/* Step 2: Slot Selection */}
            {step === 2 && (
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="mb-5 flex items-center justify-between border-b border-atelier-100 pb-4 dark:border-atelier-800">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-atelier-500">Selected Date</span>
                      <h2 className="font-editorial text-xl font-bold text-atelier-900 dark:text-white">
                        {formatDate(selectedDate)}
                      </h2>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStep(1)}
                      className="text-xs"
                    >
                      Change Date
                    </Button>
                  </div>

                  <SlotPicker
                    slots={filteredSlots}
                    selectedSlot={selectedSlot?.slotConfigId || selectedSlot?.startTime}
                    onSlotSelect={handleSlotSelect}
                  />

                  <div className="mt-8 flex items-center justify-between border-t border-atelier-100 pt-5 dark:border-atelier-800">
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                      <ArrowLeft className="h-4 w-4" /> Choose Different Date
                    </Button>
                    <Button
                      disabled={!selectedSlot}
                      onClick={handleProceedToDetails}
                    >
                      Continue <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 3: Customer Details */}
            {step === 3 && (
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="mb-6">
                    <h2 className="font-editorial text-2xl font-bold text-atelier-900 dark:text-white">
                      Guest Information
                    </h2>
                    <p className="mt-1 text-xs text-atelier-500 dark:text-atelier-400">
                      Provide your contact details so the studio can confirm your appointment.
                    </p>
                  </div>

                  <form
                    className="space-y-4"
                    onSubmit={handleSubmit((values) => bookingMutation.mutate({ ownerId, ...values }))}
                  >
                    <Input
                      label="Full Name *"
                      placeholder="Jane Doe"
                      leftIcon={<User className="h-4 w-4" />}
                      {...register('customerName')}
                      error={errors.customerName?.message}
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+1 (555) 012-3456"
                      leftIcon={<Phone className="h-4 w-4" />}
                      {...register('customerPhone')}
                      error={errors.customerPhone?.message}
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="jane@example.com"
                      leftIcon={<Mail className="h-4 w-4" />}
                      {...register('customerEmail')}
                      error={errors.customerEmail?.message}
                    />

                    <p className="text-[11px] text-atelier-500 dark:text-atelier-400">
                      * We will send you an appointment confirmation and a friendly reminder before your visit.
                    </p>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-12 text-sm font-semibold"
                        loading={bookingMutation.isPending}
                      >
                        Confirm Appointment
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            )}

            {/* Right Column: Sticky Tactile Summary Ticket */}
            <div className="sticky top-20 space-y-4">
              <Card className="overflow-hidden border border-atelier-200 bg-white p-0 shadow-tactile dark:border-atelier-800 dark:bg-atelier-900">
                <div className="border-b border-atelier-200 bg-atelier-50/60 px-5 py-4 dark:border-atelier-800 dark:bg-atelier-850">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-atelier-500 dark:text-atelier-400">
                    Appointment Summary
                  </span>
                  <h3 className="font-editorial text-lg font-bold text-atelier-900 dark:text-white">
                    {business.businessName}
                  </h3>
                </div>

                <div className="space-y-3.5 p-5 text-xs text-atelier-700 dark:text-atelier-300">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 text-primary-500 shrink-0" />
                    <div>
                      <p className="font-medium text-atelier-900 dark:text-atelier-100">
                        {selectedDate ? formatDate(selectedDate) : 'Select a date'}
                      </p>
                      <p className="text-[11px] text-atelier-500">Date</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-primary-500 shrink-0" />
                    <div>
                      <p className="font-medium text-atelier-900 dark:text-atelier-100">
                        {selectedSlot ? `${formatTime(selectedSlot.startTime)} – ${formatTime(selectedSlot.endTime)}` : 'Select a time slot'}
                      </p>
                      <p className="text-[11px] text-atelier-500">Time</p>
                    </div>
                  </div>

                  <div className="border-t border-atelier-100 pt-3 dark:border-atelier-800 text-[11px] text-atelier-500 leading-relaxed">
                    No upfront payment required. You will receive an instant confirmation via email or SMS.
                  </div>
                </div>

                {step < 3 && selectedDate && selectedSlot && (
                  <div className="border-t border-atelier-100 bg-atelier-50/40 p-4 dark:border-atelier-800 dark:bg-atelier-850">
                    <Button
                      onClick={handleProceedToDetails}
                      className="w-full"
                    >
                      Continue to Details <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </Card>

              {/* Studio Assurance Card */}
              <div className="rounded-2xl border border-dashed border-atelier-300/80 p-4 text-center dark:border-atelier-700 text-xs text-atelier-500">
                <p className="font-medium text-atelier-800 dark:text-atelier-200">Need to reschedule or cancel?</p>
                <p className="mt-0.5 text-[11px]">You can easily change your appointment via the confirmation email anytime.</p>
              </div>
            </div>
          </div>
        </main>

        {/* Floating Studio Concierge Widget */}
        <ChatWidget ownerId={ownerId} />
      </div>
    </PublicLayout>
  );
};

export { PublicBookingPage };
