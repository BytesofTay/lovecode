// ── REFERENCE_CODE — canonical Python solution per problem ID ──────────────
// Builds a `problemId → Python code string` map at load time by merging four
// sources already in the repo (no new content authoring required):
//
//   1. PROBLEM_CONTENT[id].optimalCode    — hand-authored, highest quality
//   2. GUIDED_BUILDS[].finalCode          — 6 Guided Builds with clean Python
//   3. SNIPPET_CHALLENGES[].code          — fill-in-the-blank, un-blanked
//                                            using each blank's canonical answer
//   4. LEARNING_TOPICS topic.examples[]   — `code` strings keyed by problemId
//
// Earlier sources win. Problems missing from all four return null — the
// Solution submode falls back to the prose `approach` from SOLUTIONS.

const REFERENCE_CODE = (function buildReferenceCode() {
  const out = {};

  // Source 5 (lowest priority — manual solutions for problems with no other source)
  if (typeof MANUAL_SOLUTIONS !== 'undefined') {
    for (const [id, code] of Object.entries(MANUAL_SOLUTIONS)) {
      out[parseInt(id)] = code;
    }
  }

  // Source 4 (overrides manual solutions where learning-topic examples exist)
  if (typeof LEARNING_TOPICS !== 'undefined') {
    for (const topic of LEARNING_TOPICS) {
      for (const ex of topic.examples || []) {
        if (ex.problemId && ex.code && !out[ex.problemId]) {
          out[ex.problemId] = ex.code;
        }
      }
    }
  }

  // Source 3 — snippets with placeholder substitution
  if (typeof SNIPPET_CHALLENGES !== 'undefined' && typeof PROBLEMS !== 'undefined') {
    // Build a name → problemId map. Snippet `problem` field sometimes appends
    // a parenthetical (e.g. "Maximum Subarray (Kadane's)") — normalize on the
    // base name by stripping trailing " (...)".
    const nameToId = {};
    for (const p of PROBLEMS) nameToId[p.name.toLowerCase()] = p.id;
    const stripParen = (s) => s.replace(/\s*\([^)]*\)\s*$/, '').toLowerCase();

    for (const sn of SNIPPET_CHALLENGES) {
      const id = nameToId[sn.problem.toLowerCase()] || nameToId[stripParen(sn.problem)];
      if (!id || out[id]) continue;  // skip unknown problems and already-set
      let code = sn.code;
      (sn.blanks || []).forEach((b, i) => {
        const answer = b.options[b.answerIdx];
        code = code.replace(new RegExp(`\\{\\{B${i + 1}\\}\\}`, 'g'), answer);
      });
      out[id] = code;
    }
  }

  // Source 2 — guided builds (overwrite snippets where present)
  if (typeof GUIDED_BUILDS !== 'undefined' && typeof PROBLEMS !== 'undefined') {
    const nameToId = {};
    for (const p of PROBLEMS) nameToId[p.name.toLowerCase()] = p.id;
    for (const g of GUIDED_BUILDS) {
      const id = nameToId[g.problem.toLowerCase()];
      if (id && g.finalCode) out[id] = g.finalCode;
    }
  }

  // Source 1 — hand-authored optimal code (always wins)
  if (typeof PROBLEM_CONTENT !== 'undefined') {
    for (const [id, content] of Object.entries(PROBLEM_CONTENT)) {
      if (content.optimalCode) out[id] = content.optimalCode;
    }
  }

  return out;
})();
