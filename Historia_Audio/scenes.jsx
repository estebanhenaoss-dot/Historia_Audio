// scenes.jsx — engineering schematic animation of the BELA / Pure Data sensor system

const INK         = '#0a0a0a';
const PAPER       = '#efece2';
const MONO        = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
const SERIF       = 'Inter, system-ui, sans-serif';

const W = 1920;
const H = 1080;
const DUR = 30;

// ── helpers ───────────────────────────────────────────────────────────────

// stroke-dash drawing-in: returns a {strokeDasharray, strokeDashoffset, opacity}
// driven by localTime within a window.
function drawIn(localTime, { start = 0, dur = 0.8, length = 1000, hold = true } = {}) {
  if (localTime < start) return { strokeDasharray: length, strokeDashoffset: length, opacity: 0 };
  const t = Math.min(1, (localTime - start) / dur);
  const eased = Easing.easeOutCubic(t);
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - eased),
    opacity: 1,
  };
}

// ── paper / frame chrome ──────────────────────────────────────────────────

function Paper() {
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id="grid-fine" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={INK} strokeOpacity="0.045" strokeWidth="0.5" />
        </pattern>
        <pattern id="grid-bold" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke={INK} strokeOpacity="0.09" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#grid-fine)" />
      <rect width={W} height={H} fill="url(#grid-bold)" />
    </svg>
  );
}

function Frame() {
  const t = useTime();
  const draw = drawIn(t, { dur: 1.4, length: 2 * (W + H) - 240 });
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {/* outer rule */}
      <rect
        x="40" y="40" width={W - 80} height={H - 80}
        fill="none" stroke={INK} strokeWidth="1.2"
        {...draw}
      />
      {/* corner crosses */}
      {[[40,40],[W-40,40],[40,H-40],[W-40,H-40]].map(([x,y],i)=> (
        <g key={i} stroke={INK} strokeWidth="1" opacity={Math.min(1, Math.max(0, (t-0.4)*2))}>
          <line x1={x-10} y1={y} x2={x+10} y2={y}/>
          <line x1={x} y1={y-10} x2={x} y2={y+10}/>
        </g>
      ))}
    </svg>
  );
}

function TitleBlock() {
  const t = useTime();
  const op = Math.min(1, Math.max(0, (t - 0.8) * 1.4));
  return (
    <div style={{
      position: 'absolute', right: 60, bottom: 60,
      fontFamily: MONO, fontSize: 13, color: INK, opacity: op,
      textTransform: 'uppercase', letterSpacing: '0.12em',
      textAlign: 'right', lineHeight: 1.7,
      whiteSpace: 'nowrap',
    }}>
      <div style={{ borderBottom: `1px solid ${INK}`, paddingBottom: 6, marginBottom: 6 }}>
        FIG. 16 &nbsp;·&nbsp; SIGNAL CHAIN DIAGRAM
      </div>
      <div style={{ opacity: 0.55 }}>BELA CTAG BEAST &nbsp;·&nbsp; PURE DATA &nbsp;·&nbsp; AMBISONIC</div>
      <div style={{ opacity: 0.55 }}>SHEET 01 / 01 &nbsp;·&nbsp; REV. A &nbsp;·&nbsp; SCALE  N.T.S.</div>
    </div>
  );
}

function Timecode() {
  const t = useTime();
  const sec = Math.floor(t).toString().padStart(2, '0');
  const cs = Math.floor((t * 100) % 100).toString().padStart(2, '0');
  return (
    <div style={{
      position: 'absolute', left: 60, bottom: 60,
      fontFamily: MONO, fontSize: 13, color: INK, opacity: 0.55,
      textTransform: 'uppercase', letterSpacing: '0.12em',
      lineHeight: 1.7,
    }}>
      <div style={{ borderBottom: `1px solid ${INK}40`, paddingBottom: 6, marginBottom: 6, opacity: 0.7 }}>
        T + {sec}.{cs}s
      </div>
      <div style={{ opacity: 0.7 }}>PD ENGINE · 44.1 kHz</div>
    </div>
  );
}

// ── scene 1: opening title ────────────────────────────────────────────────

function SceneTitle() {
  return (
    <Sprite start={0.2} end={4.6}>
      {({ localTime, duration }) => {
        const exit = Math.max(0, (localTime - (duration - 0.6)) / 0.6);
        const op = Math.min(1, Math.max(0, (localTime - 0.4) * 1.2)) * (1 - exit);
        const charDelay = 0.04;
        const text = 'REAL-TIME DSP SIGNAL CHAIN';
        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            opacity: op,
          }}>
            <div style={{
              fontFamily: MONO, fontSize: 16, color: INK,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              opacity: 0.5, marginBottom: 28,
            }}>
              ⎯⎯⎯⎯  fig. 16  ⎯⎯⎯⎯
            </div>
            <div style={{
              fontFamily: SERIF, fontSize: 92, fontWeight: 500,
              color: INK, letterSpacing: '-0.02em', lineHeight: 1,
            }}>
              {text.split('').map((c, i) => {
                const cop = Math.min(1, Math.max(0, (localTime - 0.6 - i * charDelay) * 4));
                return <span key={i} style={{ opacity: cop, display: 'inline-block' }}>{c === ' ' ? '\u00a0' : c}</span>;
              })}
            </div>
            <div style={{
              fontFamily: MONO, fontSize: 22, color: INK, opacity: 0.7,
              letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 32,
            }}>
              BELA CTAG BEAST · Pure Data · 8× ultrasonic + 1× mic
            </div>
            {/* horizontal rule that draws in */}
            <svg width="600" height="2" style={{ marginTop: 48 }}>
              <line
                x1="0" y1="1" x2="600" y2="1"
                stroke={INK} strokeWidth="1"
                strokeDasharray="600"
                strokeDashoffset={600 * (1 - Easing.easeOutCubic(Math.min(1, localTime / 1.4)))}
              />
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── reusable: animated wavefront pulses out of a point ────────────────────

function WaveBurst({ cx, cy, maxR = 220, period = 1.2, count = 3, t, t0 = 0, color = INK, opacity = 0.55, sweep = 360, rotation = 0 }) {
  const arcs = [];
  for (let i = 0; i < count; i++) {
    const phase = ((t - t0) / period + i / count) % 1;
    if (phase < 0) continue;
    const r = phase * maxR;
    const op = (1 - phase) * opacity;
    if (sweep >= 360) {
      arcs.push(
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="1.2" opacity={op}/>
      );
    } else {
      // partial arc, centered on `rotation` (degrees, 0 = right, 90 = down)
      const sweepRad = (sweep * Math.PI) / 180;
      const start = rotation * Math.PI / 180 - sweepRad / 2;
      const end = rotation * Math.PI / 180 + sweepRad / 2;
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const large = sweep > 180 ? 1 : 0;
      arcs.push(
        <path key={i}
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
          fill="none" stroke={color} strokeWidth="1.4" opacity={op}/>
      );
    }
  }
  return <g>{arcs}</g>;
}

// ── sensor glyph (TX/RX paired cylinders) ─────────────────────────────────

function SensorGlyph({ x, y, label, rotation = 0, scale = 1 }) {
  // Two cylinders side by side: TX (left), RX (right), facing "up"
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
      {/* mounting board */}
      <rect x="-30" y="-4" width="60" height="20" fill={PAPER} stroke={INK} strokeWidth="1.2"/>
      <line x1="-30" y1="6" x2="30" y2="6" stroke={INK} strokeOpacity="0.3" strokeWidth="0.6"/>
      {/* TX cylinder */}
      <circle cx="-14" cy="-4" r="11" fill={PAPER} stroke={INK} strokeWidth="1.4"/>
      <circle cx="-14" cy="-4" r="6" fill="none" stroke={INK} strokeWidth="0.6" strokeOpacity="0.6"/>
      <text x="-14" y="-2" fontFamily={MONO} fontSize="8" fill={INK} textAnchor="middle" fontWeight="600">TX</text>
      {/* RX cylinder */}
      <circle cx="14" cy="-4" r="11" fill={PAPER} stroke={INK} strokeWidth="1.4"/>
      <circle cx="14" cy="-4" r="6" fill="none" stroke={INK} strokeWidth="0.6" strokeOpacity="0.6"/>
      <text x="14" y="-2" fontFamily={MONO} fontSize="8" fill={INK} textAnchor="middle" fontWeight="600">RX</text>
      {/* pins */}
      {[-18,-6,6,18].map(px=>(
        <line key={px} x1={px} y1="16" x2={px} y2="22" stroke={INK} strokeWidth="1"/>
      ))}
      {label && (
        <text x="0" y="38" fontFamily={MONO} fontSize="11" fill={INK} textAnchor="middle"
          fontWeight="700" letterSpacing="0.05em">{label}</text>
      )}
    </g>
  );
}

// ── BELA board glyph ──────────────────────────────────────────────────────

function BelaBoard({ cx, cy, w = 360, h = 220 }) {
  const x = cx - w/2, y = cy - h/2;
  return (
    <g>
      {/* PCB outline */}
      <rect x={x} y={y} width={w} height={h} fill={PAPER} stroke={INK} strokeWidth="1.6"/>
      {/* inner trace rect */}
      <rect x={x+10} y={y+10} width={w-20} height={h-20} fill="none" stroke={INK} strokeWidth="0.6" strokeOpacity="0.35"/>
      {/* mounting holes */}
      {[[x+14,y+14],[x+w-14,y+14],[x+14,y+h-14],[x+w-14,y+h-14]].map(([px,py],i)=>(
        <g key={i}>
          <circle cx={px} cy={py} r="5" fill="none" stroke={INK} strokeWidth="0.8"/>
          <circle cx={px} cy={py} r="2" fill={INK}/>
        </g>
      ))}
      {/* big SoC chip */}
      <rect x={cx-50} y={cy-32} width={100} height={64} fill="none" stroke={INK} strokeWidth="1.2"/>
      {/* chip pins */}
      {Array.from({length: 10}).map((_, i)=>{
        const px = cx - 45 + i * 10;
        return (
          <g key={i}>
            <line x1={px} y1={cy-32} x2={px} y2={cy-36} stroke={INK} strokeWidth="0.8"/>
            <line x1={px} y1={cy+32} x2={px} y2={cy+36} stroke={INK} strokeWidth="0.8"/>
          </g>
        );
      })}
      {Array.from({length: 6}).map((_, i)=>{
        const py = cy - 25 + i * 10;
        return (
          <g key={i}>
            <line x1={cx-50} y1={py} x2={cx-54} y2={py} stroke={INK} strokeWidth="0.8"/>
            <line x1={cx+50} y1={py} x2={cx+54} y2={py} stroke={INK} strokeWidth="0.8"/>
          </g>
        );
      })}
      <text x={cx} y={cy+2} fontFamily={MONO} fontSize="13" fontWeight="700"
        fill={INK} textAnchor="middle" letterSpacing="0.1em">CTAG · BEAST</text>
      <text x={cx} y={cy+18} fontFamily={MONO} fontSize="9"
        fill={INK} opacity="0.6" textAnchor="middle" letterSpacing="0.18em">XENOMAI · RT</text>

      {/* GPIO header — bottom */}
      <g>
        {Array.from({length: 16}).map((_, i)=>{
          const px = x + 30 + i * 18;
          return <rect key={i} x={px-2} y={y+h-22} width="4" height="10" fill={INK}/>;
        })}
        <text x={x+30+8*18-10} y={y+h-6} fontFamily={MONO} fontSize="8" fill={INK} opacity="0.6"
          textAnchor="middle" letterSpacing="0.15em">ANALOG IN  ·  0–7</text>
      </g>
      {/* I/O — top */}
      <g>
        {Array.from({length: 10}).map((_, i)=>{
          const px = x + 50 + i * 16;
          return <rect key={i} x={px-2} y={y+12} width="4" height="8" fill={INK}/>;
        })}
        <text x={x+50+5*16-8} y={y+30} fontFamily={MONO} fontSize="8" fill={INK} opacity="0.6"
          textAnchor="middle" letterSpacing="0.15em">AUDIO OUT  ·  AMBISONIC</text>
      </g>
      {/* board label corner */}
      <text x={x+12} y={y+h-6} fontFamily={MONO} fontSize="8" fill={INK} opacity="0.5"
        letterSpacing="0.15em">PCB · v1.2</text>
    </g>
  );
}

// ── microphone glyph ──────────────────────────────────────────────────────

function MicGlyph({ cx, cy, scale = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-14" y="-26" width="28" height="40" rx="14" fill={PAPER} stroke={INK} strokeWidth="1.4"/>
      {[-18, -10, -2, 6].map((py, i) => (
        <line key={i} x1="-8" y1={py} x2="8" y2={py} stroke={INK} strokeWidth="0.8" strokeOpacity="0.7"/>
      ))}
      <path d="M -18 18 Q -18 30 0 30 Q 18 30 18 18" fill="none" stroke={INK} strokeWidth="1.2"/>
      <line x1="0" y1="30" x2="0" y2="42" stroke={INK} strokeWidth="1.2"/>
      <line x1="-10" y1="42" x2="10" y2="42" stroke={INK} strokeWidth="1.2"/>
      <text x="0" y="60" fontFamily={MONO} fontSize="11" fill={INK} textAnchor="middle"
        fontWeight="700" letterSpacing="0.1em">MIC</text>
    </g>
  );
}

// ── scene 2: system overview ──────────────────────────────────────────────

function SceneOverview() {
  return (
    <Sprite start={4.4} end={10.6}>
      {({ localTime, duration }) => {
        const fadeIn = Math.min(1, Math.max(0, (localTime - 0.1) * 2));
        const fadeOut = 1 - Math.min(1, Math.max(0, (localTime - (duration - 0.6)) / 0.6));
        const op = fadeIn * fadeOut;
        const cx = W / 2;
        const cy = H / 2 + 30;

        // 8 sensors around the room — in a wide arc (top half), as if mounted on wall
        const sensors = Array.from({ length: 8 }).map((_, i) => {
          // angles from -110° to +110° (top arc, wide)
          const ang = -110 + (i * 220) / 7;
          const rad = (ang * Math.PI) / 180;
          const R = 460;
          return {
            i, ang,
            x: cx + R * Math.sin(rad),
            y: cy - R * Math.cos(rad) * 0.55, // squashed vertically
            rot: ang,
            label: 'S' + (i + 1),
          };
        });

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              {/* dotted reference arc */}
              <ellipse cx={cx} cy={cy} rx="520" ry="290" fill="none" stroke={INK}
                strokeWidth="0.6" strokeOpacity="0.35" strokeDasharray="4 6"
                {...drawIn(localTime, { start: 0.2, dur: 1.0, length: 2 * Math.PI * 400 })}/>

              {/* radial leader lines from BELA to each sensor */}
              {sensors.map((s, i) => {
                const start = 0.5 + i * 0.08;
                const dl = drawIn(localTime, { start, dur: 0.5, length: 700 });
                return (
                  <g key={i}>
                    <line x1={cx} y1={cy} x2={s.x} y2={s.y}
                      stroke={INK} strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="3 4"
                      {...dl}/>
                  </g>
                );
              })}

              {/* BELA board — draws in */}
              <g {...drawIn(localTime, { start: 0.0, dur: 1.0, length: 1200 })}>
                <BelaBoard cx={cx} cy={cy} w={380} h={220}/>
              </g>

              {/* sensors fade in one by one */}
              {sensors.map((s, i) => {
                const t0 = 0.9 + i * 0.09;
                const sop = Math.min(1, Math.max(0, (localTime - t0) * 3));
                const scl = 1.4;
                return (
                  <g key={i} opacity={sop} transform={`translate(0 0)`}>
                    <SensorGlyph x={s.x} y={s.y} label={s.label} rotation={0} scale={scl}/>
                  </g>
                );
              })}

              {/* mic in foreground — offset to the right so it doesn't collide with title block */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.6) * 2))}>
                <MicGlyph cx={cx - 380} cy={cy + 290} scale={1.4}/>
                {/* mic to bela line */}
                <line x1={cx - 380} y1={cy + 290 - 36} x2={cx - 100} y2={cy + 80}
                  stroke={INK} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 4"/>
              </g>

              {/* annotations */}
              <Annotation
                t={localTime} t0={2.0}
                ax={cx - 660} ay={cy - 320}
                tx={sensors[1].x - 60} ty={sensors[1].y - 40}
                label="8× ULTRASONIC SENSOR"
                sub="HC-SR04 / ECHO DELAY"
              />
              <Annotation
                t={localTime} t0={2.6}
                ax={cx + 660} ay={cy - 280}
                tx={cx + 200} ty={cy - 30}
                label="BELA CTAG BEAST"
                sub="PURE DATA · REAL-TIME"
                right
              />
              <Annotation
                t={localTime} t0={3.2}
                ax={cx - 720} ay={cy + 320}
                tx={cx - 380} ty={cy + 268}
                label="OMNI MIC IN"
                sub="ROOM CAPTURE"
              />
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

// callout annotation with elbow leader line
function Annotation({ t, t0 = 0, ax, ay, tx, ty, label, sub, right = false }) {
  const op = Math.min(1, Math.max(0, (t - t0) * 2));
  const dl = drawIn(t, { start: t0, dur: 0.5, length: 600 });
  // elbow path
  const mx = ax + (tx - ax) * 0.6;
  const d = `M ${ax} ${ay} L ${mx} ${ay} L ${tx} ${ty}`;
  return (
    <g opacity={op}>
      <path d={d} fill="none" stroke={INK} strokeWidth="0.9" {...dl}/>
      <circle cx={tx} cy={ty} r="2.5" fill={INK}/>
      <circle cx={ax} cy={ay} r="2" fill={PAPER} stroke={INK} strokeWidth="1"/>
      <g transform={`translate(${ax} ${ay - 8})`}>
        <text x={right ? 8 : -8} y="-14" fontFamily={MONO} fontSize="14" fill={INK}
          fontWeight="700" letterSpacing="0.08em"
          textAnchor={right ? 'start' : 'end'}>{label}</text>
        <text x={right ? 8 : -8} y="2" fontFamily={MONO} fontSize="11" fill={INK}
          opacity="0.55" letterSpacing="0.12em"
          textAnchor={right ? 'start' : 'end'}>{sub}</text>
      </g>
    </g>
  );
}

// ── scene 3: zoom into a sensor — TX / object / RX echo ───────────────────

function SceneSensor() {
  return (
    <Sprite start={10.4} end={17.6}>
      {({ localTime, duration }) => {
        const fadeIn = Math.min(1, Math.max(0, (localTime - 0.1) * 2));
        const fadeOut = 1 - Math.min(1, Math.max(0, (localTime - (duration - 0.6)) / 0.6));
        const op = fadeIn * fadeOut;

        // sensor on the left, object on the right
        const sx = 500, sy = H / 2 + 20;
        const objX = 1320, objY = sy;

        // distance bracket animation: object moves slightly to show measurement
        const objBreath = Math.sin(localTime * 0.9) * 30;

        // pulse: emits at t = 1.2, 3.0, 4.6 ...
        const pulseStarts = [1.0, 2.8, 4.4];
        const C = 1; // unit/s — visual speed scaled
        const travelDur = 1.4;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              {/* ground line */}
              <line x1="200" y1={sy + 80} x2="1700" y2={sy + 80}
                stroke={INK} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 4"
                {...drawIn(localTime, { start: 0.0, dur: 0.8, length: 1500 })}/>
              {[300, 600, 900, 1200, 1500].map(x=>(
                <g key={x} opacity={Math.min(1, Math.max(0, (localTime - 0.2) * 2))}>
                  <line x1={x} y1={sy + 76} x2={x} y2={sy + 84} stroke={INK} strokeWidth="0.8"/>
                </g>
              ))}

              {/* big sensor on left */}
              <g transform={`translate(${sx} ${sy})`}>
                <SensorGlyph x={0} y={0} label="S3" scale={4}/>
              </g>

              {/* TX / RX cone hints */}
              <g opacity={0.25}>
                <path d={`M ${sx - 56} ${sy - 16} L ${objX - 40} ${objY - 240} L ${objX - 40} ${objY + 240} Z`}
                  fill={INK} opacity="0.06"/>
                <path d={`M ${sx + 56} ${sy - 16} L ${objX - 40} ${objY - 240} L ${objX - 40} ${objY + 240} Z`}
                  fill={INK} opacity="0.06"/>
              </g>

              {/* object on right — silhouette of a hand/person abstracted as block */}
              <g transform={`translate(${objX + objBreath} ${objY})`}>
                {/* dashed object outline */}
                <rect x="-60" y="-130" width="120" height="260" fill="none" stroke={INK} strokeWidth="1.4"
                  strokeDasharray="6 5"/>
                <rect x="-50" y="-120" width="100" height="240" fill={INK} opacity="0.06"/>
                <text x="0" y="-150" fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.1em">OBJECT</text>
                {/* crosshair on object center */}
                <line x1="-12" y1="0" x2="12" y2="0" stroke={INK} strokeWidth="1"/>
                <line x1="0" y1="-12" x2="0" y2="12" stroke={INK} strokeWidth="1"/>
                <circle cx="0" cy="0" r="3" fill={INK}/>
              </g>

              {/* outgoing pulses (TX → object) */}
              {pulseStarts.map((p, i) => {
                const localT = localTime - p;
                if (localT < 0 || localT > travelDur * 2.4) return null;
                const phase = Math.min(1, localT / travelDur);
                const r = phase * (objX - sx - 60);
                const op2 = (1 - phase) * 0.8;
                return (
                  <g key={'tx'+i}>
                    {/* arc fragment facing right */}
                    <path
                      d={`M ${sx - 56 + r * Math.cos(-0.55)} ${sy - 16 + r * Math.sin(-0.55)}
                          A ${r} ${r} 0 0 1 ${sx - 56 + r * Math.cos(0.55)} ${sy - 16 + r * Math.sin(0.55)}`}
                      fill="none" stroke={INK} strokeWidth="1.6" opacity={op2}/>
                  </g>
                );
              })}

              {/* echo pulses (object → RX) */}
              {pulseStarts.map((p, i) => {
                const echoStart = p + travelDur;
                const localT = localTime - echoStart;
                if (localT < 0 || localT > travelDur * 1.4) return null;
                const phase = Math.min(1, localT / travelDur);
                const r = phase * (objX - sx - 60);
                const op2 = (1 - phase) * 0.7;
                // arc fragment originating from object, facing left toward RX
                return (
                  <g key={'rx'+i}>
                    <path
                      d={`M ${objX + objBreath - 40 - r * Math.cos(-0.55)} ${objY + r * Math.sin(-0.55)}
                          A ${r} ${r} 0 0 0 ${objX + objBreath - 40 - r * Math.cos(0.55)} ${objY + r * Math.sin(0.55)}`}
                      fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="4 3" opacity={op2}/>
                  </g>
                );
              })}

              {/* distance bracket — between sensor + object */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.6) * 2))}>
                <line x1={sx + 80} y1={sy - 220} x2={sx + 80} y2={sy - 180}
                  stroke={INK} strokeWidth="1"/>
                <line x1={objX + objBreath - 70} y1={sy - 220} x2={objX + objBreath - 70} y2={sy - 180}
                  stroke={INK} strokeWidth="1"/>
                <line x1={sx + 80} y1={sy - 200} x2={objX + objBreath - 70} y2={sy - 200}
                  stroke={INK} strokeWidth="1"/>
                {/* arrow heads */}
                <polygon points={`${sx+80},${sy-200} ${sx+92},${sy-205} ${sx+92},${sy-195}`} fill={INK}/>
                <polygon points={`${objX+objBreath-70},${sy-200} ${objX+objBreath-82},${sy-205} ${objX+objBreath-82},${sy-195}`} fill={INK}/>

                <rect x={(sx + objX + objBreath) / 2 - 80} y={sy - 232} width="160" height="28" fill={PAPER} stroke={INK} strokeWidth="1"/>
                <text x={(sx + objX + objBreath) / 2} y={sy - 213} fontFamily={MONO} fontSize="15"
                  fontWeight="700" fill={INK} textAnchor="middle" letterSpacing="0.08em">
                  d = {((objX + objBreath - sx - 150) / 360).toFixed(2)} m
                </text>
              </g>

              {/* equation callout */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 2.6) * 2))}>
                <line x1={(sx + objX) / 2} y1={sy + 80} x2={(sx + objX) / 2} y2={sy + 180}
                  stroke={INK} strokeWidth="0.8" strokeDasharray="3 4"/>
                <rect x={(sx + objX) / 2 - 240} y={sy + 180} width="480" height="130" fill={PAPER} stroke={INK} strokeWidth="1.2"/>
                <text x={(sx + objX) / 2} y={sy + 218} fontFamily={MONO} fontSize="14"
                  fill={INK} textAnchor="middle" opacity="0.6" letterSpacing="0.15em">TIME OF FLIGHT</text>
                <text x={(sx + objX) / 2} y={sy + 278} fontFamily={SERIF} fontStyle="italic" fontSize="36"
                  fontWeight="500" fill={INK} textAnchor="middle">
                  d &nbsp;= &nbsp;½ · c · τ
                </text>
              </g>

              {/* small TX / RX labels above sensor */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.4) * 2))}>
                <line x1={sx - 56} y1={sy - 70} x2={sx - 56} y2={sy - 28} stroke={INK} strokeWidth="0.8"/>
                <line x1={sx + 56} y1={sy - 70} x2={sx + 56} y2={sy - 28} stroke={INK} strokeWidth="0.8"/>
                <text x={sx - 56} y={sy - 80} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.12em">EMIT</text>
                <text x={sx + 56} y={sy - 80} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.12em">RECEIVE</text>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── scene 4: signal processing pipeline ───────────────────────────────────

function ScenePipeline() {
  return (
    <Sprite start={17.4} end={24.6}>
      {({ localTime, duration }) => {
        const fadeIn = Math.min(1, Math.max(0, (localTime - 0.1) * 2));
        const fadeOut = 1 - Math.min(1, Math.max(0, (localTime - (duration - 0.6)) / 0.6));
        const op = fadeIn * fadeOut;

        const stages = [
          { id: 'RAW',  label: 'RAW ECHO', sub: 'analog in · 0–7' },
          { id: 'CAL',  label: 'CALIBRATE', sub: 'offset · gain' },
          { id: 'LIN',  label: 'LINEARIZE', sub: 'compensate t↔d' },
          { id: 'SCL',  label: 'SCALE',     sub: 'range map · clamp' },
          { id: 'OUT',  label: 'DISTANCE',  sub: 'metric · 0–4.0 m' },
        ];
        const startX = 200;
        const gap = 320;
        const y = 360;
        const boxW = 220, boxH = 130;

        // determine "current active" stage based on time
        const stageActive = Math.min(stages.length - 1, Math.floor((localTime - 0.6) / 0.9));

        // distance counter — fed by a sin oscillator
        const distance = 1.27 + Math.sin(localTime * 1.4) * 1.05;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              {/* section header */}
              <g opacity={Math.min(1, Math.max(0, localTime * 2))}>
                <line x1="200" y1="200" x2="1720" y2="200" stroke={INK} strokeWidth="1"
                  {...drawIn(localTime, { start: 0, dur: 0.8, length: 1520 })}/>
                <text x="200" y="180" fontFamily={MONO} fontSize="16" fontWeight="700"
                  fill={INK} letterSpacing="0.2em">§ 3.2  PROCESSING PIPELINE</text>
                <text x="1720" y="180" fontFamily={MONO} fontSize="12"
                  fill={INK} opacity="0.55" letterSpacing="0.15em" textAnchor="end">
                  per-channel · executed in PD @ 44.1kHz
                </text>
              </g>

              {/* pipeline boxes + arrows */}
              {stages.map((s, i) => {
                const bx = startX + i * gap;
                const drawT0 = 0.3 + i * 0.18;
                const dl = drawIn(localTime, { start: drawT0, dur: 0.5, length: 2 * (boxW + boxH) });
                const labelOp = Math.min(1, Math.max(0, (localTime - drawT0 - 0.2) * 2));
                const active = i <= stageActive;

                return (
                  <g key={s.id}>
                    {/* connecting arrow */}
                    {i > 0 && (
                      <g>
                        <line
                          x1={bx - gap + boxW + 8}
                          y1={y + boxH / 2}
                          x2={bx - 16}
                          y2={y + boxH / 2}
                          stroke={INK} strokeWidth={active ? 1.6 : 0.9}
                          opacity={active ? 1 : 0.35}
                          {...drawIn(localTime, { start: drawT0 - 0.1, dur: 0.4, length: gap - boxW - 24 })}
                        />
                        <polygon
                          points={`${bx-16},${y+boxH/2} ${bx-26},${y+boxH/2-6} ${bx-26},${y+boxH/2+6}`}
                          fill={INK} opacity={Math.min(1, Math.max(0, (localTime - drawT0 + 0.2) * 3)) * (active ? 1 : 0.35)}
                        />
                        {/* traveling pulse */}
                        <PipePulse
                          x1={bx - gap + boxW + 8} x2={bx - 16}
                          y={y + boxH / 2}
                          t={localTime} t0={drawT0 - 0.1 + 0.5} period={1.6}
                        />
                      </g>
                    )}
                    {/* box */}
                    <rect
                      x={bx} y={y} width={boxW} height={boxH}
                      fill={active ? INK : PAPER} stroke={INK} strokeWidth="1.4"
                      {...dl}
                    />
                    {/* corner tick marks */}
                    {[[bx, y], [bx+boxW, y], [bx, y+boxH], [bx+boxW, y+boxH]].map(([cx,cy],ci)=>(
                      <g key={ci} opacity={labelOp}>
                        <line x1={cx-5} y1={cy} x2={cx+5} y2={cy} stroke={active ? PAPER : INK} strokeWidth="1"/>
                        <line x1={cx} y1={cy-5} x2={cx} y2={cy+5} stroke={active ? PAPER : INK} strokeWidth="1"/>
                      </g>
                    ))}
                    <text x={bx + boxW / 2} y={y + 50} fontFamily={MONO} fontSize="22" fontWeight="700"
                      fill={active ? PAPER : INK} textAnchor="middle" letterSpacing="0.1em" opacity={labelOp}>
                      {s.label}
                    </text>
                    <text x={bx + boxW / 2} y={y + 80} fontFamily={MONO} fontSize="12"
                      fill={active ? PAPER : INK} opacity={labelOp * 0.65} textAnchor="middle" letterSpacing="0.12em">
                      {s.sub}
                    </text>
                    {/* stage number */}
                    <text x={bx + 14} y={y + boxH - 12} fontFamily={MONO} fontSize="11" fontWeight="700"
                      fill={active ? PAPER : INK} opacity={labelOp * 0.5} letterSpacing="0.12em">
                      0{i + 1}
                    </text>
                  </g>
                );
              })}

              {/* per-stage detail micro-graphs underneath */}
              {/* RAW: ragged ultrasonic burst */}
              <MicroPlot x={startX + 30} y={y + 180} w={160} h={70} t={localTime} t0={0.6}
                gen={(x) => Math.sin(x * 60) * Math.exp(-Math.abs(x - 0.4) * 8) * 0.8}/>
              {/* CAL: shifted/scaled clean burst */}
              <MicroPlot x={startX + gap + 30} y={y + 180} w={160} h={70} t={localTime} t0={1.4}
                gen={(x) => Math.sin(x * 28) * Math.exp(-Math.abs(x - 0.5) * 6) * 0.75}/>
              {/* LIN: curve t→d  */}
              <MicroPlot x={startX + 2*gap + 30} y={y + 180} w={160} h={70} t={localTime} t0={2.2}
                gen={(x) => 0.9 * (1 - Math.exp(-x * 2.4)) - 0.45} dotted/>
              {/* SCL: ramp clamped */}
              <MicroPlot x={startX + 3*gap + 30} y={y + 180} w={160} h={70} t={localTime} t0={3.0}
                gen={(x) => Math.max(-0.45, Math.min(0.45, (x - 0.15) * 1.8 - 0.45))}/>
              {/* OUT: distance readout */}
              <g transform={`translate(${startX + 4*gap + 30} ${y + 180})`}
                opacity={Math.min(1, Math.max(0, (localTime - 3.6) * 2))}>
                <rect x="0" y="0" width="160" height="70" fill="none" stroke={INK} strokeWidth="1"/>
                <text x="80" y="10" fontFamily={MONO} fontSize="9" fill={INK} opacity="0.6"
                  textAnchor="middle" letterSpacing="0.2em" dominantBaseline="hanging">
                  STREAM · m
                </text>
                <text x="80" y="48" fontFamily={MONO} fontSize="26" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.05em">
                  {distance.toFixed(3)}
                </text>
                <text x="80" y="62" fontFamily={MONO} fontSize="8" fill={INK} opacity="0.5"
                  textAnchor="middle" letterSpacing="0.2em">
                  → AUDIO PARAM
                </text>
              </g>

              {/* labels above */}
              {stages.map((s, i) => {
                const bx = startX + i * gap;
                return (
                  <g key={'lab'+i} opacity={Math.min(1, Math.max(0, (localTime - 0.3 - i * 0.18) * 2)) * 0.55}>
                    <text x={bx + boxW / 2} y={y - 24} fontFamily={MONO} fontSize="10"
                      fill={INK} textAnchor="middle" letterSpacing="0.2em">
                      STEP / {String(i + 1).padStart(2, '0')}
                    </text>
                  </g>
                );
              })}

              {/* bottom procedural caption */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.4) * 1.5)) * fadeOut}>
                <line x1="200" y1="780" x2="1720" y2="780" stroke={INK} strokeOpacity="0.4"/>
                <text x="200" y="822" fontFamily={SERIF} fontSize="22" fill={INK} fontStyle="italic">
                  Excite the emitter with an ultrasonic carrier · capture the response at the receiver
                </text>
                <text x="200" y="852" fontFamily={SERIF} fontSize="22" fill={INK} fontStyle="italic">
                  Convert the measurement into a continuous distance through calibration, linearization and scaling.
                </text>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

// little oscilloscope-style waveform
function MicroPlot({ x, y, w, h, t, t0 = 0, gen, dotted = false }) {
  const op = Math.min(1, Math.max(0, (t - t0) * 2));
  // sample points
  const N = 80;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const xi = i / (N - 1);
    const v = gen(xi);
    pts.push([x + xi * w, y + h / 2 - v * (h / 2 - 6)]);
  }
  // drawing-in animation: reveal up to N * progress
  const reveal = Math.min(1, Math.max(0, (t - t0 - 0.1) * 1.5));
  const cut = Math.floor(reveal * N);
  const d = pts.slice(0, Math.max(2, cut)).map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${px} ${py}`).join(' ');
  return (
    <g opacity={op}>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth="1"/>
      <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2}
        stroke={INK} strokeWidth="0.4" strokeOpacity="0.3" strokeDasharray="2 3"/>
      <path d={d} fill="none" stroke={INK} strokeWidth="1.4"
        strokeDasharray={dotted ? '4 3' : 'none'}/>
      {/* axis labels */}
      <text x={x + 4} y={y + 10} fontFamily={MONO} fontSize="8" fill={INK} opacity="0.55">+</text>
      <text x={x + 4} y={y + h - 3} fontFamily={MONO} fontSize="8" fill={INK} opacity="0.55">−</text>
    </g>
  );
}

// little pulse traveling along a pipe segment
function PipePulse({ x1, x2, y, t, t0, period = 1.2 }) {
  if (t < t0) return null;
  const phase = ((t - t0) / period) % 1;
  const px = x1 + (x2 - x1) * phase;
  const op = 1 - phase * 0.6;
  return <circle cx={px} cy={y} r="5" fill={INK} opacity={op}/>;
}

// ── scene 5: ambisonic output — all 8 sensors active feeding audio ────────

function SceneOutput() {
  return (
    <Sprite start={24.4} end={30}>
      {({ localTime, duration }) => {
        const fadeIn = Math.min(1, Math.max(0, (localTime - 0.1) * 2));
        const op = fadeIn;
        const cx = W / 2;
        const cy = H / 2 + 30;

        // 8 sensors firing in parallel; 8 speakers in ring; bela in center
        const sensors = Array.from({ length: 8 }).map((_, i) => {
          const ang = -110 + (i * 220) / 7;
          const rad = (ang * Math.PI) / 180;
          const R = 380;
          return {
            i, ang,
            x: cx + R * Math.sin(rad),
            y: cy - R * Math.cos(rad) * 0.55 - 120,
          };
        });

        // 8 speakers in a wide outer ring — clearly outside the sensor arc
        const speakers = Array.from({ length: 8 }).map((_, i) => {
          // offset start so speakers fall between sensors, not over them
          const ang = ((i + 0.5) / 8) * Math.PI * 2 - Math.PI / 2;
          const Rx = 800, Ry = 330;
          return {
            i,
            x: cx + Rx * Math.cos(ang),
            y: cy + 80 + Ry * Math.sin(ang),
            ang: ang * 180 / Math.PI,
          };
        });

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              {/* section header */}
              <g opacity={Math.min(1, Math.max(0, localTime * 2))}>
                <line x1="200" y1="170" x2="1720" y2="170" stroke={INK} strokeWidth="1"
                  {...drawIn(localTime, { start: 0, dur: 0.8, length: 1520 })}/>
                <text x="200" y="150" fontFamily={MONO} fontSize="16" fontWeight="700"
                  fill={INK} letterSpacing="0.2em">§ 4  AMBISONIC SYNTHESIS</text>
                <text x="1720" y="150" fontFamily={MONO} fontSize="12"
                  fill={INK} opacity="0.55" letterSpacing="0.15em" textAnchor="end">
                  8 IN  →  PD PATCH  →  8-CH OUT
                </text>
              </g>

              {/* outer speaker ring */}
              <ellipse cx={cx} cy={cy + 80} rx="800" ry="330"
                fill="none" stroke={INK} strokeOpacity="0.22" strokeWidth="0.6" strokeDasharray="3 5"
                {...drawIn(localTime, { start: 0.4, dur: 1.2, length: 4200 })}/>

              {/* speakers */}
              {speakers.map((sp, i) => (
                <g key={'sp'+i} opacity={Math.min(1, Math.max(0, (localTime - 0.6 - i * 0.05) * 2))}>
                  <SpeakerGlyph cx={sp.x} cy={sp.y} label={'SP' + (i + 1)}/>
                  {/* waves from speaker */}
                  <WaveBurst cx={sp.x} cy={sp.y} maxR={70} period={1.6} count={2}
                    t={localTime} t0={1.4 + i * 0.1} color={INK} opacity={0.4}/>
                </g>
              ))}

              {/* central bela */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.2) * 2))}>
                <BelaBoard cx={cx} cy={cy + 80} w={300} h={170}/>
              </g>

              {/* sensors (top arc) */}
              {sensors.map((s, i) => (
                <g key={'s'+i} opacity={Math.min(1, Math.max(0, (localTime - 0.4 - i * 0.04) * 3))}>
                  <SensorGlyph x={s.x} y={s.y} label={'S' + (i + 1)} scale={1.2}/>
                  <WaveBurst cx={s.x} cy={s.y - 18} maxR={70} period={1.4 + i*0.05} count={2}
                    t={localTime} t0={0.7 + i * 0.13} color={INK} opacity={0.5}
                    sweep={140} rotation={-90}/>
                  {/* signal line to bela */}
                  <line x1={s.x} y1={s.y + 28} x2={cx} y2={cy + 10}
                    stroke={INK} strokeWidth="0.6" strokeOpacity="0.35" strokeDasharray="3 4"
                    {...drawIn(localTime, { start: 0.9 + i*0.05, dur: 0.4, length: 700 })}/>
                  {/* traveling data dot */}
                  <DataDot from={[s.x, s.y + 28]} to={[cx, cy + 10]} t={localTime}
                    t0={1.6 + i * 0.15} period={2.2}/>
                </g>
              ))}

              {/* output lines from bela to speakers */}
              {speakers.map((sp, i) => (
                <g key={'out'+i}>
                  <line x1={cx} y1={cy + 100} x2={sp.x} y2={sp.y}
                    stroke={INK} strokeWidth="0.7" strokeOpacity="0.45"
                    {...drawIn(localTime, { start: 1.0 + i*0.05, dur: 0.4, length: 800 })}/>
                  <DataDot from={[cx, cy + 100]} to={[sp.x, sp.y]} t={localTime}
                    t0={1.8 + i * 0.08} period={1.9}/>
                </g>
              ))}

              {/* annotations */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.6) * 2))}>
                <text x={200} y={H - 200} fontFamily={MONO} fontSize="14" fontWeight="700"
                  fill={INK} letterSpacing="0.18em">[A] ULTRASONIC FIELD</text>
                <text x={200} y={H - 178} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6"
                  letterSpacing="0.15em">8× continuous distance · stream → PD inlets</text>
              </g>
              <g opacity={Math.min(1, Math.max(0, (localTime - 2.0) * 2))}>
                <text x={W - 200} y={H - 200} fontFamily={MONO} fontSize="14" fontWeight="700"
                  fill={INK} letterSpacing="0.18em" textAnchor="end">[B] AMBISONIC ARRAY</text>
                <text x={W - 200} y={H - 178} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6"
                  letterSpacing="0.15em" textAnchor="end">decoded into 8-channel B-format · ring topology</text>
              </g>

              {/* mid caption — placed in a clear band beneath the bottom speaker */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 2.6) * 2)) *
                          (1 - Math.min(1, Math.max(0, (localTime - (duration - 0.6)) / 0.6)))}>
                <line x1={cx - 220} y1={H - 130} x2={cx + 220} y2={H - 130}
                  stroke={INK} strokeWidth="0.8"/>
                <text x={cx} y={H - 95} fontFamily={SERIF} fontStyle="italic" fontSize="26"
                  fill={INK} textAnchor="middle">
                  user proximity  →  sound field
                </text>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

function SpeakerGlyph({ cx, cy, label }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <rect x="-20" y="-26" width="40" height="52" fill={PAPER} stroke={INK} strokeWidth="1.2"/>
      <circle cx="0" cy="-10" r="6" fill="none" stroke={INK} strokeWidth="1"/>
      <circle cx="0" cy="-10" r="2" fill={INK}/>
      <circle cx="0" cy="12" r="10" fill="none" stroke={INK} strokeWidth="1.2"/>
      <circle cx="0" cy="12" r="3" fill={INK}/>
      <text x="0" y="42" fontFamily={MONO} fontSize="9" fontWeight="700" fill={INK}
        textAnchor="middle" letterSpacing="0.15em">{label}</text>
    </g>
  );
}

function DataDot({ from, to, t, t0, period = 1.6 }) {
  if (t < t0) return null;
  const phase = ((t - t0) / period) % 1;
  const px = from[0] + (to[0] - from[0]) * phase;
  const py = from[1] + (to[1] - from[1]) * phase;
  return <circle cx={px} cy={py} r="3" fill={INK} opacity={1 - phase * 0.4}/>;
}

// ── App ───────────────────────────────────────────────────────────────────

function App() {
  const ref = React.useRef(null);
  // update screen-label with timestamp every second for comments
  const time = useTime ? null : null; // can't use here, we wrap in Stage
  return (
    <Stage width={W} height={H} duration={DUR} background={PAPER}>
      <ScreenLabel/>
      <Paper/>
      <Frame/>
      <TitleBlock/>
      <Timecode/>
      <SceneTitle/>
      <SceneOverview/>
      <SceneSensor/>
      <ScenePipeline/>
      <SceneOutput/>
    </Stage>
  );
}

// updates the root data-screen-label every second so comments include a t-stamp
function ScreenLabel() {
  const t = useTime();
  React.useEffect(() => {
    const sec = Math.floor(t);
    const root = document.getElementById('root');
    if (root) root.setAttribute('data-screen-label', `t=${sec}s`);
  }, [Math.floor(t)]);
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
