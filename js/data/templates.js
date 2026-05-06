// ── Pattern templates: generic skeleton + multi-blank fills ────────────────
// Each template captures the UNIVERSAL shape of a pattern (sliding window,
// BFS, etc.). The user fills in the per-problem specifics. Teaches that ~80%
// of the code is the same across problems with that pattern.
const PATTERN_TEMPLATES = [
  {
    id: 'tpl_sliding_window',
    pattern: 'Sliding Window',
    level: 'medium',
    description: 'Universal template for "longest/shortest contiguous subarray meeting a condition."',
    template: `def sliding_window(arr):
    L = 0
    {{1}}                             # state for window contents
    best = 0
    for R in range(len(arr)):
        {{2}}                         # 1. Expand: add arr[R] to state
        while {{3}}:                  # 2. Shrink while window is invalid
            {{4}}                     # remove arr[L] from state
            L += 1
        {{5}}                         # 3. Update answer
    return best`,
    blanks: [
      {
        q: 'Blank 1 — STATE for "longest substring with no repeating chars"',
        options: [
          'count = 0',
          'seen = {}    # char → last index',
          'arr = []',
          'window = set()',
        ],
        answerIdx: 1,
        explanation: 'You need to know WHERE a duplicate was seen so you can jump <code>L</code> past it. A dict char → index does it.',
      },
      {
        q: 'Blank 2 — EXPAND the window with the right edge',
        options: [
          'seen[arr[R]] = R',
          'best = R',
          'arr.append(R)',
          'L = R',
        ],
        answerIdx: 0,
        explanation: 'Record the latest position of <code>arr[R]</code> in the seen map. That\'s the new state contribution from the right edge.',
      },
      {
        q: 'Blank 3 — INVARIANT to maintain (when do we shrink?)',
        options: [
          'L < R',
          'arr[L] in seen',
          'arr[R] in seen and seen[arr[R]] >= L and seen[arr[R]] < R',
          'len(seen) > 1',
        ],
        answerIdx: 2,
        explanation: 'Shrink while the duplicate of <code>arr[R]</code> is INSIDE the current window (its previous occurrence is between L and R, exclusive of R).',
      },
      {
        q: 'Blank 4 — SHRINK: remove <code>arr[L]</code> from state',
        options: [
          'del seen[arr[L]]',
          '# (no removal needed — overwrite when expanded)',
          'arr.pop()',
          'seen.clear()',
        ],
        answerIdx: 1,
        explanation: 'For this specific problem, no explicit removal — we overwrite. (For "longest with at-most-K distinct," you DO decrement counts.)',
      },
      {
        q: 'Blank 5 — UPDATE answer with the current window',
        options: [
          'best = R',
          'best = max(best, R - L + 1)',
          'best += 1',
          'best = arr[R]',
        ],
        answerIdx: 1,
        explanation: 'Window length is <code>R - L + 1</code>. Track the max across all valid windows.',
      },
    ],
  },
  {
    id: 'tpl_bfs',
    pattern: 'BFS (Shortest Path / Level Order)',
    level: 'medium',
    description: 'Universal template for shortest-path-in-unweighted-graph or level-order traversal.',
    template: `from collections import deque
def bfs(start):
    {{1}}                             # init data structures
    q = deque([start])
    visited = {start}
    while q:
        {{2}}                         # pop ONE level
        for node in level:
            if {{3}}:                 # goal test (optional)
                return ...
            for neighbor in node.neighbors():
                if {{4}}:             # not yet visited?
                    visited.add(neighbor)
                    {{5}}             # enqueue for next level`,
    blanks: [
      {
        q: 'Blank 1 — INIT structures (we want to track depth/level)',
        options: [
          'depth = 0',
          'depth = 0; result = []',
          'stack = []',
          'memo = {}',
        ],
        answerIdx: 1,
        explanation: 'Most BFS problems care about depth (level number) AND collected results. Two scalars/lists.',
      },
      {
        q: 'Blank 2 — pop the ENTIRE current level (not just one node)',
        options: [
          'level = q.popleft()',
          'level = [q.popleft() for _ in range(len(q))]',
          'level = q.pop()',
          'level = list(q)',
        ],
        answerIdx: 1,
        explanation: 'Snapshot <code>len(q)</code> before draining — that\'s the size of the current level. Popping inside the loop would mix levels.',
      },
      {
        q: 'Blank 3 — GOAL TEST (e.g., "found target in shortest path")',
        options: [
          'node == target',
          'node in visited',
          'len(visited) > N',
          'q is empty',
        ],
        answerIdx: 0,
        explanation: 'When BFS first encounters the target, the current depth IS the shortest distance to it.',
      },
      {
        q: 'Blank 4 — Filter neighbors',
        options: [
          'neighbor not in visited',
          'neighbor in visited',
          'neighbor != node',
          'True',
        ],
        answerIdx: 0,
        explanation: 'Skip already-visited to prevent infinite loops in graphs with cycles. Trees can skip this check.',
      },
      {
        q: 'Blank 5 — ENQUEUE the neighbor for the next level',
        options: [
          'q.appendleft(neighbor)',
          'q.append(neighbor)',
          'q.popleft(); q.append(neighbor)',
          'visited.append(neighbor)',
        ],
        answerIdx: 1,
        explanation: 'Append to the BACK so the current level finishes before next-level nodes are processed → that\'s breadth-first.',
      },
    ],
  },
  {
    id: 'tpl_backtracking',
    pattern: 'Backtracking',
    level: 'medium',
    description: 'Universal template for combinatorial search: subsets, permutations, N-Queens.',
    template: `def backtrack_solve(input):
    result = []
    path = []
    def backtrack(state):
        if {{1}}:                     # base case: complete solution
            result.append({{2}})
            return
        for choice in {{3}}:          # iterate possible choices
            if {{4}}:                 # is this choice valid?
                path.append(choice)
                backtrack(advance(state))
                {{5}}                 # un-choose (CRITICAL)
    backtrack(initial_state)
    return result`,
    blanks: [
      {
        q: 'Blank 1 — BASE CASE for "generate all permutations of nums"',
        options: [
          'len(path) == 0',
          'len(path) == len(nums)',
          'state == None',
          'len(result) > 100',
        ],
        answerIdx: 1,
        explanation: 'A permutation is COMPLETE when its length matches the input. That\'s the recursion terminator.',
      },
      {
        q: 'Blank 2 — what to APPEND to result',
        options: [
          'path',
          'path[:]   # copy/snapshot',
          'state',
          'choice',
        ],
        answerIdx: 1,
        explanation: 'Snapshot or future mutations to <code>path</code> would corrupt every recorded result. Always snapshot.',
      },
      {
        q: 'Blank 3 — CHOICES to iterate',
        options: [
          'range(len(nums))',
          'nums   # try every input element',
          'path   # already-chosen',
          '[0, 1]',
        ],
        answerIdx: 1,
        explanation: 'For each step in a permutation, you try every possible next element from <code>nums</code>.',
      },
      {
        q: 'Blank 4 — VALIDITY CHECK (filter out invalid choices)',
        options: [
          'choice not in path',
          'choice in path',
          'len(path) < choice',
          'True',
        ],
        answerIdx: 0,
        explanation: 'Permutations don\'t reuse elements — skip choices already in <code>path</code>. (Subsets don\'t need this check; N-Queens uses a column-conflict check.)',
      },
      {
        q: 'Blank 5 — UN-CHOOSE step',
        options: [
          'path.clear()',
          'path = []',
          'path.pop()',
          'continue',
        ],
        answerIdx: 2,
        explanation: 'Pop the last appended choice so siblings start clean. Without this, sibling branches inherit state they shouldn\'t have.',
      },
    ],
  },
  {
    id: 'tpl_two_pointers',
    pattern: 'Two Pointers (Converging)',
    level: 'easy',
    description: 'Walk a sorted array (or string) from both ends, moving toward each other.',
    template: `def two_pointers(arr):
    L, R = 0, len(arr) - 1
    while {{1}}:
        if {{2}}:
            return ...                # found / record
        elif arr[L] + arr[R] < target:
            {{3}}                     # need bigger sum
        else:
            {{4}}                     # need smaller sum
    return ...`,
    blanks: [
      {
        q: 'Blank 1 — LOOP condition',
        options: [
          'L < R',
          'L <= R',
          'L != R',
          'L < len(arr)',
        ],
        answerIdx: 0,
        explanation: 'Strict <code>&lt;</code> — when <code>L == R</code>, we\'ve covered every pair. <code>&lt;=</code> would compare an element with itself.',
      },
      {
        q: 'Blank 2 — DIRECT HIT (sum equals target)',
        options: [
          'arr[L] == arr[R]',
          'arr[L] + arr[R] == target',
          'L + R == target',
          'L == R',
        ],
        answerIdx: 1,
        explanation: 'We\'re looking for two elements that SUM to target — not for them to be equal.',
      },
      {
        q: 'Blank 3 — SUM TOO SMALL (need bigger). Which pointer moves?',
        options: [
          'L += 1   # move left pointer right',
          'R -= 1   # move right pointer left',
          'L -= 1',
          'R += 1',
        ],
        answerIdx: 0,
        explanation: 'Sorted array → moving L right gives a BIGGER value. Moving R left would make the sum even smaller (wrong direction).',
      },
      {
        q: 'Blank 4 — SUM TOO BIG (need smaller). Which pointer moves?',
        options: [
          'L += 1',
          'R -= 1',
          'L -= 1',
          'R += 1',
        ],
        answerIdx: 1,
        explanation: 'Sorted array → moving R left gives a SMALLER value. Symmetric to the previous.',
      },
    ],
  },
];

const TEMPLATES_PER_SESSION = 2;
