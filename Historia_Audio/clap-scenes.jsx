// clap-scenes.jsx — engineering schematic animation of the clap-detection +
// ambisonic spatialization layer (FIG 18, companion to FIG 16 and 17)

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

// scheduled clap events used across scenes (in seconds relative to scene start)
const CLAP_TIMES = [1.6, 3.4, 5.2];

// scheduled selections: which sample fires for each clap (out of 12)
const CLAP_SAMPLES = [4, 9, 1];
// scheduled spatial positions (azimuth degrees)
const CLAP_POSITIONS = [60, 200, 305];

// ── paper / chrome ────────────────────────────────────────────────────────

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
        FIG. 18 &nbsp;·&nbsp; CLAP &amp; SPATIALIZATION
      </div>
      <div style={{ opacity: 0.55 }}>MIC &nbsp;·&nbsp; AMBISONIC ENC/DEC &nbsp;·&nbsp; 6-CH MIX</div>
      <div style={{ opacity: 0.55 }}>SHEET 03 / 03 &nbsp;·&nbsp; REV. A &nbsp;·&nbsp; SCALE  N.T.S.</div>
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
    </g>
  );
}

function SpeakerGlyph({ cx, cy, label, active = false, scale = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <rect x="-22" y="-28" width="44" height="56" fill={active ? INK : PAPER} stroke={INK} strokeWidth="1.4"/>
      <circle cx="0" cy="-12" r="7" fill="none" stroke={active ? PAPER : INK} strokeWidth="1"/>
      <circle cx="0" cy="-12" r="2.5" fill={active ? PAPER : INK}/>
      <circle cx="0" cy="12" r="11" fill="none" stroke={active ? PAPER : INK} strokeWidth="1.2"/>
      <circle cx="0" cy="12" r="3.5" fill={active ? PAPER : INK}/>
      {label && (
        <text x="0" y="45" fontFamily={MONO} fontSize="10" fontWeight="700"
          fill={INK} textAnchor="middle" letterSpacing="0.15em">{label}</text>
      )}
    </g>
  );
}

// generates pseudo-mic-signal that has bursts (claps) on the schedule
function micSignal(t, sceneStart = 0) {
  const local = t - sceneStart;
  // baseline noise (very low)
  let v = 0.06 * (Math.sin(t * 73) + Math.sin(t * 131.1) * 0.7 + Math.sin(t * 211.7) * 0.5);
  // claps
  for (const ct of CLAP_TIMES) {
    const dt = local - ct;
    if (dt < 0 || dt > 0.5) continue;
    // sharp attack, fast decay
    const env = Math.exp(-dt * 18) * (1 - Math.exp(-dt * 220));
    v += env * Math.sin(dt * 600 + local * 13) * 1.4;
  }
  return v;
}

// returns clap energy (smoothed envelope) at time t since scene start
function clapEnergy(t) {
  let e = 0.04;
  for (const ct of CLAP_TIMES) {
    const dt = t - ct;
    if (dt < 0 || dt > 0.9) continue;
    const env = Math.exp(-dt * 6) * (1 - Math.exp(-dt * 30));
    e += env * 1.2;
  }
  return Math.min(1, e);
}

// ── scene 1: title ────────────────────────────────────────────────────────

function SceneTitle() {
  return (
    <Sprite start={0.2} end={4.0}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);
        const text = 'CLAP-TRIGGERED SPATIALIZATION';
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
              ⎯⎯⎯⎯  fig. 18  ⎯⎯⎯⎯
            </div>
            <div style={{
              fontFamily: SERIF, fontSize: 92, fontWeight: 500,
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
              mic detection &nbsp;·&nbsp; community samples &nbsp;·&nbsp; 6-channel ambisonic
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

// ── scene 2: clap detection pipeline ──────────────────────────────────────

function SceneClapDetect() {
  return (
    <Sprite start={3.8} end={12.2}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);
        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 6.1" title="CLAP DETECTION  ·  MIC PIPELINE"
                meta="spectral features · threshold-based decision"
                t={localTime} t0={0}/>

              {/* mic on far left */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.1) * 2))}>
                <MicGlyph cx={280} cy={400} scale={2.2}/>
                <text x={280} y={520} fontFamily={MONO} fontSize="13" fill={INK}
                  textAnchor="middle" fontWeight="700" letterSpacing="0.15em">MIC IN</text>
                <text x={280} y={542} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.18em">BELA · ANALOG IN</text>
                {/* incoming sound rings — emphasized when a clap is happening */}
                {[0.0, 0.3, 0.6].map((off, i) => {
                  const phase = ((localTime + off) % 1.6) / 1.6;
                  const e = clapEnergy(localTime);
                  const r = phase * 110;
                  const o = (1 - phase) * (0.25 + e * 0.55);
                  return (
                    <circle key={i} cx={170} cy={400} r={r} fill="none"
                      stroke={INK} strokeWidth="1" opacity={o}/>
                  );
                })}
                <text x={130} y={395} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                  textAnchor="end" letterSpacing="0.15em">audience</text>
              </g>

              {/* stage 1: raw waveform */}
              <DetectStage
                x={420} y={300} w={300} h={210}
                label="RAW SIGNAL"
                sub="x[n] · time domain"
                t0={0.4} localTime={localTime}
              >
                <WaveformTrace x={0} y={105} w={300} h={210}
                  gen={(xi) => micSignal(localTime - 1 + xi * 1.2, 0)}/>
              </DetectStage>

              {/* stage 2: band-pass filter spectrum */}
              <DetectStage
                x={760} y={300} w={300} h={210}
                label="BAND-PASS"
                sub="1.5 – 8 kHz · spectral feature"
                t0={0.9} localTime={localTime}
              >
                <FilterShape x={0} y={210} w={300} h={210}/>
              </DetectStage>

              {/* stage 3: energy envelope */}
              <DetectStage
                x={1100} y={300} w={300} h={210}
                label="ENERGY  ·  E[k]"
                sub="RMS over 256-sample window"
                t0={1.4} localTime={localTime}
              >
                <EnergyPlot x={0} y={0} w={300} h={210} localTime={localTime}/>
              </DetectStage>

              {/* stage 4: threshold decision */}
              <DetectStage
                x={1440} y={300} w={260} h={210}
                label="DECISION"
                sub="E > θ_c  →  CLAP"
                t0={1.9} localTime={localTime}
              >
                <ThresholdDecider x={0} y={0} w={260} h={210} localTime={localTime}/>
              </DetectStage>

              {/* arrows connecting stages */}
              {[[400,720], [720,760], [1060,1100], [1400,1440]].map(([x1,x2],i)=>{
                const t0 = 0.5 + i * 0.45;
                return (
                  <g key={i}>
                    <line x1={x1} y1={405} x2={x2 - 12} y2={405}
                      stroke={INK} strokeWidth="1.6"
                      {...drawIn(localTime, { start: t0, dur: 0.4, length: x2 - x1 })}/>
                    <polygon points={`${x2-12},${405} ${x2-22},${399} ${x2-22},${411}`} fill={INK}
                      opacity={Math.min(1, Math.max(0, (localTime - t0 - 0.1) * 3))}/>
                  </g>
                );
              })}

              {/* clap event readout & log */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 2.4) * 2))}>
                <line x1={1570} y1={520} x2={1570} y2={620} stroke={INK} strokeWidth="1" strokeDasharray="3 4"/>
                <rect x={1420} y={620} width={300} height={170} fill={PAPER} stroke={INK} strokeWidth="1.6"/>
                <text x={1570} y={655} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.2em">EVENT &nbsp;·&nbsp; CLAP</text>
                {/* show big CLAP! pulse when a clap is recent */}
                <ClapPulse cx={1570} cy={720} localTime={localTime}/>
              </g>

              {/* log strip at bottom — timeline of detected claps */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.3) * 2))}>
                <line x1={200} y1={870} x2={1720} y2={870} stroke={INK} strokeWidth="1"
                  {...drawIn(localTime, { start: 0.2, dur: 0.8, length: 1520 })}/>
                <text x={200} y={850} fontFamily={MONO} fontSize="12" fontWeight="700"
                  fill={INK} letterSpacing="0.2em">DETECTION LOG</text>
                <text x={1720} y={850} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                  letterSpacing="0.15em" textAnchor="end">t / s</text>
                {/* tick marks */}
                {[0,1,2,3,4,5,6,7,8].map(s => {
                  const tx = 200 + (s / 8) * 1520;
                  return <line key={s} x1={tx} y1={865} x2={tx} y2={875} stroke={INK} strokeWidth="0.8"/>;
                })}
                {/* claps in log */}
                {CLAP_TIMES.map((ct, i) => {
                  if (localTime < ct) return null;
                  const tx = 200 + (ct / 8) * 1520;
                  return (
                    <g key={i}>
                      <line x1={tx} y1={920} x2={tx} y2={870} stroke={INK} strokeWidth="2"/>
                      <circle cx={tx} cy={920} r="6" fill={INK}/>
                      <text x={tx} y={945} fontFamily={MONO} fontSize="11" fontWeight="700"
                        fill={INK} textAnchor="middle" letterSpacing="0.1em">CLAP_{String(i+1).padStart(2,'0')}</text>
                      <text x={tx} y={960} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.55"
                        textAnchor="middle" letterSpacing="0.12em">t = {ct.toFixed(2)} s</text>
                    </g>
                  );
                })}
                {/* current scrubber */}
                <g>
                  <line x1={200 + Math.min(1, localTime / 8) * 1520} y1={840} x2={200 + Math.min(1, localTime / 8) * 1520} y2={880}
                    stroke={INK} strokeWidth="1.2"/>
                </g>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

function DetectStage({ x, y, w, h, label, sub, t0 = 0, localTime, children }) {
  const op = Math.min(1, Math.max(0, (localTime - t0) * 2));
  return (
    <g opacity={op} transform={`translate(${x} ${y})`}>
      {/* corner ticks */}
      {[[0,0],[w,0],[0,h],[w,h]].map(([px,py],i)=>(
        <g key={i} stroke={INK} strokeWidth="1.2">
          <line x1={px-6} y1={py} x2={px+6} y2={py}/>
          <line x1={px} y1={py-6} x2={px} y2={py+6}/>
        </g>
      ))}
      <rect x={0} y={0} width={w} height={h} fill={PAPER} stroke={INK} strokeWidth="1.2"
        {...drawIn(localTime, { start: t0, dur: 0.6, length: 2*(w+h) })}/>
      <text x={w/2} y={-16} fontFamily={MONO} fontSize="13" fontWeight="700"
        fill={INK} textAnchor="middle" letterSpacing="0.18em">{label}</text>
      <text x={w/2} y={h + 26} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
        textAnchor="middle" letterSpacing="0.12em">{sub}</text>
      <g transform="translate(0 0)">{children}</g>
    </g>
  );
}

function WaveformTrace({ x, y, w, h, gen }) {
  const N = 240;
  let d = '';
  for (let i = 0; i < N; i++) {
    const xi = i / (N - 1);
    const v = gen(xi);
    const px = x + xi * w;
    const py = y - Math.max(-0.9, Math.min(0.9, v)) * (h / 2 - 12);
    d += `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  return (
    <g>
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={INK} strokeWidth="0.4" strokeOpacity="0.3" strokeDasharray="2 3"/>
      <path d={d} fill="none" stroke={INK} strokeWidth="1.2"/>
    </g>
  );
}

function FilterShape({ x, y, w, h }) {
  // band-pass response from ~1.5 to 8 kHz
  const N = 200;
  let d = '';
  for (let i = 0; i < N; i++) {
    const xi = i / (N - 1);
    // map xi 0..1 to log-frequency 100Hz..20kHz
    const f = 100 * Math.pow(200, xi);
    // response: 1 in [1500, 8000], skirts outside
    const low = 1500, high = 8000;
    let g = 1;
    if (f < low) g = Math.pow(f / low, 1.6);
    else if (f > high) g = Math.pow(high / f, 1.4);
    const px = x + xi * w;
    const py = y - g * (h - 30) - 8;
    d += `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  // baseline
  return (
    <g>
      <line x1={x} y1={y - 8} x2={x + w} y2={y - 8} stroke={INK} strokeWidth="0.6" strokeOpacity="0.4"/>
      <path d={`${d} L ${x + w} ${y - 8} L ${x} ${y - 8} Z`} fill={INK} opacity="0.1"/>
      <path d={d} fill="none" stroke={INK} strokeWidth="1.4"/>
      {/* freq tick labels */}
      {[100, 1000, 10000].map((f, i) => {
        const xi = Math.log(f / 100) / Math.log(200);
        const fx = x + xi * w;
        return (
          <g key={i}>
            <line x1={fx} y1={y - 8} x2={fx} y2={y - 4} stroke={INK} strokeWidth="0.7"/>
            <text x={fx} y={y + 8} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.5"
              textAnchor="middle">{f >= 1000 ? (f/1000)+'k' : f}</text>
          </g>
        );
      })}
      <text x={x + w - 6} y={y - h + 16} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.5"
        textAnchor="end" letterSpacing="0.12em">|H(f)|</text>
    </g>
  );
}

function EnergyPlot({ x, y, w, h, localTime }) {
  // history: last 1.5s of energy
  const N = 200;
  const win = 1.5;
  let d = '';
  for (let i = 0; i < N; i++) {
    const xi = i / (N - 1);
    const tt = localTime - win + xi * win;
    const e = clapEnergy(tt);
    const px = x + xi * w;
    const py = y + h - e * (h - 24) - 8;
    d += `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  // threshold line at E=0.45
  const thY = y + h - 0.45 * (h - 24) - 8;
  return (
    <g>
      <line x1={x} y1={y + h - 8} x2={x + w} y2={y + h - 8} stroke={INK} strokeWidth="0.6"/>
      <line x1={x} y1={thY} x2={x + w} y2={thY} stroke={INK} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6"/>
      <text x={x + w - 4} y={thY - 4} fontFamily={MONO} fontSize="9" fill={INK} opacity="0.6"
        textAnchor="end" letterSpacing="0.12em">θ_c</text>
      <path d={`${d} L ${x + w} ${y + h - 8} L ${x} ${y + h - 8} Z`} fill={INK} opacity="0.1"/>
      <path d={d} fill="none" stroke={INK} strokeWidth="1.4"/>
    </g>
  );
}

function ThresholdDecider({ x, y, w, h, localTime }) {
  const e = clapEnergy(localTime);
  const fired = e > 0.45;
  // visual gauge: vertical bar
  const barH = h - 60;
  const fillH = e * barH;
  return (
    <g>
      <text x={x + 30} y={y + 22} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6"
        letterSpacing="0.15em">E</text>
      <rect x={x + 24} y={y + 30} width={28} height={barH} fill="none" stroke={INK} strokeWidth="1"/>
      <rect x={x + 25} y={y + 30 + barH - fillH} width={26} height={fillH} fill={INK}/>
      {/* threshold tick */}
      <line x1={x + 16} y1={y + 30 + barH * 0.55} x2={x + 60} y2={y + 30 + barH * 0.55}
        stroke={INK} strokeWidth="1" strokeDasharray="3 3"/>
      <text x={x + 64} y={y + 30 + barH * 0.55 + 4} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.6"
        letterSpacing="0.12em">θ_c = 0.45</text>
      {/* logic gate */}
      <g transform={`translate(${x + 110} ${y + 60})`}>
        <path d="M 0 0 L 0 80 L 40 80 Q 80 80 80 40 Q 80 0 40 0 Z"
          fill={fired ? INK : PAPER} stroke={INK} strokeWidth="1.4"/>
        <text x={36} y={46} fontFamily={MONO} fontSize="13" fontWeight="700"
          fill={fired ? PAPER : INK} textAnchor="middle" letterSpacing="0.1em">{`> θ`}</text>
      </g>
      <text x={x + w/2 + 30} y={y + 175} fontFamily={MONO} fontSize="14" fontWeight="700"
        fill={fired ? INK : INK + '40'} textAnchor="middle" letterSpacing="0.2em">
        {fired ? '◆ CLAP' : '— idle'}
      </text>
    </g>
  );
}

function ClapPulse({ cx, cy, localTime }) {
  // find nearest recent clap
  let latest = -10;
  for (const ct of CLAP_TIMES) if (ct <= localTime && ct > latest) latest = ct;
  const age = localTime - latest;
  const fired = age >= 0 && age < 1.2;
  if (!fired) {
    return (
      <text x={cx} y={cy} fontFamily={SERIF} fontSize="32" fontWeight="500"
        fill={INK} opacity="0.35" textAnchor="middle">— idle —</text>
    );
  }
  const scale = 1 + Math.max(0, 0.3 - age) * 1.6;
  const ringR = age * 80;
  const ringOp = Math.max(0, 1 - age / 1.2);
  return (
    <g>
      <circle cx={cx} cy={cy} r={ringR} fill="none" stroke={INK} strokeWidth="1.4" opacity={ringOp * 0.8}/>
      <circle cx={cx} cy={cy} r={ringR + 18} fill="none" stroke={INK} strokeWidth="0.8" opacity={ringOp * 0.4}/>
      <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
        <text x={0} y={10} fontFamily={SERIF} fontSize="40" fontWeight="700"
          fill={INK} textAnchor="middle">CLAP!</text>
      </g>
    </g>
  );
}

// ── scene 3: random sample + position ─────────────────────────────────────

function SceneRandomPick() {
  return (
    <Sprite start={12.0} end={19.2}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);

        // step through the three claps over scene time
        // pick which clap is "current" based on scene time
        const stageDur = 2.2;
        const stageIdx = Math.min(CLAP_SAMPLES.length - 1, Math.floor((localTime - 0.4) / stageDur));
        const stageT = (localTime - 0.4) - stageIdx * stageDur;

        const selected = stageIdx >= 0 ? CLAP_SAMPLES[stageIdx] : -1;
        const azimuth = stageIdx >= 0 ? CLAP_POSITIONS[stageIdx] : 0;

        // db is 4 cols × 3 rows = 12 samples
        const db = Array.from({ length: 12 }).map((_, k) => ({
          id: k,
          col: k % 4,
          row: Math.floor(k / 4),
          kind: k % 3 === 0 ? 'AMBI' : 'MONO',
          // pseudo names
          name: ['voz_01','silbido','marimba','rio','tambor','viento','niños','perro','mototaxi','feria','agua','iglesia'][k] || `smp_${k}`,
        }));

        // current pick animation (cycle through random highlight, then settle)
        const isPicking = stageT < 1.0 && stageIdx >= 0;
        const cyclingPick = isPicking ? Math.floor(stageT * 22) % 12 : selected;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 6.2" title="RANDOM SELECTION  ·  COMMUNITY DATABASE"
                meta="sample picked + spatial position at random per clap"
                t={localTime} t0={0}/>

              {/* clap event indicator top */}
              <g opacity={Math.min(1, Math.max(0, localTime * 2))}>
                <rect x={W/2 - 200} y={210} width={400} height={70} fill={INK}/>
                <text x={W/2} y={244} fontFamily={MONO} fontSize="14" fill={PAPER} opacity="0.7"
                  textAnchor="middle" letterSpacing="0.22em">EVENT  ·  CLAP_{String(stageIdx + 1).padStart(2,'0')}</text>
                <text x={W/2} y={270} fontFamily={MONO} fontSize="20" fontWeight="700"
                  fill={PAPER} textAnchor="middle" letterSpacing="0.05em">→ RANDOM (sample, azimuth)</text>
                {/* fork */}
                <line x1={W/2 - 280} y1={310} x2={W/2 + 280} y2={310} stroke={INK} strokeWidth="1.4"/>
                <line x1={W/2 - 280} y1={280} x2={W/2 - 280} y2={310} stroke={INK} strokeWidth="1.4"/>
                <line x1={W/2 + 280} y1={280} x2={W/2 + 280} y2={310} stroke={INK} strokeWidth="1.4"/>
                <line x1={W/2 - 280} y1={310} x2={W/2 - 280} y2={360} stroke={INK} strokeWidth="1.4"/>
                <line x1={W/2 + 280} y1={310} x2={W/2 + 280} y2={360} stroke={INK} strokeWidth="1.4"/>
              </g>

              {/* LEFT: database panel */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.2) * 2))}>
                <rect x={180} y={370} width={760} height={520} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.2, dur: 0.8, length: 2560 })}/>
                <text x={200} y={400} fontFamily={MONO} fontSize="14" fontWeight="700"
                  fill={INK} letterSpacing="0.2em">[A]  SAMPLE POOL</text>
                <text x={200} y={420} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6"
                  letterSpacing="0.15em">COMMUNITY WORKSHOP · MEDELLÍN · 2024</text>

                {/* 4×3 grid */}
                {db.map((s) => {
                  const cellW = 170, cellH = 130;
                  const gx = 220 + s.col * 180;
                  const gy = 460 + s.row * 140;
                  const isSelected = !isPicking && s.id === selected;
                  const isHover = isPicking && s.id === cyclingPick;
                  return (
                    <g key={s.id}>
                      <rect x={gx} y={gy} width={cellW} height={cellH}
                        fill={isSelected ? INK : (isHover ? '#0a0a0a18' : PAPER)}
                        stroke={INK} strokeWidth={isSelected ? 1.8 : 1}/>
                      <text x={gx + 14} y={gy + 26} fontFamily={MONO} fontSize="11"
                        fill={isSelected ? PAPER : INK} opacity={isSelected ? 0.8 : 0.55}
                        letterSpacing="0.12em">SMP_{String(s.id).padStart(2,'0')}</text>
                      <text x={gx + cellW - 14} y={gy + 26} fontFamily={MONO} fontSize="10"
                        fill={isSelected ? PAPER : INK} opacity={isSelected ? 0.75 : 0.5}
                        textAnchor="end" letterSpacing="0.15em">{s.kind}</text>
                      <text x={gx + cellW/2} y={gy + 80} fontFamily={SERIF} fontStyle="italic" fontSize="22"
                        fill={isSelected ? PAPER : INK} textAnchor="middle" fontWeight="500">
                        {s.name}
                      </text>
                      {/* mini waveform */}
                      <MiniWave x={gx + 14} y={gy + cellH - 22} w={cellW - 28} h={20}
                        seed={s.id} color={isSelected ? PAPER : INK}/>
                      {isSelected && (
                        <text x={gx + cellW/2} y={gy + cellH - 50} fontFamily={MONO} fontSize="10" fontWeight="700"
                          fill={PAPER} textAnchor="middle" letterSpacing="0.25em">◆ SELECTED</text>
                      )}
                    </g>
                  );
                })}

                {/* random arrow */}
                <text x={560} y={905} fontFamily={MONO} fontSize="12" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.2em">uniform random  ·  k ∈ [0, 11]</text>
              </g>

              {/* RIGHT: azimuth dial */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.4) * 2))}>
                <rect x={1020} y={370} width={720} height={520} fill={PAPER} stroke={INK} strokeWidth="1.4"
                  {...drawIn(localTime, { start: 0.4, dur: 0.8, length: 2480 })}/>
                <text x={1040} y={400} fontFamily={MONO} fontSize="14" fontWeight="700"
                  fill={INK} letterSpacing="0.2em">[B]  SPATIAL POSITION</text>
                <text x={1040} y={420} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6"
                  letterSpacing="0.15em">AZIMUTH φ ∈ [0°, 360°)</text>

                <AzimuthDial cx={1380} cy={640} r={210} azimuth={azimuth} picking={isPicking} stageT={stageT}/>

                {/* readout */}
                <g transform="translate(1040 750)">
                  <text x="0" y="0" fontFamily={MONO} fontSize="13" fill={INK} opacity="0.55"
                    letterSpacing="0.2em">SELECTED  ·  φ</text>
                  <text x="0" y="50" fontFamily={MONO} fontSize="56" fontWeight="700"
                    fill={INK} letterSpacing="0.04em">
                    {isPicking
                      ? (Math.floor(stageT * 220) % 360).toString().padStart(3,'0')
                      : String(azimuth).padStart(3, '0')}°
                  </text>
                  <text x="0" y="80" fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                    letterSpacing="0.15em">→ AMBISONIC ENCODER</text>
                </g>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

function MiniWave({ x, y, w, h, seed = 0, color = INK }) {
  const N = 60;
  let d = '';
  for (let i = 0; i < N; i++) {
    const xi = i / (N - 1);
    const v = Math.sin(xi * 12 + seed) * 0.5 + Math.sin(xi * 28 + seed * 1.7) * 0.3;
    const env = Math.exp(-Math.pow((xi - 0.5) * 2.4, 2));
    const px = x + xi * w;
    const py = y - v * env * (h / 2 - 2);
    d += `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  return <path d={d} fill="none" stroke={color} strokeWidth="1" opacity="0.7"/>;
}

function AzimuthDial({ cx, cy, r, azimuth, picking, stageT }) {
  // dial: circle + 6 speaker markers + needle at azimuth
  const speakerAngs = Array.from({ length: 6 }, (_, i) => i * 60); // 0..300 deg
  const needleAng = picking ? (stageT * 220) % 360 : azimuth;
  const rad = (needleAng - 90) * Math.PI / 180;
  return (
    <g>
      {/* outer ring */}
      <circle cx={cx} cy={cy} r={r} fill={PAPER} stroke={INK} strokeWidth="1.4"/>
      <circle cx={cx} cy={cy} r={r - 18} fill="none" stroke={INK} strokeOpacity="0.3" strokeWidth="0.6"/>
      {/* degree ticks */}
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i * 10 - 90) * Math.PI / 180;
        const big = i % 3 === 0;
        const r1 = r - (big ? 18 : 12);
        const r2 = r - 2;
        return (
          <line key={i}
            x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
            x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
            stroke={INK} strokeWidth={big ? 1.2 : 0.6} strokeOpacity={big ? 0.8 : 0.5}/>
        );
      })}
      {/* cardinal labels */}
      {[[0,'0°'],[90,'90°'],[180,'180°'],[270,'270°']].map(([deg, lab], i) => {
        const a = (deg - 90) * Math.PI / 180;
        const tx = cx + (r + 22) * Math.cos(a);
        const ty = cy + (r + 22) * Math.sin(a) + 4;
        return (
          <text key={i} x={tx} y={ty} fontFamily={MONO} fontSize="11" fill={INK}
            opacity="0.55" textAnchor="middle" letterSpacing="0.12em">{lab}</text>
        );
      })}
      {/* speaker positions */}
      {speakerAngs.map((deg, i) => {
        const a = (deg - 90) * Math.PI / 180;
        const sx = cx + (r - 50) * Math.cos(a);
        const sy = cy + (r - 50) * Math.sin(a);
        return (
          <g key={i}>
            <circle cx={sx} cy={sy} r={10} fill={PAPER} stroke={INK} strokeWidth="1.2"/>
            <text x={sx} y={sy + 4} fontFamily={MONO} fontSize="10" fontWeight="700"
              fill={INK} textAnchor="middle">{i+1}</text>
          </g>
        );
      })}
      {/* needle */}
      <line x1={cx} y1={cy}
        x2={cx + (r - 30) * Math.cos(rad)} y2={cy + (r - 30) * Math.sin(rad)}
        stroke={INK} strokeWidth="2.4"/>
      <circle cx={cx} cy={cy} r="8" fill={INK}/>
      {/* needle tip mark */}
      <circle cx={cx + (r - 30) * Math.cos(rad)} cy={cy + (r - 30) * Math.sin(rad)} r={picking ? 5 : 7} fill={INK}/>
    </g>
  );
}

// ── scene 4: ambisonic encode / decode → 6 speakers ───────────────────────

function SceneAmbisonic() {
  return (
    <Sprite start={19.0} end={26.4}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);
        // animate azimuth slowly across scene
        const az = (CLAP_POSITIONS[1] + localTime * 16) % 360;
        const rad = (az - 90) * Math.PI / 180;

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 6.3" title="AMBISONIC FLOW  ·  ENCODE → DECODE → 6 CH"
                meta="BELA · first-order B-format · hexagonal layout"
                t={localTime} t0={0}/>

              {/* LEFT: source + encoder */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.2) * 2))}>
                {/* mono / ambi source */}
                <rect x={170} y={300} width={240} height={150} fill={PAPER} stroke={INK} strokeWidth="1.4"/>
                <text x={290} y={332} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.18em">SOURCE</text>
                <text x={290} y={360} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6"
                  textAnchor="middle" letterSpacing="0.15em">mono / ambisonic</text>
                <text x={290} y={406} fontFamily={SERIF} fontStyle="italic" fontSize="22"
                  fill={INK} textAnchor="middle">x(t)</text>
                {/* mini wave */}
                <MiniWave x={200} y={430} w={180} h={20} seed={2.1} color={INK}/>

                {/* arrow to encoder */}
                <line x1={410} y1={375} x2={490} y2={375} stroke={INK} strokeWidth="1.6"/>
                <polygon points={`${490},${375} ${480},${369} ${480},${381}`} fill={INK}/>

                {/* encoder */}
                <rect x={490} y={300} width={300} height={300} fill={PAPER} stroke={INK} strokeWidth="1.6"/>
                {/* corner ticks */}
                {[[490,300],[790,300],[490,600],[790,600]].map(([px,py],i)=>(
                  <g key={i} stroke={INK} strokeWidth="1.2">
                    <line x1={px-7} y1={py} x2={px+7} y2={py}/>
                    <line x1={px} y1={py-7} x2={px} y2={py+7}/>
                  </g>
                ))}
                <text x={640} y={336} fontFamily={MONO} fontSize="15" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.2em">ENCODER</text>
                <text x={640} y={358} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6"
                  textAnchor="middle" letterSpacing="0.15em">x(t), φ  →  W, X, Y, Z</text>

                {/* B-format channel meters */}
                {['W','X','Y','Z'].map((ch, i) => {
                  // first-order encoding: W = x/√2, X = x·cos(φ), Y = x·sin(φ), Z = 0 (horizontal)
                  const phi = (az * Math.PI) / 180;
                  const x = Math.sin(localTime * 8 + i * 0.3) * 0.6;
                  let v = 0;
                  if (ch === 'W') v = x * 0.707;
                  else if (ch === 'X') v = x * Math.cos(phi);
                  else if (ch === 'Y') v = x * Math.sin(phi);
                  else v = 0;
                  const cy = 400 + i * 46;
                  return (
                    <g key={ch}>
                      <text x={520} y={cy + 5} fontFamily={MONO} fontSize="14" fontWeight="700"
                        fill={INK} letterSpacing="0.15em">{ch}</text>
                      <rect x={550} y={cy - 8} width={200} height={16}
                        fill="none" stroke={INK} strokeWidth="0.8" strokeOpacity="0.6"/>
                      <rect x={650} y={cy - 6} width={Math.abs(v) * 90} height={12}
                        fill={INK}
                        transform={`scale(${v >= 0 ? 1 : -1} 1)`}
                        style={{ transformOrigin: `650px ${cy}px` }}/>
                      <line x1={650} y1={cy - 10} x2={650} y2={cy + 10} stroke={INK} strokeWidth="1"/>
                    </g>
                  );
                })}
              </g>

              {/* MIDDLE: decoder */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.6) * 2))}>
                {/* arrow encoder → decoder */}
                <line x1={790} y1={450} x2={870} y2={450} stroke={INK} strokeWidth="1.6"/>
                <polygon points={`${870},${450} ${860},${444} ${860},${456}`} fill={INK}/>

                <rect x={870} y={300} width={280} height={300} fill={PAPER} stroke={INK} strokeWidth="1.6"/>
                {[[870,300],[1150,300],[870,600],[1150,600]].map(([px,py],i)=>(
                  <g key={i} stroke={INK} strokeWidth="1.2">
                    <line x1={px-7} y1={py} x2={px+7} y2={py}/>
                    <line x1={px} y1={py-7} x2={px} y2={py+7}/>
                  </g>
                ))}
                <text x={1010} y={336} fontFamily={MONO} fontSize="15" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.2em">DECODER</text>
                <text x={1010} y={358} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6"
                  textAnchor="middle" letterSpacing="0.15em">B-format  →  6 channels</text>
                {/* matrix grid 4x6 */}
                {Array.from({ length: 4 }).map((_, r) => (
                  Array.from({ length: 6 }).map((_, c) => {
                    const phi = (az * Math.PI) / 180;
                    const spAng = (c * 60) * Math.PI / 180;
                    let m = 0;
                    if (r === 0) m = 0.6;
                    else if (r === 1) m = Math.cos(phi - spAng) * 0.5 + 0.3;
                    else if (r === 2) m = Math.sin(phi - spAng) * 0.5 + 0.3;
                    else m = 0.2;
                    m = Math.max(0, Math.min(1, m));
                    return (
                      <rect key={`${r}-${c}`}
                        x={900 + c * 38} y={400 + r * 36} width={32} height={30}
                        fill={INK} opacity={0.1 + m * 0.75} stroke={INK} strokeWidth="0.5"/>
                    );
                  })
                ))}
                {/* row labels */}
                {['W','X','Y','Z'].map((ch, r) => (
                  <text key={ch} x={892} y={400 + r * 36 + 20} fontFamily={MONO} fontSize="11" fontWeight="700"
                    fill={INK} textAnchor="end" letterSpacing="0.1em">{ch}</text>
                ))}
                {/* col labels */}
                {Array.from({ length: 6 }).map((_, c) => (
                  <text key={c} x={900 + c * 38 + 16} y={566} fontFamily={MONO} fontSize="10"
                    fill={INK} opacity="0.6" textAnchor="middle" letterSpacing="0.1em">SP{c+1}</text>
                ))}
                <text x={1010} y={588} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.15em">decoding matrix</text>
              </g>

              {/* arrow decoder → speakers */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 0.9) * 2))}>
                <line x1={1150} y1={450} x2={1230} y2={450} stroke={INK} strokeWidth="1.6"/>
                <polygon points={`${1230},${450} ${1220},${444} ${1220},${456}`} fill={INK}/>
              </g>

              {/* RIGHT: hexagonal speaker layout with virtual source */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.0) * 2))}>
                <rect x={1230} y={250} width={510} height={500} fill={PAPER} stroke={INK} strokeWidth="1.4"/>
                <text x={1485} y={282} fontFamily={MONO} fontSize="13" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.2em">6-CH HEXAGONAL ARRAY</text>
                <SpeakerHex cx={1485} cy={510} r={170} az={az}/>
                <text x={1485} y={730} fontFamily={MONO} fontSize="12" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.15em">virtual source φ = {String(Math.round(az)).padStart(3,'0')}°</text>
              </g>

              {/* explanation footer */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.6) * 1.4)) *
                          (1 - Math.min(1, Math.max(0, (localTime - (duration - 0.6)) / 0.6)))}>
                <line x1="200" y1="830" x2="1720" y2="830" stroke={INK} strokeOpacity="0.4"/>
                <text x="200" y="872" fontFamily={SERIF} fontSize="22" fill={INK} fontStyle="italic">
                  BELA encodes the source into B-format channels (W, X, Y) following the azimuth,
                </text>
                <text x="200" y="902" fontFamily={SERIF} fontSize="22" fill={INK} fontStyle="italic">
                  then decodes them into six independent loudspeaker feeds — yielding spatial pan.
                </text>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

function SpeakerHex({ cx, cy, r, az }) {
  const phi = (az * Math.PI) / 180;
  // virtual source position on a smaller radius
  const srcR = r - 60;
  const srcX = cx + srcR * Math.sin(phi);
  const srcY = cy - srcR * Math.cos(phi);
  return (
    <g>
      {/* listener area circle */}
      <circle cx={cx} cy={cy} r={r - 20} fill="none" stroke={INK} strokeOpacity="0.2" strokeDasharray="3 5"/>
      {/* dashed center cross */}
      <line x1={cx - 10} y1={cy} x2={cx + 10} y2={cy} stroke={INK} strokeWidth="0.8" opacity="0.4"/>
      <line x1={cx} y1={cy - 10} x2={cx} y2={cy + 10} stroke={INK} strokeWidth="0.8" opacity="0.4"/>
      <text x={cx} y={cy + 30} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.5"
        textAnchor="middle" letterSpacing="0.15em">LISTENER</text>
      {/* speakers in hexagon (0°, 60°, ..., 300°) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const spAng = (i * 60) * Math.PI / 180;
        const sx = cx + r * Math.sin(spAng);
        const sy = cy - r * Math.cos(spAng);
        // gain: cosine of angle diff from source
        const gain = Math.max(0, Math.cos(spAng - phi));
        const active = gain > 0.5;
        return (
          <g key={i}>
            {/* gain ring */}
            <circle cx={sx} cy={sy} r={6 + gain * 28} fill="none"
              stroke={INK} strokeWidth="1" opacity={gain * 0.7}/>
            <SpeakerGlyph cx={sx} cy={sy} label={`SP${i+1}`} active={active} scale={1.0}/>
          </g>
        );
      })}
      {/* virtual source marker */}
      <line x1={cx} y1={cy} x2={srcX} y2={srcY} stroke={INK} strokeWidth="1.2" strokeDasharray="4 4"/>
      <circle cx={srcX} cy={srcY} r={14} fill={INK}/>
      <text x={srcX} y={srcY + 4} fontFamily={MONO} fontSize="10" fontWeight="700"
        fill={PAPER} textAnchor="middle" letterSpacing="0.1em">SRC</text>
    </g>
  );
}

// ── scene 5: final integration — multichannel mix ─────────────────────────

function SceneFinalMix() {
  return (
    <Sprite start={26.2} end={34}>
      {({ localTime, duration }) => {
        const op = fadeWindow(localTime, duration, 0.4, 0.6);

        const layers = [
          { id: 'osc',   label: 'PROXIMITY  ·  7 OSC',     sub: 'continuous PMS + bands', t0: 0.2 },
          { id: 'data',  label: 'DATASET  ·  PM₂.₅',       sub: 'rate ∝ μ',                t0: 0.4 },
          { id: 'stoch', label: 'STOCHASTIC TRIGGERS',     sub: 'threshold sample fires',  t0: 0.6 },
          { id: 'clap',  label: 'CLAP EVENTS',             sub: 'mic-triggered samples',   t0: 0.8 },
        ];

        return (
          <div style={{ position: 'absolute', inset: 0, opacity: op }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <SectionHeader tag="§ 6.4" title="INTEGRATION  ·  MULTICHANNEL MIX"
                meta="all layers → 6-channel ambisonic out  ·  real-time loop"
                t={localTime} t0={0}/>

              {/* 4 layer feeds on the left */}
              {layers.map((L, i) => {
                const ly = 280 + i * 130;
                return (
                  <g key={L.id} opacity={Math.min(1, Math.max(0, (localTime - L.t0) * 2))}>
                    <rect x={180} y={ly} width={420} height={100} fill={PAPER} stroke={INK} strokeWidth="1.4"
                      {...drawIn(localTime, { start: L.t0, dur: 0.6, length: 1040 })}/>
                    <text x={200} y={ly + 32} fontFamily={MONO} fontSize="13" fontWeight="700"
                      fill={INK} letterSpacing="0.18em">{L.label}</text>
                    <text x={200} y={ly + 54} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.55"
                      letterSpacing="0.15em">{L.sub}</text>
                    {/* mini live wave */}
                    <LayerActivity x={200} y={ly + 78} w={380} h={18} seed={i + 1} localTime={localTime}/>
                    {/* feed line to mixer */}
                    <line x1={600} y1={ly + 50} x2={780} y2={ly + 50}
                      stroke={INK} strokeWidth="1.4" strokeOpacity="0.55"
                      {...drawIn(localTime, { start: L.t0 + 0.2, dur: 0.5, length: 180 })}/>
                    {/* arrow */}
                    <polygon points={`${780},${ly+50} ${770},${ly+44} ${770},${ly+56}`} fill={INK}/>
                    {/* feed pulse */}
                    <FeedPulse x1={600} x2={780} y={ly + 50} t={localTime} t0={L.t0 + 0.7} period={1.8 + i * 0.2}/>
                  </g>
                );
              })}

              {/* central mixer */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.0) * 2))}>
                {/* mixer block */}
                <rect x={780} y={300} width={340} height={500} fill={PAPER} stroke={INK} strokeWidth="1.6"/>
                {[[780,300],[1120,300],[780,800],[1120,800]].map(([px,py],i)=>(
                  <g key={i} stroke={INK} strokeWidth="1.2">
                    <line x1={px-7} y1={py} x2={px+7} y2={py}/>
                    <line x1={px} y1={py-7} x2={px} y2={py+7}/>
                  </g>
                ))}
                <text x={950} y={336} fontFamily={MONO} fontSize="15" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.2em">MIX  ·  ∑</text>
                <text x={950} y={358} fontFamily={MONO} fontSize="11" fill={INK} opacity="0.6"
                  textAnchor="middle" letterSpacing="0.15em">summing + ambisonic encode</text>

                {/* channel faders */}
                {layers.map((L, i) => {
                  const fx = 810 + i * 80;
                  const lvl = 0.4 + 0.4 * Math.abs(Math.sin(localTime * (1 + i*0.3) + i));
                  return (
                    <g key={i}>
                      <rect x={fx} y={400} width={50} height={300}
                        fill="none" stroke={INK} strokeWidth="0.8" strokeOpacity="0.5"/>
                      <rect x={fx + 1} y={400 + (1 - lvl) * 296 + 2} width={48} height={lvl * 296 - 2}
                        fill={INK} opacity="0.85"/>
                      <line x1={fx - 8} y1={400 + 60} x2={fx + 58} y2={400 + 60}
                        stroke={INK} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4"/>
                      <text x={fx + 25} y={730} fontFamily={MONO} fontSize="11" fontWeight="700"
                        fill={INK} textAnchor="middle" letterSpacing="0.1em">{['OSC','DAT','STO','CLP'][i]}</text>
                      <text x={fx + 25} y={748} fontFamily={MONO} fontSize="9"
                        fill={INK} opacity="0.55" textAnchor="middle" letterSpacing="0.12em">
                        {(lvl * 100).toFixed(0)}%
                      </text>
                    </g>
                  );
                })}

                {/* sum bus indicator */}
                <text x={950} y={788} fontFamily={MONO} fontSize="10" fill={INK} opacity="0.55"
                  textAnchor="middle" letterSpacing="0.15em">SUM BUS · B-FORMAT</text>
              </g>

              {/* output: 6 channels going to speakers on the right */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 1.4) * 2))}>
                <line x1={1120} y1={550} x2={1240} y2={550} stroke={INK} strokeWidth="1.6"/>
                <polygon points={`${1240},${550} ${1230},${544} ${1230},${556}`} fill={INK}/>
                {/* 6 channel splitter */}
                {Array.from({ length: 6 }).map((_, i) => {
                  const cy = 300 + i * 90;
                  const sy = 1380; // x coord of speaker
                  const tt = (localTime + i * 0.13) * 1.5;
                  const lvl = 0.4 + 0.5 * Math.abs(Math.sin(tt));
                  return (
                    <g key={i}>
                      {/* horizontal feed from spine */}
                      <line x1={1260} y1={550} x2={1260} y2={cy + 36} stroke={INK} strokeWidth="0.8"/>
                      <line x1={1260} y1={cy + 36} x2={1340} y2={cy + 36} stroke={INK} strokeWidth="1.2"/>
                      {/* level bar */}
                      <rect x={1340} y={cy + 30} width={120} height={12}
                        fill="none" stroke={INK} strokeWidth="0.8"/>
                      <rect x={1342} y={cy + 32} width={lvl * 116} height={8} fill={INK}/>
                      {/* arrow */}
                      <line x1={1470} y1={cy + 36} x2={1540} y2={cy + 36} stroke={INK} strokeWidth="1.2"/>
                      <polygon points={`${1540},${cy+36} ${1530},${cy+30} ${1530},${cy+42}`} fill={INK}/>
                      {/* speaker */}
                      <SpeakerGlyph cx={1610} cy={cy + 36} label={`SP${i+1}`} active={lvl > 0.6} scale={0.9}/>
                      {/* channel label */}
                      <text x={1320} y={cy + 22} fontFamily={MONO} fontSize="10" fontWeight="700"
                        fill={INK} textAnchor="end" letterSpacing="0.1em">CH {i+1}</text>
                    </g>
                  );
                })}
              </g>

              {/* feedback / real-time loop annotation */}
              <g opacity={Math.min(1, Math.max(0, (localTime - 2.6) * 1.5))}>
                <path d={`M 1680 870 Q 1750 920 1700 970 L 200 970 Q 110 940 160 880`}
                  fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="6 6"
                  {...drawIn(localTime, { start: 2.6, dur: 1.4, length: 3200 })}/>
                <polygon points="160,880 154,892 168,890" fill={INK}/>
                <text x={W/2} y={1000} fontFamily={MONO} fontSize="12" fontWeight="700"
                  fill={INK} textAnchor="middle" letterSpacing="0.25em" opacity="0.7">
                  ↻ &nbsp;CONTINUOUS REAL-TIME LOOP &nbsp;·&nbsp; 44.1 KHZ &nbsp;·&nbsp; SAMPLE-ACCURATE
                </text>
              </g>
            </svg>
          </div>
        );
      }}
    </Sprite>
  );
}

function LayerActivity({ x, y, w, h, seed, localTime }) {
  const N = 100;
  let d = '';
  for (let i = 0; i < N; i++) {
    const xi = i / (N - 1);
    const t = localTime * (1 + seed * 0.3) - 1 + xi * 1.3;
    const v = Math.sin(t * 6 + seed * 1.7) * 0.4
      + Math.sin(t * 14.3 + seed * 0.6) * 0.25
      + Math.sin(t * 27 + seed * 2.1) * 0.15;
    const px = x + xi * w;
    const py = y - v * (h / 2 - 2);
    d += `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  return (
    <g>
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={INK} strokeWidth="0.4" strokeOpacity="0.3"/>
      <path d={d} fill="none" stroke={INK} strokeWidth="1.1"/>
    </g>
  );
}

function FeedPulse({ x1, x2, y, t, t0, period = 1.6 }) {
  if (t < t0) return null;
  const phase = ((t - t0) / period) % 1;
  const px = x1 + (x2 - x1) * phase;
  return <circle cx={px} cy={y} r="3.5" fill={INK} opacity={1 - phase * 0.55}/>;
}

// ── App ───────────────────────────────────────────────────────────────────

function App() {
  return (
    <Stage width={W} height={H} duration={DUR} background={PAPER} persistKey="clapstage">
      <ScreenLabel/>
      <Paper/>
      <Frame/>
      <TitleBlock/>
      <Timecode/>
      <SceneTitle/>
      <SceneClapDetect/>
      <SceneRandomPick/>
      <SceneAmbisonic/>
      <SceneFinalMix/>
    </Stage>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
