// ── Sort tracers ────────────────────────────────────────────────────────────
const TRACE_SAMPLE = [5, 2, 8, 1, 9, 3];

function traceInsertion(input) {
  const a = [...input];
  const states = [{ a: [...a], h: [], desc: 'Initial array' }];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    states.push({ a: [...a], h: [i], desc: `i=${i}: pick key=${key}, scan left for insert spot` });
    while (j >= 0 && a[j] > key) { a[j+1] = a[j]; j--; }
    a[j+1] = key;
    states.push({ a: [...a], h: [j+1], desc: `Insert ${key} at index ${j+1}` });
  }
  states.push({ a: [...a], h: [], desc: '✓ Sorted' });
  return states;
}

function traceSelection(input) {
  const a = [...input];
  const states = [{ a: [...a], h: [], desc: 'Initial array' }];
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i+1; j < a.length; j++) if (a[j] < a[minIdx]) minIdx = j;
    states.push({ a: [...a], h: [minIdx], desc: `Pass ${i+1}: min in arr[${i}..] is ${a[minIdx]} at index ${minIdx}` });
    if (minIdx !== i) [a[i], a[minIdx]] = [a[minIdx], a[i]];
    states.push({ a: [...a], h: [i], desc: `Swap into position ${i}` });
  }
  states.push({ a: [...a], h: [], desc: '✓ Sorted' });
  return states;
}

function traceMerge(input) {
  const a = [...input];
  const states = [{ a: [...a], h: [], desc: 'Initial array' }];
  function rec(lo, hi) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    rec(lo, mid);
    rec(mid + 1, hi);
    const L = a.slice(lo, mid + 1), R = a.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    while (i < L.length && j < R.length) a[k++] = L[i] <= R[j] ? L[i++] : R[j++];
    while (i < L.length) a[k++] = L[i++];
    while (j < R.length) a[k++] = R[j++];
    const span = []; for (let x = lo; x <= hi; x++) span.push(x);
    states.push({ a: [...a], h: span, desc: `Merge subarray [${lo}..${hi}]` });
  }
  rec(0, a.length - 1);
  states.push({ a: [...a], h: [], desc: '✓ Sorted' });
  return states;
}

function traceQuick(input) {
  const a = [...input];
  const states = [{ a: [...a], h: [], desc: 'Initial array' }];
  function partition(lo, hi) {
    const pivot = a[hi];
    states.push({ a: [...a], h: [hi], desc: `Partition [${lo}..${hi}], pivot=${pivot}` });
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      if (a[j] <= pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; }
    }
    [a[i+1], a[hi]] = [a[hi], a[i+1]];
    states.push({ a: [...a], h: [i+1], desc: `Pivot ${pivot} placed at final index ${i+1}` });
    return i + 1;
  }
  function rec(lo, hi) {
    if (lo < hi) { const p = partition(lo, hi); rec(lo, p-1); rec(p+1, hi); }
  }
  rec(0, a.length - 1);
  states.push({ a: [...a], h: [], desc: '✓ Sorted' });
  return states;
}

function traceHeap(input) {
  const a = [...input];
  const states = [{ a: [...a], h: [], desc: 'Initial array' }];
  const n = a.length;
  function heapify(size, i) {
    let largest = i;
    const l = 2*i + 1, r = 2*i + 2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest !== i) { [a[i], a[largest]] = [a[largest], a[i]]; heapify(size, largest); }
  }
  for (let i = Math.floor(n/2) - 1; i >= 0; i--) heapify(n, i);
  states.push({ a: [...a], h: [], desc: 'Built max-heap' });
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    heapify(i, 0);
    states.push({ a: [...a], h: [i], desc: `Extract max → arr[${i}]; heapify remaining ${i} elements` });
  }
  states.push({ a: [...a], h: [], desc: '✓ Sorted' });
  return states;
}

const TRACERS = { merge: traceMerge, quick: traceQuick, heap: traceHeap, insertion: traceInsertion, selection: traceSelection };
// traceStates / traceIdx live in js/state.js

function initTrace(algoId) {
  traceStates = TRACERS[algoId](TRACE_SAMPLE);
  traceIdx = 0;
}

function traceNext() { if (traceIdx < traceStates.length - 1) { traceIdx++; updateTraceDOM(); } }
function tracePrev() { if (traceIdx > 0) { traceIdx--; updateTraceDOM(); } }
function traceReset() { traceIdx = 0; updateTraceDOM(); }

function traceHtml() {
  if (!traceStates.length) return '';
  const s = traceStates[traceIdx];
  const cells = s.a.map((v, i) => `<div class="trace-cell ${s.h.includes(i) ? 'h-pivot' : ''}">${v}</div>`).join('');
  return `
    <h3>Step Through · sample [${TRACE_SAMPLE.join(', ')}]</h3>
    <div class="trace-desc">${s.desc}</div>
    <div class="trace-step-counter">Step ${traceIdx + 1} of ${traceStates.length}</div>
    <div class="trace-array">${cells}</div>
    <div class="trace-controls">
      <button class="btn btn-ghost" onclick="traceReset()">↺ Reset</button>
      <button class="btn btn-ghost" onclick="tracePrev()" ${traceIdx === 0 ? 'disabled' : ''}>← Prev</button>
      <button class="btn btn-primary" onclick="traceNext()" ${traceIdx === traceStates.length - 1 ? 'disabled' : ''}>Next →</button>
    </div>`;
}

function updateTraceDOM() {
  const el = document.getElementById('traceSection');
  if (el) el.innerHTML = traceHtml();
}

