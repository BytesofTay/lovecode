// ── Pseudocode-first guidance for Learn → Type-it-yourself ─────────────────
// Keyed by `${topicId}-${exIdx}` matching EXAMPLE_TESTS.
// Each entry is an array of English bullet steps. Translate to Python AFTER reading.
// Goal: separate "I don't know the algorithm" from "I don't know the syntax."

const EXAMPLE_PSEUDOCODE = {
  'hashmap-0': [
    "Create empty hash map `seen` mapping value → index",
    "For each index i with value x = nums[i]:",
    "  complement = target − x",
    "  If complement is a key in seen: return [seen[complement], i]",
    "  Otherwise: seen[x] = i",
    "Return [] (no pair found)"
  ],

  'hashmap-1': [
    "If len(s) != len(t): return False",
    "Initialize empty count dict",
    "For each char c in s: count[c] = count.get(c, 0) + 1",
    "For each char c in t:",
    "  If c not in count or count[c] == 0: return False",
    "  count[c] -= 1",
    "Return True"
  ],

  'arrays-0': [
    "Initialize min_price = infinity, best = 0",
    "For each price in prices:",
    "  If price < min_price: min_price = price  (better buy day)",
    "  Else: best = max(best, price − min_price)",
    "Return best"
  ],

  'arrays-1': [
    "Initialize current = nums[0], best = nums[0]",
    "For i from 1 to len(nums) − 1:",
    "  current = max(nums[i], current + nums[i])  // start fresh or extend?",
    "  best = max(best, current)",
    "Return best"
  ],

  'arrays-2': [
    "Initialize result = [1] * len(nums)",
    "First pass (left → right): track running prefix product, write into result[i] before multiplying by nums[i]",
    "Second pass (right → left): track running suffix product, multiply result[i] by it before multiplying by nums[i]",
    "Return result"
  ],

  'recursion-0': [
    "If n is 0 or 1: return 1  (base case)",
    "Otherwise: return n * factorial(n − 1)  (recursive step)"
  ],

  'recursion-1': [
    "If s is empty: return s  (base case)",
    "Otherwise: return reverse(s[1:]) + s[0]  (recurse on the tail, append head)"
  ],

  'two-pointers-0': [
    "Initialize left = 0, right = len(s) − 1",
    "While left < right:",
    "  Advance left while s[left] is not alphanumeric",
    "  Retreat right while s[right] is not alphanumeric",
    "  If s[left].lower() != s[right].lower(): return False",
    "  left += 1; right -= 1",
    "Return True"
  ],

  'sliding-window-0': [
    "Initialize left = 0, best = 0, set seen = {}",
    "For right from 0 to len(s) − 1:",
    "  While s[right] is already in seen: remove s[left] from seen; left += 1",
    "  Add s[right] to seen",
    "  best = max(best, right − left + 1)",
    "Return best"
  ],

  'binary-search-0': [
    "Initialize lo = 0, hi = len(nums) − 1",
    "While lo <= hi:",
    "  mid = (lo + hi) // 2",
    "  If nums[mid] == target: return mid",
    "  If nums[mid] < target: lo = mid + 1",
    "  Else: hi = mid − 1",
    "Return -1  (not found)"
  ],

  'dp-0': [
    "If n is 0 or 1: return n  (base cases)",
    "Initialize dp[0] = 0, dp[1] = 1",
    "For i from 2 to n: dp[i] = dp[i − 1] + dp[i − 2]",
    "Return dp[n]"
  ],

  'backtracking-0': [
    "Initialize result = [], path = []",
    "Define recurse(start):",
    "  Append a copy of path to result",
    "  For i from start to len(nums) − 1:",
    "    path.append(nums[i])",
    "    recurse(i + 1)",
    "    path.pop()  // backtrack",
    "Call recurse(0); return result"
  ]
};
