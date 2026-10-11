import {
  FlaskConical,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  Brain,
} from 'lucide-react';
import { scienceTopics } from '../data';
import { NeuralBackground } from './Visuals';
import { Reveal } from './Reveal';
import type { ScienceTopic } from '../types';

const statusConfig: Record<
  ScienceTopic['evidenceStatus'],
  { label: string; color: string; bgColor: string; icon: typeof ShieldCheck }
> = {
  established: {
    label: 'Established Science',
    color: 'text-forest-700',
    bgColor: 'bg-forest-50 border-forest-200',
    icon: ShieldCheck,
  },
  emerging: {
    label: 'Emerging Research',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50 border-cyan-200',
    icon: FlaskConical,
  },
  'requires-further-evidence': {
    label: 'Requires Further Evidence',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    icon: AlertTriangle,
  },
};

export function SciencePage() {
  const established = scienceTopics.filter((t) => t.evidenceStatus === 'established');
  const emerging = scienceTopics.filter((t) => t.evidenceStatus === 'emerging');
  const needsEvidence = scienceTopics.filter((t) => t.evidenceStatus === 'requires-further-evidence');

  const sections = [
    { title: 'Established Scientific Background', topics: established, desc: 'These concepts are well-supported by decades of neuroscience research.' },
    { title: 'Emerging Research', topics: emerging, desc: 'These areas show promising results but require more study for definitive conclusions.' },
    { title: 'Claims Requiring Further Evidence', topics: needsEvidence, desc: 'These applications are being explored but lack sufficient evidence for strong claims.' },
  ];

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden border-b border-midnight-200/40">
        <NeuralBackground />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
          <span className="section-label mb-4">
            <BookOpen className="h-3 w-3" />
            Science & Evidence Center
          </span>
          <h1 className="font-display text-4xl font-bold text-midnight-900 sm:text-5xl text-balance">
            The Science Behind <span className="text-forest-700">Neurofeedback</span>
          </h1>
          <p className="mt-4 max-w-2xl text-midnight-600 text-lg">
            We believe in transparency. Every claim on this page is labeled by its
            evidence status, and we link to real sources wherever possible. We never
            fabricate citations or study results.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-start gap-3 rounded-xl border border-amber-300/40 bg-amber-50 px-5 py-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900">
            <strong>Important:</strong> This page is informational only and does not
            provide medical advice, diagnosis, or treatment. Always consult a qualified
            healthcare professional for medical concerns. The programs referenced are
            illustrative placeholders.
          </p>
        </div>
      </section>

      {/* Neurofeedback overview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-50 border border-forest-200">
              <Brain className="h-5 w-5 text-forest-700" />
            </div>
            <h2 className="font-display text-2xl font-bold text-midnight-900">
              Neurofeedback, Explained Simply
            </h2>
          </div>
          <p className="text-midnight-700 leading-relaxed">
            Your brain produces electrical patterns called brainwaves, which can be
            measured using a technique called EEG (electroencephalography). Neurofeedback
            shows these patterns to you in real time — as visual or audio feedback — so
            you can become aware of them. With practice, some people learn to influence
            certain brainwave patterns, similar to how biofeedback helps people learn to
            control heart rate or breathing. This is an active area of research with
            varying levels of evidence for different applications.
          </p>
        </div>
      </section>

      {/* Evidence sections */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-12 space-y-16">
        {sections.map((section, si) => (
          <div key={si}>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-midnight-900 mb-2">
                {section.title}
              </h2>
              <p className="text-sm text-midnight-500">{section.desc}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {section.topics.map((topic, i) => {
                const cfg = statusConfig[topic.evidenceStatus];
                const Icon = cfg.icon;
                return (
                  <Reveal key={topic.id} delay={i * 100}>
                  <div className="card card-hover p-7">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-bold text-midnight-900">
                        {topic.title}
                      </h3>
                    </div>
                    <div className={`mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.bgColor} ${cfg.color}`}>
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </div>
                    <p className="text-sm text-midnight-700 font-medium mb-2">{topic.summary}</p>
                    <p className="text-sm text-midnight-500 leading-relaxed mb-4">{topic.detail}</p>
                    {topic.sourceUrl && (
                      <a
                        href={topic.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-600 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Source: {topic.sourceLabel}
                      </a>
                    )}
                  </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Evidence legend */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="card p-7">
          <h3 className="font-display text-lg font-bold text-midnight-900 mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-forest-600" />
            Understanding Evidence Labels
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <div key={key} className={`rounded-lg border p-4 ${cfg.bgColor}`}>
                  <div className={`flex items-center gap-2 mb-2 ${cfg.color}`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-bold">{cfg.label}</span>
                  </div>
                  <p className="text-xs text-midnight-600">
                    {key === 'established' &&
                      'Supported by decades of research and broad scientific consensus.'}
                    {key === 'emerging' &&
                      'Some studies show positive results, but more research is needed to confirm.'}
                    {key === 'requires-further-evidence' &&
                      'Evidence is limited or mixed. No strong claims can be made yet.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
