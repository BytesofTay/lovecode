// ── 14-Day Interview Bootcamp curriculum ─────────────────────────────────
// One pack per day. Each day pulls from existing Learn topics, Drills, and
// the Problems list — the bootcamp is a SCHEDULER, not a new content engine.
// User clicks day → sees a checklist → opens each item → marks day complete.
const BOOTCAMP_DAYS = [
  // ── WEEK 1: FOUNDATIONS ────────────────────────────────────────
  {
    day: 1, week: 1, title: 'Big-O & Array Basics',
    topicIds: ['big-o', 'arrays'],
    problemIds: [1, 2, 5],
    estMinutes: 120,
    description: 'Build the complexity vocabulary, then warm up on classic array problems with running-state tricks (running min, Kadane\'s).',
    drillFocus: 'snippets',
  },
  {
    day: 2, week: 1, title: 'Hash Maps',
    topicIds: ['hashmap'],
    problemIds: [1, 53, 54, 3],
    estMinutes: 120,
    description: 'The most useful interview data structure. Trade memory for time: turn O(n²) brute force into O(n) lookups.',
    drillFocus: 'snippets',
  },
  {
    day: 3, week: 1, title: 'Two Pointers',
    topicIds: ['two-pointers'],
    problemIds: [56, 9, 10],
    estMinutes: 150,
    description: 'Converging pointers turn many O(n²) problems into O(n). Sorted-array tricks; in-place comparisons.',
    drillFocus: 'patterns',
  },
  {
    day: 4, week: 1, title: 'Sliding Window',
    topicIds: ['sliding-window'],
    problemIds: [50, 51, 52],
    estMinutes: 150,
    description: 'Variable-window expand/shrink template. Probably the highest-leverage pattern — it shows up everywhere.',
    drillFocus: 'snippets',
  },
  {
    day: 5, week: 1, title: 'Strings & Stack',
    topicIds: ['strings', 'stack-queue'],
    problemIds: [55, 57, 44],
    estMinutes: 120,
    description: 'Apply yesterday\'s patterns to strings. Add the stack/queue toolkit (LIFO matching, FIFO BFS prep).',
    drillFocus: 'patterns',
  },
  {
    day: 6, week: 1, title: 'Binary Search',
    topicIds: ['binary-search'],
    problemIds: [7, 8],
    estMinutes: 120,
    description: 'Halving the search space. Classic + the rotated-array trick + binary search on a monotonic predicate.',
    drillFocus: 'snippets',
  },
  {
    day: 7, week: 1, title: 'Mid-Bootcamp Mock + Review',
    topicIds: [],
    problemIds: [],
    estMinutes: 90,
    description: 'Take a 45-minute mock interview using a problem you haven\'t seen. Then review yesterday\'s weak spots.',
    drillFocus: 'lazy',
    isMockDay: true,
  },

  // ── WEEK 2: PATTERNS ───────────────────────────────────────────
  {
    day: 8, week: 2, title: 'Linked Lists',
    topicIds: ['linked-list'],
    problemIds: [40, 41, 42],
    estMinutes: 120,
    description: 'Pointer choreography: reverse, cycle detect (Floyd\'s), dummy-head merging. The flip-step is muscle memory.',
    drillFocus: 'parsons',
  },
  {
    day: 9, week: 2, title: 'Trees: Recursion Basics',
    topicIds: ['trees', 'recursion'],
    problemIds: [60, 61, 62],
    estMinutes: 150,
    description: 'Universal tree template: handle null → recurse on children → combine. Burn this shape into reflex.',
    drillFocus: 'snippets',
  },
  {
    day: 10, week: 2, title: 'Trees: BST + BFS',
    topicIds: ['trees', 'bfs-dfs'],
    problemIds: [68, 70, 64],
    estMinutes: 150,
    description: 'BST property (left &lt; node &lt; right) + level-order BFS with len(queue) trick. Two more reusable templates.',
    drillFocus: 'patterns',
  },
  {
    day: 11, week: 2, title: 'Graphs',
    topicIds: ['graphs', 'bfs-dfs'],
    problemIds: [30, 28, 27],
    estMinutes: 150,
    description: 'Number of Islands, Course Schedule (topo sort), Clone Graph. Visited sets, in-degrees, hash-map traversals.',
    drillFocus: 'patterns',
  },
  {
    day: 12, week: 2, title: 'Backtracking',
    topicIds: ['backtracking', 'recursion'],
    problemIds: [49, 81],
    estMinutes: 150,
    description: 'Choose → recurse → un-choose. Word Search, Subsets/Permutations. The pop step IS the algorithm.',
    drillFocus: 'parsons',
  },
  {
    day: 13, week: 2, title: 'Dynamic Programming',
    topicIds: ['dp'],
    problemIds: [16, 22, 17],
    estMinutes: 180,
    description: 'Climbing Stairs, House Robber, Coin Change. Capstone topic — give it extra time. Practice both top-down and bottom-up.',
    drillFocus: 'templates',
  },
  {
    day: 14, week: 2, title: 'Heap, Final Mock & Weak Spots',
    topicIds: ['heaps'],
    problemIds: [74, 75],
    estMinutes: 120,
    description: 'Top-K with min-heap, two-heap median trick. Then: 45-minute final mock interview + drill your weakest topics from the dashboard.',
    drillFocus: 'flashcards',
    isMockDay: true,
  },
];

// Maps the bootcamp's drillFocus to the actual mode and sub-mode in the app.
const BOOTCAMP_DRILL_TARGETS = {
  'snippets': { mode: 'drills', sub: 'snippets', label: '🧩 Fill-in-the-blank Snippets', desc: '8 minutes — code-shape recognition' },
  'patterns': { mode: 'drills', sub: 'patterns', label: '🧠 Pattern Recognition Drills', desc: '8 minutes — name the pattern' },
  'lazy': { mode: 'drills', sub: 'lazy', label: '😎 Lazy Drills (mixed)', desc: '10 minutes — snap recall' },
  'parsons': { mode: 'build', sub: 'parsons', label: '🧩 Parsons (drag-to-order)', desc: '8 minutes — reorder code lines' },
  'templates': { mode: 'build', sub: 'templates', label: '🎨 Pattern Templates', desc: '10 minutes — fill the universal skeleton' },
  'flashcards': { mode: 'recall', sub: 'flashcards', label: '📇 Spaced-Repetition Flashcards', desc: '10 minutes — reveal & self-grade' },
};
