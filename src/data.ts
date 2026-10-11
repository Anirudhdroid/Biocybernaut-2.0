import type { Program, FAQItem, ScienceTopic } from './types';

export const programs: Program[] = [
  {
    id: 'alpha-rebalancing',
    name: 'Alpha Brainwave Rebalancing',
    category: 'Neurofeedback',
    purpose: 'Support relaxation and stress reduction through alpha wave training',
    duration: '5-day intensive (illustrative)',
    format: 'In-person, guided sessions with EEG feedback (illustrative)',
    description:
      'A focused program that uses real-time EEG feedback to help participants become aware of and influence their alpha brainwave activity, which is associated with relaxed alertness and calm focus.',
    illustrationOnly: true,
  },
  {
    id: 'peak-performance',
    name: 'Peak Performance Training',
    category: 'Performance',
    purpose: 'Enhance focus, mental clarity, and cognitive performance',
    duration: '7-day intensive (illustrative)',
    format: 'In-person, multi-session (illustrative)',
    description:
      'Designed for professionals and athletes seeking to optimize mental performance through brainwave training and neurofeedback techniques.',
    illustrationOnly: true,
  },
  {
    id: 'meditation-enhancement',
    name: 'Meditation Enhancement',
    category: 'Mindfulness',
    purpose: 'Deepen meditation practice with real-time brainwave feedback',
    duration: '4-day program (illustrative)',
    format: 'In-person, guided meditation + EEG (illustrative)',
    description:
      'Combines traditional meditation practice with neurofeedback to help participants understand and deepen their meditative states.',
    illustrationOnly: true,
  },
  {
    id: 'sleep-optimization',
    name: 'Sleep Optimization',
    category: 'Wellness',
    purpose: 'Support healthier sleep patterns through brainwave training',
    duration: '6-day program (illustrative)',
    format: 'In-person sessions + home practice guide (illustrative)',
    description:
      'Targets brainwave patterns associated with sleep regulation to help participants develop healthier sleep cycles.',
    illustrationOnly: true,
  },
  {
    id: 'focus-attention',
    name: 'Focus & Attention Training',
    category: 'Neurofeedback',
    purpose: 'Train sustained attention and reduce distractibility',
    duration: '5-day intensive (illustrative)',
    format: 'In-person, EEG-guided sessions (illustrative)',
    description:
      'Uses neurofeedback to train attention-related brainwave patterns, helping participants build sustained focus skills.',
    illustrationOnly: true,
  },
  {
    id: 'creativity-unlock',
    name: 'Creativity Enhancement',
    category: 'Performance',
    purpose: 'Foster creative thinking through targeted brainwave training',
    duration: '4-day program (illustrative)',
    format: 'In-person, interactive sessions (illustrative)',
    description:
      'Targets brainwave states associated with creative flow and divergent thinking through guided neurofeedback exercises.',
    illustrationOnly: true,
  },
];

export const programCategories: string[] = [
  'All',
  'Neurofeedback',
  'Performance',
  'Mindfulness',
  'Wellness',
];

export const faqItems: FAQItem[] = [
  {
    question: 'What is neurofeedback?',
    answer:
      'Neurofeedback is a technique that uses real-time displays of brain activity — typically via EEG — to help individuals become aware of and self-regulate their brainwave patterns. It is used in research and clinical contexts for a variety of applications.',
  },
  {
    question: 'Is this website affiliated with Biocybernaut Institute?',
    answer:
      'No. This is an independent interactive concept demo showing how a Biocybernaut-style website could be improved. It is not affiliated with, endorsed by, or connected to the actual Biocybernaut Institute or any production system.',
  },
  {
    question: 'Does neurofeedback provide medical diagnosis or treatment?',
    answer:
      'No. This demo is informational only and does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns. The programs shown here are illustrative placeholders.',
  },
  {
    question: 'How do I enquire about a program?',
    answer:
      'You can use the enquiry form on the Enquiry page. Select a program of interest, provide your contact details, and submit the form. In this demo, the form validates your input and shows a success message — no real data is sent anywhere.',
  },
  {
    question: 'Is the scientific information on this site verified?',
    answer:
      'The Science & Evidence Center separates established science from emerging research and claims requiring further evidence. Where possible, we link to real sources. We never fabricate citations or study results. Always review primary sources for medical decisions.',
  },
  {
    question: 'What is the Site Health dashboard?',
    answer:
      'The Site Health dashboard is a demonstration of website quality monitoring. It shows simulated metrics for availability, accessibility, performance, and more. All data is illustrative — it does not reflect real monitoring or live results.',
  },
  {
    question: 'Is my data sent to any external service?',
    answer:
      'No. This is a front-end prototype. All data stays in your browser. Forms are validated locally and nothing is transmitted to external servers or third parties.',
  },
];

export const scienceTopics: ScienceTopic[] = [
  {
    id: 'what-is-neurofeedback',
    title: 'What Is Neurofeedback?',
    summary:
      'Neurofeedback uses real-time EEG to help individuals observe and self-regulate brainwave activity.',
    detail:
      'Neurofeedback (also called EEG biofeedback) is a technique where brainwave activity is measured using electroencephalography (EEG) and presented to the individual in real time — often as visual or auditory feedback. The goal is to help the person become aware of specific brainwave patterns and learn to influence them. EEG measurement of brainwaves (alpha, beta, theta, gamma, delta) is well-established science.',
    evidenceStatus: 'established',
    sourceLabel: 'Wikipedia — Neurofeedback',
    sourceUrl: 'https://en.wikipedia.org/wiki/Neurofeedback',
  },
  {
    id: 'eeg-brainwaves',
    title: 'EEG and Brainwave Bands',
    summary:
      'EEG measures electrical activity in the brain across frequency bands like alpha, beta, theta, and delta.',
    detail:
      'Electroencephalography (EEG) records electrical activity along the scalp. Brainwaves are categorized by frequency: delta (0.5–4 Hz, deep sleep), theta (4–8 Hz, drowsiness/meditation), alpha (8–13 Hz, relaxed alertness), beta (13–30 Hz, active thinking), and gamma (30+ Hz, high-level processing). The existence and general characteristics of these bands are well-established in neuroscience.',
    evidenceStatus: 'established',
    sourceLabel: 'Wikipedia — Electroencephalography',
    sourceUrl: 'https://en.wikipedia.org/wiki/Electroencephalography',
  },
  {
    id: 'alpha-training',
    title: 'Alpha Brainwave Training',
    summary:
      'Training individuals to increase alpha activity has been explored for relaxation and stress reduction.',
    detail:
      'Alpha brainwave training is one of the most studied neurofeedback approaches. Some studies suggest it may help with relaxation, stress reduction, and mood. However, the quality and consistency of evidence varies across studies, and more rigorous, large-scale trials are needed to confirm specific outcomes.',
    evidenceStatus: 'emerging',
    sourceLabel: 'PubMed — Neurofeedback research',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/?term=neurofeedback+alpha+training',
  },
  {
    id: 'peak-performance-bf',
    title: 'Neurofeedback for Peak Performance',
    summary:
      'Some research explores neurofeedback for enhancing cognitive and athletic performance.',
    detail:
      'A number of studies have investigated whether neurofeedback can improve focus, reaction time, and cognitive performance in healthy individuals. Results are mixed — some show positive effects, others find no significant improvement. This area requires further research with larger, well-controlled studies before strong claims can be made.',
    evidenceStatus: 'requires-further-evidence',
    sourceLabel: 'PubMed — Peak performance neurofeedback',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/?term=neurofeedback+peak+performance',
  },
  {
    id: 'sleep-bf',
    title: 'Neurofeedback and Sleep',
    summary:
      'Brainwave training has been explored as a complementary approach to sleep quality.',
    detail:
      'Some research has examined neurofeedback as a tool for supporting healthier sleep patterns. While preliminary results are promising, the evidence base is not yet strong enough to make specific clinical claims. This should not replace medical evaluation of sleep disorders.',
    evidenceStatus: 'requires-further-evidence',
    sourceLabel: 'PubMed — Neurofeedback sleep',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/?term=neurofeedback+sleep',
  },
];
