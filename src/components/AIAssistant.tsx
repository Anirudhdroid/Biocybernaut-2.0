import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Brain,
  RotateCcw,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useNav } from '../nav';
import { getAIResponse, type ChatMessage } from '../lib/aiService';

const suggestedQuestions = [
  'What is neurofeedback?',
  'Which programs are available?',
  'How does brainwave training work?',
  'What does the science say?',
  'How do I enquire about a program?',
];

const WELCOME_MESSAGE =
  "Hello! I'm your Biocybernaut assistant. I can help you understand brainwave training, explore programs, review the science, and get in touch. What would you like to know?";

const NOT_FOUND_MESSAGE =
  "I don't have a specific answer for that yet. You might find it on the Science or Programs pages, or I can take you to the Enquiry form so our team can help directly.";

export function AIAssistant() {
  const { assistantOpen, setAssistantOpen, navigate } = useNav();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isRemote, setIsRemote] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion.current ? 'auto' : 'smooth',
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (assistantOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [assistantOpen]);

  const handleSend = useCallback(
    async (text: string) => {
      const query = text.trim();
      if (!query || isTyping) return;

      setMessages((prev) => [...prev, { role: 'user', text: query }]);
      setInput('');
      setIsTyping(true);
      setHasError(false);
      setShowSuggestions(false);

      try {
        const currentHistory = messages.slice(1);
        const response = await getAIResponse(query, currentHistory);
        setIsRemote(response.source === 'remote');
        setMessages((prev) => [...prev, { role: 'assistant', text: response.text }]);
      } catch {
        setHasError(true);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: NOT_FOUND_MESSAGE,
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, messages],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleNavigate = (page: Parameters<typeof navigate>[0]) => {
    navigate(page);
    setAssistantOpen(false);
  };

  const handleReset = () => {
    setMessages([{ role: 'assistant', text: WELCOME_MESSAGE }]);
    setShowSuggestions(true);
    setHasError(false);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setAssistantOpen(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setAssistantOpen(!assistantOpen)}
        className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 ${
          assistantOpen
            ? 'rotate-90 bg-[#0876d1] shadow-[0_8px_24px_rgba(0,118,209,0.35)]'
            : 'bg-[#07123e] shadow-[0_8px_24px_rgba(7,18,62,0.3)]'
        }`}
        aria-label={assistantOpen ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={assistantOpen}
      >
        {assistantOpen ? (
          <X className="h-6 w-6 text-white" strokeWidth={2.5} />
        ) : (
          <MessageCircle className="h-6 w-6 text-[#ffd100]" strokeWidth={2.5} />
        )}
        {!assistantOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-[#ffd100] items-center justify-center">
              <Sparkles className="h-2.5 w-2.5 text-[#07123e]" />
            </span>
          </span>
        )}
      </button>

      {/* Chat window */}
      {assistantOpen && (
        <div
          className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm animate-slide-in-right motion-reduce:animate-none"
          role="dialog"
          aria-label="AI Assistant chat"
          onKeyDown={handleKeyDown}
        >
          <div
            className="flex flex-col rounded-2xl bg-white shadow-2xl shadow-[#07123e]/20 overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#0b123c] bg-[#07103d] px-4 py-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b123c] border border-[#173cf0]/30">
                <Brain className="h-5 w-5 text-[#ffd100]" strokeWidth={2.5} />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#07103d] bg-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Biocybernaut Assistant</p>
                <p className="text-xs text-[#65bdea] truncate">
                  {isRemote ? 'Connected — AI-powered' : 'Knowledge-based answers'}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-[#0b123c] hover:text-white"
                aria-label="Reset conversation"
                title="Reset conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setAssistantOpen(false)}
                className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-[#0b123c] hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50"
              style={{ maxHeight: 'calc(min(560px, 70vh) - 116px)' }}
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  } ${i === messages.length - 1 ? 'animate-fade-in motion-reduce:animate-none' : ''}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-[#0876d1] text-white rounded-br-sm'
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start animate-fade-in motion-reduce:animate-none">
                  <div className="flex items-center gap-1 rounded-2xl bg-white border border-slate-200 px-4 py-3">
                    <span
                      className="h-2 w-2 rounded-full bg-[#0876d1] animate-bounce motion-reduce:animate-none"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-[#0876d1] animate-bounce motion-reduce:animate-none"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-[#0876d1] animate-bounce motion-reduce:animate-none"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              )}

              {/* Error banner */}
              {hasError && !isTyping && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    I couldn't retrieve an answer. Please try rephrasing, or use the
                    Enquiry form for direct assistance.
                  </p>
                </div>
              )}

              {/* Suggested questions */}
              {showSuggestions && !isTyping && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-slate-400 px-1">Try asking:</p>
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-600 transition-all hover:border-[#0876d1] hover:text-[#0876d1] hover:pl-4"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Quick navigation — appears after first exchange */}
              {!showSuggestions && !isTyping && messages.length > 2 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 mt-3">
                  <span className="text-xs text-slate-400 w-full mb-1">Explore:</span>
                  {[
                    { label: 'Programs', page: 'programs' as const },
                    { label: 'Science', page: 'science' as const },
                    { label: 'Enquiry', page: 'enquiry' as const },
                    { label: 'Book Consult', page: 'booking' as const },
                    { label: 'Enrol', page: 'enrol' as const },
                  ].map((link) => (
                    <button
                      key={link.page}
                      onClick={() => handleNavigate(link.page)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-[#0876d1] hover:text-[#0876d1]"
                    >
                      {link.label}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-100 bg-white px-3 py-3"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-[#0876d1] focus:outline-none focus:ring-1 focus:ring-[#0876d1]/30"
                  aria-label="Type your question"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#07123e] text-white transition-all hover:bg-[#0876d1] active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
