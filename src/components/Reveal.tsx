import { type ReactNode } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article';
}

export function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const Tag = as;

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`${className} transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
      }`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  );
}
