// ── MANUAL_SOLUTIONS — reference code for problems not covered by other sources
// Keyed by integer problem ID. Merged into REFERENCE_CODE as lowest-priority
// fallback (existing sources 1–4 in reference-code.js still win).
// All solutions are clean, optimal Python 3.

const MANUAL_SOLUTIONS = {

  // ── 11: Sum of Two Integers ──────────────────────────────────────────────
  11:
`def get_sum(a: int, b: int) -> int:
    mask = 0xFFFFFFFF
    while b & mask:
        a, b = a ^ b, (a & b) << 1
    return a if b == 0 else ~(a ^ mask)`,

  // ── 32: Alien Dictionary ─────────────────────────────────────────────────
  32:
`from collections import defaultdict, deque

def alien_order(words: list[str]) -> str:
    adj = defaultdict(set)
    in_degree = {c: 0 for w in words for c in w}
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""
        for j in range(min_len):
            if w1[j] != w2[j]:
                if w2[j] not in adj[w1[j]]:
                    adj[w1[j]].add(w2[j])
                    in_degree[w2[j]] += 1
                break
    q = deque(c for c in in_degree if in_degree[c] == 0)
    result = []
    while q:
        c = q.popleft()
        result.append(c)
        for nei in adj[c]:
            in_degree[nei] -= 1
            if in_degree[nei] == 0:
                q.append(nei)
    return "".join(result) if len(result) == len(in_degree) else ""`,

  // ── 33: Graph Valid Tree ─────────────────────────────────────────────────
  33:
`def valid_tree(n: int, edges: list[list[int]]) -> bool:
    if len(edges) != n - 1:
        return False
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = set()
    def dfs(node, parent):
        visited.add(node)
        for nei in adj[node]:
            if nei == parent:
                continue
            if nei in visited or not dfs(nei, node):
                return False
        return True
    return dfs(0, -1) and len(visited) == n`,

  // ── 38: Meeting Rooms ────────────────────────────────────────────────────
  38:
`def can_attend_meetings(intervals: list[list[int]]) -> bool:
    intervals.sort()
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    return True`,

  // ── 59: Encode and Decode Strings ───────────────────────────────────────
  59:
`class Codec:
    def encode(self, strs: list[str]) -> str:
        return "".join(f"{len(s)}#{s}" for s in strs)

    def decode(self, s: str) -> list[str]:
        result, i = [], 0
        while i < len(s):
            j = s.index('#', i)
            length = int(s[i:j])
            result.append(s[j + 1 : j + 1 + length])
            i = j + 1 + length
        return result`,

  // ── 65: Serialize and Deserialize Binary Tree ───────────────────────────
  65:
`from collections import deque

class Codec:
    def serialize(self, root) -> str:
        if not root:
            return "null"
        res, q = [], deque([root])
        while q:
            node = q.popleft()
            if node:
                res.append(str(node.val))
                q.append(node.left)
                q.append(node.right)
            else:
                res.append("null")
        return ",".join(res)

    def deserialize(self, data: str):
        if data == "null":
            return None
        vals = data.split(",")
        root = TreeNode(int(vals[0]))
        q, i = deque([root]), 1
        while q:
            node = q.popleft()
            if vals[i] != "null":
                node.left = TreeNode(int(vals[i]))
                q.append(node.left)
            i += 1
            if vals[i] != "null":
                node.right = TreeNode(int(vals[i]))
                q.append(node.right)
            i += 1
        return root`,

  // ── 67: Construct Binary Tree from Preorder and Inorder ─────────────────
  67:
`def build_tree(preorder: list[int], inorder: list[int]):
    idx_map = {val: i for i, val in enumerate(inorder)}
    pre_idx = [0]

    def helper(left, right):
        if left > right:
            return None
        root_val = preorder[pre_idx[0]]
        pre_idx[0] += 1
        root = TreeNode(root_val)
        mid = idx_map[root_val]
        root.left = helper(left, mid - 1)
        root.right = helper(mid + 1, right)
        return root

    return helper(0, len(inorder) - 1)`,

  // ── 69: Kth Smallest Element in a BST ───────────────────────────────────
  69:
`def kth_smallest(root, k: int) -> int:
    stack, node = [], root
    while stack or node:
        while node:
            stack.append(node)
            node = node.left
        node = stack.pop()
        k -= 1
        if k == 0:
            return node.val
        node = node.right`,

  // ── 72: Design Add and Search Words Data Structure ───────────────────────
  72:
`class WordDictionary:
    def __init__(self):
        self.trie = {}

    def addWord(self, word: str) -> None:
        node = self.trie
        for c in word:
            node = node.setdefault(c, {})
        node['#'] = True

    def search(self, word: str) -> bool:
        def dfs(node, i):
            if i == len(word):
                return '#' in node
            c = word[i]
            if c == '.':
                return any(dfs(node[k], i + 1) for k in node if k != '#')
            if c not in node:
                return False
            return dfs(node[c], i + 1)
        return dfs(self.trie, 0)`,

  // ── 73: Word Search II ───────────────────────────────────────────────────
  73:
`def find_words(board: list[list[str]], words: list[str]) -> list[str]:
    trie, result = {}, []
    for word in words:
        node = trie
        for c in word:
            node = node.setdefault(c, {})
        node['#'] = word

    rows, cols = len(board), len(board[0])

    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node:
            return
        next_node = node[ch]
        if '#' in next_node:
            result.append(next_node.pop('#'))
        board[r][c] = '#'
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                dfs(nr, nc, next_node)
        board[r][c] = ch

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, trie)
    return result`,

  // ── 77: Sliding Window Maximum ───────────────────────────────────────────
  77:
`from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    q, result = deque(), []
    for i, n in enumerate(nums):
        while q and nums[q[-1]] <= n:
            q.pop()
        q.append(i)
        if q[0] == i - k:
            q.popleft()
        if i >= k - 1:
            result.append(nums[q[0]])
    return result`,

  // ── 78: LRU Cache ────────────────────────────────────────────────────────
  78:
`from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)`,

  // ── 79: Largest Rectangle in Histogram ──────────────────────────────────
  79:
`def largest_rectangle_area(heights: list[int]) -> int:
    stack, max_area = [], 0
    for i, h in enumerate(heights + [0]):
        start = i
        while stack and stack[-1][1] >= h:
            idx, height = stack.pop()
            max_area = max(max_area, height * (i - idx))
            start = idx
        stack.append((start, h))
    return max_area`,

  // ── 80: Best Time to Buy and Sell Stock IV ───────────────────────────────
  80:
`def max_profit(k: int, prices: list[int]) -> int:
    n = len(prices)
    if k >= n // 2:
        return sum(max(0, prices[i + 1] - prices[i]) for i in range(n - 1))
    dp = [[0] * n for _ in range(k + 1)]
    for t in range(1, k + 1):
        max_so_far = -prices[0]
        for d in range(1, n):
            dp[t][d] = max(dp[t][d - 1], prices[d] + max_so_far)
            max_so_far = max(max_so_far, dp[t - 1][d] - prices[d])
    return dp[k][n - 1]`,

  // ── 81: Edit Distance ────────────────────────────────────────────────────
  81:
`def min_distance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev, dp[0] = dp[0], i
        for j in range(1, n + 1):
            temp = dp[j]
            if word1[i - 1] == word2[j - 1]:
                dp[j] = prev
            else:
                dp[j] = 1 + min(prev, dp[j], dp[j - 1])
            prev = temp
    return dp[n]`,

  // ── 82: Regular Expression Matching ─────────────────────────────────────
  82:
`def is_match(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(2, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                dp[i][j] = dp[i][j - 2]
                if p[j - 2] in {s[i - 1], '.'}:
                    dp[i][j] |= dp[i - 1][j]
            elif p[j - 1] in {s[i - 1], '.'}:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[m][n]`,

  // ── 83: Burst Balloons ───────────────────────────────────────────────────
  83:
`def max_coins(nums: list[int]) -> int:
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):
        for left in range(n - length):
            right = left + length
            for k in range(left + 1, right):
                coins = nums[left] * nums[k] * nums[right]
                dp[left][right] = max(dp[left][right], coins + dp[left][k] + dp[k][right])
    return dp[0][n - 1]`,

  // ── 84: Best Time to Buy and Sell Stock with Cooldown ───────────────────
  84:
`def max_profit(prices: list[int]) -> int:
    held, sold, rest = -prices[0], 0, 0
    for price in prices[1:]:
        held, sold, rest = max(held, rest - price), held + price, max(rest, sold)
    return max(sold, rest)`,

  // ── 86: Longest Valid Parentheses ────────────────────────────────────────
  86:
`def longest_valid_parentheses(s: str) -> int:
    stack, max_len = [-1], 0
    for i, c in enumerate(s):
        if c == '(':
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)
            else:
                max_len = max(max_len, i - stack[-1])
    return max_len`,

  // ── 87: Reverse Nodes in k-Group ─────────────────────────────────────────
  87:
`def reverse_k_group(head, k: int):
    node, count = head, 0
    while node and count < k:
        node = node.next
        count += 1
    if count < k:
        return head
    prev, curr = None, head
    for _ in range(k):
        curr.next, prev, curr = prev, curr, curr.next
    head.next = reverse_k_group(curr, k)
    return prev`,

  // ── 88: Median of Two Sorted Arrays ─────────────────────────────────────
  88:
`def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    A, B = nums1, nums2
    if len(A) > len(B):
        A, B = B, A
    total, half = len(A) + len(B), (len(A) + len(B)) // 2
    lo, hi = 0, len(A)
    while True:
        i = (lo + hi) // 2
        j = half - i
        a_left  = A[i - 1] if i > 0      else float('-inf')
        a_right = A[i]     if i < len(A) else float('inf')
        b_left  = B[j - 1] if j > 0      else float('-inf')
        b_right = B[j]     if j < len(B) else float('inf')
        if a_left <= b_right and b_left <= a_right:
            if total % 2:
                return min(a_right, b_right)
            return (max(a_left, b_left) + min(a_right, b_right)) / 2
        elif a_left > b_right:
            hi = i - 1
        else:
            lo = i + 1`,

  // ── 89: Sudoku Solver ────────────────────────────────────────────────────
  89:
`def solve_sudoku(board: list[list[str]]) -> None:
    rows  = [set() for _ in range(9)]
    cols  = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    empty = []
    for r in range(9):
        for c in range(9):
            if board[r][c] == '.':
                empty.append((r, c))
            else:
                num = board[r][c]
                rows[r].add(num)
                cols[c].add(num)
                boxes[(r // 3) * 3 + c // 3].add(num)

    def backtrack(i):
        if i == len(empty):
            return True
        r, c = empty[i]
        box = (r // 3) * 3 + c // 3
        for num in '123456789':
            if num not in rows[r] and num not in cols[c] and num not in boxes[box]:
                board[r][c] = num
                rows[r].add(num); cols[c].add(num); boxes[box].add(num)
                if backtrack(i + 1):
                    return True
                board[r][c] = '.'
                rows[r].discard(num); cols[c].discard(num); boxes[box].discard(num)
        return False

    backtrack(0)`,

  // ── 90: N-Queens ─────────────────────────────────────────────────────────
  90:
`def solve_n_queens(n: int) -> list[list[str]]:
    result = []
    cols, pos_diag, neg_diag = set(), set(), set()
    board = [['.' ] * n for _ in range(n)]

    def backtrack(r):
        if r == n:
            result.append(["".join(row) for row in board])
            return
        for c in range(n):
            if c in cols or (r + c) in pos_diag or (r - c) in neg_diag:
                continue
            cols.add(c); pos_diag.add(r + c); neg_diag.add(r - c)
            board[r][c] = 'Q'
            backtrack(r + 1)
            cols.discard(c); pos_diag.discard(r + c); neg_diag.discard(r - c)
            board[r][c] = '.'

    backtrack(0)
    return result`,

  // ── 91: House Robber III ─────────────────────────────────────────────────
  91:
`def rob(root) -> int:
    def dfs(node):
        if not node:
            return 0, 0  # (rob_this, skip_this)
        l_rob, l_skip = dfs(node.left)
        r_rob, r_skip = dfs(node.right)
        rob_this  = node.val + l_skip + r_skip
        skip_this = max(l_rob, l_skip) + max(r_rob, r_skip)
        return rob_this, skip_this

    return max(dfs(root))`,

  // ── 92: Reverse Pairs ────────────────────────────────────────────────────
  92:
`def reverse_pairs(nums: list[int]) -> int:
    def merge_count(lo, hi):
        if hi - lo <= 1:
            return 0
        mid = (lo + hi) // 2
        count = merge_count(lo, mid) + merge_count(mid, hi)
        j = mid
        for i in range(lo, mid):
            while j < hi and nums[i] > 2 * nums[j]:
                j += 1
            count += j - mid
        nums[lo:hi] = sorted(nums[lo:hi])
        return count

    return merge_count(0, len(nums))`,

  // ── 93: Find First and Last Position in Sorted Array ────────────────────
  93:
`def search_range(nums: list[int], target: int) -> list[int]:
    def binary_search(find_first: bool) -> int:
        lo, hi, result = 0, len(nums) - 1, -1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                result = mid
                if find_first:
                    hi = mid - 1
                else:
                    lo = mid + 1
            elif nums[mid] < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return result

    return [binary_search(True), binary_search(False)]`,

  // ── 94: Generate Parentheses ─────────────────────────────────────────────
  94:
`def generate_parenthesis(n: int) -> list[str]:
    result = []

    def backtrack(s, open_count, close_count):
        if len(s) == 2 * n:
            result.append(s)
            return
        if open_count < n:
            backtrack(s + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(s + ')', open_count, close_count + 1)

    backtrack('', 0, 0)
    return result`,

  // ── 95: Letter Combinations of a Phone Number ────────────────────────────
  95:
`def letter_combinations(digits: str) -> list[str]:
    if not digits:
        return []
    phone = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    result = []

    def backtrack(i, path):
        if i == len(digits):
            result.append(path)
            return
        for c in phone[digits[i]]:
            backtrack(i + 1, path + c)

    backtrack(0, '')
    return result`,

  // ── 96: Spiral Matrix II ─────────────────────────────────────────────────
  96:
`def generate_matrix(n: int) -> list[list[int]]:
    matrix = [[0] * n for _ in range(n)]
    top, bottom, left, right, num = 0, n - 1, 0, n - 1, 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            matrix[top][c] = num; num += 1
        top += 1
        for r in range(top, bottom + 1):
            matrix[r][right] = num; num += 1
        right -= 1
        for c in range(right, left - 1, -1):
            matrix[bottom][c] = num; num += 1
        bottom -= 1
        for r in range(bottom, top - 1, -1):
            matrix[r][left] = num; num += 1
        left += 1
    return matrix`,

  // ── 97: Add Two Numbers ──────────────────────────────────────────────────
  97:
`def add_two_numbers(l1, l2):
    dummy = ListNode()
    curr, carry = dummy, 0
    while l1 or l2 or carry:
        val = carry
        if l1:
            val += l1.val; l1 = l1.next
        if l2:
            val += l2.val; l2 = l2.next
        carry, val = divmod(val, 10)
        curr.next = ListNode(val)
        curr = curr.next
    return dummy.next`,

  // ── 98: Path Sum III ─────────────────────────────────────────────────────
  98:
`from collections import defaultdict

def path_sum(root, target_sum: int) -> int:
    prefix = defaultdict(int)
    prefix[0] = 1

    def dfs(node, curr_sum):
        if not node:
            return 0
        curr_sum += node.val
        count = prefix[curr_sum - target_sum]
        prefix[curr_sum] += 1
        count += dfs(node.left, curr_sum) + dfs(node.right, curr_sum)
        prefix[curr_sum] -= 1
        return count

    return dfs(root, 0)`,

  // ── 99: Maximal Rectangle ────────────────────────────────────────────────
  99:
`def maximal_rectangle(matrix: list[list[str]]) -> int:
    if not matrix:
        return 0
    cols = len(matrix[0])
    heights = [0] * cols
    max_area = 0

    def largest_in_histogram(h):
        stack, area = [], 0
        for i, height in enumerate(h + [0]):
            start = i
            while stack and stack[-1][1] >= height:
                idx, ht = stack.pop()
                area = max(area, ht * (i - idx))
                start = idx
            stack.append((start, height))
        return area

    for row in matrix:
        for c in range(cols):
            heights[c] = heights[c] + 1 if row[c] == '1' else 0
        max_area = max(max_area, largest_in_histogram(heights))
    return max_area`,

  // ── 100: Decode String ───────────────────────────────────────────────────
  100:
`def decode_string(s: str) -> str:
    stack, curr, k = [], '', 0
    for c in s:
        if c.isdigit():
            k = k * 10 + int(c)
        elif c == '[':
            stack.append((curr, k))
            curr, k = '', 0
        elif c == ']':
            prev, times = stack.pop()
            curr = prev + curr * times
        else:
            curr += c
    return curr`,

  // ── 101: Course Schedule II ──────────────────────────────────────────────
  101:
`from collections import defaultdict, deque

def find_order(num_courses: int, prerequisites: list[list[int]]) -> list[int]:
    adj = defaultdict(list)
    in_degree = [0] * num_courses
    for course, pre in prerequisites:
        adj[pre].append(course)
        in_degree[course] += 1
    q = deque(c for c in range(num_courses) if in_degree[c] == 0)
    result = []
    while q:
        course = q.popleft()
        result.append(course)
        for nei in adj[course]:
            in_degree[nei] -= 1
            if in_degree[nei] == 0:
                q.append(nei)
    return result if len(result) == num_courses else []`,

  // ── 102: Reconstruct Itinerary ───────────────────────────────────────────
  102:
`from collections import defaultdict

def find_itinerary(tickets: list[list[str]]) -> list[str]:
    adj = defaultdict(list)
    for src, dst in sorted(tickets, reverse=True):
        adj[src].append(dst)
    result = []

    def dfs(airport):
        while adj[airport]:
            dfs(adj[airport].pop())
        result.append(airport)

    dfs('JFK')
    return result[::-1]`,

  // ── 103: Word Break II ───────────────────────────────────────────────────
  103:
`def word_break(s: str, word_dict: list[str]) -> list[str]:
    words, memo = set(word_dict), {}

    def backtrack(start):
        if start in memo:
            return memo[start]
        if start == len(s):
            return ['']
        result = []
        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            if word in words:
                for rest in backtrack(end):
                    result.append(word + (' ' + rest if rest else ''))
        memo[start] = result
        return result

    return backtrack(0)`,

  // ── 104: Minimum Path Sum ────────────────────────────────────────────────
  104:
`def min_path_sum(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    for r in range(m):
        for c in range(n):
            if r == 0 and c == 0:
                continue
            elif r == 0:
                grid[r][c] += grid[r][c - 1]
            elif c == 0:
                grid[r][c] += grid[r - 1][c]
            else:
                grid[r][c] += min(grid[r - 1][c], grid[r][c - 1])
    return grid[m - 1][n - 1]`,

  // ── 105: Unique Paths II ─────────────────────────────────────────────────
  105:
`def unique_paths_with_obstacles(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    dp = [0] * n
    dp[0] = 1
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 1:
                dp[c] = 0
            elif c > 0:
                dp[c] += dp[c - 1]
    return dp[n - 1]`,

  // ── 106: Combinations ────────────────────────────────────────────────────
  106:
`def combine(n: int, k: int) -> list[list[int]]:
    result = []

    def backtrack(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        for i in range(start, n + 1):
            path.append(i)
            backtrack(i + 1, path)
            path.pop()

    backtrack(1, [])
    return result`,

  // ── 107: Permutations II ─────────────────────────────────────────────────
  107:
`def permute_unique(nums: list[int]) -> list[list[int]]:
    result, used = [], [False] * len(nums)
    nums.sort()

    def backtrack(path):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue
            used[i] = True
            path.append(nums[i])
            backtrack(path)
            path.pop()
            used[i] = False

    backtrack([])
    return result`,

  // ── 108: Single Number II ────────────────────────────────────────────────
  108:
`def single_number(nums: list[int]) -> int:
    ones, twos = 0, 0
    for n in nums:
        ones = (ones ^ n) & ~twos
        twos = (twos ^ n) & ~ones
    return ones`,

  // ── 109: Remove K Digits ─────────────────────────────────────────────────
  109:
`def remove_k_digits(num: str, k: int) -> str:
    stack = []
    for digit in num:
        while k and stack and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)
    if k:
        stack = stack[:-k]
    return ''.join(stack).lstrip('0') or '0'`,

  // ── 110: Longest Increasing Path in a Matrix ─────────────────────────────
  110:
`def longest_increasing_path(matrix: list[list[int]]) -> int:
    rows, cols = len(matrix), len(matrix[0])
    memo = {}

    def dfs(r, c):
        if (r, c) in memo:
            return memo[(r, c)]
        best = 1
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                best = max(best, 1 + dfs(nr, nc))
        memo[(r, c)] = best
        return best

    return max(dfs(r, c) for r in range(rows) for c in range(cols))`,

  // ── 111: Find Peak Element ───────────────────────────────────────────────
  111:
`def find_peak_element(nums: list[int]) -> int:
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < nums[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo`,

  // ── 112: Search a 2D Matrix ──────────────────────────────────────────────
  112:
`def search_matrix(matrix: list[list[int]], target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        val = matrix[mid // n][mid % n]
        if val == target:
            return True
        elif val < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return False`,

  // ── 113: Subsets II ──────────────────────────────────────────────────────
  113:
`def subsets_with_dup(nums: list[int]) -> list[list[int]]:
    result = []
    nums.sort()

    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return result`,

  // ── 114: Palindrome Partitioning ─────────────────────────────────────────
  114:
`def partition(s: str) -> list[list[str]]:
    result = []

    def backtrack(start, path):
        if start == len(s):
            result.append(path[:])
            return
        for end in range(start + 1, len(s) + 1):
            sub = s[start:end]
            if sub == sub[::-1]:
                path.append(sub)
                backtrack(end, path)
                path.pop()

    backtrack(0, [])
    return result`,

  // ── 115: Trapping Rain Water II ──────────────────────────────────────────
  115:
`import heapq

def trap_rain_water(height_map: list[list[int]]) -> int:
    if not height_map or len(height_map) < 3 or len(height_map[0]) < 3:
        return 0
    rows, cols = len(height_map), len(height_map[0])
    visited = [[False] * cols for _ in range(rows)]
    heap = []
    for r in range(rows):
        for c in range(cols):
            if r == 0 or r == rows - 1 or c == 0 or c == cols - 1:
                heapq.heappush(heap, (height_map[r][c], r, c))
                visited[r][c] = True
    result = 0
    while heap:
        h, r, c = heapq.heappop(heap)
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc]:
                visited[nr][nc] = True
                result += max(0, h - height_map[nr][nc])
                heapq.heappush(heap, (max(h, height_map[nr][nc]), nr, nc))
    return result`,
};
