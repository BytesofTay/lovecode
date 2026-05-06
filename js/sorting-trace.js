// ── Sort tracers ────────────────────────────────────────────────────────────
// Each tracer emits a state per "interesting moment" of the algorithm.
// State shape: { a, desc, compare?, swap?, sorted?, pivot?, range?, h? }
// - compare: indices being compared this step (yellow)
// - swap: indices being swapped this step (purple)
// - sorted: indices fixed in their final position (green, persists across states)
// - pivot: single index (orange)
// - range: [lo, hi] active sub-array (slight tint)
// - h: legacy generic highlight (used as a fallback if nothing else is set)
const TRACE_SAMPLE = [5, 2, 8, 1, 9, 3];

function pushState(states, base, override) {
  states.push(Object.assign({ compare: [], swap: [], sorted: [], pivot: null, range: null, h: [] }, base, override));
}

function traceInsertion(input) {
  const a = [...input];
  const sorted = new Set();
  const states = [];
  pushState(states, { a: [...a], desc: 'Initial array. Element 0 is "sorted" by default (a single element).', sorted: [0] }, {});
  sorted.add(0);
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    pushState(states, { a: [...a], desc: `i=${i}: pick key=${key}. Scan left to find its insertion spot.`, compare: [i], sorted: [...sorted] });
    while (j >= 0 && a[j] > key) {
      pushState(states, { a: [...a], desc: `Compare key=${key} with a[${j}]=${a[j]} → bigger; shift right.`, compare: [j, j + 1], sorted: [...sorted] });
      a[j + 1] = a[j];
      pushState(states, { a: [...a], desc: `Shifted a[${j}] → a[${j+1}].`, swap: [j, j + 1], sorted: [...sorted] });
      j--;
    }
    a[j + 1] = key;
    sorted.add(i);
    pushState(states, { a: [...a], desc: `Insert key=${key} at index ${j+1}. Indices 0..${i} are now sorted.`, sorted: [...sorted] });
  }
  pushState(states, { a: [...a], desc: '✓ Sorted', sorted: a.map((_, i) => i) });
  return states;
}

function traceSelection(input) {
  const a = [...input];
  const sorted = new Set();
  const states = [];
  pushState(states, { a: [...a], desc: 'Initial array. We\'ll find the min on each pass and swap it to the front.' });
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    pushState(states, { a: [...a], desc: `Pass ${i+1}: find min in arr[${i}..${a.length-1}]. Tentative min: index ${minIdx} (${a[minIdx]}).`, compare: [minIdx], sorted: [...sorted], range: [i, a.length - 1] });
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) {
        minIdx = j;
        pushState(states, { a: [...a], desc: `New min: index ${j} (${a[j]}).`, compare: [minIdx], sorted: [...sorted], range: [i, a.length - 1] });
      } else {
        pushState(states, { a: [...a], desc: `Compare a[${j}]=${a[j]} ≥ current min ${a[minIdx]}; no change.`, compare: [j, minIdx], sorted: [...sorted], range: [i, a.length - 1] });
      }
    }
    if (minIdx !== i) {
      pushState(states, { a: [...a], desc: `Swap min into position ${i}.`, swap: [i, minIdx], sorted: [...sorted], range: [i, a.length - 1] });
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
    sorted.add(i);
    pushState(states, { a: [...a], desc: `Index ${i} is now in its final position.`, sorted: [...sorted] });
  }
  sorted.add(a.length - 1);
  pushState(states, { a: [...a], desc: '✓ Sorted', sorted: a.map((_, i) => i) });
  return states;
}

function traceMerge(input) {
  const a = [...input];
  const states = [];
  pushState(states, { a: [...a], desc: 'Initial array. Merge sort splits into halves recursively, then merges sorted pieces.' });
  function rec(lo, hi) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    pushState(states, { a: [...a], desc: `Split [${lo}..${hi}] at mid=${mid}. Recurse on left half [${lo}..${mid}].`, range: [lo, mid] });
    rec(lo, mid);
    pushState(states, { a: [...a], desc: `Left half done. Recurse on right half [${mid+1}..${hi}].`, range: [mid + 1, hi] });
    rec(mid + 1, hi);
    const L = a.slice(lo, mid + 1), R = a.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    pushState(states, { a: [...a], desc: `Merge sorted halves [${lo}..${mid}] and [${mid+1}..${hi}].`, range: [lo, hi] });
    while (i < L.length && j < R.length) {
      if (L[i] <= R[j]) {
        a[k] = L[i++];
      } else {
        a[k] = R[j++];
      }
      pushState(states, { a: [...a], desc: `Place ${a[k]} into position ${k} during merge.`, swap: [k], range: [lo, hi] });
      k++;
    }
    while (i < L.length) {
      a[k] = L[i++];
      pushState(states, { a: [...a], desc: `Drain remaining left half: place ${a[k]} at ${k}.`, swap: [k], range: [lo, hi] });
      k++;
    }
    while (j < R.length) {
      a[k] = R[j++];
      pushState(states, { a: [...a], desc: `Drain remaining right half: place ${a[k]} at ${k}.`, swap: [k], range: [lo, hi] });
      k++;
    }
    pushState(states, { a: [...a], desc: `Subarray [${lo}..${hi}] is now sorted.`, range: [lo, hi] });
  }
  rec(0, a.length - 1);
  pushState(states, { a: [...a], desc: '✓ Sorted', sorted: a.map((_, i) => i) });
  return states;
}

function traceQuick(input) {
  const a = [...input];
  const sorted = new Set();
  const states = [];
  pushState(states, { a: [...a], desc: 'Initial array. Quick sort partitions around a pivot, then recurses on both sides.' });
  function partition(lo, hi) {
    const pivot = a[hi];
    pushState(states, { a: [...a], desc: `Partition [${lo}..${hi}]. Pivot = a[${hi}] = ${pivot}.`, pivot: hi, range: [lo, hi], sorted: [...sorted] });
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          pushState(states, { a: [...a], desc: `a[${j}]=${a[j]} ≤ pivot=${pivot}. Swap to position ${i}.`, swap: [i, j], pivot: hi, range: [lo, hi], sorted: [...sorted] });
          [a[i], a[j]] = [a[j], a[i]];
        }
      } else {
        pushState(states, { a: [...a], desc: `a[${j}]=${a[j]} > pivot=${pivot}. Skip.`, compare: [j, hi], pivot: hi, range: [lo, hi], sorted: [...sorted] });
      }
    }
    pushState(states, { a: [...a], desc: `Place pivot ${pivot} at its final position ${i+1}.`, swap: [i + 1, hi], range: [lo, hi], sorted: [...sorted] });
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    sorted.add(i + 1);
    pushState(states, { a: [...a], desc: `Pivot ${pivot} is now in its final position. Recurse on left and right.`, sorted: [...sorted] });
    return i + 1;
  }
  function rec(lo, hi) {
    if (lo < hi) {
      const p = partition(lo, hi);
      rec(lo, p - 1);
      rec(p + 1, hi);
    } else if (lo === hi) {
      sorted.add(lo);
    }
  }
  rec(0, a.length - 1);
  pushState(states, { a: [...a], desc: '✓ Sorted', sorted: a.map((_, i) => i) });
  return states;
}

function traceHeap(input) {
  const a = [...input];
  const sorted = new Set();
  const states = [];
  pushState(states, { a: [...a], desc: 'Initial array. Heap sort builds a max-heap, then extracts the max repeatedly.' });
  const n = a.length;
  function heapify(size, i) {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      pushState(states, { a: [...a], desc: `Heapify at ${i}: swap with child at ${largest}.`, swap: [i, largest], range: [0, size - 1], sorted: [...sorted] });
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(size, largest);
    }
  }
  pushState(states, { a: [...a], desc: 'Build max-heap by heapifying from the bottom up.', range: [0, n - 1] });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  pushState(states, { a: [...a], desc: 'Max-heap built. Now repeatedly swap root → last and shrink heap.', range: [0, n - 1] });
  for (let i = n - 1; i > 0; i--) {
    pushState(states, { a: [...a], desc: `Swap max (root, a[0]=${a[0]}) with a[${i}]. That position is now sorted.`, swap: [0, i], range: [0, i], sorted: [...sorted] });
    [a[0], a[i]] = [a[i], a[0]];
    sorted.add(i);
    heapify(i, 0);
    pushState(states, { a: [...a], desc: `Heap shrunk to ${i} elements. Re-heapify root.`, range: [0, i - 1], sorted: [...sorted] });
  }
  sorted.add(0);
  pushState(states, { a: [...a], desc: '✓ Sorted', sorted: a.map((_, i) => i) });
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

function classForCell(s, i) {
  const sortedSet = new Set(s.sorted || []);
  const cls = ['trace-bar'];
  if (sortedSet.has(i)) cls.push('sorted');
  if ((s.swap || []).includes(i)) cls.push('swap');
  if ((s.compare || []).includes(i)) cls.push('compare');
  if (s.pivot === i) cls.push('pivot');
  if (s.range && i >= s.range[0] && i <= s.range[1]) cls.push('in-range');
  if ((s.h || []).includes(i) && cls.length === 1) cls.push('highlight');
  return cls.join(' ');
}

function traceHtml() {
  if (!traceStates.length) return '';
  const s = traceStates[traceIdx];
  const max = Math.max(...s.a, 1);
  const bars = s.a.map((v, i) => {
    const heightPct = Math.max(8, (v / max) * 100);
    return `<div class="trace-bar-wrap">
      <div class="${classForCell(s, i)}" style="height:${heightPct}%">
        <span class="trace-bar-label">${v}</span>
      </div>
      <div class="trace-bar-idx">${i}</div>
    </div>`;
  }).join('');
  // Step categorization for the pill
  let stepKind = 'step';
  if ((s.swap || []).length) stepKind = 'swap';
  else if ((s.compare || []).length) stepKind = 'compare';
  else if (s.pivot !== null) stepKind = 'pivot';
  return `
    <h3>Step Through · sample [${TRACE_SAMPLE.join(', ')}]</h3>
    <div class="trace-step-counter">
      <span class="trace-step-pill kind-${stepKind}">${stepKind.toUpperCase()}</span>
      <span>Step ${traceIdx + 1} of ${traceStates.length}</span>
    </div>
    <div class="trace-desc">${s.desc}</div>
    <div class="trace-bars">${bars}</div>
    <div class="trace-legend">
      <span class="lg compare">Comparing</span>
      <span class="lg swap">Swapping / placing</span>
      <span class="lg pivot">Pivot</span>
      <span class="lg sorted">Sorted (final)</span>
      <span class="lg in-range">Active subarray</span>
    </div>
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
