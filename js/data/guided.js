// ── Guided builds: forced decisions before code ───────────────────────────
// For each problem the user answers 4-5 multiple-choice DESIGN questions
// (data structure, loop shape, invariant, edge case) BEFORE the final code
// is revealed. This trains the structural thinking interviewers grade on.
const GUIDED_BUILDS = [
  {
    id: 'gd_two_sum',
    problem: 'Two Sum',
    pattern: 'Hash Map',
    level: 'easy',
    brief: 'Given an array <code>nums</code> and an integer <code>target</code>, return the indices of the two numbers that add up to <code>target</code>.',
    decisions: [
      {
        q: 'You need to find two numbers that sum to a target. What\'s your fastest approach?',
        options: [
          'Nested loop: check every pair → O(n²)',
          'Sort, then two pointers → O(n log n)',
          'Hash map: store value → index, look up complement → O(n)',
          'Recursion → O(2ⁿ)',
        ],
        answerIdx: 2,
        explanation: 'Hash map gives O(1) lookup of "have I seen the complement?" → one pass = O(n). The other approaches are slower or wrong (sort changes indices).',
      },
      {
        q: 'For each value <code>n</code> you encounter, what value do you LOOK UP in the hash map?',
        options: [
          'n itself',
          'target + n',
          'target - n (the complement)',
          'target',
        ],
        answerIdx: 2,
        explanation: 'You want a value <code>y</code> such that <code>n + y = target</code>. Algebra: <code>y = target − n</code>. That\'s the complement.',
      },
      {
        q: 'What does the hash map MAP (key → value)?',
        options: [
          'index → value',
          'value → index',
          'value → True/False (seen)',
          'pair → boolean',
        ],
        answerIdx: 1,
        explanation: 'You need to RETURN the index where the complement was seen. Map value → index so the lookup gives you back where it was.',
      },
      {
        q: 'In the loop body, what\'s the correct ORDER of operations?',
        options: [
          'Store first, then check for complement',
          'Check for complement first, then store',
          'Store and check simultaneously',
          'Check, store, check again',
        ],
        answerIdx: 1,
        explanation: 'CHECK first, then store. If you stored first, an element with <code>2*n == target</code> would falsely "find" itself.',
      },
    ],
    finalCode: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []`,
  },
  {
    id: 'gd_longest_substring',
    problem: 'Longest Substring Without Repeating Characters',
    pattern: 'Sliding Window',
    level: 'medium',
    brief: 'Find the length of the longest substring of <code>s</code> with no repeating characters.',
    decisions: [
      {
        q: 'You\'re looking for a CONTIGUOUS sub-thing satisfying a condition. What pattern?',
        options: [
          'Two pointers (converging)',
          'Sliding window',
          'Binary search',
          'Backtracking',
        ],
        answerIdx: 1,
        explanation: '"Longest/shortest contiguous subarray/substring meeting a condition" → sliding window. Two pointers are converging; sliding window expands then shrinks.',
      },
      {
        q: 'What state do you need to detect a duplicate inside the current window?',
        options: [
          'A counter (number of distinct chars)',
          'A hash map of char → last-seen index',
          'A set of chars (just membership)',
          'Two pointers',
        ],
        answerIdx: 1,
        explanation: 'You need WHERE the duplicate was, so you can jump <code>L</code> past it in one step. A set tells you "yes seen" but not where.',
      },
      {
        q: 'When you find a duplicate at index <code>R</code>, how do you update <code>L</code>?',
        options: [
          'L = L + 1 (slide one step)',
          'L = R (skip the entire window)',
          'L = seen[c] + 1 (jump past the previous occurrence)',
          'L = 0 (reset)',
        ],
        answerIdx: 2,
        explanation: 'Jumping <code>L</code> past the prior occurrence evicts the duplicate in ONE step. Sliding works but degrades to O(n²) on adversarial input.',
      },
      {
        q: 'You\'re about to write <code>if c in seen</code>. What\'s missing?',
        options: [
          'Nothing — that\'s correct',
          'Need to also check seen[c] >= L (must be IN the current window)',
          'Need to check seen[c] != L',
          'Need to check seen[c] == R',
        ],
        answerIdx: 1,
        explanation: 'A previous occurrence to the LEFT of the window doesn\'t count. The check <code>seen[c] >= L</code> filters to IN-WINDOW only.',
      },
    ],
    finalCode: `def length_of_longest_substring(s):
    seen = {}
    L = best = 0
    for R, c in enumerate(s):
        if c in seen and seen[c] >= L:
            L = seen[c] + 1
        seen[c] = R
        best = max(best, R - L + 1)
    return best`,
  },
  {
    id: 'gd_valid_parens',
    problem: 'Valid Parentheses',
    pattern: 'Stack',
    level: 'easy',
    brief: 'Given a string of <code>()[]{}</code>, determine if all brackets are properly matched and closed.',
    decisions: [
      {
        q: 'Brackets must match in LIFO order (last opened = first closed). What data structure?',
        options: [
          'Queue',
          'Stack',
          'Hash set',
          'Sorted array',
        ],
        answerIdx: 1,
        explanation: 'LIFO = stack. The most recently opened bracket is the next one that should close. That\'s pop-from-top semantics.',
      },
      {
        q: 'You see an opener like <code>(</code>. What do you do?',
        options: [
          'Pop the stack',
          'Push it onto the stack',
          'Increment a counter',
          'Mark a flag',
        ],
        answerIdx: 1,
        explanation: 'Push openers; you\'ll pop+match them when their corresponding closer arrives.',
      },
      {
        q: 'You see a closer like <code>)</code>. What two checks must pass?',
        options: [
          'Stack is non-empty AND top matches the opener for this closer',
          'Stack is empty AND top is any opener',
          'Stack length is even',
          'Just stack non-empty',
        ],
        answerIdx: 0,
        explanation: 'Empty stack = closer with no opener (e.g., ")"). Mismatched top = wrong opener (e.g., "[)").',
      },
      {
        q: 'After processing all chars, what guarantees the string was valid?',
        options: [
          'The result of the last comparison',
          'Stack length == input length',
          'Stack is empty (no unclosed openers left over)',
          'No further checks needed',
        ],
        answerIdx: 2,
        explanation: 'A non-empty stack means there are openers nobody closed (e.g., "((("). Empty stack at the end = all matched.',
      },
    ],
    finalCode: `def is_valid(s):
    stack = []
    pair = {")": "(", "]": "[", "}": "{"}
    for c in s:
        if c in pair:
            if not stack or stack.pop() != pair[c]:
                return False
        else:
            stack.append(c)
    return not stack`,
  },
  {
    id: 'gd_buy_sell_stock',
    problem: 'Best Time to Buy and Sell Stock',
    pattern: 'Greedy / Single Pass',
    level: 'easy',
    brief: 'Given daily prices, find the max profit from one buy followed by one sell. Return 0 if no profit possible.',
    decisions: [
      {
        q: 'Brute force tries every (buy, sell) pair → O(n²). What\'s the key insight to make it O(n)?',
        options: [
          'Binary search on prices',
          'Sort the array first',
          'For each sell day, the best buy day is the MIN price seen so far',
          'Use a stack to track local minima',
        ],
        answerIdx: 2,
        explanation: 'You don\'t need to consider every possible buy day — just the lowest one before today.',
      },
      {
        q: 'What state do you carry through the loop?',
        options: [
          'Min price seen so far, max profit so far',
          'All previous prices in a list',
          'Current price only',
          'Sorted prices',
        ],
        answerIdx: 0,
        explanation: 'Two scalars are enough: the lowest "buy" price seen, and the best profit found.',
      },
      {
        q: 'On day <code>i</code> with price <code>p</code>, you update <code>profit</code> as:',
        options: [
          'max(profit, p)',
          'max(profit, p - lo) where lo = running min',
          'profit + p - lo',
          'min(profit, p - lo)',
        ],
        answerIdx: 1,
        explanation: 'Best sale today = today\'s price minus the lowest we could have bought at. Track the max of that across all days.',
      },
      {
        q: 'What edge case must you handle?',
        options: [
          'Prices in descending order (no profit possible)',
          'Empty array',
          'Single price',
          'All of the above',
        ],
        answerIdx: 3,
        explanation: 'Initialize profit = 0 (returned when no profit is possible). Initialize lo = ∞ so the first price always becomes the new min.',
      },
    ],
    finalCode: `def max_profit(prices):
    lo = float('inf')
    profit = 0
    for p in prices:
        lo = min(lo, p)
        profit = max(profit, p - lo)
    return profit`,
  },
  {
    id: 'gd_subsets',
    problem: 'Subsets',
    pattern: 'Backtracking',
    level: 'medium',
    brief: 'Generate every possible subset of a list of distinct integers.',
    decisions: [
      {
        q: 'For each element you have two choices (include or exclude). What pattern explores both?',
        options: [
          'Two pointers',
          'Backtracking (try one, recurse, undo, try the other)',
          'Sliding window',
          'Greedy',
        ],
        answerIdx: 1,
        explanation: 'Backtracking is the systematic explorer of "for each item, try each choice." Two choices × n items = 2ⁿ subsets.',
      },
      {
        q: 'Inside the recursion, you maintain a <code>path</code> list of "currently included" elements. When do you record it as a result?',
        options: [
          'After every push',
          'When you\'ve made a decision for every element (i == n)',
          'Only when path is empty',
          'When path equals the input',
        ],
        answerIdx: 1,
        explanation: 'Once every element has been decided about, the current path IS one valid subset. Record and return.',
      },
      {
        q: 'When recording <code>path</code>, you write <code>result.append(...)</code>. What goes in?',
        options: [
          'path',
          'path[:]   # a snapshot copy',
          'list(path[0])',
          'tuple(path)',
        ],
        answerIdx: 1,
        explanation: '<code>path</code> mutates as recursion continues. Without a snapshot, every result would point to the same (eventually empty) list.',
      },
      {
        q: 'After the "include nums[i]" branch, what happens before the "exclude nums[i]" branch?',
        options: [
          'Reset path to empty',
          'path.pop() — un-choose nums[i]',
          'Increment i',
          'Nothing',
        ],
        answerIdx: 1,
        explanation: 'The "un-choose" pop is the heart of backtracking. Without it, the exclude branch would inherit nums[i] and produce wrong results.',
      },
    ],
    finalCode: `def subsets(nums):
    result, path = [], []
    def backtrack(i):
        if i == len(nums):
            result.append(path[:])
            return
        path.append(nums[i])
        backtrack(i + 1)
        path.pop()
        backtrack(i + 1)
    backtrack(0)
    return result`,
  },
  {
    id: 'gd_max_depth',
    problem: 'Maximum Depth of Binary Tree',
    pattern: 'Tree Recursion',
    level: 'easy',
    brief: 'Return the depth (longest root-to-leaf path) of a binary tree.',
    decisions: [
      {
        q: 'A tree is a recursive structure. What\'s the universal tree-recursion template?',
        options: [
          'For-loop over nodes',
          'BFS with a queue',
          'Handle null → recurse on children → combine',
          'Stack-based DFS only',
        ],
        answerIdx: 2,
        explanation: 'Almost every tree problem follows: base case for null, recurse into left and right, combine the results. Depth is a textbook fit.',
      },
      {
        q: 'What\'s the depth of an empty tree (root is None)?',
        options: ['0', '1', '-1', 'Undefined'],
        answerIdx: 0,
        explanation: '0 — there are no nodes. This is the base case that terminates recursion AND handles the "missing child" case for leaves.',
      },
      {
        q: 'Given the depths of the left and right subtrees, what\'s the depth at this node?',
        options: [
          'left + right',
          'max(left, right)',
          '1 + max(left, right)',
          '1 + left + right',
        ],
        answerIdx: 2,
        explanation: 'The path from this node goes through whichever subtree is deeper, plus 1 for this node itself.',
      },
    ],
    finalCode: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
  },
];

const GUIDED_PER_SESSION = 3;
