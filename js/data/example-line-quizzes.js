// ── Per-line MCQ gating: keyed by `${topicId}-${exIdx}` → { lineIdx: quiz } ───
// When a line has an entry, the annotation is hidden behind a 1-question MCQ.
// User answers correctly → annotation revealed. Wrong → explanation shown, can retry.
// Only the most pedagogically valuable lines are gated (forces active recall on
// the moments where students typically zone out).
const EXAMPLE_LINE_QUIZZES = {
  // Two Sum — gate the enumerate, complement, and "store after check" lines
  'hashmap-0': {
    2: {
      q: 'Why use <code>enumerate(nums)</code> here instead of just <code>for n in nums</code>?',
      options: [
        'enumerate runs faster on large arrays',
        'We need BOTH the index and the value (the problem asks for indices)',
        'enumerate handles None values automatically',
        'for…in only works on dicts',
      ],
      answerIdx: 1,
      explanation: '<code>enumerate</code> yields <code>(i, x)</code> tuples. Two Sum returns indices, not values — without <code>i</code>, we couldn\'t produce the answer.',
    },
    3: {
      q: 'If you\'re currently looking at value <code>n</code> and want two numbers that sum to <code>target</code>, what value are you LOOKING for in <code>seen</code>?',
      options: [
        'target + n',
        'target - n',
        'n - target',
        'target / 2',
      ],
      answerIdx: 1,
      explanation: 'Algebra: x + y = target → y = target − x. The complement is what makes the lookup O(1).',
    },
    5: {
      q: 'Why store <code>seen[n] = i</code> AFTER the lookup, not before?',
      options: [
        'The hash map is faster when written to last',
        'Otherwise we\'d pair an element with itself',
        'It saves memory',
        'Python dicts can\'t be modified during iteration',
      ],
      answerIdx: 1,
      explanation: 'If we stored first, then on n=4 with target=8, we\'d find seen[4]=i and "pair" 4 with itself. Check first, store after.',
    },
  },

  // Factorial — gate the base case and recursive step (the two lines that ARE the algorithm)
  'recursion-0': {
    1: {
      q: 'What\'s the role of the <code>if n &lt;= 1: return 1</code> line?',
      options: [
        'It\'s an optimization for small inputs',
        'It\'s the BASE CASE — terminates the recursion',
        'It catches negative inputs',
        'It speeds up factorial(0)',
      ],
      answerIdx: 1,
      explanation: 'Without the base case, fact(n) calls fact(n-1) calls fact(n-2)… forever → stack overflow. The base case is what makes recursion finite.',
    },
    2: {
      q: 'In <code>return n * fact(n - 1)</code>, why <code>n - 1</code> and not <code>n</code>?',
      options: [
        'To make the function tail-recursive',
        'Because each recursive call must move CLOSER to the base case',
        'It\'s faster than n + 1',
        'Python requires arguments to decrease',
      ],
      answerIdx: 1,
      explanation: 'A recursion that doesn\'t shrink toward the base case is infinite. n−1 ensures we eventually hit n ≤ 1.',
    },
  },

  // Reverse Linked List — gate the "save next" and "flip pointer" lines
  'linked-list-0': {
    3: {
      q: 'Why save <code>nxt = curr.next</code> BEFORE the next line?',
      options: [
        'It\'s a cosmetic preference',
        'curr.next is about to be overwritten — without saving it, we lose the rest of the list',
        'Python requires temp variables',
        'It speeds up the loop',
      ],
      answerIdx: 1,
      explanation: 'The very next line does <code>curr.next = prev</code>. If we hadn\'t saved <code>curr.next</code>, the rest of the list is now unreachable.',
    },
    4: {
      q: 'After <code>curr.next = prev</code>, what changed?',
      options: [
        'curr is now pointing BACKWARD instead of forward',
        'prev moved one step forward',
        'curr was deleted',
        'The list got shorter',
      ],
      answerIdx: 0,
      explanation: 'This is the actual reversal step. <code>curr.next</code> used to point to the next node forward; now it points to the previously-flipped node.',
    },
    7: {
      q: 'When the loop ends, why return <code>prev</code> instead of <code>curr</code>?',
      options: [
        'curr is None at the end (we walked off the list)',
        'prev is faster to return',
        'Python requires returning the first variable',
        'curr might be corrupted',
      ],
      answerIdx: 0,
      explanation: 'Loop ends when <code>curr is None</code>. <code>prev</code> is the last node we successfully flipped — that\'s the new head.',
    },
  },

  // Binary Search — gate the loop condition, mid formula, and pointer update
  'binary-search-0': {
    2: {
      q: 'Why <code>while lo &lt;= hi</code> instead of <code>while lo &lt; hi</code>?',
      options: [
        '&lt;= runs faster',
        'When lo == hi, there\'s still ONE element to check',
        'They\'re equivalent',
        '&lt; would cause an infinite loop',
      ],
      answerIdx: 1,
      explanation: 'The search range [lo, hi] is INCLUSIVE. With strict &lt;, we\'d skip the final candidate when lo == hi.',
    },
    3: {
      q: 'Why use <code>lo + (hi - lo) // 2</code> instead of <code>(lo + hi) // 2</code>?',
      options: [
        'It\'s faster',
        'In Java/C++, lo + hi can overflow when both are large',
        'It handles negative indices',
        'They produce different mids',
      ],
      answerIdx: 1,
      explanation: 'Classic interview gotcha. Python is fine but the safe form is portable. <code>(lo + hi) // 2</code> overflows int range when both near INT_MAX.',
    },
    5: {
      q: 'When <code>arr[mid] &lt; target</code>, why <code>lo = mid + 1</code> instead of <code>lo = mid</code>?',
      options: [
        '+ 1 is a stylistic choice',
        'We already checked mid — exclude it from the next range or you may infinite-loop',
        'It avoids overflow',
        'mid is always the answer',
      ],
      answerIdx: 1,
      explanation: 'If you set <code>lo = mid</code> and the loop runs again with the same mid, you spin forever. The +1 (and -1 on the hi side) is essential.',
    },
  },

  // Sliding Window — gate the "in window" check and the L jump
  'sliding-window-0': {
    3: {
      q: 'Why is the check <code>seen[c] &gt;= L</code> (not just <code>c in seen</code>)?',
      options: [
        '&gt;= is faster',
        'A previous occurrence might be OUTSIDE the current window — that doesn\'t count as a duplicate',
        'L is always 0',
        'It avoids KeyError',
      ],
      answerIdx: 1,
      explanation: 'If c was seen but seen[c] &lt; L, that occurrence is already to the LEFT of the window. The window is duplicate-free as long as no PRIOR-IN-WINDOW occurrence exists.',
    },
    4: {
      q: 'When a duplicate is found in the window, why <code>L = seen[c] + 1</code> and not <code>L = L + 1</code>?',
      options: [
        'For symmetry with R',
        'Jump L past the duplicate in ONE step instead of sliding it',
        'L = L + 1 would be off-by-one',
        'It\'s a performance optimization for repeated duplicates',
      ],
      answerIdx: 1,
      explanation: 'Setting L to "one past the previous occurrence" evicts the duplicate immediately. Sliding L slowly works but degrades to O(n²) on adversarial input.',
    },
    6: {
      q: 'Why is the total work O(n) and not O(n²)?',
      options: [
        'Python dicts are O(1)',
        'L only ever moves FORWARD — each char is added once and skipped at most once',
        'The window is always small',
        'It\'s actually O(n²) in the worst case',
      ],
      answerIdx: 1,
      explanation: 'Each character is "added" by R exactly once and "removed" by L at most once. Total pointer movement ≤ 2n → O(n).',
    },
  },

  // Two Pointers — gate the loop condition and the "skip non-alphanumeric" lines
  'two-pointers-0': {
    1: {
      q: 'Why <code>while L &lt; R</code> and not <code>while L &lt;= R</code>?',
      options: [
        'When L == R it\'s a single character — already a "palindrome" of length 1',
        '&lt; is faster than &lt;=',
        '&lt;= would access invalid indices',
        'They\'re equivalent',
      ],
      answerIdx: 0,
      explanation: 'A 1-char "middle" trivially equals itself. We don\'t need to compare it against itself — strict &lt; saves one no-op iteration.',
    },
    4: {
      q: 'Why convert to <code>.lower()</code> when comparing?',
      options: [
        'Performance',
        'Palindrome ignores case ("RaceCar" should still pass)',
        'Python is case-sensitive only sometimes',
        'It avoids None comparisons',
      ],
      answerIdx: 1,
      explanation: 'The problem statement says "ignoring case." Without lowercasing, "Aa" would fail.',
    },
  },

  // Fibonacci DP — gate the cache hit and the tuple swap
  'dp-0': {
    7: {
      q: 'What does the <code>if n in cache: return cache[n]</code> line accomplish?',
      options: [
        'Type-checks the input',
        'Skips re-computing already-solved subproblems → drops O(2ⁿ) to O(n)',
        'Validates the recursion base case',
        'Saves memory',
      ],
      answerIdx: 1,
      explanation: 'Without the cache, fib(n-2) is computed exponentially many times. The cache is what makes memoized DP linear.',
    },
    13: {
      q: 'Why <code>a, b = b, a + b</code> as a tuple-swap instead of two separate assignments?',
      options: [
        'It\'s shorter',
        'Without the tuple, <code>a = b</code> would happen first and corrupt <code>a + b</code>',
        'It\'s faster',
        'Tuples are immutable',
      ],
      answerIdx: 1,
      explanation: 'Sequential <code>a = b; b = a + b</code> would set b = b + b. The tuple form computes the whole right-hand side BEFORE assigning.',
    },
  },

  // Subsets backtracking — gate the path[:] and the un-choose
  'backtracking-0': {
    4: {
      q: 'Why <code>result.append(path[:])</code> instead of <code>result.append(path)</code>?',
      options: [
        'Style preference',
        'path is mutated by later recursion — without the slice, every result would be the same final list',
        'path[:] is faster',
        'append() requires immutable args',
      ],
      answerIdx: 1,
      explanation: '<code>path</code> is a SHARED mutable list. <code>path[:]</code> creates a snapshot. Without it, all entries in result point to the same (eventually-empty) list.',
    },
    10: {
      q: 'Why <code>path.pop()</code> after the recursive call returns?',
      options: [
        'To free memory',
        'To "un-choose" — sibling branches must not inherit nums[i]',
        'pop() is faster than slicing',
        'It\'s required by Python',
      ],
      answerIdx: 1,
      explanation: 'This is the heart of backtracking. After exploring the "include nums[i]" branch, we must restore path so the "exclude nums[i]" branch starts clean.',
    },
  },
};
