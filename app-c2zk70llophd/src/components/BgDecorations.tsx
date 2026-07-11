/* 全页背景绘本风装饰：散落叶片、水珠、麦穗、雪花 */
export default function BgDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden>
      {/* ── 左上：大叶片组 ── */}
      <svg className="absolute" style={{ left: -18, top: 80, width: 110, opacity: 0.55 }} viewBox="0 0 110 120" fill="none">
        <ellipse cx="55" cy="60" rx="28" ry="52" fill="#5BA883" transform="rotate(-30 55 60)" opacity="0.7"/>
        <line x1="55" y1="10" x2="55" y2="110" stroke="#3d8c5a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <line x1="55" y1="40" x2="35" y2="25" stroke="#3d8c5a" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        <line x1="55" y1="55" x2="28" y2="45" stroke="#3d8c5a" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        <line x1="55" y1="70" x2="32" y2="65" stroke="#3d8c5a" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        <line x1="55" y1="40" x2="75" y2="30" stroke="#3d8c5a" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
        <line x1="55" y1="55" x2="80" y2="50" stroke="#3d8c5a" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
      </svg>

      {/* ── 左下：小叶片 ── */}
      <svg className="absolute" style={{ left: 8, bottom: 140, width: 72, opacity: 0.45 }} viewBox="0 0 72 80" fill="none">
        <ellipse cx="36" cy="40" rx="18" ry="34" fill="#7BBFA0" transform="rotate(20 36 40)" opacity="0.8"/>
        <line x1="36" y1="8" x2="36" y2="72" stroke="#3d8c5a" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      </svg>

      {/* ── 右上：麦穗 ── */}
      <svg className="absolute" style={{ right: 10, top: 60, width: 48, opacity: 0.5 }} viewBox="0 0 48 120" fill="none">
        <line x1="24" y1="110" x2="24" y2="10" stroke="#c4a244" strokeWidth="2" strokeLinecap="round"/>
        {[16,24,32,40,48,56,64,72,80].map((y, i) => (
          <g key={i}>
            <ellipse cx={24 - (i % 2 === 0 ? 9 : -9)} cy={y} rx="6" ry="4" fill="#e6c455" opacity="0.85" transform={`rotate(${i % 2 === 0 ? -30 : 30} ${24 - (i % 2 === 0 ? 9 : -9)} ${y})`}/>
          </g>
        ))}
      </svg>

      {/* ── 右下：大叶片 ── */}
      <svg className="absolute" style={{ right: -10, bottom: 100, width: 90, opacity: 0.5 }} viewBox="0 0 90 100" fill="none">
        <ellipse cx="45" cy="50" rx="24" ry="42" fill="#5BA883" transform="rotate(25 45 50)" opacity="0.65"/>
        <line x1="45" y1="8" x2="45" y2="92" stroke="#3d8c5a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <line x1="45" y1="35" x2="22" y2="22" stroke="#3d8c5a" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
        <line x1="45" y1="50" x2="18" y2="42" stroke="#3d8c5a" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
        <line x1="45" y1="65" x2="24" y2="60" stroke="#3d8c5a" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
        <line x1="45" y1="35" x2="66" y2="26" stroke="#3d8c5a" strokeWidth="1" strokeLinecap="round" opacity="0.25"/>
        <line x1="45" y1="50" x2="68" y2="46" stroke="#3d8c5a" strokeWidth="1" strokeLinecap="round" opacity="0.25"/>
      </svg>

      {/* ── 中左：小圆叶 ── */}
      <svg className="absolute" style={{ left: 30, top: "38%", width: 44, opacity: 0.35 }} viewBox="0 0 44 48" fill="none">
        <ellipse cx="22" cy="24" rx="12" ry="20" fill="#7BBFA0" transform="rotate(-15 22 24)"/>
        <line x1="22" y1="4" x2="22" y2="44" stroke="#3d8c5a" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      </svg>

      {/* ── 水珠 ── */}
      {[
        { x: "8%",  y: "22%", r: 7,  op: 0.45 },
        { x: "92%", y: "32%", r: 5,  op: 0.35 },
        { x: "5%",  y: "60%", r: 5,  op: 0.30 },
        { x: "88%", y: "65%", r: 8,  op: 0.40 },
        { x: "50%", y: "8%",  r: 4,  op: 0.25 },
        { x: "72%", y: "88%", r: 6,  op: 0.30 },
      ].map(({ x, y, r, op }, i) => (
        <svg key={i} className="absolute" style={{ left: x, top: y, width: r * 2 + 6, opacity: op }}>
          <ellipse cx={r + 3} cy={r + 3} rx={r} ry={r * 1.3}
            fill="#7BBFA0" stroke="#5BA883" strokeWidth="0.8"
            transform={`rotate(-20 ${r+3} ${r+3})`}
          />
        </svg>
      ))}

      {/* ── 雪花 / 星点（右上角装饰）── */}
      <svg className="absolute" style={{ right: "18%", top: "12%", width: 24, opacity: 0.35 }} viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="2" x2="12" y2="22" stroke="#5BA883" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="2" y1="12" x2="22" y2="12" stroke="#5BA883" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="5" y1="5" x2="19" y2="19" stroke="#5BA883" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="19" y1="5" x2="5" y2="19" stroke="#5BA883" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>

      {/* ── 左中麦穗（小）── */}
      <svg className="absolute" style={{ left: "42%", top: "5%", width: 32, opacity: 0.3 }} viewBox="0 0 32 80" fill="none">
        <line x1="16" y1="75" x2="16" y2="5" stroke="#c4a244" strokeWidth="1.5" strokeLinecap="round"/>
        {[10,18,26,34,42,50,58].map((y, i) => (
          <ellipse key={i} cx={16 + (i%2===0 ? -7 : 7)} cy={y} rx="4.5" ry="3"
            fill="#e6c455" opacity="0.8"
            transform={`rotate(${i%2===0?-35:35} ${16+(i%2===0?-7:7)} ${y})`}/>
        ))}
      </svg>
    </div>
  );
}
