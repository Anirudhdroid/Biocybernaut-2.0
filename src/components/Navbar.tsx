import { useState } from 'react';
import { Brain, ChevronDown, Menu, Phone, X } from 'lucide-react';
import { useNav } from '../nav';
import type { PageId } from '../types';

const phoneNumber = '855-415-4380';

export function Banner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="biocybernaut-banner">
      <p>
        Alpha Training Livestream | Thursday Oct 15, 2026 —{' '}
        <span className="underline underline-offset-2">Click here to register for free!</span>
      </p>
      <button type="button" aria-label="Close announcement" className="banner-close" onClick={() => setVisible(false)}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Navbar() {
  const { page, navigate } = useNav();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleNav = (target: PageId) => {
    navigate(target);
    setMobileOpen(false);
    setTrainingOpen(false);
    setAboutOpen(false);
  };

  const scrollToSection = (id: string) => {
    if (page !== 'home') navigate('home');
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 0);
    setMobileOpen(false);
    setTrainingOpen(false);
    setAboutOpen(false);
  };

  return (
    <nav className="biocybernaut-nav">
      <div className="biocybernaut-nav-inner">
        <button onClick={() => handleNav('home')} className="biocybernaut-logo" aria-label="Go to home page">
          <span className="biocybernaut-logo-mark"><Brain className="h-5 w-5" /></span>
          <span className="biocybernaut-logo-type">
            <strong>BIOCYBERNAUT</strong>
            <small>INSTITUTE</small>
          </span>
        </button>

        <div className="biocybernaut-desktop-links">
          <div className="nav-dropdown">
            <button type="button" className="original-nav-link" onClick={() => setTrainingOpen(!trainingOpen)} aria-expanded={trainingOpen}>
              Training <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {trainingOpen && (
              <div className="nav-dropdown-menu">
                <button type="button" onClick={() => handleNav('programs')}>Programs</button>
                <button type="button" onClick={() => handleNav('science')}>How it works</button>
              </div>
            )}
          </div>
          <button type="button" className="original-nav-link" onClick={() => scrollToSection('benefits')}>Benefits</button>
          <button type="button" className="original-nav-link" onClick={() => scrollToSection('testimonials')}>Testimonials</button>
          <div className="nav-dropdown">
            <button type="button" className="original-nav-link" onClick={() => setAboutOpen(!aboutOpen)} aria-expanded={aboutOpen}>
              About <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {aboutOpen && (
              <div className="nav-dropdown-menu">
                <button type="button" onClick={() => handleNav('science')}>Research</button>
                <button type="button" onClick={() => scrollToSection('faq')}>FAQ</button>
              </div>
            )}
          </div>
          <button type="button" className="original-nav-link" onClick={() => handleNav('enquiry')}>Contact</button>
        </div>

        <a className="phone-cta" href={`tel:${phoneNumber}`}>
          <Phone className="h-4 w-4" fill="currentColor" />
          <span>{phoneNumber}</span>
        </a>

        <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-button" aria-label="Toggle navigation menu" aria-expanded={mobileOpen}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-nav-panel">
          <button type="button" onClick={() => handleNav('programs')}>Training</button>
          <button type="button" onClick={() => scrollToSection('benefits')}>Benefits</button>
          <button type="button" onClick={() => scrollToSection('testimonials')}>Testimonials</button>
          <button type="button" onClick={() => handleNav('science')}>About</button>
          <button type="button" onClick={() => handleNav('enquiry')}>Contact</button>
          <a href={`tel:${phoneNumber}`} className="mobile-phone-link"><Phone className="h-4 w-4" /> {phoneNumber}</a>
        </div>
      )}
    </nav>
  );
}
