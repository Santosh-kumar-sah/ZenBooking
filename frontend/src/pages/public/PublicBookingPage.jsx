import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle2, CalendarDays, Sparkles } from 'lucide-react';
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
  customerName: z.string().min(2, 'Enter your name'),
  customerPhone: z.string().trim().optional().or(z.literal('')),
  customerEmail: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
  bookingDate: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  slotConfigId: z.string().min(1)
}).refine((data) => Boolean(data.customerPhone?.trim()) || Boolean(data.customerEmail?.trim()), {
  message: 'Provide a phone number or email',
  path: ['customerPhone']
});

const stepLabels = ['Date', 'Slot', 'Details'];

const PublicBookingPage = () => {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const businessQuery = useQuery({ queryKey: ['public-business', ownerId], queryFn: () => getBusinessPage(ownerId), enabled: Boolean(ownerId) });
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
        toast.error('This slot was just taken! Please pick another.');
        setStep(1);
        setSelectedSlot(null);
        return;
      }
      toast.error('Something went wrong. Please try again.');
    }
  });

  const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { customerName: '', customerPhone: '', customerEmail: '', bookingDate: '', startTime: '', endTime: '', slotConfigId: '' }
  });

  const business = businessQuery.data?.data?.owner;
  const availableSlots = businessQuery.data?.data?.availableSlots || businessQuery.data?.data?.slots || [];

  const filteredSlots = useMemo(() => availableSlots.filter((slot) => new Date(slot.date).toDateString() === new Date(selectedDate).toDateString()), [availableSlots, selectedDate]);

  if (!ownerId) return <Navigate to={routes.login} replace />;

  if (businessQuery.isLoading) {
    return <div className="min-h-screen bg-surface-950 p-6"><Skeleton className="h-[70vh]" /></div>;
  }

  if (businessQuery.isError || !business) {
    return <div className="flex min-h-screen items-center justify-center bg-surface-950 px-4 text-center text-slate-100"><Card className="p-8"><p className="text-xl font-semibold text-white">Business not found</p></Card></div>;
  }

  return (
    <PublicLayout>
    <div className="min-h-screen bg-surface-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-surface-950/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to={routes.landing} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 font-black text-white">BA</span>
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-xl font-black text-transparent">{business.businessName}</span>
          </Link>
          <span className="text-sm text-slate-400">Secure public booking</span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <Sparkles className="h-4 w-4 text-primary-400" /> AI-powered public booking
            </div>
            <h1 className="text-4xl font-black text-white sm:text-5xl">{business.businessName}</h1>
            <p className="max-w-2xl text-lg text-slate-300">{business.businessDescription || 'Book your next appointment in a few simple steps.'}</p>
            <div className="h-1 w-28 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
          </div>
          <Card className="p-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-400">Business page preview</p>
              <div className="mt-3 grid gap-3 rounded-2xl bg-surface-950/70 p-4">
                <div className="text-sm text-slate-300">Business type</div>
                <div className="text-xl font-semibold text-white">{business.businessType}</div>
                <div className="rounded-2xl border border-primary-500/20 bg-primary-500/10 p-4 text-sm text-slate-200">AI will match the best available slot for your customers.</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {stepLabels.map((label, index) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step > index + 1 ? 'bg-emerald-500 text-white' : step === index + 1 ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' : 'border border-white/20 text-slate-400'}`}>{step > index + 1 ? <CheckCircle2 className="h-4 w-4" /> : index + 1}</span>
              <span className="font-medium text-white">{label}</span>
            </div>
          ))}
        </div>

        {step === 1 ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <BookingCalendar
              availableSlots={availableSlots}
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                const value = new Date(date).toISOString();
                setSelectedDate(value);
                setValue('bookingDate', value);
                setStep(2);
              }}
            />
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-white">Step 1 - Pick a date</h2>
              <p className="mt-2 text-sm text-slate-400">Choose a date with an available slot to continue.</p>
              {selectedDate ? <p className="mt-4 text-sm text-slate-300">Selected: {formatDate(selectedDate)}</p> : null}
            </Card>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-white">Available slots for {formatDate(selectedDate)}</h2>
              <p className="mt-2 text-sm text-slate-400">Pick a time that works for you.</p>
              <div className="mt-5">
                <SlotPicker
                  slots={filteredSlots}
                  selectedSlot={selectedSlot?.slotConfigId || ''}
                  onSlotSelect={(slot) => {
                    setSelectedSlot(slot);
                    setValue('slotConfigId', slot.slotConfigId);
                    setValue('startTime', slot.startTime);
                    setValue('endTime', slot.endTime);
                  }}
                />
              </div>
              <div className="mt-5 flex justify-between gap-3">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button disabled={!selectedSlot} onClick={async () => (await trigger(['bookingDate', 'startTime', 'endTime', 'slotConfigId'])) && setStep(3)}>Next</Button>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white">Selected date</h3>
              <p className="mt-2 text-sm text-slate-400">{formatDate(selectedDate)}</p>
              {selectedSlot ? <p className="mt-4 text-sm text-slate-300">Time: {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</p> : null}
            </Card>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-white">Step 3 - Your details</h2>
              <p className="mt-1 text-sm text-slate-400">Provide your name and either phone number or email to receive confirmation.</p>
              <form className="mt-5 space-y-4" onSubmit={handleSubmit((values) => bookingMutation.mutate({ ownerId, ...values }))}>
                <Input label="Your name" {...register('customerName')} error={errors.customerName?.message} />
                <Input label="Phone number (optional if email is provided)" {...register('customerPhone')} error={errors.customerPhone?.message} />
                <Input label="Email (optional if phone is provided)" type="email" {...register('customerEmail')} error={errors.customerEmail?.message} />
                <Button type="submit" className="w-full" loading={bookingMutation.isPending}>Confirm Booking</Button>
              </form>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white">Booking Summary</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p><span className="text-slate-400">Business:</span> {business.businessName}</p>
                <p><span className="text-slate-400">Date:</span> {formatDate(selectedDate)}</p>
                <p><span className="text-slate-400">Time:</span> {selectedSlot ? `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}` : '--'}</p>
              </div>
            </Card>
          </div>
        ) : null}
      </main>

      <ChatWidget ownerId={ownerId} />
    </div>
    </PublicLayout>
  );
};

export { PublicBookingPage };