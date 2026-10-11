import {
  Activity,
  ArrowRight,
  Brain,
  Check,
  ChevronRight,
  Eye,
  FlaskConical,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useNav } from '../nav';
import { programs } from '../data';
import { BrainOrb, BrainwaveVisual, NeuralBackground } from './Visuals';
import { FAQSection } from './FAQSection';
import { Reveal } from './Reveal';

const heroImage = 'https://images.pexels.com/photos/17483868/pexels-photo-17483868.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export function HomePage() {
  const { navigate, setAssistantOpen } = useNav();
  const featured = programs.slice(0, 3);

  return (
    <div className="original-homepage">
      <section className="original-hero">
        <div className="original-hero-image" style={{ backgroundImage: `url(${heroImage})` }} />
        <NeuralBackground variant="dark" className="opacity-70" />
        <div className="hero-ambient hero-ambient-left" />
        <div className="hero-ambient hero-ambient-right" />
        <div className="hero-scanlines" />
        <div className="hero-grid-floor" />
        <div className="hero-vignette" />
        <div className="original-hero-content">
          <Reveal>
            <p className="hero-eyebrow">What Zen Masters spend 30 years chasing,</p>
            <h1>
              <span>Your Brain Can Learn</span>
              <strong>in 7 Days.</strong>
            </h1>
            <p className="hero-description">
              Sharper thinking, effortless calm, and creativity you can summon on demand. Biocybernaut trains your brain to enter Alpha at will, the state behind your best work, your clearest decisions, and your most peaceful moments.
            </p>
            <div className="hero-actions">
              <button type="button" className="original-button original-button-blue" onClick={() => navigate('enquiry')}>
                Book a Free Consultation <ArrowRight className="h-5 w-5" />
              </button>
              <button type="button" className="original-button original-button-white" onClick={() => navigate('science')}>
                Learn How It Works <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <div className="media-strip" aria-label="Featured publication names">
              <span>BUSINESS<br />INSIDER</span><span>WIRED</span><span className="italic">HUFFPOST</span><span>CNN</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="testimonials" className="original-testimonial-band">
        <div className="testimonial-orb"><BrainOrb className="h-28 w-28" /></div>
        <div>
          <p className="testimonial-kicker">A different way to train attention</p>
          <h2>Make the invisible visible.</h2>
          <p className="testimonial-copy">Real-time feedback gives participants a way to observe their brainwave patterns as they happen and explore a more deliberate training process.</p>
        </div>
      </section>

      <section className="research-overview original-section">
        <div className="original-container research-grid">
          <Reveal>
            <div className="research-stats-grid">
              <div className="research-stat"><Brain className="h-8 w-8" /><strong>EEG</strong><span>real-time brainwave measurement</span></div>
              <div className="research-stat"><Activity className="h-8 w-8" /><strong>Alpha</strong><span>relaxed alertness and calm focus</span></div>
              <div className="research-stat"><Eye className="h-8 w-8" /><strong>Live</strong><span>visual and audio feedback</span></div>
              <div className="research-stat"><FlaskConical className="h-8 w-8" /><strong>Evidence</strong><span>claims clearly classified</span></div>
            </div>
          </Reveal>
          <Reveal>
            <div className="research-copy">
              <p className="original-kicker">THE SCIENCE</p>
              <h2>Backed by research. Built for awareness.</h2>
              <p>Brainwave training combines established EEG measurement with guided feedback. The Science &amp; Evidence Center separates established science from emerging research and claims requiring further evidence.</p>
              <button type="button" className="original-text-link" onClick={() => navigate('science')}>Explore the research <ArrowRight className="h-4 w-4" /></button>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="benefits" className="benefits-section original-section">
        <div className="original-container benefits-grid">
          <Reveal>
            <div className="benefits-intro">
              <p className="original-kicker">THE BENEFITS</p>
              <h2>The week ends &amp; the changes keep going.</h2>
              <p>Explore the areas participants and researchers associate with brainwave training. Evidence varies by application, so each topic is presented with appropriate context.</p>
              <button type="button" className="original-button original-button-yellow" onClick={() => navigate('enquiry')}>Book a Free Consultation <ArrowRight className="h-4 w-4" /></button>
              <div className="benefits-brain"><BrainOrb className="h-64 w-64" /></div>
            </div>
          </Reveal>
          <div className="benefit-list">
            {[
              ['BETTER RELATIONSHIPS & CONNECTIONS', 'Self-awareness can help people observe patterns in attention and response.'],
              ['CLEARER THINKING SHOWS UP IN YOUR DAY', 'Focus and attention are areas explored by neurofeedback research.'],
              ['DECISIONS STOP TAKING DAYS', 'Guided training gives participants a structured way to practise calm focus.'],
              ['YOU GET CLEAR ON WHAT YOU ACTUALLY WANT', 'The goal is informed exploration, not a promise of a guaranteed outcome.'],
            ].map(([title, text], index) => (
              <Reveal key={title} delay={index * 90}>
                <div className="benefit-item"><ChevronRight className="h-7 w-7" /><div><h3>{title}</h3><p>{text}</p></div></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="technology-section original-section">
        <div className="original-container technology-grid">
          <Reveal>
            <div className="technology-copy"><p className="original-kicker">THE PROCESS</p><h2>Your brain has been flying blind your whole life.</h2><p>Your brain continuously produces electrical activity, but you cannot directly observe it. EEG feedback creates a live visual and audio reference so training can become more intentional.</p><button type="button" className="original-button original-button-blue" onClick={() => navigate('science')}>See How It Works <ArrowRight className="h-4 w-4" /></button></div>
          </Reveal>
          <Reveal>
            <div className="technology-visual"><div className="technology-visual-glow" /><BrainOrb className="h-72 w-72" /><div className="technology-wave"><BrainwaveVisual className="h-20" dark /></div></div>
          </Reveal>
        </div>
      </section>

      <section className="process-section original-section">
        <div className="original-container">
          <Reveal><div className="center-heading"><p className="original-kicker">HOW IT WORKS</p><h2>Measure. Observe. Train.</h2><p>A simple, guided process from measurement to self-awareness.</p></div></Reveal>
          <div className="process-grid">
            {[['01', 'Measure', 'EEG sensors detect your brainwave activity in real time.'], ['02', 'Observe', 'Visual and audio feedback shows your patterns live.'], ['03', 'Train', 'Repeated practice helps you recognize and influence your brainwave states.']].map(([number, title, text]) => <Reveal key={number}><div className="process-card"><span>{number}</span><Activity className="h-8 w-8" /><h3>{title}</h3><p>{text}</p></div></Reveal>)}
          </div>
        </div>
      </section>

      <section className="programs-preview original-section" id="programs-preview">
        <div className="original-container">
          <Reveal><div className="programs-heading"><div><p className="original-kicker">TRAINING PROGRAMS</p><h2>Find the training that fits your goals.</h2></div><button type="button" className="original-text-link" onClick={() => navigate('programs')}>Explore all programs <ArrowRight className="h-4 w-4" /></button></div></Reveal>
          <div className="programs-grid">{featured.map((program) => <Reveal key={program.id}><article className="program-card"><p className="program-category">{program.category}</p><h3>{program.name}</h3><p>{program.description}</p><button type="button" onClick={() => navigate('programs')}>View program <ArrowRight className="h-4 w-4" /></button></article></Reveal>)}</div>
        </div>
      </section>

      <section className="faq-section original-section" id="faq">
        <div className="original-container faq-layout"><Reveal><div><p className="original-kicker">QUESTIONS</p><h2>Start with what you want to understand.</h2><p>Explore the answers already available, or ask the Biocybernaut assistant for help finding the right section.</p><button type="button" className="original-button original-button-yellow" onClick={() => setAssistantOpen(true)}><MessageSquare className="h-4 w-4" /> Ask the AI Assistant</button></div></Reveal><Reveal><FAQSection /></Reveal></div>
      </section>

      <section className="final-cta original-section">
        <div className="original-container final-cta-inner"><Sparkles className="h-8 w-8 text-yellow-300" /><p className="original-kicker">YOUR NEXT STEP</p><h2>See what focused training could unlock.</h2><p>Browse the available programs, explore the evidence, or speak with the team about your questions.</p><div className="hero-actions"><button type="button" className="original-button original-button-yellow" onClick={() => navigate('enquiry')}>Speak to a Biocybernaut Expert <ArrowRight className="h-4 w-4" /></button><button type="button" className="original-button original-button-outline" onClick={() => navigate('programs')}>Explore Programs</button></div><div className="final-trust"><Check className="h-4 w-4" /> Informational content with evidence context <ShieldCheck className="ml-4 h-4 w-4" /> No medical advice</div></div>
      </section>
    </div>
  );
}
