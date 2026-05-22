// ── 7-Day Start Here Path ─────────────────────────────────────────────────
// Compressed pathway designed to get a beginner from zero → realistic Medium
// interview readiness in one week of focused work. Each day has the same
// 3-task shape — that's the "mix" of structured teaching and top-down plunge:
//
//   🧠 Teach        — 15–20 min — one Learn topic for baseline vocabulary
//   🌱 Warmup Easy  — 15 min     — apply the pattern on an Easy problem
//   🌊 Plunge Medium — 45–60 min — a real Medium that interviews actually ask
//
// Hints, pseudocode, brute-force walkthroughs, and the in-browser runner
// surface inside problem panels — but only when the user clicks for them.
const BOOTCAMP_DAYS = [
  {
    day: 1, title: 'Hash Maps',
    teachTopicIds: ['hashmap'],
    warmupEasyId: 1,        // Two Sum
    plungeMediumId: 54,     // Group Anagrams
    estMinutes: 100,
    description: 'The most useful interview data structure. Trade memory for time: turn O(n²) brute force into O(n) lookups.',
    drillFocus: 'snippets',
  },
  {
    day: 2, title: 'Two Pointers + Sliding Window',
    teachTopicIds: ['two-pointers', 'sliding-window'],
    warmupEasyId: 56,       // Valid Palindrome
    plungeMediumId: 50,     // Longest Substring Without Repeating Characters
    estMinutes: 110,
    description: 'Two converging pointers turn many O(n²) problems into O(n). Variable-size sliding windows expand/shrink to satisfy a constraint.',
    drillFocus: 'patterns',
  },
  {
    day: 3, title: 'Stack + Linked List',
    teachTopicIds: ['stack-queue', 'linked-list'],
    warmupEasyId: 55,       // Valid Parentheses
    plungeMediumId: 44,     // Remove Nth Node From End of List
    estMinutes: 110,
    description: 'LIFO matching for nested structures + pointer choreography on linked lists. Two of the most-asked categories.',
    drillFocus: 'parsons',
  },
  {
    day: 4, title: 'Binary Search',
    teachTopicIds: ['binary-search'],
    warmupEasyId: 7,        // Find Minimum in Rotated Sorted Array (lowest-easy in this bucket)
    plungeMediumId: 8,      // Search in Rotated Sorted Array
    estMinutes: 90,
    description: 'Halving the search space. Classic O(log n) + the rotated-array variant interviewers love.',
    drillFocus: 'snippets',
  },
  {
    day: 5, title: 'Trees + Recursion',
    teachTopicIds: ['trees', 'recursion'],
    warmupEasyId: 60,       // Maximum Depth of Binary Tree
    plungeMediumId: 63,     // Validate Binary Search Tree
    estMinutes: 110,
    description: 'Universal tree template: handle null → recurse on children → combine. Then add BST invariants and bounds propagation.',
    drillFocus: 'snippets',
  },
  {
    day: 6, title: 'Graphs (BFS / DFS)',
    teachTopicIds: ['graphs', 'bfs-dfs'],
    warmupEasyId: 30,       // Number of Islands (technically Medium-labeled but core BFS/DFS warmup)
    plungeMediumId: 28,     // Course Schedule (topological sort)
    estMinutes: 120,
    description: 'Grid BFS/DFS for connected components, then graph topological sort with in-degrees. The "graph reduction" interview skill.',
    drillFocus: 'patterns',
  },
  {
    day: 7, title: 'Dynamic Programming + Graduation',
    teachTopicIds: ['dp'],
    warmupEasyId: 16,       // Climbing Stairs
    plungeMediumId: 17,     // Coin Change
    estMinutes: 130,
    description: 'Bottom-up DP with rolling state, then min-cost subproblem composition. Finish with a 45-minute Mock interview to graduate the path.',
    drillFocus: 'templates',
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
