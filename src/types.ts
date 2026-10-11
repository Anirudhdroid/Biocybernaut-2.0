export type PageId = 'home' | 'programs' | 'science' | 'enquiry' | 'health' | 'dashboard' | 'booking' | 'enrol';

export interface Program {
  id: string;
  name: string;
  category: string;
  purpose: string;
  duration: string;
  format: string;
  description: string;
  illustrationOnly: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ScienceTopic {
  id: string;
  title: string;
  summary: string;
  detail: string;
  evidenceStatus: 'established' | 'emerging' | 'requires-further-evidence';
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface HealthCheck {
  id: string;
  category: string;
  check: string;
  status: 'pass' | 'warning' | 'fail';
  severity: 'info' | 'low' | 'medium' | 'high';
  detail: string;
  suggestedFix?: string;
}

export interface HealthMetric {
  label: string;
  value: number;
  max: number;
  unit: string;
  status: 'good' | 'fair' | 'poor';
}

