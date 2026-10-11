import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { PageId } from './types';

interface NavContextValue {
  page: PageId;
  navigate: (page: PageId) => void;
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
}

const NavContext = createContext<NavContextValue | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>('home');
  const [assistantOpen, setAssistantOpen] = useState(false);

  const navigate = useCallback((target: PageId) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <NavContext.Provider value={{ page, navigate, assistantOpen, setAssistantOpen }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
