// ── Global state ───────────────────────────────────────────────────────────
// All cross-module mutable state lives here. Read/written from any module.

// Problems / timer
let problems = [...PROBLEMS];
let selId = null;
let secs = 1200;
let iv = null;
let running = false;
let done = new Set();
let review = new Set();
let problemData = {};
let noteDebounce = {};

// Mode + Big-O / Sorting quiz
let currentMode = 'problems';
let bigoQueue = [], bigoIdx = 0, bigoSession = {correct:0,total:0}, bigoStreak = 0, bigoAnswered = false, bigoPicked = null, bigoAllTime = {};
let sortingSubMode = 'reference', selectedAlgoId = 'merge';
let sortingQueue = [], sortingIdx = 0, sortingSession = {correct:0,total:0}, sortingAnswered = false, sortingPicked = null, sortingAllTime = {};

// Sort tracer
let traceStates = [];
let traceIdx = 0;

// Learn mode
let learnView = 'map';     // 'map' | 'detail'
let learnTopicId = null;
let learningState = {};    // { [topicId]: { videoWatched, complete, lastVisited } }
// Lazy Mode: UI preference (localStorage). When ON, render lazyDetails instead of details.
let lazyModeOn = false;
try { lazyModeOn = JSON.parse(localStorage.getItem('lovecode_lazy_mode') || 'false'); } catch (_) {}

// Mock interview
let mockState = 'idle';   // 'idle' | 'active' | 'grading'
let mockProblem = null;
let mockStart = null;
let mockTickInterval = null;
let mockSecsRemaining = 0;
let mockHistory = [];     // [{ts, problemId, durationSec, outcome, rubric}]
const MOCK_DURATION = 45 * 60; // 45 minutes
const MOCK_RUBRIC = [
  'I stated time and space complexity before coding',
  'I identified at least one edge case (empty input, single element, all-same)',
  'I walked through my approach verbally before coding',
  'I tested with a small example and traced through',
  'I explored a brute-force first, then optimized'
];
let mockRubricAnswers = []; // booleans

// Drills
let drillsSubMode = 'patterns'; // 'patterns' | 'vocab' | 'lazy' | 'snippets'
let patternsQueue = [], patternsIdx = 0, patternsSession = {correct:0,total:0}, patternsAnswered = false, patternsPicked = null, patternsAllTime = {};
let vocabQueue = [], vocabIdx = 0, vocabSession = {correct:0,total:0}, vocabAnswered = false, vocabPicked = null, vocabAllTime = {};
let lazyQueue = [], lazyIdx = 0, lazySession = {correct:0,total:0}, lazyAnswered = false, lazyPicked = null, lazyAllTime = {};
let snippetsQueue = [], snippetsIdx = 0, snippetsSession = {correct:0,total:0}, snippetsAnswered = false, snippetsPicked = null, snippetsAllTime = {};
let lazyFilter = 'all'; // 'all' | one of LAZY_CATEGORIES
let lazyTimerSecs = 1200;          // 20 minutes
let lazyTimerInterval = null;
let lazyTimerExpired = false;
const LAZY_CATEGORIES = ['code-complexity','code-pattern','desc-to-term','term-to-desc','quick-concept'];
const LAZY_CATEGORY_LABELS = {
  'code-complexity': 'Code → Complexity',
  'code-pattern': 'Code → Pattern',
  'desc-to-term': 'Description → Term',
  'term-to-desc': 'Term → Description',
  'quick-concept': 'Quick Concept'
};
