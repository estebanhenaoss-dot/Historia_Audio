// spatial-scenes.jsx — engineering schematic animation of the
// quadraphonic + elevated ambisonic spatial reproduction architecture (FIG 19, sheet 04)

const INK   = '#0a0a0a';
const PAPER = '#efece2';
const MONO  = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
const SERIF = 'Inter, system-ui, sans-serif';

const W = 1920;
const H = 1080;
const DUR = 32;

// ── helpers ───────────────────────────────────────────────────────────────

function drawIn(localTime, { start = 0, dur = 0.8, length = 1000 } = {}) {
  if (localTime < start) return { strokeDasharray: length, strokeDashoffset: length, opacity: 0 };
  const t = Math.min(1, (localTime - start) / dur);
  const eased = Easing.easeOutCubic(t);
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - eased),
    opacity: 1,
  };
}

const fadeWindow = (t, dur, edgeIn = 0.4, edgeOut = 0.6) => {
  const a = Math.min(1, Math.max(0, t / edgeIn));
  const b = 1 - Math.min(1, Math.max(0, (t - (dur - edgeOut)) / edgeOut));
  return a * b;
};

// ── chrome ────────────────────────────────────────────────────────────────

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
      <rect x="40" y="40" width={W - 80} height={H - 80}
        fill="none" stroke={INK} strokeWidth="1.2" {...draw}/>
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
      textAlign: 'right', lineHeight: 1.7, whiteSpace: 'nowrap',
    }}>
      <div style={{ borderBottom: `1px solid ${INK}`, paddingBottom: 6, marginBottom: 6 }}>
        FIG. 19 &nbsp;·&nbsp; REPRODUCTION SYSTEM
      </div>
      <div style={{ opacity: 0.55 }}>QUADRAPHONIC &nbsp;·&nbsp; ELEVATED AMBISONIC</div>
      <div style={{ opacity: 0.55 }}>SHEET 04 / 04 &nbsp;·&nbsp; REV. A &nbsp;·&nbsp; SCALE  N.T.S.</div>
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

function ScreenLabel() {
  const t = useTime();
  React.useEffect(() => {
    const sec = Math.floor(t);
    const root = document.getElementById('root');
    if (root) root.setAttribute('data-screen-label', `t=${sec}s`);
  }, [Math.floor(t)]);
  return null;
}

function SectionHeader({ tag, title, meta, t, t0 = 0 }) {
  return (
    <g opacity={Math.min(1, Math.max(0, (t - t0) * 2))}>
      <line x1="200" y1="190" x2="1720" y2="190" stroke={INK} strokeWidth="1"
        {...drawIn(t, { start: t0, dur: 0.8, length: 1520 })}/>
      <text x="200" y="170" fontFamily={MONO} fontSize="16" fontWeight="700"
        fill={INK} letterSpacing="0.2em">{tag} &nbsp;·&nbsp; {title}</text>
      <text x="1720" y="170" fontFamily={MONO} fontSize="12"
        fill={INK} opacity="0.55" letterSpacing="0.15em" textAnchor="end">{meta}</text>
    </g>
  );
}

// ── glyphs ────────────────────────────────────────────────────────────────

// Square marker for quadraphonic speakers (0° elevation)
function QuadSpeaker({ cx, cy, label, active = false, scale = 1, rotation = 0 }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotation}) scale(${scale})`}>
      {/* outer square marker per the figure description */}
      <rect x="-22" y="-22" width="44" height="44"
        fill={active ? INK : PAPER} stroke={INK} strokeWidth="1.6"/>
      {/* inner driver */}
      <circle cx="0" cy="0" r="13" fill="none" stroke={active ? PAPER : INK} strokeWidth="1.2"/>
      <circle cx="0" cy="0" r="4" fill={active ? PAPER : INK}/>
      {label && (
        <text x="0" y="40" fontFamily={MONO} fontSize="11" fontWeight="700"
          fill={INK} textAnchor="middle" letterSpacing="0.15em">{label}</text>
      )}
    </g>
  );
}

// Round speaker for elevated ambisonic ring
function AmbiSpeaker({ cx, cy, label, active = false, scale = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <circle cx="0" cy="0" r="20" fill={active ? INK : PAPER} stroke={INK} strokeWidth="1.4"/>
      <circle cx="0" cy="0" r="11" fill="none" stroke={active ? PAPER : INK} strokeWidth="0.8"/>
      <circle cx="0" cy="0" r="3" fill={active ? PAPER : INK}/>
      {label && (
        <text x="0" y="36" fontFamily={MONO} fontSize="10" fontWeight="700"
          fill={INK} textAnchor="middle" letterSpacing="0.15em">{label}</text>
      )}
    </g>
  );
}

function Listener({ cx, cy, scale = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <circle cx="0" cy="-8" r="10" fill="none" stroke={INK} strokeWidth="1.2"/>
      <path d="M -16 24 Q 0 6 16 24 L 16 30 L -16 30 Z" fill="none" stroke={INK} strokeWidth="1.2"/>
      <text x="0" y="56" fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
        textAnchor="middle" letterSpacing="0.2em">LISTENER</text>
    </g>
  );
}

// ── scene 1: title ────────────────────────────────────────────────────────

function SceneTitle() {
  return (
    <Sprite start={0.2} end={4.2}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);
        const text = 'SPATIAL REPRODUCTION SYSTEM';
        const charDelay = 0.035;
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
              ⎯⎯⎯⎯  fig. 19  ⎯⎯⎯⎯
            </div>
            <div style={{
              fontFamily: SERIF, fontSize: 92, fontWeight: 500,
              color: INK, letterSpacing: '-0.02em', lineHeight: 1,
              textAlign: 'center',
            }}>
              {text.split('').map((c, i) => {
                const cop = Math.min(1, Math.max(0, (localTime - 0.5 - i * charDelay) * 4));
                return <span key={i} style={{ opacity: cop, display: 'inline-block' }}>{c === ' ' ? '\u00a0' : c}</span>;
              })}
            </div>
            <div style={{
              fontFamily: MONO, fontSize: 22, color: INK, opacity: 0.7,
              letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 32,
            }}>
              quadraphonic 0° plane &nbsp;·&nbsp; elevated ambisonic ring
            </div>
            <svg width="600" height="2" style={{ marginTop: 48 }}>
              <line x1="0" y1="1" x2="600" y2="1" stroke={INK} strokeWidth="1"
                strokeDasharray="600"
                strokeDashoffset={600 * (1 - Easing.easeOutCubic(Math.min(1, localTime / 1.4)))}/>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── scene 2: hybrid architecture overview ─────────────────────────────────

function SceneArchitecture() {
  return (
    <Sprite start={4.0} end={11.4}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);
        const cx = W / 2;
        const cy = 600;

        // quad — 4 speakers at corners of a square in horizontal plane
        // ambi — 6 elevated speakers forming a ring "above"; in plan view show inner ellipse
        const quadR = 320; // distance from listener
        const ambiR = 460;
        const ambiYSquash = 0.45; // perspective squash

        const quadAngles = [45, 135, 225, 315]; // FR FL RL RR
        const quadLabels = ['SP_FR', 'SP_FL', 'SP_RL', 'SP_RR'];

        const ambiAngles = Array.from({ length: 6 }, (_, i) => (i / 6) * 360);

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 7.1" title="HYBRID ARCHITECTURE  ·  TOP VIEW"
                meta="quadraphonic + elevated ambisonic · combined plan"
                t={localTime} t0={0}/>

              {/* listener at center */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.2) * 2))}>
                <circle cx={cx} cy={cy} r="6" fill={INK}/>
                <line x1={cx-12} y1={cy} x2={cx+12} y2={cy} stroke={INK} strokeWidth="0.8"/>
                <line x1={cx} y1={cy-12} x2={cx} y2={cy+12} stroke={INK} strokeWidth="0.8"/>
                <text x={cx} y={cy + 26} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.2em">LISTENER</text>
              </g>

              {/* elevated ambisonic ring — dashed ellipse, drawn first (behind) */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.3) * 2))}>
                <ellipse cx={cx} cy={cy - 60} rx={ambiR} ry={ambiR * ambiYSquash}
                  fill="none" stroke={INK} strokeOpacity="0.5" strokeWidth="1"
                  strokeDasharray="6 5"
                  {...drawIn(localTime, { start: 0.3, dur: 1.2, length: 2*Math.PI*ambiR * 0.7 })}/>
                {/* elevated label */}
                <text x={cx + ambiR + 30} y={cy - 60 - 50}
                  fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK} letterSpacing="0.15em">
                  AMBISONIC RING
                </text>
                <text x={cx + ambiR + 30} y={cy - 60 - 32}
                  fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6" letterSpacing="0.15em">
                  ELEVATION  ·  +z
                </text>
                {/* dotted vertical to show elevation */}
                <line x1={cx + ambiR + 30} y1={cy - 60 - 18} x2={cx + ambiR + 80} y2={cy - 60 + 30}
                  stroke={INK} strokeWidth="0.8" strokeDasharray="3 4" opacity="0.5"/>
              </g>

              {/* quadraphonic horizontal plane — solid ring at z=0 */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.6) * 2))}>
                <ellipse cx={cx} cy={cy} rx={quadR + 20} ry={(quadR + 20) * ambiYSquash}
                  fill="none" stroke={INK} strokeOpacity="0.4" strokeWidth="0.8"
                  strokeDasharray="3 4"
                  {...drawIn(localTime, { start: 0.6, dur: 1.2, length: 2*Math.PI*quadR * 0.7 })}/>
                <text x={cx - quadR - 60} y={cy + 100}
                  fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK} letterSpacing="0.15em"
                  textAnchor="end">
                  QUADRAPHONIC
                </text>
                <text x={cx - quadR - 60} y={cy + 118}
                  fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6"
                  letterSpacing="0.15em" textAnchor="end">
                  HORIZONTAL  ·  0° EL
                </text>
              </g>

              {/* AMBI speakers — circles, behind */}
              {ambiAngles.map((deg, i) => {
                const a = (deg - 90) * Math.PI / 180;
                const x = cx + ambiR * Math.cos(a);
                const y = cy - 60 + ambiR * ambiYSquash * Math.sin(a);
                const t0 = 1.0 + i * 0.1;
                const opS = Math.min(1, Math.max(0, (localTime - t0) * 3));
                return (
                  <g key={'ambi'+i} opacity={opS}>
                    {/* elevation tether (dashed line down to plane) */}
                    <line x1={x} y1={y} x2={x} y2={cy + (ambiR * 0.95 * ambiYSquash) * Math.sin(a)}
                      stroke={INK} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.35"/>
                    <AmbiSpeaker cx={x} cy={y} label={'A' + (i+1)} scale={0.85}/>
                  </g>
                );
              })}

              {/* QUAD speakers — squares on the 0° plane */}
              {quadAngles.map((deg, i) => {
                const a = (deg - 90) * Math.PI / 180;
                const x = cx + quadR * Math.cos(a);
                const y = cy + quadR * ambiYSquash * Math.sin(a);
                const t0 = 1.8 + i * 0.12;
                const opS = Math.min(1, Math.max(0, (localTime - t0) * 3));
                return (
                  <g key={'quad'+i} opacity={opS}>
                    <QuadSpeaker cx={x} cy={y} label={quadLabels[i]} scale={1.0}/>
                  </g>
                );
              })}

              {/* legend in bottom-left */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 2.4) * 2))}>
                <rect x={180} y={H - 280} width={320} height={130} fill={PAPER} stroke={INK} strokeWidth="1.2"/>
                <text x={196} y={H - 256} fontFamily={MONO} fontSize="11" fontWeight="700" fill={INK}
                  letterSpacing="0.18em">LEGEND</text>
                <g transform={`translate(196 ${H - 232})`}>
                  <QuadSpeaker cx={16} cy={16} scale={0.5}/>
                  <text x={50} y={20} fontFamily={MONO} fontSize="12" fill={INK} letterSpacing="0.12em">
                    SQUARE  ·  QUAD @ 0° EL
                  </text>
                </g>
                <g transform={`translate(196 ${H - 188})`}>
                  <AmbiSpeaker cx={16} cy={16} scale={0.5}/>
                  <text x={50} y={20} fontFamily={MONO} fontSize="12" fill={INK} letterSpacing="0.12em">
                    CIRCLE  ·  AMBISONIC ELEVATED
                  </text>
                </g>
              </g>

              {/* function notes on the right */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 3.0) * 2))}>
                <rect x={W - 500} y={H - 320} width={320} height={170} fill={PAPER} stroke={INK} strokeWidth="1.2"/>
                <text x={W - 484} y={H - 296} fontFamily={MONO} fontSize="11" fontWeight="700" fill={INK}
                  letterSpacing="0.18em">FUNCTIONAL SPLIT</text>
                <text x={W - 484} y={H - 268} fontFamily={MONO} fontSize="12" fill={INK} letterSpacing="0.12em">
                  QUAD  →  generative layers
                </text>
                <text x={W - 484} y={H - 250} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                  letterSpacing="0.12em">PMS · oscillators · stochastic</text>
                <text x={W - 484} y={H - 218} fontFamily={MONO} fontSize="12" fill={INK} letterSpacing="0.12em">
                  AMBI  →  documentary layer
                </text>
                <text x={W - 484} y={H - 200} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                  letterSpacing="0.12em">community workshop recordings</text>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── scene 3: quadraphonic detail — amplitude panning ──────────────────────

function SceneQuadDetail() {
  return (
    <Sprite start={11.2} end={19.0}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);
        const cx = 700;
        const cy = 580;
        const R = 280;

        // virtual source orbits around listener
        const sourceAngle = (localTime * 50) % 360; // deg
        const sa = ((sourceAngle - 90) * Math.PI) / 180;
        const sx = cx + R * Math.cos(sa);
        const sy = cy + R * Math.sin(sa) * 0.9;

        // 4 quad speakers at corners of square (45, 135, 225, 315)
        const quadInfo = [
          { deg: 45,  label: 'SP_FR', short: 'FR' },
          { deg: 315, label: 'SP_FL', short: 'FL' },
          { deg: 225, label: 'SP_RL', short: 'RL' },
          { deg: 135, label: 'SP_RR', short: 'RR' },
        ];

        // amplitude panning gain: use cosine of angle diff, clipped at 0
        const gains = quadInfo.map(({ deg }) => {
          const da = ((deg - sourceAngle + 540) % 360) - 180;
          const rad = (da * Math.PI) / 180;
          const g = Math.max(0, Math.cos(rad));
          return g;
        });
        // normalize to unit power (constant power panning)
        const totalP = Math.sqrt(gains.reduce((s, g) => s + g*g, 0)) || 1;
        const normGains = gains.map(g => g / totalP);

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 7.2" title="QUADRAPHONIC  ·  AMPLITUDE PANNING"
                meta="apparent position controlled by gain distribution across 4 channels"
                t={localTime} t0={0}/>

              {/* LEFT: 4-speaker stage */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.1) * 2))}>
                {/* outer rect */}
                <rect x={300} y={280} width={800} height={620} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.1, dur: 0.8, length: 2840 })}/>
                <text x={320} y={310} fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK}
                  letterSpacing="0.18em">[A] HORIZONTAL PLANE</text>
                <text x={320} y={330} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  letterSpacing="0.15em">4 speakers at 0° EL · top view</text>

                {/* dashed reference circle */}
                <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.9}
                  fill="none" stroke={INK} strokeOpacity="0.35" strokeDasharray="4 5"
                  {...drawIn(localTime, { start: 0.5, dur: 1.0, length: 2*Math.PI*R })}/>

                {/* room axes */}
                <line x1={cx} y1={cy - R - 30} x2={cx} y2={cy + R + 30}
                  stroke={INK} strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="2 4"/>
                <line x1={cx - R - 30} y1={cy} x2={cx + R + 30} y2={cy}
                  stroke={INK} strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="2 4"/>
                <text x={cx} y={cy - R - 38} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.5"
                  textAnchor="middle" letterSpacing="0.18em">FRONT  ·  0°</text>

                {/* listener */}
                <Listener cx={cx} cy={cy} scale={0.9}/>

                {/* speakers + cones */}
                {quadInfo.map((sp, i) => {
                  const a = ((sp.deg - 90) * Math.PI) / 180;
                  const x = cx + R * Math.cos(a);
                  const y = cy + R * 0.9 * Math.sin(a);
                  const g = normGains[i];
                  const active = g > 0.5;
                  const t0 = 0.7 + i * 0.1;
                  return (
                    <g key={i} opacity={Math.min(1, Math.max(0, (localTime - t0) * 3))}>
                      {/* line from speaker to listener */}
                      <line x1={x} y1={y} x2={cx} y2={cy}
                        stroke={INK} strokeWidth={0.5 + g * 2}
                        strokeOpacity={0.15 + g * 0.5}/>
                      {/* gain halo */}
                      <circle cx={x} cy={y} r={8 + g * 28}
                        fill="none" stroke={INK} strokeWidth="1" opacity={g * 0.6}/>
                      <QuadSpeaker cx={x} cy={y} label={sp.label} active={active} scale={1.0}/>
                      {/* gain text near speaker */}
                      <text x={x} y={y - 38} fontFamily={MONO} fontSize="11" fontWeight="700" fill={INK}
                        textAnchor="middle" letterSpacing="0.1em">
                        {(g * 100).toFixed(0)}%
                      </text>
                    </g>
                  );
                })}

                {/* virtual source */}
                <g opacity={Math.min(1, Math.max(0, (localTime - 1.4) * 2))}>
                  <line x1={cx} y1={cy} x2={sx} y2={sy}
                    stroke={INK} strokeWidth="1" strokeDasharray="3 4" opacity="0.6"/>
                  <circle cx={sx} cy={sy} r="12" fill={INK}/>
                  <circle cx={sx} cy={sy} r="22" fill="none" stroke={INK} strokeWidth="0.8" opacity="0.5"/>
                  <text x={sx} y={sy - 28} fontFamily={MONO} fontSize="11" fontWeight="700" fill={INK}
                    textAnchor="middle" letterSpacing="0.12em">SRC</text>
                  {/* azimuth readout */}
                  <text x={sx + 18} y={sy + 6} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6"
                    letterSpacing="0.12em">φ = {Math.round(sourceAngle).toString().padStart(3,'0')}°</text>
                </g>
              </g>

              {/* RIGHT: 4 gain meters */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.4) * 2))}>
                <rect x={1180} y={280} width={560} height={620} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.4, dur: 0.8, length: 2360 })}/>
                <text x={1200} y={310} fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK}
                  letterSpacing="0.18em">[B] CHANNEL GAIN</text>
                <text x={1200} y={330} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  letterSpacing="0.15em">amplitude distribution per speaker</text>

                {/* 4 vertical bar meters */}
                {quadInfo.map((sp, i) => {
                  const g = normGains[i];
                  const bx = 1240 + i * 130;
                  const top = 380;
                  const bottom = 800;
                  const h = bottom - top;
                  const fillH = g * h;
                  return (
                    <g key={i}>
                      <rect x={bx} y={top} width={70} height={h} fill="none" stroke={INK} strokeWidth="1"/>
                      {/* gain ticks every 25% */}
                      {[0.25, 0.5, 0.75].map(p => (
                        <line key={p} x1={bx - 6} y1={bottom - p * h} x2={bx + 76} y2={bottom - p * h}
                          stroke={INK} strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 4"/>
                      ))}
                      <rect x={bx + 1} y={bottom - fillH + 1} width={68} height={Math.max(0, fillH - 2)}
                        fill={INK}/>
                      {/* labels */}
                      <text x={bx + 35} y={top - 18} fontFamily={MONO} fontSize="14" fontWeight="700" fill={INK}
                        textAnchor="middle" letterSpacing="0.1em">{sp.short}</text>
                      <text x={bx + 35} y={top - 4} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.55"
                        textAnchor="middle" letterSpacing="0.15em">CH {i+1}</text>
                      <text x={bx + 35} y={bottom + 22} fontFamily={MONO} fontSize="15" fontWeight="700" fill={INK}
                        textAnchor="middle" letterSpacing="0.05em">
                        {(g * 100).toFixed(0)}%
                      </text>
                      <text x={bx + 35} y={bottom + 40} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.55"
                        textAnchor="middle" letterSpacing="0.15em">
                        {(20 * Math.log10(Math.max(0.001, g))).toFixed(1)} dB
                      </text>
                    </g>
                  );
                })}

                {/* sum power indicator */}
                <text x={1460} y={870} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.18em">
                  Σ g²  ≈  {gains.reduce((s,g)=>s+g*g, 0).toFixed(2)}   ·   constant-power
                </text>
              </g>

              {/* annotation: amplitude panning formula */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.6) * 1.4)) *
                          (1 - Math.min(1, Math.max(0, (localTime - (duration - 0.6)) / 0.6)))}>
                <line x1="200" y1="940" x2="1720" y2="940" stroke={INK} strokeOpacity="0.4"/>
                <text x="200" y="982" fontFamily={SERIF} fontSize="22" fill={INK} fontStyle="italic">
                  Source position is encoded by the relative energy across the four channels — no encoding/decoding stage.
                </text>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── scene 4: routing — what feeds the quad ────────────────────────────────

function SceneRouting() {
  return (
    <Sprite start={18.8} end={26.0}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);

        const sources = [
          { id: 'pms',   label: 'PMS  ·  DATASET',      sub: 'PM₂.₅ → band-pass',            t0: 0.2 },
          { id: 'osc',   label: 'OSCILLATORS  ·  7',    sub: 'sinusoidal · proximity',       t0: 0.4 },
          { id: 'sto',   label: 'STOCHASTIC',           sub: 'threshold sample triggers',    t0: 0.6 },
        ];

        const sx = 220;
        const cx = 950;
        const sy0 = 290;
        const rowH = 180;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 7.3" title="QUAD ROUTING  ·  GENERATIVE LAYERS"
                meta="three continuous streams → quadraphonic bus"
                t={localTime} t0={0}/>

              {/* 3 source blocks */}
              {sources.map((s, i) => {
                const y = sy0 + i * rowH;
                return (
                  <g key={s.id} opacity={Math.min(1, Math.max(0, (localTime - s.t0) * 2))}>
                    <rect x={sx} y={y} width={420} height={140} fill={PAPER} stroke={INK} strokeWidth="1.4"
                      {...drawIn(localTime, { start: s.t0, dur: 0.6, length: 1120 })}/>
                    <text x={sx + 24} y={y + 36} fontFamily={MONO} fontSize="14" fontWeight="700"
                      fill={INK} letterSpacing="0.18em">{s.label}</text>
                    <text x={sx + 24} y={y + 56} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                      letterSpacing="0.15em">{s.sub}</text>
                    {/* mini waveform */}
                    <LayerActivity x={sx + 24} y={y + 100} w={372} h={28} seed={i + 1} localTime={localTime}/>
                    {/* feed line to mixer */}
                    <line x1={sx + 420} y1={y + 70} x2={cx - 200} y2={y + 70}
                      stroke={INK} strokeWidth="1.4" strokeOpacity="0.6"
                      {...drawIn(localTime, { start: s.t0 + 0.3, dur: 0.5, length: 330 })}/>
                    <polygon points={`${cx-200},${y+70} ${cx-210},${y+64} ${cx-210},${y+76}`} fill={INK}/>
                    <DataDot from={[sx + 420, y + 70]} to={[cx - 200, y + 70]} t={localTime}
                      t0={s.t0 + 0.8} period={1.8 + i*0.2}/>
                  </g>
                );
              })}

              {/* central bus / pan node */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.9) * 2))}>
                <rect x={cx - 200} y={sy0 + 30} width={360} height={400} fill={PAPER} stroke={INK} strokeWidth="1.6"
                  {...drawIn(localTime, { start: 0.9, dur: 0.7, length: 1520 })}/>
                {[[cx-200,sy0+30],[cx+160,sy0+30],[cx-200,sy0+430],[cx+160,sy0+430]].map(([px,py],i)=>(
                  <g key={i} stroke={INK} strokeWidth="1.2">
                    <line x1={px-7} y1={py} x2={px+7} y2={py}/>
                    <line x1={px} y1={py-7} x2={px} y2={py+7}/>
                  </g>
                ))}
                <text x={cx - 20} y={sy0 + 64} fontFamily={MONO} fontSize="15" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.2em">QUAD PAN BUS</text>
                <text x={cx - 20} y={sy0 + 86} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6"
                  textAnchor="middle" letterSpacing="0.15em">amplitude panning · 4 ch</text>

                {/* pan visualization — small XY pad */}
                <PanPad cx={cx - 20} cy={sy0 + 260} size={220} t={localTime}/>
              </g>

              {/* 4 output channels going right to quad speakers */}
              {[0, 1, 2, 3].map((i) => {
                const y = sy0 + 80 + i * 80;
                const t0 = 1.4 + i * 0.1;
                return (
                  <g key={'out' + i} opacity={Math.min(1, Math.max(0, (localTime - t0) * 2))}>
                    <line x1={cx + 160} y1={y} x2={cx + 320} y2={y}
                      stroke={INK} strokeWidth="1.4"
                      {...drawIn(localTime, { start: t0, dur: 0.4, length: 160 })}/>
                    <text x={cx + 175} y={y - 6} fontFamily={MONO} fontSize="10" fontWeight="700" fill={INK}
                      letterSpacing="0.18em">CH {i+1}</text>
                    <polygon points={`${cx+320},${y} ${cx+310},${y-6} ${cx+310},${y+6}`} fill={INK}/>
                    <DataDot from={[cx + 160, y]} to={[cx + 320, y]} t={localTime} t0={t0 + 0.3} period={1.4 + i*0.15}/>
                  </g>
                );
              })}

              {/* 4 quad speakers stacked */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.6) * 2))}>
                <rect x={cx + 360} y={sy0 + 30} width={300} height={400} fill={PAPER} stroke={INK} strokeWidth="1.4"/>
                <text x={cx + 510} y={sy0 + 64} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.2em">QUAD OUTPUTS</text>
                {['SP_FL','SP_FR','SP_RL','SP_RR'].map((lab, i) => {
                  const y = sy0 + 100 + i * 70;
                  const active = (Math.sin(localTime * 2 + i * 1.4) > 0.3);
                  return (
                    <g key={lab} transform={`translate(${cx + 420} ${y + 20})`}>
                      <QuadSpeaker cx={0} cy={0} scale={0.7} active={active}/>
                      <text x={48} y={6} fontFamily={MONO} fontSize="13" fontWeight="700"
                        fill={INK} letterSpacing="0.12em">{lab}</text>
                    </g>
                  );
                })}
              </g>

              {/* note: ambisonic system shown grayed on far right */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 2.0) * 2))}>
                <rect x={W - 280} y={sy0 + 30} width={140} height={400} fill="none" stroke={INK}
                  strokeWidth="0.8" strokeDasharray="4 5" opacity="0.5"/>
                <text x={W - 210} y={sy0 + 64} fontFamily={MONO} fontSize="11" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.18em" opacity="0.6">AMBI</text>
                <text x={W - 210} y={sy0 + 84} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.5"
                  textAnchor="middle" letterSpacing="0.15em">(not routed)</text>
                {Array.from({length: 6}).map((_, i) => (
                  <g key={i} opacity="0.35">
                    <AmbiSpeaker cx={W - 210} cy={sy0 + 130 + i * 50} label={'A' + (i+1)} scale={0.55}/>
                  </g>
                ))}
              </g>

              {/* footer caption */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 2.4) * 1.4)) *
                          (1 - Math.min(1, Math.max(0, (localTime - (duration - 0.6)) / 0.6)))}>
                <line x1="200" y1="930" x2="1720" y2="930" stroke={INK} strokeOpacity="0.4"/>
                <text x="200" y="972" fontFamily={SERIF} fontSize="22" fill={INK} fontStyle="italic">
                  The quadraphonic ring concentrates all generative content — keeping parametric variation legible.
                </text>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

function PanPad({ cx, cy, size, t }) {
  // animated XY position
  const px = Math.sin(t * 0.7) * 0.7;
  const py = Math.cos(t * 0.5 + 0.3) * 0.7;
  const x = cx + px * (size / 2 - 14);
  const y = cy + py * (size / 2 - 14);
  return (
    <g>
      <rect x={cx - size/2} y={cy - size/2} width={size} height={size}
        fill="none" stroke={INK} strokeWidth="1"/>
      {/* axes */}
      <line x1={cx - size/2} y1={cy} x2={cx + size/2} y2={cy} stroke={INK} strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 4"/>
      <line x1={cx} y1={cy - size/2} x2={cx} y2={cy + size/2} stroke={INK} strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 4"/>
      {/* corner labels */}
      <text x={cx - size/2 + 6} y={cy - size/2 + 16} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.55"
        letterSpacing="0.15em">FL</text>
      <text x={cx + size/2 - 6} y={cy - size/2 + 16} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.55"
        textAnchor="end" letterSpacing="0.15em">FR</text>
      <text x={cx - size/2 + 6} y={cy + size/2 - 6} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.55"
        letterSpacing="0.15em">RL</text>
      <text x={cx + size/2 - 6} y={cy + size/2 - 6} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.55"
        textAnchor="end" letterSpacing="0.15em">RR</text>
      {/* current pos */}
      <line x1={cx} y1={cy} x2={x} y2={y} stroke={INK} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
      <circle cx={x} cy={y} r="9" fill={INK}/>
      <text x={cx} y={cy + size/2 + 22} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
        textAnchor="middle" letterSpacing="0.18em">PAN</text>
    </g>
  );
}

function LayerActivity({ x, y, w, h, seed, localTime }) {
  const N = 100;
  let d = '';
  for (let i = 0; i < N; i++) {
    const xi = i / (N - 1);
    const tt = localTime * (1 + seed * 0.3) - 1 + xi * 1.3;
    const v = Math.sin(tt * 6 + seed * 1.7) * 0.4
      + Math.sin(tt * 14.3 + seed * 0.6) * 0.25
      + Math.sin(tt * 27 + seed * 2.1) * 0.15;
    const px = x + xi * w;
    const py = y + h/2 - v * (h / 2 - 2);
    d += `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  return (
    <g>
      <line x1={x} y1={y + h/2} x2={x + w} y2={y + h/2} stroke={INK} strokeWidth="0.4" strokeOpacity="0.3"/>
      <path d={d} fill="none" stroke={INK} strokeWidth="1.1"/>
    </g>
  );
}

function DataDot({ from, to, t, t0, period = 1.6 }) {
  if (t < t0) return null;
  const phase = ((t - t0) / period) % 1;
  const px = from[0] + (to[0] - from[0]) * phase;
  const py = from[1] + (to[1] - from[1]) * phase;
  return <circle cx={px} cy={py} r="3.5" fill={INK} opacity={1 - phase * 0.5}/>;
}

// ── scene 5: hybrid — both subsystems running together ────────────────────

function SceneHybrid() {
  return (
    <Sprite start={25.8} end={32}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.5);
        const cx = W / 2;
        const cy = 620;

        const quadR = 320;
        const ambiR = 460;
        const ambiYSquash = 0.45;
        const elev = 60; // pixels above plane for ambi

        const quadInfo = [
          { deg: 45,  label: 'FR' },
          { deg: 135, label: 'RR' },
          { deg: 225, label: 'RL' },
          { deg: 315, label: 'FL' },
        ];
        const ambiAngs = Array.from({ length: 6 }, (_, i) => (i / 6) * 360);

        // quad source orbit (slow)
        const quadAz = (localTime * 30) % 360;
        const qa = ((quadAz - 90) * Math.PI) / 180;
        const qsx = cx + quadR * Math.cos(qa);
        const qsy = cy + quadR * 0.9 * Math.sin(qa);

        // ambi source orbit (other direction)
        const ambiAz = (180 - localTime * 22) % 360;
        const aa = ((ambiAz - 90) * Math.PI) / 180;
        const asx = cx + (ambiR * 0.85) * Math.cos(aa);
        const asy = cy - elev + (ambiR * 0.85) * ambiYSquash * Math.sin(aa);

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 7.4" title="HYBRID OPERATION  ·  SIMULTANEOUS LAYERS"
                meta="quad = generative · ambi = documentary · running together"
                t={localTime} t0={0}/>

              {/* TWO panels: left = labels/legend, right = the combined plan */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.1) * 2))}>
                {/* big stage panel */}
                <rect x={120} y={250} width={W - 240} height={650} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.1, dur: 0.8, length: 2 * (W - 240 + 650) })}/>

                {/* ambi ring (behind, elevated) */}
                <ellipse cx={cx} cy={cy - elev} rx={ambiR} ry={ambiR * ambiYSquash}
                  fill="none" stroke={INK} strokeOpacity="0.45" strokeWidth="1" strokeDasharray="6 5"/>

                {/* ambi speakers */}
                {ambiAngs.map((deg, i) => {
                  const a = (deg - 90) * Math.PI / 180;
                  const x = cx + ambiR * Math.cos(a);
                  const y = cy - elev + ambiR * ambiYSquash * Math.sin(a);
                  // gain by ambi source proximity
                  const phi = (ambiAz * Math.PI) / 180;
                  const sa = (deg * Math.PI) / 180;
                  const g = Math.max(0, Math.cos(phi - sa));
                  return (
                    <g key={'a'+i}>
                      <line x1={x} y1={y} x2={cx + (ambiR * 0.95) * Math.cos(a)} y2={cy + (ambiR * 0.95) * ambiYSquash * Math.sin(a)}
                        stroke={INK} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3"/>
                      <circle cx={x} cy={y} r={4 + g * 22} fill="none" stroke={INK} strokeWidth="0.8" opacity={g * 0.6}/>
                      <AmbiSpeaker cx={x} cy={y} label={'A' + (i+1)} scale={0.8} active={g > 0.7}/>
                    </g>
                  );
                })}

                {/* quad ring */}
                <ellipse cx={cx} cy={cy} rx={quadR} ry={quadR * 0.9}
                  fill="none" stroke={INK} strokeOpacity="0.4" strokeWidth="0.8" strokeDasharray="3 4"/>

                {/* quad speakers */}
                {quadInfo.map((sp, i) => {
                  const a = (sp.deg - 90) * Math.PI / 180;
                  const x = cx + quadR * Math.cos(a);
                  const y = cy + quadR * 0.9 * Math.sin(a);
                  // gain by quad source proximity
                  const da = ((sp.deg - quadAz + 540) % 360) - 180;
                  const rad = (da * Math.PI) / 180;
                  const g = Math.max(0, Math.cos(rad));
                  return (
                    <g key={'q'+i}>
                      <circle cx={x} cy={y} r={4 + g * 28} fill="none" stroke={INK} strokeWidth="1" opacity={g * 0.6}/>
                      <QuadSpeaker cx={x} cy={y} label={'SP_' + sp.label} active={g > 0.55} scale={0.9}/>
                    </g>
                  );
                })}

                {/* listener */}
                <Listener cx={cx} cy={cy} scale={0.95}/>

                {/* virtual sources */}
                <g opacity={Math.min(1, Math.max(0, (localTime - 0.6) * 2))}>
                  {/* quad source */}
                  <line x1={cx} y1={cy} x2={qsx} y2={qsy} stroke={INK} strokeWidth="1" strokeDasharray="3 4" opacity="0.5"/>
                  <rect x={qsx - 11} y={qsy - 11} width={22} height={22} fill={INK}/>
                  <text x={qsx} y={qsy + 6} fontFamily={MONO} fontSize="10" fill={PAPER} fontWeight="700"
                    textAnchor="middle" letterSpacing="0.1em">Q</text>
                  <text x={qsx} y={qsy - 22} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                    textAnchor="middle" letterSpacing="0.15em">generative</text>

                  {/* ambi source */}
                  <line x1={cx} y1={cy} x2={asx} y2={asy} stroke={INK} strokeWidth="1" strokeDasharray="3 4" opacity="0.5"/>
                  <circle cx={asx} cy={asy} r="11" fill={INK}/>
                  <text x={asx} y={asy + 4} fontFamily={MONO} fontSize="10" fill={PAPER} fontWeight="700"
                    textAnchor="middle" letterSpacing="0.1em">A</text>
                  <text x={asx} y={asy - 22} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                    textAnchor="middle" letterSpacing="0.15em">workshop · ambi</text>
                </g>

                {/* panel labels */}
                <text x={150} y={290} fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK}
                  letterSpacing="0.2em">PLAN  ·  COMBINED FIELD</text>
                <text x={150} y={310} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  letterSpacing="0.15em">two independent virtual-source layers</text>

                {/* Q layer call-out */}
                <g transform="translate(170 770)">
                  <rect x="0" y="0" width="260" height="100" fill="none" stroke={INK} strokeWidth="1"/>
                  <rect x="14" y="20" width="22" height="22" fill={INK}/>
                  <text x="48" y="34" fontFamily={MONO} fontSize="12" fontWeight="700" fill={INK}
                    letterSpacing="0.18em">QUAD LAYER</text>
                  <text x="48" y="54" fontFamily={MONO} fontSize="10" fill={INK} opacity="0.6"
                    letterSpacing="0.15em">PMS · OSC · STOCHASTIC</text>
                  <text x="48" y="74" fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                    letterSpacing="0.15em">spatialization · amp panning</text>
                </g>

                {/* A layer call-out */}
                <g transform="translate(1450 770)">
                  <rect x="0" y="0" width="260" height="100" fill="none" stroke={INK} strokeWidth="1"/>
                  <circle cx="26" cy="32" r="11" fill={INK}/>
                  <text x="58" y="34" fontFamily={MONO} fontSize="12" fontWeight="700" fill={INK}
                    letterSpacing="0.18em">AMBI LAYER</text>
                  <text x="58" y="54" fontFamily={MONO} fontSize="10" fill={INK} opacity="0.6"
                    letterSpacing="0.15em">DOC · WORKSHOP RECS</text>
                  <text x="58" y="74" fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                    letterSpacing="0.15em">spatialization · B-format</text>
                </g>

                {/* center caption */}
                <text x={cx} y={H - 130} fontFamily={SERIF} fontStyle="italic" fontSize="22" fill={INK}
                  textAnchor="middle">
                  hybrid architecture · functional separation · perceptual clarity
                </text>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── App ───────────────────────────────────────────────────────────────────

function App() {
  return (
    <Stage width={W} height={H} duration={DUR} background={PAPER} persistKey="spatialstage">
      <ScreenLabel/>
      <Paper/>
      <Frame/>
      <TitleBlock/>
      <Timecode/>
      <SceneTitle/>
      <SceneArchitecture/>
      <SceneQuadDetail/>
      <SceneRouting/>
      <SceneHybrid/>
    </Stage>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
