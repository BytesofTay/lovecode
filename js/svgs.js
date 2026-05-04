// ── Inline SVG diagrams ────────────────────────────────────────────────────
const SECTION_COLORS = { 'Foundations': '#7c6af7', 'Data Structures': '#4aa6ff', 'Patterns': '#f0a500' };

function svgBigOCurves() {
  const W = 460, H = 280, pad = 36;
  const xMax = 10, yMax = 1024;
  const px = (x) => pad + (x / xMax) * (W - pad * 2);
  const py = (y) => H - pad - (Math.log10(Math.max(1, y) + 1) / Math.log10(yMax + 1)) * (H - pad * 2);
  const fact = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
  const fns = [
    { name: 'O(n!)',     color: '#a855f7', f: n => fact(n) },
    { name: 'O(2ⁿ)',     color: '#ef4444', f: n => Math.pow(2, n) },
    { name: 'O(n²)',     color: '#f97316', f: n => n*n },
    { name: 'O(n log n)',color: '#fbbf24', f: n => n * Math.log2(Math.max(2, n)) },
    { name: 'O(n)',      color: '#10b981', f: n => n },
    { name: 'O(log n)',  color: '#34d399', f: n => Math.log2(Math.max(1, n)) },
    { name: 'O(1)',      color: '#9ca3af', f: () => 1 },
  ];
  let paths = '';
  for (const c of fns) {
    const pts = [];
    for (let n = 1; n <= xMax; n++) pts.push(`${px(n)},${py(c.f(n))}`);
    paths += `<polyline points="${pts.join(' ')}" stroke="${c.color}" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
    const labelY = Math.min(Math.max(py(c.f(xMax)), pad + 8), H - pad - 4);
    paths += `<text x="${W - pad + 4}" y="${labelY + 4}" font-size="11" fill="${c.color}" font-weight="600">${c.name}</text>`;
  }
  return `<svg viewBox="0 0 ${W + 70} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="#444"/>
    <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${H-pad}" stroke="#444"/>
    <text x="${(W-pad)/2 + pad/2}" y="${H-10}" font-size="11" fill="#888" text-anchor="middle">input size n →</text>
    <text x="14" y="${H/2}" font-size="11" fill="#888" text-anchor="middle" transform="rotate(-90 14 ${H/2})">operations →</text>
    ${paths}
  </svg>`;
}

function svgBigOMini() {
  // Simplified mini chart for cards
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="60" x2="95" y2="60" stroke="#444" stroke-width="1"/>
    <line x1="10" y1="8" x2="10" y2="60" stroke="#444" stroke-width="1"/>
    <polyline points="10,58 95,58" stroke="#9ca3af" fill="none" stroke-width="1.5"/>
    <polyline points="10,57 95,40" stroke="#10b981" fill="none" stroke-width="1.5"/>
    <polyline points="10,58 30,55 95,30" stroke="#fbbf24" fill="none" stroke-width="1.5"/>
    <polyline points="10,58 40,45 70,20 95,8" stroke="#f97316" fill="none" stroke-width="1.5"/>
    <polyline points="10,58 60,55 80,18 95,5" stroke="#ef4444" fill="none" stroke-width="1.5"/>
  </svg>`;
}

function svgSortingComparison() {
  const items = [
    { name: 'Insertion', n100: 100, n10k: 100, color: '#f97316', class: 'O(n²)' },
    { name: 'Selection', n100: 100, n10k: 100, color: '#f97316', class: 'O(n²)' },
    { name: 'Merge',     n100: 26,  n10k: 22,  color: '#10b981', class: 'O(n log n)' },
    { name: 'Quick',     n100: 22,  n10k: 19,  color: '#10b981', class: 'O(n log n)' },
    { name: 'Heap',      n100: 30,  n10k: 25,  color: '#10b981', class: 'O(n log n)' },
  ];
  const W = 460, H = 280, pad = 50;
  const barW = 28, gap = 14;
  const maxH = 100;
  const groupW = (barW * 2 + 4);
  const totalW = items.length * (groupW + gap) - gap;
  const startX = (W - totalW) / 2;
  let bars = '';
  items.forEach((it, i) => {
    const baseX = startX + i * (groupW + gap);
    const h1 = (it.n100 / 100) * maxH, h2 = (it.n10k / 100) * maxH;
    bars += `<rect x="${baseX}" y="${H - pad - h1}" width="${barW}" height="${h1}" fill="${it.color}" opacity="0.55" rx="2"/>`;
    bars += `<rect x="${baseX + barW + 4}" y="${H - pad - h2}" width="${barW}" height="${h2}" fill="${it.color}" rx="2"/>`;
    bars += `<text x="${baseX + barW + 2}" y="${H - pad + 14}" font-size="10" fill="#e8e8e8" text-anchor="middle" font-weight="600">${it.name}</text>`;
    bars += `<text x="${baseX + barW + 2}" y="${H - pad + 26}" font-size="9" fill="#888" text-anchor="middle">${it.class}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <text x="${W/2}" y="22" font-size="13" fill="#e8e8e8" text-anchor="middle" font-weight="600">Relative work for n=100 vs n=10,000</text>
    <text x="${W/2}" y="38" font-size="10" fill="#888" text-anchor="middle">faded = small input, solid = large input · normalized</text>
    ${bars}
    <line x1="${pad/2}" y1="${H - pad}" x2="${W - pad/2}" y2="${H - pad}" stroke="#444"/>
  </svg>`;
}

function svgSortingMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="40" width="10" height="20" fill="#10b981" rx="1"/>
    <rect x="24" y="25" width="10" height="35" fill="#10b981" rx="1"/>
    <rect x="38" y="30" width="10" height="30" fill="#fbbf24" rx="1"/>
    <rect x="52" y="15" width="10" height="45" fill="#f97316" rx="1"/>
    <rect x="66" y="10" width="10" height="50" fill="#f97316" rx="1"/>
    <rect x="80" y="50" width="10" height="10" fill="#10b981" rx="1"/>
  </svg>`;
}

function svgHashMap() {
  const W = 460, H = 280;
  let html = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  // Buckets array
  const bx = 60, by = 80, bw = 60, bh = 40;
  for (let i = 0; i < 5; i++) {
    html += `<rect x="${bx + i * bw}" y="${by}" width="${bw}" height="${bh}" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1.5"/>`;
    html += `<text x="${bx + i * bw + bw/2}" y="${by + bh/2 + 4}" font-size="11" fill="#888" text-anchor="middle">${i}</text>`;
  }
  // Key bubbles with arrows pointing into buckets
  const keys = [
    { label: '"alice"', target: 1, x: 90, y: 30 },
    { label: '"bob"', target: 3, x: 240, y: 30 },
    { label: '"carol"', target: 4, x: 350, y: 30 },
  ];
  keys.forEach(k => {
    html += `<rect x="${k.x}" y="${k.y}" width="70" height="22" fill="#222" stroke="var(--medium)" stroke-width="1.5" rx="11"/>`;
    html += `<text x="${k.x + 35}" y="${k.y + 15}" font-size="11" fill="#f0a500" text-anchor="middle" font-family="monospace">${k.label}</text>`;
    const tx = bx + k.target * bw + bw / 2, ty = by;
    html += `<line x1="${k.x + 35}" y1="${k.y + 22}" x2="${tx}" y2="${ty}" stroke="#666" stroke-dasharray="2 3" stroke-width="1"/>`;
    html += `<polygon points="${tx-3},${ty-5} ${tx+3},${ty-5} ${tx},${ty}" fill="#666"/>`;
  });
  // Values stacked below buckets
  const vals = [
    { idx: 1, items: ['(alice, 27)'] },
    { idx: 3, items: ['(bob, 31)'] },
    { idx: 4, items: ['(carol, 24)'] },
  ];
  vals.forEach(v => {
    const cx = bx + v.idx * bw + bw / 2;
    let cy = by + bh + 14;
    v.items.forEach(item => {
      html += `<rect x="${cx - 50}" y="${cy}" width="100" height="22" fill="rgba(74,166,255,.1)" stroke="#4aa6ff" stroke-width="1" rx="4"/>`;
      html += `<text x="${cx}" y="${cy + 15}" font-size="10" fill="#4aa6ff" text-anchor="middle" font-family="monospace">${item}</text>`;
      cy += 26;
    });
    // Arrow from bucket down to value
    html += `<line x1="${cx}" y1="${by + bh}" x2="${cx}" y2="${by + bh + 12}" stroke="#4aa6ff" stroke-width="1"/>`;
  });
  html += `<text x="${W/2}" y="${H - 18}" font-size="11" fill="#888" text-anchor="middle">key → hash() → bucket index → value · average O(1)</text>`;
  html += `</svg>`;
  return html;
}

function svgHashMapMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${[0,1,2,3].map(i => `<rect x="${15 + i*18}" y="30" width="14" height="14" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>`).join('')}
    <rect x="20" y="10" width="22" height="10" fill="#222" stroke="#f0a500" rx="5"/>
    <line x1="31" y1="20" x2="42" y2="30" stroke="#666" stroke-dasharray="1 1.5" stroke-width="0.8"/>
    <rect x="38" y="50" width="22" height="10" fill="rgba(74,166,255,.2)" stroke="#4aa6ff" rx="2"/>
    <line x1="49" y1="44" x2="49" y2="50" stroke="#4aa6ff" stroke-width="0.8"/>
  </svg>`;
}

function svgTwoPointers() {
  const W = 460, H = 280;
  const cellW = 50, cellH = 50;
  const cells = [1, 4, 7, 11, 15, 18, 22];
  const startX = (W - cells.length * cellW) / 2;
  const cellY = 110;
  let html = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  cells.forEach((v, i) => {
    html += `<rect x="${startX + i * cellW}" y="${cellY}" width="${cellW}" height="${cellH}" fill="#1a1a1a" stroke="#444" stroke-width="1"/>`;
    html += `<text x="${startX + i * cellW + cellW/2}" y="${cellY + cellH/2 + 5}" font-size="14" fill="#e8e8e8" text-anchor="middle" font-family="monospace" font-weight="600">${v}</text>`;
    html += `<text x="${startX + i * cellW + cellW/2}" y="${cellY + cellH + 14}" font-size="9" fill="#666" text-anchor="middle">${i}</text>`;
  });
  // Left pointer
  const lx = startX + 0 * cellW + cellW/2;
  html += `<g class="anim-pointer-l">`;
  html += `<polygon points="${lx-8},${cellY - 14} ${lx+8},${cellY - 14} ${lx},${cellY - 4}" fill="var(--accent)"/>`;
  html += `<text x="${lx}" y="${cellY - 22}" font-size="12" fill="var(--accent)" text-anchor="middle" font-weight="700">L</text>`;
  html += `</g>`;
  // Right pointer
  const rx = startX + (cells.length - 1) * cellW + cellW/2;
  html += `<g class="anim-pointer-r">`;
  html += `<polygon points="${rx-8},${cellY - 14} ${rx+8},${cellY - 14} ${rx},${cellY - 4}" fill="var(--medium)"/>`;
  html += `<text x="${rx}" y="${cellY - 22}" font-size="12" fill="var(--medium)" text-anchor="middle" font-weight="700">R</text>`;
  html += `</g>`;
  html += `<text x="${W/2}" y="${cellY + cellH + 50}" font-size="12" fill="#888" text-anchor="middle">target = 18 → arr[L]+arr[R] = 1+22=23 (too big), move R left</text>`;
  html += `<text x="${W/2}" y="${cellY + cellH + 68}" font-size="11" fill="#666" text-anchor="middle">single linear pass · O(n)</text>`;
  html += `</svg>`;
  return html;
}

function svgTwoPointersMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${[0,1,2,3,4].map(i => `<rect x="${10 + i*16}" y="30" width="14" height="14" fill="#1a1a1a" stroke="#444" stroke-width="0.8"/>`).join('')}
    <polygon points="13,22 21,22 17,28" fill="#7c6af7"/>
    <polygon points="73,22 81,22 77,28" fill="#f0a500"/>
    <text x="17" y="20" font-size="9" fill="#7c6af7" text-anchor="middle" font-weight="700">L</text>
    <text x="77" y="20" font-size="9" fill="#f0a500" text-anchor="middle" font-weight="700">R</text>
  </svg>`;
}

function svgSlidingWindow() {
  const W = 460, H = 280;
  const cells = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const cellW = 50, cellH = 50;
  const startX = (W - cells.length * cellW) / 2;
  const cellY = 110;
  let html = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  cells.forEach((v, i) => {
    html += `<rect x="${startX + i * cellW}" y="${cellY}" width="${cellW}" height="${cellH}" fill="#1a1a1a" stroke="#444" stroke-width="1"/>`;
    html += `<text x="${startX + i * cellW + cellW/2}" y="${cellY + cellH/2 + 5}" font-size="16" fill="#e8e8e8" text-anchor="middle" font-family="monospace" font-weight="600">${v}</text>`;
  });
  // Animated window of size 3 sliding
  html += `<g class="anim-window">`;
  html += `<rect x="${startX - 4}" y="${cellY - 6}" width="${3 * cellW + 8}" height="${cellH + 12}" fill="rgba(124,106,247,.18)" stroke="var(--accent)" stroke-width="2.5" rx="6"/>`;
  html += `</g>`;
  html += `<text x="${W/2}" y="${cellY - 24}" font-size="12" fill="var(--accent)" text-anchor="middle" font-weight="600">window of size k = 3</text>`;
  html += `<text x="${W/2}" y="${cellY + cellH + 34}" font-size="12" fill="#888" text-anchor="middle">expand right, shrink left when constraint breaks · O(n)</text>`;
  html += `</svg>`;
  return html;
}

function svgSlidingWindowMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${[0,1,2,3,4].map(i => `<rect x="${10 + i*16}" y="30" width="14" height="14" fill="#1a1a1a" stroke="#444" stroke-width="0.8"/>`).join('')}
    <rect x="24" y="25" width="48" height="24" fill="rgba(124,106,247,.2)" stroke="#7c6af7" stroke-width="1.4" rx="3"/>
  </svg>`;
}

function svgRecursion() {
  const W = 460, H = 280, cx = W / 2;
  const calls = [
    { label: 'fact(4)', color: '#a855f7' },
    { label: 'fact(3)', color: '#7c6af7' },
    { label: 'fact(2)', color: '#4aa6ff' },
    { label: 'fact(1) → 1', color: '#10b981' },
  ];
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  h += `<text x="${cx}" y="32" font-size="11" fill="#888" text-anchor="middle">each call waits for the inner one to return</text>`;
  calls.forEach((c, i) => {
    const w = 280 - i * 36, x = cx - w / 2, y = 56 + i * 42;
    h += `<rect x="${x}" y="${y}" width="${w}" height="32" fill="${c.color}" rx="6"/>`;
    h += `<text x="${cx}" y="${y + 21}" font-size="13" fill="#fff" text-anchor="middle" font-family="monospace" font-weight="700">${c.label}</text>`;
  });
  h += `<text x="${cx}" y="252" font-size="12" fill="var(--easy)" text-anchor="middle">↑ unwinds: returns 1 → 2 → 6 → 24</text>`;
  return h + `</svg>`;
}
function svgRecursionMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="10" width="60" height="11" fill="#a855f7" rx="2"/>
    <rect x="26" y="24" width="48" height="11" fill="#7c6af7" rx="2"/>
    <rect x="32" y="38" width="36" height="11" fill="#4aa6ff" rx="2"/>
    <rect x="38" y="52" width="24" height="11" fill="#10b981" rx="2"/>
  </svg>`;
}

function svgBitManip() {
  const W = 460, H = 280;
  const a = [1,0,1,1,0,1,0,0], b = [0,1,0,1,1,1,0,1];
  const xor = a.map((v, i) => v ^ b[i]);
  const cellW = 32, cellH = 32, startX = (W - 8 * cellW) / 2;
  function row(values, y, label, color) {
    let s = `<text x="${startX - 14}" y="${y + 22}" font-size="13" fill="${color}" font-family="monospace" font-weight="700" text-anchor="end">${label}</text>`;
    values.forEach((v, i) => {
      s += `<rect x="${startX + i * cellW}" y="${y}" width="${cellW}" height="${cellH}" fill="${v ? color : '#1a1a1a'}" stroke="${color}" stroke-width="1.2"/>`;
      s += `<text x="${startX + i * cellW + cellW/2}" y="${y + 22}" font-size="14" fill="${v ? '#fff' : '#666'}" text-anchor="middle" font-family="monospace" font-weight="700">${v}</text>`;
    });
    return s;
  }
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  h += row(a, 50, 'A', '#7c6af7');
  h += row(b, 105, 'B', '#4aa6ff');
  h += `<text x="${W/2}" y="158" font-size="13" fill="var(--medium)" text-anchor="middle" font-family="monospace" font-weight="700">A ⊕ B (XOR)</text>`;
  h += row(xor, 180, '=', '#10b981');
  h += `<text x="${W/2}" y="252" font-size="11" fill="#888" text-anchor="middle">bits differ → 1 · same → 0</text>`;
  return h + `</svg>`;
}
function svgBitManipMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <text x="14" y="22" font-size="11" fill="#7c6af7" font-family="monospace" font-weight="700">1011</text>
    <text x="14" y="40" font-size="11" fill="#4aa6ff" font-family="monospace" font-weight="700">0101</text>
    <line x1="10" y1="44" x2="50" y2="44" stroke="#888" stroke-width="0.6"/>
    <text x="14" y="60" font-size="11" fill="#10b981" font-family="monospace" font-weight="700">1110</text>
    <text x="62" y="40" font-size="11" fill="#888" font-family="monospace">XOR</text>
  </svg>`;
}

function svgArrays() {
  const W = 460, H = 280;
  const cells = [12, 7, 23, 4, 18, 9, 31, 2];
  const cellW = 44, cellH = 50, startX = (W - cells.length * cellW) / 2, y = 110;
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  cells.forEach((v, i) => {
    const x = startX + i * cellW;
    const active = i === 3;
    h += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="${active ? 'rgba(124,106,247,.15)' : '#1a1a1a'}" stroke="${active ? 'var(--accent)' : '#444'}" stroke-width="${active ? 2 : 1}"/>`;
    h += `<text x="${x + cellW/2}" y="${y + cellH/2 + 5}" font-size="14" fill="${active ? 'var(--accent)' : '#e8e8e8'}" text-anchor="middle" font-family="monospace" font-weight="600">${v}</text>`;
    h += `<text x="${x + cellW/2}" y="${y + cellH + 14}" font-size="9" fill="#666" text-anchor="middle">${i}</text>`;
  });
  h += `<text x="${W/2}" y="80" font-size="12" fill="var(--accent)" text-anchor="middle" font-weight="600">arr[3] = 4 · O(1) access by index</text>`;
  h += `<text x="${W/2}" y="220" font-size="11" fill="#888" text-anchor="middle">contiguous memory · iteration is O(n)</text>`;
  return h + `</svg>`;
}
function svgArraysMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${[0,1,2,3,4,5].map(i => {
      const a = i === 2;
      return `<rect x="${10 + i*14}" y="28" width="12" height="14" fill="${a?'rgba(124,106,247,.18)':'#1a1a1a'}" stroke="${a?'#7c6af7':'#444'}" stroke-width="${a?1.5:0.8}"/>`;
    }).join('')}
  </svg>`;
}

function svgStrings() {
  const W = 460, H = 280;
  const word = ['r','a','c','e','c','a','r'];
  const cellW = 44, cellH = 50, startX = (W - word.length * cellW) / 2, y = 110;
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  word.forEach((c, i) => {
    const x = startX + i * cellW;
    const isMid = i === 3;
    h += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="${isMid?'rgba(0,184,148,.15)':'#1a1a1a'}" stroke="${isMid?'var(--easy)':'#444'}" stroke-width="${isMid?2:1}"/>`;
    h += `<text x="${x + cellW/2}" y="${y + cellH/2 + 6}" font-size="20" fill="${isMid?'var(--easy)':'#e8e8e8'}" text-anchor="middle" font-family="monospace" font-weight="700">${c}</text>`;
  });
  // Two pointers approaching center
  h += `<polygon points="${startX + 22 - 6},80 ${startX + 22 + 6},80 ${startX + 22},92" fill="var(--accent)"/>`;
  h += `<text x="${startX + 22}" y="74" font-size="11" fill="var(--accent)" text-anchor="middle" font-weight="700">L</text>`;
  const rx = startX + (word.length - 1) * cellW + 22;
  h += `<polygon points="${rx - 6},80 ${rx + 6},80 ${rx},92" fill="var(--medium)"/>`;
  h += `<text x="${rx}" y="74" font-size="11" fill="var(--medium)" text-anchor="middle" font-weight="700">R</text>`;
  h += `<text x="${W/2}" y="200" font-size="13" fill="var(--easy)" text-anchor="middle" font-weight="600">"racecar" reads the same forwards and backwards · palindrome</text>`;
  h += `<text x="${W/2}" y="220" font-size="11" fill="#888" text-anchor="middle">two-pointer check is O(n)</text>`;
  return h + `</svg>`;
}
function svgStringsMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${['a','b','b','a'].map((c, i) => `<rect x="${20 + i*15}" y="28" width="13" height="14" fill="#1a1a1a" stroke="#444" stroke-width="0.8"/><text x="${26.5 + i*15}" y="39" font-size="9" fill="#e8e8e8" text-anchor="middle" font-family="monospace" font-weight="700">${c}</text>`).join('')}
    <polygon points="22,21 30,21 26,27" fill="#7c6af7"/>
    <polygon points="68,21 76,21 72,27" fill="#f0a500"/>
  </svg>`;
}

function svgLinkedList() {
  const W = 460, H = 280;
  const nodes = [3, 7, 1, 5];
  const nodeW = 70, nodeH = 50, gap = 28;
  const totalW = nodes.length * nodeW + (nodes.length - 1) * gap + 60; // + null
  const startX = (W - totalW) / 2, y = 110;
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  nodes.forEach((v, i) => {
    const x = startX + i * (nodeW + gap);
    h += `<rect x="${x}" y="${y}" width="${nodeW}" height="${nodeH}" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1.5" rx="4"/>`;
    h += `<line x1="${x + nodeW/2}" y1="${y}" x2="${x + nodeW/2}" y2="${y + nodeH}" stroke="#4aa6ff" stroke-width="1"/>`;
    h += `<text x="${x + nodeW/4}" y="${y + nodeH/2 + 5}" font-size="14" fill="#e8e8e8" text-anchor="middle" font-family="monospace" font-weight="600">${v}</text>`;
    h += `<text x="${x + nodeW*3/4}" y="${y + nodeH/2 + 5}" font-size="11" fill="#888" text-anchor="middle" font-family="monospace">→</text>`;
    if (i < nodes.length) {
      const ax = x + nodeW, ay = y + nodeH/2;
      const bx = i < nodes.length - 1 ? startX + (i+1) * (nodeW + gap) : startX + nodes.length * (nodeW + gap) + 16;
      h += `<line x1="${ax}" y1="${ay}" x2="${bx - 8}" y2="${ay}" stroke="#4aa6ff" stroke-width="1.5"/>`;
      h += `<polygon points="${bx-8},${ay-4} ${bx-8},${ay+4} ${bx-1},${ay}" fill="#4aa6ff"/>`;
    }
  });
  // null
  const nullX = startX + nodes.length * (nodeW + gap) + 16;
  h += `<text x="${nullX + 18}" y="${y + nodeH/2 + 6}" font-size="13" fill="#666" font-family="monospace" font-weight="600">∅</text>`;
  h += `<text x="${W/2}" y="80" font-size="12" fill="#888" text-anchor="middle">[ data | next ] → next node → ... → null</text>`;
  h += `<text x="${W/2}" y="200" font-size="11" fill="#888" text-anchor="middle">indexing is O(n) · insert at head is O(1)</text>`;
  return h + `</svg>`;
}
function svgLinkedListMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${[0,1,2].map(i => `
      <rect x="${10 + i*28}" y="28" width="20" height="14" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="0.8" rx="1"/>
      <line x1="${30 + i*28}" y1="35" x2="${36 + i*28}" y2="35" stroke="#4aa6ff" stroke-width="0.8"/>
      <polygon points="${36 + i*28},33 ${36 + i*28},37 ${40 + i*28},35" fill="#4aa6ff"/>
    `).join('')}
    <text x="92" y="38" font-size="10" fill="#666" font-family="monospace">∅</text>
  </svg>`;
}

function svgStackQueue() {
  const W = 460, H = 280;
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  // Stack on left
  h += `<text x="100" y="40" font-size="14" fill="var(--accent)" text-anchor="middle" font-weight="700">STACK</text>`;
  h += `<text x="100" y="56" font-size="10" fill="#888" text-anchor="middle">last in, first out</text>`;
  const sVals = ['1', '2', '3'];
  sVals.forEach((v, i) => {
    const y = 200 - i * 36;
    h += `<rect x="60" y="${y}" width="80" height="32" fill="rgba(124,106,247,.15)" stroke="var(--accent)" stroke-width="1.5"/>`;
    h += `<text x="100" y="${y + 21}" font-size="14" fill="var(--accent)" text-anchor="middle" font-family="monospace" font-weight="600">${v}</text>`;
  });
  h += `<polygon points="92,${200 - 2*36 - 22} 108,${200 - 2*36 - 22} 100,${200 - 2*36 - 8}" fill="var(--accent)"/>`;
  h += `<text x="100" y="${200 - 2*36 - 28}" font-size="11" fill="var(--accent)" text-anchor="middle" font-weight="700">push/pop</text>`;
  h += `<text x="100" y="246" font-size="10" fill="#666" text-anchor="middle">bottom</text>`;

  // Queue on right
  h += `<text x="340" y="40" font-size="14" fill="var(--medium)" text-anchor="middle" font-weight="700">QUEUE</text>`;
  h += `<text x="340" y="56" font-size="10" fill="#888" text-anchor="middle">first in, first out</text>`;
  const qVals = ['A', 'B', 'C', 'D'];
  qVals.forEach((v, i) => {
    const x = 240 + i * 50;
    h += `<rect x="${x}" y="120" width="44" height="40" fill="rgba(240,165,0,.12)" stroke="var(--medium)" stroke-width="1.5"/>`;
    h += `<text x="${x + 22}" y="146" font-size="14" fill="var(--medium)" text-anchor="middle" font-family="monospace" font-weight="600">${v}</text>`;
  });
  h += `<text x="262" y="184" font-size="11" fill="var(--medium)" text-anchor="middle" font-weight="700">dequeue ←</text>`;
  h += `<text x="418" y="184" font-size="11" fill="var(--medium)" text-anchor="middle" font-weight="700">← enqueue</text>`;
  return h + `</svg>`;
}
function svgStackQueueMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="20" width="22" height="9" fill="rgba(124,106,247,.2)" stroke="#7c6af7" stroke-width="0.8"/>
    <rect x="14" y="32" width="22" height="9" fill="rgba(124,106,247,.2)" stroke="#7c6af7" stroke-width="0.8"/>
    <rect x="14" y="44" width="22" height="9" fill="rgba(124,106,247,.2)" stroke="#7c6af7" stroke-width="0.8"/>
    <rect x="56" y="32" width="12" height="14" fill="rgba(240,165,0,.18)" stroke="#f0a500" stroke-width="0.8"/>
    <rect x="70" y="32" width="12" height="14" fill="rgba(240,165,0,.18)" stroke="#f0a500" stroke-width="0.8"/>
    <rect x="84" y="32" width="12" height="14" fill="rgba(240,165,0,.18)" stroke="#f0a500" stroke-width="0.8"/>
  </svg>`;
}

function svgTree() {
  const W = 460, H = 280;
  const nodes = {
    1: { v: 8, x: 230, y: 60 },
    2: { v: 4, x: 140, y: 130 },
    3: { v: 12, x: 320, y: 130 },
    4: { v: 2, x: 90, y: 200 },
    5: { v: 6, x: 190, y: 200 },
    6: { v: 10, x: 270, y: 200 },
    7: { v: 14, x: 370, y: 200 },
  };
  const edges = [[1,2],[1,3],[2,4],[2,5],[3,6],[3,7]];
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  edges.forEach(([a, b]) => {
    h += `<line x1="${nodes[a].x}" y1="${nodes[a].y}" x2="${nodes[b].x}" y2="${nodes[b].y}" stroke="#4aa6ff" stroke-width="1.5"/>`;
  });
  Object.values(nodes).forEach(n => {
    h += `<circle cx="${n.x}" cy="${n.y}" r="22" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="2"/>`;
    h += `<text x="${n.x}" y="${n.y + 5}" font-size="14" fill="#e8e8e8" text-anchor="middle" font-family="monospace" font-weight="600">${n.v}</text>`;
  });
  h += `<text x="${W/2}" y="252" font-size="12" fill="#888" text-anchor="middle">BST: in-order traversal yields 2, 4, 6, 8, 10, 12, 14 (sorted)</text>`;
  return h + `</svg>`;
}
function svgTreeMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <line x1="50" y1="18" x2="32" y2="40" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="50" y1="18" x2="68" y2="40" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="32" y1="40" x2="22" y2="58" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="32" y1="40" x2="42" y2="58" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="68" y1="40" x2="58" y2="58" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="68" y1="40" x2="78" y2="58" stroke="#4aa6ff" stroke-width="1"/>
    <circle cx="50" cy="18" r="7" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1.2"/>
    <circle cx="32" cy="40" r="6" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1.2"/>
    <circle cx="68" cy="40" r="6" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1.2"/>
    <circle cx="22" cy="58" r="5" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>
    <circle cx="42" cy="58" r="5" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>
    <circle cx="58" cy="58" r="5" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>
    <circle cx="78" cy="58" r="5" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>
  </svg>`;
}

function svgHeap() {
  const W = 460, H = 280;
  const nodes = {
    1: { v: 90, x: 230, y: 60 },
    2: { v: 60, x: 140, y: 130 },
    3: { v: 80, x: 320, y: 130 },
    4: { v: 30, x: 90, y: 200 },
    5: { v: 50, x: 190, y: 200 },
    6: { v: 40, x: 270, y: 200 },
    7: { v: 70, x: 370, y: 200 },
  };
  const edges = [[1,2],[1,3],[2,4],[2,5],[3,6],[3,7]];
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  edges.forEach(([a, b]) => {
    h += `<line x1="${nodes[a].x}" y1="${nodes[a].y + 22}" x2="${nodes[b].x}" y2="${nodes[b].y - 22}" stroke="#f0a500" stroke-width="1.5"/>`;
    // ≥ label on edges
    const mx = (nodes[a].x + nodes[b].x) / 2 + 6, my = (nodes[a].y + nodes[b].y) / 2;
    h += `<text x="${mx}" y="${my}" font-size="10" fill="#f0a500" font-family="monospace">≥</text>`;
  });
  Object.values(nodes).forEach((n, i) => {
    const isRoot = i === 0;
    h += `<circle cx="${n.x}" cy="${n.y}" r="22" fill="${isRoot ? 'rgba(240,165,0,.2)' : '#1a1a1a'}" stroke="var(--medium)" stroke-width="${isRoot ? 2.5 : 1.8}"/>`;
    h += `<text x="${n.x}" y="${n.y + 5}" font-size="13" fill="${isRoot ? 'var(--medium)' : '#e8e8e8'}" text-anchor="middle" font-family="monospace" font-weight="700">${n.v}</text>`;
  });
  h += `<text x="${W/2}" y="252" font-size="12" fill="#888" text-anchor="middle">max-heap: parent ≥ children · root is the max · push/pop O(log n)</text>`;
  return h + `</svg>`;
}
function svgHeapMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <line x1="50" y1="18" x2="32" y2="40" stroke="#f0a500" stroke-width="1"/>
    <line x1="50" y1="18" x2="68" y2="40" stroke="#f0a500" stroke-width="1"/>
    <line x1="32" y1="40" x2="22" y2="58" stroke="#f0a500" stroke-width="1"/>
    <line x1="32" y1="40" x2="42" y2="58" stroke="#f0a500" stroke-width="1"/>
    <circle cx="50" cy="18" r="9" fill="rgba(240,165,0,.2)" stroke="#f0a500" stroke-width="1.4"/>
    <circle cx="32" cy="40" r="7" fill="#1a1a1a" stroke="#f0a500" stroke-width="1"/>
    <circle cx="68" cy="40" r="7" fill="#1a1a1a" stroke="#f0a500" stroke-width="1"/>
    <circle cx="22" cy="58" r="5" fill="#1a1a1a" stroke="#f0a500" stroke-width="0.8"/>
    <circle cx="42" cy="58" r="5" fill="#1a1a1a" stroke="#f0a500" stroke-width="0.8"/>
  </svg>`;
}

function svgGraph() {
  const W = 460, H = 280;
  const nodes = {
    A: { x: 110, y: 90 },
    B: { x: 250, y: 60 },
    C: { x: 360, y: 110 },
    D: { x: 320, y: 210 },
    E: { x: 170, y: 200 },
  };
  const edges = [['A','B'],['A','E'],['B','C'],['B','D'],['C','D'],['D','E']];
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  edges.forEach(([a, b]) => {
    h += `<line x1="${nodes[a].x}" y1="${nodes[a].y}" x2="${nodes[b].x}" y2="${nodes[b].y}" stroke="#4aa6ff" stroke-width="1.6"/>`;
  });
  Object.entries(nodes).forEach(([name, p]) => {
    h += `<circle cx="${p.x}" cy="${p.y}" r="22" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="2"/>`;
    h += `<text x="${p.x}" y="${p.y + 5}" font-size="14" fill="#e8e8e8" text-anchor="middle" font-family="monospace" font-weight="700">${name}</text>`;
  });
  h += `<text x="${W/2}" y="252" font-size="12" fill="#888" text-anchor="middle">undirected graph · adjacency list: A → [B,E], B → [A,C,D], ...</text>`;
  return h + `</svg>`;
}
function svgGraphMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <line x1="22" y1="22" x2="60" y2="14" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="22" y1="22" x2="38" y2="55" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="60" y1="14" x2="80" y2="40" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="80" y1="40" x2="38" y2="55" stroke="#4aa6ff" stroke-width="1"/>
    <circle cx="22" cy="22" r="7" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1.2"/>
    <circle cx="60" cy="14" r="7" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1.2"/>
    <circle cx="80" cy="40" r="7" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1.2"/>
    <circle cx="38" cy="55" r="7" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1.2"/>
  </svg>`;
}

function svgMatrix() {
  const W = 460, H = 280;
  const N = 4;
  const cellSize = 44, startX = (W - N * cellSize) / 2, startY = 70;
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const x = startX + c * cellSize, y = startY + r * cellSize;
      const visited = (r * N + c) < 7;
      const current = (r * N + c) === 6;
      h += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${current ? 'rgba(124,106,247,.25)' : visited ? 'rgba(74,166,255,.1)' : '#1a1a1a'}" stroke="${current ? 'var(--accent)' : visited ? '#4aa6ff' : '#444'}" stroke-width="${current ? 2 : 1}"/>`;
      if (visited) h += `<text x="${x + cellSize/2}" y="${y + cellSize/2 + 5}" font-size="12" fill="${current ? 'var(--accent)' : '#4aa6ff'}" text-anchor="middle" font-weight="700">${r * N + c}</text>`;
    }
  }
  h += `<text x="${W/2}" y="48" font-size="12" fill="#888" text-anchor="middle">2D grid · each cell connects to 4 neighbors (up/down/left/right)</text>`;
  h += `<text x="${W/2}" y="262" font-size="11" fill="#888" text-anchor="middle">treat as a graph for BFS/DFS · classic: Number of Islands</text>`;
  return h + `</svg>`;
}
function svgMatrixMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${[0,1,2,3].map(r => [0,1,2,3].map(c => {
      const lit = r * 4 + c < 6;
      return `<rect x="${22 + c*14}" y="${10 + r*13}" width="13" height="12" fill="${lit?'rgba(74,166,255,.15)':'#1a1a1a'}" stroke="${lit?'#4aa6ff':'#444'}" stroke-width="0.6"/>`;
    }).join('')).join('')}
  </svg>`;
}

function svgIntervals() {
  const W = 460, H = 280;
  const intervals = [
    { s: 1, e: 4, color: '#7c6af7' },
    { s: 3, e: 6, color: '#7c6af7' },
    { s: 7, e: 9, color: '#10b981' },
    { s: 8, e: 11, color: '#10b981' },
    { s: 11, e: 14, color: '#f0a500' },
  ];
  const tlStart = 60, tlEnd = 410, tlY = 220;
  const xMax = 14;
  const px = (t) => tlStart + (t / xMax) * (tlEnd - tlStart);
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  // Bars stacked
  intervals.forEach((iv, i) => {
    const y = 60 + i * 28;
    h += `<rect x="${px(iv.s)}" y="${y}" width="${px(iv.e) - px(iv.s)}" height="22" fill="${iv.color}" opacity="0.8" rx="3"/>`;
    h += `<text x="${px(iv.s) + 4}" y="${y + 15}" font-size="11" fill="#fff" font-family="monospace" font-weight="600">[${iv.s}, ${iv.e}]</text>`;
  });
  // Timeline
  h += `<line x1="${tlStart}" y1="${tlY}" x2="${tlEnd}" y2="${tlY}" stroke="#666" stroke-width="1"/>`;
  for (let t = 0; t <= xMax; t++) {
    const x = px(t);
    h += `<line x1="${x}" y1="${tlY - 3}" x2="${x}" y2="${tlY + 3}" stroke="#666"/>`;
    if (t % 2 === 0) h += `<text x="${x}" y="${tlY + 16}" font-size="9" fill="#666" text-anchor="middle">${t}</text>`;
  }
  h += `<text x="${W/2}" y="252" font-size="11" fill="#888" text-anchor="middle">overlapping intervals (purple) merge → [1,6] · sort by start, then sweep</text>`;
  return h + `</svg>`;
}
function svgIntervalsMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="20" width="40" height="8" fill="#7c6af7" opacity="0.8" rx="2"/>
    <rect x="36" y="32" width="38" height="8" fill="#7c6af7" opacity="0.8" rx="2"/>
    <rect x="62" y="44" width="28" height="8" fill="#f0a500" opacity="0.8" rx="2"/>
    <line x1="10" y1="60" x2="92" y2="60" stroke="#666" stroke-width="0.8"/>
  </svg>`;
}

function svgBinarySearch() {
  const W = 460, H = 280;
  const arr = [2, 5, 8, 11, 15, 18, 22, 26, 31];
  const cellW = 44, cellH = 50, startX = (W - arr.length * cellW) / 2, y = 110;
  const lo = 0, hi = 8, mid = 4;
  const target = 22;
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  arr.forEach((v, i) => {
    const x = startX + i * cellW;
    const isMid = i === mid;
    const inRange = i >= lo && i <= hi;
    h += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="${isMid ? 'rgba(124,106,247,.25)' : inRange ? '#1a1a1a' : '#0c0c0c'}" stroke="${isMid ? 'var(--accent)' : inRange ? '#444' : '#222'}" stroke-width="${isMid ? 2.5 : 1}"/>`;
    h += `<text x="${x + cellW/2}" y="${y + cellH/2 + 5}" font-size="13" fill="${isMid ? 'var(--accent)' : inRange ? '#e8e8e8' : '#444'}" text-anchor="middle" font-family="monospace" font-weight="${isMid ? 700 : 500}">${v}</text>`;
  });
  // Pointers
  const lx = startX + lo * cellW + cellW/2;
  const rx = startX + hi * cellW + cellW/2;
  const mx = startX + mid * cellW + cellW/2;
  h += `<text x="${lx}" y="${y + cellH + 18}" font-size="11" fill="#10b981" text-anchor="middle" font-weight="700">lo</text>`;
  h += `<text x="${mx}" y="${y - 8}" font-size="11" fill="var(--accent)" text-anchor="middle" font-weight="700">mid</text>`;
  h += `<text x="${rx}" y="${y + cellH + 18}" font-size="11" fill="#ef4444" text-anchor="middle" font-weight="700">hi</text>`;
  h += `<text x="${W/2}" y="60" font-size="13" fill="var(--accent)" text-anchor="middle" font-weight="600">target = ${target} · arr[mid] = 15 → too small, search right half</text>`;
  h += `<text x="${W/2}" y="252" font-size="11" fill="#888" text-anchor="middle">each step halves the range · O(log n)</text>`;
  return h + `</svg>`;
}
function svgBinarySearchMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${[0,1,2,3,4,5,6].map(i => {
      const m = i === 3, dim = i < 1 || i > 5;
      return `<rect x="${10 + i*12}" y="28" width="11" height="14" fill="${m?'rgba(124,106,247,.3)':dim?'#0c0c0c':'#1a1a1a'}" stroke="${m?'#7c6af7':dim?'#222':'#444'}" stroke-width="${m?1.4:0.7}"/>`;
    }).join('')}
    <text x="46" y="22" font-size="9" fill="#7c6af7" font-weight="700" text-anchor="middle">mid</text>
  </svg>`;
}

function svgBfsDfs() {
  const W = 460, H = 280;
  // Two trees side by side, staggered animation per visit order
  function tree(offset, order, color, label) {
    const positions = [
      { x: offset + 80, y: 60 },
      { x: offset + 40, y: 120 },
      { x: offset + 120, y: 120 },
      { x: offset + 16, y: 180 },
      { x: offset + 64, y: 180 },
      { x: offset + 96, y: 180 },
      { x: offset + 144, y: 180 },
    ];
    const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
    let s = `<text x="${offset + 80}" y="36" font-size="13" fill="${color}" text-anchor="middle" font-weight="700">${label}</text>`;
    edges.forEach(([a,b]) => {
      s += `<line x1="${positions[a].x}" y1="${positions[a].y}" x2="${positions[b].x}" y2="${positions[b].y}" stroke="#444" stroke-width="1"/>`;
    });
    positions.forEach((p, i) => {
      // Stagger animation delay so nodes "light up" in visit order
      const delay = `${(order[i] - 1) * 0.85}s`;
      s += `<g class="bfs-step" style="animation-delay:${delay}">`;
      s += `<circle cx="${p.x}" cy="${p.y}" r="14" fill="${color}" stroke="${color}" stroke-width="1.5" opacity="0.25"/>`;
      s += `<circle cx="${p.x}" cy="${p.y}" r="14" fill="#1a1a1a" stroke="${color}" stroke-width="1.5"/>`;
      s += `<text x="${p.x}" y="${p.y + 4}" font-size="12" fill="${color}" text-anchor="middle" font-family="monospace" font-weight="700">${order[i]}</text>`;
      s += `</g>`;
    });
    return s;
  }
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  // BFS order: level 0,1,2,3,4,5,6 → root,L,R,LL,LR,RL,RR = 1,2,3,4,5,6,7
  h += tree(40, [1,2,3,4,5,6,7], '#7c6af7', 'BFS · level by level');
  // DFS pre-order: root → leftmost path → backtrack
  h += tree(280, [1,2,4,5,3,6,7], '#f0a500', 'DFS · go deep first');
  h += `<text x="${W/2}" y="232" font-size="12" fill="#888" text-anchor="middle">numbers show visit order · same tree, different traversal</text>`;
  h += `<text x="${W/2}" y="252" font-size="11" fill="#888" text-anchor="middle">BFS uses a queue · DFS uses recursion (or a stack)</text>`;
  return h + `</svg>`;
}
function svgBfsDfsMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <line x1="28" y1="14" x2="16" y2="34" stroke="#7c6af7" stroke-width="1"/>
    <line x1="28" y1="14" x2="40" y2="34" stroke="#7c6af7" stroke-width="1"/>
    <circle cx="28" cy="14" r="6" fill="#1a1a1a" stroke="#7c6af7" stroke-width="1"/>
    <circle cx="16" cy="34" r="6" fill="#1a1a1a" stroke="#7c6af7" stroke-width="1"/>
    <circle cx="40" cy="34" r="6" fill="#1a1a1a" stroke="#7c6af7" stroke-width="1"/>
    <line x1="78" y1="14" x2="66" y2="34" stroke="#f0a500" stroke-width="1"/>
    <line x1="78" y1="14" x2="90" y2="34" stroke="#f0a500" stroke-width="1"/>
    <line x1="66" y1="34" x2="60" y2="56" stroke="#f0a500" stroke-width="1"/>
    <circle cx="78" cy="14" r="6" fill="#1a1a1a" stroke="#f0a500" stroke-width="1"/>
    <circle cx="66" cy="34" r="6" fill="#1a1a1a" stroke="#f0a500" stroke-width="1"/>
    <circle cx="90" cy="34" r="6" fill="#1a1a1a" stroke="#f0a500" stroke-width="1"/>
    <circle cx="60" cy="56" r="5" fill="#1a1a1a" stroke="#f0a500" stroke-width="0.8"/>
  </svg>`;
}

function svgBacktracking() {
  const W = 460, H = 280;
  // Decision tree
  const nodes = [
    { id: 0, x: 230, y: 50, label: '[]', kind: 'normal' },
    { id: 1, x: 130, y: 110, label: '[1]', kind: 'good' },
    { id: 2, x: 330, y: 110, label: '[2]', kind: 'normal' },
    { id: 3, x: 70,  y: 180, label: '[1,2]', kind: 'good' },
    { id: 4, x: 190, y: 180, label: '[1,3]', kind: 'cut' },
    { id: 5, x: 290, y: 180, label: '[2,3]', kind: 'good' },
    { id: 6, x: 390, y: 180, label: '[2,4]', kind: 'cut' },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  edges.forEach(([a, b]) => {
    const N = nodes;
    const cut = N[b].kind === 'cut';
    h += `<line x1="${N[a].x}" y1="${N[a].y}" x2="${N[b].x}" y2="${N[b].y}" stroke="${cut ? '#666' : '#7c6af7'}" stroke-width="1.5" stroke-dasharray="${cut ? '4 3' : '0'}"/>`;
  });
  nodes.forEach(n => {
    const colors = { normal: '#7c6af7', good: '#10b981', cut: '#666' };
    const c = colors[n.kind];
    h += `<rect x="${n.x - 26}" y="${n.y - 12}" width="52" height="24" fill="#1a1a1a" stroke="${c}" stroke-width="1.5" rx="4"/>`;
    h += `<text x="${n.x}" y="${n.y + 4}" font-size="11" fill="${c}" text-anchor="middle" font-family="monospace" font-weight="700">${n.label}</text>`;
    if (n.kind === 'cut') h += `<text x="${n.x + 30}" y="${n.y + 4}" font-size="14" fill="#ef4444" font-weight="700">✗</text>`;
    if (n.kind === 'good' && n.y > 100) h += `<text x="${n.x + 32}" y="${n.y + 4}" font-size="14" fill="var(--easy)" font-weight="700">✓</text>`;
  });
  h += `<text x="${W/2}" y="232" font-size="12" fill="#888" text-anchor="middle">choose → recurse → un-choose · prune dead branches</text>`;
  h += `<text x="${W/2}" y="252" font-size="11" fill="#888" text-anchor="middle">solid = explored · dashed = pruned</text>`;
  return h + `</svg>`;
}
function svgBacktrackingMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <line x1="50" y1="16" x2="28" y2="36" stroke="#7c6af7" stroke-width="1"/>
    <line x1="50" y1="16" x2="72" y2="36" stroke="#7c6af7" stroke-width="1"/>
    <line x1="28" y1="36" x2="16" y2="56" stroke="#10b981" stroke-width="1"/>
    <line x1="28" y1="36" x2="40" y2="56" stroke="#666" stroke-width="1" stroke-dasharray="2 2"/>
    <line x1="72" y1="36" x2="60" y2="56" stroke="#10b981" stroke-width="1"/>
    <line x1="72" y1="36" x2="84" y2="56" stroke="#666" stroke-width="1" stroke-dasharray="2 2"/>
    <circle cx="50" cy="16" r="5" fill="#1a1a1a" stroke="#7c6af7" stroke-width="1"/>
    <circle cx="28" cy="36" r="5" fill="#1a1a1a" stroke="#7c6af7" stroke-width="1"/>
    <circle cx="72" cy="36" r="5" fill="#1a1a1a" stroke="#7c6af7" stroke-width="1"/>
    <circle cx="16" cy="56" r="4" fill="#1a1a1a" stroke="#10b981" stroke-width="0.8"/>
    <circle cx="60" cy="56" r="4" fill="#1a1a1a" stroke="#10b981" stroke-width="0.8"/>
  </svg>`;
}

function svgDP() {
  const W = 460, H = 280;
  // Fibonacci DP table
  const fib = [0, 1, 1, 2, 3, 5, 8, 13];
  const cellW = 44, cellH = 44, startX = (W - fib.length * cellW) / 2, y = 110;
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  h += `<text x="${W/2}" y="60" font-size="13" fill="var(--easy)" text-anchor="middle" font-weight="600">dp[i] = dp[i−1] + dp[i−2]</text>`;
  h += `<text x="${W/2}" y="80" font-size="11" fill="#888" text-anchor="middle">build the table from base cases up — Fibonacci</text>`;
  fib.forEach((v, i) => {
    const x = startX + i * cellW;
    const delay = `${i * 0.7}s`;
    h += `<g class="dp-cell-anim" style="animation-delay:${delay}">`;
    h += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="rgba(124,106,247,.12)" stroke="var(--accent)" stroke-width="1.4"/>`;
    h += `<text x="${x + cellW/2}" y="${y + cellH/2 + 5}" font-size="14" fill="var(--accent)" text-anchor="middle" font-family="monospace" font-weight="700">${v}</text>`;
    h += `</g>`;
    h += `<text x="${x + cellW/2}" y="${y + cellH + 14}" font-size="9" fill="#666" text-anchor="middle">i=${i}</text>`;
  });
  // Arrow showing dp[5] = dp[4] + dp[3]
  h += `<path d="M ${startX + 3*cellW + cellW/2} ${y - 2} Q ${startX + 4.5*cellW} ${y - 24} ${startX + 5*cellW + cellW/2 - 3} ${y - 2}" stroke="var(--easy)" fill="none" stroke-width="1.2"/>`;
  h += `<path d="M ${startX + 4*cellW + cellW/2} ${y - 2} L ${startX + 5*cellW + cellW/2 - 3} ${y - 2}" stroke="var(--easy)" stroke-width="1.2"/>`;
  h += `<text x="${W/2}" y="252" font-size="11" fill="#888" text-anchor="middle">each cell = sum of two prior · solve once, reuse forever</text>`;
  return h + `</svg>`;
}
function svgDPMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${[0,1,2,3,4,5,6].map(i => {
      const f = i < 5;
      return `<rect x="${10 + i*12}" y="28" width="11" height="14" fill="${f?'rgba(124,106,247,.15)':'#1a1a1a'}" stroke="${f?'#7c6af7':'#444'}" stroke-width="0.8"/>`;
    }).join('')}
    ${['0','1','1','2','3'].map((v, i) => `<text x="${15.5 + i*12}" y="38" font-size="7" fill="#7c6af7" text-anchor="middle" font-family="monospace" font-weight="700">${v}</text>`).join('')}
  </svg>`;
}

function svgGreedy() {
  const W = 460, H = 280;
  // Number line with picks
  const choices = [
    { v: 3, picked: true,  x: 80 },
    { v: 7, picked: true,  x: 160 },
    { v: 2, picked: false, x: 240 },
    { v: 12, picked: true, x: 320 },
    { v: 5, picked: false, x: 400 },
  ];
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  h += `<text x="${W/2}" y="56" font-size="13" fill="var(--medium)" text-anchor="middle" font-weight="600">at each step, pick the locally best option</text>`;
  // Connecting line
  h += `<line x1="40" y1="150" x2="430" y2="150" stroke="#444" stroke-width="1"/>`;
  choices.forEach((c, i) => {
    const r = 20 + (c.v / 12) * 14;
    h += `<circle cx="${c.x}" cy="150" r="${r}" fill="${c.picked ? 'rgba(240,165,0,.18)' : '#1a1a1a'}" stroke="${c.picked ? 'var(--medium)' : '#444'}" stroke-width="${c.picked ? 2 : 1}"/>`;
    h += `<text x="${c.x}" y="155" font-size="14" fill="${c.picked ? 'var(--medium)' : '#666'}" text-anchor="middle" font-family="monospace" font-weight="700">${c.v}</text>`;
    h += `<text x="${c.x}" y="${150 + r + 14}" font-size="10" fill="${c.picked ? 'var(--medium)' : '#666'}" text-anchor="middle" font-weight="${c.picked ? 700 : 400}">${c.picked ? '✓ pick' : 'skip'}</text>`;
  });
  h += `<text x="${W/2}" y="240" font-size="11" fill="#888" text-anchor="middle">works only when local optimum → global optimum (prove the exchange argument)</text>`;
  return h + `</svg>`;
}
function svgGreedyMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <line x1="14" y1="35" x2="86" y2="35" stroke="#444" stroke-width="0.8"/>
    <circle cx="22" cy="35" r="6" fill="rgba(240,165,0,.2)" stroke="#f0a500" stroke-width="1.2"/>
    <circle cx="40" cy="35" r="9" fill="rgba(240,165,0,.2)" stroke="#f0a500" stroke-width="1.2"/>
    <circle cx="58" cy="35" r="5" fill="#1a1a1a" stroke="#444" stroke-width="0.8"/>
    <circle cx="78" cy="35" r="11" fill="rgba(240,165,0,.2)" stroke="#f0a500" stroke-width="1.2"/>
  </svg>`;
}

function svgMonotonicDeque() {
  const W = 460, H = 280, cellW = 44, cellH = 50;
  const window = [3, 1, 5, 2, 8];
  const deque = [8]; // simplified: only 8 dominates
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  // Window cells
  const startX = (W - window.length * cellW) / 2, y = 80;
  window.forEach((v, i) => {
    const x = startX + i * cellW;
    const dom = v === 8;
    h += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="${dom?'rgba(124,106,247,.18)':'#1a1a1a'}" stroke="${dom?'var(--accent)':'#444'}" stroke-width="${dom?2:1}"/>`;
    h += `<text x="${x+cellW/2}" y="${y+cellH/2+5}" font-size="14" fill="${dom?'var(--accent)':'#e8e8e8'}" text-anchor="middle" font-family="monospace" font-weight="700">${v}</text>`;
  });
  h += `<text x="${W/2}" y="60" font-size="11" fill="var(--accent)" text-anchor="middle" font-weight="700">window of size 5</text>`;
  // Deque below
  const dy = 180;
  deque.forEach((v, i) => {
    h += `<rect x="${W/2 - cellW/2}" y="${dy}" width="${cellW}" height="${cellH}" fill="rgba(0,184,148,.18)" stroke="var(--easy)" stroke-width="2"/>`;
    h += `<text x="${W/2}" y="${dy+cellH/2+5}" font-size="14" fill="var(--easy)" text-anchor="middle" font-family="monospace" font-weight="700">${v}</text>`;
  });
  h += `<text x="${W/2}" y="160" font-size="11" fill="var(--easy)" text-anchor="middle" font-weight="700">deque (decreasing)</text>`;
  h += `<text x="${W/2}" y="252" font-size="11" fill="#888" text-anchor="middle">smaller dominated values popped from back · O(n) total</text>`;
  return h + `</svg>`;
}
function svgMonotonicDequeMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="22" width="14" height="14" fill="#1a1a1a" stroke="#444" stroke-width="0.8"/>
    <rect x="30" y="22" width="14" height="14" fill="#1a1a1a" stroke="#444" stroke-width="0.8"/>
    <rect x="46" y="22" width="14" height="14" fill="rgba(124,106,247,.2)" stroke="#7c6af7" stroke-width="1.4"/>
    <rect x="42" y="44" width="22" height="14" fill="rgba(0,184,148,.2)" stroke="#10b981" stroke-width="1.4"/>
  </svg>`;
}

function svgSegmentTree() {
  const W = 460, H = 280;
  const nodes = {
    1: { v: '[0..7]\n36', x: 230, y: 50 },
    2: { v: '[0..3]\n10', x: 130, y: 110 },
    3: { v: '[4..7]\n26', x: 330, y: 110 },
    4: { v: '[0..1]\n3',  x: 80,  y: 175 },
    5: { v: '[2..3]\n7',  x: 180, y: 175 },
    6: { v: '[4..5]\n11', x: 280, y: 175 },
    7: { v: '[6..7]\n15', x: 380, y: 175 },
  };
  const edges = [[1,2],[1,3],[2,4],[2,5],[3,6],[3,7]];
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  edges.forEach(([a,b]) => h += `<line x1="${nodes[a].x}" y1="${nodes[a].y+18}" x2="${nodes[b].x}" y2="${nodes[b].y-18}" stroke="#4aa6ff" stroke-width="1.5"/>`);
  Object.values(nodes).forEach(n => {
    const lines = n.v.split('\n');
    h += `<rect x="${n.x-32}" y="${n.y-18}" width="64" height="36" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1.5" rx="4"/>`;
    h += `<text x="${n.x}" y="${n.y-2}" font-size="9" fill="#888" text-anchor="middle" font-family="monospace">${lines[0]}</text>`;
    h += `<text x="${n.x}" y="${n.y+12}" font-size="13" fill="#4aa6ff" text-anchor="middle" font-family="monospace" font-weight="700">${lines[1]}</text>`;
  });
  h += `<text x="${W/2}" y="240" font-size="11" fill="#888" text-anchor="middle">each node stores aggregate (sum here) over its range</text>`;
  h += `<text x="${W/2}" y="258" font-size="11" fill="#888" text-anchor="middle">range query and point update both O(log n)</text>`;
  return h + `</svg>`;
}
function svgSegmentTreeMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <line x1="50" y1="18" x2="32" y2="40" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="50" y1="18" x2="68" y2="40" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="32" y1="40" x2="20" y2="58" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="32" y1="40" x2="44" y2="58" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="68" y1="40" x2="56" y2="58" stroke="#4aa6ff" stroke-width="1"/>
    <line x1="68" y1="40" x2="80" y2="58" stroke="#4aa6ff" stroke-width="1"/>
    <rect x="42" y="12" width="16" height="10" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>
    <rect x="24" y="34" width="16" height="10" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>
    <rect x="60" y="34" width="16" height="10" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>
    <rect x="12" y="52" width="14" height="10" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>
    <rect x="36" y="52" width="14" height="10" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>
    <rect x="48" y="52" width="14" height="10" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>
    <rect x="72" y="52" width="14" height="10" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>
  </svg>`;
}

function svgKMP() {
  const W = 460, H = 280;
  const pattern = ['a','b','a','b','c'];
  const lps =     [ 0,  0,  1,  2,  0 ];
  const cellW = 50, cellH = 44, startX = (W - pattern.length * cellW) / 2;
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  pattern.forEach((c, i) => {
    const x = startX + i * cellW;
    h += `<rect x="${x}" y="80" width="${cellW}" height="${cellH}" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1.5"/>`;
    h += `<text x="${x+cellW/2}" y="${108}" font-size="16" fill="#e8e8e8" text-anchor="middle" font-family="monospace" font-weight="700">${c}</text>`;
    h += `<rect x="${x}" y="140" width="${cellW}" height="${cellH}" fill="rgba(124,106,247,.12)" stroke="var(--accent)" stroke-width="1.5"/>`;
    h += `<text x="${x+cellW/2}" y="${168}" font-size="14" fill="var(--accent)" text-anchor="middle" font-family="monospace" font-weight="700">${lps[i]}</text>`;
  });
  h += `<text x="${startX-12}" y="108" font-size="12" fill="#888" text-anchor="end" font-family="monospace">P:</text>`;
  h += `<text x="${startX-12}" y="168" font-size="12" fill="#888" text-anchor="end" font-family="monospace">LPS:</text>`;
  h += `<text x="${W/2}" y="60" font-size="12" fill="#888" text-anchor="middle">pattern P = "ababc"</text>`;
  h += `<text x="${W/2}" y="220" font-size="11" fill="#888" text-anchor="middle">LPS[i] = longest proper prefix of P[0..i] that is also a suffix</text>`;
  h += `<text x="${W/2}" y="240" font-size="11" fill="#888" text-anchor="middle">on mismatch at j, jump to LPS[j−1] — text never rewinds</text>`;
  return h + `</svg>`;
}
function svgKMPMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    ${[0,1,2,3].map(i => `<rect x="${14 + i*18}" y="14" width="14" height="14" fill="#1a1a1a" stroke="#4aa6ff" stroke-width="1"/>`).join('')}
    ${[0,1,2,3].map(i => `<rect x="${14 + i*18}" y="32" width="14" height="14" fill="rgba(124,106,247,.15)" stroke="#7c6af7" stroke-width="1"/>`).join('')}
    ${['0','0','1','2'].map((v, i) => `<text x="${21+i*18}" y="42" font-size="9" fill="#7c6af7" text-anchor="middle" font-family="monospace" font-weight="700">${v}</text>`).join('')}
    <text x="50" y="60" font-size="9" fill="#888" text-anchor="middle">LPS</text>
  </svg>`;
}

function svgLineSweep() {
  const W = 460, H = 280;
  const events = [
    { t: 1, kind: '+1', y: 90 },
    { t: 3, kind: '+1', y: 90 },
    { t: 5, kind: '−1', y: 90 },
    { t: 7, kind: '+1', y: 90 },
    { t: 8, kind: '−1', y: 90 },
    { t: 10,kind: '−1', y: 90 },
  ];
  const tlStart = 60, tlEnd = 410, tlY = 200, xMax = 11;
  const px = (t) => tlStart + (t / xMax) * (tlEnd - tlStart);
  let h = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;
  // Timeline
  h += `<line x1="${tlStart}" y1="${tlY}" x2="${tlEnd}" y2="${tlY}" stroke="#666" stroke-width="1"/>`;
  for (let t = 0; t <= xMax; t++) {
    const x = px(t);
    h += `<line x1="${x}" y1="${tlY-3}" x2="${x}" y2="${tlY+3}" stroke="#666"/>`;
    if (t % 2 === 0) h += `<text x="${x}" y="${tlY+16}" font-size="9" fill="#666" text-anchor="middle">${t}</text>`;
  }
  events.forEach(e => {
    const isPlus = e.kind === '+1';
    const color = isPlus ? 'var(--easy)' : 'var(--hard)';
    h += `<line x1="${px(e.t)}" y1="${e.y}" x2="${px(e.t)}" y2="${tlY}" stroke="${color}" stroke-width="1.5" stroke-dasharray="3 2"/>`;
    h += `<rect x="${px(e.t)-14}" y="${e.y-14}" width="28" height="22" fill="${isPlus?'rgba(0,184,148,.2)':'rgba(225,112,85,.2)'}" stroke="${color}" stroke-width="1.5" rx="4"/>`;
    h += `<text x="${px(e.t)}" y="${e.y+1}" font-size="11" fill="${color}" text-anchor="middle" font-family="monospace" font-weight="700">${e.kind}</text>`;
  });
  h += `<text x="${W/2}" y="60" font-size="12" fill="var(--medium)" text-anchor="middle" font-weight="600">events sorted by time, swept left to right</text>`;
  h += `<text x="${W/2}" y="240" font-size="11" fill="#888" text-anchor="middle">running counter = active intervals at each moment</text>`;
  h += `<text x="${W/2}" y="258" font-size="11" fill="#888" text-anchor="middle">peak = answer for "max concurrent"</text>`;
  return h + `</svg>`;
}
function svgLineSweepMini() {
  return `<svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="50" x2="90" y2="50" stroke="#666" stroke-width="0.8"/>
    <rect x="20" y="32" width="14" height="12" fill="rgba(0,184,148,.2)" stroke="#10b981" stroke-width="1" rx="2"/>
    <rect x="44" y="20" width="14" height="12" fill="rgba(0,184,148,.2)" stroke="#10b981" stroke-width="1" rx="2"/>
    <rect x="66" y="32" width="14" height="12" fill="rgba(225,112,85,.2)" stroke="#e17055" stroke-width="1" rx="2"/>
    <text x="27" y="42" font-size="8" fill="#10b981" text-anchor="middle" font-weight="700">+1</text>
    <text x="51" y="30" font-size="8" fill="#10b981" text-anchor="middle" font-weight="700">+1</text>
    <text x="73" y="42" font-size="8" fill="#e17055" text-anchor="middle" font-weight="700">−1</text>
  </svg>`;
}

const SVGS = {
  svgMonotonicDeque, svgMonotonicDequeMini,
  svgSegmentTree, svgSegmentTreeMini,
  svgKMP, svgKMPMini,
  svgLineSweep, svgLineSweepMini,
  svgBigOCurves, svgBigOMini, svgSortingComparison, svgSortingMini,
  svgHashMap, svgHashMapMini, svgTwoPointers, svgTwoPointersMini,
  svgSlidingWindow, svgSlidingWindowMini,
  svgRecursion, svgRecursionMini, svgBitManip, svgBitManipMini,
  svgArrays, svgArraysMini, svgStrings, svgStringsMini,
  svgLinkedList, svgLinkedListMini, svgStackQueue, svgStackQueueMini,
  svgTree, svgTreeMini, svgHeap, svgHeapMini, svgGraph, svgGraphMini,
  svgMatrix, svgMatrixMini, svgIntervals, svgIntervalsMini,
  svgBinarySearch, svgBinarySearchMini, svgBfsDfs, svgBfsDfsMini,
  svgBacktracking, svgBacktrackingMini, svgDP, svgDPMini,
  svgGreedy, svgGreedyMini,
};

