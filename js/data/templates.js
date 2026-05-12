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
  // ── Binary Search ──────────────────────────────────────────────
  {
    id: 'tpl_binary_search', pattern: 'Binary Search', level: 'easy',
    description: 'Find a target in a sorted array. Halve the search range each step → O(log n).',
    template: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while {{1}}:
        mid = {{2}}
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            {{3}}
        else:
            {{4}}
    return -1`,
    blanks: [
      { q:'Blank 1 — LOOP CONDITION', options:['lo < hi','lo <= hi','lo != hi','True'], answerIdx:1, explanation:'When lo == hi there\'s still ONE element left to check. <= keeps it in scope.' },
      { q:'Blank 2 — MID (overflow-safe)', options:['(lo + hi) // 2','lo + (hi - lo) // 2','(hi - lo) // 2','hi - lo'], answerIdx:1, explanation:'<code>lo + (hi-lo)//2</code> avoids overflow in fixed-width int languages. Same value as (lo+hi)//2 but portable.' },
      { q:'Blank 3 — target is to the RIGHT', options:['lo = mid','lo = mid + 1','hi = mid - 1','hi = mid'], answerIdx:1, explanation:'We already checked mid. Exclude it (+1) or you may infinite-loop when lo == hi.' },
      { q:'Blank 4 — target is to the LEFT', options:['lo = mid - 1','hi = mid - 1','hi = mid','lo = mid + 1'], answerIdx:1, explanation:'Symmetric: shrink hi by 1 past mid since mid is already ruled out.' },
    ],
  },
  // ── Binary Search on Answer ────────────────────────────────────
  {
    id: 'tpl_bs_on_answer', pattern: 'Binary Search on Answer', level: 'hard',
    description: 'For "smallest x such that f(x) is true" problems with a MONOTONIC predicate (e.g., shipping capacity, Koko bananas).',
    template: `def binary_search_answer(lo, hi, f):
    # f(x) is monotonic: false for small x, true for large x
    # We want the smallest x where f(x) is true.
    while {{1}}:
        mid = lo + (hi - lo) // 2
        if {{2}}:
            {{3}}  # answer is at mid or smaller
        else:
            {{4}}  # answer is strictly larger
    return lo`,
    blanks: [
      { q:'Blank 1 — LOOP CONDITION (boundary-find variant)', options:['lo <= hi','lo < hi','lo != hi','True'], answerIdx:1, explanation:'Find-boundary uses <. Terminates exactly when lo == hi → that\'s the answer.' },
      { q:'Blank 2 — predicate check', options:['f(mid)','not f(mid)','mid == hi','f(lo)'], answerIdx:0, explanation:'Predicate at mid. True → mid is a valid answer; narrow to [lo, mid]. False → answer is strictly bigger.' },
      { q:'Blank 3 — narrow when predicate TRUE', options:['hi = mid - 1','hi = mid','lo = mid + 1','lo = mid'], answerIdx:1, explanation:'<code>hi = mid</code> (not mid - 1) — we KEEP mid as a candidate since it satisfies f.' },
      { q:'Blank 4 — narrow when predicate FALSE', options:['hi = mid','hi = mid - 1','lo = mid + 1','lo = mid'], answerIdx:2, explanation:'mid is invalid → answer is strictly greater. Exclude mid with +1.' },
    ],
  },
  // ── Tree Recursion (universal) ─────────────────────────────────
  {
    id: 'tpl_tree_recursion', pattern: 'Tree Recursion (universal)', level: 'easy',
    description: 'Almost every tree problem fits: handle null → recurse on children → combine. Tweak the combine step per problem.',
    template: `def tree_dfs(node):
    if {{1}}:
        return {{2}}  # base case value
    left = tree_dfs(node.left)
    right = tree_dfs(node.right)
    return {{3}}  # combine: per-problem logic`,
    blanks: [
      { q:'Blank 1 — BASE CASE', options:['node is None or not node','node.left is None','node.val == 0','True'], answerIdx:0, explanation:'Null check. Handles both "empty tree" AND "recursed into a missing child."' },
      { q:'Blank 2 — base-case return for MAX DEPTH', options:['1','0','None','-1'], answerIdx:1, explanation:'Empty subtree contributes 0 to depth. Different problems use different base values (sum=0, count=0, balanced=True, exists=False).' },
      { q:'Blank 3 — COMBINE for "max depth"', options:['left + right','max(left, right)','1 + max(left, right)','left + right + 1'], answerIdx:2, explanation:'+1 for the current node, max() picks the deeper subtree. For sum problems, this would be <code>left + right + node.val</code>.' },
    ],
  },
  // ── DFS on Graph ───────────────────────────────────────────────
  {
    id: 'tpl_dfs_graph', pattern: 'DFS on Graph', level: 'medium',
    description: 'Explore connected components, detect cycles, mark visited. Recursive or iterative-with-stack.',
    template: `def dfs(graph, start):
    visited = set()
    def go(node):
        if {{1}}:
            return
        visited.add(node)
        # visit logic here
        for nei in graph[node]:
            {{2}}
    go(start)
    return visited`,
    blanks: [
      { q:'Blank 1 — CYCLE / REVISIT GUARD', options:['node not in graph','node in visited','node == start','not graph'], answerIdx:1, explanation:'Without this check, cyclic graphs cause infinite recursion. The visited set is the cycle-break.' },
      { q:'Blank 2 — recurse on neighbor', options:['go(nei)','dfs(graph, nei)','visited.add(nei)','continue'], answerIdx:0, explanation:'Recurse on the neighbor (the inner go function). The visited check at the top of go handles the dedup.' },
    ],
  },
  // ── Top-K with Min-Heap ────────────────────────────────────────
  {
    id: 'tpl_top_k_heap', pattern: 'Top-K (Min-Heap of size K)', level: 'medium',
    description: 'Find the K largest items in a stream. Counter-intuitive: use a MIN heap of size K.',
    template: `import heapq
def top_k(items, k):
    heap = []
    for x in items:
        heapq.heappush(heap, {{1}})
        if {{2}}:
            heapq.heappop(heap)
    return [x for x in heap]`,
    blanks: [
      { q:'Blank 1 — what to push for "top K LARGEST values"', options:['x','-x','(x, 0)','(0, x)'], answerIdx:0, explanation:'Push the value directly. Min-heap puts the smallest of K at the top — that\'s the easiest to evict.' },
      { q:'Blank 2 — when to POP (evict)', options:['heap[0] < x','len(heap) > k','x > heap[0]','True'], answerIdx:1, explanation:'After pushing, if heap exceeds K, pop the smallest. End result: K largest values remain.' },
    ],
  },
  // ── Topological Sort (Kahn's) ──────────────────────────────────
  {
    id: 'tpl_topo_sort', pattern: 'Topological Sort (Kahn\'s)', level: 'medium',
    description: 'Linearize a DAG by repeatedly removing 0-in-degree nodes. Detects cycles as a side effect.',
    template: `from collections import deque
def topo_sort(n, edges):
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in edges:
        graph[a].append(b)
        {{1}}
    q = deque(i for i in range(n) if {{2}})
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            {{3}}
            if {{4}}:
                q.append(v)
    return order if len(order) == n else []`,
    blanks: [
      { q:'Blank 1 — update in-degree for edge (a, b)', options:['indeg[a] += 1','indeg[b] += 1','indeg[a] -= 1','graph[b].append(a)'], answerIdx:1, explanation:'Edge a → b means b has one more incoming edge. b\'s in-degree increases by 1.' },
      { q:'Blank 2 — initial queue: which nodes?', options:['indeg[i] > 0','indeg[i] == 0','indeg[i] < n','i == 0'], answerIdx:1, explanation:'Nodes with no prerequisites — they\'re ready to be processed FIRST.' },
      { q:'Blank 3 — process the edge from u to v', options:['indeg[v] -= 1','indeg[u] -= 1','indeg[v] += 1','order.append(v)'], answerIdx:0, explanation:'u is done. v had u as a prerequisite — decrement v\'s in-degree (one fewer thing blocking it).' },
      { q:'Blank 4 — when does v become "ready"?', options:['indeg[v] > 0','indeg[v] == 0','v not in q','indeg[v] < 0'], answerIdx:1, explanation:'A node is ready exactly when its last prerequisite is satisfied — in-degree drops to 0.' },
    ],
  },
  // ── Linked List Reversal (Three Pointers) ──────────────────────
  {
    id: 'tpl_reverse_ll', pattern: 'Linked List Reversal (3 pointers)', level: 'easy',
    description: 'In-place reversal. Burn this 5-line dance into muscle memory.',
    template: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = {{1}}
        curr.next = {{2}}
        prev = {{3}}
        curr = {{4}}
    return prev`,
    blanks: [
      { q:'Blank 1 — SAVE next before overwriting', options:['prev','curr','curr.next','head'], answerIdx:2, explanation:'curr.next is about to be redirected. Save the forward link or you\'ll lose the rest of the list.' },
      { q:'Blank 2 — FLIP the pointer', options:['nxt','prev','curr','head'], answerIdx:1, explanation:'Redirect curr.next to prev — that\'s the actual reversal.' },
      { q:'Blank 3 — advance prev', options:['nxt','curr','head','prev.next'], answerIdx:1, explanation:'prev moves up to the just-flipped node.' },
      { q:'Blank 4 — advance curr', options:['prev','curr.next','nxt','head'], answerIdx:2, explanation:'curr.next was overwritten — use the saved nxt to step forward.' },
    ],
  },
  // ── Floyd's Tortoise and Hare ─────────────────────────────────
  {
    id: 'tpl_floyd', pattern: 'Floyd\'s Tortoise and Hare', level: 'easy',
    description: 'Cycle detection / find midpoint with O(1) space. Two pointers, different speeds.',
    template: `def detect_cycle(head):
    slow = fast = head
    while {{1}}:
        slow = {{2}}
        fast = {{3}}
        if slow == fast:
            return True
    return False`,
    blanks: [
      { q:'Blank 1 — guard against None deref', options:['slow','fast','fast and fast.next','head'], answerIdx:2, explanation:'<code>fast.next.next</code> requires both fast and fast.next to be non-None. Both checks together.' },
      { q:'Blank 2 — slow advance', options:['slow','slow.next','slow.next.next','fast'], answerIdx:1, explanation:'Slow advances ONE node per step.' },
      { q:'Blank 3 — fast advance', options:['fast.next','fast.next.next','slow.next','fast'], answerIdx:1, explanation:'Fast advances TWO. The differential 2 − 1 = 1 closes the gap by 1 per step → guaranteed meet in a cycle.' },
    ],
  },
  // ── Monotonic Stack (Next Greater Element) ────────────────────
  {
    id: 'tpl_mono_stack', pattern: 'Monotonic Stack (Next Greater)', level: 'medium',
    description: 'For each element, find the next bigger (or smaller). Classic for Daily Temperatures, Stock Span, Largest Rectangle.',
    template: `def next_greater(nums):
    n = len(nums)
    result = [0] * n
    stack = []  # stores INDICES with monotonic decreasing values
    for i, x in enumerate(nums):
        while {{1}}:
            j = stack.pop()
            result[j] = {{2}}
        stack.append({{3}})
    return result`,
    blanks: [
      { q:'Blank 1 — pop when current breaks monotonicity', options:['stack and nums[stack[-1]] < x','stack and nums[stack[-1]] > x','stack and stack[-1] < i','not stack'], answerIdx:0, explanation:'Maintain DECREASING stack (top to bottom). When current x is GREATER than top, pop — we\'ve just found top\'s "next greater."' },
      { q:'Blank 2 — what to store at result[j] (Daily Temperatures: days to wait)', options:['x','i - j','j - i','nums[j]'], answerIdx:1, explanation:'For "Daily Temperatures" answer = i - j (days until warmer). For "Next Greater Value," answer = x.' },
      { q:'Blank 3 — what to push', options:['x','i','(x, i)','nums[i]'], answerIdx:1, explanation:'Push the INDEX, not the value — you\'ll need it later when popping to compute distances.' },
    ],
  },
  // ── Hash Map: Complement Lookup ────────────────────────────────
  {
    id: 'tpl_complement_hash', pattern: 'Hash Map: Complement Lookup', level: 'easy',
    description: 'For each element, look up the "complement" you\'d need to make a target. Two Sum, Pair-Sum-Diff, Subarray Sum Equals K.',
    template: `def find_pair(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if {{1}} in seen:
            return [{{2}}, i]
        {{3}}
    return []`,
    blanks: [
      { q:'Blank 1 — complement to look up', options:['n - target','target - n','n','target + n'], answerIdx:1, explanation:'Algebra: x + y = target → y = target − x. That\'s the COMPLEMENT we\'re seeking.' },
      { q:'Blank 2 — what to return as the partner index', options:['seen[target - n]','seen[n]','target - n','i - 1'], answerIdx:0, explanation:'The hash map stores value → index. Look up the complement\'s index to return both positions.' },
      { q:'Blank 3 — store for FUTURE lookups', options:['seen[i] = n','seen[n] = i','seen[target] = n','seen.append(n)'], answerIdx:1, explanation:'Store value → its index. Order: CHECK first, then store, so we don\'t pair an element with itself.' },
    ],
  },
  // ── DP Bottom-Up (1D) ──────────────────────────────────────────
  {
    id: 'tpl_dp_bottom_up', pattern: 'DP Bottom-Up (Tabulation, 1D)', level: 'medium',
    description: 'Iteratively fill a 1D dp[] from base cases up. No recursion, no cache misses.',
    template: `def dp_problem(n, ...):
    dp = [0] * (n + 1)
    # base case
    {{1}}
    for i in range(1, n + 1):
        dp[i] = {{2}}  # recurrence based on smaller subproblems
    return dp[n]`,
    blanks: [
      { q:'Blank 1 — BASE CASE for Climbing Stairs', options:['dp[0] = 0','dp[0] = 1','dp[0] = 1; dp[1] = 1','dp[n] = 1'], answerIdx:2, explanation:'For Climbing Stairs, dp[0] = 1 (one way to "stay at 0") and dp[1] = 1 (one way to reach step 1). Two base cases.' },
      { q:'Blank 2 — Climbing Stairs RECURRENCE', options:['dp[i - 1] + 1','dp[i - 1] + dp[i - 2]','dp[i - 1] * 2','max(dp[i-1], dp[i-2])'], answerIdx:1, explanation:'Ways to reach i = ways from i-1 (one step) + ways from i-2 (two steps). Fibonacci shape.' },
    ],
  },
  // ── DP Top-Down (Memoization) ──────────────────────────────────
  {
    id: 'tpl_dp_top_down', pattern: 'DP Top-Down (Memoization)', level: 'medium',
    description: 'Recursive with a cache. Mirrors the problem statement closely; cache turns 2ⁿ into linear.',
    template: `def dp(n, cache=None):
    if cache is None: cache = {}
    if {{1}}: return n  # base case
    if {{2}}:
        return cache[n]  # cache hit
    cache[n] = {{3}}  # store BEFORE returning
    return cache[n]`,
    blanks: [
      { q:'Blank 1 — Fibonacci base case', options:['n == 0','n < 2','n > 1','n == 1'], answerIdx:1, explanation:'<code>n < 2</code> covers fib(0)=0 AND fib(1)=1 (both equal n). Tight and clean.' },
      { q:'Blank 2 — CACHE HIT check', options:['cache[n]','n in cache','cache.get(n)','len(cache) > n'], answerIdx:1, explanation:'<code>n in cache</code> tests membership without KeyError. The other forms either error or have wrong semantics.' },
      { q:'Blank 3 — recurrence with CACHE passed through', options:['dp(n - 1) + dp(n - 2)','dp(n - 1, cache) + dp(n - 2, cache)','n - 1 + n - 2','dp(n - 1, {})'], answerIdx:1, explanation:'CRITICAL: pass the cache through. Without it, recursion creates a fresh empty cache each call → no speedup.' },
    ],
  },
  // ── Prefix Sum ─────────────────────────────────────────────────
  {
    id: 'tpl_prefix_sum', pattern: 'Prefix Sum', level: 'easy',
    description: 'Preprocess so any range-sum query is O(1). Foundation of many array problems.',
    template: `def range_sum_setup(nums):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = {{1}}
    return prefix

def query(prefix, lo, hi):  # sum of nums[lo..hi] inclusive
    return {{2}}`,
    blanks: [
      { q:'Blank 1 — RECURRENCE building prefix', options:['nums[i]','prefix[i] + nums[i]','prefix[i - 1] + nums[i]','prefix[i + 1] + nums[i]'], answerIdx:1, explanation:'Each prefix entry = previous prefix + current value. Build cumulative sum in one pass.' },
      { q:'Blank 2 — range-sum QUERY [lo, hi]', options:['prefix[hi] - prefix[lo]','prefix[hi + 1] - prefix[lo]','prefix[hi] + prefix[lo]','prefix[lo + hi]'], answerIdx:1, explanation:'Sum of nums[lo..hi] = prefix[hi+1] − prefix[lo]. The +1 accounts for the 1-indexed prefix shift.' },
    ],
  },
  // ── Interval Merge ─────────────────────────────────────────────
  {
    id: 'tpl_interval_merge', pattern: 'Interval Merge', level: 'medium',
    description: 'Sort by start, sweep through, merge overlapping. Core to Merge Intervals, Insert Interval, Meeting Rooms.',
    template: `def merge(intervals):
    intervals.sort(key={{1}})
    out = [intervals[0]]
    for s, e in intervals[1:]:
        if {{2}}:
            out[-1][1] = {{3}}
        else:
            out.append([s, e])
    return out`,
    blanks: [
      { q:'Blank 1 — SORT key', options:['lambda x: x[1]','lambda x: x[0]','lambda x: x[0] + x[1]','None'], answerIdx:1, explanation:'Sort by START. Now overlapping intervals are adjacent in iteration order.' },
      { q:'Blank 2 — overlap CONDITION', options:['s > out[-1][1]','s <= out[-1][1]','e <= out[-1][1]','s == out[-1][0]'], answerIdx:1, explanation:'After sorting by start, the next interval starts at or after the current. Overlap = it starts BEFORE the current ends.' },
      { q:'Blank 3 — MERGE the ends', options:['e','max(out[-1][1], e)','min(out[-1][1], e)','out[-1][1] + e'], answerIdx:1, explanation:'The merged interval ends at the LATER of the two ends. Don\'t assume e &gt; current end — it might be entirely contained.' },
    ],
  },
  // ── Union-Find ─────────────────────────────────────────────────
  {
    id: 'tpl_union_find', pattern: 'Union-Find (Disjoint Set Union)', level: 'medium',
    description: 'Efficient "are these connected?" and "merge groups" — near-O(1) amortized with path compression + union-by-rank.',
    template: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = {{1}}  # path compression
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        {{2}}
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True`,
    blanks: [
      { q:'Blank 1 — PATH COMPRESSION', options:['x','self.parent[x]','self.find(self.parent[x])','0'], answerIdx:2, explanation:'Re-parent x directly to the root. Flattens the tree → near O(1) amortized lookups.' },
      { q:'Blank 2 — UNION step (after rank-swap, ra is the bigger tree)', options:['self.parent[ra] = rb','self.parent[rb] = ra','self.rank[ra] = rb','self.parent[a] = b'], answerIdx:1, explanation:'Attach the SHORTER tree (rb) under the TALLER tree (ra). Keeps overall depth small.' },
    ],
  },
  // ── Trie Insert / Search ───────────────────────────────────────
  {
    id: 'tpl_trie', pattern: 'Trie (Prefix Tree)', level: 'medium',
    description: 'Word storage with prefix sharing. O(L) insert/search per word where L is word length.',
    template: `class Trie:
    def __init__(self):
        self.root = {}

    def insert(self, word):
        node = self.root
        for c in word:
            if {{1}}:
                node[c] = {}
            node = node[c]
        {{2}}  # mark end-of-word

    def search(self, word):
        node = self.root
        for c in word:
            if {{3}}: return False
            node = node[c]
        return {{4}}`,
    blanks: [
      { q:'Blank 1 — INSERT: when to create a new child', options:['c in node','c not in node','c == \'\'','True'], answerIdx:1, explanation:'Only create a new node when the child for c doesn\'t exist yet. Otherwise REUSE — that\'s prefix sharing.' },
      { q:'Blank 2 — mark end-of-word (using sentinel)', options:['node[\'$\'] = True','node = True','node.is_end = True','node.append(True)'], answerIdx:0, explanation:'Use a sentinel key (e.g., \'$\') that wouldn\'t be a real char. Or a separate flag on a TrieNode class.' },
      { q:'Blank 3 — SEARCH: char not in node', options:['c == node','c not in node','c in node','node[c] is None'], answerIdx:1, explanation:'If the path breaks (char missing), the word isn\'t in the trie. Bail out early.' },
      { q:'Blank 4 — SEARCH: word fully traversed — was it stored as a complete word?', options:['True','\'$\' in node','len(node) > 0','node is not None'], answerIdx:1, explanation:'Just reaching the end of the path doesn\'t mean the word was inserted — it could be a prefix of a longer word. Check the end-marker.' },
    ],
  },
  // ── Greedy (Earliest Finisher) ─────────────────────────────────
  {
    id: 'tpl_greedy_intervals', pattern: 'Greedy (Earliest Finisher)', level: 'medium',
    description: 'Sort by END time; greedily pick non-conflicting intervals. Provably optimal for activity-selection problems.',
    template: `def max_non_overlapping(intervals):
    intervals.sort(key={{1}})
    count, end = 0, float('-inf')
    for s, e in intervals:
        if {{2}}:
            count += 1
            end = {{3}}
    return count`,
    blanks: [
      { q:'Blank 1 — SORT key (greedy correctness depends on this)', options:['lambda x: x[0]','lambda x: x[1]','lambda x: x[1] - x[0]','None'], answerIdx:1, explanation:'Sort by END time. Greedy: earliest-finisher leaves the most room for future picks. Exchange argument proves this is optimal.' },
      { q:'Blank 2 — when to KEEP this interval', options:['s > end','s >= end','e > end','s < end'], answerIdx:1, explanation:'No overlap if the new interval starts at or after the previous interval\'s end. (Use &gt; if "touching" counts as overlap.)' },
      { q:'Blank 3 — update boundary', options:['s','e','max(s, end)','end + 1'], answerIdx:1, explanation:'Track the new "boundary" — the end of the most recently kept interval.' },
    ],
  },
];

const TEMPLATES_PER_SESSION = 4;
