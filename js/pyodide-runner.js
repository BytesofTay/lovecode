// ── Pyodide runner for "Type it yourself" tests ─────────────────────────────
// Lazy-loads Pyodide (~6MB) on first Run click. Subsequent runs reuse the instance.

let _pyodideInstance = null;
let _pyodideLoading = null;

async function ensurePyodide(progressCallback) {
  if (_pyodideInstance) return _pyodideInstance;
  if (_pyodideLoading) return _pyodideLoading;
  _pyodideLoading = (async () => {
    if (progressCallback) progressCallback('Downloading Python runtime (~6MB)…');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
    document.head.appendChild(script);
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Pyodide from CDN'));
    });
    if (progressCallback) progressCallback('Initializing Python interpreter…');
    _pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
    });
    return _pyodideInstance;
  })();
  return _pyodideLoading;
}

async function runUserCode(userCode, funcName, testCases, compare) {
  const py = await ensurePyodide();
  const compareCheck = compare === 'set-of-sets'
    ? `_passed = sorted([sorted(x) for x in _actual]) == sorted([sorted(x) for x in _t['expected']])`
    : `_passed = _actual == _t['expected']`;
  const harness = `
import json, sys, traceback
# ── User code starts ──
${userCode}
# ── User code ends ──

_test_cases = ${JSON.stringify(testCases)}
_func = globals().get(${JSON.stringify(funcName)})
_results = []
if _func is None:
    _results.append({'passed': False, 'error': 'Function ' + ${JSON.stringify(funcName)} + ' is not defined in your code.'})
else:
    for _t in _test_cases:
        try:
            _args = _t['input']
            if isinstance(_args, list):
                _actual = _func(*_args)
            elif isinstance(_args, dict):
                _actual = _func(**_args)
            else:
                _actual = _func(_args)
            ${compareCheck}
            _results.append({
                'passed': bool(_passed),
                'input': _t['input'],
                'expected': _t['expected'],
                'actual': _actual
            })
        except Exception as _e:
            _results.append({
                'passed': False,
                'input': _t['input'],
                'expected': _t['expected'],
                'error': '%s: %s' % (type(_e).__name__, str(_e))
            })

print('___RESULTS_START___')
print(json.dumps(_results, default=str))
print('___RESULTS_END___')
`;
  let stdoutBuf = '';
  py.setStdout({ batched: (s) => { stdoutBuf += s + '\n'; } });
  try {
    await py.runPythonAsync(harness);
  } catch (e) {
    return { results: [], error: e.message || String(e) };
  }
  const start = stdoutBuf.indexOf('___RESULTS_START___');
  const end = stdoutBuf.indexOf('___RESULTS_END___');
  if (start < 0 || end < 0) {
    return { results: [], error: 'Could not capture test results. Output:\n' + stdoutBuf };
  }
  const jsonStr = stdoutBuf.slice(start + 19, end).trim();
  try {
    return { results: JSON.parse(jsonStr), error: null };
  } catch (e) {
    return { results: [], error: 'Could not parse output: ' + jsonStr };
  }
}
