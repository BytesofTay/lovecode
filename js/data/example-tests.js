// ── Test cases for "Type it yourself" + Run ─────────────────────────────────
// Keyed by `${topicId}-${exIdx}` matching EXAMPLE_ANNOTATIONS.
// `funcName` must match what the reference code in the example defines.
// `cases[].input` is a list of positional args; `expected` is what the function should return.
// For order-insensitive equality (e.g., subsets), use `compare: 'set'`.

const EXAMPLE_TESTS = {
  'hashmap-0': {
    funcName: 'two_sum',
    cases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] }
    ]
  },
  'hashmap-1': {
    funcName: 'is_anagram',
    cases: [
      { input: ['anagram', 'nagaram'], expected: true },
      { input: ['rat', 'car'], expected: false },
      { input: ['', ''], expected: true },
      { input: ['a', 'ab'], expected: false }
    ]
  },
  'arrays-0': {
    funcName: 'max_profit',
    cases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { input: [[7, 6, 4, 3, 1]], expected: 0 },
      { input: [[1, 2]], expected: 1 },
      { input: [[5]], expected: 0 }
    ]
  },
  'arrays-1': {
    funcName: 'max_subarray',
    cases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[5, 4, -1, 7, 8]], expected: 23 },
      { input: [[-3, -2, -5]], expected: -2 }
    ]
  },
  'arrays-2': {
    funcName: 'product_except_self',
    cases: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
      { input: [[2, 3]], expected: [3, 2] }
    ]
  },
  'recursion-0': {
    funcName: 'factorial',
    cases: [
      { input: [0], expected: 1 },
      { input: [1], expected: 1 },
      { input: [4], expected: 24 },
      { input: [6], expected: 720 }
    ]
  },
  'recursion-1': {
    funcName: 'reverse',
    cases: [
      { input: ['abcd'], expected: 'dcba' },
      { input: [''], expected: '' },
      { input: ['a'], expected: 'a' },
      { input: ['hello world'], expected: 'dlrow olleh' }
    ]
  },
  'two-pointers-0': {
    funcName: 'is_palindrome',
    cases: [
      { input: ['A man, a plan, a canal: Panama'], expected: true },
      { input: ['race a car'], expected: false },
      { input: [' '], expected: true },
      { input: ['No lemon, no melon'], expected: true }
    ]
  },
  'sliding-window-0': {
    funcName: 'length_of_longest_substring',
    cases: [
      { input: ['abcabcbb'], expected: 3 },
      { input: ['bbbbb'], expected: 1 },
      { input: ['pwwkew'], expected: 3 },
      { input: [''], expected: 0 }
    ]
  },
  'binary-search-0': {
    funcName: 'binary_search',
    cases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { input: [[5], 5], expected: 0 },
      { input: [[5], -5], expected: -1 },
      { input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1], expected: 0 }
    ]
  },
  'dp-0': {
    funcName: 'fib_tab',
    cases: [
      { input: [0], expected: 0 },
      { input: [1], expected: 1 },
      { input: [10], expected: 55 },
      { input: [20], expected: 6765 }
    ]
  },
  'backtracking-0': {
    funcName: 'subsets',
    compare: 'set-of-sets',
    cases: [
      { input: [[1, 2, 3]], expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]] },
      { input: [[]], expected: [[]] },
      { input: [[5]], expected: [[], [5]] }
    ]
  },
  'linked-list-0': null  // skipping — needs ListNode setup beyond MVP
};
