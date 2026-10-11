import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Activity,
  Play,
  Pause,
  Square,
  Clock,
  Heart,
  Brain,
  Battery,
  Smile,
  TrendingUp,
  Trash2,
  WifiOff,
  Info,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { NeuralBackground, BrainwaveVisual } from './Visuals';
import { Reveal } from './Reveal';
import { useNav } from '../nav';

type SessionStatus = 'idle' | 'running' | 'paused' | 'stopped';

interface CheckIn {
  id: string;
  timestamp: number;
  mood: number;
  stress: number;
  focus: number;
  energy: number;
}

interface SessionRecord {
  id: string;
  date: string;
  duration: number;
  checkIns: number;
  avgMood: number;
  avgFocus: number;
  avgEnergy: number;
  avgStress: number;
}

const SAMPLE_SESSIONS: SessionRecord[] = [
  {
    id: 'sample-1',
    date: 'Oct 3, 2026',
    duration: 900,
    checkIns: 3,
    avgMood: 7,
    avgFocus: 6,
    avgEnergy: 5,
    avgStress: 4,
  },
  {
    id: 'sample-2',
    date: 'Sep 28, 2026',
    duration: 1200,
    checkIns: 4,
    avgMood: 8,
    avgFocus: 7,
    avgEnergy: 7,
    avgStress: 3,
  },
  {
    id: 'sample-3',
    date: 'Sep 21, 2026',
    duration: 600,
    checkIns: 2,
    avgMood: 6,
    avgFocus: 5,
    avgEnergy: 4,
    avgStress: 6,
  },
];

const SLIDER_CONFIG = [
  { key: 'mood' as const, label: 'Mood', icon: Smile, color: 'text-forest-600', trackColor: 'bg-forest-500', low: 'Low', high: 'Great' },
  { key: 'stress' as const, label: 'Stress', icon: Heart, color: 'text-amber-600', trackColor: 'bg-amber-500', low: 'Calm', high: 'Tense' },
  { key: 'focus' as const, label: 'Focus', icon: Brain, color: 'text-cyan-600', trackColor: 'bg-cyan-500', low: 'Scattered', high: 'Sharp' },
  { key: 'energy' as const, label: 'Energy', icon: Battery, color: 'text-midnight-600', trackColor: 'bg-midnight-500', low: 'Drained', high: 'Energized' },
];

const STORAGE_KEYS = {
  consent: 'biocybernaut_dashboard_consent',
  sessions: 'biocybernaut_dashboard_sessions',
  checkIns: 'biocybernaut_dashboard_active_checkins',
} as const;

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function safeParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as T;
    if (typeof parsed === typeof fallback) return parsed as T;
    return fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable or quota exceeded — silently continue
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // No-op
  }
}

function isValidCheckInArray(arr: unknown): arr is CheckIn[] {
  return Array.isArray(arr) && arr.every(
    (item) => typeof item === 'object' && item !== null &&
      typeof (item as CheckIn).id === 'string' &&
      typeof (item as CheckIn).timestamp === 'number' &&
      typeof (item as CheckIn).mood === 'number' &&
      typeof (item as CheckIn).stress === 'number' &&
      typeof (item as CheckIn).focus === 'number' &&
      typeof (item as CheckIn).energy === 'number'
  );
}

function isValidSessionArray(arr: unknown): arr is SessionRecord[] {
  return Array.isArray(arr) && arr.every(
    (item) => typeof item === 'object' && item !== null &&
      typeof (item as SessionRecord).id === 'string' &&
      typeof (item as SessionRecord).date === 'string' &&
      typeof (item as SessionRecord).duration === 'number' &&
      typeof (item as SessionRecord).checkIns === 'number'
  );
}

export function NeuroDashboardPage() {
  const { navigate } = useNav();
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => {
    const restored = safeParse<unknown>(STORAGE_KEYS.checkIns, []);
    return isValidCheckInArray(restored) ? restored : [];
  });
  const [sessions, setSessions] = useState<SessionRecord[]>(() => {
    const restored = safeParse<unknown>(STORAGE_KEYS.sessions, []);
    const userSessions = isValidSessionArray(restored) ? restored : [];
    return [...userSessions, ...SAMPLE_SESSIONS];
  });
  const [consentGiven, setConsentGiven] = useState<boolean>(() =>
    safeParse<boolean>(STORAGE_KEYS.consent, false)
  );
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [pendingCheckIn, setPendingCheckIn] = useState({ mood: 5, stress: 5, focus: 5, energy: 5 });
  const [hasSavedCheckIn, setHasSavedCheckIn] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (sessionStatus === 'running') {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionStatus]);

  const handleStart = () => {
    setSessionStatus('running');
    setElapsed(0);
    setCheckIns([]);
    setHasSavedCheckIn(false);
  };

  const handlePause = () => {
    setSessionStatus((prev) => (prev === 'running' ? 'paused' : prev));
  };

  const handleResume = () => {
    setSessionStatus((prev) => (prev === 'paused' ? 'running' : prev));
  };

  const handleStop = useCallback(() => {
    setSessionStatus((prev) => {
      if (prev === 'idle' || prev === 'stopped') return prev;
      if (elapsed > 0 || checkIns.length > 0) {
        const record: SessionRecord = {
          id: `session-${Date.now()}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          duration: elapsed,
          checkIns: checkIns.length,
          avgMood: checkIns.length ? Math.round(checkIns.reduce((s, c) => s + c.mood, 0) / checkIns.length) : 0,
          avgFocus: checkIns.length ? Math.round(checkIns.reduce((s, c) => s + c.focus, 0) / checkIns.length) : 0,
          avgEnergy: checkIns.length ? Math.round(checkIns.reduce((s, c) => s + c.energy, 0) / checkIns.length) : 0,
          avgStress: checkIns.length ? Math.round(checkIns.reduce((s, c) => s + c.stress, 0) / checkIns.length) : 0,
        };
        setSessions((prevSessions) => [record, ...prevSessions]);
      }
      setElapsed(0);
      setCheckIns([]);
      setHasSavedCheckIn(false);
      return 'stopped';
    });
  }, [elapsed, checkIns]);

  // Persist consent, user sessions, and active check-ins to localStorage.
  // The running timer is intentionally NOT persisted — on refresh the session
  // resets to idle so time is not counted while the page is closed.
  useEffect(() => {
    safeSet(STORAGE_KEYS.consent, consentGiven);
  }, [consentGiven]);

  useEffect(() => {
    const userSessions = sessions.filter((s) => !s.id.startsWith('sample-'));
    safeSet(STORAGE_KEYS.sessions, userSessions);
  }, [sessions]);

  useEffect(() => {
    if (checkIns.length > 0) {
      safeSet(STORAGE_KEYS.checkIns, checkIns);
    } else {
      safeRemove(STORAGE_KEYS.checkIns);
    }
  }, [checkIns]);

  const handleSaveCheckIn = () => {
    if (!consentGiven) {
      setShowConsentBanner(true);
      return;
    }
    const entry: CheckIn = {
      id: `checkin-${Date.now()}`,
      timestamp: Date.now(),
      ...pendingCheckIn,
    };
    setCheckIns((prev) => [...prev, entry]);
    setHasSavedCheckIn(true);
    setShowConsentBanner(false);
    setTimeout(() => setHasSavedCheckIn(false), 2500);
  };

  const handleClearData = () => {
    safeRemove(STORAGE_KEYS.consent);
    safeRemove(STORAGE_KEYS.sessions);
    safeRemove(STORAGE_KEYS.checkIns);
    setSessions(SAMPLE_SESSIONS);
    setCheckIns([]);
    setElapsed(0);
    setSessionStatus('idle');
    setConsentGiven(false);
    setHasSavedCheckIn(false);
    setPendingCheckIn({ mood: 5, stress: 5, focus: 5, energy: 5 });
  };

  const progressData = useMemo(() => {
    if (checkIns.length === 0) return [];
    return checkIns.map((c, i) => ({
      label: `#${i + 1}`,
      mood: c.mood,
      focus: c.focus,
      energy: c.energy,
      stress: c.stress,
    }));
  }, [checkIns]);

  const isSessionActive = sessionStatus === 'running' || sessionStatus === 'paused';

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-midnight-200/40">
        <NeuralBackground />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="section-label">
              <Activity className="h-3 w-3" />
              My Neuro-Wellness
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-midnight-200 bg-midnight-50 px-3 py-1 text-xs font-semibold text-midnight-600">
              <ShieldCheck className="h-3 w-3" />
              Private — data stays in your browser
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold text-midnight-900 sm:text-5xl text-balance">
            Neuro-Wellness <span className="text-forest-700">Companion</span>
          </h1>
          <p className="mt-4 max-w-2xl text-midnight-600 text-lg">
            Track your subjective well-being with guided check-ins, a session timer,
            and an animated visualization. This is a self-awareness companion — not a
            medical device and not connected to live EEG hardware.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-20">
        {/* Simulated data notice */}
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-amber-300/40 bg-amber-50 px-4 py-3">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Simulated visualization.</strong> The brainwave animation below is
            decorative and does not represent real EEG data. Check-in values are your
            self-reported feelings, not sensor readings. This tool does not diagnose
            or treat any condition.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Session Controls + Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session card */}
            <div className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-lg font-bold text-midnight-900">Session Timer</h2>
                  <p className="text-sm text-midnight-500 mt-0.5">
                    Start a focused self-awareness session with voluntary check-ins.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-midnight-50 px-4 py-2 border border-midnight-200">
                  <Clock className="h-5 w-5 text-midnight-600" />
                  <span className="font-display text-2xl font-bold text-midnight-900 tabular-nums">
                    {formatDuration(elapsed)}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3">
                {sessionStatus === 'idle' || sessionStatus === 'stopped' ? (
                  <button
                    onClick={handleStart}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-forest-600 px-5 py-2.5 text-sm font-semibold text-ivory-50 transition-all hover:bg-forest-500 hover:shadow-lg hover:shadow-forest-600/25 active:scale-95"
                  >
                    <Play className="h-4 w-4" fill="currentColor" /> Start Session
                  </button>
                ) : (
                  <>
                    {sessionStatus === 'running' ? (
                      <button
                        onClick={handlePause}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-midnight-300 bg-ivory-50 px-5 py-2.5 text-sm font-semibold text-midnight-800 transition-all hover:border-forest-500 hover:bg-ivory-200 active:scale-95"
                      >
                        <Pause className="h-4 w-4" /> Pause
                      </button>
                    ) : (
                      <button
                        onClick={handleResume}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-forest-600 px-5 py-2.5 text-sm font-semibold text-ivory-50 transition-all hover:bg-forest-500 active:scale-95"
                      >
                        <Play className="h-4 w-4" fill="currentColor" /> Resume
                      </button>
                    )}
                    <button
                      onClick={handleStop}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 transition-all hover:bg-red-100 hover:border-red-300 active:scale-95"
                    >
                      <Square className="h-4 w-4" fill="currentColor" /> Stop &amp; Save
                    </button>
                  </>
                )}
              </div>

              {/* Status badge */}
              {sessionStatus !== 'idle' && (
                <div className="mt-4 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    sessionStatus === 'running'
                      ? 'bg-forest-50 text-forest-700 border border-forest-200'
                      : sessionStatus === 'paused'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-midnight-50 text-midnight-600 border border-midnight-200'
                  }`}>
                    <span className={`h-2 w-2 rounded-full ${
                      sessionStatus === 'running' ? 'bg-forest-500 animate-pulse' : sessionStatus === 'paused' ? 'bg-amber-500' : 'bg-midnight-400'
                    }`} />
                    {sessionStatus === 'running' ? 'Session active' : sessionStatus === 'paused' ? 'Paused' : 'Session ended'}
                  </span>
                </div>
              )}
            </div>

            {/* Brainwave visualization */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-midnight-900">Brainwave Visualization</h2>
                  <p className="text-xs text-midnight-500 mt-0.5">Decorative animation — not real EEG data</p>
                </div>
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="relative h-32 rounded-lg bg-midnight-900 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 grid-bg-dark opacity-30" />
                <BrainwaveVisual className="relative h-20 w-full px-6" dark />
                {!isSessionActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-midnight-900/60">
                    <p className="text-xs text-midnight-200">Start a session to animate the visualization</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress chart */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-midnight-900 mb-1">Session Check-in Progress</h2>
              <p className="text-xs text-midnight-500 mb-4">Self-reported values over your current session</p>
              {progressData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <TrendingUp className="h-8 w-8 text-midnight-300 mb-2" />
                  <p className="text-sm text-midnight-400">No check-ins yet this session.</p>
                  <p className="text-xs text-midnight-400 mt-1">Save a check-in below to see your progress chart.</p>
                </div>
              ) : (
                <ProgressChart data={progressData} />
              )}
            </div>
          </div>

          {/* Right column: Check-ins + EEG status */}
          <div className="space-y-6">
            {/* EEG connection status */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-midnight-900 mb-4">EEG Connection</h2>
              <div className="flex flex-col items-center text-center py-4">
                <div className="relative mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-midnight-50 border-2 border-midnight-200">
                    <WifiOff className="h-7 w-7 text-midnight-400" />
                  </div>
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-midnight-100 border-2 border-white flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-midnight-300" />
                  </span>
                </div>
                <p className="text-sm font-semibold text-midnight-700">No EEG device connected</p>
                <p className="text-xs text-midnight-400 mt-1 max-w-[200px]">
                  Future hardware integration will stream live brainwave data here.
                  The visualization above is decorative only.
                </p>
              </div>
              <div className="mt-4 rounded-lg bg-ivory-50 border border-ivory-300 px-4 py-3">
                <div className="flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-midnight-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-midnight-500">
                    This companion currently uses self-reported check-ins only.
                    No sensor readings are collected.
                  </p>
                </div>
              </div>
            </div>

            {/* Check-in card */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-midnight-900 mb-1">How are you feeling?</h2>
              <p className="text-xs text-midnight-500 mb-4">
                {isSessionActive
                  ? 'Rate your current state. Values update your session chart instantly.'
                  : 'Start a session to begin tracking check-ins.'}
              </p>

              <div className={`space-y-5 ${!isSessionActive ? 'opacity-50 pointer-events-none' : ''}`}>
                {SLIDER_CONFIG.map((slider) => {
                  const Icon = slider.icon;
                  const value = pendingCheckIn[slider.key];
                  return (
                    <div key={slider.key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${slider.color}`} />
                          <span className="text-sm font-medium text-midnight-700">{slider.label}</span>
                        </div>
                        <span className="text-sm font-bold text-midnight-900 tabular-nums">{value}/10</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={value}
                        onChange={(e) => setPendingCheckIn((prev) => ({ ...prev, [slider.key]: Number(e.target.value) }))}
                        className="w-full accent-forest-600 cursor-pointer"
                        aria-label={`${slider.label} rating`}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-midnight-400">{slider.low}</span>
                        <span className="text-[10px] text-midnight-400">{slider.high}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Consent banner */}
              {showConsentBanner && !consentGiven && (
                <div className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 animate-fade-in">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-cyan-900">Your consent is needed</p>
                      <p className="text-xs text-cyan-700 mt-1">
                        Check-in values are stored only in your browser for this session.
                        No sensitive health data is sent anywhere. You can clear all data anytime.
                      </p>
                      <button
                        onClick={() => {
                          setConsentGiven(true);
                          setShowConsentBanner(false);
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cyan-700"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> I consent
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save button */}
              <button
                onClick={handleSaveCheckIn}
                disabled={!isSessionActive}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-midnight-900 px-4 py-2.5 text-sm font-semibold text-ivory-100 transition-all hover:bg-midnight-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCircle className="h-4 w-4" /> Save Check-in
              </button>

              {/* Saved confirmation */}
              {hasSavedCheckIn && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-forest-50 border border-forest-200 px-3 py-2 animate-fade-in">
                  <CheckCircle className="h-4 w-4 text-forest-600" />
                  <p className="text-xs text-forest-700">Check-in saved to your session.</p>
                </div>
              )}

              {/* Check-in count */}
              {checkIns.length > 0 && (
                <p className="mt-3 text-xs text-midnight-500 text-center">
                  {checkIns.length} check-in{checkIns.length > 1 ? 's' : ''} recorded this session
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Session history */}
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="font-display text-lg font-bold text-midnight-900">Session History</h2>
              <p className="text-xs text-midnight-500 mt-0.5">
                Sample entries shown for demonstration. Your sessions appear at the top.
              </p>
            </div>
            <button
              onClick={handleClearData}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition-all hover:bg-red-100 hover:border-red-300 active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear Local Data
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="card p-12 flex flex-col items-center justify-center text-center">
              <Activity className="h-10 w-10 text-midnight-300 mb-3" />
              <p className="text-sm text-midnight-400">No sessions recorded yet.</p>
              <p className="text-xs text-midnight-400 mt-1">Start a session above to see it here after you stop.</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-midnight-200 bg-ivory-50 text-left">
                      <th className="px-4 py-3 font-semibold text-midnight-700">Date</th>
                      <th className="px-4 py-3 font-semibold text-midnight-700">Duration</th>
                      <th className="px-4 py-3 font-semibold text-midnight-700">Check-ins</th>
                      <th className="px-4 py-3 font-semibold text-midnight-700">Mood</th>
                      <th className="px-4 py-3 font-semibold text-midnight-700">Focus</th>
                      <th className="px-4 py-3 font-semibold text-midnight-700">Energy</th>
                      <th className="px-4 py-3 font-semibold text-midnight-700">Stress</th>
                      <th className="px-4 py-3 font-semibold text-midnight-700">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s, i) => (
                      <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-ivory-50/50'}>
                        <td className="px-4 py-3 font-medium text-midnight-800">{s.date}</td>
                        <td className="px-4 py-3 text-midnight-700 tabular-nums">{formatDuration(s.duration)}</td>
                        <td className="px-4 py-3 text-midnight-700 tabular-nums">{s.checkIns}</td>
                        <td className="px-4 py-3"><RatingDot value={s.avgMood} /></td>
                        <td className="px-4 py-3"><RatingDot value={s.avgFocus} /></td>
                        <td className="px-4 py-3"><RatingDot value={s.avgEnergy} /></td>
                        <td className="px-4 py-3"><RatingDot value={s.avgStress} inverted /></td>
                        <td className="px-4 py-3">
                          {s.id.startsWith('sample-') ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-midnight-50 border border-midnight-200 px-2 py-0.5 text-[10px] font-semibold text-midnight-500">
                              <Info className="h-2.5 w-2.5" /> Sample
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 border border-forest-200 px-2 py-0.5 text-[10px] font-semibold text-forest-700">
                              <CheckCircle className="h-2.5 w-2.5" /> Yours
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-midnight-100">
                {sessions.map((s) => (
                  <div key={s.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-midnight-800 text-sm">{s.date}</span>
                      {s.id.startsWith('sample-') ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-midnight-50 border border-midnight-200 px-2 py-0.5 text-[10px] font-semibold text-midnight-500">
                          <Info className="h-2.5 w-2.5" /> Sample
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 border border-forest-200 px-2 py-0.5 text-[10px] font-semibold text-forest-700">
                          <CheckCircle className="h-2.5 w-2.5" /> Yours
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-midnight-600">
                      <span>Duration: <strong className="text-midnight-800 tabular-nums">{formatDuration(s.duration)}</strong></span>
                      <span>Check-ins: <strong className="text-midnight-800 tabular-nums">{s.checkIns}</strong></span>
                      <span>Mood: <strong className="text-midnight-800">{s.avgMood}/10</strong></span>
                      <span>Focus: <strong className="text-midnight-800">{s.avgFocus}/10</strong></span>
                      <span>Energy: <strong className="text-midnight-800">{s.avgEnergy}/10</strong></span>
                      <span>Stress: <strong className="text-midnight-800">{s.avgStress}/10</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <Reveal className="mt-12">
          <div className="rounded-xl bg-midnight-900 p-8 text-center">
            <h3 className="font-display text-xl font-bold text-ivory-100 mb-2">
              Ready to explore brainwave training programs?
            </h3>
            <p className="text-sm text-midnight-200 max-w-md mx-auto mb-5">
              Browse our programs or speak with our team about a consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('programs')}
                className="inline-flex items-center gap-2 rounded-lg bg-forest-600 px-5 py-2.5 text-sm font-semibold text-ivory-50 transition-all hover:bg-forest-500 active:scale-95"
              >
                View Programs <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('booking')}
                className="inline-flex items-center gap-2 rounded-lg border border-midnight-600 px-5 py-2.5 text-sm font-semibold text-ivory-100 transition-all hover:bg-midnight-800 active:scale-95"
              >
                Book a Consultation <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function RatingDot({ value, inverted = false }: { value: number; inverted?: boolean }) {
  if (value === 0) return <span className="text-midnight-400 text-xs">—</span>;
  const colorClass = inverted
    ? value <= 3
      ? 'bg-forest-500'
      : value <= 6
      ? 'bg-amber-500'
      : 'bg-red-500'
    : value <= 3
    ? 'bg-red-500'
    : value <= 6
    ? 'bg-amber-500'
    : 'bg-forest-500';
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
      <span className="text-midnight-700 tabular-nums text-xs">{value}/10</span>
    </div>
  );
}

function ProgressChart({ data }: { data: { label: string; mood: number; focus: number; energy: number; stress: number }[] }) {
  const metrics = [
    { key: 'mood' as const, label: 'Mood', color: 'bg-forest-500' },
    { key: 'focus' as const, label: 'Focus', color: 'bg-cyan-500' },
    { key: 'energy' as const, label: 'Energy', color: 'bg-midnight-500' },
    { key: 'stress' as const, label: 'Stress', color: 'bg-amber-500' },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        {metrics.map((m) => (
          <div key={m.key} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${m.color}`} />
            <span className="text-xs text-midnight-600">{m.label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="text-xs font-medium text-midnight-500 w-8 shrink-0">{d.label}</span>
            <div className="flex-1 flex gap-1">
              {metrics.map((m) => {
                const val = d[m.key];
                return (
                  <div key={m.key} className="flex-1">
                    <div className="h-2 rounded-full bg-ivory-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${m.color} transition-all duration-500`}
                        style={{ width: `${val * 10}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="text-xs text-midnight-400 w-8 shrink-0 text-right">{d.mood}/10</span>
          </div>
        ))}
      </div>
    </div>
  );
}
