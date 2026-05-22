// ── Foundations tab — groups Big-O · Sorting · Indent under one top-nav slot ──
// Replaces three separate top-nav buttons with a single tab that exposes a
// 3-button submode toggle and delegates rendering to the original
// renderBigoMode / renderSortingMode / renderIndentationMode functions.
// No content is moved or rewritten — only the chrome around them.

let foundationsSubmode = 'bigo';  // 'bigo' | 'sorting' | 'indent'

function setFoundationsSubmode(mode) {
  foundationsSubmode = mode;
  renderFoundationsMode();
}

function renderFoundationsMode() {
  const m = document.getElementById('appMain');
  m.className = 'mode-foundations';
  // Render the submode chrome + a placeholder content slot the submode renderer
  // will then populate.
  m.innerHTML = `
    <div class="foundations-wrap">
      <div class="submode-toggle three-tab" style="max-width:560px;margin:0 auto 20px">
        <button class="submode-btn ${foundationsSubmode === 'bigo' ? 'active' : ''}" onclick="setFoundationsSubmode('bigo')">📊 Big-O</button>
        <button class="submode-btn ${foundationsSubmode === 'sorting' ? 'active' : ''}" onclick="setFoundationsSubmode('sorting')">🔢 Sorting</button>
        <button class="submode-btn ${foundationsSubmode === 'indent' ? 'active' : ''}" onclick="setFoundationsSubmode('indent')">⌨️ Indent</button>
      </div>
      <div id="foundationsBody"></div>
    </div>`;
  // The existing render functions write into #appMain — temporarily redirect by
  // swapping the appMain to point at the inner body, calling, then restoring.
  const realMain = document.getElementById('appMain');
  const body = document.getElementById('foundationsBody');
  // Each existing renderer does `document.getElementById('appMain').innerHTML = ...`.
  // Cheapest correct way to delegate without rewriting them: temporarily set
  // the body's id to 'appMain', call the renderer, then restore.
  const originalId = realMain.id;
  realMain.id = '__foundations_outer__';
  body.id = 'appMain';
  try {
    if (foundationsSubmode === 'bigo') renderBigoMode();
    else if (foundationsSubmode === 'sorting') renderSortingMode();
    else if (foundationsSubmode === 'indent') renderIndentationMode();
  } finally {
    body.id = 'foundationsBody';
    realMain.id = originalId;
  }
}
