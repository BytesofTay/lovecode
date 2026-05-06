// ── Inverse cards: code → identify the problem and pattern ────────────────
// Trains the unique-to-DSA skill of reading unfamiliar code and naming
// what it is. Mirrors what real interview-shadowing and code review look like.
const INVERSE_CARDS = [
  {
    id: 'inv_two_sum',
    code: `def f(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i`,
    options: ['Two Sum (Hash Map)', 'Contains Duplicate (Set)', '3Sum (Two Pointers)', 'Subarray Sum (Prefix Sum)'],
    answerIdx: 0,
    explanation: 'The "complement lookup" (<code>target - n</code>) plus value→index map is Two Sum\'s signature. Contains Duplicate just stores n itself; 3Sum needs sorting + two pointers.',
  },
  {
    id: 'inv_reverse_list',
    code: `def f(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    options: ['Linked List Cycle (Floyd\'s)', 'Reverse Linked List (3-pointer flip)', 'Merge Two Lists', 'Middle of List (Tortoise/Hare)'],
    answerIdx: 1,
    explanation: 'The four-line dance — save next, flip pointer, advance prev, advance curr — is unmistakably the reverse-list pattern.',
  },
  {
    id: 'inv_binary_search',
    code: `def f(arr, t):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == t: return mid
        elif arr[mid] < t: lo = mid + 1
        else: hi = mid - 1
    return -1`,
    options: ['Linear Search', 'Binary Search', 'Quick Select', 'Interpolation Search'],
    answerIdx: 1,
    explanation: 'Halving the range with <code>lo</code>/<code>hi</code> + the overflow-safe mid form = textbook binary search.',
  },
  {
    id: 'inv_kadane',
    code: `def f(nums):
    cur = best = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`,
    options: ['Maximum Subarray (Kadane\'s)', 'Best Time to Buy/Sell', 'Longest Increasing Subsequence', 'House Robber'],
    answerIdx: 0,
    explanation: '<code>cur = max(x, cur + x)</code> = "extend the running subarray or start fresh at x." That\'s Kadane\'s.',
  },
  {
    id: 'inv_max_depth',
    code: `def f(root):
    if not root: return 0
    return 1 + max(f(root.left), f(root.right))`,
    options: ['Tree Height/Depth', 'Sum of Tree', 'Same Tree', 'Balanced Tree'],
    answerIdx: 0,
    explanation: 'Null → 0, +1 for the current node, max of two subtrees. The +1 and the max are the depth-specific bits.',
  },
  {
    id: 'inv_floyd_cycle',
    code: `def f(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast: return True
    return False`,
    options: ['Reverse List', 'Linked List Cycle (Floyd\'s)', 'Palindrome List', 'Intersection of Lists'],
    answerIdx: 1,
    explanation: 'Two pointers, one moves 1, the other 2 — Floyd\'s tortoise and hare. Meeting = cycle.',
  },
  {
    id: 'inv_bfs',
    code: `from collections import deque
def f(root):
    if not root: return []
    out = []
    q = deque([root])
    while q:
        node = q.popleft()
        out.append(node.val)
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)
    return out`,
    options: ['DFS (recursive)', 'BFS / Level Order', 'In-order Traversal', 'Iterative DFS (stack)'],
    answerIdx: 1,
    explanation: 'deque + popleft + append is classic BFS. A stack with pop() instead of popleft would make this iterative DFS.',
  },
  {
    id: 'inv_subsets',
    code: `def f(nums):
    result, path = [], []
    def go(i):
        if i == len(nums):
            result.append(path[:])
            return
        path.append(nums[i]); go(i+1); path.pop()
        go(i+1)
    go(0)
    return result`,
    options: ['Permutations', 'Subsets (Backtracking)', 'Combinations', 'Word Search'],
    answerIdx: 1,
    explanation: 'Each element gets two branches (include/exclude) — that\'s subsets. Permutations would loop over choices and check "in path."',
  },
  {
    id: 'inv_sliding_window',
    code: `def f(s):
    seen = {}
    L = best = 0
    for R, c in enumerate(s):
        if c in seen and seen[c] >= L:
            L = seen[c] + 1
        seen[c] = R
        best = max(best, R - L + 1)
    return best`,
    options: ['Group Anagrams', 'Longest Substring Without Repeating', 'Find All Anagrams in String', 'Longest Palindromic Substring'],
    answerIdx: 1,
    explanation: 'Sliding window with L jumping past duplicates + tracking max window length = longest no-repeat substring.',
  },
  {
    id: 'inv_valid_parens',
    code: `def f(s):
    stack = []
    pair = {')': '(', ']': '[', '}': '{'}
    for c in s:
        if c in pair:
            if not stack or stack.pop() != pair[c]: return False
        else:
            stack.append(c)
    return not stack`,
    options: ['Decode String', 'Valid Parentheses', 'Min Stack', 'Daily Temperatures'],
    answerIdx: 1,
    explanation: 'Push openers, pop+match on closers. The closer-pair map and the final <code>not stack</code> are the giveaway.',
  },
  {
    id: 'inv_climb_stairs',
    code: `def f(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
    options: ['Climbing Stairs', 'Fibonacci', 'House Robber', 'Both Climbing Stairs and Fibonacci have this exact shape'],
    answerIdx: 3,
    explanation: 'Trick question. The recurrence is identical (a + b). Climbing Stairs(n) == Fib(n+1). The base cases differ subtly but the loop is the same.',
  },
  {
    id: 'inv_top_k',
    code: `import heapq
from collections import Counter
def f(nums, k):
    counts = Counter(nums)
    heap = []
    for val, freq in counts.items():
        heapq.heappush(heap, (freq, val))
        if len(heap) > k:
            heapq.heappop(heap)
    return [v for _, v in heap]`,
    options: ['K Closest Points', 'Top K Frequent Elements', 'Merge K Sorted Lists', 'Find Median from Data Stream'],
    answerIdx: 1,
    explanation: 'Counter + min-heap of size K, ordered by frequency = Top K Frequent. The (freq, val) tuple ordering is the key.',
  },
  {
    id: 'inv_palindrome',
    code: `def f(s):
    L, R = 0, len(s) - 1
    while L < R:
        while L < R and not s[L].isalnum(): L += 1
        while L < R and not s[R].isalnum(): R -= 1
        if s[L].lower() != s[R].lower(): return False
        L += 1; R -= 1
    return True`,
    options: ['Reverse String', 'Longest Palindromic Substring', 'Valid Palindrome', 'Is Subsequence'],
    answerIdx: 2,
    explanation: 'Converging two pointers + skip non-alnum + lowercase compare = Valid Palindrome.',
  },
  {
    id: 'inv_house_robber',
    code: `def f(nums):
    prev2, prev1 = 0, 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1`,
    options: ['Maximum Subarray', 'Climbing Stairs', 'House Robber', 'Best Time to Buy/Sell'],
    answerIdx: 2,
    explanation: 'Two rolling vars + <code>max(skip, take + prev2)</code> = "can\'t take adjacent" → House Robber.',
  },
  {
    id: 'inv_buy_sell',
    code: `def f(prices):
    lo = float('inf')
    profit = 0
    for p in prices:
        lo = min(lo, p)
        profit = max(profit, p - lo)
    return profit`,
    options: ['Best Time to Buy and Sell Stock', 'Maximum Subarray', 'Container With Most Water', 'Trapping Rain Water'],
    answerIdx: 0,
    explanation: 'Track running min + max(profit, p − lo) = single-transaction stock problem.',
  },
];

const INVERSE_PER_SESSION = 8;
