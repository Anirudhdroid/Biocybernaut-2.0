import { useState, useEffect, useMemo, type FormEvent } from 'react';
import {
  Layers,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Send,
  Info,
  User,
  Mail,
  Phone,
  CreditCard,
  FileText,
  Search,
  Copy,
  Calendar,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { programs } from '../data';
import { NeuralBackground } from './Visuals';
import { useNav } from '../nav';

interface BillingForm {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  billingAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  billingAddress?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  organization?: string;
}

interface OrderRecord {
  reference: string;
  programId: string;
  programName: string;
  programCategory: string;
  programDuration: string;
  billing: BillingForm;
  submittedAt: number;
  status: 'Pending confirmation';
  pricingConfirmed: boolean;
}

type Step = 'select' | 'billing' | 'review' | 'confirmation';

const STORAGE_KEY = 'biocybernaut_enrolment_orders';
const SELECTED_PROGRAM_KEY = 'biocybernaut_enrolment_selected';

const EMPTY_BILLING: BillingForm = {
  fullName: '',
  email: '',
  phone: '',
  organization: '',
  billingAddress: '',
  city: '',
  postalCode: '',
  country: '',
};

function generateReference(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ENR-${ts}-${rand}`;
}

function safeParseOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is OrderRecord =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.reference === 'string' &&
        typeof item.programId === 'string' &&
        typeof item.programName === 'string' &&
        typeof item.submittedAt === 'number' &&
        typeof item.status === 'string',
    );
  } catch {
    return [];
  }
}

function safeSaveOrders(records: OrderRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Storage unavailable or quota exceeded
  }
}

function safeRemoveOrders(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // No-op
  }
}

function formatDate(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return 'Unknown date';
  }
}

export function CheckoutPage() {
  const { navigate } = useNav();
  const [step, setStep] = useState<Step>('select');
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [billing, setBilling] = useState<BillingForm>(EMPTY_BILLING);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [showOrders, setShowOrders] = useState(false);
  const [statusSearchRef, setStatusSearchRef] = useState('');
  const [statusResult, setStatusResult] = useState<OrderRecord | null | 'not-found'>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrders(safeParseOrders());
    try {
      const savedProgram = localStorage.getItem(SELECTED_PROGRAM_KEY);
      if (savedProgram && programs.some((p) => p.id === savedProgram)) {
        setSelectedProgramId(savedProgram);
      }
    } catch {
      // No-op
    }
  }, []);

  const selectedProgram = useMemo(
    () => programs.find((p) => p.id === selectedProgramId) ?? null,
    [selectedProgramId],
  );

  const handleSelectProgram = (id: string) => {
    setSelectedProgramId(id);
    try {
      localStorage.setItem(SELECTED_PROGRAM_KEY, id);
    } catch {
      // No-op
    }
  };

  const validateBilling = (): FormErrors => {
    const errs: FormErrors = {};
    if (!billing.fullName.trim()) {
      errs.fullName = 'Please enter your full name';
    } else if (billing.fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters';
    }
    if (!billing.email.trim()) {
      errs.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!billing.phone.trim()) {
      errs.phone = 'Please enter a phone number';
    } else if (billing.phone.replace(/[^0-9]/g, '').length < 7) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!billing.billingAddress.trim()) {
      errs.billingAddress = 'Please enter your billing address';
    }
    if (!billing.city.trim()) {
      errs.city = 'Please enter your city';
    }
    if (!billing.postalCode.trim()) {
      errs.postalCode = 'Please enter your postal code';
    }
    if (!billing.country.trim()) {
      errs.country = 'Please enter your country';
    }
    return errs;
  };

  const handleBillingChange = (field: keyof BillingForm, value: string) => {
    setBilling((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleBillingSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateBilling();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep('review');
    }
  };

  const handleConfirmSubmit = () => {
    if (isSubmitting || !selectedProgram) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const record: OrderRecord = {
        reference: generateReference(),
        programId: selectedProgram.id,
        programName: selectedProgram.name,
        programCategory: selectedProgram.category,
        programDuration: selectedProgram.duration,
        billing: { ...billing },
        submittedAt: Date.now(),
        status: 'Pending confirmation',
        pricingConfirmed: true,
      };

      const existing = safeParseOrders();
      const updated = [record, ...existing];
      safeSaveOrders(updated);
      setOrders(updated);
      setConfirmedOrder(record);
      setBilling(EMPTY_BILLING);
      setSelectedProgramId(null);
      try {
        localStorage.removeItem(SELECTED_PROGRAM_KEY);
      } catch {
        // No-op
      }
      setIsSubmitting(false);
      setStep('confirmation');
    }, 800);
  };

  const handleNewEnrolment = () => {
    setConfirmedOrder(null);
    setStep('select');
  };

  const handleLookupOrder = () => {
    const ref = statusSearchRef.trim().toUpperCase();
    if (!ref) return;
    const found = orders.find((o) => o.reference.toUpperCase() === ref);
    setStatusResult(found ?? 'not-found');
  };

  const handleCopyReference = () => {
    if (!confirmedOrder) return;
    try {
      navigator.clipboard.writeText(confirmedOrder.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const inputClass = (hasError?: string) =>
    `input-field ${hasError ? 'border-red-400 focus:border-red-400' : ''}`;

  const stepOrder: Step[] = ['select', 'billing', 'review', 'confirmation'];
  const currentIdx = stepOrder.indexOf(step);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-midnight-200/40">
        <NeuralBackground />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
          <span className="section-label mb-4">
            <ShoppingBag className="h-3 w-3" />
            Program Enrolment
          </span>
          <h1 className="font-display text-4xl font-bold text-midnight-900 sm:text-5xl text-balance">
            Enrol in a <span className="text-forest-700">Program</span>
          </h1>
          <p className="mt-4 max-w-2xl text-midnight-600 text-lg">
            Select a program, provide your contact and billing details, and submit
            an enrolment request. You'll receive a reference number to track your order.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 pb-20">
        {/* Simulated / unpaid notice */}
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-amber-300/40 bg-amber-50 px-4 py-3">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Simulated checkout — no payment processed.</strong> No payment
            gateway or backend is connected. Your enrolment request is saved locally
            in your browser as "Pending confirmation." No card numbers or CVVs are
            collected. A real order requires payment-provider verification and team
            confirmation.
          </p>
        </div>

        {/* Step indicator */}
        {step !== 'confirmation' && !showOrders && (
          <div className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
            {[
              { key: 'select', label: 'Select', icon: Layers },
              { key: 'billing', label: 'Details', icon: FileText },
              { key: 'review', label: 'Review', icon: CheckCircle },
              { key: 'confirmation', label: 'Done', icon: CheckCircle },
            ].map((s, i) => {
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
                  {i < 3 && (
                    <div
                      className={`h-0.5 w-6 sm:w-10 ${isPast ? 'bg-forest-400' : 'bg-midnight-200'}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Orders view toggle */}
        {step !== 'confirmation' && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowOrders(!showOrders)}
              className="inline-flex items-center gap-2 rounded-lg border border-midnight-200 bg-ivory-50 px-4 py-2 text-sm font-medium text-midnight-600 transition-colors hover:border-forest-500 hover:text-forest-700"
            >
              <Search className="h-4 w-4" />
              {showOrders ? 'Back to enrolment' : 'View my orders'}
            </button>
          </div>
        )}

        {/* Orders view */}
        {showOrders && (
          <div className="card p-6 sm:p-8 animate-fade-in">
            <h2 className="font-display text-lg font-bold text-midnight-900 mb-2">
              Your Enrolment Orders
            </h2>
            <p className="text-sm text-midnight-500 mb-5">
              Look up an order by reference number or browse your recent requests.
            </p>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                value={statusSearchRef}
                onChange={(e) => {
                  setStatusSearchRef(e.target.value);
                  setStatusResult(null);
                }}
                placeholder="e.g. ENR-XXXXX-XXXX"
                className="input-field flex-1 font-mono text-sm uppercase"
                aria-label="Order reference number"
              />
              <button
                onClick={handleLookupOrder}
                disabled={!statusSearchRef.trim()}
                className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Search className="h-4 w-4" /> Look Up
              </button>
            </div>

            {statusResult === 'not-found' && (
              <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800">
                  No order found with that reference number. Check the number and try again.
                </p>
              </div>
            )}

            {statusResult && statusResult !== 'not-found' && (
              <OrderDetailCard order={statusResult} />
            )}

            {orders.length === 0 && !statusResult ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="h-10 w-10 text-midnight-300 mb-3" />
                <p className="text-sm text-midnight-400">No enrolment orders yet.</p>
                <p className="text-xs text-midnight-400 mt-1">
                  Select a program and complete the enrolment flow to see it here.
                </p>
                <button
                  onClick={() => setShowOrders(false)}
                  className="mt-4 btn-accent"
                >
                  <Layers className="h-4 w-4" /> Browse Programs
                </button>
              </div>
            ) : orders.length > 0 && !statusResult ? (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div
                    key={o.reference}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-midnight-200 bg-ivory-50 px-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-midnight-500">{o.reference}</p>
                      <p className="text-sm font-semibold text-midnight-800 mt-1">{o.programName}</p>
                      <p className="text-xs text-midnight-400 mt-0.5">
                        Submitted {formatDate(o.submittedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {o.status}
                      </span>
                      <button
                        onClick={() => setStatusResult(o)}
                        className="text-xs font-medium text-forest-600 hover:text-forest-700"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    safeRemoveOrders();
                    setOrders([]);
                    setStatusResult(null);
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear all local order records
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Step 1: Program selection */}
        {step === 'select' && !showOrders && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="font-display text-lg font-bold text-midnight-900 mb-1">
                Select a Program to Enrol
              </h2>
              <p className="text-sm text-midnight-500">
                Choose from the verified program list below.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {programs.map((program) => {
                const isSelected = selectedProgramId === program.id;
                return (
                  <button
                    key={program.id}
                    onClick={() => handleSelectProgram(program.id)}
                    className={`card p-5 text-left transition-all ${
                      isSelected
                        ? 'border-forest-500 ring-1 ring-forest-500/30'
                        : 'hover:border-forest-300'
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-700 border border-forest-200">
                        {program.category}
                      </span>
                      {isSelected && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-600 text-ivory-50">
                          <CheckCircle className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-base font-bold text-midnight-900 mb-2">
                      {program.name}
                    </h3>
                    <p className="text-sm text-midnight-600 mb-3 leading-relaxed">
                      {program.purpose}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-midnight-400">
                      <Clock className="h-3.5 w-3.5" />
                      {program.duration}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 items-center justify-between">
              <button
                onClick={() => navigate('programs')}
                className="inline-flex items-center gap-1.5 text-sm text-midnight-500 hover:text-forest-600 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Programs
              </button>
              <button
                onClick={() => setStep('billing')}
                disabled={!selectedProgramId}
                className="btn-accent w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Details <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Billing form */}
        {step === 'billing' && !showOrders && selectedProgram && (
          <div className="card p-6 sm:p-8 animate-fade-in">
            {/* Order summary mini */}
            <div className="mb-6 rounded-lg bg-ivory-50 border border-midnight-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-midnight-400">Selected program</p>
                  <p className="text-sm font-bold text-midnight-800">{selectedProgram.name}</p>
                  <p className="text-xs text-midnight-500 mt-0.5">{selectedProgram.duration}</p>
                </div>
                <button
                  onClick={() => setStep('select')}
                  className="text-xs font-medium text-forest-600 hover:text-forest-700"
                >
                  Change
                </button>
              </div>
            </div>

            <h2 className="font-display text-lg font-bold text-midnight-900 mb-1">
              Contact &amp; Billing Details
            </h2>
            <p className="text-sm text-midnight-500 mb-6">
              Provide your contact and billing information. No payment information is collected.
            </p>

            <form onSubmit={handleBillingSubmit} className="space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="bill-fullName" className="block text-sm font-medium text-midnight-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
                    <input
                      id="bill-fullName"
                      type="text"
                      value={billing.fullName}
                      onChange={(e) => handleBillingChange('fullName', e.target.value)}
                      className={`${inputClass(errors.fullName)} pl-10`}
                      placeholder="Jane Doe"
                      aria-invalid={!!errors.fullName}
                    />
                  </div>
                  {errors.fullName && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="bill-email" className="block text-sm font-medium text-midnight-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
                    <input
                      id="bill-email"
                      type="email"
                      value={billing.email}
                      onChange={(e) => handleBillingChange('email', e.target.value)}
                      className={`${inputClass(errors.email)} pl-10`}
                      placeholder="jane@example.com"
                      aria-invalid={!!errors.email}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="bill-phone" className="block text-sm font-medium text-midnight-700 mb-1.5">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-midnight-400" />
                    <input
                      id="bill-phone"
                      type="tel"
                      value={billing.phone}
                      onChange={(e) => handleBillingChange('phone', e.target.value)}
                      className={`${inputClass(errors.phone)} pl-10`}
                      placeholder="+1 (555) 123-4567"
                      aria-invalid={!!errors.phone}
                    />
                  </div>
                  {errors.phone && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="bill-organization" className="block text-sm font-medium text-midnight-700 mb-1.5">
                    Organization <span className="text-midnight-400 text-xs font-normal">(optional)</span>
                  </label>
                  <input
                    id="bill-organization"
                    type="text"
                    value={billing.organization}
                    onChange={(e) => handleBillingChange('organization', e.target.value)}
                    className={inputClass()}
                    placeholder="Company / Institution"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bill-address" className="block text-sm font-medium text-midnight-700 mb-1.5">
                  Billing Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="bill-address"
                  type="text"
                  value={billing.billingAddress}
                  onChange={(e) => handleBillingChange('billingAddress', e.target.value)}
                  className={inputClass(errors.billingAddress)}
                  placeholder="123 Main Street, Suite 100"
                  aria-invalid={!!errors.billingAddress}
                />
                {errors.billingAddress && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{errors.billingAddress}</p>}
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="bill-city" className="block text-sm font-medium text-midnight-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="bill-city"
                    type="text"
                    value={billing.city}
                    onChange={(e) => handleBillingChange('city', e.target.value)}
                    className={inputClass(errors.city)}
                    placeholder="San Francisco"
                    aria-invalid={!!errors.city}
                  />
                  {errors.city && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="bill-postal" className="block text-sm font-medium text-midnight-700 mb-1.5">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="bill-postal"
                    type="text"
                    value={billing.postalCode}
                    onChange={(e) => handleBillingChange('postalCode', e.target.value)}
                    className={inputClass(errors.postalCode)}
                    placeholder="94102"
                    aria-invalid={!!errors.postalCode}
                  />
                  {errors.postalCode && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{errors.postalCode}</p>}
                </div>

                <div>
                  <label htmlFor="bill-country" className="block text-sm font-medium text-midnight-700 mb-1.5">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="bill-country"
                    type="text"
                    value={billing.country}
                    onChange={(e) => handleBillingChange('country', e.target.value)}
                    className={inputClass(errors.country)}
                    placeholder="United States"
                    aria-invalid={!!errors.country}
                  />
                  {errors.country && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="h-3.5 w-3.5" />{errors.country}</p>}
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="btn-secondary"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button type="submit" className="btn-accent flex-1">
                  Review Order <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 'review' && !showOrders && selectedProgram && (
          <div className="card p-6 sm:p-8 animate-fade-in">
            <div className="mb-6 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-forest-600" />
              <h2 className="font-display text-lg font-bold text-midnight-900">Review Your Order</h2>
            </div>

            {/* Program summary */}
            <div className="mb-6 rounded-lg border border-midnight-200 bg-ivory-50 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-midnight-400 mb-3">Program</h3>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-midnight-900">{selectedProgram.name}</p>
                  <p className="text-xs text-midnight-500 mt-1">{selectedProgram.category}</p>
                  <p className="text-xs text-midnight-500 mt-0.5">{selectedProgram.duration}</p>
                </div>
                <button
                  onClick={() => setStep('select')}
                  className="text-xs font-medium text-forest-600 hover:text-forest-700 shrink-0"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Billing summary */}
            <div className="mb-6 rounded-lg border border-midnight-200 bg-ivory-50 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-midnight-400">Billing Details</h3>
                <button
                  onClick={() => setStep('billing')}
                  className="text-xs font-medium text-forest-600 hover:text-forest-700"
                >
                  Edit
                </button>
              </div>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-midnight-400">Name</dt>
                  <dd className="text-sm font-medium text-midnight-800">{billing.fullName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-midnight-400">Email</dt>
                  <dd className="text-sm font-medium text-midnight-800">{billing.email}</dd>
                </div>
                <div>
                  <dt className="text-xs text-midnight-400">Phone</dt>
                  <dd className="text-sm font-medium text-midnight-800">{billing.phone}</dd>
                </div>
                {billing.organization && (
                  <div>
                    <dt className="text-xs text-midnight-400">Organization</dt>
                    <dd className="text-sm font-medium text-midnight-800">{billing.organization}</dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-xs text-midnight-400">Address</dt>
                  <dd className="text-sm font-medium text-midnight-800">
                    {billing.billingAddress}, {billing.city}, {billing.postalCode}, {billing.country}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Pricing disclaimer */}
            <div className="mb-6 rounded-lg border border-amber-300/40 bg-amber-50 p-5">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-900">Pricing not available</p>
                  <p className="text-xs text-amber-800 mt-1">
                    Verified pricing for this program is not published. No amount is
                    charged. This enrolment request will be submitted as "Pending
                    confirmation" — our team would confirm pricing and availability
                    before any payment is arranged. No payment gateway is connected.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment integration point */}
            <div className="mb-6 rounded-lg border-2 border-dashed border-midnight-200 bg-midnight-50/50 p-5 text-center">
              <CreditCard className="h-8 w-8 text-midnight-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-midnight-600">Payment Integration Point</p>
              <p className="text-xs text-midnight-400 mt-1 max-w-md mx-auto">
                A payment provider (e.g. Stripe) would appear here in a production
                setup. No card details are collected or stored in this demo.
              </p>
            </div>

            {/* Consent */}
            <div className="mb-6 flex items-start gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3">
              <ShieldCheck className="h-4 w-4 text-cyan-700 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-800">
                By submitting, you agree to have this enrolment request stored locally
                in your browser. No data is sent to any server. No payment is processed.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setStep('billing')}
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
                    <Send className="h-4 w-4" /> Submit Enrolment Request
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirmation' && confirmedOrder && (
          <div className="card p-8 sm:p-10 text-center animate-fade-in-up">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 border-2 border-amber-200">
              <CheckCircle className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-midnight-900 mb-2">
              Enrolment Request Submitted
            </h2>
            <p className="text-midnight-600 max-w-md mx-auto mb-6">
              Thank you, {confirmedOrder.billing.fullName}. Your enrolment request for
              <strong className="text-midnight-800"> {confirmedOrder.programName} </strong>
              has been recorded locally. This is not a confirmed enrolment — pricing and
              availability must be confirmed by our team.
            </p>

            {/* Reference number */}
            <div className="mx-auto max-w-sm mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-midnight-400 mb-2">
                Your Order Reference
              </p>
              <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-forest-300 bg-forest-50 px-4 py-3">
                <span className="font-mono text-lg font-bold text-forest-800 tracking-wider">
                  {confirmedOrder.reference}
                </span>
                <button
                  onClick={handleCopyReference}
                  className="rounded-md p-1.5 text-forest-600 transition-colors hover:bg-forest-100"
                  aria-label="Copy reference number"
                  title="Copy reference"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-forest-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              {copied && <p className="mt-1.5 text-xs text-forest-600 animate-fade-in">Copied to clipboard</p>}
            </div>

            {/* Order summary */}
            <div className="mx-auto max-w-md rounded-lg bg-ivory-50 border border-midnight-200 p-5 mb-6 text-left">
              <div className="grid gap-3">
                <div>
                  <p className="text-xs text-midnight-400">Program</p>
                  <p className="text-sm font-medium text-midnight-800">{confirmedOrder.programName}</p>
                </div>
                <div>
                  <p className="text-xs text-midnight-400">Duration</p>
                  <p className="text-sm font-medium text-midnight-800">{confirmedOrder.programDuration}</p>
                </div>
                <div>
                  <p className="text-xs text-midnight-400">Submitted</p>
                  <p className="text-sm font-medium text-midnight-800">{formatDate(confirmedOrder.submittedAt)}</p>
                </div>
              </div>
            </div>

            {/* Status badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm font-semibold text-amber-700">Status: {confirmedOrder.status}</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button onClick={() => setShowOrders(true)} className="btn-secondary">
                <Search className="h-4 w-4" /> View My Orders
              </button>
              <button onClick={handleNewEnrolment} className="btn-secondary">
                <Layers className="h-4 w-4" /> New Enrolment
              </button>
              <button onClick={() => navigate('booking')} className="btn-primary">
                <Calendar className="h-4 w-4" /> Book a Consultation <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Back link */}
        {step === 'select' && !showOrders && null}
      </section>
    </div>
  );
}

function OrderDetailCard({ order }: { order: OrderRecord }) {
  return (
    <div className="mt-5 rounded-lg border border-forest-200 bg-forest-50 p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-800">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          {order.status}
        </span>
        <span className="font-mono text-xs text-midnight-500">{order.reference}</span>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-midnight-400">Program</dt>
          <dd className="text-sm font-medium text-midnight-800">{order.programName}</dd>
        </div>
        <div>
          <dt className="text-xs text-midnight-400">Category</dt>
          <dd className="text-sm font-medium text-midnight-800">{order.programCategory}</dd>
        </div>
        <div>
          <dt className="text-xs text-midnight-400">Duration</dt>
          <dd className="text-sm font-medium text-midnight-800">{order.programDuration}</dd>
        </div>
        <div>
          <dt className="text-xs text-midnight-400">Submitted</dt>
          <dd className="text-sm font-medium text-midnight-800">{formatDate(order.submittedAt)}</dd>
        </div>
        <div>
          <dt className="text-xs text-midnight-400">Name</dt>
          <dd className="text-sm font-medium text-midnight-800">{order.billing.fullName}</dd>
        </div>
        <div>
          <dt className="text-xs text-midnight-400">Email</dt>
          <dd className="text-sm font-medium text-midnight-800">{order.billing.email}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-midnight-400">Billing address</dt>
          <dd className="text-sm text-midnight-700">
            {order.billing.billingAddress}, {order.billing.city}, {order.billing.postalCode}, {order.billing.country}
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex items-start gap-2 rounded-md bg-white/60 border border-amber-200 px-3 py-2">
        <Info className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          This is a locally recorded enrolment request, not a confirmed order. No
          payment has been processed. Status will remain "Pending confirmation" until
          a backend and payment provider are connected.
        </p>
      </div>
    </div>
  );
}
