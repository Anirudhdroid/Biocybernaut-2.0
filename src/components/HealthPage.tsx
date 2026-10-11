import { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  Zap,
  Server,
  Shield,
  Gauge,
  Wifi,
  Info,
} from 'lucide-react';
import { NeuralBackground } from './Visuals';

interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  icon: typeof Activity;
}

const initialMetrics: Metric[] = [
  { id: 'uptime', name: 'Uptime', value: 0, unit: '%', status: 'good', icon: Activity },
  { id: 'response', name: 'Avg Response Time', value: 0, unit: 'ms', status: 'good', icon: Zap },
  { id: 'load', name: 'Page Load Time', value: 0, unit: 'ms', status: 'good', icon: Gauge },
  { id: 'ssl', name: 'SSL Certificate', value: 0, unit: ' days left', status: 'good', icon: Shield },
  { id: 'dns', name: 'DNS Resolution', value: 0, unit: 'ms', status: 'good', icon: Wifi },
  { id: 'server', name: 'Server Health', value: 0, unit: '%', status: 'good', icon: Server },
];

const targetValues: Record<string, number> = {
  uptime: 99.98,
  response: 142,
  load: 1180,
  ssl: 87,
  dns: 24,
  server: 96,
};

const finalStatuses: Record<string, Metric['status']> = {
  uptime: 'good',
  response: 'good',
  load: 'warning',
  ssl: 'good',
  dns: 'good',
  server: 'good',
};

const statusConfig: Record<Metric['status'], { color: string; bgColor: string; label: string; icon: typeof CheckCircle }> = {
  good: { color: 'text-forest-700', bgColor: 'bg-forest-50 border-forest-200', label: 'Healthy', icon: CheckCircle },
  warning: { color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', label: 'Warning', icon: AlertCircle },
  critical: { color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', label: 'Critical', icon: AlertCircle },
};

export function HealthPage() {
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [progress, setProgress] = useState(0);

  const runChecks = () => {
    if (isRunning) return;
    setIsRunning(true);
    setHasRun(false);
    setProgress(0);
    setMetrics(initialMetrics.map((m) => ({ ...m, value: 0 })));

    let step = 0;
    const totalSteps = 30;
    const interval = setInterval(() => {
      step++;
      const pct = (step / totalSteps) * 100;
      setProgress(pct);
      setMetrics((prev) =>
        prev.map((m) => {
          const target = targetValues[m.id];
          const current = target * (step / totalSteps);
          return { ...m, value: Math.min(current, target) };
        }),
      );

      if (step >= totalSteps) {
        clearInterval(interval);
        setMetrics((prev) =>
          prev.map((m) => ({ ...m, value: targetValues[m.id], status: finalStatuses[m.id] })),
        );
        setIsRunning(false);
        setHasRun(true);
      }
    }, 50);
  };

  useEffect(() => {
    return () => { /* cleanup handled by interval clear in runChecks */ };
  }, []);

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden border-b border-midnight-200/40">
        <NeuralBackground />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="section-label">
              <Activity className="h-3 w-3" />
              Site Health Dashboard
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-midnight-200 bg-midnight-50 px-3 py-1 text-xs font-semibold text-midnight-600">
              <Shield className="h-3 w-3" />
              Internal Demo
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold text-midnight-900 sm:text-5xl text-balance">
            Performance <span className="text-forest-700">& Reliability</span>
          </h1>
          <p className="mt-4 max-w-2xl text-midnight-600 text-lg">
            A simulated dashboard showing key website health metrics. Run the
            checks to see animated results — this is a demonstration only, not real
            monitoring data.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-20">
        {/* Simulated data notice */}
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-300/40 bg-amber-50 px-4 py-3">
          <Info className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800">
            <strong>Simulated data.</strong> All metrics shown are generated for demonstration purposes only.
            This is not connected to any real monitoring service.
          </p>
        </div>

        {/* Run controls */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-midnight-900 mb-1">Run Health Check</h2>
            <p className="text-sm text-midnight-500">Simulates a full diagnostic scan of the website.</p>
          </div>
          <button onClick={runChecks} disabled={isRunning}
            className="btn-accent disabled:opacity-60 disabled:cursor-not-allowed">
            {isRunning ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Running Checks...</>
            ) : hasRun ? (
              <><RefreshCw className="h-4 w-4" />Run Again</>
            ) : (
              <><Zap className="h-4 w-4" />Start Health Check</>
            )}
          </button>
        </div>

        {/* Progress bar */}
        {isRunning && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-midnight-700">Scanning...</span>
              <span className="text-sm font-medium text-forest-700">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ivory-200">
              <div className="h-full rounded-full bg-gradient-to-r from-forest-600 to-forest-400 transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Metrics grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const cfg = hasRun ? statusConfig[metric.status] : null;
            return (
              <div key={metric.id} className="card card-hover p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ivory-100 border border-midnight-200">
                    <Icon className="h-5 w-5 text-midnight-700" />
                  </div>
                  {cfg && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bgColor} ${cfg.color}`}>
                      <cfg.icon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-midnight-600 mb-1">{metric.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-midnight-900 tabular-nums">
                    {metric.id === 'uptime' || metric.id === 'server' ? metric.value.toFixed(2) : Math.round(metric.value)}
                  </span>
                  <span className="text-sm text-midnight-500">{metric.unit}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Results table */}
        {hasRun && (
          <div className="mt-10 animate-fade-in-up">
            <h2 className="font-display text-lg font-bold text-midnight-900 mb-4">Detailed Results</h2>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-midnight-200 bg-ivory-50 text-left">
                      <th className="px-4 py-3 font-semibold text-midnight-700">Metric</th>
                      <th className="px-4 py-3 font-semibold text-midnight-700">Value</th>
                      <th className="px-4 py-3 font-semibold text-midnight-700">Status</th>
                      <th className="px-4 py-3 font-semibold text-midnight-700">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric, i) => {
                      const cfg = statusConfig[metric.status];
                      const notes: Record<string, string> = {
                        uptime: 'Above 99.9% SLA target',
                        response: 'Within acceptable range',
                        load: 'Above recommended 1000ms — consider optimization',
                        ssl: 'Certificate valid and up-to-date',
                        dns: 'Resolution time is excellent',
                        server: 'All systems nominal',
                      };
                      return (
                        <tr key={metric.id} className={i % 2 === 0 ? 'bg-white' : 'bg-ivory-50/50'}>
                          <td className="px-4 py-3 font-medium text-midnight-800">{metric.name}</td>
                          <td className="px-4 py-3 text-midnight-700 tabular-nums">
                            {metric.id === 'uptime' || metric.id === 'server' ? metric.value.toFixed(2) : Math.round(metric.value)}{metric.unit}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bgColor} ${cfg.color}`}>
                              <cfg.icon className="h-3 w-3" />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-midnight-500">{notes[metric.id]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {hasRun && !isRunning && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3 animate-fade-in-up">
            <div className="card p-5 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-forest-600" />
              <div>
                <div className="font-display text-2xl font-bold text-midnight-900">
                  {metrics.filter((m) => m.status === 'good').length}
                </div>
                <div className="text-xs text-midnight-500">Healthy</div>
              </div>
            </div>
            <div className="card p-5 flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-amber-600" />
              <div>
                <div className="font-display text-2xl font-bold text-midnight-900">
                  {metrics.filter((m) => m.status === 'warning').length}
                </div>
                <div className="text-xs text-midnight-500">Warnings</div>
              </div>
            </div>
            <div className="card p-5 flex items-center gap-3">
              <Clock className="h-8 w-8 text-midnight-700" />
              <div>
                <div className="font-display text-2xl font-bold text-midnight-900">
                  {metrics.filter((m) => m.status === 'critical').length}
                </div>
                <div className="text-xs text-midnight-500">Critical</div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
