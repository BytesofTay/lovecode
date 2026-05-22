// ── Small shared helpers ───────────────────────────────────────────────────

// API
function api(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(e => console.error(url, e));
}

// Formatting
function fmt(s) {
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}
function lcUrl(slug) { return `https://leetcode.com/problems/${slug}/`; }
function ytUrl(p) {
  return p.youtubeUrl || `https://www.youtube.com/results?search_query=neetcode+leetcode+${encodeURIComponent(p.name)}`;
}
function getAttempts(id) { return (problemData[id] || {}).attempts || []; }
function getNote(id) { return (problemData[id] || {}).notes || ''; }

// Shuffle helpers
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function shuffleCopy(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Code-input helpers ────────────────────────────────────────────────────
// Smart indentation for code textareas. Wire via onkeydown="handleCodeKey(event)".
// Behaviors:
//   • Tab inserts 4 spaces (Shift+Tab outdents up to 4 leading spaces on the current line).
//   • Enter preserves the current line's leading indentation; if the line ends in ':',
//     adds one extra level (4 more spaces) — perfect for `def`, `if`, `for`, etc.
function handleCodeKey(e) {
  const ta = e.target;
  if (!ta || ta.tagName !== 'TEXTAREA') return;
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = ta.selectionStart, end = ta.selectionEnd;
    const value = ta.value;
    if (e.shiftKey) {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineText = value.slice(lineStart, start);
      const stripLen = Math.min(4, lineText.match(/^ */)[0].length);
      if (stripLen > 0) {
        ta.value = value.slice(0, lineStart) + value.slice(lineStart + stripLen);
        ta.selectionStart = ta.selectionEnd = start - stripLen;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }
    ta.value = value.slice(0, start) + '    ' + value.slice(end);
    ta.selectionStart = ta.selectionEnd = start + 4;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }
  if (e.key === 'Enter') {
    const start = ta.selectionStart, end = ta.selectionEnd;
    const value = ta.value;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const currentLine = value.slice(lineStart, start);
    const indent = (currentLine.match(/^ */) || [''])[0];
    const trimmed = currentLine.trimEnd();
    const extra = trimmed.endsWith(':') ? '    ' : '';
    e.preventDefault();
    const insertion = '\n' + indent + extra;
    ta.value = value.slice(0, start) + insertion + value.slice(end);
    ta.selectionStart = ta.selectionEnd = start + insertion.length;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

// ── Indentation help panel (rendered as a collapsible info block) ──────────
// Drop the result of `indentationHelpHtml()` next to a code textarea to expose
// the same set of rules new Python coders trip over.
function indentationHelpHtml(uid) {
  uid = uid || 'global';
  const id = `indent-help-${uid}`;
  return `<div class="indent-help">
    <button class="btn btn-ghost btn-indent-toggle" onclick="toggleIndentHelp('${id}')">⌨️ Python indentation help</button>
    <div class="indent-help-box" id="${id}" hidden>
      <div class="indent-help-intro">Python uses indentation (not braces) to mark code blocks. These rules cover 95% of beginner mistakes.</div>
      <ol class="indent-help-rules">
        <li><strong>Indent after a colon.</strong> Every line ending in <code>:</code> opens a new block — <code>def</code>, <code>if</code>, <code>elif</code>, <code>else</code>, <code>for</code>, <code>while</code>, <code>class</code>, <code>try</code>, <code>except</code>. The next line must be indented further.</li>
        <li><strong>Pick 4 spaces. Never mix tabs and spaces.</strong> In this editor, <kbd>Tab</kbd> inserts 4 spaces automatically. <kbd>Shift+Tab</kbd> outdents.</li>
        <li><strong>Every line in a block uses the same indentation.</strong> If you indent the first statement 4 spaces, every sibling statement also gets 4 spaces. To exit the block, dedent back to the level of the opening line.</li>
        <li><strong>Hitting Enter auto-continues the indent.</strong> This editor preserves the current line's leading spaces. If the previous line ended in <code>:</code>, you get one extra level for free.</li>
        <li><strong>IndentationError vs SyntaxError.</strong> If Python complains about "expected an indented block," you wrote a line ending in <code>:</code> but didn't indent the next line. If it says "unexpected indent," a line has more leading spaces than the one above it without a colon trigger.</li>
      </ol>
      <div class="indent-help-example"><strong>Example:</strong><pre>def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []</pre>
      <div class="indent-help-caption">Level 0: <code>def</code>. Level 1 (4 sp): function body. Level 2 (8 sp): loop body. Level 3 (12 sp): if-body.</div>
      </div>
    </div>
  </div>`;
}
function toggleIndentHelp(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.hidden = !el.hidden;
}
