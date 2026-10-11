import { useEffect, useRef } from 'react';

/**
 * Animated neural network background using canvas.
 * Renders drifting nodes with connecting lines that brighten based on proximity.
 * Respects prefers-reduced-motion (renders a static frame).
 */
export function NeuralNetworkCanvas({
  className = '',
  dark = false,
  density = 40,
}: {
  className?: string;
  dark?: boolean;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodeColor = dark ? 'rgba(34, 211, 238, ' : 'rgba(61, 122, 85, ';
    const lineColor = dark ? 'rgba(34, 211, 238, ' : 'rgba(45, 97, 66, ';

    let width = 0;
    let height = 0;
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    let animationId = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = rect.width;
      height = rect.height;
      canvas.width = width * (window.devicePixelRatio || 1);
      canvas.height = height * (window.devicePixelRatio || 1);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

      const count = Math.min(density, Math.floor((width * height) / 12000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      // Draw connections
      const maxDist = 130;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.25;
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        ctx.fillStyle = `${nodeColor}0.5)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) {
        animationId = requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [dark, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}

export function NeuralBackground({
  className = '',
  variant = 'light',
}: {
  className?: string;
  variant?: 'light' | 'dark';
}) {
  if (variant === 'dark') {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        <NeuralNetworkCanvas dark density={35} />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/8 blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-midnight-500/20 blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute top-1/2 right-1/3 h-64 w-64 rounded-full bg-forest-600/8 blur-3xl animate-pulse-soft" />
      </div>
    );
  }
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <NeuralNetworkCanvas density={30} />
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-forest-200/40 blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-ivory-300/50 blur-3xl animate-float"
        style={{ animationDelay: '2s' }}
      />
      <div className="absolute top-1/2 right-1/3 h-64 w-64 rounded-full bg-gold-200/15 blur-3xl animate-pulse-soft" />
    </div>
  );
}

export function BrainwaveVisual({
  className = '',
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const bars = [40, 65, 35, 80, 55, 90, 45, 70, 30, 60, 85, 50, 75, 40, 95, 55];
  const barColor = dark ? 'from-cyan-600 to-cyan-300' : 'from-forest-600 to-forest-400';
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full bg-gradient-to-t ${barColor} animate-wave motion-reduce:animate-none`}
          style={{
            height: `${h}%`,
            animationDelay: `${i * 100}ms`,
            animationDuration: `${2 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  );
}

export function NeuralNetworkGraphic({
  className = '',
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const nodes = [
    { x: 15, y: 30, delay: 0 },
    { x: 15, y: 70, delay: 0.5 },
    { x: 50, y: 20, delay: 1 },
    { x: 50, y: 50, delay: 1.5 },
    { x: 50, y: 80, delay: 2 },
    { x: 85, y: 40, delay: 2.5 },
    { x: 85, y: 65, delay: 3 },
  ];
  const links: [number, number][] = [
    [0, 2],
    [0, 3],
    [1, 3],
    [1, 4],
    [2, 5],
    [3, 5],
    [3, 6],
    [4, 6],
  ];
  const lineColor = dark ? 'rgba(34, 211, 238, 0.12)' : 'rgba(45, 97, 66, 0.12)';
  const nodeColor = dark ? 'rgba(34, 211, 238, 0.6)' : 'rgba(61, 122, 85, 0.55)';
  const accentColor = dark ? 'rgba(34, 211, 238, 0.8)' : 'rgba(6, 182, 212, 0.7)';

  return (
    <div className={`relative ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke={lineColor}
            strokeWidth="0.3"
          />
        ))}
        {nodes.map((node, i) => (
          <g key={i}>
            <circle
              cx={node.x}
              cy={node.y}
              r="2.5"
              fill="none"
              stroke={accentColor}
              strokeWidth="0.3"
              className="animate-pulse-soft motion-reduce:animate-none"
              style={{ animationDelay: `${node.delay}s` }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="1.5"
              fill={nodeColor}
              className="animate-pulse-soft motion-reduce:animate-none"
              style={{ animationDelay: `${node.delay}s` }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/**
 * Enhanced EEG head graphic with animated signal paths, scanning line,
 * and pulse rings on electrodes. Gives a 3D-scanning feel without WebGL.
 */
export function EEGHeadGraphic({ className = '' }: { className?: string }) {
  const electrodes = [
    { x: 70, y: 65 },
    { x: 100, y: 55 },
    { x: 130, y: 65 },
    { x: 60, y: 95 },
    { x: 140, y: 95 },
    { x: 75, y: 130 },
    { x: 100, y: 140 },
    { x: 125, y: 130 },
  ];

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.08)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
          </radialGradient>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
            <stop offset="50%" stopColor="rgba(34, 211, 238, 0.3)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
          </linearGradient>
        </defs>

        {/* Brain glow */}
        <ellipse cx="100" cy="105" rx="65" ry="72" fill="url(#brainGlow)" />

        {/* Head outline */}
        <ellipse
          cx="100"
          cy="105"
          rx="55"
          ry="65"
          fill="none"
          stroke="rgba(45, 97, 66, 0.15)"
          strokeWidth="1.5"
        />

        {/* Inner head outline for 3D depth */}
        <ellipse
          cx="100"
          cy="105"
          rx="48"
          ry="58"
          fill="none"
          stroke="rgba(45, 97, 66, 0.06)"
          strokeWidth="0.8"
        />

        {/* Scanning line */}
        <rect
          x="45"
          y="40"
          width="110"
          height="2"
          fill="url(#scanGrad)"
          className="animate-scan motion-reduce:animate-none"
        />

        {/* EEG electrode positions with pulse rings */}
        {electrodes.map((pos, i) => (
          <g key={i}>
            {/* Pulse ring */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="3"
              fill="none"
              stroke="rgba(6, 182, 212, 0.4)"
              strokeWidth="0.5"
              className="animate-pulse-ring motion-reduce:animate-none"
              style={{ animationDelay: `${i * 0.4}s`, transformOrigin: `${pos.x}px ${pos.y}px` }}
            />
            {/* Outer ring */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="6"
              fill="none"
              stroke="rgba(6, 182, 212, 0.2)"
              strokeWidth="0.5"
            />
            {/* Electrode dot */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="3"
              fill="rgba(6, 182, 212, 0.6)"
              className="animate-pulse-soft motion-reduce:animate-none"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          </g>
        ))}

        {/* Connecting lines */}
        <line x1="70" y1="65" x2="100" y2="55" stroke="rgba(45, 97, 66, 0.1)" strokeWidth="0.5" />
        <line x1="100" y1="55" x2="130" y2="65" stroke="rgba(45, 97, 66, 0.1)" strokeWidth="0.5" />
        <line x1="60" y1="95" x2="75" y2="130" stroke="rgba(45, 97, 66, 0.1)" strokeWidth="0.5" />
        <line x1="140" y1="95" x2="125" y2="130" stroke="rgba(45, 97, 66, 0.1)" strokeWidth="0.5" />
        <line x1="70" y1="65" x2="60" y2="95" stroke="rgba(45, 97, 66, 0.1)" strokeWidth="0.5" />
        <line x1="130" y1="65" x2="140" y2="95" stroke="rgba(45, 97, 66, 0.1)" strokeWidth="0.5" />
        <line x1="75" y1="130" x2="100" y2="140" stroke="rgba(45, 97, 66, 0.1)" strokeWidth="0.5" />
        <line x1="100" y1="140" x2="125" y2="130" stroke="rgba(45, 97, 66, 0.1)" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

/**
 * A compact 3D-style rotating brain visualization using layered SVG ellipses
 * with a gentle drift animation. Gives depth without WebGL overhead.
 */
export function BrainOrb({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full animate-drift motion-reduce:animate-none">
        <defs>
          <radialGradient id="orbCore" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.12)" />
            <stop offset="50%" stopColor="rgba(34, 211, 238, 0.04)" />
            <stop offset="100%" stopColor="rgba(12, 17, 32, 0)" />
          </radialGradient>
          <radialGradient id="orbHighlight" cx="35%" cy="30%" r="40%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.06)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>
        </defs>

        {/* Outer glow layers for depth */}
        <circle cx="100" cy="100" r="80" fill="url(#orbCore)" />
        <circle cx="100" cy="100" r="60" fill="rgba(34, 211, 238, 0.03)" />

        {/* Brain hemisphere folds — concentric paths */}
        <g stroke="rgba(34, 211, 238, 0.15)" strokeWidth="0.8" fill="none">
          <path d="M 100 45 Q 130 55 135 80 Q 140 105 125 130 Q 110 145 100 150 Q 90 145 75 130 Q 60 105 65 80 Q 70 55 100 45 Z" />
          <path d="M 100 55 Q 125 62 128 85 Q 132 105 120 125 Q 108 138 100 142 Q 92 138 80 125 Q 68 105 72 85 Q 75 62 100 55 Z" />
          <path d="M 100 65 Q 118 72 120 88 Q 124 105 115 120 Q 106 130 100 133 Q 94 130 85 120 Q 76 105 80 88 Q 82 72 100 65 Z" />
        </g>

        {/* Central fissure line */}
        <line x1="100" y1="48" x2="100" y2="148" stroke="rgba(34, 211, 238, 0.08)" strokeWidth="0.5" />

        {/* Highlight */}
        <circle cx="80" cy="75" r="30" fill="url(#orbHighlight)" />

        {/* Neural pulse points scattered on brain */}
        {[
          { x: 85, y: 75 },
          { x: 115, y: 85 },
          { x: 95, y: 100 },
          { x: 110, y: 115 },
          { x: 80, y: 110 },
          { x: 105, y: 130 },
        ].map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="1.5"
            fill="rgba(34, 211, 238, 0.5)"
            className="animate-pulse-soft motion-reduce:animate-none"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
