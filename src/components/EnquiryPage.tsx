import { useState, type FormEvent } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  X,
  Info,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import { programs } from '../data';
import { useNav } from '../nav';
import { NeuralBackground } from './Visuals';

interface FormData {
  name: string;
  email: string;
  program: string;
  contactMethod: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  program?: string;
  contactMethod?: string;
  message?: string;
}

type Status = 'idle' | 'submitting' | 'success';

export function EnquiryPage() {
  const { navigate } = useNav();
  const [data, setData] = useState<FormData>({
    name: '', email: '', program: '', contactMethod: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<Status>('idle');

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!data.name.trim()) errs.name = 'Please enter your name';
    else if (data.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!data.email.trim()) errs.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Please enter a valid email address';
    if (!data.program) errs.program = 'Please select a program of interest';
    if (!data.contactMethod) errs.contactMethod = 'Please select a preferred contact method';
    if (!data.message.trim()) errs.message = 'Please enter a message';
    else if (data.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1200);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const resetForm = () => {
    setData({ name: '', email: '', program: '', contactMethod: '', message: '' });
    setErrors({});
    setStatus('idle');
  };

  const handleBookingSubmit = () => {
    setBookingStatus('submitting');
    setTimeout(() => setBookingStatus('success'), 1500);
  };

  const closeBooking = () => {
    setShowBooking(false);
    setBookingStatus('idle');
  };

  const inputClass = (hasError?: string) =>
    `input-field ${hasError ? 'border-red-400 focus:border-red-400' : ''}`;

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden border-b border-midnight-200/40">
        <NeuralBackground />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
          <span className="section-label mb-4">
            <MessageSquare className="h-3 w-3" />
            Enquiry & Booking
          </span>
          <h1 className="font-display text-4xl font-bold text-midnight-900 sm:text-5xl text-balance">
            Get in <span className="text-forest-700">Touch</span>
          </h1>
          <p className="mt-4 max-w-2xl text-midnight-600 text-lg">
            Interested in a program? Send us an enquiry or book a demo consultation
            slot. All fields are validated locally — no data leaves your browser.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 pb-20">
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-forest-200 bg-forest-50 px-4 py-3">
          <Info className="h-4 w-4 text-forest-700 shrink-0" />
          <p className="text-xs text-forest-800">
            This is a demo form. Submissions are validated locally and show a success
            message — no data is sent to any server. No payment or medical information
            is collected.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <div className="card p-8">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest-50 border-2 border-forest-200">
                  <CheckCircle className="h-8 w-8 text-forest-600" />
                </div>
                <h3 className="font-display text-2xl font-bold text-midnight-900 mb-2">
                  Enquiry Submitted!
                </h3>
                <p className="text-midnight-600 max-w-md">
                  Thank you, {data.name}. Your enquiry about {data.program} has been
                  received (demo only). In a real system, a team member would contact
                  you via {data.contactMethod}.
                </p>
                <div className="mt-8 flex gap-3">
                  <button onClick={resetForm} className="btn-secondary">Send Another</button>
                  <button onClick={() => navigate('programs')} className="btn-primary">Back to Programs</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-midnight-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
                    <input id="name" type="text" value={data.name} onChange={(e) => handleChange('name', e.target.value)}
                      className={`${inputClass(errors.name)} pl-10`} placeholder="Jane Doe"
                      aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
                  </div>
                  {errors.name && <p id="name-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-midnight-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
                    <input id="email" type="email" value={data.email} onChange={(e) => handleChange('email', e.target.value)}
                      className={`${inputClass(errors.email)} pl-10`} placeholder="jane@example.com"
                      aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
                  </div>
                  {errors.email && <p id="email-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="program" className="block text-sm font-medium text-midnight-700 mb-1.5">Program of Interest</label>
                  <select id="program" value={data.program} onChange={(e) => handleChange('program', e.target.value)}
                    className={inputClass(errors.program)} aria-invalid={!!errors.program}>
                    <option value="">Select a program...</option>
                    {programs.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                  {errors.program && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{errors.program}</p>}
                </div>

                <div>
                  <span className="block text-sm font-medium text-midnight-700 mb-2">Preferred Contact Method</span>
                  <div className="flex gap-3">
                    {['Email', 'Phone'].map((method) => (
                      <label key={method}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                          data.contactMethod === method
                            ? 'border-forest-500 bg-forest-50 text-forest-700'
                            : 'border-midnight-200 text-midnight-600 hover:border-midnight-300'
                        }`}>
                        <input type="radio" name="contactMethod" value={method} checked={data.contactMethod === method}
                          onChange={(e) => handleChange('contactMethod', e.target.value)} className="sr-only" />
                        {method === 'Email' ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                        {method}
                      </label>
                    ))}
                  </div>
                  {errors.contactMethod && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{errors.contactMethod}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-midnight-700 mb-1.5">Message</label>
                  <textarea id="message" value={data.message} onChange={(e) => handleChange('message', e.target.value)}
                    rows={4} className={inputClass(errors.message)} placeholder="Tell us about your goals and any questions you have..."
                    aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />
                  {errors.message && <p id="message-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{errors.message}</p>}
                </div>

                <button type="submit" disabled={status === 'submitting'}
                  className="btn-accent w-full disabled:opacity-60 disabled:cursor-not-allowed">
                  {status === 'submitting' ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</>
                  ) : (
                    <><Send className="h-4 w-4" />Submit Enquiry</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            <div className="card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-forest-600" />
                <h3 className="font-display text-base font-bold text-midnight-900">Book a Demo Consultation</h3>
              </div>
              <p className="text-sm text-midnight-600 mb-4">
                Prefer to talk? Request a consultation slot with our smart booking flow —
                choose a date and time, review your details, and get a reference number.
              </p>
              <button onClick={() => navigate('booking')} className="btn-secondary w-full">
                <Calendar className="h-4 w-4" />Request a Consultation
              </button>
            </div>

            <div className="card p-6">
              <h3 className="font-display text-base font-bold text-midnight-900 mb-3">What Happens Next?</h3>
              <ul className="space-y-3 text-sm text-midnight-600">
                {['Your enquiry is validated locally in your browser', 'A success confirmation appears (demo only)', 'No data is sent to any external service'].map((text, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-50 text-xs text-forest-700 border border-forest-200">{i + 1}</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Booking modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-900/80 backdrop-blur-sm p-4" onClick={closeBooking}>
          <div className="w-full max-w-md rounded-2xl border border-midnight-200 bg-white p-6 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            {bookingStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-50 border-2 border-forest-200">
                  <CheckCircle className="h-7 w-7 text-forest-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-midnight-900 mb-2">Demo Booking Confirmed</h3>
                <p className="text-sm text-midnight-600 mb-6">
                  This is a demo confirmation — no real appointment has been booked. In a real system, you would receive an email with details.
                </p>
                <button onClick={closeBooking} className="btn-accent w-full">Got it</button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-midnight-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-forest-600" />Book a Demo Consultation
                  </h3>
                  <button onClick={closeBooking} className="rounded-lg p-1.5 text-midnight-400 hover:bg-ivory-200 hover:text-midnight-900" aria-label="Close booking modal">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-300/40 bg-amber-50 px-3 py-2">
                  <Info className="h-4 w-4 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800">Demo only — no real appointment will be booked.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-midnight-700 mb-2">Select a Date</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Mon 13', 'Tue 14', 'Wed 15', 'Thu 16', 'Fri 17', 'Mon 20'].map((date) => (
                        <button key={date} className="rounded-lg border border-midnight-200 px-3 py-2 text-xs text-midnight-700 transition-colors hover:border-forest-500 hover:text-forest-700">{date}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-700 mb-2">Select a Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '6:00 PM'].map((time) => (
                        <button key={time} className="rounded-lg border border-midnight-200 px-3 py-2 text-xs text-midnight-700 transition-colors hover:border-forest-500 hover:text-forest-700">{time}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleBookingSubmit} disabled={bookingStatus === 'submitting'} className="btn-accent w-full disabled:opacity-60">
                    {bookingStatus === 'submitting' ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Booking...</>
                    ) : (
                      <><Calendar className="h-4 w-4" />Confirm Demo Booking</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
