// ── Standalone Indentation Help tab ─────────────────────────────────────────
// A dedicated page for the same rules embedded next to each code textarea,
// plus a live sandbox where new coders can practice indentation without the
// pressure of an actual problem.

function renderIndentationMode() {
  document.getElementById('appMain').innerHTML = `
    <div class="indent-mode-wrap">
      <div class="indent-mode-header">
        <h2>⌨️ Python Indentation</h2>
        <p class="indent-mode-sub">Python uses indentation — not braces — to mark code blocks. These rules cover ~95% of beginner mistakes. The sandbox below lets you practice; <kbd>Tab</kbd> inserts 4 spaces and <kbd>Enter</kbd> auto-indents.</p>
      </div>

      <div class="indent-mode-grid">
        <section class="indent-card">
          <h3>1. Indent after a colon</h3>
          <p>Every line ending in <code>:</code> opens a new block. Anything inside the block must be indented further than the opening line.</p>
          <p>Triggers: <code>def</code>, <code>class</code>, <code>if</code>, <code>elif</code>, <code>else</code>, <code>for</code>, <code>while</code>, <code>try</code>, <code>except</code>, <code>finally</code>, <code>with</code>.</p>
          <pre>def greet(name):
    print(f"Hello, {name}")     ← inside the function (indented)
print("bye")                     ← outside again (back at level 0)</pre>
        </section>

        <section class="indent-card">
          <h3>2. Use 4 spaces. Never mix tabs and spaces</h3>
          <p>The Python community standard (PEP 8) is <strong>4 spaces per level</strong>. Mixing tabs and spaces in the same file is the #1 cause of mysterious <code>IndentationError: inconsistent use of tabs and spaces</code> messages.</p>
          <p>In this app's editors: <kbd>Tab</kbd> always inserts spaces. <kbd>Shift+Tab</kbd> outdents.</p>
        </section>

        <section class="indent-card">
          <h3>3. Same block = same indent</h3>
          <p>All "sibling" statements in a block use the exact same leading whitespace. To leave the block, dedent back to the level of the opening line.</p>
          <pre>def f():
    a = 1            ← level 1
    b = 2            ← level 1 (sibling of a)
    if a < b:
        print("yes") ← level 2 (inside the if)
        print("ok")  ← level 2 (sibling)
    return b         ← back to level 1</pre>
        </section>

        <section class="indent-card">
          <h3>4. Hitting Enter continues the indent</h3>
          <p>Most code editors (this one included) keep the indentation of the previous line on a new line. If that previous line ended in <code>:</code>, the editor adds 4 more spaces — landing your cursor inside the new block automatically.</p>
          <p>You almost never have to count spaces manually. Just press <kbd>Enter</kbd>.</p>
        </section>

        <section class="indent-card">
          <h3>5. Reading the error messages</h3>
          <ul>
            <li><strong><code>IndentationError: expected an indented block</code></strong> — you wrote a line ending in <code>:</code> but didn't indent the next line.</li>
            <li><strong><code>IndentationError: unexpected indent</code></strong> — a line has extra leading spaces with no colon trigger above it.</li>
            <li><strong><code>IndentationError: unindent does not match any outer indentation level</code></strong> — your dedent doesn't line up with any earlier level. You went from 8 spaces back to 2, but there was no line at 2.</li>
            <li><strong><code>TabError: inconsistent use of tabs and spaces</code></strong> — you have both tabs and spaces in the same indentation. Fix: configure your editor to convert all tabs to spaces.</li>
          </ul>
        </section>

        <section class="indent-card">
          <h3>6. The "implicit colon" trap</h3>
          <p>Multi-line expressions inside parentheses, brackets, or braces don't need indentation rules — Python knows they continue:</p>
          <pre>nums = [
    1, 2, 3,
    4, 5, 6,    ← any indent is fine inside [ ]
]</pre>
          <p>But anywhere outside of bracketed expressions, indentation matters.</p>
        </section>
      </div>

      <div class="indent-sandbox">
        <h3>🧪 Practice Sandbox</h3>
        <p class="indent-sandbox-sub">Type any Python here. <kbd>Tab</kbd> inserts 4 spaces; <kbd>Enter</kbd> auto-indents. Click <strong>Check Indentation</strong> to scan for common issues without running the code.</p>
        <textarea id="indentSandbox" class="indent-sandbox-textarea code-input" onkeydown="handleCodeKey(event)" spellcheck="false" placeholder="def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []"></textarea>
        <div class="indent-sandbox-actions">
          <button class="btn btn-primary" onclick="checkSandboxIndentation()">🔍 Check Indentation</button>
          <button class="btn btn-ghost" onclick="document.getElementById('indentSandbox').value=''; document.getElementById('indentSandboxOut').innerHTML='';">↺ Clear</button>
        </div>
        <div id="indentSandboxOut" class="indent-sandbox-out"></div>
      </div>
    </div>`;
}

// Linter for the sandbox — pure static analysis, no execution.
// Catches the most common beginner indentation mistakes:
//   • tabs mixed with spaces in leading whitespace
//   • indent level that does not match any previously-seen indent level
//   • a line ending in `:` followed by a non-indented (or empty) line
//   • leading whitespace that is not a multiple of 4
function checkSandboxIndentation() {
  const out = document.getElementById('indentSandboxOut');
  const ta = document.getElementById('indentSandbox');
  const text = ta.value;
  if (!text.trim()) {
    out.innerHTML = `<div class="indent-msg info">Type some code first, then click Check.</div>`;
    return;
  }
  const lines = text.split('\n');
  const issues = [];
  const indentStack = [0];
  let prevEndsColon = false;
  let prevWasBlank = false;
  let prevNonBlankLineNo = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.replace(/\s+$/, '');
    const lead = (stripped.match(/^[\t ]*/) || [''])[0];
    const body = stripped.slice(lead.length);
    const lineNo = i + 1;
    if (!body.length) {
      prevWasBlank = true;
      continue;
    }
    if (lead.includes('\t') && lead.includes(' ')) {
      issues.push({ line: lineNo, type: 'mix', msg: `Line ${lineNo}: mixes tabs and spaces in leading whitespace. Use only spaces.` });
    } else if (lead.includes('\t')) {
      issues.push({ line: lineNo, type: 'tab', msg: `Line ${lineNo}: uses tabs for indentation. Convert to 4 spaces.` });
    }
    const indent = lead.replace(/\t/g, '    ').length;
    if (indent % 4 !== 0) {
      issues.push({ line: lineNo, type: 'mod4', msg: `Line ${lineNo}: indented ${indent} space${indent === 1 ? '' : 's'} — not a multiple of 4. Pick 0, 4, 8, 12, …` });
    }
    if (prevEndsColon) {
      if (indent <= indentStack[indentStack.length - 1]) {
        issues.push({ line: lineNo, type: 'no-indent-after-colon', msg: `Line ${lineNo}: previous line ended in ":" but this line is not indented further. Expected an indented block.` });
      }
    }
    if (indent > indentStack[indentStack.length - 1]) {
      if (!prevEndsColon) {
        issues.push({ line: lineNo, type: 'unexpected-indent', msg: `Line ${lineNo}: unexpected indent. The line above doesn't end in ":" — nothing opened a new block.` });
      }
      indentStack.push(indent);
    } else {
      while (indentStack.length > 1 && indentStack[indentStack.length - 1] > indent) {
        indentStack.pop();
      }
      if (indentStack[indentStack.length - 1] !== indent) {
        issues.push({ line: lineNo, type: 'dedent-mismatch', msg: `Line ${lineNo}: dedent does not match any earlier indentation level. You went to ${indent} spaces but no outer line uses that level.` });
      }
    }
    prevEndsColon = /:\s*(#.*)?$/.test(body);
    prevWasBlank = false;
    prevNonBlankLineNo = lineNo;
  }
  if (!issues.length) {
    out.innerHTML = `<div class="indent-msg ok">✓ No indentation problems detected. The structure looks consistent.</div>`;
    return;
  }
  // De-dup messages by (line, type)
  const seen = new Set();
  const unique = [];
  for (const it of issues) {
    const k = it.line + '|' + it.type;
    if (seen.has(k)) continue;
    seen.add(k);
    unique.push(it);
  }
  out.innerHTML = `<div class="indent-msg warn">Found ${unique.length} potential issue${unique.length === 1 ? '' : 's'}:</div>` +
    unique.map(it => `<div class="indent-issue">${it.msg}</div>`).join('');
}
