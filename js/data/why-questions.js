// ── Why-questions: causal reasoning prompts (self-graded reveal) ──────────
// Answer in your head, then click Reveal, then self-grade. These questions
// can\'t be pattern-matched — you must actually understand the why.
const WHY_QUESTIONS = [
  {
    id: 'why_sw_expand_first',
    category: 'sliding-window',
    q: 'Why does sliding window EXPAND R first, then SHRINK L when needed — instead of the reverse?',
    answer: `<p>R discovers new content; L discards old content. You can\'t know whether the window is invalid until you\'ve added the new element first. Reversing the order means you\'d be shrinking based on stale state.</p><p>Concretely: in "longest no-repeat substring," you can\'t check "is c a duplicate?" before bringing c into the window with R.</p>`,
  },
  {
    id: 'why_sw_n_not_n2',
    category: 'sliding-window',
    q: 'Sliding window has TWO loops (the outer R loop and the inner L while). Why is total time O(n), not O(n²)?',
    answer: `<p>Amortized analysis. R moves forward at most n times. L ALSO moves forward at most n times — and it never moves backward. Total pointer movement is bounded by 2n.</p><p>The inner while looks like it could be O(n) per step, but across the whole algorithm, L\'s total work is O(n) — not O(n) per outer iteration.</p>`,
  },
  {
    id: 'why_two_sum_complement',
    category: 'hash-map',
    q: 'In Two Sum, why look up <code>target - n</code> instead of <code>target + n</code> or just <code>n</code>?',
    answer: `<p>Algebra. You want a value y such that <code>n + y = target</code>. Solving for y: <code>y = target - n</code>. That\'s the value you need to find — the "complement."</p><p>Looking up <code>target + n</code> would search for a different value entirely. Looking up <code>n</code> would search for "have I seen this same number before" — a different problem (Contains Duplicate).</p>`,
  },
  {
    id: 'why_check_before_store',
    category: 'hash-map',
    q: 'In Two Sum, why CHECK for the complement before storing the current value <code>n</code>?',
    answer: `<p>If you stored first, an element with <code>2n == target</code> would falsely "find" itself.</p><p>Example: nums = [3, 5], target = 6. If we store 3 first, then on the next iteration we\'d look up <code>6 - 5 = 1</code> — but if instead nums = [3], target = 6, storing first means we look up <code>6 - 3 = 3</code> and find ourselves. Wrong answer.</p>`,
  },
  {
    id: 'why_bs_lo_plus_one',
    category: 'binary-search',
    q: 'In binary search, why <code>lo = mid + 1</code> (and <code>hi = mid - 1</code>) instead of <code>lo = mid</code>?',
    answer: `<p>You already CHECKED mid in the previous line. Excluding it from the next range avoids redundant work AND prevents infinite loops when <code>lo == hi</code>.</p><p>If <code>lo = mid</code> and <code>arr[mid] != target</code>, the next iteration computes the same mid → spins forever.</p>`,
  },
  {
    id: 'why_bs_le_hi',
    category: 'binary-search',
    q: 'Why <code>while lo &lt;= hi</code> and not <code>while lo &lt; hi</code>?',
    answer: `<p>The search range [lo, hi] is INCLUSIVE. When <code>lo == hi</code>, there\'s still ONE element to check. With strict <code>&lt;</code>, you skip the final candidate.</p><p>Different binary search variants use different conventions; this one (with <code>+1</code>/<code>-1</code> updates) goes with <code>&lt;=</code>.</p>`,
  },
  {
    id: 'why_save_next',
    category: 'linked-list',
    q: 'In reverse-list, why save <code>nxt = curr.next</code> BEFORE the line <code>curr.next = prev</code>?',
    answer: `<p>The line <code>curr.next = prev</code> overwrites <code>curr.next</code>. Without saving it first, the rest of the list becomes unreachable.</p><p>This is the "don\'t saw off the branch you\'re sitting on" rule of pointer manipulation. Always save what you\'re about to lose.</p>`,
  },
  {
    id: 'why_floyd_meets',
    category: 'linked-list',
    q: 'In Floyd\'s tortoise and hare, why are slow and fast guaranteed to meet inside a cycle?',
    answer: `<p>Once both pointers are inside the cycle, fast gains 1 step on slow per iteration (fast moves 2, slow moves 1, differential = 1). The gap closes by 1 each step, so within a cycle of length L, they meet in at most L iterations.</p><p>If there\'s no cycle, fast hits null first — that\'s the "no cycle" termination.</p>`,
  },
  {
    id: 'why_path_copy',
    category: 'backtracking',
    q: 'In subsets backtracking, why <code>result.append(path[:])</code> instead of <code>result.append(path)</code>?',
    answer: `<p><code>path</code> is a SHARED mutable list. Subsequent recursion mutates it. If you stored a reference, every entry in <code>result</code> would point to the same list — and that list eventually empties out (via <code>pop()</code>) before the function returns.</p><p>You\'d end up with <code>[[], [], [], ...]</code> instead of every snapshot.</p>`,
  },
  {
    id: 'why_unchoose',
    category: 'backtracking',
    q: 'In backtracking, why is the "un-choose" step (e.g., <code>path.pop()</code>) critical?',
    answer: `<p>Sibling branches must NOT inherit state from their previously-explored siblings. After the "include nums[i]" branch fully explores, popping nums[i] resets the path so the "exclude nums[i]" branch starts clean.</p><p>Without un-choose, the path grows monotonically and produces wrong combinations.</p>`,
  },
  {
    id: 'why_dp_overlap',
    category: 'dp',
    q: 'Why does memoization speed up Fibonacci from O(2ⁿ) to O(n)?',
    answer: `<p>Without caching, fib(n) recomputes fib(n-2) twice, fib(n-3) three times, fib(n-4) five times… exponential blow-up. With caching, each fib(k) is computed exactly once → O(n) total work.</p><p>The general principle: memoization helps when the recursion has OVERLAPPING SUBPROBLEMS. If subproblems are unique (e.g., merge sort), caching gives nothing.</p>`,
  },
  {
    id: 'why_dp_inf_init',
    category: 'dp',
    q: 'In Coin Change DP, why initialize <code>dp[]</code> to <code>float(\'inf\')</code> instead of 0?',
    answer: `<p><code>dp[i]</code> represents the minimum coins for amount i. We use <code>min()</code> to update. Initializing to 0 would make every subproblem look "already solved with zero coins," which is false.</p><p><code>float(\'inf\')</code> is the identity for <code>min</code> — anything beats it. As real solutions are discovered, they replace inf.</p>`,
  },
  {
    id: 'why_bfs_popleft',
    category: 'graph',
    q: 'Why does BFS use <code>popleft()</code> from a deque instead of <code>pop()</code> from a list?',
    answer: `<p>Two reasons. First: FIFO. <code>popleft</code> takes from the FRONT, so siblings are processed before their children → that\'s breadth-first. <code>pop()</code> from the back gives DFS.</p><p>Second: performance. <code>list.pop(0)</code> is O(n) because every element shifts. <code>deque.popleft()</code> is O(1). Using a list makes BFS O(n²).</p>`,
  },
  {
    id: 'why_topo_kahn',
    category: 'graph',
    q: 'In Kahn\'s topological sort, why start with nodes that have in-degree 0?',
    answer: `<p>An in-degree-0 node has no prerequisites — it\'s ready to go FIRST. After processing it, its dependents lose one prerequisite (decrement their in-degree); some of those become in-degree-0 themselves.</p><p>If at the end you can\'t process all nodes, the remaining ones form a cycle (every node has at least one prerequisite that\'s also stuck) — that\'s how Kahn\'s detects cycles.</p>`,
  },
  {
    id: 'why_min_heap_top_k',
    category: 'heap',
    q: 'For Top K LARGEST elements, why use a MIN-heap (not a max-heap)?',
    answer: `<p>Counter-intuitive but correct. Maintain a heap of size K. The smallest of the K is at the top. When a new element arrives, if it\'s LARGER than the heap\'s top, pop the top and push the new one.</p><p>At the end, the K elements left are the K largest. With a max-heap of size K, you\'d need to pop the largest one (which is what you want to keep).</p>`,
  },
];

const WHY_PER_SESSION = 8;
