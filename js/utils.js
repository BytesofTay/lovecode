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
