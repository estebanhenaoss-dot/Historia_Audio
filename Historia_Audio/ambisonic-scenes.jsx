// ambisonic-scenes.jsx — second-order ambisonic subsystem (FIG 20, sheet 05)
// the elevated 6-speaker ambisonic array for documentary / workshop material

const INK   = '#0a0a0a';
const PAPER = '#efece2';
const MONO  = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
const SERIF = 'Inter, system-ui, sans-serif';

const W = 1920;
const H = 1080;
const DUR = 34;

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
        FIG. 20 &nbsp;·&nbsp; 2-ND ORDER AMBISONIC
      </div>
      <div style={{ opacity: 0.55 }}>SH ENCODING &nbsp;·&nbsp; 6-SPEAKER DECODING</div>
      <div style={{ opacity: 0.55 }}>SHEET 05 / 05 &nbsp;·&nbsp; REV. A &nbsp;·&nbsp; SCALE  N.T.S.</div>
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

function AmbiSpeaker({ cx, cy, label, active = false, scale = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <circle cx="0" cy="0" r="22" fill={active ? INK : PAPER} stroke={INK} strokeWidth="1.4"/>
      <circle cx="0" cy="0" r="12" fill="none" stroke={active ? PAPER : INK} strokeWidth="0.9"/>
      <circle cx="0" cy="0" r="3.5" fill={active ? PAPER : INK}/>
      {label && (
        <text x="0" y="40" fontFamily={MONO} fontSize="10" fontWeight="700"
          fill={INK} textAnchor="middle" letterSpacing="0.15em">{label}</text>
      )}
    </g>
  );
}

// ── scene 1: title ────────────────────────────────────────────────────────

function SceneTitle() {
  return (
    <Sprite start={0.2} end={4.2}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);
        const text = 'SECOND-ORDER AMBISONIC';
        const charDelay = 0.04;
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
              ⎯⎯⎯⎯  fig. 20  ⎯⎯⎯⎯
            </div>
            <div style={{
              fontFamily: SERIF, fontSize: 100, fontWeight: 500,
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
              elevated 6-speaker array &nbsp;·&nbsp; immersive documentary layer
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

// ── scene 2: elevation view + array ───────────────────────────────────────

function SceneElevation() {
  return (
    <Sprite start={4.0} end={11.6}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);

        // SIDE VIEW (left panel): show the array is elevated ~6m above ground
        // PERSPECTIVE / TOP (right panel): show 6 speakers in ring with variable marker sizes

        // gains per speaker — from decoding matrix (varies with az/el of source)
        const az = (localTime * 35) % 360;
        const phi = (az * Math.PI) / 180;
        const gains = Array.from({ length: 6 }, (_, i) => {
          const spAng = (i * 60) * Math.PI / 180;
          return Math.max(0.15, 0.4 + 0.5 * Math.cos(phi - spAng));
        });

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 8.1" title="ELEVATED ARRAY  ·  6 LOUDSPEAKERS @ ≈6 m"
                meta="marker size = relative decoding gain"
                t={localTime} t0={0}/>

              {/* LEFT: side elevation (architectural section) */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.1) * 2))}>
                <rect x={120} y={250} width={780} height={680} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.1, dur: 0.8, length: 2920 })}/>
                <text x={140} y={284} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} letterSpacing="0.18em">[A]  SIDE ELEVATION</text>
                <text x={140} y={304} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  letterSpacing="0.15em">section view · z-axis</text>

                {/* ground line */}
                <line x1={170} y1={820} x2={860} y2={820} stroke={INK} strokeWidth="1.2"
                  {...drawIn(localTime, { start: 0.4, dur: 0.6, length: 690 })}/>
                {/* ground hatching */}
                {Array.from({ length: 14 }).map((_, i) => (
                  <line key={i}
                    x1={180 + i * 50} y1={820}
                    x2={170 + i * 50} y2={836}
                    stroke={INK} strokeWidth="0.6" opacity="0.5"/>
                ))}
                <text x={170} y={856} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.5"
                  letterSpacing="0.15em">GROUND  ·  z = 0</text>

                {/* listener silhouette */}
                <g transform="translate(515 820)" opacity={Math.min(1, Math.max(0, (localTime - 0.5) * 2))}>
                  <circle cx="0" cy="-180" r="14" fill="none" stroke={INK} strokeWidth="1.2"/>
                  <path d="M -22 -32 Q 0 -160 22 -32 L 22 0 L -22 0 Z" fill="none" stroke={INK} strokeWidth="1.2"/>
                  <text x="0" y="20" fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                    textAnchor="middle" letterSpacing="0.2em">LISTENER</text>
                  <text x="-32" y="-90" fontFamily={MONO} fontSize="10" fill={INK} opacity="0.5"
                    textAnchor="end" letterSpacing="0.15em">≈ 1.7 m</text>
                </g>

                {/* elevation dimension on left */}
                <g opacity={Math.min(1, Math.max(0, (localTime - 0.8) * 2))}>
                  <line x1={200} y1={820} x2={200} y2={350} stroke={INK} strokeWidth="1"/>
                  <polygon points="200,820 195,808 205,808" fill={INK}/>
                  <polygon points="200,350 195,362 205,362" fill={INK}/>
                  <line x1={190} y1={350} x2={870} y2={350} stroke={INK} strokeWidth="0.5" strokeDasharray="3 4" opacity="0.5"/>
                  <text x={224} y={590} fontFamily={MONO} fontSize="22" fontWeight="700"
                    fill={INK}>≈ 6.0 m</text>
                  <text x={224} y={612} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                    letterSpacing="0.18em">array elevation</text>
                </g>

                {/* speakers at elevation, projected as a side row */}
                <g opacity={Math.min(1, Math.max(0, (localTime - 1.0) * 2))}>
                  {gains.map((g, i) => {
                    // distribute 6 speakers horizontally on the elevation level
                    const sx = 320 + i * 100;
                    const sy = 350;
                    return (
                      <g key={i}>
                        {/* hanging cable */}
                        <line x1={sx} y1={250} x2={sx} y2={sy - 20} stroke={INK} strokeWidth="0.6" strokeOpacity="0.5" strokeDasharray="3 3"/>
                        <AmbiSpeaker cx={sx} cy={sy} label={'A' + (i+1)} scale={0.6 + g * 0.6}/>
                        {/* gain readout */}
                        <text x={sx} y={sy + 60} fontFamily={MONO} fontSize="11" fontWeight="700" fill={INK}
                          textAnchor="middle" letterSpacing="0.1em">
                          {(g * 100).toFixed(0)}%
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* ceiling reference */}
                <g opacity={Math.min(1, Math.max(0, (localTime - 1.2) * 2))}>
                  <line x1={170} y1={300} x2={860} y2={300} stroke={INK} strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="2 5"/>
                  <text x={860} y={296} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.45"
                    textAnchor="end" letterSpacing="0.15em">CEILING / TRUSS</text>
                </g>
              </g>

              {/* RIGHT: top view / decoding gain */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.3) * 2))}>
                <rect x={950} y={250} width={790} height={680} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.3, dur: 0.8, length: 2940 })}/>
                <text x={970} y={284} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} letterSpacing="0.18em">[B]  TOP VIEW  ·  AZIMUTHAL DISTRIBUTION</text>
                <text x={970} y={304} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  letterSpacing="0.15em">marker size ∝ gain from decoding matrix</text>

                <TopArrayView cx={1340} cy={620} r={250} az={az} gains={gains}/>

                {/* azimuth indicator */}
                <text x={1340} y={910} fontFamily={MONO} fontSize="12" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.15em">
                  φ_src = {Math.round(az).toString().padStart(3,'0')}°   ·   θ_src = +30°
                </text>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

function TopArrayView({ cx, cy, r, az, gains }) {
  const phi = (az * Math.PI) / 180;
  const srcX = cx + (r - 70) * Math.sin(phi);
  const srcY = cy - (r - 70) * Math.cos(phi);
  return (
    <g>
      {/* ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeOpacity="0.4" strokeDasharray="4 5"/>
      <circle cx={cx} cy={cy} r={r - 30} fill="none" stroke={INK} strokeOpacity="0.2" strokeDasharray="2 4"/>
      {/* axes / cardinals */}
      {[[0,'0°'],[90,'90°'],[180,'180°'],[270,'270°']].map(([deg, lab]) => {
        const a = (deg - 90) * Math.PI / 180;
        const tx = cx + (r + 24) * Math.cos(a);
        const ty = cy + (r + 24) * Math.sin(a) + 4;
        return (
          <text key={deg} x={tx} y={ty} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
            textAnchor="middle" letterSpacing="0.12em">{lab}</text>
        );
      })}
      {/* listener */}
      <circle cx={cx} cy={cy} r="5" fill={INK}/>
      <text x={cx} y={cy + 24} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.55"
        textAnchor="middle" letterSpacing="0.2em">LISTENER</text>
      {/* 6 speakers */}
      {gains.map((g, i) => {
        const a = (i * 60 - 90) * Math.PI / 180;
        const sx = cx + r * Math.cos(a);
        const sy = cy + r * Math.sin(a);
        return (
          <g key={i}>
            {/* gain ray */}
            <line x1={cx} y1={cy} x2={sx} y2={sy}
              stroke={INK} strokeWidth={0.4 + g * 1.6} opacity={0.18 + g * 0.4}/>
            {/* gain halo */}
            <circle cx={sx} cy={sy} r={6 + g * 28} fill="none" stroke={INK} strokeWidth="1" opacity={g * 0.65}/>
            <AmbiSpeaker cx={sx} cy={sy} label={'A' + (i+1)} scale={0.5 + g * 0.7} active={g > 0.7}/>
          </g>
        );
      })}
      {/* virtual source */}
      <line x1={cx} y1={cy} x2={srcX} y2={srcY} stroke={INK} strokeWidth="1.2" strokeDasharray="3 4" opacity="0.6"/>
      <circle cx={srcX} cy={srcY} r="11" fill={INK}/>
      <text x={srcX} y={srcY + 4} fontFamily={MONO} fontSize="10" fontWeight="700" fill={PAPER}
        textAnchor="middle" letterSpacing="0.1em">S</text>
    </g>
  );
}

// ── scene 3: spherical harmonic encoding (2nd-order basis) ────────────────

function SceneSHEncoding() {
  return (
    <Sprite start={11.4} end={20.0}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);

        // animate az/el of source
        const az = (localTime * 22 + 30) % 360;
        const el = Math.sin(localTime * 0.4) * 30 + 20;

        // 2nd-order: 9 channels (W, Y, Z, X, V, T, R, S, U) in ACN; we'll use traditional FuMa
        const channels = [
          { id: 'W',  order: 0, label: 'W',  desc: 'omni' },
          { id: 'X',  order: 1, label: 'X',  desc: 'front-back · cos(φ)cos(θ)' },
          { id: 'Y',  order: 1, label: 'Y',  desc: 'left-right · sin(φ)cos(θ)' },
          { id: 'Z',  order: 1, label: 'Z',  desc: 'up-down · sin(θ)' },
          { id: 'R',  order: 2, label: 'R',  desc: '3sin²θ − 1' },
          { id: 'S',  order: 2, label: 'S',  desc: 'cos(φ)sin(2θ)' },
          { id: 'T',  order: 2, label: 'T',  desc: 'sin(φ)sin(2θ)' },
          { id: 'U',  order: 2, label: 'U',  desc: 'cos(2φ)cos²θ' },
          { id: 'V',  order: 2, label: 'V',  desc: 'sin(2φ)cos²θ' },
        ];

        // compute coefficient per channel
        const phi = (az * Math.PI) / 180;
        const theta = (el * Math.PI) / 180;
        const coefs = {
          W: 0.707,
          X: Math.cos(phi) * Math.cos(theta),
          Y: Math.sin(phi) * Math.cos(theta),
          Z: Math.sin(theta),
          R: 0.5 * (3 * Math.sin(theta)*Math.sin(theta) - 1),
          S: Math.cos(phi) * Math.sin(2*theta),
          T: Math.sin(phi) * Math.sin(2*theta),
          U: Math.cos(2*phi) * Math.cos(theta)*Math.cos(theta),
          V: Math.sin(2*phi) * Math.cos(theta)*Math.cos(theta),
        };

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 8.2" title="ENCODING  ·  SPHERICAL HARMONICS  ·  2-ND ORDER"
                meta="mono source → projection onto SH basis (9 channels)"
                t={localTime} t0={0}/>

              {/* LEFT: source + az/el sphere */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.1) * 2))}>
                <rect x={120} y={250} width={520} height={680} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.1, dur: 0.8, length: 2400 })}/>
                <text x={140} y={284} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} letterSpacing="0.18em">[A]  SOURCE DIRECTION</text>
                <text x={140} y={304} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  letterSpacing="0.15em">azimuth φ · elevation θ</text>

                <Sphere cx={380} cy={590} r={210} az={az} el={el}/>

                {/* az/el readout */}
                <g transform="translate(160 850)">
                  <text x="0" y="0" fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                    letterSpacing="0.18em">DIRECTION</text>
                  <text x="0" y="32" fontFamily={MONO} fontSize="22" fontWeight="700" fill={INK}>
                    φ = {Math.round(az).toString().padStart(3,'0')}°
                  </text>
                  <text x="240" y="32" fontFamily={MONO} fontSize="22" fontWeight="700" fill={INK}>
                    θ = {(el >= 0 ? '+' : '') + Math.round(el).toString().padStart(2,'0')}°
                  </text>
                </g>
              </g>

              {/* CENTER: encoder block */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.4) * 2))}>
                <line x1={640} y1={590} x2={720} y2={590} stroke={INK} strokeWidth="1.6"/>
                <polygon points={`${720},${590} ${710},${584} ${710},${596}`} fill={INK}/>
                <rect x={720} y={520} width={140} height={140} fill={PAPER} stroke={INK} strokeWidth="1.6"/>
                {[[720,520],[860,520],[720,660],[860,660]].map(([px,py],i)=>(
                  <g key={i} stroke={INK} strokeWidth="1.2">
                    <line x1={px-6} y1={py} x2={px+6} y2={py}/>
                    <line x1={px} y1={py-6} x2={px} y2={py+6}/>
                  </g>
                ))}
                <text x={790} y={585} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.15em">SH</text>
                <text x={790} y={605} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.15em">ENCODE</text>
                <text x={790} y={690} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.12em">x(t) · Y_lm(φ,θ)</text>
                {/* arrow out */}
                <line x1={860} y1={590} x2={940} y2={590} stroke={INK} strokeWidth="1.6"/>
                <polygon points={`${940},${590} ${930},${584} ${930},${596}`} fill={INK}/>
              </g>

              {/* RIGHT: 9 SH channel visualizations */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.6) * 2))}>
                <rect x={940} y={250} width={800} height={680} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.6, dur: 0.8, length: 2960 })}/>
                <text x={960} y={284} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} letterSpacing="0.18em">[B]  B-FORMAT  ·  9 SH CHANNELS</text>
                <text x={960} y={304} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  letterSpacing="0.15em">orders 0 → 2 · 1 + 3 + 5 = 9 components</text>

                {/* tier headers */}
                {[['ORDER 0', 0], ['ORDER 1', 1], ['ORDER 2', 2]].map(([label, ord], i) => {
                  const tx = 1010 + (ord === 0 ? 100 : ord === 1 ? 250 : 540);
                  return (
                    <text key={i} x={tx} y={335} fontFamily={MONO} fontSize="10" fontWeight="700"
                      fill={INK} textAnchor="middle" letterSpacing="0.2em" opacity="0.65">{label}</text>
                  );
                })}

                {/* 9 cells in a row, grouped by order */}
                {channels.map((ch, i) => {
                  const colInOrder = ch.order === 0 ? 0 : (ch.order === 1 ? (['X','Y','Z'].indexOf(ch.id)) : (['R','S','T','U','V'].indexOf(ch.id)));
                  const groupX = ch.order === 0 ? 980 : ch.order === 1 ? 1110 : 1370;
                  const x = groupX + colInOrder * 80;
                  const y = 360;
                  const cellW = 70, cellH = 70;
                  const v = coefs[ch.id];
                  return (
                    <g key={ch.id}>
                      {/* SH lobe glyph */}
                      <rect x={x} y={y} width={cellW} height={cellH} fill={PAPER} stroke={INK} strokeWidth="1"/>
                      <g transform={`translate(${x + cellW/2} ${y + cellH/2})`}>
                        <SHGlyph kind={ch.id} size={26}/>
                      </g>
                      {/* channel label */}
                      <text x={x + cellW/2} y={y + cellH + 18} fontFamily={MONO} fontSize="14" fontWeight="700"
                        fill={INK} textAnchor="middle" letterSpacing="0.1em">{ch.label}</text>
                      {/* coef bar */}
                      <g transform={`translate(${x} ${y + cellH + 30})`}>
                        <line x1={cellW/2} y1={0} x2={cellW/2} y2={70}
                          stroke={INK} strokeWidth="0.4" strokeOpacity="0.4" strokeDasharray="2 3"/>
                        <rect x={0} y={0} width={cellW} height={70}
                          fill="none" stroke={INK} strokeWidth="0.6"/>
                        {/* bar from center (zero) up or down */}
                        <rect x={cellW/2 - 6}
                          y={v >= 0 ? 35 - v * 32 : 35}
                          width={12}
                          height={Math.abs(v) * 32}
                          fill={INK}/>
                        <line x1={0} y1={35} x2={cellW} y2={35}
                          stroke={INK} strokeWidth="0.8" opacity="0.6"/>
                        <text x={cellW/2} y={88} fontFamily={MONO} fontSize="10" fontWeight="700"
                          fill={INK} textAnchor="middle" letterSpacing="0.06em">
                          {v >= 0 ? '+' : ''}{v.toFixed(2)}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* explanation footer of this panel */}
                <g transform="translate(960 800)">
                  <text x="0" y="0" fontFamily={MONO} fontSize="11" fontWeight="700"
                    fill={INK} letterSpacing="0.18em">PROJECTION</text>
                  <text x="0" y="22" fontFamily={SERIF} fontStyle="italic" fontSize="18" fill={INK}>
                    B_lm(t)  =  x(t)  ·  Y_lm(φ, θ)
                  </text>
                  <text x="0" y="48" fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                    letterSpacing="0.15em">monophonic carrier modulated by each SH basis function</text>
                </g>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

function Sphere({ cx, cy, r, az, el }) {
  // wireframe sphere with meridians/parallels
  const phi = (az * Math.PI) / 180;
  const theta = (el * Math.PI) / 180;
  // source point on sphere
  const sx = cx + r * Math.sin(phi) * Math.cos(theta);
  const sy = cy - r * Math.sin(theta);
  const sxFront = Math.cos(phi) > 0; // front or back
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={PAPER} stroke={INK} strokeWidth="1.4"/>
      {/* equator */}
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.18}
        fill="none" stroke={INK} strokeOpacity="0.35" strokeDasharray="4 4"/>
      {/* meridians */}
      {[0, 45, 90, 135].map((deg, i) => {
        const k = Math.cos(deg * Math.PI / 180);
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={r * Math.abs(k) || 0.1} ry={r}
            fill="none" stroke={INK} strokeOpacity="0.25" strokeWidth="0.6"
            strokeDasharray="3 4"/>
        );
      })}
      {/* parallels */}
      {[-60, -30, 30, 60].map((deg, i) => {
        const t = (deg * Math.PI) / 180;
        const py = cy - r * Math.sin(t);
        const px = r * Math.cos(t);
        return (
          <ellipse key={i} cx={cx} cy={py} rx={px} ry={px * 0.18}
            fill="none" stroke={INK} strokeOpacity="0.18" strokeWidth="0.5"/>
        );
      })}
      {/* axes */}
      <line x1={cx - r - 16} y1={cy} x2={cx + r + 16} y2={cy} stroke={INK} strokeWidth="0.6" opacity="0.45"/>
      <line x1={cx} y1={cy - r - 16} x2={cx} y2={cy + r + 16} stroke={INK} strokeWidth="0.6" opacity="0.45"/>
      <text x={cx + r + 22} y={cy + 4} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55">+x</text>
      <text x={cx} y={cy - r - 22} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
        textAnchor="middle">+z</text>
      {/* listener at center */}
      <circle cx={cx} cy={cy} r="4" fill={INK}/>
      {/* source vector */}
      <line x1={cx} y1={cy} x2={sx} y2={sy} stroke={INK} strokeWidth="1.2"
        strokeDasharray={sxFront ? '0' : '4 4'}/>
      <circle cx={sx} cy={sy} r="11" fill={INK}/>
      <text x={sx} y={sy - 18} fontFamily={MONO} fontSize="10" fontWeight="700" fill={INK}
        textAnchor="middle" letterSpacing="0.1em">SRC</text>
      {/* azimuth arc at equator */}
      <path d={`M ${cx + 50} ${cy} A 50 9 0 0 1 ${cx + 50 * Math.cos(phi)} ${cy + 9 * Math.sin(phi)}`}
        fill="none" stroke={INK} strokeWidth="0.8" opacity="0.6"/>
      <text x={cx + 60} y={cy + 16} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.6"
        letterSpacing="0.1em">φ</text>
      {/* elevation arc */}
      <path d={`M ${cx} ${cy - 50} A 50 50 0 0 0 ${cx - 50 * Math.cos(theta)} ${cy - 50 * Math.sin(theta) - 0}`}
        fill="none" stroke={INK} strokeWidth="0.8" opacity="0.6"/>
      <text x={cx - 18} y={cy - 56} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.6"
        letterSpacing="0.1em">θ</text>
    </g>
  );
}

// glyph for spherical harmonic lobes (highly simplified iconic representation)
function SHGlyph({ kind, size = 24 }) {
  const s = size;
  const c = INK;
  // simplified shapes for visual identity, not accurate plots
  switch (kind) {
    case 'W':
      return <circle cx={0} cy={0} r={s} fill={c} opacity="0.85"/>;
    case 'X': // front-back: two lobes left/right
      return (
        <g>
          <ellipse cx={-s*0.5} cy={0} rx={s*0.5} ry={s*0.55} fill={c} opacity="0.85"/>
          <ellipse cx={s*0.5} cy={0} rx={s*0.5} ry={s*0.55} fill={c} opacity="0.25"/>
        </g>
      );
    case 'Y': // left-right: two lobes up/down
      return (
        <g>
          <ellipse cx={0} cy={-s*0.5} rx={s*0.55} ry={s*0.5} fill={c} opacity="0.85"/>
          <ellipse cx={0} cy={s*0.5} rx={s*0.55} ry={s*0.5} fill={c} opacity="0.25"/>
        </g>
      );
    case 'Z':
      return (
        <g>
          <ellipse cx={0} cy={-s*0.5} rx={s*0.6} ry={s*0.45} fill={c} opacity="0.85"/>
          <ellipse cx={0} cy={s*0.5} rx={s*0.6} ry={s*0.45} fill={c} opacity="0.85"/>
        </g>
      );
    case 'R': // donut + center
      return (
        <g>
          <ellipse cx={0} cy={0} rx={s*0.95} ry={s*0.35} fill={c} opacity="0.7"/>
          <ellipse cx={0} cy={0} rx={s*0.35} ry={s*0.95} fill={PAPER} opacity="1"/>
          <circle cx={0} cy={0} r={s*0.25} fill={c}/>
        </g>
      );
    case 'S': // four-leaf at 45°, x dimension
      return (
        <g transform="rotate(45)">
          <ellipse cx={-s*0.55} cy={-s*0.55} rx={s*0.32} ry={s*0.32} fill={c} opacity="0.75"/>
          <ellipse cx={s*0.55} cy={s*0.55} rx={s*0.32} ry={s*0.32} fill={c} opacity="0.75"/>
          <ellipse cx={-s*0.55} cy={s*0.55} rx={s*0.32} ry={s*0.32} fill={c} opacity="0.25"/>
          <ellipse cx={s*0.55} cy={-s*0.55} rx={s*0.32} ry={s*0.32} fill={c} opacity="0.25"/>
        </g>
      );
    case 'T':
      return (
        <g transform="rotate(0)">
          <ellipse cx={-s*0.55} cy={-s*0.55} rx={s*0.32} ry={s*0.32} fill={c} opacity="0.75"/>
          <ellipse cx={s*0.55} cy={s*0.55} rx={s*0.32} ry={s*0.32} fill={c} opacity="0.75"/>
          <ellipse cx={-s*0.55} cy={s*0.55} rx={s*0.32} ry={s*0.32} fill={c} opacity="0.25"/>
          <ellipse cx={s*0.55} cy={-s*0.55} rx={s*0.32} ry={s*0.32} fill={c} opacity="0.25"/>
        </g>
      );
    case 'U': // four-leaf horizontal
      return (
        <g>
          <ellipse cx={-s*0.65} cy={0} rx={s*0.32} ry={s*0.5} fill={c} opacity="0.8"/>
          <ellipse cx={s*0.65} cy={0} rx={s*0.32} ry={s*0.5} fill={c} opacity="0.8"/>
          <ellipse cx={0} cy={-s*0.65} rx={s*0.5} ry={s*0.32} fill={c} opacity="0.3"/>
          <ellipse cx={0} cy={s*0.65} rx={s*0.5} ry={s*0.32} fill={c} opacity="0.3"/>
        </g>
      );
    case 'V':
      return (
        <g transform="rotate(45)">
          <ellipse cx={-s*0.65} cy={0} rx={s*0.32} ry={s*0.5} fill={c} opacity="0.8"/>
          <ellipse cx={s*0.65} cy={0} rx={s*0.32} ry={s*0.5} fill={c} opacity="0.8"/>
          <ellipse cx={0} cy={-s*0.65} rx={s*0.5} ry={s*0.32} fill={c} opacity="0.3"/>
          <ellipse cx={0} cy={s*0.65} rx={s*0.5} ry={s*0.32} fill={c} opacity="0.3"/>
        </g>
      );
    default:
      return <circle cx={0} cy={0} r={s*0.5} fill={c}/>;
  }
}

// ── scene 4: decoding matrix → 6 loudspeaker feeds ────────────────────────

function SceneDecoding() {
  return (
    <Sprite start={19.8} end={27.6}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);

        // animate az for matrix visualization
        const az = (localTime * 18) % 360;
        const phi = (az * Math.PI) / 180;

        // 9×6 matrix (9 SH channels × 6 speakers); compute pseudo coefficients
        // simplified: gain per speaker based on direction
        const speakerCount = 6;
        const channelCount = 9;
        const matrix = [];
        for (let r = 0; r < channelCount; r++) {
          const row = [];
          for (let c = 0; c < speakerCount; c++) {
            const spAng = (c * 60) * Math.PI / 180;
            let v = 0;
            switch (r) {
              case 0: v = 0.4; break; // W contribution flat
              case 1: v = Math.cos(spAng) * 0.5; break;
              case 2: v = Math.sin(spAng) * 0.5; break;
              case 3: v = 0.2; break;
              case 4: v = -0.1; break;
              case 5: v = Math.cos(spAng) * 0.25; break;
              case 6: v = Math.sin(spAng) * 0.25; break;
              case 7: v = Math.cos(2*spAng) * 0.2; break;
              case 8: v = Math.sin(2*spAng) * 0.2; break;
            }
            row.push(v);
          }
          matrix.push(row);
        }

        // speaker outputs: weighted sum (using current az as input direction)
        const inputCoefs = [
          0.707,
          Math.cos(phi), Math.sin(phi), 0.5,
          0, Math.cos(phi)*0.5, Math.sin(phi)*0.5, Math.cos(2*phi)*0.4, Math.sin(2*phi)*0.4
        ];
        const speakerOut = Array.from({ length: 6 }, (_, c) => {
          let s = 0;
          for (let r = 0; r < channelCount; r++) s += matrix[r][c] * inputCoefs[r];
          return s;
        });
        const norm = Math.max(...speakerOut.map(s => Math.abs(s)), 0.001);
        const normed = speakerOut.map(s => s / norm);

        const labels = ['W','X','Y','Z','R','S','T','U','V'];

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 8.3" title="DECODING MATRIX  ·  9  →  6"
                meta="B-format components → speaker feeds (optimized for layout)"
                t={localTime} t0={0}/>

              {/* LEFT: 9 SH inputs as column */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.1) * 2))}>
                <rect x={140} y={250} width={180} height={680} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.1, dur: 0.7, length: 1720 })}/>
                <text x={230} y={284} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.18em">B-FORMAT IN</text>
                <text x={230} y={304} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.15em">9 components</text>
                {labels.map((lab, i) => {
                  const ly = 350 + i * 60;
                  const v = inputCoefs[i];
                  return (
                    <g key={i}>
                      <text x={170} y={ly + 4} fontFamily={MONO} fontSize="18" fontWeight="700"
                        fill={INK} letterSpacing="0.1em">{lab}</text>
                      <rect x={210} y={ly - 12} width={90} height={24} fill="none" stroke={INK} strokeWidth="0.8" strokeOpacity="0.5"/>
                      <rect x={210 + 45 - 1}
                        y={v >= 0 ? ly - 10 : ly + 1}
                        width={Math.max(2, Math.abs(v) * 42)}
                        height={10}
                        fill={INK}
                        transform={`scale(${v >= 0 ? 1 : -1} 1)`}
                        style={{ transformOrigin: `${210 + 45}px ${ly}px` }}/>
                      <line x1={210 + 45} y1={ly - 12} x2={210 + 45} y2={ly + 12}
                        stroke={INK} strokeWidth="0.6" opacity="0.6"/>
                    </g>
                  );
                })}
              </g>

              {/* CENTER: matrix grid */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.3) * 2))}>
                <rect x={420} y={250} width={780} height={680} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.3, dur: 0.8, length: 2920 })}/>
                <text x={810} y={284} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.18em">DECODING MATRIX</text>
                <text x={810} y={304} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.15em">M ∈ ℝ^(9 × 6)</text>

                {/* matrix cells */}
                {(() => {
                  const cellW = 100, cellH = 60;
                  const ox = 510, oy = 360;
                  return matrix.map((row, r) => row.map((v, c) => {
                    const x = ox + c * cellW;
                    const y = oy + r * cellH;
                    return (
                      <g key={`${r}-${c}`}>
                        <rect x={x} y={y} width={cellW - 2} height={cellH - 2}
                          fill={INK} opacity={0.06 + Math.abs(v) * 0.7}
                          stroke={INK} strokeWidth="0.4" strokeOpacity="0.3"/>
                        <text x={x + cellW/2 - 1} y={y + cellH/2 + 5}
                          fontFamily={MONO} fontSize="11" fontWeight="600"
                          fill={Math.abs(v) > 0.5 ? PAPER : INK}
                          textAnchor="middle" letterSpacing="0.04em">
                          {(v >= 0 ? '+' : '') + v.toFixed(2)}
                        </text>
                      </g>
                    );
                  }));
                })()}

                {/* column headers — speakers */}
                {Array.from({ length: 6 }).map((_, c) => (
                  <text key={c} x={560 + c * 100} y={345}
                    fontFamily={MONO} fontSize="11" fontWeight="700"
                    fill={INK} textAnchor="middle" letterSpacing="0.1em">SP{c+1}</text>
                ))}

                {/* row labels — channels */}
                {labels.map((lab, r) => (
                  <text key={r} x={494} y={360 + r * 60 + 35}
                    fontFamily={MONO} fontSize="13" fontWeight="700"
                    fill={INK} textAnchor="end" letterSpacing="0.1em">{lab}</text>
                ))}

                {/* matrix multiply notation */}
                <text x={810} y={905} fontFamily={SERIF} fontStyle="italic" fontSize="18"
                  fill={INK} textAnchor="middle">
                  y_sp(t)  =  M  ·  B(t)
                </text>
              </g>

              {/* RIGHT: 6 speaker outputs */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.6) * 2))}>
                <rect x={1250} y={250} width={490} height={680} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.6, dur: 0.8, length: 2340 })}/>
                <text x={1495} y={284} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.18em">6 LOUDSPEAKER FEEDS</text>
                <text x={1495} y={304} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.15em">decoded · ready for amplification</text>

                {/* 6 horizontal output strips */}
                {Array.from({ length: 6 }).map((_, i) => {
                  const oy = 360 + i * 90;
                  const lvl = normed[i];
                  return (
                    <g key={i}>
                      <text x={1280} y={oy + 28} fontFamily={MONO} fontSize="13" fontWeight="700"
                        fill={INK} letterSpacing="0.12em">SP{i+1}</text>
                      {/* meter */}
                      <rect x={1330} y={oy + 12} width={250} height={30}
                        fill="none" stroke={INK} strokeWidth="0.8" strokeOpacity="0.6"/>
                      <line x1={1455} y1={oy + 8} x2={1455} y2={oy + 46}
                        stroke={INK} strokeWidth="0.8" opacity="0.5"/>
                      <rect x={lvl >= 0 ? 1455 : 1455 + lvl * 122}
                        y={oy + 14}
                        width={Math.abs(lvl) * 122}
                        height={26}
                        fill={INK}/>
                      {/* % readout */}
                      <text x={1600} y={oy + 33} fontFamily={MONO} fontSize="13" fontWeight="700"
                        fill={INK} letterSpacing="0.04em">
                        {(lvl >= 0 ? '+' : '')}{(lvl * 100).toFixed(0)}%
                      </text>
                      <AmbiSpeaker cx={1695} cy={oy + 28} label="" scale={0.45} active={Math.abs(lvl) > 0.6}/>
                    </g>
                  );
                })}

                <text x={1495} y={905} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.18em">
                  →  POWER STAGE  ·  6× INDEPENDENT
                </text>
              </g>

              {/* arrow lines connecting columns */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.4) * 2))}>
                <line x1={320} y1={590} x2={420} y2={590} stroke={INK} strokeWidth="1.6"/>
                <polygon points={`${420},${590} ${410},${584} ${410},${596}`} fill={INK}/>
                <line x1={1200} y1={590} x2={1250} y2={590} stroke={INK} strokeWidth="1.6"/>
                <polygon points={`${1250},${590} ${1240},${584} ${1240},${596}`} fill={INK}/>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── scene 5: hybrid summary ───────────────────────────────────────────────

function SceneSummary() {
  return (
    <Sprite start={27.4} end={34}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.5);

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 8.4" title="HYBRID  ·  FUNCTIONAL LAYER SEPARATION"
                meta="quad = generative · ambi = documentary"
                t={localTime} t0={0}/>

              {/* two big panels side by side */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.1) * 2))}>
                {/* LEFT: QUAD layer */}
                <rect x={120} y={260} width={830} height={660} fill={PAPER} stroke={INK} strokeWidth="1.6"
                  {...drawIn(localTime, { start: 0.1, dur: 0.8, length: 2980 })}/>
                <text x={140} y={300} fontFamily={MONO} fontSize="14" fontWeight="700"
                  fill={INK} letterSpacing="0.22em">QUADRAPHONIC SUBSYSTEM</text>
                <text x={140} y={324} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  letterSpacing="0.16em">generative / sonified material  ·  4 ch  ·  0° EL</text>

                {/* 4 squares arrangement */}
                <g transform="translate(535 600)">
                  {[[-180,-150],[180,-150],[-180,150],[180,150]].map(([dx,dy],i) => (
                    <g key={i}>
                      <rect x={dx-26} y={dy-26} width={52} height={52} fill={INK} stroke={INK} strokeWidth="1.4"/>
                      <circle cx={dx} cy={dy} r="14" fill="none" stroke={PAPER} strokeWidth="1"/>
                      <circle cx={dx} cy={dy} r="4" fill={PAPER}/>
                    </g>
                  ))}
                  {/* listener */}
                  <circle cx="0" cy="0" r="6" fill={INK}/>
                  <line x1="-12" y1="0" x2="12" y2="0" stroke={INK} strokeWidth="0.8"/>
                  <line x1="0" y1="-12" x2="0" y2="12" stroke={INK} strokeWidth="0.8"/>
                  {/* connecting rays */}
                  {[[-180,-150],[180,-150],[-180,150],[180,150]].map(([dx,dy],i) => (
                    <line key={'r'+i} x1="0" y1="0" x2={dx} y2={dy}
                      stroke={INK} strokeWidth="0.7" strokeDasharray="3 4" opacity="0.45"/>
                  ))}
                </g>

                {/* content list */}
                <g transform="translate(140 830)">
                  <text x="0" y="0" fontFamily={MONO} fontSize="11" fontWeight="700" fill={INK}
                    letterSpacing="0.18em">CONTENT</text>
                  <text x="0" y="26" fontFamily={MONO} fontSize="13" fill={INK} letterSpacing="0.12em">
                    ▶ PMS · environmental data sonification
                  </text>
                  <text x="0" y="48" fontFamily={MONO} fontSize="13" fill={INK} letterSpacing="0.12em">
                    ▶ Sinusoidal oscillators · proximity-controlled
                  </text>
                  <text x="0" y="70" fontFamily={MONO} fontSize="13" fill={INK} letterSpacing="0.12em">
                    ▶ Stochastic triggers · threshold events
                  </text>
                </g>
              </g>

              {/* RIGHT: AMBI layer */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.4) * 2))}>
                <rect x={970} y={260} width={830} height={660} fill={PAPER} stroke={INK} strokeWidth="1.6"
                  {...drawIn(localTime, { start: 0.4, dur: 0.8, length: 2980 })}/>
                <text x={990} y={300} fontFamily={MONO} fontSize="14" fontWeight="700"
                  fill={INK} letterSpacing="0.22em">AMBISONIC SUBSYSTEM</text>
                <text x={990} y={324} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  letterSpacing="0.16em">documentary / immersive material  ·  6 ch  ·  +ELEV</text>

                {/* 6 circles in ring */}
                <g transform="translate(1385 600)">
                  {/* dashed ring */}
                  <ellipse cx="0" cy="0" rx="200" ry="120" fill="none" stroke={INK}
                    strokeOpacity="0.4" strokeWidth="0.8" strokeDasharray="4 5"/>
                  {/* 6 speakers */}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const ang = (i * 60 - 90) * Math.PI / 180;
                    const x = 200 * Math.cos(ang);
                    const y = 120 * Math.sin(ang);
                    const sz = 0.7 + 0.4 * Math.abs(Math.sin(i + localTime));
                    return (
                      <g key={i} transform={`translate(${x} ${y}) scale(${sz})`}>
                        <circle cx="0" cy="0" r="20" fill={INK} stroke={INK} strokeWidth="1.4"/>
                        <circle cx="0" cy="0" r="11" fill="none" stroke={PAPER} strokeWidth="1"/>
                        <circle cx="0" cy="0" r="3" fill={PAPER}/>
                      </g>
                    );
                  })}
                  {/* listener */}
                  <circle cx="0" cy="0" r="6" fill={INK}/>
                  <line x1="-12" y1="0" x2="12" y2="0" stroke={INK} strokeWidth="0.8"/>
                  <line x1="0" y1="-12" x2="0" y2="12" stroke={INK} strokeWidth="0.8"/>
                  {/* elevation tag */}
                  <text x="220" y="-130" fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                    letterSpacing="0.18em">+6 m  ·  ELEVATED</text>
                </g>

                <g transform="translate(990 830)">
                  <text x="0" y="0" fontFamily={MONO} fontSize="11" fontWeight="700" fill={INK}
                    letterSpacing="0.18em">CONTENT</text>
                  <text x="0" y="26" fontFamily={MONO} fontSize="13" fill={INK} letterSpacing="0.12em">
                    ▶ Community workshop recordings (mono + ambi)
                  </text>
                  <text x="0" y="48" fontFamily={MONO} fontSize="13" fill={INK} letterSpacing="0.12em">
                    ▶ Clap-triggered samples · random spatialization
                  </text>
                  <text x="0" y="70" fontFamily={MONO} fontSize="13" fill={INK} letterSpacing="0.12em">
                    ▶ 2-nd order SH encode  →  6-ch decode
                  </text>
                </g>
              </g>

              {/* footer summary */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.2) * 1.4)) *
                          (1 - Math.min(1, Math.max(0, (localTime - (duration - 0.6)) / 0.6)))}>
                <line x1="200" y1="960" x2="1720" y2="960" stroke={INK} strokeOpacity="0.4"/>
                <text x={W/2} y={1002} fontFamily={SERIF} fontStyle="italic" fontSize="22" fill={INK}
                  textAnchor="middle">
                  layer-based separation  ·  intelligibility of interactive flow + sense of spatial presence
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
    <Stage width={W} height={H} duration={DUR} background={PAPER} persistKey="ambistage">
      <ScreenLabel/>
      <Paper/>
      <Frame/>
      <TitleBlock/>
      <Timecode/>
      <SceneTitle/>
      <SceneElevation/>
      <SceneSHEncoding/>
      <SceneDecoding/>
      <SceneSummary/>
    </Stage>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
