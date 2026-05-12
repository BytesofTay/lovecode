// ── Fill-in-the-blank snippet challenges (rotating multi-blank) ───────────
// Each entry covers one Blind 75 problem with one or more BLANK POSITIONS in
// the code. At session time, ONE blank is randomly selected to be the active
// one — the others are filled in with their canonical answers. Across
// sessions, the active blank rotates → you drill different "sections" of
// the same code over time.
//
// Schema:
//   code uses {{B1}}, {{B2}}, {{B3}} as blank markers
//   blanks[i] corresponds to {{B<i+1>}} — i.e. blanks[0] = {{B1}}
//
const SNIPPET_CHALLENGES = [
  // ── ARRAY ──────────────────────────────────────────────────────
  {
    id: 'sn_two_sum', problem: 'Two Sum', pattern: 'Hash Map', level: 'easy',
    brief: 'Return indices of the two numbers in <code>nums</code> that add up to <code>target</code>.',
    code: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if {{B1}} in seen:
            return [{{B2}}, i]
        {{B3}}
    return []`,
    blanks: [
      { options:['n - target','target - n','target + n','n'], answerIdx:1, explanation:'Algebra: x + y = target → y = target − n. That\'s the COMPLEMENT we want to find.' },
      { options:['seen[target - n]','seen[n]','i - 1','target - n'], answerIdx:0, explanation:'We need the INDEX where the complement was stored. <code>seen</code> maps value → index, so <code>seen[target - n]</code> returns that index.' },
      { options:['seen[n] = i','seen[i] = n','seen[target] = n','seen.append(n)'], answerIdx:0, explanation:'Store value → index. Future iterations need to look up "where did I see this value?" so the value is the KEY.' },
    ],
  },
  {
    id: 'sn_buy_sell', problem: 'Best Time to Buy and Sell Stock', pattern: 'Greedy', level: 'easy',
    brief: 'Find the max profit from one buy + one sell.',
    code: `def max_profit(prices):
    lo = {{B1}}
    profit = 0
    for p in prices:
        lo = min(lo, p)
        profit = {{B2}}
    return profit`,
    blanks: [
      { options:['0','prices[0]','float(\'inf\')','-1'], answerIdx:2, explanation:'Initialize to +infinity so the first price always becomes the new min via min(inf, prices[0]) = prices[0].' },
      { options:['max(profit, p)','max(profit, p - lo)','p - lo','profit + p'], answerIdx:1, explanation:'Best profit at day p = today\'s price minus the lowest buy price seen so far. Track the max over all days.' },
    ],
  },
  {
    id: 'sn_contains_dup', problem: 'Contains Duplicate', pattern: 'Hash Set', level: 'easy',
    brief: 'Return True if any value appears more than once.',
    code: `def contains_duplicate(nums):
    seen = set()
    for n in nums:
        if {{B1}}:
            return True
        {{B2}}
    return False`,
    blanks: [
      { options:['n == seen','n in seen','len(seen) > 0','seen[n]'], answerIdx:1, explanation:'<code>in</code> tests set membership in O(1) average. <code>seen[n]</code> is wrong syntax for sets.' },
      { options:['seen[n] = True','seen.add(n)','seen.append(n)','seen.push(n)'], answerIdx:1, explanation:'Sets use <code>add</code>, not <code>append</code>. Dicts use <code>seen[n] = True</code>; here we have a set.' },
    ],
  },
  {
    id: 'sn_product_except', problem: 'Product of Array Except Self', pattern: 'Prefix/Suffix', level: 'medium',
    brief: 'Return an array where out[i] = product of all elements EXCEPT nums[i]. No division.',
    code: `def product_except_self(nums):
    n = len(nums)
    out = [1] * n
    left = 1
    for i in range(n):
        {{B1}}
        left *= nums[i]
    right = 1
    for i in range({{B2}}):
        out[i] *= right
        right *= nums[i]
    return out`,
    blanks: [
      { options:['out[i] = left','out[i] *= nums[i]','out[i] = 0','left = out[i]'], answerIdx:0, explanation:'First pass writes the PREFIX product (everything before i) into out[i]. Then we multiply in the suffix in the second pass.' },
      { options:['n)','n - 1, -1, -1','0, n','len(out) - 1'], answerIdx:1, explanation:'Walk right-to-left to accumulate the suffix product. <code>range(n - 1, -1, -1)</code> goes n-1, n-2, ..., 0.' },
    ],
  },
  {
    id: 'sn_max_subarray', problem: 'Maximum Subarray (Kadane\'s)', pattern: 'DP/Greedy', level: 'easy',
    brief: 'Find the contiguous subarray with the largest sum.',
    code: `def max_subarray(nums):
    cur = best = nums[0]
    for x in nums[1:]:
        cur = {{B1}}
        best = {{B2}}
    return best`,
    blanks: [
      { options:['cur + x','max(x, cur + x)','min(x, cur + x)','x'], answerIdx:1, explanation:'Either extend the running subarray (cur + x) or restart at x. The max of the two is the best subarray ending here.' },
      { options:['max(best, cur)','cur','best + cur','min(best, cur)'], answerIdx:0, explanation:'best is the global max across all "ending at i" values. Update with the running cur after each iteration.' },
    ],
  },
  {
    id: 'sn_max_product', problem: 'Maximum Product Subarray', pattern: 'DP', level: 'medium',
    brief: 'Find the contiguous subarray with the largest PRODUCT (can be negative).',
    code: `def max_product(nums):
    cur_max = cur_min = best = nums[0]
    for x in nums[1:]:
        candidates = (x, cur_max * x, cur_min * x)
        cur_max = {{B1}}
        cur_min = {{B2}}
        best = max(best, cur_max)
    return best`,
    blanks: [
      { options:['max(candidates)','min(candidates)','x','cur_max'], answerIdx:0, explanation:'A negative × negative can flip min into max — so we need both running max AND running min. cur_max takes the largest of the three.' },
      { options:['max(candidates)','min(candidates)','x','-cur_max'], answerIdx:1, explanation:'The smallest product so far — could later become the max when multiplied by a negative.' },
    ],
  },
  {
    id: 'sn_find_min_rotated', problem: 'Find Minimum in Rotated Sorted Array', pattern: 'Binary Search', level: 'medium',
    brief: 'Find the minimum element in a rotated sorted array (no duplicates).',
    code: `def find_min(arr):
    lo, hi = 0, len(arr) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] > arr[hi]:
            {{B1}}
        else:
            {{B2}}
    return arr[lo]`,
    blanks: [
      { options:['hi = mid','lo = mid + 1','hi = mid - 1','lo = mid'], answerIdx:1, explanation:'arr[mid] > arr[hi] means the min is in the RIGHT half (rotation point is right of mid). Exclude mid by lo = mid + 1.' },
      { options:['hi = mid','lo = mid + 1','lo = mid','hi = mid - 1'], answerIdx:0, explanation:'arr[mid] ≤ arr[hi] means the min is at mid or to the LEFT. Include mid by hi = mid (not mid - 1).' },
    ],
  },
  {
    id: 'sn_search_rotated', problem: 'Search in Rotated Sorted Array', pattern: 'Binary Search', level: 'medium',
    brief: 'Find target in a rotated sorted array. Return its index or -1.',
    code: `def search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == target: return mid
        if arr[lo] <= arr[mid]:  # left half sorted
            if {{B1}}:
                hi = mid - 1
            else:
                lo = mid + 1
        else:  # right half sorted
            if {{B2}}:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
    blanks: [
      { options:['arr[lo] <= target < arr[mid]','target > arr[mid]','target < arr[lo]','arr[mid] < target'], answerIdx:0, explanation:'When the left half is sorted, target is in it iff arr[lo] ≤ target < arr[mid]. Otherwise search right.' },
      { options:['arr[mid] < target <= arr[hi]','target > arr[hi]','target < arr[mid]','arr[mid] == target'], answerIdx:0, explanation:'When the right half is sorted, target is in it iff arr[mid] < target ≤ arr[hi]. Otherwise search left.' },
    ],
  },
  {
    id: 'sn_3sum', problem: '3Sum', pattern: 'Two Pointers + Sort', level: 'medium',
    brief: 'Find all unique triplets that sum to 0.',
    code: `def three_sum(nums):
    nums.sort()
    out = []
    for i in range(len(nums) - 2):
        if {{B1}}:
            continue
        L, R = i + 1, len(nums) - 1
        # ... two-pointer scan for nums[L] + nums[R] == -nums[i] ...
    return out`,
    blanks: [
      { options:['nums[i] == nums[i + 1]','i > 0 and nums[i] == nums[i - 1]','nums[i] == 0','i == 0'], answerIdx:1, explanation:'After sorting, equal anchors produce identical triplets. Skip duplicates AFTER the first iteration (i > 0).' },
    ],
  },
  {
    id: 'sn_container', problem: 'Container With Most Water', pattern: 'Two Pointers', level: 'medium',
    brief: 'Find two walls that hold the most water (area = width × min height).',
    code: `def max_area(heights):
    L, R = 0, len(heights) - 1
    best = 0
    while L < R:
        area = {{B1}}
        best = max(best, area)
        if heights[L] < heights[R]:
            {{B2}}
        else:
            R -= 1
    return best`,
    blanks: [
      { options:['heights[L] + heights[R]','(R - L) * min(heights[L], heights[R])','(R - L) * max(heights[L], heights[R])','heights[L] * heights[R]'], answerIdx:1, explanation:'Width = R - L. Height is bounded by the SHORTER wall — water can\'t rise above it.' },
      { options:['L += 1','R -= 1','L, R = R, L','L = R'], answerIdx:0, explanation:'Move the SHORTER wall. The taller wall can never give a bigger area while the shorter remains — only moving the shorter can increase height.' },
    ],
  },
  {
    id: 'sn_trapping_rain', problem: 'Trapping Rain Water', pattern: 'Two Pointers', level: 'hard',
    brief: 'How much rain water can the heightmap trap?',
    code: `def trap(heights):
    L, R = 0, len(heights) - 1
    lmax = rmax = water = 0
    while L < R:
        if heights[L] < heights[R]:
            lmax = max(lmax, heights[L])
            water += {{B1}}
            L += 1
        else:
            rmax = max(rmax, heights[R])
            water += {{B2}}
            R -= 1
    return water`,
    blanks: [
      { options:['lmax - heights[L]','rmax - heights[L]','lmax + heights[L]','heights[L]'], answerIdx:0, explanation:'At position L, water level is bounded by lmax (because L\'s side is the shorter — rmax exceeds it). Water = lmax − height[L].' },
      { options:['lmax - heights[R]','rmax - heights[R]','rmax + heights[R]','heights[R]'], answerIdx:1, explanation:'Symmetric: at R, water level is rmax (the shorter side). Water = rmax − height[R].' },
    ],
  },

  // ── BINARY / BIT MANIPULATION ────────────────────────────────
  {
    id: 'sn_single_number', problem: 'Single Number', pattern: 'XOR', level: 'easy',
    brief: 'Every element appears twice except one. Find that one in O(1) space.',
    code: `def single_number(nums):
    result = {{B1}}
    for n in nums:
        result {{B2}} n
    return result`,
    blanks: [
      { options:['1','0','nums[0]','None'], answerIdx:1, explanation:'XOR identity is 0: a ^ 0 = a. Initializing with 0 means the first element just becomes "result".' },
      { options:['+=','^=','|=','&='], answerIdx:1, explanation:'XOR cancels pairs (a ^ a = 0). The unique element XORs once with 0 and survives.' },
    ],
  },
  {
    id: 'sn_num_1_bits', problem: 'Number of 1 Bits', pattern: 'Bit Manipulation', level: 'easy',
    brief: 'Count the set bits (1s) in an unsigned integer.',
    code: `def hamming_weight(n):
    count = 0
    while n:
        n {{B1}}
        count += 1
    return count`,
    blanks: [
      { options:['&= n - 1','>>= 1','-= 1','^= n - 1'], answerIdx:0, explanation:'n & (n - 1) clears the lowest set bit. Each iteration clears one bit → loops exactly "set-bits" times (not 64).' },
    ],
  },
  {
    id: 'sn_counting_bits', problem: 'Counting Bits', pattern: 'DP', level: 'easy',
    brief: 'Return an array where ans[i] = number of 1-bits in i, for 0 ≤ i ≤ n.',
    code: `def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = {{B1}}
    return dp`,
    blanks: [
      { options:['dp[i - 1] + 1','dp[i >> 1] + (i & 1)','i & 1','dp[i // 2] * 2'], answerIdx:1, explanation:'Either i is even (right-shift drops a 0; same bit count as i/2) or odd (right-shift drops a 1; bit count = dp[i/2] + 1). Compact form: dp[i>>1] + (i & 1).' },
    ],
  },
  {
    id: 'sn_missing_number', problem: 'Missing Number', pattern: 'Math/XOR', level: 'easy',
    brief: 'Array contains n distinct numbers from [0, n]. Find the missing one.',
    code: `def missing_number(nums):
    n = len(nums)
    expected = {{B1}}
    return expected - sum(nums)`,
    blanks: [
      { options:['n * n','n * (n + 1) // 2','n + 1','sum(range(n))'], answerIdx:1, explanation:'Sum of 0..n = n(n+1)/2. Subtracting the actual sum reveals the missing one. (XOR-pairs is the alternative.)' },
    ],
  },

  // ── DP ──────────────────────────────────────────────────────
  {
    id: 'sn_climb_stairs', problem: 'Climbing Stairs', pattern: 'DP / Fibonacci', level: 'easy',
    brief: 'You can take 1 or 2 stairs. How many distinct ways to reach step n?',
    code: `def climb_stairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = {{B1}}
    return {{B2}}`,
    blanks: [
      { options:['a + b, a','b, a + b','a, a + b','a + 1, b + 1'], answerIdx:1, explanation:'Tuple-swap: a becomes the old b; b becomes a + b. Same shape as Fibonacci.' },
      { options:['a','b','a + b','n'], answerIdx:1, explanation:'After the loop, b holds ways(n). a holds ways(n-1).' },
    ],
  },
  {
    id: 'sn_coin_change', problem: 'Coin Change', pattern: 'DP', level: 'medium',
    brief: 'Fewest coins to make amount. Return -1 if impossible.',
    code: `def coin_change(coins, amount):
    dp = [{{B1}}] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if c <= i:
                dp[i] = {{B2}}
    return dp[amount] if dp[amount] != float('inf') else -1`,
    blanks: [
      { options:['0','-1','float(\'inf\')','amount'], answerIdx:2, explanation:'Sentinel for "impossible." Using 0 would make every subproblem look solvable with no coins. inf loses every min() until a real solution wins.' },
      { options:['dp[i - c]','min(dp[i], dp[i - c] + 1)','dp[i - 1] + c','c + 1'], answerIdx:1, explanation:'Take the min of "current best" and "1 coin (this one) + best for the remaining amount."' },
    ],
  },
  {
    id: 'sn_lis', problem: 'Longest Increasing Subsequence', pattern: 'DP', level: 'medium',
    brief: 'Length of the longest strictly-increasing subsequence (not contiguous).',
    code: `def length_of_lis(nums):
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if {{B1}}:
                dp[i] = max(dp[i], {{B2}})
    return max(dp)`,
    blanks: [
      { options:['nums[j] == nums[i]','nums[j] < nums[i]','nums[j] > nums[i]','j == i - 1'], answerIdx:1, explanation:'A strictly increasing subsequence requires a smaller earlier element. Equal doesn\'t count.' },
      { options:['dp[j] + 1','dp[j]','dp[i] + 1','j + 1'], answerIdx:0, explanation:'Best LIS ending at i, going through j, is dp[j] + 1 (extend j\'s LIS by nums[i]).' },
    ],
  },
  {
    id: 'sn_lcs', problem: 'Longest Common Subsequence', pattern: 'DP', level: 'medium',
    brief: 'Length of the longest subsequence common to s1 and s2 (order preserved).',
    code: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = {{B1}}
            else:
                dp[i][j] = {{B2}}
    return dp[m][n]`,
    blanks: [
      { options:['dp[i - 1][j - 1] + 1','dp[i - 1][j] + 1','1','dp[i][j - 1] + 1'], answerIdx:0, explanation:'On a match, both pointers advance and we extend the diagonal predecessor\'s LCS by 1.' },
      { options:['0','max(dp[i - 1][j], dp[i][j - 1])','min(dp[i - 1][j], dp[i][j - 1])','dp[i - 1][j - 1]'], answerIdx:1, explanation:'On a mismatch, drop one char from either string — take the better of the two options.' },
    ],
  },
  {
    id: 'sn_word_break', problem: 'Word Break', pattern: 'DP', level: 'medium',
    brief: 'Can s be segmented into a sequence of dictionary words?',
    code: `def word_break(s, word_dict):
    words = set(word_dict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if {{B1}}:
                dp[i] = True
                break
    return dp[n]`,
    blanks: [
      { options:['dp[j] and s[j:i] in words','dp[j] and s[i:j] in words','dp[i] and s[j:i] in words','s[j:i] in words'], answerIdx:0, explanation:'dp[j] = "prefix [0..j) is breakable" AND s[j:i] = "is the suffix segment a word?" — both required.' },
    ],
  },
  {
    id: 'sn_combination_sum_iv', problem: 'Combination Sum IV', pattern: 'DP', level: 'medium',
    brief: 'How many ways to make target using nums (ORDER MATTERS — permutations).',
    code: `def combination_sum4(nums, target):
    dp = [0] * (target + 1)
    dp[0] = 1
    for amount in range(1, target + 1):
        for n in nums:
            if n <= amount:
                {{B1}}
    return dp[target]`,
    blanks: [
      { options:['dp[amount] += dp[amount - n]','dp[amount] = dp[amount - n]','dp[n] += dp[amount]','dp[amount] += 1'], answerIdx:0, explanation:'Each n contributes dp[amount - n] ways to form amount (place n last). SUM across all n to count permutations.' },
    ],
  },
  {
    id: 'sn_house_robber', problem: 'House Robber', pattern: 'DP', level: 'medium',
    brief: 'Max amount you can rob without robbing two adjacent houses.',
    code: `def rob(nums):
    prev2, prev1 = 0, 0
    for x in nums:
        prev2, prev1 = prev1, {{B1}}
    return prev1`,
    blanks: [
      { options:['prev1 + x','max(prev1, prev2 + x)','min(prev1, prev2 + x)','prev2 + x'], answerIdx:1, explanation:'At each house: rob it (prev2 + x — must have skipped the previous house) OR skip it (prev1). Take the better.' },
    ],
  },
  {
    id: 'sn_house_robber_ii', problem: 'House Robber II', pattern: 'DP', level: 'medium',
    brief: 'Same as House Robber but houses are in a CIRCLE — first and last are adjacent.',
    code: `def rob_helper(nums):
    prev2, prev1 = 0, 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1

def rob(nums):
    if len(nums) <= 2: return max(nums)
    # Two cases: exclude first OR exclude last
    return {{B1}}`,
    blanks: [
      { options:['rob_helper(nums)','max(rob_helper(nums[1:]), rob_helper(nums[:-1]))','rob_helper(nums[1:]) + rob_helper(nums[:-1])','min(rob_helper(nums[1:]), rob_helper(nums[:-1]))'], answerIdx:1, explanation:'Circular constraint: can\'t rob both first and last. Solve two LINEAR sub-problems (each excluding one end) and take the max.' },
    ],
  },
  {
    id: 'sn_decode_ways', problem: 'Decode Ways', pattern: 'DP', level: 'medium',
    brief: 'How many ways can the digit string s be decoded into letters (A=1..Z=26)?',
    code: `def num_decodings(s):
    if not s or s[0] == '0': return 0
    n = len(s)
    prev2, prev1 = 1, 1
    for i in range(1, n):
        cur = 0
        if {{B1}}:
            cur += prev1
        two = int(s[i - 1:i + 1])
        if 10 <= two <= 26:
            cur += {{B2}}
        prev2, prev1 = prev1, cur
    return prev1`,
    blanks: [
      { options:['s[i] != \'0\'','s[i] == \'0\'','s[i - 1] == \'1\'','i > 1'], answerIdx:0, explanation:'A single-digit decode succeeds iff the current digit is 1..9 (i.e., not zero). 0 alone has no valid letter.' },
      { options:['prev1','prev2','1','prev1 + prev2'], answerIdx:1, explanation:'A two-digit decode consumes s[i-1] and s[i]. The ways are the ways up to (i - 2), which is prev2 at this point.' },
    ],
  },
  {
    id: 'sn_unique_paths', problem: 'Unique Paths', pattern: 'DP', level: 'medium',
    brief: 'Robot at top-left of m×n grid; can move right or down. How many paths to bottom-right?',
    code: `def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = {{B1}}
    return dp[m - 1][n - 1]`,
    blanks: [
      { options:['dp[i - 1][j] + dp[i][j - 1]','dp[i - 1][j] * dp[i][j - 1]','1','max(dp[i - 1][j], dp[i][j - 1])'], answerIdx:0, explanation:'Each cell is reached from above OR from the left — sum the two predecessors\' path counts.' },
    ],
  },
  {
    id: 'sn_jump_game', problem: 'Jump Game', pattern: 'Greedy', level: 'medium',
    brief: 'Each element is your max jump length from that position. Can you reach the end?',
    code: `def can_jump(nums):
    max_reach = 0
    for i, n in enumerate(nums):
        if {{B1}}:
            return False
        max_reach = {{B2}}
    return True`,
    blanks: [
      { options:['i > max_reach','i < max_reach','max_reach == 0','i == len(nums)'], answerIdx:0, explanation:'If the current index is past the furthest we could have reached, no jumps can recover. Return False.' },
      { options:['max(max_reach, n)','max(max_reach, i + n)','i + n','n'], answerIdx:1, explanation:'From position i with jump n, max reachable = i + n. Track the max across all positions.' },
    ],
  },
  {
    id: 'sn_fib_memo', problem: 'Fibonacci (Memoized)', pattern: 'Top-down DP', level: 'easy',
    brief: 'Compute Fibonacci with memoization (top-down DP).',
    code: `def fib(n, cache=None):
    if cache is None: cache = {}
    if n < 2: return n
    if {{B1}}:
        return cache[n]
    cache[n] = {{B2}}
    return cache[n]`,
    blanks: [
      { options:['n in cache','cache[n]','cache.get(n)','len(cache) > n'], answerIdx:0, explanation:'<code>n in cache</code> tests membership without KeyError. Other forms either error or return wrong type.' },
      { options:['fib(n - 1) + fib(n - 2)','fib(n - 1, cache) + fib(n - 2, cache)','fib(n) - 1','fib(n - 1, cache)'], answerIdx:1, explanation:'Recurse and PASS the cache through — otherwise the cache resets on each call and you\'re back to O(2ⁿ).' },
    ],
  },

  // ── GRAPH ──────────────────────────────────────────────────────
  {
    id: 'sn_num_islands', problem: 'Number of Islands', pattern: 'DFS', level: 'medium',
    brief: 'Count groups of connected \'1\' cells in a 2D grid.',
    code: `def num_islands(grid):
    if not grid: return 0
    m, n = len(grid), len(grid[0])
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1':
            return
        {{B1}}
        for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
            dfs(r + dr, c + dc)
    count = 0
    for r in range(m):
        for c in range(n):
            if grid[r][c] == '1':
                {{B2}}
    return count`,
    blanks: [
      { options:['grid[r][c] = \'0\'','grid[r][c] = \'2\'','return','pass'], answerIdx:0, explanation:'Mark visited by SINKING (overwrite to \'0\'). Avoids needing a separate visited matrix and prevents revisits.' },
      { options:['count += 1','dfs(r, c); count += 1','count += 1; dfs(r, c)','grid[r][c] = \'0\''], answerIdx:1, explanation:'When we find an unvisited \'1\', sink the entire component via DFS and increment the count. Order matters less here but typically: dfs first, then count.' },
    ],
  },
  {
    id: 'sn_clone_graph', problem: 'Clone Graph', pattern: 'BFS/DFS + Map', level: 'medium',
    brief: 'Deep-copy an undirected graph (each node has val + neighbors[]).',
    code: `def clone_graph(node):
    if not node: return None
    cloned = {}
    def dfs(n):
        if n in cloned:
            return {{B1}}
        copy = Node(n.val)
        cloned[n] = copy
        for nei in n.neighbors:
            copy.neighbors.append({{B2}})
        return copy
    return dfs(node)`,
    blanks: [
      { options:['n','cloned[n]','copy','None'], answerIdx:1, explanation:'Already-cloned node — return its CLONE (not the original) so the new graph references the new structure.' },
      { options:['nei','dfs(nei)','cloned[nei]','Node(nei.val)'], answerIdx:1, explanation:'Recursively get/create the neighbor\'s clone. <code>cloned[nei]</code> may not exist yet — dfs handles both cases (create-or-fetch).' },
    ],
  },
  {
    id: 'sn_course_schedule', problem: 'Course Schedule', pattern: 'Topological Sort', level: 'medium',
    brief: 'Given prerequisites, can you finish all courses? (Cycle = no.)',
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
            if {{B1}}:
                q.append(v)
    return {{B2}}`,
    blanks: [
      { options:['indeg[v] > 0','indeg[v] == 0','indeg[v] < 0','v not in q'], answerIdx:1, explanation:'A node is ready exactly when its last prerequisite is satisfied — in-degree hits 0.' },
      { options:['taken > n','taken == n','len(q) == 0','True'], answerIdx:1, explanation:'If we processed every course, no cycle existed. Otherwise some cycle blocked progress.' },
    ],
  },
  {
    id: 'sn_pacific_atlantic', problem: 'Pacific Atlantic Water Flow', pattern: 'Reverse BFS/DFS', level: 'medium',
    brief: 'Find cells from which water can flow to BOTH the Pacific (top/left) and Atlantic (bottom/right) oceans.',
    code: `def pacific_atlantic(heights):
    m, n = len(heights), len(heights[0])
    pac, atl = set(), set()
    def dfs(r, c, visited):
        visited.add((r, c))
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in visited and {{B1}}:
                dfs(nr, nc, visited)
    # Start from each ocean's border cells
    for c in range(n): dfs(0, c, pac); dfs(m - 1, c, atl)
    for r in range(m): dfs(r, 0, pac); dfs(r, n - 1, atl)
    return [[r, c] for r in range(m) for c in range(n) if (r, c) in pac and (r, c) in atl]`,
    blanks: [
      { options:['heights[nr][nc] < heights[r][c]','heights[nr][nc] >= heights[r][c]','heights[nr][nc] == heights[r][c]','heights[nr][nc] > 0'], answerIdx:1, explanation:'We\'re reversing the flow: starting from ocean, climb UP (or equal) to source. A higher-or-equal neighbor could have flowed DOWN to here.' },
    ],
  },
  {
    id: 'sn_longest_consec', problem: 'Longest Consecutive Sequence', pattern: 'Hash Set', level: 'medium',
    brief: 'Longest run of consecutive integers (unsorted input). O(n) required.',
    code: `def longest_consecutive(nums):
    s = set(nums)
    best = 0
    for n in s:
        if {{B1}}:  # only start counting at the FIRST of a run
            length = 1
            while n + length in s:
                length += 1
            best = max(best, length)
    return best`,
    blanks: [
      { options:['n + 1 in s','n - 1 not in s','n == 0','n - 1 in s'], answerIdx:1, explanation:'Only START counting at the bottom of a run (n − 1 NOT in set). Otherwise we\'d re-count every member of every run → O(n²).' },
    ],
  },

  // ── INTERVAL ──────────────────────────────────────────────────────
  {
    id: 'sn_insert_interval', problem: 'Insert Interval', pattern: 'Linear Merge', level: 'medium',
    brief: 'Insert a new interval into a sorted list of non-overlapping intervals; merge as needed.',
    code: `def insert(intervals, new):
    out = []
    i = 0
    n = len(intervals)
    while i < n and intervals[i][1] < new[0]:
        out.append(intervals[i]); i += 1
    while i < n and {{B1}}:
        new = [min(new[0], intervals[i][0]), max(new[1], intervals[i][1])]
        i += 1
    out.append(new)
    out.extend(intervals[i:])
    return out`,
    blanks: [
      { options:['intervals[i][0] <= new[1]','intervals[i][1] <= new[0]','intervals[i][0] > new[1]','intervals[i][0] == new[0]'], answerIdx:0, explanation:'Overlap while the next interval starts before new ends. Merge by extending new\'s bounds.' },
    ],
  },
  {
    id: 'sn_merge_intervals', problem: 'Merge Intervals', pattern: 'Sort + Sweep', level: 'medium',
    brief: 'Merge all overlapping intervals.',
    code: `def merge(intervals):
    intervals.sort(key={{B1}})
    out = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= out[-1][1]:
            out[-1][1] = {{B2}}
        else:
            out.append([start, end])
    return out`,
    blanks: [
      { options:['lambda x: x[0]','lambda x: x[1]','lambda x: x','None'], answerIdx:0, explanation:'Sort by START to enable a single sweep — overlapping intervals will be adjacent in the sorted order.' },
      { options:['end','max(out[-1][1], end)','min(out[-1][1], end)','out[-1][1] + end'], answerIdx:1, explanation:'The merged interval ends at the LATER of the two ends — the new one might be entirely contained within.' },
    ],
  },
  {
    id: 'sn_non_overlap', problem: 'Non-overlapping Intervals', pattern: 'Greedy', level: 'medium',
    brief: 'Min number of intervals to REMOVE so the rest don\'t overlap.',
    code: `def erase_overlap(intervals):
    intervals.sort(key={{B1}})
    end = float('-inf')
    removed = 0
    for s, e in intervals:
        if s >= end:
            end = e
        else:
            removed += 1
    return removed`,
    blanks: [
      { options:['lambda x: x[0]','lambda x: x[1]','lambda x: x[1] - x[0]','None'], answerIdx:1, explanation:'Sort by END. Greedy: keep the earliest-finishing interval — leaves the most room for future picks.' },
    ],
  },
  {
    id: 'sn_meeting_rooms_ii', problem: 'Meeting Rooms II', pattern: 'Heap', level: 'medium',
    brief: 'Minimum number of meeting rooms needed.',
    code: `import heapq
def min_meeting_rooms(intervals):
    intervals.sort(key=lambda x: x[0])
    heap = []
    for s, e in intervals:
        if heap and {{B1}}:
            heapq.heappop(heap)
        heapq.heappush(heap, e)
    return len(heap)`,
    blanks: [
      { options:['heap[0] > s','heap[0] <= s','heap[0] == s','heap[0] >= e'], answerIdx:1, explanation:'If the earliest-finishing room is done before this meeting starts, REUSE it (pop). Otherwise allocate a new room (push without popping).' },
    ],
  },

  // ── LINKED LIST ──────────────────────────────────────────────────────
  {
    id: 'sn_reverse_list', problem: 'Reverse Linked List', pattern: 'Pointer Manipulation', level: 'easy',
    brief: 'In-place reversal with 3 pointers.',
    code: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        {{B1}}
        curr.next = {{B2}}
        prev = {{B3}}
        curr = nxt
    return prev`,
    blanks: [
      { options:['nxt = prev','nxt = curr','nxt = curr.next','nxt = head'], answerIdx:2, explanation:'Save curr.next BEFORE we overwrite it on the next line — otherwise the rest of the list is unreachable.' },
      { options:['nxt','prev','curr','head'], answerIdx:1, explanation:'The actual reversal: curr.next was pointing forward; redirect it backward to prev.' },
      { options:['nxt','curr','head','None'], answerIdx:1, explanation:'Advance prev to the just-flipped node. Then advance curr to the saved nxt.' },
    ],
  },
  {
    id: 'sn_list_cycle', problem: 'Linked List Cycle', pattern: 'Floyd\'s Tortoise/Hare', level: 'easy',
    brief: 'Detect a cycle with O(1) space.',
    code: `def has_cycle(head):
    slow = fast = head
    while {{B1}}:
        slow = slow.next
        fast = {{B2}}
        if slow == fast:
            return True
    return False`,
    blanks: [
      { options:['fast','fast.next','fast and fast.next','head'], answerIdx:2, explanation:'Both fast AND fast.next must be non-None before stepping two (fast.next.next crashes if either is None).' },
      { options:['fast.next','fast.next.next','slow.next','head.next'], answerIdx:1, explanation:'Fast advances TWO nodes. The differential 2 − 1 = 1 closes the gap by 1 per iteration → guaranteed meet inside any cycle.' },
    ],
  },
  {
    id: 'sn_merge_two_lists', problem: 'Merge Two Sorted Lists', pattern: 'Dummy Head', level: 'easy',
    brief: 'Merge l1 and l2 into one sorted list.',
    code: `def merge_two(l1, l2):
    dummy = ListNode()
    tail = dummy
    while l1 and l2:
        if {{B1}}:
            tail.next = l1; l1 = l1.next
        else:
            tail.next = l2; l2 = l2.next
        tail = tail.next
    tail.next = {{B2}}
    return dummy.next`,
    blanks: [
      { options:['l1.val <= l2.val','l1.val > l2.val','l1.val == l2.val','True'], answerIdx:0, explanation:'Attach the smaller of l1 and l2. <= (not <) keeps the sort stable — equal values keep input order.' },
      { options:['None','l1 or l2','l1 + l2','dummy'], answerIdx:1, explanation:'One list is exhausted; the other\'s remainder is already sorted. Attach whichever is non-None.' },
    ],
  },
  {
    id: 'sn_merge_k_lists', problem: 'Merge K Sorted Lists', pattern: 'Min-Heap', level: 'hard',
    brief: 'Merge k sorted linked lists into one.',
    code: `import heapq
def merge_k_lists(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst.val, i, lst))
    dummy = ListNode()
    tail = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        tail.next = node; tail = tail.next
        if {{B1}}:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
    blanks: [
      { options:['node','node.next','tail','heap'], answerIdx:1, explanation:'Only push the next node if it exists. If we already consumed the last node of this list, skip.' },
    ],
  },
  {
    id: 'sn_remove_nth', problem: 'Remove Nth From End', pattern: 'Two-Pointer Gap', level:'medium',
    brief: 'Remove the n-th node from the end in one pass.',
    code: `def remove_nth(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range({{B1}}):
        fast = fast.next
    while fast.next:
        slow = slow.next
        fast = fast.next
    slow.next = {{B2}}
    return dummy.next`,
    blanks: [
      { options:['n','n + 1','n - 1','len(head)'], answerIdx:0, explanation:'Advance fast by n steps so it leads slow by n. When fast.next is None, slow is JUST BEFORE the target (n-th from end).' },
      { options:['slow','slow.next.next','None','dummy'], answerIdx:1, explanation:'Skip over slow.next — that\'s the node to remove. Standard linked-list "skip" deletion.' },
    ],
  },
  {
    id: 'sn_reorder_list', problem: 'Reorder List', pattern: 'Find Mid + Reverse + Merge', level: 'medium',
    brief: 'Reorder L0→L1→...→Ln to L0→Ln→L1→Ln-1→...',
    code: `def reorder_list(head):
    # 1. Find middle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next; fast = fast.next.next
    # 2. Reverse second half
    prev, curr = None, {{B1}}
    slow.next = None
    while curr:
        nxt = curr.next; curr.next = prev; prev = curr; curr = nxt
    # 3. Merge two halves
    first, second = head, prev
    while {{B2}}:
        t1, t2 = first.next, second.next
        first.next = second; second.next = t1
        first, second = t1, t2`,
    blanks: [
      { options:['head','slow','slow.next','None'], answerIdx:2, explanation:'After finding mid, the second half starts at slow.next. We reverse from there. Cutting slow.next = None splits the list.' },
      { options:['first','second','first and second','first.next'], answerIdx:1, explanation:'second is the shorter half (for odd-length lists). Loop while second still has nodes to interleave.' },
    ],
  },

  // ── MATRIX ──────────────────────────────────────────────────────
  {
    id: 'sn_set_matrix_zero', problem: 'Set Matrix Zeroes', pattern: 'In-Place', level: 'medium',
    brief: 'For every cell == 0, zero its entire row and column. O(1) space.',
    code: `def set_zeroes(matrix):
    m, n = len(matrix), len(matrix[0])
    first_row = any(matrix[0][j] == 0 for j in range(n))
    first_col = any(matrix[i][0] == 0 for i in range(m))
    # Use row 0 and col 0 as flags
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = matrix[0][j] = {{B1}}
    # Zero out cells based on flags
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = {{B2}}
    if first_row:
        for j in range(n): matrix[0][j] = 0
    if first_col:
        for i in range(m): matrix[i][0] = 0`,
    blanks: [
      { options:['1','0','-1','None'], answerIdx:1, explanation:'Mark the row\'s and column\'s flag cells with 0 — same sentinel we want to apply later.' },
      { options:['1','0','matrix[i][j]','None'], answerIdx:1, explanation:'When either row-flag or col-flag is 0, zero the cell.' },
    ],
  },
  {
    id: 'sn_spiral_matrix', problem: 'Spiral Matrix', pattern: 'Boundary Tracking', level: 'medium',
    brief: 'Return all elements of the matrix in spiral order.',
    code: `def spiral_order(matrix):
    out = []
    top, bot = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bot and left <= right:
        for c in range(left, right + 1): out.append(matrix[top][c])
        {{B1}}
        for r in range(top, bot + 1): out.append(matrix[r][right])
        right -= 1
        if top <= bot:
            for c in range(right, left - 1, -1): out.append(matrix[bot][c])
            bot -= 1
        if {{B2}}:
            for r in range(bot, top - 1, -1): out.append(matrix[r][left])
            left += 1
    return out`,
    blanks: [
      { options:['top -= 1','top += 1','bot -= 1','left += 1'], answerIdx:1, explanation:'After walking the top row, exclude it from future iterations. Increment top, not decrement.' },
      { options:['top <= bot','left <= right','top < bot','True'], answerIdx:0, explanation:'After top++ and bot-- met, no rows remain. Skip the left-column walk to avoid re-walking a row. Similar check for the bottom walk.' },
    ],
  },
  {
    id: 'sn_rotate_image', problem: 'Rotate Image', pattern: 'Transpose + Reverse', level: 'medium',
    brief: 'Rotate an N×N matrix 90° clockwise in place.',
    code: `def rotate(matrix):
    n = len(matrix)
    # Transpose
    for i in range(n):
        for j in range({{B1}}):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse each row
    for row in matrix:
        {{B2}}`,
    blanks: [
      { options:['n','i + 1','i','n - i'], answerIdx:1, explanation:'Only swap each pair ONCE. j starts at i + 1 so we don\'t un-swap diagonally-mirrored pairs.' },
      { options:['row.sort()','row.reverse()','row.clear()','reversed(row)'], answerIdx:1, explanation:'Transpose + row reversal = 90° clockwise rotation. <code>reversed()</code> returns an iterator without mutating.' },
    ],
  },
  {
    id: 'sn_word_search', problem: 'Word Search', pattern: 'Backtracking on Grid', level: 'medium',
    brief: 'Does the grid contain `word` (4-directional path, no cell reuse)?',
    code: `def exist(board, word):
    m, n = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word): return True
        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != word[i]:
            return False
        saved = board[r][c]
        board[r][c] = {{B1}}
        found = dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1)
        board[r][c] = {{B2}}
        return found
    for r in range(m):
        for c in range(n):
            if dfs(r, c, 0): return True
    return False`,
    blanks: [
      { options:['\'#\'','board[r][c]','None','word[i]'], answerIdx:0, explanation:'Overwrite with a sentinel that won\'t match any letter. \'#\' (or 0) ensures we don\'t revisit this cell.' },
      { options:['\'#\'','saved','None','word[i]'], answerIdx:1, explanation:'Restore the cell on backtrack — the un-choose step. Without this, the cell stays marked for sibling DFS calls.' },
    ],
  },

  // ── STRING ──────────────────────────────────────────────────────
  {
    id: 'sn_longest_substr', problem: 'Longest Substring Without Repeating', pattern: 'Sliding Window', level: 'medium',
    brief: 'Length of the longest substring with no repeating characters.',
    code: `def length_of_longest_substring(s):
    seen = {}
    L = best = 0
    for R, c in enumerate(s):
        if c in seen and {{B1}}:
            L = {{B2}}
        seen[c] = R
        best = {{B3}}
    return best`,
    blanks: [
      { options:['seen[c] > L','seen[c] >= L','seen[c] < L','c == s[L]'], answerIdx:1, explanation:'The previous occurrence must be INSIDE the current window — its index ≥ L. Otherwise it\'s already been evicted.' },
      { options:['seen[c]','seen[c] + 1','L + 1','R'], answerIdx:1, explanation:'Jump L past the previous occurrence — evicts the duplicate in one step.' },
      { options:['R - L','max(best, R - L + 1)','R + 1','best + 1'], answerIdx:1, explanation:'Window length is R − L + 1 (inclusive on both ends). Track the running max.' },
    ],
  },
  {
    id: 'sn_long_repl_char', problem: 'Longest Repeating Character Replacement', pattern: 'Sliding Window', level: 'medium',
    brief: 'Longest substring containing the same letter after at most k replacements.',
    code: `def char_replacement(s, k):
    count = {}
    L = max_freq = best = 0
    for R, c in enumerate(s):
        count[c] = count.get(c, 0) + 1
        max_freq = max(max_freq, count[c])
        while (R - L + 1) - max_freq > k:
            {{B1}}
            L += 1
        best = max(best, {{B2}})
    return best`,
    blanks: [
      { options:['count[s[R]] -= 1','count[s[L]] -= 1','count[c] -= 1','count.clear()'], answerIdx:1, explanation:'Shrinking from the left removes s[L]. Decrement its count.' },
      { options:['max_freq','R - L + 1','R - L','best + 1'], answerIdx:1, explanation:'Best valid window length. (Note: max_freq is intentionally not decremented when shrinking — the answer only grows when a LARGER valid window appears.)' },
    ],
  },
  {
    id: 'sn_min_window', problem: 'Minimum Window Substring', pattern: 'Sliding Window', level: 'hard',
    brief: 'Smallest substring of s that contains every char of t (with multiplicities).',
    code: `def min_window(s, t):
    if not t or not s: return ""
    need = {}
    for c in t: need[c] = need.get(c, 0) + 1
    have, required = 0, len(need)
    res = [-1, -1, float('inf')]
    L = 0
    have_count = {}
    for R, c in enumerate(s):
        have_count[c] = have_count.get(c, 0) + 1
        if c in need and have_count[c] == need[c]:
            have += 1
        while {{B1}}:
            if R - L + 1 < res[2]:
                res = [L, R, R - L + 1]
            have_count[s[L]] -= 1
            if s[L] in need and have_count[s[L]] < need[s[L]]:
                {{B2}}
            L += 1
    return s[res[0]:res[1] + 1] if res[2] != float('inf') else ""`,
    blanks: [
      { options:['have < required','have == required','R > L','have_count','True'], answerIdx:1, explanation:'Shrink while the window contains everything we need (all required chars met). Record min length, then shrink further.' },
      { options:['have += 1','have -= 1','have = 0','required -= 1'], answerIdx:1, explanation:'Shrinking dropped s[L] below its required count — the window is no longer valid for that char. Decrement have to break the while.' },
    ],
  },
  {
    id: 'sn_valid_anagram', problem: 'Valid Anagram', pattern: 'Counter', level: 'easy',
    brief: 'Is t an anagram of s?',
    code: `def is_anagram(s, t):
    if {{B1}}: return False
    count = {}
    for c in s: count[c] = count.get(c, 0) + 1
    for c in t:
        if {{B2}}:
            return False
        count[c] -= 1
    return True`,
    blanks: [
      { options:['len(s) != len(t)','len(s) == len(t)','s == t','len(s) > 0'], answerIdx:0, explanation:'Different lengths → can\'t be anagrams. Bail out before counting.' },
      { options:['c not in count','count.get(c, 0) == 0','c not in count or count[c] == 0','count[c] > 0'], answerIdx:2, explanation:'Either c never appeared in s, OR it appeared but is exhausted. Both mean t has more of c than s — not anagrams.' },
    ],
  },
  {
    id: 'sn_group_anagrams', problem: 'Group Anagrams', pattern: 'Hash by Canonical Key', level: 'medium',
    brief: 'Group strings that are anagrams of each other.',
    code: `def group_anagrams(strs):
    groups = {}
    for s in strs:
        key = {{B1}}
        groups.setdefault(key, []).append(s)
    return list(groups.values())`,
    blanks: [
      { options:['s','\'\'.join(sorted(s))','s[0]','len(s)'], answerIdx:1, explanation:'Anagrams share a canonical form: their sorted character string. "eat", "tea", "ate" all sort to "aet".' },
    ],
  },
  {
    id: 'sn_valid_parens', problem: 'Valid Parentheses', pattern: 'Stack', level: 'easy',
    brief: 'Determine if a string of ()[]{}, is properly balanced.',
    code: `def is_valid(s):
    stack = []
    pair = {')': '(', ']': '[', '}': '{'}
    for c in s:
        if c in pair:
            if {{B1}}:
                return False
        else:
            {{B2}}
    return not stack`,
    blanks: [
      { options:['stack[-1] != pair[c]','not stack or stack.pop() != pair[c]','stack.peek() != c','len(stack) == 0'], answerIdx:1, explanation:'Two checks in one: empty stack (no opener to match) OR popped top doesn\'t match. Both → invalid.' },
      { options:['stack.append(c)','stack.pop()','stack.extend(c)','pass'], answerIdx:0, explanation:'It\'s an opener — push it for a future closer to match against.' },
    ],
  },
  {
    id: 'sn_valid_palindrome', problem: 'Valid Palindrome', pattern: 'Two Pointers', level: 'easy',
    brief: 'Check if string is a palindrome, ignoring non-alphanumeric and case.',
    code: `def is_palindrome(s):
    L, R = 0, len(s) - 1
    while {{B1}}:
        while L < R and not s[L].isalnum(): L += 1
        while L < R and not s[R].isalnum(): R -= 1
        if {{B2}}: return False
        L += 1; R -= 1
    return True`,
    blanks: [
      { options:['L <= R','L < R','L != R','L < len(s)'], answerIdx:1, explanation:'Strict <. When L == R it\'s a single middle char that trivially equals itself.' },
      { options:['s[L] != s[R]','s[L].lower() != s[R].lower()','s[L] == s[R]','s[L].upper() == s[R]'], answerIdx:1, explanation:'Palindrome check is case-insensitive — lowercase both sides before comparing.' },
    ],
  },
  {
    id: 'sn_longest_palin_substr', problem: 'Longest Palindromic Substring', pattern: 'Expand Around Center', level: 'medium',
    brief: 'Return the longest palindromic substring.',
    code: `def longest_palindrome(s):
    res = ""
    def expand(L, R):
        while L >= 0 and R < len(s) and s[L] == s[R]:
            L -= 1; R += 1
        return s[L + 1:R]
    for i in range(len(s)):
        # Odd-length palindromes
        p1 = expand({{B1}})
        # Even-length palindromes
        p2 = expand({{B2}})
        for p in (p1, p2):
            if len(p) > len(res): res = p
    return res`,
    blanks: [
      { options:['i, i','i - 1, i + 1','i, i + 1','0, i'], answerIdx:0, explanation:'Odd-length palindromes are centered on a single char — start with L = R = i.' },
      { options:['i, i','i - 1, i','i, i + 1','i + 1, i + 1'], answerIdx:2, explanation:'Even-length palindromes are centered between two chars — start with L = i, R = i + 1.' },
    ],
  },
  {
    id: 'sn_palin_substrings', problem: 'Palindromic Substrings', pattern: 'Expand Around Center', level: 'medium',
    brief: 'Count all palindromic substrings (each occurrence counts).',
    code: `def count_substrings(s):
    count = 0
    def expand(L, R):
        nonlocal count
        while L >= 0 and R < len(s) and s[L] == s[R]:
            {{B1}}
            L -= 1; R += 1
    for i in range(len(s)):
        expand(i, i); expand(i, i + 1)
    return count`,
    blanks: [
      { options:['count += 1','count = 1','count *= 2','count += R - L + 1'], answerIdx:0, explanation:'Every successful expansion is one more palindrome (a longer one with the same center). Increment by 1.' },
    ],
  },

  // ── TREE ──────────────────────────────────────────────────────
  {
    id: 'sn_max_depth', problem: 'Maximum Depth of Binary Tree', pattern: 'Tree Recursion', level: 'easy',
    brief: 'Return the depth of the deepest leaf.',
    code: `def max_depth(root):
    if {{B1}}: return 0
    return {{B2}}`,
    blanks: [
      { options:['root.val == 0','not root','root.left and root.right','root is True'], answerIdx:1, explanation:'Base case: an empty subtree contributes 0 to depth. Handles both "tree is empty" and "recursed into a None child."' },
      { options:['max_depth(root.left) + max_depth(root.right)','max(max_depth(root.left), max_depth(root.right))','1 + max(max_depth(root.left), max_depth(root.right))','1 + max_depth(root.left)'], answerIdx:2, explanation:'+1 for the current node; max() picks the deeper subtree.' },
    ],
  },
  {
    id: 'sn_same_tree', problem: 'Same Tree', pattern: 'Tree Recursion', level: 'easy',
    brief: 'Are two binary trees structurally identical with the same values?',
    code: `def is_same_tree(p, q):
    if not p and not q: return True
    if not p or not q: return False
    return {{B1}}`,
    blanks: [
      { options:['p.val == q.val','p.val == q.val and is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)','is_same_tree(p.left, q.left)','True'], answerIdx:1, explanation:'Three conditions: same value, same left subtrees, same right subtrees. All required.' },
    ],
  },
  {
    id: 'sn_invert_tree', problem: 'Invert Binary Tree', pattern: 'Tree Recursion', level: 'easy',
    brief: 'Swap every node\'s left and right child.',
    code: `def invert_tree(root):
    if not root: return None
    {{B1}}
    invert_tree(root.left)
    invert_tree(root.right)
    return root`,
    blanks: [
      { options:['root.left = root.right','root.left, root.right = root.right, root.left','root.right = root.left','root.val = -root.val'], answerIdx:1, explanation:'Tuple-swap atomically — without it the first assignment would overwrite the value you need for the second.' },
    ],
  },
  {
    id: 'sn_max_path_sum', problem: 'Binary Tree Maximum Path Sum', pattern: 'Post-order DFS', level: 'hard',
    brief: 'Find the path (between any two nodes) with the largest sum.',
    code: `def max_path_sum(root):
    best = float('-inf')
    def dfs(node):
        nonlocal best
        if not node: return 0
        left = {{B1}}
        right = {{B1}}
        best = max(best, {{B2}})
        return node.val + max(left, right)
    dfs(root)
    return best`,
    blanks: [
      { options:['max(dfs(node.left), 0)','dfs(node.left)','node.left.val','dfs(node.left) + 1'], answerIdx:0, explanation:'Negative subtrees should be IGNORED — use 0 instead. max(dfs(...), 0) is the "don\'t take this path" option.' },
      { options:['node.val + left + right','left + right','node.val','max(left, right)'], answerIdx:0, explanation:'The path THROUGH this node = left + node.val + right. Update the global best.' },
    ],
  },
  {
    id: 'sn_level_order', problem: 'Binary Tree Level Order Traversal', pattern: 'BFS', level: 'medium',
    brief: 'Return values level-by-level (list of lists).',
    code: `from collections import deque
def level_order(root):
    if not root: return []
    out = []
    q = deque([root])
    while q:
        level = []
        for _ in range({{B1}}):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        out.append(level)
    return out`,
    blanks: [
      { options:['len(q)','1','len(q) + 1','len(out)'], answerIdx:0, explanation:'Snapshot len(q) BEFORE the inner loop — that\'s the size of the current level. Processing exactly len(q) nodes keeps levels distinct.' },
    ],
  },
  {
    id: 'sn_serialize_tree', problem: 'Serialize/Deserialize Binary Tree', pattern: 'Pre-order DFS', level: 'hard',
    brief: 'Convert tree ↔ string for storage/transmission.',
    code: `def serialize(root):
    out = []
    def dfs(node):
        if not node:
            out.append('null')
            return
        out.append(str(node.val))
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return ','.join(out)

def deserialize(data):
    tokens = iter(data.split(','))
    def build():
        v = next(tokens)
        if v == 'null': return None
        node = TreeNode(int(v))
        node.left = {{B1}}
        node.right = {{B1}}
        return node
    return build()`,
    blanks: [
      { options:['None','build()','TreeNode(v)','tokens[0]'], answerIdx:1, explanation:'Recursively rebuild the left then right subtree, in the SAME order serialize wrote them. The iterator preserves position across calls.' },
    ],
  },
  {
    id: 'sn_subtree', problem: 'Subtree of Another Tree', pattern: 'Tree Recursion', level: 'easy',
    brief: 'Does t appear as a subtree of s?',
    code: `def is_subtree(s, t):
    if not s: return False
    if is_same(s, t): return True
    return {{B1}}

def is_same(a, b):
    if not a and not b: return True
    if not a or not b: return False
    return a.val == b.val and is_same(a.left, b.left) and is_same(a.right, b.right)`,
    blanks: [
      { options:['is_subtree(s.left, t) or is_subtree(s.right, t)','is_subtree(s.left, t.left)','True','False'], answerIdx:0, explanation:'If t doesn\'t match the current s, recurse into either of s\'s subtrees. OR not AND.' },
    ],
  },
  {
    id: 'sn_validate_bst', problem: 'Validate BST', pattern: 'Recursion with Bounds', level: 'medium',
    brief: 'Determine if the binary tree is a valid BST.',
    code: `def is_valid_bst(root):
    def check(node, lo, hi):
        if not node: return True
        if not (lo < node.val < hi): return False
        return check(node.left, {{B1}}) and check(node.right, {{B2}})
    return check(root, float('-inf'), float('inf'))`,
    blanks: [
      { options:['lo, node.val','node.val, hi','-inf, hi','0, node.val'], answerIdx:0, explanation:'Left subtree: lower bound unchanged, upper bound tightens to node.val.' },
      { options:['lo, node.val','node.val, hi','lo, inf','node.val, inf'], answerIdx:1, explanation:'Right subtree: lower bound tightens to node.val, upper bound unchanged.' },
    ],
  },
  {
    id: 'sn_kth_smallest_bst', problem: 'Kth Smallest in BST', pattern: 'In-order Traversal', level: 'medium',
    brief: 'Find the kth smallest value in a BST.',
    code: `def kth_smallest(root, k):
    stack = []
    while root or stack:
        while root:
            stack.append(root)
            root = root.left
        root = stack.pop()
        k -= 1
        if {{B1}}: return root.val
        root = root.right`,
    blanks: [
      { options:['k == 0','k > 0','k == 1','stack'], answerIdx:0, explanation:'In-order visits BST values in sorted order. After visiting k nodes, k counts down to 0 — that\'s the kth smallest.' },
    ],
  },
  {
    id: 'sn_lca_bst', problem: 'Lowest Common Ancestor of BST', pattern: 'BST Property', level: 'easy',
    brief: 'LCA of two nodes in a BST.',
    code: `def lowest_common_ancestor(root, p, q):
    while root:
        if {{B1}}:
            root = root.left
        elif {{B2}}:
            root = root.right
        else:
            return root`,
    blanks: [
      { options:['p.val < root.val and q.val < root.val','p.val > root.val','root.left','p.val == root.val'], answerIdx:0, explanation:'Both targets in left subtree → recurse left. (Strictly less than. = would mean p is the ancestor.)' },
      { options:['p.val < root.val and q.val < root.val','p.val > root.val and q.val > root.val','root.right','True'], answerIdx:1, explanation:'Both targets in right subtree → recurse right.' },
    ],
  },
  {
    id: 'sn_trie_insert', problem: 'Implement Trie', pattern: 'Trie', level: 'medium',
    brief: 'Trie node + insert.',
    code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for c in word:
            if {{B1}}:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = {{B2}}`,
    blanks: [
      { options:['c in node.children','c not in node.children','c == \'\'','True'], answerIdx:1, explanation:'Create a new node only if no child for c exists yet — otherwise REUSE the existing one (shared prefix).' },
      { options:['False','True','c','word'], answerIdx:1, explanation:'Mark the last node as "end of a complete word" — distinguishes "this word was inserted" from "this is just a prefix."' },
    ],
  },

  // ── HEAP ──────────────────────────────────────────────────────
  {
    id: 'sn_top_k_freq', problem: 'Top K Frequent Elements', pattern: 'Min-Heap', level: 'medium',
    brief: 'Return the K most frequent elements.',
    code: `import heapq
from collections import Counter
def top_k_frequent(nums, k):
    counts = Counter(nums)
    heap = []
    for val, freq in counts.items():
        heapq.heappush(heap, {{B1}})
        if len(heap) > k:
            heapq.heappop(heap)
    return [v for _, v in heap]`,
    blanks: [
      { options:['(val, freq)','(freq, val)','(-freq, val)','val'], answerIdx:1, explanation:'Order by FREQUENCY (first tuple element). Python heaps are MIN heaps — top is smallest freq → pop when exceeding K.' },
    ],
  },
  {
    id: 'sn_find_median', problem: 'Find Median from Data Stream', pattern: 'Two Heaps', level: 'hard',
    brief: 'Support addNum and findMedian on a stream of integers.',
    code: `import heapq
class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (negate values)
        self.large = []  # min-heap

    def addNum(self, n):
        heapq.heappush(self.small, {{B1}})
        # Balance: ensure largest of small ≤ smallest of large
        if self.small and self.large and -self.small[0] > self.large[0]:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        # Resize so |small| - |large| ∈ {0, 1}
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        elif len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return {{B2}}`,
    blanks: [
      { options:['n','-n','n + 1','abs(n)'], answerIdx:1, explanation:'Python only has min-heaps. To simulate a max-heap, push negated values. Top is then "smallest negated" = "largest original."' },
      { options:['self.small[0]','(-self.small[0] + self.large[0]) / 2','self.large[0]','0'], answerIdx:1, explanation:'Even-count case: median is the average of small\'s top (negated) and large\'s top.' },
    ],
  },
  {
    id: 'sn_k_closest_points', problem: 'K Closest Points to Origin', pattern: 'Max-Heap', level: 'medium',
    brief: 'Return the K points closest to the origin.',
    code: `import heapq
def k_closest(points, k):
    heap = []
    for x, y in points:
        d = x * x + y * y
        heapq.heappush(heap, ({{B1}}, x, y))
        if len(heap) > k:
            heapq.heappop(heap)
    return [[x, y] for _, x, y in heap]`,
    blanks: [
      { options:['d','-d','x','y'], answerIdx:1, explanation:'We want the K SMALLEST distances. Maintain a heap of size K with NEGATED distances so the FARTHEST is at the top — pop it when exceeding K.' },
    ],
  },
];

const SNIPPETS_PER_SESSION = 20;
