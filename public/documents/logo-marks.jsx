// logo-marks.jsx — Voxelo logo exploration marks
// Each mark: ({size, variant}) where variant ∈ 'color' | 'mono-light' | 'mono-white'
//   color       → iris bubble, white detail (on light bg)
//   mono-light  → paper fill (for dark bg)
//   mono-white  → white fill (for iris bg)

function twoTone(variant){
  switch(variant){
    case 'mono-light': return { bubble:'var(--paper)', detail:'var(--ink)' };
    case 'mono-white': return { bubble:'#ffffff',      detail:'var(--accent)' };
    default:           return { bubble:'var(--accent)', detail:'#ffffff' };
  }
}
function oneTone(variant){
  switch(variant){
    case 'mono-light': return 'var(--paper)';
    case 'mono-white': return '#ffffff';
    default:           return 'var(--accent)';
  }
}

// Shared speech-bubble silhouette (body + tail), single fill
function Bubble({ fill }){
  return (
    <g fill={fill}>
      <rect x="14" y="16" width="72" height="52" rx="18" />
      <path d="M30 58 L26 82 L52 62 Z" />
    </g>
  );
}

function Svg({ size, children }){
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">{children}</svg>
  );
}

// 1 — Vox Bubble: speech bubble + V
function MarkVoxBubble({ size=100, variant='color' }){
  const c = twoTone(variant);
  return (
    <Svg size={size}>
      <Bubble fill={c.bubble} />
      <path d="M35 31 L50 58 L65 31" fill="none" stroke={c.detail} strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// 2 — Voice Wave: bubble + symmetric waveform
function MarkWaveform({ size=100, variant='color' }){
  const c = twoTone(variant);
  const bars = [
    { x:32, h:12 }, { x:41, h:24 }, { x:50, h:32 }, { x:59, h:24 }, { x:68, h:12 },
  ];
  return (
    <Svg size={size}>
      <Bubble fill={c.bubble} />
      <g fill={c.detail}>
        {bars.map((b,i)=>(
          <rect key={i} x={b.x-2.5} y={42-b.h/2} width="5" height={b.h} rx="2.5" />
        ))}
      </g>
    </Svg>
  );
}

// 3 — The Resolve: bubble + checkmark
function MarkResolve({ size=100, variant='color' }){
  const c = twoTone(variant);
  return (
    <Svg size={size}>
      <Bubble fill={c.bubble} />
      <path d="M37 43 L46 53 L64 33" fill="none" stroke={c.detail} strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// 4 — Echo: bubble radiating signal (single tone)
function MarkEcho({ size=100, variant='color' }){
  const f = oneTone(variant);
  return (
    <Svg size={size}>
      <g fill={f}>
        <rect x="10" y="22" width="44" height="40" rx="15" />
        <path d="M24 54 L20 76 L42 58 Z" />
      </g>
      <g fill="none" stroke={f} strokeWidth="6" strokeLinecap="round">
        <path d="M62 28 A18 18 0 0 1 62 56" />
        <path d="M74 19 A30 30 0 0 1 74 65" />
      </g>
    </Svg>
  );
}

// 5 — Dialogue: two interlocking bubbles
function MarkDialogue({ size=100, variant='color' }){
  let a, b;
  if(variant==='mono-light'){ a='var(--paper)'; b='var(--paper)'; }
  else if(variant==='mono-white'){ a='#ffffff'; b='#ffffff'; }
  else { a='var(--accent)'; b='var(--accent-light)'; }
  const bOpacity = variant==='color' ? 1 : 0.55;
  return (
    <Svg size={size}>
      {/* back bubble (agent) */}
      <g fill={b} opacity={bOpacity}>
        <rect x="40" y="40" width="46" height="34" rx="13" />
        <path d="M70 70 L74 88 L56 72 Z" />
      </g>
      {/* front bubble (customer) */}
      <g fill={a}>
        <rect x="14" y="20" width="46" height="34" rx="13" />
        <path d="M30 50 L26 68 L44 52 Z" />
      </g>
    </Svg>
  );
}

Object.assign(window, {
  MarkVoxBubble, MarkWaveform, MarkResolve, MarkEcho, MarkDialogue,
});
