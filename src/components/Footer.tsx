import { Brain, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNav } from '../nav';
import type { PageId } from '../types';

const footerLinks: { label: string; page: PageId }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Program Explorer', page: 'programs' },
  { label: 'Science & Evidence', page: 'science' },
  { label: 'Enquiry', page: 'enquiry' },
];

const adminLinks: { label: string; page: PageId }[] = [
  { label: 'Site Health Dashboard', page: 'health' },
  { label: 'My Neuro-Wellness', page: 'dashboard' },
];

export function Footer() {
  const { navigate } = useNav();

  return (
    <footer className="border-t border-midnight-200/60 bg-ivory-200/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-midnight-900">
                <Brain className="h-4 w-4 text-forest-300" strokeWidth={2.5} />
              </div>
              <span className="font-display text-sm font-bold text-midnight-900">
                Biocybernaut 2.0
              </span>
            </div>
            <p className="text-sm leading-relaxed text-midnight-500 max-w-xs">
              Explore brainwave training, neurofeedback science, and programs designed to
              support focus, relaxation, and self-awareness.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-midnight-900 mb-3">Navigate</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-sm text-midnight-500 hover:text-forest-600 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-midnight-200/60">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-midnight-400 mb-2">Internal Demo</p>
              <ul className="space-y-2">
                {adminLinks.map((link) => (
                  <li key={link.page}>
                    <button
                      onClick={() => navigate(link.page)}
                      className="text-sm text-midnight-400 hover:text-midnight-700 transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-midnight-900 mb-3">Privacy & Disclaimer</h4>
            <div className="space-y-3 text-sm text-midnight-500">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-forest-600 mt-0.5 shrink-0" />
                <p>
                  This demo does not send any user data to external services. All
                  information stays in your browser.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p>
                  Informational only — not medical advice. This is an independent
                  concept demo, not affiliated with any organization.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-midnight-200/60 pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-midnight-400">
            © 2026 Biocybernaut 2.0 — Interactive Concept Demo. Not affiliated with any
            real organization.
          </p>
          <div className="flex items-center gap-4 text-midnight-400">
            <Mail className="h-4 w-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
