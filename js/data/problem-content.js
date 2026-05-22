// ── Beginner-oriented per-problem content ───────────────────────────────────
// Each entry adds four learning aids to the Problems tab:
//   hints       — three graduated nudges, reveal one at a time
//   bruteForce  — show the obvious O(n²)-style version FIRST, then the optimal
//   pseudocode  — English-bullet algorithm before any Python
//   tests       — runnable in-browser via Pyodide
//   starter     — scaffold for the textarea (function signature only)
//
// Falls back gracefully: problems without an entry behave exactly as before.
// To add more, copy any entry below — the schema is intentionally flat.

// Shared Python preambles for problems with non-primitive I/O.
// Test setup blocks reference these so user code can stay focused on the algorithm.
const LL_SETUP = `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def _list_to_ll(arr):
    dummy = ListNode()
    cur = dummy
    for v in arr:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def _ll_to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out
`;

const LL_CYCLE_SETUP = LL_SETUP + `
def _build_cycle_list(values, pos):
    if not values: return None
    nodes = [ListNode(v) for v in values]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if pos >= 0:
        nodes[-1].next = nodes[pos]
    return nodes[0]

def _transform_input(args):
    return [_build_cycle_list(args[0], args[1])]
`;

const LL_ONE_SETUP = LL_SETUP + `
def _transform_input(args):
    return [_list_to_ll(args[0])]

def _transform_output(node):
    return _ll_to_list(node)
`;

const LL_TWO_SETUP = LL_SETUP + `
def _transform_input(args):
    return [_list_to_ll(args[0]), _list_to_ll(args[1])]

def _transform_output(node):
    return _ll_to_list(node)
`;

// Linked list with one list-arg and one int-arg (e.g. Remove Nth Node).
// Pattern: [values, n]  →  [head: ListNode, n: int]  → returned ListNode → list
const LL_ONE_PLUS_INT_SETUP = LL_SETUP + `
def _transform_input(args):
    return [_list_to_ll(args[0]), args[1]]

def _transform_output(node):
    return _ll_to_list(node)
`;

const TREE_SETUP = `
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def _list_to_tree(arr):
    if not arr: return None
    root = TreeNode(arr[0])
    q = deque([root])
    i = 1
    while q and i < len(arr):
        node = q.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i]); q.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i]); q.append(node.right)
        i += 1
    return root

def _tree_to_list(root):
    if not root: return []
    out, q = [], deque([root])
    while q:
        node = q.popleft()
        if node is None:
            out.append(None)
        else:
            out.append(node.val)
            q.append(node.left)
            q.append(node.right)
    while out and out[-1] is None:
        out.pop()
    return out
`;

const TREE_ONE_SETUP = TREE_SETUP + `
def _transform_input(args):
    return [_list_to_tree(args[0])]
`;

const TREE_ONE_OUT_SETUP = TREE_SETUP + `
def _transform_input(args):
    return [_list_to_tree(args[0])]

def _transform_output(root):
    return _tree_to_list(root)
`;

const TREE_TWO_SETUP = TREE_SETUP + `
def _transform_input(args):
    return [_list_to_tree(args[0]), _list_to_tree(args[1])]
`;

const PROBLEM_CONTENT = {
  1: {  // Two Sum
    hints: [
      "What information would let you answer 'is X in the array?' in one step instead of scanning?",
      "For each number `x`, the partner you need is `target − x`. Where could you store numbers you've already seen so the partner lookup is O(1)?",
      "Walk the array once with a hash map of `value → index`. Before inserting `nums[i]`, check if `target − nums[i]` is already a key — if so, return its index and `i`."
    ],
    bruteForce: {
      idea: "Check every pair (i, j) with i < j and see if they sum to target.",
      code:
`def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
      time: "O(n²)",
      space: "O(1)",
      whyItWorks: "Exhaustive — guaranteed to find the pair if one exists. But for n = 10⁴, that's 10⁸ comparisons. Too slow.",
      howToOptimize: "The inner loop asks 'does target − nums[i] exist later in the array?' If we had a way to answer that in O(1), we'd be linear. → Hash map."
    },
    pseudocode: [
      "Create an empty hash map called `seen` (value → index)",
      "For each index i, with value x = nums[i]:",
      "  Compute the partner needed: complement = target − x",
      "  If complement is already a key in `seen`, return [seen[complement], i]",
      "  Otherwise, record seen[x] = i and continue",
      "If we finish the loop without returning, no pair exists"
    ],
    tests: {
      funcName: "two_sum",
      cases: [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { input: [[3, 2, 4], 6], expected: [1, 2] },
        { input: [[3, 3], 6], expected: [0, 1] },
        { input: [[-3, 4, 3, 90], 0], expected: [0, 2] }
      ]
    },
    starter:
`def two_sum(nums, target):
    # Return indices [i, j] such that nums[i] + nums[j] == target.
    # You may assume exactly one solution exists.
    pass`,
    optimalCode:
`def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []`
  },

  2: {  // Best Time to Buy and Sell Stock
    hints: [
      "On any given day you sell, what single number from the past determines your max profit?",
      "If you knew the *minimum* price seen before each day, the profit on that day is just `today − min_so_far`. Track that as you scan.",
      "One pass: keep a running `min_price` and a running `best_profit`. For each price, update best_profit = max(best_profit, price − min_price), then update min_price."
    ],
    bruteForce: {
      idea: "For every buy day i, try every sell day j > i and track the best (price[j] − price[i]).",
      code:
`def max_profit(prices):
    best = 0
    for i in range(len(prices)):
        for j in range(i + 1, len(prices)):
            best = max(best, prices[j] - prices[i])
    return best`,
      time: "O(n²)",
      space: "O(1)",
      whyItWorks: "Tries every possible buy/sell pair, so it cannot miss the optimum.",
      howToOptimize: "Notice: the *best sell day so far* only cares about the *cheapest buy day so far*. You don't need to revisit earlier buys — just remember the minimum."
    },
    pseudocode: [
      "Initialize min_price = infinity, best_profit = 0",
      "For each price in prices:",
      "  If price < min_price, update min_price = price (cheaper buy day)",
      "  Else, candidate = price − min_price; if candidate > best_profit, update",
      "Return best_profit"
    ],
    tests: {
      funcName: "max_profit",
      cases: [
        { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
        { input: [[7, 6, 4, 3, 1]], expected: 0 },
        { input: [[1, 2]], expected: 1 },
        { input: [[5]], expected: 0 },
        { input: [[2, 4, 1]], expected: 2 }
      ]
    },
    starter:
`def max_profit(prices):
    # prices[i] = stock price on day i. Pick one day to buy and a later day to sell.
    # Return the max profit, or 0 if no profit is possible.
    pass`,
    optimalCode:
`def max_profit(prices):
    min_price = float('inf')
    best = 0
    for p in prices:
        if p < min_price:
            min_price = p
        else:
            best = max(best, p - min_price)
    return best`
  },

  3: {  // Contains Duplicate
    hints: [
      "What's the simplest data structure that answers 'have I seen this value before?' in O(1)?",
      "Add values to a set as you go. Before adding, check if it's already in the set.",
      "Alternative: sort the array and check adjacent pairs — O(n log n) time, O(1) extra space."
    ],
    bruteForce: {
      idea: "For each pair (i, j) with i < j, check whether nums[i] == nums[j].",
      code:
`def contains_duplicate(nums):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False`,
      time: "O(n²)",
      space: "O(1)",
      whyItWorks: "Exhaustive pair comparison — catches any duplicate.",
      howToOptimize: "Pair comparison is the wrong frame. Reframe as 'have I seen this value before?' — that's a set membership question."
    },
    pseudocode: [
      "Create an empty set called `seen`",
      "For each value x in nums:",
      "  If x is already in `seen`, return True",
      "  Otherwise, add x to `seen`",
      "Return False after the loop completes"
    ],
    tests: {
      funcName: "contains_duplicate",
      cases: [
        { input: [[1, 2, 3, 1]], expected: true },
        { input: [[1, 2, 3, 4]], expected: false },
        { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
        { input: [[]], expected: false },
        { input: [[7]], expected: false }
      ]
    },
    starter:
`def contains_duplicate(nums):
    # Return True if any value appears at least twice, else False.
    pass`,
    optimalCode:
`def contains_duplicate(nums):
    seen = set()
    for n in nums:
        if n in seen:
            return True
        seen.add(n)
    return False`
  },

  5: {  // Maximum Subarray
    hints: [
      "At each index, you only need to decide one thing: extend the current subarray, or start fresh from here?",
      "Define `current = max(nums[i], current + nums[i])`. Whichever is larger is the best subarray ending at i.",
      "This is Kadane's algorithm. Keep `current` (best ending here) and `best` (best seen so far). Update both each step."
    ],
    bruteForce: {
      idea: "Try every contiguous subarray (i, j) and track the max sum.",
      code:
`def max_subarray(nums):
    best = nums[0]
    for i in range(len(nums)):
        total = 0
        for j in range(i, len(nums)):
            total += nums[j]
            if total > best:
                best = total
    return best`,
      time: "O(n²)",
      space: "O(1)",
      whyItWorks: "Examines every possible contiguous slice, so the maximum is certainly seen.",
      howToOptimize: "Insight: if the running sum ever goes negative, it can only HURT a future subarray — so reset. That collapses two nested loops into one."
    },
    pseudocode: [
      "Initialize current = nums[0], best = nums[0]",
      "For each i from 1 to len(nums) − 1:",
      "  current = max(nums[i], current + nums[i])  // start fresh or extend?",
      "  best = max(best, current)",
      "Return best"
    ],
    tests: {
      funcName: "max_subarray",
      cases: [
        { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
        { input: [[1]], expected: 1 },
        { input: [[5, 4, -1, 7, 8]], expected: 23 },
        { input: [[-3, -2, -5]], expected: -2 },
        { input: [[-1]], expected: -1 }
      ]
    },
    starter:
`def max_subarray(nums):
    # Return the largest sum of any contiguous subarray (must contain at least one element).
    pass`,
    optimalCode:
`def max_subarray(nums):
    current = best = nums[0]
    for n in nums[1:]:
        current = max(n, current + n)
        best = max(best, current)
    return best`
  },

  12: {  // Number of 1 Bits
    hints: [
      "The naive way: check each of the 32 bits one at a time using `n & 1`, then shift.",
      "There's a slicker trick: `n & (n − 1)` clears the lowest set bit. Count how many times you can do that before n becomes 0.",
      "Loop: count = 0; while n: n &= (n − 1); count += 1. Return count."
    ],
    bruteForce: {
      idea: "Walk through all 32 bit positions and count which are set.",
      code:
`def hamming_weight(n):
    count = 0
    for _ in range(32):
        count += n & 1
        n >>= 1
    return count`,
      time: "O(1)  (32 iterations max)",
      space: "O(1)",
      whyItWorks: "Inspects every bit explicitly — always works, no cleverness needed.",
      howToOptimize: "If only a few bits are set (sparse case), you waste loops on zeros. `n & (n−1)` jumps directly to the next set bit."
    },
    pseudocode: [
      "Initialize count = 0",
      "While n != 0:",
      "  n = n & (n − 1)   // clears the lowest 1-bit",
      "  count = count + 1",
      "Return count"
    ],
    tests: {
      funcName: "hamming_weight",
      cases: [
        { input: [11], expected: 3 },           // 1011
        { input: [128], expected: 1 },          // 10000000
        { input: [0], expected: 0 },
        { input: [4294967293], expected: 31 },  // all 1s except bit 1
        { input: [1], expected: 1 }
      ]
    },
    starter:
`def hamming_weight(n):
    # Return the number of '1' bits in the binary representation of n.
    pass`,
    optimalCode:
`def hamming_weight(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count`
  },

  16: {  // Climbing Stairs
    hints: [
      "To reach step n, your last move was either +1 (from step n−1) or +2 (from step n−2). So ways(n) = ways(n−1) + ways(n−2).",
      "That's the Fibonacci recurrence. Base cases: ways(1) = 1, ways(2) = 2.",
      "You don't need the full array — just keep the last two values rolling forward."
    ],
    bruteForce: {
      idea: "Recursively compute ways(n) = ways(n−1) + ways(n−2). No memoization.",
      code:
`def climb_stairs(n):
    if n <= 2:
        return n
    return climb_stairs(n - 1) + climb_stairs(n - 2)`,
      time: "O(2ⁿ)",
      space: "O(n)  (recursion stack)",
      whyItWorks: "Direct translation of the recurrence — the answer is the count of distinct paths in the call tree.",
      howToOptimize: "The recursion recomputes the same subproblems many times (ways(n−2) appears in both branches). Memoize it, or iterate bottom-up with two rolling variables → O(n) time, O(1) space."
    },
    pseudocode: [
      "If n ≤ 2, return n  (base cases)",
      "Initialize prev2 = 1, prev1 = 2  (ways to reach step 1 and step 2)",
      "For i from 3 to n:",
      "  current = prev1 + prev2",
      "  prev2 = prev1",
      "  prev1 = current",
      "Return prev1"
    ],
    tests: {
      funcName: "climb_stairs",
      cases: [
        { input: [1], expected: 1 },
        { input: [2], expected: 2 },
        { input: [3], expected: 3 },
        { input: [4], expected: 5 },
        { input: [5], expected: 8 },
        { input: [10], expected: 89 }
      ]
    },
    starter:
`def climb_stairs(n):
    # Each step you can climb 1 or 2 stairs. How many distinct ways to reach step n?
    pass`,
    optimalCode:
`def climb_stairs(n):
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1`
  },

  13: {  // Counting Bits
    hints: [
      "You could call your `hamming_weight` n+1 times — that works but is O(n log n). Can previous answers help compute the current one?",
      "For any i, `bits(i) = bits(i >> 1) + (i & 1)`. The number of 1-bits in i is the bits in i//2 plus 1 if the last bit is set.",
      "Build a dp array of size n+1, dp[0] = 0, dp[i] = dp[i >> 1] + (i & 1)."
    ],
    bruteForce: {
      idea: "For each integer 0..n, count its 1-bits independently (e.g. via Brian Kernighan's `n & (n−1)` trick).",
      code:
`def count_bits(n):
    def popcount(x):
        c = 0
        while x:
            x &= x - 1
            c += 1
        return c
    return [popcount(i) for i in range(n + 1)]`,
      time: "O(n log n)  (popcount is O(log n) per number)",
      space: "O(n)  (output)",
      whyItWorks: "Independently counts the bits of every integer up to n.",
      howToOptimize: "Observation: bits(i) and bits(i//2) differ by at most 1 — the last bit of i. So we can reuse dp[i >> 1] to get O(1) per value."
    },
    pseudocode: [
      "Allocate dp array of size n + 1; dp[0] = 0",
      "For i from 1 to n:",
      "  dp[i] = dp[i >> 1] + (i & 1)   // bits in i//2, plus 1 if i is odd",
      "Return dp"
    ],
    tests: {
      funcName: "count_bits",
      cases: [
        { input: [0], expected: [0] },
        { input: [2], expected: [0, 1, 1] },
        { input: [5], expected: [0, 1, 1, 2, 1, 2] },
        { input: [8], expected: [0, 1, 1, 2, 1, 2, 2, 3, 1] }
      ]
    },
    starter:
`def count_bits(n):
    # Return a list of length n+1 where result[i] = number of 1-bits in i.
    pass`,
    optimalCode:
`def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp`
  },

  14: {  // Missing Number
    hints: [
      "Sum trick: the sum 0+1+…+n has a closed form. The difference from the actual sum is the missing number.",
      "Even slicker — XOR everything together. XOR each index 0..n with each value. The missing number is what survives.",
      "Why XOR works: a ^ a = 0 and a ^ 0 = a. Every present value cancels with its matching index; only the missing one is left."
    ],
    bruteForce: {
      idea: "Sort, then scan for the first gap.",
      code:
`def missing_number(nums):
    nums = sorted(nums)
    for i, v in enumerate(nums):
        if i != v:
            return i
    return len(nums)`,
      time: "O(n log n)",
      space: "O(1)",
      whyItWorks: "After sorting, the first index where i != nums[i] is the missing value.",
      howToOptimize: "Sorting is overkill — we don't need order, just totals. Sum or XOR collapses this to O(n) time, O(1) space."
    },
    pseudocode: [
      "Initialize result = len(nums)  // covers the case where n itself is missing",
      "For i, v in enumerate(nums):",
      "  result = result XOR i XOR v",
      "Return result"
    ],
    tests: {
      funcName: "missing_number",
      cases: [
        { input: [[3, 0, 1]], expected: 2 },
        { input: [[0, 1]], expected: 2 },
        { input: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
        { input: [[0]], expected: 1 },
        { input: [[1]], expected: 0 }
      ]
    },
    starter:
`def missing_number(nums):
    # nums contains n distinct numbers from 0..n. Return the one missing.
    pass`,
    optimalCode:
`def missing_number(nums):
    result = len(nums)
    for i, v in enumerate(nums):
        result ^= i ^ v
    return result`
  },

  15: {  // Reverse Bits
    hints: [
      "Process exactly 32 bits. For each bit position in n, place it at the mirror position in the result.",
      "Loop 32 times: shift result left by 1, OR in the lowest bit of n, then shift n right by 1.",
      "After 32 iterations you've moved the LSB of n into the MSB of result, and so on."
    ],
    bruteForce: {
      idea: "Convert to a 32-bit binary string, reverse it, parse back to int.",
      code:
`def reverse_bits(n):
    return int(bin(n)[2:].zfill(32)[::-1], 2)`,
      time: "O(1)  (always 32 bits)",
      space: "O(1)",
      whyItWorks: "Direct string manipulation — easy to verify by hand.",
      howToOptimize: "The bit-shift loop is what an interviewer wants to see — it shows you understand bitwise ops without leaning on string parsing."
    },
    pseudocode: [
      "Initialize result = 0",
      "Repeat 32 times:",
      "  result = (result << 1) | (n & 1)",
      "  n = n >> 1",
      "Return result"
    ],
    tests: {
      funcName: "reverse_bits",
      cases: [
        { input: [43261596], expected: 964176192 },
        { input: [4294967293], expected: 3221225471 },
        { input: [0], expected: 0 },
        { input: [1], expected: 2147483648 }
      ]
    },
    starter:
`def reverse_bits(n):
    # Reverse the bits of a 32-bit unsigned integer.
    pass`,
    optimalCode:
`def reverse_bits(n):
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result`
  },

  40: {  // Reverse Linked List
    hints: [
      "You need three pointers: prev (starts None), curr (starts head), and a temp to remember curr.next before you overwrite it.",
      "Each iteration: save next = curr.next, flip curr.next = prev, then slide both pointers forward (prev = curr, curr = next).",
      "When curr is None, prev is the new head."
    ],
    bruteForce: {
      idea: "Push every node's value onto a stack, then build a new list popping from the stack.",
      code:
`def reverse_list(head):
    stack = []
    while head:
        stack.append(head.val)
        head = head.next
    dummy = ListNode()
    cur = dummy
    while stack:
        cur.next = ListNode(stack.pop())
        cur = cur.next
    return dummy.next`,
      time: "O(n)",
      space: "O(n)  (the stack + new nodes)",
      whyItWorks: "Reverses by reading in order, building in reverse.",
      howToOptimize: "We allocated a whole new list and an O(n) stack. We can reverse the original pointers *in place* with three local variables."
    },
    pseudocode: [
      "Initialize prev = None, curr = head",
      "While curr is not None:",
      "  next_node = curr.next     // remember before overwriting",
      "  curr.next = prev          // flip the pointer",
      "  prev = curr               // advance prev",
      "  curr = next_node          // advance curr",
      "Return prev   // new head"
    ],
    tests: {
      funcName: "reverse_list",
      setup: LL_ONE_SETUP,
      cases: [
        { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
        { input: [[1, 2]], expected: [2, 1] },
        { input: [[]], expected: [] },
        { input: [[7]], expected: [7] }
      ]
    },
    starter:
`# A ListNode class is already defined for you.
# Inputs are converted from Python lists into linked lists automatically;
# return the new head ListNode and it'll be converted back to a list for checking.

def reverse_list(head):
    # head is a ListNode (or None). Return the new head after reversal.
    pass`,
    optimalCode:
`def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`
  },

  41: {  // Linked List Cycle
    hints: [
      "If you walk a one-step pointer and a two-step pointer, when do they meet?",
      "If there's no cycle, the fast pointer hits None. If there is a cycle, fast eventually laps slow inside the loop.",
      "This is Floyd's tortoise & hare — guarantees O(1) extra space (a hash-set approach also works but uses O(n) memory)."
    ],
    bruteForce: {
      idea: "Walk the list and record each visited node in a set. If you re-encounter one, there's a cycle.",
      code:
`def has_cycle(head):
    seen = set()
    while head:
        if head in seen:
            return True
        seen.add(head)
        head = head.next
    return False`,
      time: "O(n)",
      space: "O(n)",
      whyItWorks: "First repeated node ⇒ cycle. Reaching None ⇒ no cycle.",
      howToOptimize: "We can drop the O(n) set entirely with two-speed pointers — same time, O(1) space."
    },
    pseudocode: [
      "Initialize slow = head, fast = head",
      "While fast is not None and fast.next is not None:",
      "  slow = slow.next",
      "  fast = fast.next.next",
      "  If slow == fast, return True",
      "Return False   // fast escaped to the end"
    ],
    tests: {
      funcName: "has_cycle",
      setup: LL_CYCLE_SETUP,
      cases: [
        { input: [[3, 2, 0, -4], 1], expected: true },
        { input: [[1, 2], 0], expected: true },
        { input: [[1], -1], expected: false },
        { input: [[1, 2, 3, 4, 5], -1], expected: false },
        { input: [[], -1], expected: false }
      ]
    },
    starter:
`# Test inputs are [values, pos] where pos is the index that the tail connects back to (-1 = no cycle).
# The harness builds the linked list for you and passes you the head.

def has_cycle(head):
    # head is a ListNode (or None). Return True iff there is a cycle.
    pass`,
    optimalCode:
`def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`
  },

  42: {  // Merge Two Sorted Lists
    hints: [
      "Use a dummy head so you don't special-case the first node.",
      "At each step, attach whichever of l1.val / l2.val is smaller, then advance that list.",
      "When one runs out, attach the remainder of the other — no need to copy node-by-node."
    ],
    bruteForce: {
      idea: "Collect all values into a list, sort it, then build a new linked list.",
      code:
`def merge_two_lists(l1, l2):
    vals = []
    while l1: vals.append(l1.val); l1 = l1.next
    while l2: vals.append(l2.val); l2 = l2.next
    vals.sort()
    dummy = ListNode()
    cur = dummy
    for v in vals:
        cur.next = ListNode(v); cur = cur.next
    return dummy.next`,
      time: "O((n+m) log(n+m))",
      space: "O(n+m)",
      whyItWorks: "Throws away the sortedness, then re-sorts. Always correct.",
      howToOptimize: "Both inputs are already sorted — sort() wastes that information. A two-pointer merge is O(n+m) time and reuses the existing nodes."
    },
    pseudocode: [
      "Create a dummy head; let tail = dummy",
      "While l1 and l2 are both non-None:",
      "  If l1.val <= l2.val: tail.next = l1; l1 = l1.next",
      "  Else:                tail.next = l2; l2 = l2.next",
      "  tail = tail.next",
      "Attach whichever of l1, l2 is still non-None to tail.next",
      "Return dummy.next"
    ],
    tests: {
      funcName: "merge_two_lists",
      setup: LL_TWO_SETUP,
      cases: [
        { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
        { input: [[], []], expected: [] },
        { input: [[], [0]], expected: [0] },
        { input: [[5], [1, 2, 4]], expected: [1, 2, 4, 5] }
      ]
    },
    starter:
`# Both inputs are auto-converted from lists to linked lists.
# Return the merged head; it'll be converted back to a list for checking.

def merge_two_lists(l1, l2):
    pass`,
    optimalCode:
`def merge_two_lists(l1, l2):
    dummy = ListNode()
    tail = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next`
  },

  53: {  // Valid Anagram
    hints: [
      "Anagram = same multiset of characters. What data structure represents a multiset?",
      "Count letter frequencies in s, decrement them as you scan t, check they all reach zero.",
      "Or even simpler: sort both strings and compare. Slower (O(n log n)) but a clean one-liner."
    ],
    bruteForce: {
      idea: "Sort both strings and compare.",
      code:
`def is_anagram(s, t):
    return sorted(s) == sorted(t)`,
      time: "O(n log n)",
      space: "O(n)",
      whyItWorks: "Same multiset ⇒ same sorted sequence.",
      howToOptimize: "We don't need order — just counts. A frequency-counter (hash map or 26-int array) gives O(n)."
    },
    pseudocode: [
      "If len(s) != len(t), return False",
      "Initialize an empty count dict",
      "For each char in s: count[char] = count.get(char, 0) + 1",
      "For each char in t:",
      "  If char not in count or count[char] == 0: return False",
      "  count[char] -= 1",
      "Return True"
    ],
    tests: {
      funcName: "is_anagram",
      cases: [
        { input: ["anagram", "nagaram"], expected: true },
        { input: ["rat", "car"], expected: false },
        { input: ["", ""], expected: true },
        { input: ["a", "ab"], expected: false },
        { input: ["aacc", "ccac"], expected: false }
      ]
    },
    starter:
`def is_anagram(s, t):
    pass`,
    optimalCode:
`def is_anagram(s, t):
    if len(s) != len(t):
        return False
    count = {}
    for c in s:
        count[c] = count.get(c, 0) + 1
    for c in t:
        if count.get(c, 0) == 0:
            return False
        count[c] -= 1
    return True`
  },

  55: {  // Valid Parentheses
    hints: [
      "When you encounter a closing bracket, which opening bracket does it need to match? The most recent unmatched open.",
      "Most recent = LIFO = stack. Push opens; on a close, pop and check it matches.",
      "At the end, the stack must be empty (no unmatched opens left)."
    ],
    bruteForce: {
      idea: "Repeatedly remove adjacent matching pairs ('()', '[]', '{}') from the string. If you end with empty string, it's valid.",
      code:
`def is_valid(s):
    while '()' in s or '[]' in s or '{}' in s:
        s = s.replace('()', '').replace('[]', '').replace('{}', '')
    return s == ''`,
      time: "O(n²)  (each pass scans the whole string)",
      space: "O(n)",
      whyItWorks: "Valid sequences collapse inward — repeated peeling leaves nothing.",
      howToOptimize: "We only ever care about the most recent unmatched open — a stack gives us O(1) check + push/pop per char."
    },
    pseudocode: [
      "Initialize empty stack and mapping {')': '(', ']': '[', '}': '{'}",
      "For each char c in s:",
      "  If c is an opening bracket, push it",
      "  Else (c is a closing bracket):",
      "    If stack is empty OR stack.pop() != mapping[c]: return False",
      "Return True iff stack is empty at the end"
    ],
    tests: {
      funcName: "is_valid",
      cases: [
        { input: ["()"], expected: true },
        { input: ["()[]{}"], expected: true },
        { input: ["(]"], expected: false },
        { input: ["([)]"], expected: false },
        { input: ["{[]}"], expected: true },
        { input: [""], expected: true },
        { input: ["]"], expected: false }
      ]
    },
    starter:
`def is_valid(s):
    pass`,
    optimalCode:
`def is_valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for c in s:
        if c in '([{':
            stack.append(c)
        else:
            if not stack or stack.pop() != pairs[c]:
                return False
    return not stack`
  },

  56: {  // Valid Palindrome
    hints: [
      "Filter out non-alphanumeric characters and lowercase the rest. Then check the cleaned string against its reverse.",
      "Or, with O(1) extra space: two pointers from both ends, skip non-alphanumeric on each side, compare lowercased chars.",
      "Move left right and right left after each comparison."
    ],
    bruteForce: {
      idea: "Clean the string (lowercase + drop non-alphanumerics), then compare to its reverse.",
      code:
`def is_palindrome(s):
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]`,
      time: "O(n)",
      space: "O(n)  (cleaned copy)",
      whyItWorks: "A palindrome reads the same forward and backward by definition.",
      howToOptimize: "We allocate a copy of the string. With two pointers we can verify in O(1) extra space — useful when strings are huge."
    },
    pseudocode: [
      "Set left = 0, right = len(s) − 1",
      "While left < right:",
      "  While left < right and s[left] is not alphanumeric: left += 1",
      "  While left < right and s[right] is not alphanumeric: right -= 1",
      "  If s[left].lower() != s[right].lower(): return False",
      "  left += 1; right -= 1",
      "Return True"
    ],
    tests: {
      funcName: "is_palindrome",
      cases: [
        { input: ["A man, a plan, a canal: Panama"], expected: true },
        { input: ["race a car"], expected: false },
        { input: [" "], expected: true },
        { input: [""], expected: true },
        { input: ["0P"], expected: false }
      ]
    },
    starter:
`def is_palindrome(s):
    pass`,
    optimalCode:
`def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`
  },

  60: {  // Maximum Depth of Binary Tree
    hints: [
      "Depth of a tree rooted at `node` = 1 + max(depth of left, depth of right).",
      "Base case: an empty subtree (None) has depth 0.",
      "Recurse on both children, take the max, add one for the current node."
    ],
    bruteForce: {
      idea: "BFS the tree level by level, count how many levels you process.",
      code:
`def max_depth(root):
    if not root: return 0
    from collections import deque
    q = deque([root])
    depth = 0
    while q:
        depth += 1
        for _ in range(len(q)):
            node = q.popleft()
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
    return depth`,
      time: "O(n)",
      space: "O(w)  (w = max width of the tree)",
      whyItWorks: "Each pass of the inner loop drains one level — count the passes.",
      howToOptimize: "Recursion expresses the same idea in 1 line and uses O(h) stack rather than O(w) queue — usually preferred."
    },
    pseudocode: [
      "If root is None, return 0",
      "Otherwise return 1 + max(max_depth(root.left), max_depth(root.right))"
    ],
    tests: {
      funcName: "max_depth",
      setup: TREE_ONE_SETUP,
      cases: [
        { input: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
        { input: [[1, null, 2]], expected: 2 },
        { input: [[]], expected: 0 },
        { input: [[1]], expected: 1 },
        { input: [[1, 2, 3, 4, 5]], expected: 3 }
      ]
    },
    starter:
`# A TreeNode class is defined for you. Input arrays use BFS level order with null/None for missing children.

def max_depth(root):
    # Return the maximum depth (number of nodes on the longest path).
    pass`,
    optimalCode:
`def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`
  },

  61: {  // Same Tree
    hints: [
      "Two trees are the same iff: both empty, OR both non-empty with equal root values AND matching left subtrees AND matching right subtrees.",
      "Translate directly to recursion — handle three cases: both None, one None, neither None.",
      "Recurse on (p.left, q.left) and (p.right, q.right) — return True only if both succeed."
    ],
    bruteForce: {
      idea: "Serialize both trees with explicit None markers and compare strings.",
      code:
`def is_same_tree(p, q):
    def ser(node):
        if not node: return '#'
        return f'({node.val},{ser(node.left)},{ser(node.right)})'
    return ser(p) == ser(q)`,
      time: "O(n)",
      space: "O(n)",
      whyItWorks: "Pre-order traversal with None sentinels uniquely identifies a tree.",
      howToOptimize: "Building two full strings is wasteful — direct recursive comparison short-circuits on the first mismatch and uses O(h) stack only."
    },
    pseudocode: [
      "If both p and q are None: return True",
      "If exactly one is None: return False",
      "If p.val != q.val: return False",
      "Return is_same_tree(p.left, q.left) AND is_same_tree(p.right, q.right)"
    ],
    tests: {
      funcName: "is_same_tree",
      setup: TREE_TWO_SETUP,
      cases: [
        { input: [[1, 2, 3], [1, 2, 3]], expected: true },
        { input: [[1, 2], [1, null, 2]], expected: false },
        { input: [[1, 2, 1], [1, 1, 2]], expected: false },
        { input: [[], []], expected: true },
        { input: [[1], []], expected: false }
      ]
    },
    starter:
`def is_same_tree(p, q):
    pass`,
    optimalCode:
`def is_same_tree(p, q):
    if not p and not q:
        return True
    if not p or not q:
        return False
    if p.val != q.val:
        return False
    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)`
  },

  62: {  // Invert Binary Tree
    hints: [
      "At each node, swap its left and right children. Recurse into both.",
      "Base case: None — return None.",
      "Order doesn't matter — you can swap then recurse, or recurse then swap."
    ],
    bruteForce: {
      idea: "BFS level by level, swapping the left/right pointers of each node visited.",
      code:
`def invert_tree(root):
    if not root: return None
    from collections import deque
    q = deque([root])
    while q:
        n = q.popleft()
        n.left, n.right = n.right, n.left
        if n.left:  q.append(n.left)
        if n.right: q.append(n.right)
    return root`,
      time: "O(n)",
      space: "O(w)",
      whyItWorks: "Every node gets its children flipped exactly once.",
      howToOptimize: "Recursion expresses the same operation in 2 lines and runs in O(h) stack space — same time complexity, cleaner code."
    },
    pseudocode: [
      "If root is None, return None",
      "Swap root.left and root.right",
      "Recurse: invert_tree(root.left)",
      "Recurse: invert_tree(root.right)",
      "Return root"
    ],
    tests: {
      funcName: "invert_tree",
      setup: TREE_ONE_OUT_SETUP,
      cases: [
        { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
        { input: [[2, 1, 3]], expected: [2, 3, 1] },
        { input: [[]], expected: [] },
        { input: [[1]], expected: [1] }
      ]
    },
    starter:
`def invert_tree(root):
    pass`,
    optimalCode:
`def invert_tree(root):
    if not root:
        return None
    root.left, root.right = root.right, root.left
    invert_tree(root.left)
    invert_tree(root.right)
    return root`
  },

  66: {  // Subtree of Another Tree
    hints: [
      "Reuse Same Tree as a helper. The question becomes: 'does some node in root start an identical subtree to subRoot?'",
      "Walk root; at each node, check is_same_tree(node, subRoot). Return True on first match.",
      "Edge case: if subRoot is None, the answer is True (an empty tree is a subtree of anything)."
    ],
    bruteForce: {
      idea: "Serialize root and subRoot into strings with sentinels; check if sub-string is contained.",
      code:
`def is_subtree(root, subRoot):
    def ser(n):
        if not n: return '#'
        return f',{n.val}({ser(n.left)})({ser(n.right)})'
    return ser(subRoot) in ser(root)`,
      time: "O(n + m)",
      space: "O(n + m)",
      whyItWorks: "Serialization with leading separators avoids the '12 contains 2' false-positive trap.",
      howToOptimize: "Recursive walk + same-tree comparison is more idiomatic and uses O(h) recursion instead of O(n+m) string storage."
    },
    pseudocode: [
      "Helper same(p, q): the Same-Tree check (recursive value + structure match)",
      "If subRoot is None, return True",
      "If root is None, return False",
      "If same(root, subRoot), return True",
      "Return is_subtree(root.left, subRoot) OR is_subtree(root.right, subRoot)"
    ],
    tests: {
      funcName: "is_subtree",
      setup: TREE_TWO_SETUP,
      cases: [
        { input: [[3, 4, 5, 1, 2], [4, 1, 2]], expected: true },
        { input: [[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2]], expected: false },
        { input: [[1, 1], [1]], expected: true },
        { input: [[1], [1]], expected: true },
        { input: [[1, 2, 3], [4]], expected: false }
      ]
    },
    starter:
`def is_subtree(root, sub_root):
    pass`,
    optimalCode:
`def is_subtree(root, sub_root):
    def same(a, b):
        if not a and not b: return True
        if not a or not b: return False
        return a.val == b.val and same(a.left, b.left) and same(a.right, b.right)
    if not sub_root:
        return True
    if not root:
        return False
    if same(root, sub_root):
        return True
    return is_subtree(root.left, sub_root) or is_subtree(root.right, sub_root)`
  },

  7: {  // Find Minimum in Rotated Sorted Array
    hints: [
      "Linear scan works in O(n) but the array is *sorted-then-rotated* — that structure must be useful. What's true at the rotation point?",
      "Binary search. Compare nums[mid] with nums[hi]. If nums[mid] > nums[hi], the minimum is in the right half. Otherwise it's in the left half (including mid).",
      "Be careful with the recurrence: lo = mid + 1 OR hi = mid (not mid - 1) — the minimum could BE mid."
    ],
    bruteForce: {
      idea: "Linear scan, track the minimum.",
      code:
`def find_min(nums):
    return min(nums)`,
      time: "O(n)",
      space: "O(1)",
      whyItWorks: "Examines every element — the minimum is among them.",
      howToOptimize: "We're ignoring the rotation structure. A rotated sorted array has exactly one 'cliff' where it wraps. Binary search can find it in O(log n)."
    },
    pseudocode: [
      "Set lo = 0, hi = len(nums) − 1",
      "While lo < hi:",
      "  mid = (lo + hi) // 2",
      "  If nums[mid] > nums[hi]: the min is to the RIGHT of mid → lo = mid + 1",
      "  Else: the min is at mid or to the LEFT → hi = mid",
      "Return nums[lo]"
    ],
    tests: {
      funcName: "find_min",
      cases: [
        { input: [[3, 4, 5, 1, 2]], expected: 1 },
        { input: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
        { input: [[11, 13, 15, 17]], expected: 11 },
        { input: [[2, 1]], expected: 1 },
        { input: [[1]], expected: 1 }
      ]
    },
    starter:
`def find_min(nums):
    # nums was originally sorted ascending, then rotated some number of times.
    # No duplicates. Find the minimum in O(log n).
    pass`,
    optimalCode:
`def find_min(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return nums[lo]`
  },

  8: {  // Search in Rotated Sorted Array
    hints: [
      "Binary search has to work because of the O(log n) requirement — but the array is rotated. Each step, ask: which HALF is sorted?",
      "After picking mid: if nums[lo..mid] is sorted (nums[lo] ≤ nums[mid]), check whether target lies in that range. If yes, search left; if no, search right. Symmetric for the right half.",
      "The check nums[lo] ≤ nums[mid] is the 'which half is sorted' test. The half that is sorted gives you a deterministic answer about whether target is inside it."
    ],
    bruteForce: {
      idea: "Linear scan, return the first matching index.",
      code:
`def search(nums, target):
    for i, v in enumerate(nums):
        if v == target:
            return i
    return -1`,
      time: "O(n)",
      space: "O(1)",
      whyItWorks: "Examines every element — guaranteed to find target if present.",
      howToOptimize: "The problem requires O(log n), so we have to use binary search despite the rotation. Trick: at each step, ONE of the two halves is sorted — exploit that."
    },
    pseudocode: [
      "Set lo = 0, hi = len(nums) − 1",
      "While lo <= hi:",
      "  mid = (lo + hi) // 2",
      "  If nums[mid] == target: return mid",
      "  If nums[lo] <= nums[mid]:  # LEFT half is sorted",
      "    If nums[lo] <= target < nums[mid]: hi = mid − 1",
      "    Else: lo = mid + 1",
      "  Else:                      # RIGHT half is sorted",
      "    If nums[mid] < target <= nums[hi]: lo = mid + 1",
      "    Else: hi = mid − 1",
      "Return -1"
    ],
    tests: {
      funcName: "search",
      cases: [
        { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
        { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
        { input: [[1], 0], expected: -1 },
        { input: [[1], 1], expected: 0 },
        { input: [[5, 1, 3], 5], expected: 0 },
        { input: [[3, 1], 1], expected: 1 }
      ]
    },
    starter:
`def search(nums, target):
    # nums is a rotated sorted array with no duplicates.
    # Return the index of target, or -1 if not present. Must run in O(log n).
    pass`,
    optimalCode:
`def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`
  },

  17: {  // Coin Change
    hints: [
      "For each amount a, ask: what was the LAST coin I used to reach a? That coin's value was some c, so before it I was at amount a − c.",
      "dp[a] = min over all coins c of (dp[a − c] + 1). Base case: dp[0] = 0.",
      "Build dp bottom-up from 0 to amount. If dp[amount] was never updated (stays at infinity), return -1."
    ],
    bruteForce: {
      idea: "Try every combination of coins recursively until you reach exactly amount; track the minimum count.",
      code:
`def coin_change(coins, amount):
    def recurse(remaining):
        if remaining == 0: return 0
        if remaining < 0: return float('inf')
        return 1 + min(recurse(remaining - c) for c in coins)
    result = recurse(amount)
    return result if result != float('inf') else -1`,
      time: "O(coins^amount)",
      space: "O(amount) stack",
      whyItWorks: "Explores every possible combination — guaranteed minimum if any solution exists.",
      howToOptimize: "Same subproblems recur many times (e.g., reaching amount 5 via 2+3 or 3+2 both call recurse(0)). Memoize, or build bottom-up. → O(amount · coins)."
    },
    pseudocode: [
      "Initialize dp = [infinity] * (amount + 1); dp[0] = 0",
      "For a from 1 to amount:",
      "  For each coin c in coins:",
      "    If c <= a and dp[a − c] + 1 < dp[a]:",
      "      dp[a] = dp[a − c] + 1",
      "Return dp[amount] if dp[amount] != infinity else -1"
    ],
    tests: {
      funcName: "coin_change",
      cases: [
        { input: [[1, 2, 5], 11], expected: 3 },
        { input: [[2], 3], expected: -1 },
        { input: [[1], 0], expected: 0 },
        { input: [[1], 2], expected: 2 },
        { input: [[186, 419, 83, 408], 6249], expected: 20 }
      ]
    },
    starter:
`def coin_change(coins, amount):
    # Return the fewest coins needed to reach the target amount.
    # Each coin can be used unlimited times. Return -1 if no combination works.
    # (coins are positive ints; amount may be 0.)
    pass`,
    optimalCode:
`def coin_change(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return dp[amount] if dp[amount] != INF else -1`
  },

  28: {  // Course Schedule
    hints: [
      "Restate as a graph: nodes = courses, edge a → b means 'b must come before a'. Question becomes: does this directed graph contain a cycle?",
      "If you can topologically sort it, no cycle exists → True. Kahn's algorithm with in-degrees is the clearest version.",
      "Build adjacency list + in-degree count. Queue all nodes with in-degree 0. Pop, decrement neighbors' in-degrees, enqueue new zeros. If you process all N nodes, no cycle."
    ],
    bruteForce: {
      idea: "Pure DFS with a recursion-stack visited set to detect cycles.",
      code:
`def can_finish(num_courses, prerequisites):
    from collections import defaultdict
    graph = defaultdict(list)
    for a, b in prerequisites:
        graph[b].append(a)
    UNVISITED, VISITING, DONE = 0, 1, 2
    state = [UNVISITED] * num_courses
    def has_cycle(u):
        if state[u] == VISITING: return True
        if state[u] == DONE: return False
        state[u] = VISITING
        for v in graph[u]:
            if has_cycle(v): return True
        state[u] = DONE
        return False
    for i in range(num_courses):
        if has_cycle(i): return False
    return True`,
      time: "O(V + E)",
      space: "O(V + E)",
      whyItWorks: "A back-edge to a node currently in the recursion stack ⇒ cycle.",
      howToOptimize: "DFS works but the iterative BFS topological sort (Kahn's) is easier to write correctly and avoids recursion limits on large inputs."
    },
    pseudocode: [
      "Build adjacency list: for each [a, b] in prerequisites, graph[b].append(a)",
      "Build in_degree[u] = number of edges pointing INTO u",
      "Initialize queue with all u where in_degree[u] == 0",
      "Initialize processed = 0",
      "While queue is non-empty:",
      "  u = queue.popleft(); processed += 1",
      "  For each neighbor v in graph[u]:",
      "    in_degree[v] -= 1",
      "    If in_degree[v] == 0: queue.append(v)",
      "Return processed == num_courses"
    ],
    tests: {
      funcName: "can_finish",
      cases: [
        { input: [2, [[1, 0]]], expected: true },
        { input: [2, [[1, 0], [0, 1]]], expected: false },
        { input: [4, [[1, 0], [2, 1], [3, 2]]], expected: true },
        { input: [3, [[0, 1], [1, 2], [2, 0]]], expected: false },
        { input: [1, []], expected: true }
      ]
    },
    starter:
`def can_finish(num_courses, prerequisites):
    # prerequisites[i] = [a, b] means you must take b BEFORE a.
    # Return True iff it is possible to finish all courses (graph has no cycle).
    pass`,
    optimalCode:
`def can_finish(num_courses, prerequisites):
    from collections import defaultdict, deque
    graph = defaultdict(list)
    in_degree = [0] * num_courses
    for a, b in prerequisites:
        graph[b].append(a)
        in_degree[a] += 1
    queue = deque(i for i in range(num_courses) if in_degree[i] == 0)
    processed = 0
    while queue:
        u = queue.popleft()
        processed += 1
        for v in graph[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    return processed == num_courses`
  },

  30: {  // Number of Islands
    hints: [
      "Walk every cell. When you hit a '1' you haven't visited yet, that's a new island. Use BFS or DFS to MARK every connected '1' so you don't double-count.",
      "Easiest 'mark as visited' trick: change the '1' to '0' as you flood-fill. No separate visited set needed.",
      "For each starting '1': recurse (or BFS) into up/down/left/right, flipping each '1' you touch to '0'. Each fresh '1' you encounter in the outer scan increments the island count."
    ],
    bruteForce: {
      idea: "Same DFS approach — there isn't really a brute force here. The 'naive' version uses a separate visited set instead of mutating the grid.",
      code:
`def num_islands(grid):
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    visited = set()
    count = 0
    def dfs(r, c):
        if (r, c) in visited or r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return
        visited.add((r, c))
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and (r, c) not in visited:
                count += 1
                dfs(r, c)
    return count`,
      time: "O(m·n)",
      space: "O(m·n) for the visited set + recursion stack",
      whyItWorks: "Every '1' is visited exactly once; each connected blob starts the count once.",
      howToOptimize: "Mutate the grid (flip visited cells to '0') instead of maintaining a separate visited set — halves the memory."
    },
    pseudocode: [
      "If grid is empty, return 0",
      "Initialize count = 0",
      "For each cell (r, c) in the grid:",
      "  If grid[r][c] == '1':",
      "    count += 1",
      "    DFS(r, c) — flips this cell and all 4-connected '1' neighbors to '0'",
      "Return count",
      "",
      "DFS(r, c):",
      "  If out of bounds OR grid[r][c] != '1': return",
      "  grid[r][c] = '0'",
      "  DFS(r+1, c); DFS(r-1, c); DFS(r, c+1); DFS(r, c-1)"
    ],
    tests: {
      funcName: "num_islands",
      cases: [
        { input: [[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]], expected: 1 },
        { input: [[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]], expected: 3 },
        { input: [[["0"]]], expected: 0 },
        { input: [[["1"]]], expected: 1 },
        { input: [[]], expected: 0 }
      ]
    },
    starter:
`def num_islands(grid):
    # grid is a list of lists of '1' (land) and '0' (water) characters.
    # An island = group of '1's connected horizontally or vertically (not diagonally).
    # Return the number of distinct islands.
    pass`,
    optimalCode:
`def num_islands(grid):
    if not grid or not grid[0]:
        return 0
    rows, cols = len(grid), len(grid[0])
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`
  },

  44: {  // Remove Nth Node From End of List
    hints: [
      "Two-pass solution: count length L, then walk to position (L − n − 1) and unlink. But there's a slicker one-pass version.",
      "One-pass: two pointers. Advance `fast` n steps ahead, then move BOTH until fast hits the end. Now `slow` is one before the node to delete.",
      "Use a dummy node before head so the 'delete the head' edge case (n == length) doesn't need special handling."
    ],
    bruteForce: {
      idea: "Count nodes (1 pass), compute target index (L − n), walk to it (2nd pass) and unlink.",
      code:
`def remove_nth_from_end(head, n):
    L = 0
    cur = head
    while cur:
        L += 1
        cur = cur.next
    if n == L:
        return head.next
    cur = head
    for _ in range(L - n - 1):
        cur = cur.next
    cur.next = cur.next.next
    return head`,
      time: "O(L)",
      space: "O(1)",
      whyItWorks: "Direct: figure out where the node is, walk there, splice it out.",
      howToOptimize: "Two passes is fine but the elegant version uses a single pass with two pointers offset by n. Same time complexity, but only walks the list once."
    },
    pseudocode: [
      "Create a dummy node pointing to head",
      "Set slow = dummy, fast = dummy",
      "Advance fast by n + 1 steps  (puts a gap of n+1 between slow and fast)",
      "While fast is not None: advance both slow and fast",
      "Now slow.next is the node to remove",
      "slow.next = slow.next.next",
      "Return dummy.next"
    ],
    tests: {
      funcName: "remove_nth_from_end",
      setup: LL_ONE_PLUS_INT_SETUP,
      cases: [
        { input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
        { input: [[1], 1], expected: [] },
        { input: [[1, 2], 1], expected: [1] },
        { input: [[1, 2], 2], expected: [2] },
        { input: [[1, 2, 3], 3], expected: [2, 3] }
      ]
    },
    starter:
`# Inputs are [values, n]; the harness builds the linked list and passes you the head + n.
# Return the modified head; it'll be converted back to a list for checking.

def remove_nth_from_end(head, n):
    # Remove the nth node from the END of the list. (n is 1-indexed.)
    pass`,
    optimalCode:
`def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    slow = fast = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        slow = slow.next
        fast = fast.next
    slow.next = slow.next.next
    return dummy.next`
  },

  50: {  // Longest Substring Without Repeating Characters
    hints: [
      "What is a 'substring without repeats'? A window with no duplicate chars. We need the longest such window.",
      "Sliding window. Keep a set of chars in the window. Advance the right edge; when a duplicate shows up, shrink the left edge until the duplicate is gone.",
      "Even better: store char → last index. When you see a dup, jump left directly to (last_seen_index + 1). O(n) one pass."
    ],
    bruteForce: {
      idea: "For every starting index i, extend j until a duplicate appears; track the max (j − i).",
      code:
`def length_of_longest_substring(s):
    best = 0
    for i in range(len(s)):
        seen = set()
        for j in range(i, len(s)):
            if s[j] in seen:
                break
            seen.add(s[j])
        best = max(best, len(seen))
    return best`,
      time: "O(n²)",
      space: "O(min(n, Σ))",
      whyItWorks: "Tries every possible starting index; the longest such window is the answer.",
      howToOptimize: "The inner loop redoes work — when we find a duplicate at j, the next valid window must start AFTER the duplicate's previous position. Slide the left edge instead of restarting."
    },
    pseudocode: [
      "Initialize left = 0, best = 0, last_seen = {}  (char → last index)",
      "For right in range(len(s)):",
      "  c = s[right]",
      "  If c in last_seen and last_seen[c] >= left:",
      "    left = last_seen[c] + 1   # jump past the previous occurrence",
      "  last_seen[c] = right",
      "  best = max(best, right − left + 1)",
      "Return best"
    ],
    tests: {
      funcName: "length_of_longest_substring",
      cases: [
        { input: ["abcabcbb"], expected: 3 },
        { input: ["bbbbb"], expected: 1 },
        { input: ["pwwkew"], expected: 3 },
        { input: [""], expected: 0 },
        { input: [" "], expected: 1 },
        { input: ["dvdf"], expected: 3 }
      ]
    },
    starter:
`def length_of_longest_substring(s):
    # Return the length of the longest substring without repeating characters.
    pass`,
    optimalCode:
`def length_of_longest_substring(s):
    last_seen = {}
    left = best = 0
    for right, c in enumerate(s):
        if c in last_seen and last_seen[c] >= left:
            left = last_seen[c] + 1
        last_seen[c] = right
        best = max(best, right - left + 1)
    return best`
  },

  54: {  // Group Anagrams
    hints: [
      "What's a fingerprint that's the same for any two anagrams? They have the same letter multiset.",
      "One easy fingerprint: the sorted string ('eat' → 'aet', 'tea' → 'aet'). Use it as a hash-map key.",
      "Walk the strs; group each into a dict keyed by its sorted form. Return dict.values() as a list."
    ],
    bruteForce: {
      idea: "Compare every pair of strings — anagrams have the same sorted letters. O(n² · k log k).",
      code:
`def group_anagrams(strs):
    groups = []
    placed = [False] * len(strs)
    for i in range(len(strs)):
        if placed[i]: continue
        group = [strs[i]]; placed[i] = True
        si = sorted(strs[i])
        for j in range(i + 1, len(strs)):
            if not placed[j] and sorted(strs[j]) == si:
                group.append(strs[j]); placed[j] = True
        groups.append(group)
    return groups`,
      time: "O(n² · k log k)",
      space: "O(n · k)",
      whyItWorks: "Brute compares every pair — guaranteed to group correctly.",
      howToOptimize: "Instead of comparing pairs, hash each string by its sorted form once → O(n · k log k) total. Even better: use a 26-int tuple as the key → O(n · k)."
    },
    pseudocode: [
      "Initialize an empty dict `groups` (sorted_string → list of original strings)",
      "For each s in strs:",
      "  key = ''.join(sorted(s))",
      "  groups.setdefault(key, []).append(s)",
      "Return list(groups.values())"
    ],
    tests: {
      funcName: "group_anagrams",
      compare: "set-of-sets",
      cases: [
        { input: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] },
        { input: [[""]], expected: [[""]] },
        { input: [["a"]], expected: [["a"]] },
        { input: [["abc", "bca", "cab", "xyz", "zyx"]], expected: [["abc", "bca", "cab"], ["xyz", "zyx"]] }
      ]
    },
    starter:
`def group_anagrams(strs):
    # Group together strings that are anagrams of each other.
    # Order of groups (and within groups) does not matter for grading.
    pass`,
    optimalCode:
`def group_anagrams(strs):
    groups = {}
    for s in strs:
        key = ''.join(sorted(s))
        groups.setdefault(key, []).append(s)
    return list(groups.values())`
  },

  63: {  // Validate Binary Search Tree
    hints: [
      "A common WRONG attempt: 'check node.left.val < node.val < node.right.val at every node.' This fails for trees like [5, 1, 6, null, null, 3, 7] — 3 is in the right subtree but less than 5.",
      "Every node has a VALID RANGE inherited from above: (lower, upper). When you go left, upper becomes node.val. When you go right, lower becomes node.val.",
      "Recurse with (node, lower, upper). Initial call uses (root, -inf, +inf)."
    ],
    bruteForce: {
      idea: "In-order traversal collects values into a list; a BST's in-order is strictly ascending.",
      code:
`def is_valid_bst(root):
    vals = []
    def inorder(n):
        if not n: return
        inorder(n.left)
        vals.append(n.val)
        inorder(n.right)
    inorder(root)
    return all(vals[i] < vals[i+1] for i in range(len(vals) - 1))`,
      time: "O(n)",
      space: "O(n) for the values list",
      whyItWorks: "BST property guarantees in-order is strictly ascending. Easy to verify.",
      howToOptimize: "Materializing the list is O(n) memory we don't need — we can track only the previous value as we walk, or pass (lower, upper) bounds through recursion."
    },
    pseudocode: [
      "Define helper(node, lower, upper):",
      "  If node is None: return True",
      "  If node.val <= lower or node.val >= upper: return False",
      "  Return helper(node.left, lower, node.val) AND helper(node.right, node.val, upper)",
      "Return helper(root, -infinity, +infinity)"
    ],
    tests: {
      funcName: "is_valid_bst",
      setup: TREE_ONE_SETUP,
      cases: [
        { input: [[2, 1, 3]], expected: true },
        { input: [[5, 1, 4, null, null, 3, 6]], expected: false },
        { input: [[5, 4, 6, null, null, 3, 7]], expected: false },
        { input: [[2, 2, 2]], expected: false },
        { input: [[1]], expected: true },
        { input: [[]], expected: true }
      ]
    },
    starter:
`# A TreeNode class is defined for you. Input arrays are BFS level order with null for missing children.

def is_valid_bst(root):
    # Return True iff the tree is a valid BST (strict left < node < right at every node).
    pass`,
    optimalCode:
`def is_valid_bst(root):
    def helper(node, lower, upper):
        if not node:
            return True
        if node.val <= lower or node.val >= upper:
            return False
        return helper(node.left, lower, node.val) and helper(node.right, node.val, upper)
    return helper(root, float('-inf'), float('inf'))`
  }
};
