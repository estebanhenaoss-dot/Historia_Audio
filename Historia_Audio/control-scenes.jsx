// control-scenes.jsx — engineering schematic animation of the control / sonification layer
// (companion to scenes.jsx — same paper aesthetic)

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

// 7 sensors' "live" distance values — pseudo-random smooth functions of time
function sensorDistance(i, t) {
  // each sensor has a different phase/frequency, distances in 0..4m
  const seeds = [
    [0.7, 0.41, 1.20],
    [0.5, 0.31, 2.10],
    [0.9, 0.55, 0.40],
    [0.6, 0.27, 3.30],
    [0.8, 0.49, 5.20],
    [0.4, 0.37, 4.60],
    [0.65, 0.61, 1.90],
  ][i];
  const v = 2.0
    + 1.3 * Math.sin(t * seeds[0] + seeds[2])
    + 0.5 * Math.sin(t * seeds[1] * 2.7 + seeds[2] * 0.6);
  return Math.max(0.15, Math.min(3.95, v));
}

function meanDistance(t) {
  let s = 0;
  for (let i = 0; i < 7; i++) s += sensorDistance(i, t);
  return s / 7;
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
        FIG. 17 &nbsp;·&nbsp; CONTROL LAYER
      </div>
      <div style={{ opacity: 0.55 }}>MACRO MEAN &nbsp;·&nbsp; MICRO OSC &nbsp;·&nbsp; STOCHASTIC</div>
      <div style={{ opacity: 0.55 }}>SHEET 02 / 02 &nbsp;·&nbsp; REV. A &nbsp;·&nbsp; SCALE  N.T.S.</div>
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

// ── section header bar with label + meta ──────────────────────────────────

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

// ── scene 1: title ────────────────────────────────────────────────────────

function SceneTitle() {
  return (
    <Sprite start={0.2} end={4.0}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);
        const text = 'THE CONTROL LAYER';
        const charDelay = 0.05;
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
              ⎯⎯⎯⎯  fig. 17  ⎯⎯⎯⎯
            </div>
            <div style={{
              fontFamily: SERIF, fontSize: 100, fontWeight: 500,
              color: INK, letterSpacing: '-0.02em', lineHeight: 1,
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
              macro mean &nbsp;·&nbsp; micro oscillators &nbsp;·&nbsp; stochastic triggers
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

// ── scene 2: macro averaging ──────────────────────────────────────────────

function SceneMean() {
  return (
    <Sprite start={3.8} end={11.2}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);
        // 7 sensor distance values "live"
        const dists = Array.from({ length: 7 }, (_, i) => sensorDistance(i, localTime + 3));
        const mu = dists.reduce((a, b) => a + b, 0) / 7;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 5.1" title="MACRO  ·  GLOBAL AVERAGE" meta="μ = mean(d₁…d₇)" t={localTime} t0={0}/>

              {/* 7 sensor distance bars on the left */}
              {dists.map((d, i) => {
                const y = 270 + i * 80;
                const barW = (d / 4.0) * 380;
                const labelT0 = 0.3 + i * 0.12;
                return (
                  <g key={i} opacity={Math.min(1, Math.max(0, (localTime - labelT0) * 2.5))}>
                    {/* sensor label */}
                    <text x={200} y={y + 8} fontFamily={MONO} fontSize="18" fontWeight="700"
                      fill={INK} letterSpacing="0.1em">S{i + 1}</text>
                    {/* bar track */}
                    <rect x={260} y={y - 12} width={400} height={24}
                      fill="none" stroke={INK} strokeWidth="1" strokeOpacity="0.5"/>
                    {/* ticks 0/1/2/3/4 m */}
                    {[0, 1, 2, 3, 4].map(m => (
                      <line key={m} x1={260 + m * 95} y1={y - 16} x2={260 + m * 95} y2={y - 12}
                        stroke={INK} strokeWidth="0.8" strokeOpacity="0.6"/>
                    ))}
                    {/* filled bar */}
                    <rect x={262} y={y - 10} width={Math.max(2, barW - 4)} height={20} fill={INK}/>
                    {/* numeric value */}
                    <text x={700} y={y + 8} fontFamily={MONO} fontSize="20"
                      fill={INK} letterSpacing="0.05em" fontWeight="600">
                      {d.toFixed(2)}<tspan fontSize="12" opacity="0.6"> m</tspan>
                    </text>
                    {/* feed line going right toward summation */}
                    <line x1={830} y1={y} x2={1020} y2={y}
                      stroke={INK} strokeWidth="0.9" strokeOpacity={0.55}
                      {...drawIn(localTime, { start: 1.4 + i * 0.05, dur: 0.5, length: 220 })}/>
                    {/* traveling pulse */}
                    <PipeDot x1={830} x2={1020} y={y} t={localTime} t0={1.9 + i * 0.04} period={1.8}/>
                  </g>
                );
              })}

              {/* unit label */}
              <text x="460" y="252" fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                textAnchor="middle" letterSpacing="0.2em">DISTANCE / m</text>
              <text x="700" y="252" fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                textAnchor="middle" letterSpacing="0.2em">VALUE</text>

              {/* summation node */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.6) * 2))}>
                <circle cx={1080} cy={560} r="80" fill={PAPER} stroke={INK} strokeWidth="1.6"/>
                <text x={1080} y={580} fontFamily={SERIF} fontSize="80" fill={INK}
                  textAnchor="middle" fontWeight="500">∑</text>
                <text x={1080} y={680} fontFamily={MONO} fontSize="13" fill={INK}
                  textAnchor="middle" letterSpacing="0.15em">DIVIDE / 7</text>
              </g>

              {/* arrow from summation to mu output */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 2.4) * 2))}>
                <line x1={1170} y1={560} x2={1350} y2={560}
                  stroke={INK} strokeWidth="1.6"
                  {...drawIn(localTime, { start: 2.0, dur: 0.5, length: 200 })}/>
                <polygon points={`${1350},${560} ${1340},${554} ${1340},${566}`} fill={INK}/>
                <text x={1260} y={538} fontFamily={MONO} fontSize="12" fill={INK} opacity="0.6"
                  textAnchor="middle" letterSpacing="0.15em">macro-control</text>
                <PipeDot x1={1170} x2={1350} y={560} t={localTime} t0={2.4} period={2.0}/>
              </g>

              {/* μ readout */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 2.6) * 2))}>
                <rect x={1370} y={420} width={380} height={280} fill={PAPER} stroke={INK} strokeWidth="1.6"
                  {...drawIn(localTime, { start: 2.2, dur: 0.8, length: 1320 })}/>
                {/* corner ticks */}
                {[[1370,420],[1750,420],[1370,700],[1750,700]].map(([x,y],i)=>(
                  <g key={i} stroke={INK} strokeWidth="1.2">
                    <line x1={x-7} y1={y} x2={x+7} y2={y}/>
                    <line x1={x} y1={y-7} x2={x} y2={y+7}/>
                  </g>
                ))}
                <text x={1560} y={460} fontFamily={MONO} fontSize="13" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.22em">μ &nbsp;·&nbsp; MEAN DISTANCE</text>
                <text x={1560} y={585} fontFamily={MONO} fontSize="110" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.02em">
                  {mu.toFixed(2)}
                </text>
                <text x={1560} y={620} fontFamily={MONO} fontSize="20" fill={INK} opacity="0.6"
                  textAnchor="middle" letterSpacing="0.2em">m</text>
                <line x1={1410} y1={645} x2={1710} y2={645} stroke={INK} strokeOpacity="0.4"/>
                <text x={1560} y={680} fontFamily={MONO} fontSize="13" fill={INK} opacity="0.6"
                  textAnchor="middle" letterSpacing="0.18em">→ DATA-RATE · F_c</text>
              </g>

              {/* description footer */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 3.2) * 1.8)) *
                          (1 - Math.min(1, Math.max(0, (localTime - (duration - 0.6)) / 0.6)))}>
                <line x1="200" y1="850" x2="1720" y2="850" stroke={INK} strokeOpacity="0.4"/>
                <text x="200" y="892" fontFamily={SERIF} fontSize="22" fill={INK} fontStyle="italic">
                  The mean of the seven distances operates as a single macro-control —
                </text>
                <text x="200" y="922" fontFamily={SERIF} fontSize="22" fill={INK} fontStyle="italic">
                  steering data-rate of the air-pollution stream and the center frequency of the band-pass filter.
                </text>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

function PipeDot({ x1, x2, y, t, t0, period = 1.6 }) {
  if (t < t0) return null;
  const phase = ((t - t0) / period) % 1;
  const px = x1 + (x2 - x1) * phase;
  return <circle cx={px} cy={y} r="3.5" fill={INK} opacity={1 - phase * 0.55}/>;
}

// ── scene 3: macro — data-rate and band-pass filter ───────────────────────

function SceneMacroApp() {
  return (
    <Sprite start={11.0} end={18.4}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);
        const mu = meanDistance(localTime + 3);
        const muNorm = mu / 4.0; // 0..1

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 5.2" title="MACRO APPLICATIONS  ·  RATE  /  F_c"
                meta="μ drives both data-rate and band-pass center frequency"
                t={localTime} t0={0}/>

              {/* μ chip in the top center */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.2) * 2))}>
                <rect x={W/2 - 110} y={220} width={220} height={56} fill={INK}/>
                <text x={W/2} y={250} fontFamily={MONO} fontSize="14" fill={PAPER} opacity="0.7"
                  textAnchor="middle" letterSpacing="0.2em">μ &nbsp;·&nbsp; MACRO-CTRL</text>
                <text x={W/2} y={274} fontFamily={MONO} fontSize="22" fontWeight="700"
                  fill={PAPER} textAnchor="middle" letterSpacing="0.05em">{mu.toFixed(2)} m</text>
                {/* outgoing forks */}
                <line x1={W/2 - 60} y1={278} x2={W/2 - 60} y2={330} stroke={INK} strokeWidth="1.4"/>
                <line x1={W/2 + 60} y1={278} x2={W/2 + 60} y2={330} stroke={INK} strokeWidth="1.4"/>
                <line x1={W/2 - 60} y1={330} x2={W/2 + 60} y2={330} stroke={INK} strokeWidth="1.4"/>
                <line x1={500} y1={330} x2={W - 500} y2={330} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.3, dur: 0.6, length: 920 })}/>
                <line x1={500} y1={330} x2={500} y2={410} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.8, dur: 0.4, length: 80 })}/>
                <line x1={W - 500} y1={330} x2={W - 500} y2={410} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.8, dur: 0.4, length: 80 })}/>
                <polygon points={`${500},${410} ${494},${398} ${506},${398}`} fill={INK}
                  opacity={Math.min(1, Math.max(0, (localTime - 1.2) * 3))}/>
                <polygon points={`${W-500},${410} ${W-506},${398} ${W-494},${398}`} fill={INK}
                  opacity={Math.min(1, Math.max(0, (localTime - 1.2) * 3))}/>
              </g>

              {/* A : Medellín dataset — left half */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.0) * 2))}>
                {/* panel */}
                <rect x={120} y={420} width={780} height={460} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 1.0, dur: 0.8, length: 2480 })}/>
                <text x={140} y={460} fontFamily={MONO} fontSize="14" fontWeight="700"
                  fill={INK} letterSpacing="0.2em">[A]  DATA-RATE</text>
                <text x={140} y={482} fontFamily={MONO} fontSize="12" fill={INK} opacity="0.6"
                  letterSpacing="0.16em">MEDELLÍN · PM₂.₅ STREAM · 2020–2024</text>
                {/* y axis */}
                <line x1={170} y1={530} x2={170} y2={820} stroke={INK} strokeWidth="1"/>
                <line x1={170} y1={820} x2={870} y2={820} stroke={INK} strokeWidth="1"/>
                {/* y ticks */}
                {[0, 1, 2, 3].map(i => (
                  <g key={i}>
                    <line x1={165} y1={820 - i*72} x2={170} y2={820 - i*72} stroke={INK} strokeWidth="1"/>
                    <text x={158} y={820 - i*72 + 4} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.5"
                      textAnchor="end">{i*20}</text>
                  </g>
                ))}
                <text x={120} y={520} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                  letterSpacing="0.15em" textAnchor="start">μg/m³</text>
                <text x={880} y={840} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                  letterSpacing="0.15em" textAnchor="end">t →</text>

                {/* time series — long composite waveform */}
                <PMSeries x={170} y={820} w={700} h={290} t={localTime} muNorm={muNorm}/>

                {/* rate gauge in the corner */}
                <g transform="translate(720 510)">
                  <rect x="0" y="0" width="160" height="60" fill="none" stroke={INK} strokeWidth="1"/>
                  <text x="80" y="18" fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                    textAnchor="middle" letterSpacing="0.2em">SAMPLES / s</text>
                  <text x="80" y="48" fontFamily={MONO} fontSize="24" fontWeight="700"
                    fill={INK} textAnchor="middle">
                    {(2 + muNorm * 28).toFixed(1)}
                  </text>
                </g>
              </g>

              {/* B : Band-pass filter — right half */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.0) * 2))}>
                <rect x={W - 900} y={420} width={780} height={460} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 1.0, dur: 0.8, length: 2480 })}/>
                <text x={W - 880} y={460} fontFamily={MONO} fontSize="14" fontWeight="700"
                  fill={INK} letterSpacing="0.2em">[B]  PMS  ·  BAND-PASS</text>
                <text x={W - 880} y={482} fontFamily={MONO} fontSize="12" fill={INK} opacity="0.6"
                  letterSpacing="0.16em">F_c &nbsp;∝&nbsp; μ &nbsp;·&nbsp; spectral emphasis</text>
                {/* spectrum plot */}
                <SpectrumPlot x={W - 870} y={820} w={720} h={290} t={localTime} muNorm={muNorm}/>
                <line x1={W - 870} y1={820} x2={W - 150} y2={820} stroke={INK} strokeWidth="1"/>
                <line x1={W - 870} y1={530} x2={W - 870} y2={820} stroke={INK} strokeWidth="1"/>
                {/* y label */}
                <text x={W - 880} y={520} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                  letterSpacing="0.15em">|H(f)|</text>
                <text x={W - 150} y={840} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                  letterSpacing="0.15em" textAnchor="end">f / Hz</text>
                {/* x ticks — log-ish */}
                {[100, 500, 1000, 5000, 10000].map((f, i) => {
                  const fx = (W - 870) + (Math.log10(f / 100) / 2) * 720;
                  return (
                    <g key={i}>
                      <line x1={fx} y1={820} x2={fx} y2={825} stroke={INK} strokeWidth="0.8"/>
                      <text x={fx} y={838} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.5"
                        textAnchor="middle">{f >= 1000 ? (f/1000) + 'k' : f}</text>
                    </g>
                  );
                })}
                {/* current F_c readout */}
                <g transform={`translate(${W - 360} 510)`}>
                  <rect x="0" y="0" width="200" height="60" fill="none" stroke={INK} strokeWidth="1"/>
                  <text x="100" y="18" fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                    textAnchor="middle" letterSpacing="0.2em">F_c</text>
                  <text x="100" y="48" fontFamily={MONO} fontSize="24" fontWeight="700"
                    fill={INK} textAnchor="middle">
                    {Math.round(180 + muNorm * 5200)} Hz
                  </text>
                </g>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

// time-series mini plot (Medellín PM2.5)
function PMSeries({ x, y, w, h, t, muNorm }) {
  // playhead position scrubs forward proportional to t and rate (rate from muNorm)
  const baseSpeed = 2 + muNorm * 28; // samples/sec
  const headT = (t * baseSpeed * 0.06) % 1; // 0..1 across data window
  const N = 220;
  const pts = [];
  // a synthetic urban PM2.5 signal: smooth + bursts
  for (let i = 0; i < N; i++) {
    const xi = i / (N - 1);
    const phase = xi * Math.PI * 18;
    const v = 0.45
      + 0.25 * Math.sin(phase * 0.6 + xi * 7)
      + 0.18 * Math.sin(phase * 1.7)
      + 0.12 * Math.sin(phase * 4.1 + 0.4)
      + 0.08 * Math.exp(-Math.pow((xi - 0.45) * 8, 2)) * 4   // a smog spike
      + 0.06 * Math.exp(-Math.pow((xi - 0.78) * 9, 2)) * 3.5;
    pts.push([x + xi * w, y - Math.min(0.95, v) * h]);
  }
  const d = pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
  // playhead
  const hx = x + headT * w;
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth="1.4"/>
      {/* faint area below */}
      <path d={`${d} L ${x+w} ${y} L ${x} ${y} Z`} fill={INK} opacity="0.04"/>
      {/* playhead */}
      <line x1={hx} y1={y - h - 10} x2={hx} y2={y + 6} stroke={INK} strokeWidth="1.4"/>
      <polygon points={`${hx},${y-h-10} ${hx-6},${y-h-20} ${hx+6},${y-h-20}`} fill={INK}/>
      {/* current sample value */}
      <circle cx={hx} cy={y - (0.45 + 0.25 * Math.sin(headT * Math.PI * 18 * 0.6 + headT * 7)) * h} r="4" fill={INK}/>
    </g>
  );
}

// frequency-domain band-pass response with moving F_c
function SpectrumPlot({ x, y, w, h, t, muNorm }) {
  // F_c log position
  const cxN = 0.05 + muNorm * 0.85; // 0..1
  // sample envelope
  const N = 220;
  const pts = [];
  const bw = 0.06; // bandwidth in normalized x
  for (let i = 0; i < N; i++) {
    const xi = i / (N - 1);
    const v = 0.05 + 0.95 * Math.exp(-Math.pow((xi - cxN) / bw, 2));
    pts.push([x + xi * w, y - v * h]);
  }
  const d = pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
  // peak line
  const peakX = x + cxN * w;
  return (
    <g>
      {/* fill */}
      <path d={`${d} L ${x+w} ${y} L ${x} ${y} Z`} fill={INK} opacity="0.08"/>
      <path d={d} fill="none" stroke={INK} strokeWidth="1.4"/>
      {/* center freq marker */}
      <line x1={peakX} y1={y} x2={peakX} y2={y - h} stroke={INK} strokeWidth="1" strokeDasharray="4 4" opacity="0.6"/>
      <circle cx={peakX} cy={y - h * 0.96} r="5" fill={INK}/>
      <text x={peakX} y={y - h - 8} fontFamily={MONO} fontSize="11" fontWeight="700"
        fill={INK} textAnchor="middle" letterSpacing="0.12em">F_c</text>
    </g>
  );
}

// ── scene 4: micro oscillators (7 bands) ──────────────────────────────────

function SceneMicroOsc() {
  return (
    <Sprite start={18.2} end={25.6}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);
        const bands = [
          { lo: 60,    hi: 120,   base: 80,    label: 'OSC₁' },
          { lo: 120,   hi: 240,   base: 180,   label: 'OSC₂' },
          { lo: 240,   hi: 480,   base: 340,   label: 'OSC₃' },
          { lo: 480,   hi: 960,   base: 660,   label: 'OSC₄' },
          { lo: 960,   hi: 1920,  base: 1200,  label: 'OSC₅' },
          { lo: 1920,  hi: 3840,  base: 2600,  label: 'OSC₆' },
          { lo: 3840,  hi: 7680,  base: 5400,  label: 'OSC₇' },
        ];

        const laneH = 88;
        const laneY0 = 250;
        const laneX = 200;
        const laneW = 1080;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 5.3" title="MICRO  ·  SPECTRAL DISTRIBUTION"
                meta="one band per sensor · 7 parallel oscillators"
                t={localTime} t0={0}/>

              {/* lanes */}
              {bands.map((b, i) => {
                const y = laneY0 + i * laneH;
                const d = sensorDistance(i, localTime + 4);
                const dn = d / 4.0;
                // oscillator frequency modulated by distance
                const f = b.lo + dn * (b.hi - b.lo);
                const cyc = 6 + dn * 18; // number of cycles displayed
                const t0 = 0.2 + i * 0.12;
                const inOp = Math.min(1, Math.max(0, (localTime - t0) * 2));
                return (
                  <g key={i} opacity={inOp}>
                    {/* lane outline */}
                    <line x1={laneX} y1={y + laneH/2} x2={laneX + laneW} y2={y + laneH/2}
                      stroke={INK} strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="3 4"/>
                    {/* label box */}
                    <rect x={laneX - 110} y={y + 10} width={100} height={laneH - 20} fill={PAPER} stroke={INK} strokeWidth="1"/>
                    <text x={laneX - 60} y={y + 38} fontFamily={MONO} fontSize="15" fontWeight="700"
                      fill={INK} textAnchor="middle" letterSpacing="0.08em">{b.label}</text>
                    <text x={laneX - 60} y={y + 58} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.6"
                      textAnchor="middle" letterSpacing="0.1em">{b.lo} – {b.hi >= 1000 ? (b.hi/1000)+'k' : b.hi} Hz</text>
                    {/* sine wave */}
                    <SineWave x={laneX + 10} y={y + laneH/2} w={laneW - 20} amp={laneH/2 - 14}
                      cycles={cyc} phase={localTime * (1 + i*0.25) * 2.6}/>
                    {/* right-side readout: one clean line per lane */}
                    <text x={laneX + laneW + 30} y={y + laneH/2 - 4} fontFamily={MONO} fontSize="12" fill={INK}
                      opacity="0.6" letterSpacing="0.18em">S{i+1} → d</text>
                    <text x={laneX + laneW + 30} y={y + laneH/2 + 22} fontFamily={MONO} fontSize="20" fontWeight="700"
                      fill={INK} letterSpacing="0.04em">
                      {d.toFixed(2)}<tspan fontSize="11" opacity="0.55"> m</tspan>
                      <tspan dx="14" fontSize="14" opacity="0.5">→</tspan>
                      <tspan dx="14" fontWeight="700">
                        {f >= 1000 ? (f/1000).toFixed(2) + ' kHz' : Math.round(f) + ' Hz'}
                      </tspan>
                    </text>
                  </g>
                );
              })}

              {/* description footer */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 2.0) * 1.5)) *
                          (1 - Math.min(1, Math.max(0, (localTime - (duration - 0.6)) / 0.6)))}>
                <line x1="200" y1="945" x2="1720" y2="945" stroke={INK} strokeOpacity="0.4"/>
                <text x="200" y="985" fontFamily={SERIF} fontSize="22" fill={INK} fontStyle="italic">
                  Each sensor modulates one oscillator in its own band — proximity becomes pitch and spectral density.
                </text>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

function SineWave({ x, y, w, amp, cycles = 8, phase = 0 }) {
  const N = 220;
  let d = '';
  for (let i = 0; i < N; i++) {
    const xi = i / (N - 1);
    const px = x + xi * w;
    const py = y - Math.sin(xi * cycles * Math.PI * 2 + phase) * amp;
    d += `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  return <path d={d} fill="none" stroke={INK} strokeWidth="1.4"/>;
}

// ── scene 5: stochastic triggers ──────────────────────────────────────────

// stable trigger schedule keyed off pseudo-random per sensor
function getTriggers(sensorIdx, dur, threshold = 2.6) {
  // deterministic - precomputed
  const seed = sensorIdx * 17 + 3;
  const out = [];
  for (let i = 0; i < 18; i++) {
    const r = (Math.sin(seed * 0.7 + i * 1.3 + sensorIdx) + 1) / 2;
    const r2 = (Math.sin(seed * 1.4 + i * 2.1 - sensorIdx * 0.4) + 1) / 2;
    if (r > 0.45) {
      const tt = i * 0.4 + r2 * 0.3;
      if (tt < dur) {
        out.push({ t: tt, amp: 0.3 + r * 0.7, sample: Math.floor(r2 * 8) });
      }
    }
  }
  return out;
}

function SceneTriggers() {
  return (
    <Sprite start={25.4} end={32}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.4);

        const sensorCount = 7;
        const laneH = 70;
        const laneY0 = 260;
        const laneX = 220;
        const laneW = 1180;
        const sceneDur = duration;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 5.4" title="STOCHASTIC LAYER  ·  RANDOM TRIGGERS"
                meta="threshold crossings → random samples · probabilistic amplitude"
                t={localTime} t0={0}/>

              {/* time axis at bottom */}
              <g opacity={Math.min(1, Math.max(0, localTime * 2))}>
                <line x1={laneX} y1={laneY0 + sensorCount * laneH + 20}
                  x2={laneX + laneW} y2={laneY0 + sensorCount * laneH + 20}
                  stroke={INK} strokeWidth="1"
                  {...drawIn(localTime, { start: 0.2, dur: 0.8, length: laneW })}/>
                {/* playhead vertical line */}
                <line x1={laneX + (localTime / sceneDur) * laneW} y1={laneY0 - 20}
                  x2={laneX + (localTime / sceneDur) * laneW} y2={laneY0 + sensorCount * laneH + 40}
                  stroke={INK} strokeWidth="1.4"/>
                <polygon
                  points={`${laneX + (localTime / sceneDur) * laneW},${laneY0 - 20} ${laneX + (localTime / sceneDur) * laneW - 6},${laneY0 - 32} ${laneX + (localTime / sceneDur) * laneW + 6},${laneY0 - 32}`}
                  fill={INK}/>
                <text x={laneX + laneW + 12} y={laneY0 + sensorCount * laneH + 24}
                  fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                  letterSpacing="0.2em">t →</text>
              </g>

              {/* lanes */}
              {Array.from({ length: sensorCount }).map((_, i) => {
                const y = laneY0 + i * laneH;
                const t0 = 0.3 + i * 0.1;
                const sensorOffset = i * 0.7 + 2;
                // conditioned signal trace (within lane)
                const N = 200;
                const trace = [];
                for (let k = 0; k < N; k++) {
                  const tk = (k / N) * sceneDur;
                  const v = (sensorDistance(i, tk + sensorOffset) - 0.3) / 3.6; // 0..1
                  trace.push([laneX + (k / N) * laneW, y + laneH/2 + (0.5 - v) * (laneH - 18)]);
                }
                const dTrace = trace.map(([px, py], k) => `${k === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
                const triggers = getTriggers(i, sceneDur);
                const thresholdY = y + laneH/2 + (0.5 - 0.66) * (laneH - 18);

                return (
                  <g key={i} opacity={Math.min(1, Math.max(0, (localTime - t0) * 2.5))}>
                    {/* lane label */}
                    <rect x={laneX - 100} y={y + 10} width={90} height={laneH - 20} fill={PAPER} stroke={INK} strokeWidth="1"/>
                    <text x={laneX - 55} y={y + 32} fontFamily={MONO} fontSize="14" fontWeight="700"
                      fill={INK} textAnchor="middle" letterSpacing="0.08em">S{i + 1}</text>
                    <text x={laneX - 55} y={y + 50} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.55"
                      textAnchor="middle" letterSpacing="0.15em">THRESH</text>
                    {/* lane background */}
                    <rect x={laneX} y={y + 8} width={laneW} height={laneH - 16} fill="none" stroke={INK} strokeOpacity="0.18" strokeWidth="0.6"/>
                    {/* threshold line */}
                    <line x1={laneX} y1={thresholdY} x2={laneX + laneW} y2={thresholdY}
                      stroke={INK} strokeWidth="0.8" strokeDasharray="4 4" opacity="0.55"/>
                    <text x={laneX + laneW - 4} y={thresholdY - 4} fontFamily={MONO} fontSize="8"
                      fill={INK} opacity="0.55" textAnchor="end" letterSpacing="0.12em">θ</text>
                    {/* signal trace */}
                    <path d={dTrace} fill="none" stroke={INK} strokeWidth="1.2"/>
                    {/* triggers */}
                    {triggers.map((tr, ti) => {
                      const tx = laneX + (tr.t / sceneDur) * laneW;
                      const fired = localTime >= tr.t;
                      if (!fired) return null;
                      const age = localTime - tr.t;
                      const tickH = (laneH - 18) * tr.amp * 0.9;
                      const fadeAge = Math.max(0, 1 - age * 0.6);
                      return (
                        <g key={ti}>
                          {/* main tick (going up from baseline) */}
                          <line x1={tx} y1={y + laneH - 8} x2={tx} y2={y + laneH - 8 - tickH}
                            stroke={INK} strokeWidth="2"/>
                          <circle cx={tx} cy={y + laneH - 8 - tickH} r="3.5" fill={INK}/>
                          {/* burst halo */}
                          <circle cx={tx} cy={y + laneH - 8 - tickH} r={6 + age * 18}
                            fill="none" stroke={INK} strokeWidth="1" opacity={fadeAge * 0.6}/>
                          {/* fired flash on threshold line */}
                          {age < 0.5 && (
                            <circle cx={tx} cy={thresholdY} r={3 + age * 14}
                              fill="none" stroke={INK} strokeWidth="1.2" opacity={1 - age*2}/>
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* sample pool on right side */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.4) * 2))}>
                <rect x={laneX + laneW + 80} y={laneY0} width={200} height={sensorCount * laneH - 20}
                  fill={PAPER} stroke={INK} strokeWidth="1.4"/>
                <text x={laneX + laneW + 180} y={laneY0 - 12} fontFamily={MONO} fontSize="12" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.2em">SAMPLE POOL</text>
                {Array.from({ length: 8 }).map((_, k) => {
                  // determine if recently activated
                  let lastFire = -10;
                  let firedSample = -1;
                  for (let si = 0; si < sensorCount; si++) {
                    const trs = getTriggers(si, 32);
                    for (const tr of trs) {
                      if (tr.sample === k && tr.t <= localTime && tr.t > lastFire) {
                        lastFire = tr.t;
                        firedSample = k;
                      }
                    }
                  }
                  const age = localTime - lastFire;
                  const hot = age < 0.5 && lastFire > 0;
                  const sy = laneY0 + 20 + k * 50;
                  return (
                    <g key={k}>
                      <rect x={laneX + laneW + 100} y={sy} width={160} height={32}
                        fill={hot ? INK : PAPER} stroke={INK} strokeWidth="1"/>
                      <text x={laneX + laneW + 112} y={sy + 22} fontFamily={MONO} fontSize="13" fontWeight="700"
                        fill={hot ? PAPER : INK} letterSpacing="0.1em">SMP_0{k}</text>
                      <text x={laneX + laneW + 250} y={sy + 22} fontFamily={MONO} fontSize="10"
                        fill={hot ? PAPER : INK} opacity={hot ? 0.85 : 0.55}
                        textAnchor="end" letterSpacing="0.15em">{hot ? '◆ FIRE' : '·'}</text>
                    </g>
                  );
                })}
              </g>

              {/* description footer */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 2.4) * 1.5)) *
                          (1 - Math.min(1, Math.max(0, (localTime - (duration - 0.6)) / 0.6)))}>
                <line x1="200" y1="930" x2="1720" y2="930" stroke={INK} strokeOpacity="0.4"/>
                <text x="200" y="970" fontFamily={SERIF} fontSize="22" fill={INK} fontStyle="italic">
                  When a sensor crosses its threshold, the system fires a random sample with probabilistic amplitude —
                </text>
                <text x="200" y="1000" fontFamily={SERIF} fontSize="22" fill={INK} fontStyle="italic">
                  a discrete stochastic layer riding atop the continuous PMS and oscillator streams.
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
    <Stage width={W} height={H} duration={DUR} background={PAPER} persistKey="ctrlstage">
      <ScreenLabel/>
      <Paper/>
      <Frame/>
      <TitleBlock/>
      <Timecode/>
      <SceneTitle/>
      <SceneMean/>
      <SceneMacroApp/>
      <SceneMicroOsc/>
      <SceneTriggers/>
    </Stage>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
