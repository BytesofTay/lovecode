// ── Fill-in-the-blank snippet challenges ─────────────────────────────────────
// Each snippet has ONE critical blank marked with `{{1}}` in the code string.
// User picks from 3-4 MC options. Designed to drill the moments where students
// usually pause: the complement line, the flip step, the off-by-one, etc.
const SNIPPET_CHALLENGES = [
  {
    id: 'sn_two_sum_complement',
    problem: 'Two Sum',
    pattern: 'Hash Map',
    level: 'easy',
    brief: 'Return indices of the two numbers in <code>nums</code> that add up to <code>target</code>.',
    code: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if {{1}} in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []`,
    options: ['n - target', 'target - n', 'target + n', 'n'],
    answerIdx: 1,
    explanation: 'You want a value <code>y</code> such that <code>n + y = target</code>. Algebra gives <code>y = target − n</code>. That\'s the complement we look up.',
  },
  {
    id: 'sn_two_sum_store_order',
    problem: 'Two Sum',
    pattern: 'Hash Map',
    level: 'easy',
    brief: 'Why is <code>seen[n] = i</code> AFTER the check, not before?',
    code: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        {{1}}
    return []`,
    options: [
      'seen[i] = n   # store index → value',
      'seen[n] = i   # store value → index',
      'seen[target] = n',
      'seen[target - n] = i',
    ],
    answerIdx: 1,
    explanation: 'We store value → index so a later iteration can ask "have I seen the complement?" and get back where it was.',
  },
  {
    id: 'sn_reverse_ll_flip',
    problem: 'Reverse Linked List',
    pattern: 'Pointer Manipulation',
    level: 'easy',
    brief: 'In-place reversal of a singly linked list using three pointers.',
    code: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        {{1}}
        prev = curr
        curr = nxt
    return prev`,
    options: [
      'curr.next = nxt',
      'curr.next = prev',
      'prev.next = curr',
      'nxt.next = curr',
    ],
    answerIdx: 1,
    explanation: 'The actual reversal step. <code>curr.next</code> was pointing forward; we redirect it backward to the previously-flipped node.',
  },
  {
    id: 'sn_reverse_ll_save',
    problem: 'Reverse Linked List',
    pattern: 'Pointer Manipulation',
    level: 'easy',
    brief: 'Why save <code>nxt</code> BEFORE flipping <code>curr.next</code>?',
    code: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        {{1}}
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    options: [
      'nxt = prev',
      'nxt = curr',
      'nxt = curr.next',
      'nxt = head',
    ],
    answerIdx: 2,
    explanation: 'Once we overwrite <code>curr.next</code> with <code>prev</code>, the rest of the list is lost unless we saved it first.',
  },
  {
    id: 'sn_binary_search_mid',
    problem: 'Binary Search',
    pattern: 'Binary Search',
    level: 'easy',
    brief: 'Find target in a sorted array. Use the overflow-safe mid form.',
    code: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = {{1}}
        if arr[mid] == target: return mid
        elif arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1`,
    options: [
      '(lo + hi) // 2',
      'lo + (hi - lo) // 2',
      'hi - (hi - lo) // 2',
      '(hi - lo) // 2',
    ],
    answerIdx: 1,
    explanation: '<code>(lo + hi) // 2</code> can overflow in Java/C++ when both are near INT_MAX. <code>lo + (hi - lo) // 2</code> is the portable form.',
  },
  {
    id: 'sn_binary_search_lo_update',
    problem: 'Binary Search',
    pattern: 'Binary Search',
    level: 'easy',
    brief: 'When <code>arr[mid] &lt; target</code>, how do we shrink the range?',
    code: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: {{1}}
        else: hi = mid - 1
    return -1`,
    options: [
      'lo = mid',
      'lo = mid + 1',
      'lo = mid - 1',
      'hi = mid + 1',
    ],
    answerIdx: 1,
    explanation: 'We already checked <code>mid</code>; exclude it from the next range. Without the +1, the loop can spin forever when <code>lo == hi</code>.',
  },
  {
    id: 'sn_sliding_window_jump',
    problem: 'Longest Substring Without Repeating Characters',
    pattern: 'Sliding Window',
    level: 'medium',
    brief: 'Eviction step when a duplicate enters the window.',
    code: `def length_of_longest_substring(s):
    seen = {}
    L = best = 0
    for R, c in enumerate(s):
        if c in seen and seen[c] >= L:
            {{1}}
        seen[c] = R
        best = max(best, R - L + 1)
    return best`,
    options: [
      'L = L + 1',
      'L = seen[c]',
      'L = seen[c] + 1',
      'L = R',
    ],
    answerIdx: 2,
    explanation: 'Jump <code>L</code> to one past the previous occurrence — evicts the duplicate in a single step. Sliding by 1 works but degrades to O(n²) on adversarial inputs.',
  },
  {
    id: 'sn_sliding_window_check',
    problem: 'Longest Substring Without Repeating Characters',
    pattern: 'Sliding Window',
    level: 'medium',
    brief: 'How do we know if <code>c</code> is a duplicate INSIDE the current window?',
    code: `def length_of_longest_substring(s):
    seen = {}
    L = best = 0
    for R, c in enumerate(s):
        if {{1}}:
            L = seen[c] + 1
        seen[c] = R
        best = max(best, R - L + 1)
    return best`,
    options: [
      'c in seen',
      'c in seen and seen[c] >= L',
      'c in seen and seen[c] > R',
      'seen[c] == L',
    ],
    answerIdx: 1,
    explanation: 'A previous occurrence to the LEFT of the window doesn\'t count. We need the prior position to be inside <code>[L, R]</code>.',
  },
  {
    id: 'sn_factorial_base',
    problem: 'Factorial',
    pattern: 'Recursion',
    level: 'easy',
    brief: 'The base case is the most important line — get it wrong and you crash.',
    code: `def fact(n):
    if {{1}}:
        return 1
    return n * fact(n - 1)`,
    options: [
      'n == 0',
      'n <= 1',
      'n > 1',
      'n == 1',
    ],
    answerIdx: 1,
    explanation: '<code>n &lt;= 1</code> covers both 0! = 1 and 1! = 1, AND defends against negative inputs. Stricter forms can miss edge cases.',
  },
  {
    id: 'sn_factorial_recurse',
    problem: 'Factorial',
    pattern: 'Recursion',
    level: 'easy',
    brief: 'Why must the recursive call shrink the input?',
    code: `def fact(n):
    if n <= 1:
        return 1
    return n * fact({{1}})`,
    options: [
      'n',
      'n + 1',
      'n - 1',
      'n // 2',
    ],
    answerIdx: 2,
    explanation: 'Each call must move CLOSER to the base case. <code>fact(n)</code> calling <code>fact(n)</code> = infinite recursion → stack overflow.',
  },
  {
    id: 'sn_fib_tuple_swap',
    problem: 'Fibonacci (bottom-up DP)',
    pattern: 'Dynamic Programming',
    level: 'easy',
    brief: 'Constant-space Fibonacci using two rolling variables.',
    code: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        {{1}}
    return a`,
    options: [
      'a = b; b = a + b',
      'a, b = b, a + b',
      'b, a = a + b, b',
      'a = a + b',
    ],
    answerIdx: 1,
    explanation: 'The tuple form evaluates the entire right-hand side BEFORE assigning. The first option corrupts <code>a</code> before computing <code>a + b</code>.',
  },
  {
    id: 'sn_fib_memo_cache',
    problem: 'Fibonacci (memoized)',
    pattern: 'Memoization',
    level: 'easy',
    brief: 'Top-down DP with a cache. The cache check turns O(2ⁿ) into O(n).',
    code: `def fib(n, cache={}):
    if n < 2: return n
    if {{1}}:
        return cache[n]
    cache[n] = fib(n - 1, cache) + fib(n - 2, cache)
    return cache[n]`,
    options: [
      'n in cache',
      'cache[n]',
      'cache.get(n)',
      'len(cache) > n',
    ],
    answerIdx: 0,
    explanation: '<code>n in cache</code> tests for membership. The other forms either error on missing keys or have wrong semantics.',
  },
  {
    id: 'sn_subsets_snapshot',
    problem: 'Subsets',
    pattern: 'Backtracking',
    level: 'medium',
    brief: 'Generate every subset of <code>nums</code>. The path mutates as we recurse.',
    code: `def subsets(nums):
    result, path = [], []
    def backtrack(i):
        if i == len(nums):
            result.append({{1}})
            return
        path.append(nums[i])
        backtrack(i + 1)
        path.pop()
        backtrack(i + 1)
    backtrack(0)
    return result`,
    options: [
      'path',
      'path[:]',
      'list(path[0])',
      'nums[:i]',
    ],
    answerIdx: 1,
    explanation: '<code>path[:]</code> creates a SNAPSHOT. Appending <code>path</code> directly stores a reference — every entry would point to the same (eventually-empty) list.',
  },
  {
    id: 'sn_subsets_unchoose',
    problem: 'Subsets',
    pattern: 'Backtracking',
    level: 'medium',
    brief: 'The "un-choose" step is what makes backtracking work.',
    code: `def subsets(nums):
    result, path = [], []
    def backtrack(i):
        if i == len(nums):
            result.append(path[:])
            return
        path.append(nums[i])
        backtrack(i + 1)
        {{1}}
        backtrack(i + 1)
    backtrack(0)
    return result`,
    options: [
      'path.clear()',
      'path = []',
      'path.pop()',
      'del path[i]',
    ],
    answerIdx: 2,
    explanation: 'Pop the last element so the "exclude nums[i]" branch starts clean. Clearing or reassigning would wipe the whole path.',
  },
  {
    id: 'sn_max_depth_combine',
    problem: 'Maximum Depth of Binary Tree',
    pattern: 'Tree Recursion',
    level: 'easy',
    brief: 'Universal tree recursion: handle null, recurse, combine.',
    code: `def max_depth(root):
    if not root:
        return 0
    return {{1}}`,
    options: [
      'max_depth(root.left) + max_depth(root.right)',
      'max(max_depth(root.left), max_depth(root.right))',
      '1 + max(max_depth(root.left), max_depth(root.right))',
      '1 + max_depth(root.left) + max_depth(root.right)',
    ],
    answerIdx: 2,
    explanation: '+1 counts the current node; <code>max</code> picks the deeper subtree. Adding both children would count nodes, not depth.',
  },
  {
    id: 'sn_anagram_decrement',
    problem: 'Valid Anagram',
    pattern: 'Hash Map / Counter',
    level: 'easy',
    brief: 'Count chars in <code>s</code>; walk <code>t</code> decrementing.',
    code: `def is_anagram(s, t):
    if len(s) != len(t): return False
    counts = {}
    for c in s: counts[c] = counts.get(c, 0) + 1
    for c in t:
        if {{1}}:
            return False
        counts[c] -= 1
    return True`,
    options: [
      'c not in counts',
      'counts.get(c, 0) == 0',
      'c not in counts or counts[c] == 0',
      'counts[c] < 0',
    ],
    answerIdx: 2,
    explanation: 'Either the char never appeared in <code>s</code> (<code>not in counts</code>) OR it appeared but is already exhausted (<code>== 0</code>). Either way, not an anagram.',
  },
  {
    id: 'sn_3sum_dup_skip',
    problem: '3Sum',
    pattern: 'Two Pointers + Sort',
    level: 'medium',
    brief: 'Why skip duplicate anchors after sorting?',
    code: `def three_sum(nums):
    nums.sort()
    out = []
    for i in range(len(nums) - 2):
        if {{1}}:
            continue
        L, R = i + 1, len(nums) - 1
        # ... two-pointer scan ...
    return out`,
    options: [
      'nums[i] == nums[i + 1]',
      'i > 0 and nums[i] == nums[i - 1]',
      'nums[i] == 0',
      'i == 0',
    ],
    answerIdx: 1,
    explanation: 'After sorting, equal anchors produce identical triplets. Skip if the previous anchor was the same — but only after the first iteration.',
  },
  {
    id: 'sn_palindrome_loop',
    problem: 'Valid Palindrome',
    pattern: 'Two Pointers',
    level: 'easy',
    brief: 'Two pointers converging from both ends.',
    code: `def is_palindrome(s):
    L, R = 0, len(s) - 1
    while {{1}}:
        while L < R and not s[L].isalnum(): L += 1
        while L < R and not s[R].isalnum(): R -= 1
        if s[L].lower() != s[R].lower(): return False
        L += 1; R -= 1
    return True`,
    options: [
      'L <= R',
      'L < R',
      'L < len(s)',
      'L != R',
    ],
    answerIdx: 1,
    explanation: 'Strict <code>&lt;</code> — when <code>L == R</code>, it\'s a single middle char that trivially equals itself. No need to compare.',
  },
  {
    id: 'sn_bfs_pop',
    problem: 'BFS / Level Order',
    pattern: 'BFS',
    level: 'easy',
    brief: 'Which side of the deque do we pop from for BFS?',
    code: `from collections import deque
def bfs(root):
    if not root: return
    q = deque([root])
    while q:
        node = q.{{1}}()
        # visit node
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)`,
    options: [
      'pop',
      'popleft',
      'remove',
      'pop_front',
    ],
    answerIdx: 1,
    explanation: '<code>popleft</code> takes from the FRONT (FIFO) → that\'s what makes it breadth-first. <code>pop</code> would give DFS-like behavior.',
  },
  {
    id: 'sn_top_k_heap_push',
    problem: 'Top K Frequent Elements',
    pattern: 'Heap',
    level: 'medium',
    brief: 'Min-heap of size K — what\'s the right tuple ordering?',
    code: `import heapq
from collections import Counter
def top_k_frequent(nums, k):
    counts = Counter(nums)
    heap = []
    for val, freq in counts.items():
        heapq.heappush(heap, {{1}})
        if len(heap) > k:
            heapq.heappop(heap)
    return [v for _, v in heap]`,
    options: [
      '(val, freq)',
      '(freq, val)',
      '(-freq, val)',
      '(val, -freq)',
    ],
    answerIdx: 1,
    explanation: 'Python heaps order by the first tuple element. We want the SMALLEST frequency at the front so we can pop it when size exceeds K.',
  },
  {
    id: 'sn_climbing_stairs',
    problem: 'Climbing Stairs',
    pattern: 'Dynamic Programming',
    level: 'easy',
    brief: 'Each step you take 1 or 2 stairs. How many ways to reach step n?',
    code: `def climb_stairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, {{1}}
    return b`,
    options: [
      'a * b',
      'a + b',
      'b + 1',
      'a + 1',
    ],
    answerIdx: 1,
    explanation: 'Recurrence: ways(n) = ways(n−1) + ways(n−2). Same as Fibonacci shape.',
  },
  {
    id: 'sn_coin_change_dp',
    problem: 'Coin Change',
    pattern: 'Dynamic Programming',
    level: 'medium',
    brief: 'Fewest coins to make <code>amount</code>. dp[i] = min coins for amount i.',
    code: `def coin_change(coins, amount):
    dp = [{{1}}] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if c <= i:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    options: [
      '0',
      '-1',
      'float(\'inf\')',
      'amount',
    ],
    answerIdx: 2,
    explanation: 'Sentinel for "impossible." Using 0 would make every subproblem look solvable; -1 breaks the <code>min</code>.',
  },
  {
    id: 'sn_cycle_detection',
    problem: 'Linked List Cycle',
    pattern: 'Floyd\'s Tortoise and Hare',
    level: 'easy',
    brief: 'Detect a cycle with O(1) extra space.',
    code: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = {{1}}
        if slow == fast:
            return True
    return False`,
    options: [
      'fast.next',
      'fast.next.next',
      'slow.next',
      'head.next',
    ],
    answerIdx: 1,
    explanation: 'Fast moves TWO nodes per step (slow moves one). The differential is what guarantees they meet inside any cycle.',
  },
  {
    id: 'sn_middle_node',
    problem: 'Middle of the Linked List',
    pattern: 'Tortoise and Hare',
    level: 'easy',
    brief: 'Find the middle node in one pass.',
    code: `def middle_node(head):
    slow = fast = head
    while {{1}}:
        slow = slow.next
        fast = fast.next.next
    return slow`,
    options: [
      'fast',
      'fast.next',
      'fast and fast.next',
      'slow.next',
    ],
    answerIdx: 2,
    explanation: 'We need both <code>fast</code> AND <code>fast.next</code> to be non-null before stepping two — otherwise <code>fast.next.next</code> crashes on odd/even length.',
  },
  {
    id: 'sn_word_search_visited',
    problem: 'Word Search',
    pattern: 'Backtracking on Grid',
    level: 'medium',
    brief: 'Mark a cell visited without using extra memory.',
    code: `def dfs(r, c, i):
    if i == len(word): return True
    if r < 0 or r >= R or c < 0 or c >= C or board[r][c] != word[i]:
        return False
    saved = board[r][c]
    board[r][c] = {{1}}
    found = (dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1))
    board[r][c] = saved
    return found`,
    options: [
      '0',
      'None',
      '"#"',
      '""',
    ],
    answerIdx: 2,
    explanation: 'Overwrite with a sentinel that won\'t match any letter. Then restore afterward — classic in-place backtracking.',
  },
  {
    id: 'sn_course_schedule',
    problem: 'Course Schedule',
    pattern: 'Topological Sort (Kahn\'s)',
    level: 'medium',
    brief: 'BFS topological sort. Nodes with in-degree 0 are ready.',
    code: `from collections import deque
def can_finish(n, prereqs):
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in prereqs:
        graph[b].append(a); indeg[a] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    taken = 0
    while q:
        u = q.popleft(); taken += 1
        for v in graph[u]:
            indeg[v] -= 1
            if {{1}}:
                q.append(v)
    return taken == n`,
    options: [
      'indeg[v] > 0',
      'indeg[v] == 0',
      'indeg[v] < 0',
      'v not in q',
    ],
    answerIdx: 1,
    explanation: 'A node becomes "ready" exactly when its last prerequisite is satisfied — i.e., its in-degree hits 0.',
  },
  {
    id: 'sn_max_subarray',
    problem: 'Maximum Subarray (Kadane\'s)',
    pattern: 'DP / Greedy',
    level: 'easy',
    brief: 'Running sum: extend the current subarray OR start fresh.',
    code: `def max_subarray(nums):
    cur = best = nums[0]
    for x in nums[1:]:
        cur = {{1}}
        best = max(best, cur)
    return best`,
    options: [
      'cur + x',
      'max(x, cur + x)',
      'min(x, cur + x)',
      'max(cur, x)',
    ],
    answerIdx: 1,
    explanation: 'Either continue the running subarray (<code>cur + x</code>) or restart at <code>x</code> if continuing makes things worse.',
  },
  {
    id: 'sn_buy_sell_stock',
    problem: 'Best Time to Buy and Sell Stock',
    pattern: 'Greedy / Single Pass',
    level: 'easy',
    brief: 'One transaction. Track minimum price seen so far.',
    code: `def max_profit(prices):
    lo = float('inf')
    profit = 0
    for p in prices:
        lo = min(lo, p)
        profit = {{1}}
    return profit`,
    options: [
      'max(profit, p)',
      'profit + p - lo',
      'max(profit, p - lo)',
      'min(profit, p - lo)',
    ],
    answerIdx: 2,
    explanation: 'At each price, the best sale is "current price minus the lowest price seen so far." Track the running max of that.',
  },
  {
    id: 'sn_valid_parens_stack',
    problem: 'Valid Parentheses',
    pattern: 'Stack',
    level: 'easy',
    brief: 'Push openers; on a closer, the stack top must match.',
    code: `def is_valid(s):
    stack = []
    pair = {')': '(', ']': '[', '}': '{'}
    for c in s:
        if c in pair:
            if not stack or {{1}}:
                return False
        else:
            stack.append(c)
    return not stack`,
    options: [
      'stack[-1] != pair[c]',
      'stack.pop() != pair[c]',
      'stack[0] != pair[c]',
      'pair[c] != stack.pop()',
    ],
    answerIdx: 3,
    explanation: 'We need to BOTH check AND remove the top. The pop-and-compare in one expression handles it. Option 1 leaves the opener on the stack.',
  },
  {
    id: 'sn_house_robber',
    problem: 'House Robber',
    pattern: 'DP',
    level: 'medium',
    brief: 'Can\'t rob two adjacent houses. Max amount you can rob.',
    code: `def rob(nums):
    prev2, prev1 = 0, 0
    for x in nums:
        prev2, prev1 = prev1, {{1}}
    return prev1`,
    options: [
      'prev1 + x',
      'max(prev1, prev2 + x)',
      'min(prev1, prev2 + x)',
      'prev2 + x',
    ],
    answerIdx: 1,
    explanation: 'At each house: rob it (<code>prev2 + x</code>, must skip last) or skip it (<code>prev1</code>). Take the better.',
  },
];

const SNIPPETS_PER_SESSION = 12;
