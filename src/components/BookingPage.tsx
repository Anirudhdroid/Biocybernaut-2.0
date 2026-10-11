import { useState, useEffect, type FormEvent } from 'react';
import {
  Calendar,
  User,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Send,
  Info,
  Clock,
  FileText,
  Search,
  Copy,
} from 'lucide-react';
import { NeuralBackground } from './Visuals';
import { useNav } from '../nav';

interface BookingForm {
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}

interface BookingRecord {
  reference: string;
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  submittedAt: number;
  status: 'Request received';
}

type Step = 'form' | 'review' | 'confirmation';

const STORAGE_KEY = 'biocybernaut_booking_requests';

const EMPTY_FORM: BookingForm = {
  name: '',
  email: '',
  preferredDate: '',
  preferredTime: '',
  message: '',
};

function generateReference(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BC-${ts}-${rand}`;
}

function safeParseBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is BookingRecord =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.reference === 'string' &&
        typeof item.name === 'string' &&
        typeof item.email === 'string' &&
        typeof item.preferredDate === 'string' &&
        typeof item.preferredTime === 'string' &&
        typeof item.submittedAt === 'number',
    );
  } catch {
    return [];
  }
}

function safeSaveBookings(records: BookingRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Storage unavailable or quota exceeded — continue silently
  }
}

function safeRemoveBookings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // No-op
  }
}

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function BookingPage() {
  const { navigate } = useNav();
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [showStatusView, setShowStatusView] = useState(false);
  const [statusSearchRef, setStatusSearchRef] = useState('');
  const [statusResult, setStatusResult] = useState<BookingRecord | null | 'not-found'>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setBookings(safeParseBookings());
  }, []);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) {
      errs.name = 'Please enter your name';
    } else if (form.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }
    if (!form.email.trim()) {
      errs.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!form.preferredDate) {
      errs.preferredDate = 'Please select a preferred date';
    } else {
      const selected = new Date(form.preferredDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errs.preferredDate = 'Please choose a date today or later';
      }
    }
    if (!form.preferredTime) {
      errs.preferredTime = 'Please select a preferred time';
    }
    if (form.message.trim().length > 500) {
      errs.message = 'Message must be 500 characters or fewer';
    }
    return errs;
  };

  const handleChange = (field: keyof BookingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep('review');
    }
  };

  const handleReviewBack = () => {
    setStep('form');
  };

  const handleConfirmSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const record: BookingRecord = {
        reference: generateReference(),
        name: form.name.trim(),
        email: form.email.trim(),
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        message: form.message.trim(),
        submittedAt: Date.now(),
        status: 'Request received',
      };

      const existing = safeParseBookings();
      const updated = [record, ...existing];
      safeSaveBookings(updated);
      setBookings(updated);
      setConfirmedBooking(record);
      setForm(EMPTY_FORM);
      setErrors({});
      setIsSubmitting(false);
      setStep('confirmation');
    }, 800);
  };

  const handleNewBooking = () => {
    setConfirmedBooking(null);
    setStep('form');
  };

  const handleLookupStatus = () => {
    const ref = statusSearchRef.trim().toUpperCase();
    if (!ref) return;
    const found = bookings.find((b) => b.reference.toUpperCase() === ref);
    setStatusResult(found ?? 'not-found');
  };

  const handleCopyReference = () => {
    if (!confirmedBooking) return;
    try {
      navigator.clipboard.writeText(confirmedBooking.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const inputClass = (hasError?: string) =>
    `input-field ${hasError ? 'border-red-400 focus:border-red-400' : ''}`;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-midnight-200/40">
        <NeuralBackground />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
          <span className="section-label mb-4">
            <Calendar className="h-3 w-3" />
            Smart Consultation Booking
          </span>
          <h1 className="font-display text-4xl font-bold text-midnight-900 sm:text-5xl text-balance">
            Book a <span className="text-forest-700">Consultation</span>
          </h1>
          <p className="mt-4 max-w-2xl text-midnight-600 text-lg">
            Request a consultation with our team. Fill in the form, review your
            details, and receive a unique reference number to track your request.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 pb-20">
        {/* Locally recorded notice */}
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-amber-300/40 bg-amber-50 px-4 py-3">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Locally recorded request.</strong> Your booking request is saved
            in your browser only. This is not a confirmed appointment — no calendar
            or scheduling backend is connected. A real appointment requires
            confirmation from our team.
          </p>
        </div>

        {/* Step indicator */}
        {step !== 'confirmation' && !showStatusView && (
          <div className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
            {[
              { key: 'form', label: 'Details', icon: FileText },
              { key: 'review', label: 'Review', icon: CheckCircle },
              { key: 'confirmation', label: 'Confirmation', icon: CheckCircle },
            ].map((s, i) => {
              const stepOrder: Step[] = ['form', 'review', 'confirmation'];
              const currentIdx = stepOrder.indexOf(step);
              const thisIdx = stepOrder.indexOf(s.key as Step);
              const isActive = step === s.key;
              const isPast = thisIdx < currentIdx;
              const Icon = s.icon;
              return (
                <div key={s.key} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-forest-600 text-ivory-50'
                        : isPast
                        ? 'bg-forest-50 text-forest-700 border border-forest-200'
                        : 'bg-ivory-100 text-midnight-400 border border-midnight-200'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{i + 1}</span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`h-0.5 w-6 sm:w-10 ${isPast ? 'bg-forest-400' : 'bg-midnight-200'}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Status view toggle */}
        {step !== 'confirmation' && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowStatusView(!showStatusView)}
              className="inline-flex items-center gap-2 rounded-lg border border-midnight-200 bg-ivory-50 px-4 py-2 text-sm font-medium text-midnight-600 transition-colors hover:border-forest-500 hover:text-forest-700"
            >
              <Search className="h-4 w-4" />
              {showStatusView ? 'Back to booking form' : 'Check a request status'}
            </button>
          </div>
        )}

        {/* Status lookup view */}
        {showStatusView && (
          <div className="card p-6 sm:p-8 animate-fade-in">
            <h2 className="font-display text-lg font-bold text-midnight-900 mb-2">
              Check Booking Status
            </h2>
            <p className="text-sm text-midnight-500 mb-5">
              Enter your reference number to look up a submitted request.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={statusSearchRef}
                onChange={(e) => {
                  setStatusSearchRef(e.target.value);
                  setStatusResult(null);
                }}
                placeholder="e.g. BC-XXXXX-XXXX"
                className="input-field flex-1 font-mono text-sm uppercase"
                aria-label="Booking reference number"
              />
              <button
                onClick={handleLookupStatus}
                disabled={!statusSearchRef.trim()}
                className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Search className="h-4 w-4" /> Look Up
              </button>
            </div>

            {statusResult === 'not-found' && (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800">
                  No request found with that reference number. Check the number and try again.
                </p>
              </div>
            )}

            {statusResult && statusResult !== 'not-found' && (
              <div className="mt-5 rounded-lg border border-forest-200 bg-forest-50 p-5 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-forest-100 border border-forest-300 px-3 py-1 text-xs font-semibold text-forest-800">
                    <span className="h-2 w-2 rounded-full bg-forest-500 animate-pulse" />
                    {statusResult.status}
                  </span>
                  <span className="font-mono text-xs text-midnight-500">{statusResult.reference}</span>
                </div>
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-midnight-400">Name</dt>
                    <dd className="text-sm font-medium text-midnight-800">{statusResult.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-midnight-400">Email</dt>
                    <dd className="text-sm font-medium text-midnight-800">{statusResult.email}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-midnight-400">Preferred date</dt>
                    <dd className="text-sm font-medium text-midnight-800">
                      {formatDateDisplay(statusResult.preferredDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-midnight-400">Preferred time</dt>
                    <dd className="text-sm font-medium text-midnight-800">{statusResult.preferredTime}</dd>
                  </div>
                  {statusResult.message && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-midnight-400">Message</dt>
                      <dd className="text-sm text-midnight-700">{statusResult.message}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-4 flex items-start gap-2 rounded-md bg-white/60 border border-forest-200 px-3 py-2">
                  <Info className="h-3.5 w-3.5 text-forest-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-forest-800">
                    This is a locally recorded request, not a confirmed appointment.
                    Status will remain "Request received" until a backend scheduling
                    system is connected.
                  </p>
                </div>
              </div>
            )}

            {bookings.length > 0 && !statusResult && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-midnight-700 mb-3">Your recent requests</h3>
                <div className="space-y-2">
                  {bookings.slice(0, 5).map((b) => (
                    <div
                      key={b.reference}
                      className="flex items-center justify-between rounded-lg border border-midnight-200 bg-ivory-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-mono text-xs text-midnight-600">{b.reference}</p>
                        <p className="text-xs text-midnight-400 mt-0.5">
                          {formatDateDisplay(b.preferredDate)} at {b.preferredTime}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 border border-forest-200 px-2.5 py-1 text-[10px] font-semibold text-forest-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-forest-500" />
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form step */}
        {step === 'form' && !showStatusView && (
          <div className="card p-6 sm:p-8 animate-fade-in">
            <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="booking-name" className="block text-sm font-medium text-midnight-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
                  <input
                    id="booking-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`${inputClass(errors.name)} pl-10`}
                    placeholder="Jane Doe"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'booking-name-error' : undefined}
                  />
                </div>
                {errors.name && (
                  <p id="booking-name-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                    <AlertCircle className="h-3.5 w-3.5" />{errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="booking-email" className="block text-sm font-medium text-midnight-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
                  <input
                    id="booking-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`${inputClass(errors.email)} pl-10`}
                    placeholder="jane@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'booking-email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="booking-email-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                    <AlertCircle className="h-3.5 w-3.5" />{errors.email}
                  </p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="booking-date" className="block text-sm font-medium text-midnight-700 mb-1.5">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
                    <input
                      id="booking-date"
                      type="date"
                      value={form.preferredDate}
                      min={todayStr}
                      onChange={(e) => handleChange('preferredDate', e.target.value)}
                      className={`${inputClass(errors.preferredDate)} pl-10`}
                      aria-invalid={!!errors.preferredDate}
                      aria-describedby={errors.preferredDate ? 'booking-date-error' : undefined}
                    />
                  </div>
                  {errors.preferredDate && (
                    <p id="booking-date-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                      <AlertCircle className="h-3.5 w-3.5" />{errors.preferredDate}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="booking-time" className="block text-sm font-medium text-midnight-700 mb-1.5">
                    Preferred Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
                    <select
                      id="booking-time"
                      value={form.preferredTime}
                      onChange={(e) => handleChange('preferredTime', e.target.value)}
                      className={`${inputClass(errors.preferredTime)} pl-10`}
                      aria-invalid={!!errors.preferredTime}
                    >
                      <option value="">Select a time...</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                    </select>
                  </div>
                  {errors.preferredTime && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                      <AlertCircle className="h-3.5 w-3.5" />{errors.preferredTime}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="booking-message" className="block text-sm font-medium text-midnight-700 mb-1.5">
                  Message <span className="text-midnight-400 text-xs font-normal">(optional)</span>
                </label>
                <textarea
                  id="booking-message"
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={4}
                  className={inputClass(errors.message)}
                  placeholder="Tell us about your goals or any specific questions..."
                  aria-invalid={!!errors.message}
                  maxLength={500}
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.message ? (
                    <p className="flex items-center gap-1.5 text-xs text-red-500">
                      <AlertCircle className="h-3.5 w-3.5" />{errors.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-midnight-400">{form.message.length}/500</span>
                </div>
              </div>

              <button type="submit" className="btn-accent w-full">
                Review Details <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* Review step */}
        {step === 'review' && !showStatusView && (
          <div className="card p-6 sm:p-8 animate-fade-in">
            <div className="mb-6 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-forest-600" />
              <h2 className="font-display text-lg font-bold text-midnight-900">Review Your Request</h2>
            </div>
            <p className="text-sm text-midnight-500 mb-6">
              Please confirm the details below before submitting. This is a request,
              not a confirmed appointment.
            </p>

            <dl className="space-y-4 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-midnight-100 pb-4">
                <dt className="flex items-center gap-2 text-sm font-medium text-midnight-500 sm:w-32 shrink-0">
                  <User className="h-4 w-4 text-midnight-400" /> Name
                </dt>
                <dd className="text-sm text-midnight-800 font-medium">{form.name}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-midnight-100 pb-4">
                <dt className="flex items-center gap-2 text-sm font-medium text-midnight-500 sm:w-32 shrink-0">
                  <Mail className="h-4 w-4 text-midnight-400" /> Email
                </dt>
                <dd className="text-sm text-midnight-800 font-medium">{form.email}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-midnight-100 pb-4">
                <dt className="flex items-center gap-2 text-sm font-medium text-midnight-500 sm:w-32 shrink-0">
                  <Calendar className="h-4 w-4 text-midnight-400" /> Date
                </dt>
                <dd className="text-sm text-midnight-800 font-medium">
                  {formatDateDisplay(form.preferredDate)}
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-midnight-100 pb-4">
                <dt className="flex items-center gap-2 text-sm font-medium text-midnight-500 sm:w-32 shrink-0">
                  <Clock className="h-4 w-4 text-midnight-400" /> Time
                </dt>
                <dd className="text-sm text-midnight-800 font-medium">{form.preferredTime}</dd>
              </div>
              {form.message && (
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                  <dt className="flex items-center gap-2 text-sm font-medium text-midnight-500 sm:w-32 shrink-0">
                    <MessageSquare className="h-4 w-4 text-midnight-400" /> Message
                  </dt>
                  <dd className="text-sm text-midnight-700">{form.message}</dd>
                </div>
              )}
            </dl>

            <div className="mb-6 flex items-start gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3">
              <Info className="h-4 w-4 text-cyan-700 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-800">
                By submitting, you agree to have this request stored locally in your
                browser. No data is sent to any server. You will receive a reference
                number to track this request.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={handleReviewBack}
                disabled={isSubmitting}
                className="btn-secondary disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" /> Edit Details
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="btn-accent flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit Request
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Confirmation step */}
        {step === 'confirmation' && confirmedBooking && (
          <div className="card p-8 sm:p-10 text-center animate-fade-in-up">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest-50 border-2 border-forest-200">
              <CheckCircle className="h-8 w-8 text-forest-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-midnight-900 mb-2">
              Request Received
            </h2>
            <p className="text-midnight-600 max-w-md mx-auto mb-6">
              Thank you, {confirmedBooking.name}. Your consultation request has been
              recorded locally. This is not a confirmed appointment — our team would
              need to contact you to finalize a slot.
            </p>

            {/* Reference number */}
            <div className="mx-auto max-w-sm mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-midnight-400 mb-2">
                Your Reference Number
              </p>
              <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-forest-300 bg-forest-50 px-4 py-3">
                <span className="font-mono text-lg font-bold text-forest-800 tracking-wider">
                  {confirmedBooking.reference}
                </span>
                <button
                  onClick={handleCopyReference}
                  className="rounded-md p-1.5 text-forest-600 transition-colors hover:bg-forest-100"
                  aria-label="Copy reference number"
                  title="Copy reference"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-forest-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="mt-1.5 text-xs text-forest-600 animate-fade-in">Copied to clipboard</p>
              )}
            </div>

            {/* Request summary */}
            <div className="mx-auto max-w-md rounded-lg bg-ivory-50 border border-midnight-200 p-5 mb-6 text-left">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-midnight-400">Preferred date</p>
                  <p className="text-sm font-medium text-midnight-800">
                    {formatDateDisplay(confirmedBooking.preferredDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-midnight-400">Preferred time</p>
                  <p className="text-sm font-medium text-midnight-800">{confirmedBooking.preferredTime}</p>
                </div>
              </div>
            </div>

            {/* Status badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-forest-50 border border-forest-200 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-forest-500 animate-pulse" />
              <span className="text-sm font-semibold text-forest-700">Status: {confirmedBooking.status}</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button onClick={() => setShowStatusView(true)} className="btn-secondary">
                <Search className="h-4 w-4" /> View All Requests
              </button>
              <button onClick={handleNewBooking} className="btn-secondary">
                <Calendar className="h-4 w-4" /> New Request
              </button>
              <button onClick={() => navigate('programs')} className="btn-primary">
                Explore Programs <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {bookings.length > 1 && (
              <div className="mt-8 pt-6 border-t border-midnight-100">
                <p className="text-xs text-midnight-400 mb-3">
                  You have {bookings.length} requests on record in this browser.
                </p>
                <button
                  onClick={() => {
                    safeRemoveBookings();
                    setBookings([]);
                    setStatusResult(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear all local booking records
                </button>
              </div>
            )}
          </div>
        )}

        {/* Back to enquiry link */}
        {step === 'form' && !showStatusView && (
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('enquiry')}
              className="inline-flex items-center gap-1.5 text-sm text-midnight-500 hover:text-forest-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Enquiry
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
