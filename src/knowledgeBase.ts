import type { PageId } from './types';
import { programs, scienceTopics, faqItems } from './data';

export interface KnowledgeEntry {
  keywords: string[];
  answer: string;
}

function programSummary(): string {
  return programs
    .map((p) => `• ${p.name} — ${p.purpose}`)
    .join('\n');
}

function scienceSummary(): string {
  return scienceTopics
    .map(
      (t) =>
        `• ${t.title} [${t.evidenceStatus}]: ${t.summary}`,
    )
    .join('\n');
}

function faqSummary(): string {
  return faqItems
    .filter((f) => !f.question.toLowerCase().includes('site health'))
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join('\n\n');
}

export function buildKnowledgeContext(): string {
  return `=== PROGRAMS ===\n${programSummary()}\n\n=== SCIENCE TOPICS ===\n${scienceSummary()}\n\n=== FAQ ===\n${faqSummary()}`;
}

export const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ['what is neurofeedback', 'neurofeedback', 'eeg biofeedback', 'biofeedback'],
    answer:
      'Neurofeedback is a technique that uses real-time EEG to display brainwave activity, helping individuals become aware of and self-regulate their brainwave patterns. It is used in research and some clinical settings.\n\nYou can explore the science behind it on the Science & Evidence page.',
  },
  {
    keywords: ['program', 'programs', 'available', 'training', 'courses', 'what do you offer'],
    answer:
      `There are six programs to explore:\n\n${programSummary()}\n\nVisit the Program Explorer to browse and compare them side-by-side.`,
  },
  {
    keywords: ['alpha brainwave rebalancing', 'alpha rebalancing', 'alpha program'],
    answer:
      'Alpha Brainwave Rebalancing is a 5-day intensive that uses real-time EEG feedback to help participants become aware of and influence their alpha brainwave activity, which is associated with relaxed alertness and calm focus.\n\nVisit the Program Explorer for more details.',
  },
  {
    keywords: ['peak performance', 'performance training'],
    answer:
      'Peak Performance Training is a 7-day intensive designed for professionals and athletes seeking to optimize mental performance through brainwave training and neurofeedback techniques.\n\nSee the Program Explorer for details.',
  },
  {
    keywords: ['meditation enhancement', 'meditation program', 'mindfulness program'],
    answer:
      'The Meditation Enhancement program is a 4-day course that combines traditional meditation practice with neurofeedback to help participants understand and deepen their meditative states.\n\nSee the Program Explorer for details.',
  },
  {
    keywords: ['sleep optimization', 'sleep program', 'sleep training', 'insomnia'],
    answer:
      'Sleep Optimization is a 6-day program that targets brainwave patterns associated with sleep regulation to help participants develop healthier sleep cycles.\n\nSome research has explored neurofeedback as a complementary approach to sleep quality, but the evidence is not yet strong enough for clinical claims. This should not replace medical evaluation.\n\nSee the Science page for details on the current evidence.',
  },
  {
    keywords: ['focus and attention', 'focus training', 'attention training', 'adhd'],
    answer:
      'Focus & Attention Training is a 5-day intensive that uses neurofeedback to train attention-related brainwave patterns, helping participants build sustained focus skills.\n\nVisit the Program Explorer for details.',
  },
  {
    keywords: ['creativity', 'creative', 'creativity enhancement'],
    answer:
      'Creativity Enhancement is a 4-day program that targets brainwave states associated with creative flow and divergent thinking through guided neurofeedback exercises.\n\nSee the Program Explorer for details.',
  },
  {
    keywords: ['enquire', 'enquiry', 'booking', 'book', 'sign up', 'register', 'contact', 'consultation', 'how do i enroll', 'enrol', 'enroll'],
    answer:
      'You can submit an enquiry through the Enquiry page. Select a program of interest, provide your contact details, and add any questions. Our team will follow up to help you find the right training option.\n\nWould you like me to take you to the enquiry form?',
  },
  {
    keywords: ['science', 'evidence', 'research', 'studies', 'proof', 'scientific'],
    answer:
      `The Science & Evidence Center separates established science from emerging research and claims requiring further evidence.\n\n${scienceSummary()}\n\nVisit the Science page to explore the full breakdown with source links.`,
  },
  {
    keywords: ['alpha', 'brainwave', 'brain wave', 'alpha wave', 'alpha frequency'],
    answer:
      'Alpha brainwaves (8–13 Hz) are associated with relaxed alertness and calm focus. Alpha training is one of the most studied neurofeedback approaches. Some studies suggest benefits for relaxation and stress reduction, though evidence quality varies.\n\nSee the Science page for more detail on the evidence.',
  },
  {
    keywords: ['eeg', 'brain activity', 'brain signal', 'electroencephalography'],
    answer:
      'EEG (electroencephalography) records electrical activity along the scalp. Brainwaves are categorized by frequency: delta (0.5–4 Hz, deep sleep), theta (4–8 Hz, drowsiness/meditation), alpha (8–13 Hz, relaxed alertness), beta (13–30 Hz, active thinking), and gamma (30+ Hz, high-level processing). EEG measurement itself is well-established science.\n\nLearn more on the Science & Evidence page.',
  },
  {
    keywords: ['delta', 'delta wave', 'delta brainwave'],
    answer:
      'Delta brainwaves (0.5–4 Hz) are the slowest frequency band, associated with deep sleep and unconscious processes. EEG measurement of delta activity is well-established.\n\nSee the Science page for more on brainwave bands.',
  },
  {
    keywords: ['theta', 'theta wave', 'theta brainwave'],
    answer:
      'Theta brainwaves (4–8 Hz) are associated with drowsiness, meditation, and the hypnagogic state between wakefulness and sleep. EEG measurement of theta is well-established.\n\nSee the Science page for more on brainwave bands.',
  },
  {
    keywords: ['beta', 'beta wave', 'beta brainwave'],
    answer:
      'Beta brainwaves (13–30 Hz) are associated with active thinking, alertness, and problem-solving. EEG measurement of beta is well-established.\n\nSee the Science page for more on brainwave bands.',
  },
  {
    keywords: ['gamma', 'gamma wave', 'gamma brainwave'],
    answer:
      'Gamma brainwaves (30+ Hz) are associated with high-level information processing and cognitive functioning. EEG measurement of gamma is well-established.\n\nSee the Science page for more on brainwave bands.',
  },
  {
    keywords: ['cost', 'price', 'how much', 'fee', 'payment', 'tuition', 'afford'],
    answer:
      "I don't have specific pricing information available. For accurate details about program costs and options, please use the Enquiry form and a team member will assist you with personalized information.",
  },
  {
    keywords: ['medical', 'diagnosis', 'treatment', 'cure', 'therapy', 'health condition', 'mental health', 'depression', 'anxiety', 'adhd treatment'],
    answer:
      'This site is informational only and does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns. Neurofeedback research is ongoing, and evidence quality varies across applications.',
  },
  {
    keywords: ['affiliate', 'biocybernaut', 'official', 'real', 'company', 'institute'],
    answer:
      'This is an independent concept demo inspired by the Biocybernaut approach. It is not affiliated with, endorsed by, or connected to the actual Biocybernaut Institute.',
  },
  {
    keywords: ['site health', 'dashboard', 'monitoring', 'uptime', 'broken links'],
    answer:
      'The Site Health dashboard shows simulated metrics for page availability, accessibility, and performance. All data is illustrative — not live monitoring. You can run simulated checks from the dashboard.',
  },
  {
    keywords: ['data', 'privacy', 'safe', 'security', 'send', 'who sees my data'],
    answer:
      'All form data stays in your browser. Nothing is transmitted to external servers or third parties. Forms are validated locally.',
  },
  {
    keywords: ['faq', 'frequently asked', 'questions'],
    answer:
      `Common questions and answers:\n\n${faqSummary()}\n\nYou can also explore the FAQ section on the Home page.`,
  },
  {
    keywords: ['compare', 'comparison', 'compare programs'],
    answer:
      'In the Program Explorer, select multiple programs and click "Compare" to see them side-by-side in a comparison panel showing purpose, duration, and format.',
  },
  {
    keywords: ['benefit', 'benefits', 'why', 'help with', 'support', 'what can it do', 'good for'],
    answer:
      'Brainwave training is being explored for several areas:\n\n• Self-awareness — observing your own brainwave patterns\n• Relaxation — alpha training for calm and stress reduction\n• Focus & attention — training sustained concentration\n• Meditation depth — recognizing mental states\n\nThese are areas of research interest, not guaranteed outcomes. See the Science page for evidence details.',
  },
  {
    keywords: ['audience', 'who is it for', 'who should', 'who can benefit', 'right for me', 'eligible', 'suitable for'],
    answer:
      'Brainwave training may appeal to professionals seeking sharper focus, athletes exploring mental performance, meditators looking to deepen their practice, and anyone curious about self-awareness through EEG feedback.\n\nIf you are exploring neurofeedback for a medical condition, please consult a healthcare professional first. You can also submit an enquiry and our team can help you find the right fit.',
  },
  {
    keywords: ['how it works', 'process', 'measure', 'observe', 'train', 'steps', 'what happens', 'what to expect'],
    answer:
      'Brainwave training follows three steps:\n\n1. Measure — EEG sensors detect your brainwave activity in real time\n2. Observe — visual and audio feedback shows your patterns live\n3. Train — through guided sessions, you learn to recognize and influence your brainwave states\n\nSee the Science page for more detail on how EEG neurofeedback works.',
  },
  {
    keywords: ['how long', 'duration', 'time commitment', 'how many days'],
    answer:
      'Program durations range from 4 to 7 days depending on the training focus:\n\n• Meditation Enhancement & Creativity Enhancement: 4 days\n• Alpha Rebalancing & Focus & Attention: 5 days\n• Sleep Optimization: 6 days\n• Peak Performance: 7 days\n\nSee the Program Explorer for specifics.',
  },
  {
    keywords: ['format', 'in-person', 'online', 'remote', 'location', 'where'],
    answer:
      'Programs are structured as in-person, guided sessions with EEG feedback. Some include home practice guides. See the Program Explorer for the format of each program.',
  },
  {
    keywords: ['prepare', 'preparation', 'what should i do before', 'ready for', 'how to prepare'],
    answer:
      "To prepare for a consultation, think about what you'd like to explore — relaxation, focus, meditation depth, or another goal. Note any questions about the process, evidence, or logistics. You can submit these through the Enquiry form and our team will help you prepare.\n\nWould you like me to take you to the enquiry form?",
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'],
    answer:
      "Hello! I'm your Biocybernaut assistant. I can help you understand brainwave training, explore programs, review the science, and guide you to a consultation. What would you like to know?",
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    answer:
      "You're welcome! Feel free to ask anything else, or I can take you to the Programs, Science, or Enquiry pages.",
  },
];

export function findAnswer(query: string): string | null {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return null;

  let bestScore = 0;
  let bestAnswer: string | null = null;

  for (const entry of knowledgeBase) {
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword)) {
        const score = keyword.length;
        if (score > bestScore) {
          bestScore = score;
          bestAnswer = entry.answer;
        }
      }
    }
  }

  return bestAnswer;
}

export function navigateHint(page: PageId): string {
  switch (page) {
    case 'programs':
      return 'You can browse all programs on the Program Explorer page.';
    case 'science':
      return 'Visit the Science & Evidence Center for detailed information.';
    case 'enquiry':
      return 'Head to the Enquiry page to submit a question.';
    case 'health':
      return 'The Site Health dashboard shows simulated quality metrics.';
    default:
      return '';
  }
}
