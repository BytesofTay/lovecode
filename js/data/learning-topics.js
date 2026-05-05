// ── Learn mode data ────────────────────────────────────────────────────────
const LEARNING_TOPICS = [
  {
    id: 'big-o',
    section: 'Foundations',
    title: 'Big-O Complexity',
    summary: 'How runtime grows with input size — the most important interview concept.',
    details: [
      { heading: 'What it is', body: `<p>Big-O notation describes how an algorithm's running time (or memory) grows as the input gets larger. It strips away constants and lower-order terms to focus on what really matters at scale: the <strong>growth shape</strong>.</p>
<p>If your algorithm runs in <code>3n + 50</code> steps on input of size n, we call it <code>O(n)</code> — the constants and small terms don't matter at scale. What matters is that doubling n doubles your time.</p>` },
      { heading: 'How it works', body: `<p>Read your code and ask: "if I double the input, what happens to the work?"</p>
<p>• A single loop over n items: <code>O(n)</code> — doubling n doubles the loops.<br>• Two nested loops over the same n: <code>O(n²)</code> — doubling n quadruples the work.<br>• A loop that halves the search range each step (binary search): <code>O(log n)</code>.<br>• Recursion that branches into two calls without caching: typically <code>O(2ⁿ)</code>.<br>• Generating all subsets of n elements: exactly <code>O(2ⁿ)</code>. All permutations: <code>O(n!)</code>.</p>
<p>Ranked from fastest to slowest: <code>O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ) &lt; O(n!)</code>.</p>` },
      { heading: 'When to reach for it', body: `<p>Always. Every solution you propose in an interview should come with its time and space complexity. If your first idea is <code>O(n²)</code>, the interviewer will usually ask <em>"can you do better?"</em></p>
<p>The two most common improvements: <strong>add a hash map</strong> (turns O(n²) into O(n) for "have I seen this?" patterns) or <strong>sort first</strong> (turns O(n²) into O(n log n) and unlocks binary search or two-pointer).</p>` }
    ],
    lazyDetails: [
      { heading: '🐢 How fast it gets slow',
        body: `<p>Imagine you have a list of names. Finding one name takes some time. Now imagine the list is twice as long. Does finding a name take twice as long? Four times as long? Or barely any longer at all?</p>
<p>Big-O is a label that answers that question. It tells you how an algorithm's speed changes when the list gets bigger. We don't care about exact seconds — we care about the SHAPE of the slowdown.</p>` },
      { heading: 'The shapes, fastest to slowest',
        body: `<p><strong>O(1)</strong> — looking up a phone number when you already know which page it's on. Doesn't matter how big the phone book is.</p>
<p><strong>O(n)</strong> — reading every name in the phone book. Twice as big = twice the time.</p>
<p><strong>O(log n)</strong> — guessing a number 1-100. You ask "higher or lower" and cut the range in half each time. A million choices? Only 20 guesses.</p>
<p><strong>O(n²)</strong> — every person in a room shaking hands with every other person. 10 people = 45 handshakes. 100 people = ~5,000.</p>
<p><strong>O(2ⁿ) and O(n!)</strong> — these blow up FAST. Avoid these unless the input is tiny.</p>` },
      { heading: 'Why you care',
        body: `<p>If your code is slow on a small list, it'll be impossibly slow on a big list. Big-O tells you ahead of time, before you run it on a million items and your program freezes.</p>
<p>The interview rule of thumb: if you wrote two nested loops, that's O(n²) and your interviewer will ask "can you do better?" Usually the answer is "use a hash map" — which makes things O(n).</p>` }
    ],
    examples: [
      { title: 'Two Sum — brute force vs hash map', problemId: 1,
        problem: 'Given an array of integers and a target, return the two indices that sum to target.',
        approach: `<p><strong>Brute force:</strong> for every i, scan every j. Two nested loops over n elements → <code>O(n²)</code> time, <code>O(1)</code> space.</p>
<p><strong>Optimal:</strong> walk once, store each value's index in a hash map. For each new element, check if its complement is already stored. The lookup is <code>O(1)</code>, so total is <code>O(n)</code> time, <code>O(n)</code> space.</p>`,
        code: `# O(n²) brute force
for i in range(n):
    for j in range(i + 1, n):
        if nums[i] + nums[j] == target:
            return [i, j]

# O(n) optimal — hash map
seen = {}
for i, x in enumerate(nums):
    if target - x in seen:
        return [seen[target - x], i]
    seen[x] = i`,
        time: 'O(n) optimal · O(n²) brute', space: 'O(n) optimal',
        why: 'The classic "trade space for time" — a hash map turns the inner search from O(n) to O(1) per element.' },
      { title: 'Binary Search — halving the range', problemId: 7,
        problem: 'Find the minimum element in a rotated sorted array (or simply: find a value in a sorted array).',
        approach: `<p>Each comparison eliminates half the remaining range. After 1 step, n/2 candidates left. After 2 steps, n/4. After k steps, n/2ᵏ. You finish when 2ᵏ ≥ n, so k ≈ log₂(n).</p>
<p>That's why you see <code>log n</code> in the analysis — the input is halved per step.</p>`,
        code: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2   # avoids overflow
        if arr[mid] == target: return mid
        if arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1`,
        time: 'O(log n)', space: 'O(1)',
        why: 'Anywhere you can split a problem in half each step, you get a logarithmic factor.' },
      { title: 'Bubble Sort — quadratic time', problemId: null,
        problem: 'Sort an array by repeatedly swapping adjacent out-of-order pairs.',
        approach: `<p>Outer loop runs n times. Inner loop runs up to n times. Worst case work is roughly <code>n × n / 2 = O(n²)</code>.</p>
<p>For n = 1,000 → 1,000,000 operations. For n = 10,000 → 100,000,000. Compare to merge sort's <code>O(n log n)</code>: 10,000 · 13 ≈ 130,000 — about 750× less work at the same input size.</p>`,
        code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
        time: 'O(n²)', space: 'O(1)',
        why: 'Two nested loops over n is the most common O(n²) shape — recognize it instantly.' },
      { title: 'Subsets — exponential blow-up', problemId: null,
        problem: 'Generate every subset of a set of n elements.',
        approach: `<p>Each element is either <em>in</em> or <em>out</em> of a subset, giving <code>2 × 2 × … × 2 = 2ⁿ</code> total subsets. You can't beat that count, so the lower bound is <code>O(2ⁿ)</code>.</p>
<p>For n = 20 that's about 1 million. For n = 30, a billion. Exponential algorithms hit a wall fast — that's why DP exists.</p>`,
        code: `def subsets(nums):
    result = [[]]
    for x in nums:
        result += [r + [x] for r in result]
    return result`,
        time: 'O(n · 2ⁿ)', space: 'O(n · 2ⁿ)',
        why: 'When the answer itself is exponentially sized, your time is at least exponential — no algorithm can be faster.' }
    ],
    gotchas: [
      'Big-O is about <strong>worst case</strong> by default. Quick Sort is <em>average</em> O(n log n) but <em>worst</em> O(n²) — be specific.',
      'Hidden costs: <code>"abc" + "def"</code> in a loop is O(n²) in many languages because each concat copies the string.',
      'Recursion uses stack space too. A "constant time" recursive function still costs O(depth) memory.',
      'The base of <code>log n</code> doesn\'t matter (just a constant factor) — log₂, log₁₀, ln are all the same complexity class.'
    ],
    estMin: 12,
    videoId: '__vX2sjlpXU',
    videoSearch: 'big o notation neetcode',
    diagram: 'svgBigOCurves',
    cardIcon: 'svgBigOMini',
    takeaways: [
      'O(1) is best, O(n!) is worst — focus on the *growth shape*, not exact runtime.',
      'Most interview problems target O(n) or O(n log n).',
      'Nested loops over n elements are O(n²) — usually a red flag worth fixing.',
      'Recursion that branches into 2 calls per step → typically O(2ⁿ).',
    ],
    practice: { type: 'bigo', label: 'Take the Big-O Quiz' },
  },
  {
    id: 'sorting',
    section: 'Foundations',
    title: 'Sorting Algorithms',
    summary: 'Why O(n log n) sorts crush O(n²) sorts at scale, and when each one wins.',
    details: [
      { heading: 'What it is', body: `<p>Sorting puts elements in order. Once sorted, an array unlocks binary search, two-pointer techniques, and greedy strategies. Knowing when to sort and which sort to use is one of the most reliably-rewarded interview skills.</p>
<p>You need to know <strong>five algorithms</strong>: Merge Sort, Quick Sort, Heap Sort (O(n log n)), Insertion Sort, Selection Sort (O(n²)).</p>` },
      { heading: 'How it works', body: `<p><strong>Merge Sort</strong> — divide and conquer. Split the array in half recursively, sort each half, merge the sorted halves. The merge step is the workhorse. Stable. <code>O(n log n)</code> guaranteed. Uses <code>O(n)</code> extra space.</p>
<p><strong>Quick Sort</strong> — pick a pivot, partition into "less than pivot" and "greater than pivot," recurse. Average <code>O(n log n)</code> in place. Worst <code>O(n²)</code> if pivots are bad. Not stable.</p>
<p><strong>Heap Sort</strong> — build a max-heap (<code>O(n)</code>), then extract n times at <code>O(log n)</code> each. The only <code>O(n log n)</code> sort with <code>O(1)</code> space. Not stable, less cache-friendly than Quick Sort.</p>
<p><strong>Insertion Sort</strong> — like sorting cards in your hand. <code>O(n²)</code> worst case but <code>O(n)</code> on nearly-sorted data, and stable. Real production sorts (Timsort) use it below ~16 elements.</p>
<p><strong>Selection Sort</strong> — find the min of the unsorted part, swap to the front, repeat. Exactly n−1 swaps regardless of input. Useful when writes are expensive.</p>` },
      { heading: 'When to reach for it', body: `<p>If your problem becomes obvious after sorting (e.g. "find duplicates," "merge intervals," "k closest elements"), <strong>just sort first</strong>. The <code>O(n log n)</code> cost is usually dwarfed by the savings.</p>
<p>You almost never implement these from scratch in an interview — call the language's built-in sort. But you must know each algorithm's complexity, stability, space, and when each one wins.</p>` }
    ],
    examples: [
      { title: 'Merge Sort — guaranteed O(n log n)', problemId: null,
        problem: 'Sort an unsorted array using divide and conquer.',
        approach: `<p>Recursively split until each piece is one element (already sorted). Then merge pairs back together. Each merge takes O(n), and there are <code>log₂ n</code> levels of merging.</p>
<p>For [5, 2, 8, 1]: split into [5, 2] and [8, 1] → split each → merge to [2, 5] and [1, 8] → merge to [1, 2, 5, 8].</p>`,
        code: `def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(L, R):
    out, i, j = [], 0, 0
    while i < len(L) and j < len(R):
        if L[i] <= R[j]: out.append(L[i]); i += 1
        else:            out.append(R[j]); j += 1
    return out + L[i:] + R[j:]`,
        time: 'O(n log n)', space: 'O(n)',
        why: 'Stable, predictable, and the natural choice for sorting linked lists.' },
      { title: 'Quick Sort — fast in practice', problemId: null,
        problem: 'Sort in place using partitioning around a pivot.',
        approach: `<p>Pick a pivot. Walk the array, swap so that everything before some boundary is ≤ pivot, everything after is > pivot. Place the pivot between them — it's now in its final position. Recurse on each side.</p>
<p>The classic worst case: array is already sorted and you pick the last element as pivot. Each partition removes one element → n recursion levels → O(n²). Mitigate with random or median-of-three pivot.</p>`,
        code: `def quick_sort(arr, lo, hi):
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort(arr, lo, p - 1)
        quick_sort(arr, p + 1, hi)

def partition(arr, lo, hi):
    pivot, i = arr[hi], lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    return i + 1`,
        time: 'Avg O(n log n) · Worst O(n²)', space: 'O(log n) call stack',
        why: 'Cache-friendly and in-place — usually the fastest in practice. Just don\'t use a fixed pivot on adversarial input.' },
      { title: 'Insertion Sort — best on small inputs', problemId: null,
        problem: 'Sort by building the sorted prefix one element at a time.',
        approach: `<p>For each element, slide it left until it sits in the right place. On a nearly-sorted array, each element only moves a little, so total work is <code>O(n)</code> — better than any O(n log n) sort because the constant factor is so small.</p>
<p>That's why Timsort (Python, JS) uses Insertion Sort for small chunks (under ~16 elements) before merging.</p>`,
        code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key, j = arr[i], i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
        time: 'O(n²) · O(n) best case', space: 'O(1)',
        why: 'Sometimes "slow" beats "fast" because of constant factors and cache locality.' }
    ],
    gotchas: [
      'Quick Sort is <strong>not stable</strong>. If you need to preserve the relative order of equal elements (e.g. by-then-by sorting), use Merge Sort.',
      'Heap Sort and Quick Sort are <strong>in place</strong> (O(1) and O(log n) space). Merge Sort needs O(n) extra. Pick based on space constraints.',
      'A "stable" sort preserves the order of <em>equal</em> elements. It does NOT mean "deterministic" — Quick Sort with a random pivot is deterministic-given-seed but unstable.',
      'Built-in <code>sorted()</code> in Python and <code>Array.sort()</code> in modern JS are Timsort — stable, O(n log n), and tuned for real-world data. Don\'t reinvent unless asked.'
    ],
    estMin: 18,
    videoId: 'kPRA0W1kECg',
    videoSearch: 'abdul bari sorting algorithms',
    diagram: 'svgSortingComparison',
    cardIcon: 'svgSortingMini',
    takeaways: [
      'Merge sort: stable, predictable O(n log n), but uses O(n) extra space.',
      'Quick sort: fastest in practice on average, but O(n²) worst case with bad pivots.',
      'Heap sort: only O(n log n) sort with O(1) space — useful when memory is tight.',
      'Insertion sort: O(n²) worst case, but O(n) on nearly-sorted data — surprisingly useful.',
      'For n=10,000, O(n log n) does ~750× less work than O(n²).',
    ],
    practice: { type: 'sorting', label: 'Explore Sorting Reference' },
  },
  {
    id: 'hashmap',
    section: 'Data Structures',
    title: 'Hash Maps',
    summary: 'Average-case O(1) lookup is what makes Two Sum a one-pass problem.',
    details: [
      { heading: 'What it is', body: `<p>A hash map stores key-value pairs with average-case <code>O(1)</code> get and set. It's the most useful data structure in interviews — it lets you trade memory for speed.</p>
<p>A <strong>hash set</strong> is the same thing without values — just "have I seen this?" lookups.</p>` },
      { heading: 'How it works', body: `<p>A <strong>hash function</strong> converts each key into a bucket index. To get a value, you hash the key, jump directly to that bucket, and read — no scanning.</p>
<p>Two keys can hash to the same bucket (a "collision"). Bucket strategies (chaining or open addressing) handle that. With a good hash function, collisions are rare and the average case stays O(1).</p>
<p>Worst case is O(n) when collisions degenerate into a long chain. For interviews, assume O(1) average and move on.</p>` },
      { heading: 'When to reach for it', body: `<p>The classic move: <strong>turn an O(n²) brute force into O(n)</strong>. Whenever you find yourself scanning the array to ask "have I seen this before?" or "is X here?", a hash map collapses that inner search to O(1).</p>
<p>Common uses: counting frequencies (<code>{char: count}</code>), seen-set checks, memoization tables for DP, deduplication, grouping anagrams by sorted-key.</p>` }
    ],
    lazyDetails: [
      { heading: '🏋️ Like locker numbers in a gym',
        body: `<p>You walk into a gym. You hand the worker your jacket. They give you a tag with a number on it — say, locker 47. They put your jacket in locker 47.</p>
<p>Later, you come back with the tag. You don't have to peek into every locker. You just walk straight to locker 47 and grab your jacket.</p>
<p>That's a hash map. The tag is the "key." The jacket is the "value." The locker number is computed from the tag (called a "hash"). No matter how many lockers there are — 100 or 100 million — finding your stuff takes the same tiny amount of time.</p>` },
      { heading: 'Why this is magical',
        body: `<p>The boring way to find something in a list of a million items: check each one until you find it. Maybe you get lucky and it's first. Maybe it's last. On average it takes 500,000 checks.</p>
<p>The hash map way: jump straight to the right "locker." 1 step. Always.</p>
<p>Trade-off: you need extra space for all the lockers. But if you have memory to spare, you've turned a slow problem into an instant one.</p>` },
      { heading: 'When you reach for it',
        body: `<p>Any time you find yourself thinking "have I seen this thing before?" or "what was the count of this item?" — that's a hash map.</p>
<p>Counting how many times each letter appears in a word? Hash map. Looking up a friend by username? Hash map. Checking if you've already visited a node in a graph? Hash map.</p>
<p>Two Sum is the textbook example: as you walk the array, you stash each number in a hash map. Then you can ask "have I already seen the number that pairs with this one?" in one step instead of scanning the whole array again.</p>` }
    ],
    examples: [
      { title: 'Two Sum — index lookup', problemId: 1,
        problem: 'Return indices of two numbers that sum to target.',
        approach: `<p>As you scan, store each value's index in the map. For each new element x, check if <code>target − x</code> is already there. If yes, you've found the pair. One pass, O(1) per lookup.</p>`,
        code: `def two_sum(nums, target):
    seen = {}                    # value → index
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i`,
        time: 'O(n)', space: 'O(n)',
        why: 'The textbook "trade space for time" trick.' },
      { title: 'Valid Anagram — character counts', problemId: 53,
        problem: 'Determine if two strings are anagrams of each other.',
        approach: `<p>Count characters in both strings. If the counts match, they're anagrams. A hash map of <code>{char: count}</code> is the natural representation. Or, since lowercase English is fixed at 26 chars, use an array of length 26.</p>`,
        code: `def is_anagram(s, t):
    if len(s) != len(t): return False
    count = {}
    for c in s: count[c] = count.get(c, 0) + 1
    for c in t:
        if c not in count or count[c] == 0:
            return False
        count[c] -= 1
    return True`,
        time: 'O(n)', space: 'O(1) for fixed alphabet',
        why: 'Anagram = same characters, same counts. Counting is the universal pattern.' },
      { title: 'Group Anagrams — hash by sorted key', problemId: 54,
        problem: 'Group strings that are anagrams of each other.',
        approach: `<p>Anagrams share a canonical form: their sorted character string. Group by that key. <code>"eat"</code>, <code>"tea"</code>, <code>"ate"</code> all sort to <code>"aet"</code>.</p>`,
        code: `def group_anagrams(strs):
    groups = {}
    for s in strs:
        key = ''.join(sorted(s))
        groups.setdefault(key, []).append(s)
    return list(groups.values())`,
        time: 'O(n · k log k)', space: 'O(n · k)',
        why: 'Hash maps don\'t just store values — keys can be any hashable computed identity. Sorted-string is one of the most common.' }
    ],
    gotchas: [
      'Hash map iteration order: insertion order in Python 3.7+ and modern JS, but not guaranteed in older Java <code>HashMap</code>. Use <code>LinkedHashMap</code> if order matters.',
      'Mutable keys are a footgun. If you put a list as a key (where allowed) and mutate it, you can\'t find it again.',
      'Worst case is O(n) when an adversary picks colliding inputs. Most interview problems don\'t care, but mention it if pressed.'
    ],
    estMin: 8,
    videoId: 'shs0KM3wKv8',
    videoSearch: 'hash map neetcode',
    diagram: 'svgHashMap',
    cardIcon: 'svgHashMapMini',
    code: { lang: 'Python', explain: 'Two Sum — record each index as you scan. When you spot a complement already in the map, you\'ve found the pair in one pass.',
snippet: `def two_sum(nums, target):
    seen = {}                    # value → index
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []` },
    takeaways: [
      'Hash function maps a key to a bucket — average O(1) get/set.',
      'Worst case is O(n) when collisions degenerate into a chain.',
      'Use cases: counting frequencies, lookups, deduplication, memoization.',
      'Two Sum: store {value: index} as you scan once → O(n) instead of O(n²).',
    ],
    practice: { type: 'problems', filter: { ds: 'Hash Map' }, label: 'Hash Map Problems' },
  },
  {
    id: 'two-pointers',
    section: 'Patterns',
    title: 'Two Pointers',
    summary: 'Walk an array from both ends — turns many O(n²) problems into O(n).',
    details: [
      { heading: 'What it is', body: `<p>Two indices into an array (or string) that move based on the problem's logic. Replaces a nested O(n²) loop with a single O(n) pass.</p>
<p>Two flavors:</p>
<p>• <strong>Converging</strong> — start at opposite ends, move toward each other.<br>• <strong>Same-direction</strong> — both move forward, often at different speeds.</p>` },
      { heading: 'How it works', body: `<p>The decision rule for converging pointers: <strong>move the pointer that lets you make progress</strong>. If <code>arr[L] + arr[R]</code> is too small, move L right (try bigger). Too big? Move R left. Each step eliminates a candidate pair → O(n) total.</p>
<p>For same-direction, one pointer often establishes a "lead" the other follows. Or one pointer reads while another writes (in-place dedup).</p>` },
      { heading: 'When to reach for it', body: `<p><strong>Sorted array</strong> + a "find pair / triple" question → converging two-pointer.</p>
<p><strong>Linked list</strong> + "find middle / nth from end / cycle" → same-direction two-pointer.</p>
<p>If your array isn't sorted and the problem allows it, sort first — the O(n log n) sort cost is dwarfed by the O(n²) → O(n) savings.</p>` }
    ],
    lazyDetails: [
      { heading: '👫 Two friends walking toward each other',
        body: `<p>Picture a long line of people. You need to find two people whose ages add up to 100. The boring way: pair every person with every other person. With 1,000 people, that's 500,000 checks.</p>
<p>The clever way: line everyone up by age, youngest to oldest. Two friends start at the ends — one at the youngest, one at the oldest. They yell their ages to each other.</p>
<p>If their ages add up to too much, the older friend takes a step left (try someone younger). If they add up to too little, the younger friend takes a step right. They keep walking. Either they meet in the middle (no answer exists), or their numbers add to 100 (found it!).</p>` },
      { heading: 'Why it works',
        body: `<p>Each step, you rule out a possibility forever. The older friend stepping left says "no need to check ANY pair where I'm involved with someone older — they'd all be too big too." That's the magic.</p>
<p>You started with 1,000 people, and you only ever take 1,000 total steps. Way better than 500,000.</p>` },
      { heading: 'When this trick works',
        body: `<p>You need the list to be SORTED. That's the whole reason "step left = smaller, step right = bigger" is meaningful.</p>
<p>Common uses: finding pairs/triples that sum to a target, checking palindromes (start and end characters should match), squeezing the most water in a container.</p>
<p>If the list isn't sorted, sort it first. The cost of sorting is way less than the cost of brute force.</p>` }
    ],
    examples: [
      { title: 'Valid Palindrome — converging compare', problemId: 56,
        problem: 'Determine if a string is a palindrome (ignore non-alphanumerics, case).',
        approach: `<p>L and R from both ends. Skip non-alphanumerics. Compare lowercase. Stop when they cross.</p>`,
        code: `def is_palindrome(s):
    L, R = 0, len(s) - 1
    while L < R:
        while L < R and not s[L].isalnum(): L += 1
        while L < R and not s[R].isalnum(): R -= 1
        if s[L].lower() != s[R].lower():
            return False
        L += 1; R -= 1
    return True`,
        time: 'O(n)', space: 'O(1)',
        why: 'Constant space — no need to build a cleaned copy of the string.' },
      { title: '3Sum — sort + two-pointer for each anchor', problemId: 9,
        problem: 'Find all unique triplets that sum to zero.',
        approach: `<p>Sort the array. For each i, use two pointers L = i+1 and R = end to find pairs that sum to <code>−nums[i]</code>. If sum too small → L right. Too big → R left. Skip duplicates carefully.</p>`,
        code: `def three_sum(nums):
    nums.sort()
    out = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]: continue
        L, R = i + 1, len(nums) - 1
        while L < R:
            total = nums[i] + nums[L] + nums[R]
            if total < 0: L += 1
            elif total > 0: R -= 1
            else:
                out.append([nums[i], nums[L], nums[R]])
                while L < R and nums[L] == nums[L+1]: L += 1
                while L < R and nums[R] == nums[R-1]: R -= 1
                L += 1; R -= 1
    return out`,
        time: 'O(n²)', space: 'O(1) excluding output',
        why: 'Sort + two-pointer collapses the O(n³) brute force into O(n²). Skipping duplicates after a hit keeps results unique.' },
      { title: 'Container With Most Water — move the shorter wall', problemId: 10,
        problem: 'Find two heights forming a container that holds the most water.',
        approach: `<p>L and R at the ends. Area = min(h[L], h[R]) × (R − L). Move the shorter wall inward — moving the taller wall can only shrink area.</p>`,
        code: `def max_area(height):
    L, R = 0, len(height) - 1
    best = 0
    while L < R:
        best = max(best, min(height[L], height[R]) * (R - L))
        if height[L] < height[R]:
            L += 1
        else:
            R -= 1
    return best`,
        time: 'O(n)', space: 'O(1)',
        why: 'The "move the shorter wall" rule guarantees you don\'t miss the optimal pair. Try to disprove it — you can\'t.' }
    ],
    gotchas: [
      'Forgetting to sort first when the algorithm requires it. Two-pointer on unsorted data usually fails.',
      'For 3Sum and similar, skipping duplicates after finding a match prevents duplicate triplets in the output.',
      'When L and R cross, stop. Don\'t use <code>&lt;=</code> when the same index can\'t be both L and R.'
    ],
    estMin: 10,
    videoId: 'On03HWe2tZM',
    videoSearch: 'two pointers neetcode',
    diagram: 'svgTwoPointers',
    cardIcon: 'svgTwoPointersMini',
    code: { lang: 'Python', explain: 'Valid Palindrome — converge L and R toward the middle; the moment they disagree on a character, it\'s not a palindrome.',
snippet: `def is_palindrome(s):
    s = [c.lower() for c in s if c.isalnum()]
    L, R = 0, len(s) - 1
    while L < R:
        if s[L] != s[R]:
            return False
        L += 1
        R -= 1
    return True` },
    takeaways: [
      'Two indices that move toward each other (or in the same direction at different speeds).',
      'Common on sorted arrays: 3Sum, Container With Most Water, Valid Palindrome.',
      'Replaces a nested loop with a single linear pass.',
      'Decision rule: move the pointer that lets you make progress toward the goal.',
    ],
    practice: { type: 'problems', filter: { ds: 'Two Pointers' }, label: 'Two-Pointer Problems' },
  },
  {
    id: 'sliding-window',
    section: 'Patterns',
    title: 'Sliding Window',
    summary: 'Maintain a moving range over an array to find subarrays/substrings.',
    details: [
      { heading: 'What it is', body: `<p>Sliding window maintains a contiguous subrange of an array — defined by two pointers L and R — and slides it through the array to find subarrays/substrings matching a constraint.</p>` },
      { heading: 'How it works', body: `<p>The general pattern: <strong>expand by moving R right; if the window violates a constraint, shrink by moving L right</strong>. Track the answer whenever the window is valid. Each element added and removed at most once → O(n).</p>
<p>Three flavors:</p>
<p>• <strong>Fixed size</strong> — window length k, slide along<br>• <strong>Variable size, max/min</strong> — expand greedily, shrink only when forced<br>• <strong>Variable size, target</strong> — expand to satisfy, shrink to minimize</p>` },
      { heading: 'When to reach for it', body: `<p>Whenever you see "longest/shortest/max/min subarray (or substring) such that X" — sliding window is the answer.</p>
<p>Track window state efficiently: hash map for substring problems, running sum for sum-based, counter for distinct chars. Recomputing the whole window each step makes it O(n²).</p>` }
    ],
    lazyDetails: [
      { heading: '🔦 Like a flashlight beam moving along a row',
        body: `<p>Imagine a long row of objects on a shelf. You have a flashlight that can light up some of them — say, 5 in a row. You can stretch the beam wider or pull it narrower. You can slide the beam left or right.</p>
<p>Your job: find the brightest stretch of objects (or the longest stretch with no two of the same color, or the shortest stretch worth $50, etc.). You don't lift the flashlight off the shelf — you just stretch and slide it.</p>` },
      { heading: 'How it works',
        body: `<p>You have two ends of the beam — call them L (left) and R (right). You always move them forward (rightward).</p>
<p><strong>Grow</strong>: extend the right edge to add a new object to the beam. <strong>Shrink</strong>: pull the left edge in if the beam now breaks a rule (too many duplicates, sum too big, etc.).</p>
<p>Every object enters the beam once and leaves once. Total work: small. The slow way would be to try every possible beam position from scratch — way more work.</p>` },
      { heading: 'When you reach for it',
        body: `<p>Anytime the problem says "find the longest/shortest/best stretch in a row of things." Common ones:</p>
<p>• Longest substring with no repeats<br>• Smallest subarray that sums to at least K<br>• Maximum sum of any 5-in-a-row</p>
<p>The clue is that you're looking at a CONTIGUOUS chunk (no skipping items in the middle). If the chunk doesn't have to be contiguous, sliding window doesn't apply — you might need DP instead.</p>` }
    ],
    examples: [
      { title: 'Longest Substring Without Repeating — variable-size max', problemId: 50,
        problem: 'Length of the longest substring without repeating characters.',
        approach: `<p>Hash map of last-seen-index per character. Expand R; if you hit a duplicate within the window, jump L past the previous occurrence.</p>`,
        code: `def length_of_longest_substring(s):
    seen, L, best = {}, 0, 0
    for R, c in enumerate(s):
        if c in seen and seen[c] >= L:
            L = seen[c] + 1
        seen[c] = R
        best = max(best, R - L + 1)
    return best`,
        time: 'O(n)', space: 'O(min(n, Σ))',
        why: 'Each char visited at most twice (added, possibly skipped over). The trick is jumping L all the way past the duplicate.' },
      { title: 'Minimum Window Substring — variable-size min', problemId: 52,
        problem: 'Smallest substring of s that contains all characters of t.',
        approach: `<p>Counter of needed chars. Expand R until the window covers all chars (track <code>missing</code> count). Then shrink L while the window stays valid; record the smallest valid window.</p>`,
        code: `from collections import Counter
def min_window(s, t):
    if not t or not s: return ''
    need = Counter(t)
    missing = len(t)
    L, best_L, best_len = 0, 0, float('inf')
    for R, c in enumerate(s):
        if need[c] > 0: missing -= 1
        need[c] -= 1
        while missing == 0:
            if R - L + 1 < best_len:
                best_L, best_len = L, R - L + 1
            need[s[L]] += 1
            if need[s[L]] > 0: missing += 1
            L += 1
    return '' if best_len == float('inf') else s[best_L:best_L + best_len]`,
        time: 'O(n)', space: 'O(Σ)',
        why: 'Two phases per window: expand to validity, then shrink to minimality. Each char visited twice → linear.' },
      { title: 'Longest Repeating Character Replacement — track max-count', problemId: 51,
        problem: 'Longest substring that can be made all-same by replacing at most k characters.',
        approach: `<p>Window is valid if (size − maxCharCount) ≤ k. Expand R; if invalid, shrink L. Track maxCount lazily — it can only grow.</p>`,
        code: `def character_replacement(s, k):
    count = {}
    L, max_count, best = 0, 0, 0
    for R in range(len(s)):
        count[s[R]] = count.get(s[R], 0) + 1
        max_count = max(max_count, count[s[R]])
        if R - L + 1 - max_count > k:
            count[s[L]] -= 1
            L += 1
        best = max(best, R - L + 1)
    return best`,
        time: 'O(n)', space: 'O(1) for fixed alphabet',
        why: 'You don\'t need the EXACT max-count after shrinking — only its monotonic ceiling. That keeps it linear.' }
    ],
    gotchas: [
      'Forgetting to update the answer at the right moment — usually right before shrinking, or after expanding when valid.',
      'Recomputing the full window state each step makes it O(n²). Maintain state incrementally as L and R move.',
      'For "exactly k distinct" problems, use "at most k" minus "at most k−1" — direct sliding window for "exactly" is harder.'
    ],
    estMin: 10,
    videoId: 'MK-NZ4hN7rs',
    videoSearch: 'sliding window neetcode',
    diagram: 'svgSlidingWindow',
    cardIcon: 'svgSlidingWindowMini',
    code: { lang: 'Python', explain: 'Longest substring without repeating chars — expand R, shrink L only when a duplicate appears. Each char is visited at most twice → O(n).',
snippet: `def length_of_longest_substring(s):
    seen = {}
    L = best = 0
    for R, c in enumerate(s):
        if c in seen and seen[c] >= L:
            L = seen[c] + 1
        seen[c] = R
        best = max(best, R - L + 1)
    return best` },
    takeaways: [
      'Expand the window with the right pointer; shrink with the left when a constraint breaks.',
      'Each element is visited at most twice → linear O(n) total.',
      'Classic uses: Longest Substring Without Repeating, Min Window Substring, Max Sum Subarray of size K.',
      'Track window state with a counter, hash map, or running sum.',
    ],
    practice: { type: 'problems', filter: { ds: 'Sliding Window' }, label: 'Sliding-Window Problems' },
  },
  // Foundations
  { id: 'recursion', section: 'Foundations', title: 'Recursion', estMin: 12,
    summary: 'A function calling itself — the foundation of trees, DP, and backtracking.',
    details: [
      { heading: 'What it is', body: `<p>Recursion is when a function calls itself to solve a smaller version of the same problem. Every recursion needs two things:</p>
<p>• A <strong>base case</strong> that stops the recursion (the smallest problem, solved directly).<br>• A <strong>recursive step</strong> that reduces the problem toward the base case.</p>
<p>It's mathematical induction in code: solve the trivial case, then build bigger cases from smaller ones.</p>` },
      { heading: 'How it works', body: `<p>Each call adds a frame to the call stack. The call stack grows downward as you recurse, then unwinds back up as base cases return.</p>
<p>For <code>factorial(4)</code>: 4 calls 3, 3 calls 2, 2 calls 1 (base case → returns 1). Then the stack unwinds: 2 returns 2, 3 returns 6, 4 returns 24.</p>
<p>Recursion uses <strong>O(depth)</strong> stack space. Most languages crash around 10,000–100,000 levels deep — for very deep recursion you might need to convert to iteration with an explicit stack.</p>` },
      { heading: 'When to reach for it', body: `<p>Recursion shines for naturally recursive structures — trees, nested data, divide-and-conquer. Tree traversal, merge sort, backtracking — all simpler as recursion than as loops.</p>
<p>If you find yourself with <strong>overlapping recursive calls</strong> (the same subproblem solved many times), add memoization → it becomes <strong>Dynamic Programming</strong>.</p>` }
    ],
    lazyDetails: [
      { heading: '🪆 Like Russian nesting dolls',
        body: `<p>Imagine you open a big doll. Inside is a smaller doll that looks just like it, only tinier. You open that one — even smaller doll. You keep going until you find the tiniest doll that has nothing inside.</p>
<p>That's recursion. A function "opens itself up" and finds a smaller version of the same problem inside. You keep solving smaller versions until you hit the tiniest one. Then everything stacks back up and gives you the answer.</p>` },
      { heading: 'The two pieces every recursion needs',
        body: `<p><strong>1. A stop sign</strong> (the "base case"). A rule that says "OK, this version is small enough — just answer directly." Without this, you'd open dolls forever.</p>
<p><strong>2. A smaller-self call.</strong> Instead of solving the whole thing, you solve a smaller piece and ask yourself to handle the rest.</p>
<p>Example: how do you compute 5 × 4 × 3 × 2 × 1? You say "5 times the answer to 4 × 3 × 2 × 1." Then you ask yourself the smaller question. Eventually you hit "1" — that's the stop sign.</p>` },
      { heading: 'When to reach for it',
        body: `<p>Whenever a problem can be described as "do this thing, then do the same thing on a smaller piece." Trees, mazes, file folders inside file folders, undo histories.</p>
<p>If you can phrase the problem as "...and then I do the same thing again on what's left," recursion fits. If the SAME smaller question keeps coming up multiple times, that's a clue you should also remember the answer (that's called memoization, and it turns recursion into DP).</p>` }
    ],
    examples: [
      { title: 'Factorial — the canonical example', problemId: null,
        problem: 'Compute n! = n × (n−1) × … × 1.',
        approach: `<p>Define the problem in terms of itself: <code>fact(n) = n × fact(n−1)</code>. Base case: <code>fact(0) = 1</code>.</p>`,
        code: `def factorial(n):
    if n <= 1:           # base case
        return 1
    return n * factorial(n - 1)   # recursive step

# fact(4) → 4 · fact(3) → 4 · 3 · fact(2) → 4·3·2·1 = 24`,
        time: 'O(n)', space: 'O(n) stack',
        why: 'Once you recognize the "smaller subproblem" structure, the code writes itself.' },
      { title: 'Reverse a string — recursion on input', problemId: null,
        problem: 'Reverse a string without using any built-in reverse.',
        approach: `<p>Reverse of <code>"abcd"</code> = reverse of <code>"bcd"</code> + <code>"a"</code>. The base case is the empty string (or length 1).</p>`,
        code: `def reverse(s):
    if len(s) <= 1:
        return s
    return reverse(s[1:]) + s[0]

# "abcd" → reverse("bcd") + "a" → "dcba"`,
        time: 'O(n²) due to slicing', space: 'O(n)',
        why: 'Same induction idea applied to a different shape — split off one element, recurse on the rest.' },
      { title: 'Tree max depth — recursion on structure', problemId: 60,
        problem: 'Given a binary tree, return its maximum depth.',
        approach: `<p>The depth of any tree = 1 + max(depth of left subtree, depth of right subtree). Base case: a null tree has depth 0.</p>
<p>This is the most common recursion pattern in interviews — handle null, recurse on children, combine.</p>`,
        code: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
        time: 'O(n)', space: 'O(h) where h is tree height',
        why: 'Trees ARE recursion. Almost every tree problem follows this template.' }
    ],
    gotchas: [
      'Forgetting the base case → <strong>infinite recursion</strong> → stack overflow. Always write the base case <em>first</em>.',
      'Recursing without making the problem smaller (e.g. <code>f(n)</code> calls <code>f(n)</code>) loops forever even with a base case.',
      'Mutating shared state during recursion — make sure you understand whether your language passes by value or reference.',
      'Python\'s default recursion limit is 1000. Use <code>sys.setrecursionlimit()</code> for deep trees, or convert to iteration.'
    ],
    videoSearch: 'recursion explained neetcode',
    diagram: 'svgRecursion', cardIcon: 'svgRecursionMini',
    code: { lang: 'Python', explain: 'Factorial. The base case (n ≤ 1) stops the recursion. Each call multiplies n by the result of the smaller subproblem and unwinds back up the stack.',
snippet: `def factorial(n):
    if n <= 1:           # base case — STOP recursing
        return 1
    return n * factorial(n - 1)   # smaller subproblem

# fact(4) → 4 · fact(3) → 4 · 3 · fact(2) → 4 · 3 · 2 · 1 = 24` },
    takeaways: [
      'Always include a base case — otherwise you stack overflow.',
      'Each call adds a frame to the call stack — depth costs O(n) memory.',
      'Build the answer from smaller subproblems; recursion is just induction in code.',
      'If your recursion has overlapping subproblems, add memoization — it becomes DP.',
    ],
    practice: { type: 'problems', filter: { category: 'Tree' }, label: 'Practice on Tree Problems' },
  },
  { id: 'bit-manip', section: 'Foundations', title: 'Bit Manipulation', estMin: 10, optional: true,
    summary: 'Operate on individual bits — fast tricks for sets, parity, and powers of 2.',
    details: [
      { heading: 'What it is', body: `<p>Bit manipulation operates on the binary representation of numbers — the actual 0s and 1s in memory. The three core operators:</p>
<p>• <code>AND (&)</code> — bit set only if both inputs are 1. Used to <em>check</em> or <em>clear</em> bits.<br>• <code>OR (|)</code> — bit set if either input is 1. Used to <em>set</em> bits.<br>• <code>XOR (^)</code> — bit set if exactly one input is 1. Used to <em>flip</em> bits.</p>` },
      { heading: 'How it works', body: `<p>The killer property of <strong>XOR</strong>: <code>a ^ a = 0</code> and <code>a ^ 0 = a</code>. Pairs cancel; uniques survive. XORing every element of an array where each appears twice except one leaves that unique element.</p>
<p><code>n & (n − 1)</code> clears the lowest set bit. Useful for counting set bits — repeatedly apply until n = 0.</p>
<p>Bit shifts: <code>n &lt;&lt; k</code> = n × 2ᵏ, <code>n &gt;&gt; k</code> = n / 2ᵏ. Faster than arithmetic on most CPUs. Check if n is a power of 2: <code>n &gt; 0 && (n & (n − 1)) == 0</code>.</p>` },
      { heading: 'When to reach for it', body: `<p>This topic is <strong>optional</strong> — only 5 of the 75 problems are pure bit manipulation. Skip unless your target company is known for systems problems, or come back after the core topics.</p>
<p>If a problem mentions "without using extra space" or "find the unique element," XOR is often the trick.</p>` }
    ],
    examples: [
      { title: 'Single Number — XOR cancels pairs', problemId: 14,
        problem: 'Every element appears twice except one. Find the unique element. (Variant: Missing Number.)',
        approach: `<p>XOR all elements together. Pairs cancel (<code>x ^ x = 0</code>); the lone element survives. <code>O(n)</code> time, <code>O(1)</code> space.</p>`,
        code: `def find_unique(nums):
    result = 0
    for n in nums:
        result ^= n
    return result

# [4, 1, 2, 1, 2] → 4^1^2^1^2 = 4`,
        time: 'O(n)', space: 'O(1)',
        why: 'No hash map needed. XOR\'s self-cancellation gives constant space.' },
      { title: 'Number of 1 Bits — clear-lowest-set-bit trick', problemId: 12,
        problem: 'Count the number of 1 bits in an unsigned integer.',
        approach: `<p>Naive: shift right and check the LSB n times → 32 iterations. Smarter: <code>n & (n − 1)</code> clears the lowest set bit. Iterate until n = 0; count iterations.</p>
<p>For a number with k set bits, this loops only k times — much faster on sparse inputs.</p>`,
        code: `def count_ones(n):
    count = 0
    while n:
        n &= n - 1   # clears lowest set bit
        count += 1
    return count

# 0b1011 → 0b1010 → 0b1000 → 0 (3 iters, 3 ones)`,
        time: 'O(k) where k = set bits', space: 'O(1)',
        why: 'A trick worth memorizing — comes up often in bit-counting and DP-on-bits problems.' }
    ],
    gotchas: [
      'In Python, integers are arbitrary precision — no overflow, but also no fixed bit width. For 32-bit problems, mask with <code>0xFFFFFFFF</code>.',
      'Operator precedence: <code>a & b == c</code> is parsed as <code>a & (b == c)</code> in C/Java. Use parens.',
      'Right-shift on negative numbers: arithmetic shift in most languages (preserves sign). Use unsigned shift <code>&gt;&gt;&gt;</code> in JS/Java if you need logical shift.'
    ],
    videoSearch: 'bit manipulation tricks freecodecamp',
    diagram: 'svgBitManip', cardIcon: 'svgBitManipMini',
    takeaways: [
      'AND (&) clears bits, OR (|) sets bits, XOR (^) toggles bits.',
      'n & (n-1) clears the lowest set bit — useful for counting set bits.',
      'XOR is its own inverse: a ^ b ^ b = a. Used for "find the unique element".',
      'Shift left = multiply by 2; shift right = divide by 2.',
    ],
    practice: { type: 'problems', filter: { category: 'Binary' }, label: 'Binary Problems' },
  },
  // Data Structures
  { id: 'arrays', section: 'Data Structures', title: 'Arrays', estMin: 8,
    summary: 'Contiguous memory · O(1) access by index · the most common interview structure.',
    details: [
      { heading: 'What it is', body: `<p>Arrays store elements in contiguous memory, indexed from 0 to n−1. Their defining feature: <code>O(1)</code> access by index. The address of <code>arr[i]</code> is computed directly as <code>base + i × elementSize</code> — no scanning.</p>` },
      { heading: 'How it works', body: `<p>The cost is at the boundaries. Inserting at the front is <code>O(n)</code> because every element after must shift right. Resizing a dynamic array is <code>O(n)</code> for the copy, but <em>amortized</em> over many inserts the cost per push is still <code>O(1)</code>.</p>
<p>In-place modifications keep space at <code>O(1)</code>. Building a new output array costs <code>O(n)</code> extra.</p>` },
      { heading: 'When to reach for it', body: `<p>Most interview "array problems" are pattern problems: brute force is usually <code>O(n²)</code>, and the trick is finding a pattern that drops it to <code>O(n)</code> or <code>O(n log n)</code>:</p>
<p>• <strong>Hash map</strong> for "is this seen?" questions<br>• <strong>Two pointers</strong> for sorted arrays<br>• <strong>Sliding window</strong> for contiguous-subarray questions<br>• <strong>Sort first</strong> for any-order questions</p>` }
    ],
    examples: [
      { title: 'Best Time to Buy and Sell Stock — running min', problemId: 2,
        problem: 'Find the maximum profit from buying then selling once.',
        approach: `<p>Track the minimum price seen so far. At each day, the best profit ending today is <code>price − minSoFar</code>. Keep the max across all days.</p>
<p>Single pass — no need to consider every (buy, sell) pair.</p>`,
        code: `def max_profit(prices):
    min_price = float('inf')
    best = 0
    for p in prices:
        min_price = min(min_price, p)
        best = max(best, p - min_price)
    return best`,
        time: 'O(n)', space: 'O(1)',
        why: 'You only need the smallest valid buy day to compute every sell day.' },
      { title: 'Maximum Subarray — Kadane\'s', problemId: 5,
        problem: 'Find the contiguous subarray with the largest sum.',
        approach: `<p>Walk the array tracking a "running sum." If it goes negative, reset to the current element (the prefix can\'t help future subarrays). Track the max along the way.</p>`,
        code: `def max_subarray(nums):
    cur = best = nums[0]
    for n in nums[1:]:
        cur = max(n, cur + n)
        best = max(best, cur)
    return best`,
        time: 'O(n)', space: 'O(1)',
        why: 'A negative-prefix can never help — drop it and start fresh. That observation makes it linear instead of cubic.' },
      { title: 'Product of Array Except Self — prefix/suffix', problemId: 4,
        problem: 'Return an array where output[i] = product of all elements except nums[i]. No division allowed.',
        approach: `<p>Two passes. First pass: prefix products from the left (everything before i). Second pass: multiply each by suffix products from the right (everything after i).</p>`,
        code: `def product_except_self(nums):
    n = len(nums)
    out = [1] * n
    left = 1
    for i in range(n):
        out[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        out[i] *= right
        right *= nums[i]
    return out`,
        time: 'O(n)', space: 'O(1) excluding output',
        why: 'When division is off-limits, prefix/suffix products replace it. Two passes are still linear.' }
    ],
    gotchas: [
      'Off-by-one at boundaries (i = 0 and i = n − 1). If your loop starts at 1, did you handle the first element separately?',
      '<code>(lo + hi) / 2</code> can overflow in Java/C++. Use <code>lo + (hi − lo) / 2</code>.',
      'Modifying an array while iterating over it usually skips elements or repeats them. Iterate a copy or use indices.',
      'Slicing in Python/JS creates a copy — repeated slicing in a loop turns linear algorithms into quadratic.'
    ],
    videoSearch: 'arrays data structure neetcode',
    diagram: 'svgArrays', cardIcon: 'svgArraysMini',
    takeaways: [
      'Indexing is O(1). Insertion at the front is O(n) — everything must shift.',
      'Sorted arrays unlock binary search and two-pointer techniques.',
      'In-place modifications keep space O(1); building a new array is O(n) extra.',
      'Watch for off-by-one errors at boundaries (i = 0 and i = n − 1).',
    ],
    practice: { type: 'problems', filter: { category: 'Array' }, label: 'Array Problems' },
  },
  { id: 'strings', section: 'Data Structures', title: 'Strings', estMin: 8,
    summary: 'Treat them like arrays of characters — but watch for immutability and Unicode.',
    details: [
      { heading: 'What it is', body: `<p>A string is conceptually an array of characters. Most array techniques transfer directly: indexing, two pointers, sliding window, hash maps for character counts.</p>` },
      { heading: 'How it works', body: `<p><strong>Immutability.</strong> In Python, Java, JavaScript, strings can't be changed in place. Concatenating in a loop (<code>s += c</code>) is <code>O(n²)</code> because each concat creates a new string. Build with a list/array buffer and join at the end for <code>O(n)</code>.</p>
<p><strong>Character sets.</strong> Lowercase English (26 chars) → use a fixed-size array of length 26. Full ASCII (128) or Unicode → use a hash map. Most interview problems specify "lowercase English."</p>` },
      { heading: 'When to reach for it', body: `<p>String problems usually require one of: counting (anagrams), two-pointer comparison (palindromes), sliding window (longest substring), or sorting/hashing (group anagrams). When you see a string problem, ask: do I need to count chars, compare from both ends, or find a substring?</p>` }
    ],
    examples: [
      { title: 'Valid Palindrome — two-pointer compare', problemId: 56,
        problem: 'Determine if a string is a palindrome (ignoring case and non-alphanumerics).',
        approach: `<p>Two pointers from each end. Skip non-alphanumerics. Compare lowercase characters. Stop when the pointers cross.</p>`,
        code: `def is_palindrome(s):
    L, R = 0, len(s) - 1
    while L < R:
        while L < R and not s[L].isalnum(): L += 1
        while L < R and not s[R].isalnum(): R -= 1
        if s[L].lower() != s[R].lower():
            return False
        L += 1; R -= 1
    return True`,
        time: 'O(n)', space: 'O(1)',
        why: 'Two pointers replace a "build a cleaned string then compare" approach with no extra memory.' },
      { title: 'Longest Substring Without Repeating — sliding window', problemId: 50,
        problem: 'Find the length of the longest substring without repeating characters.',
        approach: `<p>Sliding window with a hash map of last-seen-index. Expand R; if you hit a duplicate, jump L past the previous occurrence.</p>`,
        code: `def length_of_longest_substring(s):
    seen, L, best = {}, 0, 0
    for R, c in enumerate(s):
        if c in seen and seen[c] >= L:
            L = seen[c] + 1
        seen[c] = R
        best = max(best, R - L + 1)
    return best`,
        time: 'O(n)', space: 'O(min(n, Σ))',
        why: 'Each char is visited at most twice — added once, possibly skipped over once. Linear total.' },
      { title: 'Group Anagrams — sort as canonical key', problemId: 54,
        problem: 'Group strings that are anagrams of each other.',
        approach: `<p>Anagrams share their sorted form. Use the sorted string as a hash-map key.</p>`,
        code: `def group_anagrams(strs):
    groups = {}
    for s in strs:
        key = ''.join(sorted(s))
        groups.setdefault(key, []).append(s)
    return list(groups.values())`,
        time: 'O(n · k log k)', space: 'O(n · k)',
        why: 'Anagrams = same multiset. Sorting collapses the multiset to a unique key.' }
    ],
    gotchas: [
      'Concatenating with <code>+=</code> in a loop is O(n²) in many languages. Use an array + join.',
      'Comparing characters with <code>==</code> works on individual chars in Python and JS, but not in Java (use <code>.equals()</code> for Strings, but <code>==</code> for chars).',
      'Don\'t assume ASCII. Clarify "lowercase English only" vs "any Unicode" — it changes the data structure choice.',
      '<code>.lower()</code>/<code>.isalnum()</code> work per-character in Python; in other languages you may need explicit Unicode-aware methods.'
    ],
    videoSearch: 'string algorithms neetcode',
    diagram: 'svgStrings', cardIcon: 'svgStringsMini',
    takeaways: [
      'Strings are immutable in many languages — concatenation in a loop is O(n²).',
      'Common patterns: char counting, palindromes, anagrams, sliding window.',
      'Use a hash map of character counts for anagram-style problems.',
      'Build with an array buffer + join at the end to keep mutations linear.',
    ],
    practice: { type: 'problems', filter: { category: 'String' }, label: 'String Problems' },
  },
  { id: 'linked-list', section: 'Data Structures', title: 'Linked Lists', estMin: 12,
    summary: 'Chains of nodes pointing to the next — easy to insert, hard to index.',
    details: [
      { heading: 'What it is', body: `<p>A linked list is a chain of nodes. Each node holds a value and a <code>next</code> pointer to the following node. The last node's <code>next</code> is <code>null</code>.</p>` },
      { heading: 'How it works', body: `<p>Insertion at the head is <code>O(1)</code> (no shifting), but indexing is <code>O(n)</code> — you must walk the chain to reach element i. Great when you do many insertions/removals at known spots; bad when you need random access.</p>
<p>Three techniques you'll see repeatedly:</p>
<p>• <strong>Dummy head</strong> — prepend a sentinel node so you don't have to special-case "removing the head."<br>• <strong>Fast/slow pointer (Floyd's)</strong> — one pointer moves 2× the other. Find middle, detect cycle, find cycle start.<br>• <strong>Reverse in place</strong> — walk with prev/curr/next, flipping each pointer.</p>` },
      { heading: 'When to reach for it', body: `<p>You don't usually <em>choose</em> linked lists in interviews — you're given one. The interviewer wants to see if you can manipulate pointers without losing data or creating cycles.</p>
<p>If you find yourself wanting to "go back" or "look back N nodes," you usually need either a <strong>two-pointer trick</strong> (gap pointers) or a <strong>reverse-in-place</strong>.</p>` }
    ],
    examples: [
      { title: 'Reverse Linked List — three-pointer flip', problemId: 40,
        problem: 'Reverse a singly linked list.',
        approach: `<p>Walk with prev = null and curr = head. At each step, save curr.next, point curr.next at prev, advance prev to curr, advance curr to the saved next. When curr is null, prev is the new head.</p>`,
        code: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
        time: 'O(n)', space: 'O(1)',
        why: 'The three-pointer dance shows up in many list problems. Burn it into muscle memory.' },
      { title: 'Linked List Cycle — Floyd\'s tortoise and hare', problemId: 41,
        problem: 'Determine if a linked list has a cycle.',
        approach: `<p>Two pointers: slow advances 1, fast advances 2. If there\'s a cycle, fast will eventually meet slow. If fast hits null, there\'s no cycle.</p>
<p>The math: in a cycle, fast gains 1 step on slow per iteration, so they meet within n iterations.</p>`,
        code: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
        time: 'O(n)', space: 'O(1)',
        why: 'Constant space is the killer feature. A hash-set of seen nodes also works but uses O(n) space.' },
      { title: 'Merge Two Sorted Lists — pointer walk with dummy head', problemId: 42,
        problem: 'Merge two sorted linked lists into one sorted list.',
        approach: `<p>Use a dummy head to avoid edge-case branching. Walk both lists, attach the smaller node to the tail, advance.</p>`,
        code: `def merge_two(l1, l2):
    dummy = tail = ListNode()
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next, l1 = l1, l1.next
        else:
            tail.next, l2 = l2, l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next`,
        time: 'O(n + m)', space: 'O(1)',
        why: 'Dummy head is the trick — no special-case for the first attachment.' }
    ],
    gotchas: [
      'Always check <code>node.next</code> before <code>node.next.next</code> — null dereference is the most common bug.',
      'Forgetting to advance the pointer in a loop → infinite loop.',
      'When reversing, you MUST save <code>next</code> before changing <code>curr.next</code> — or you lose the rest of the list.',
      'In some languages (C/C++), free old nodes when removing them. In garbage-collected languages, just unlink.'
    ],
    videoSearch: 'linked list neetcode',
    diagram: 'svgLinkedList', cardIcon: 'svgLinkedListMini',
    code: { lang: 'Python', explain: 'Reverse a linked list iteratively. Walk the chain with prev/curr; flip each node\'s next pointer in place.',
snippet: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next     # remember the next
        curr.next = prev    # flip the pointer
        prev = curr         # advance prev
        curr = nxt          # advance curr
    return prev             # new head` },
    takeaways: [
      'Indexing is O(n) — you must walk the chain.',
      'Insertion at head/tail is O(1) (with a tail pointer).',
      'Use a dummy/sentinel head to simplify edge cases when modifying.',
      'Fast/slow pointer pattern: detect cycles, find middle, reverse halves.',
    ],
    practice: { type: 'problems', filter: { category: 'Linked List' }, label: 'Linked List Problems' },
  },
  { id: 'stack-queue', section: 'Data Structures', title: 'Stacks & Queues', estMin: 10,
    summary: 'LIFO and FIFO — simple but show up everywhere (matching, BFS, monotonic).',
    details: [
      { heading: 'What it is', body: `<p><strong>Stack</strong> is LIFO (last in, first out): push and pop both work on the top.<br><strong>Queue</strong> is FIFO (first in, first out): push at the back, pop from the front.<br>Both are <code>O(1)</code> per operation.</p>` },
      { heading: 'How it works', body: `<p>Stacks pair naturally with <strong>matching/balanced</strong> problems: when you see an opener, push; when you see a closer, pop and check it matches. Used for parentheses, expression parsing, undo histories.</p>
<p>Queues are the heart of <strong>BFS</strong>. Visit current, enqueue neighbors, dequeue next. Use <code>collections.deque</code> in Python (O(1) on both ends).</p>
<p><strong>Monotonic stack</strong> = a stack whose values stay sorted. As you walk the array, pop anything that violates the order, then push the current. Each element pushed/popped at most once → <code>O(n)</code> total.</p>` },
      { heading: 'When to reach for it', body: `<p><strong>Stack</strong> when you need "last opened, first closed" — parentheses, function calls, DFS with iteration. Or "next greater/smaller" via monotonic stack.</p>
<p><strong>Queue</strong> when you need level-order processing — BFS, scheduling, "process in arrival order."</p>` }
    ],
    examples: [
      { title: 'Valid Parentheses — match openers with closers', problemId: 55,
        problem: 'Determine if a string of brackets is balanced (e.g., "({[]})").',
        approach: `<p>Walk the string. On an opener, push. On a closer, pop and check the popped opener matches. At the end, the stack should be empty.</p>`,
        code: `def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for c in s:
        if c in '([{':
            stack.append(c)
        else:
            if not stack or stack.pop() != pairs[c]:
                return False
    return not stack`,
        time: 'O(n)', space: 'O(n)',
        why: 'The poster child for stacks. Mismatched closer = invalid; non-empty stack at end = unclosed.' },
      { title: 'BFS on a binary tree — queue for level order', problemId: 64,
        problem: 'Traverse a binary tree level by level.',
        approach: `<p>Queue holds the current frontier. At each step, capture the size of the current level, dequeue that many nodes, enqueue their children.</p>`,
        code: `from collections import deque
def level_order(root):
    if not root: return []
    result, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        result.append(level)
    return result`,
        time: 'O(n)', space: 'O(n)',
        why: 'Capturing <code>len(q)</code> at the start of each iteration is the trick that groups nodes by level.' },
      { title: 'Daily Temperatures — monotonic stack', problemId: null,
        problem: 'For each day, return how many days until a warmer temperature.',
        approach: `<p>Walk left-to-right with a stack of indices waiting for a warmer day. When today is warmer than the top of the stack, those waiting days have found their answer — pop them and record.</p>`,
        code: `def daily_temperatures(temps):
    result = [0] * len(temps)
    stack = []
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            result[j] = i - j
        stack.append(i)
    return result`,
        time: 'O(n)', space: 'O(n)',
        why: 'Each index is pushed and popped at most once. The "while pop" looks like it could blow up but doesn\'t — total pops ≤ n.' }
    ],
    gotchas: [
      'In Python, <code>list.pop()</code> from the end is O(1) but <code>list.pop(0)</code> from the front is O(n) — use <code>collections.deque</code> for queues.',
      'Empty stack on close-bracket → invalid input. Always check before popping.',
      'A monotonic stack can be increasing or decreasing — clarify which based on whether you want next-greater or next-smaller.'
    ],
    videoSearch: 'stack queue data structure abdul bari',
    diagram: 'svgStackQueue', cardIcon: 'svgStackQueueMini',
    takeaways: [
      'Stack: push/pop the top — LIFO. Used for parsing, DFS, undo, monotonic problems.',
      'Queue: enqueue at back, dequeue from front — FIFO. Used for BFS and scheduling.',
      'Monotonic stack solves "next greater element" type problems in O(n).',
      'Deque (double-ended queue) is the structure behind sliding-window max.',
    ],
    practice: { type: 'problems', filter: { ds: 'Stack' }, label: 'Stack Problems' },
  },
  { id: 'trees', section: 'Data Structures', title: 'Trees, BSTs & Tries', estMin: 18,
    summary: 'Hierarchical structures — covers most interview tree problems.',
    details: [
      { heading: 'What it is', body: `<p>A tree is a hierarchical structure where each node has children but no cycles. A <strong>binary tree</strong> limits each node to at most two children: left and right.</p>
<p>Operations on a balanced tree run in <code>O(h)</code> where h is the height — log n for balanced, n for degenerate.</p>` },
      { heading: 'How it works', body: `<p><strong>Three traversal orders</strong>:</p>
<p>• <strong>Pre-order</strong> (root, L, R) — copy or serialize<br>• <strong>In-order</strong> (L, root, R) — on a BST yields sorted order<br>• <strong>Post-order</strong> (L, R, root) — compute from children up</p>
<p><strong>BST invariant</strong>: left subtree &lt; node &lt; right subtree. Search/insert/delete in O(log n) on a balanced BST.</p>
<p><strong>Trie</strong>: tree of characters where each path spells a word. O(L) prefix lookup. Used in autocomplete and Word Search II.</p>` },
      { heading: 'When to reach for it', body: `<p>Most tree problems are solved with <strong>recursion</strong>. The standard template: handle null, recurse on left and right, combine results.</p>
<p>If you find yourself wanting random access by value, a BST gives you O(log n) operations. If you need prefix matching on strings, a Trie is the answer. For path-based problems, post-order is usually right.</p>` }
    ],
    lazyDetails: [
      { heading: '👨‍👩‍👧 Like a family tree',
        body: `<p>You at the top. Below you, your parents. Below them, their parents. Each person can have a few kids "below" them, but no one is their own grandparent — there are no loops.</p>
<p>That's a tree. The person at the top is the "root." Each person below is connected to one parent. People with no kids of their own are "leaves."</p>
<p>A "binary" tree just means each person has at most TWO kids. That's the kind that shows up in interviews.</p>` },
      { heading: 'How you walk a tree',
        body: `<p>You usually want to visit every person in the tree. There's no single right order — there are three classic ones:</p>
<p><strong>Top-down</strong>: visit the root, then left side, then right side. Used to copy or print a tree.</p>
<p><strong>Inside</strong>: visit left side, then root, then right side. On a "search tree" (where left < parent < right), this gives you everyone in sorted order.</p>
<p><strong>Bottom-up</strong>: visit left side, then right side, then root. Used when you need answers from your kids before you can answer for yourself (like "how tall is my subtree?").</p>` },
      { heading: 'Why recursion is the natural fit',
        body: `<p>A tree is just a person with smaller trees hanging off them. So writing tree code is just: "do something at this node, then ask the same question of my left subtree, then my right subtree."</p>
<p>That self-referential pattern is exactly what recursion is built for. Almost every tree problem reduces to: handle the empty case, do something with the current node, recurse on the children.</p>` }
    ],
    examples: [
      { title: 'Maximum Depth — recursion template', problemId: 60,
        problem: 'Return the maximum depth (longest path from root to leaf) of a binary tree.',
        approach: `<p>Depth = 1 + max(depth(left), depth(right)). Base case: null tree has depth 0.</p>`,
        code: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
        time: 'O(n)', space: 'O(h)',
        why: 'The cleanest example of the "recurse on children, combine" pattern.' },
      { title: 'Validate BST — propagate bounds', problemId: 68,
        problem: 'Determine if a binary tree is a valid BST.',
        approach: `<p>Don\'t just check that left.val &lt; node.val &lt; right.val — that misses violations from ancestors. Pass down (lo, hi) bounds and tighten them as you recurse.</p>`,
        code: `def is_valid_bst(root, lo=float('-inf'), hi=float('inf')):
    if not root:
        return True
    if not (lo < root.val < hi):
        return False
    return (is_valid_bst(root.left, lo, root.val) and
            is_valid_bst(root.right, root.val, hi))`,
        time: 'O(n)', space: 'O(h)',
        why: 'Bounds propagate. A common bug is comparing only to direct children — that misses cross-subtree violations.' },
      { title: 'LCA of BST — exploit the ordering', problemId: 70,
        problem: 'Find the lowest common ancestor of two nodes in a BST.',
        approach: `<p>Walk down from root. If both targets are less than current → go left. Both greater → go right. Otherwise the current node is the LCA (or one target equals it).</p>`,
        code: `def lowest_common_ancestor(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root`,
        time: 'O(h)', space: 'O(1)',
        why: 'BST ordering gives you a navigation tool — always think about how to leverage left &lt; node &lt; right.' },
      { title: 'Implement Trie — character tree', problemId: 71,
        problem: 'Implement insert, search, and startsWith for a trie.',
        approach: `<p>Each node is a map from character to child node, plus an <code>is_word</code> flag. Walking down the path of characters is O(L).</p>`,
        code: `class Trie:
    def __init__(self):
        self.children = {}
        self.is_word = False

    def insert(self, word):
        node = self
        for c in word:
            if c not in node.children:
                node.children[c] = Trie()
            node = node.children[c]
        node.is_word = True

    def search(self, word):
        node = self
        for c in word:
            if c not in node.children: return False
            node = node.children[c]
        return node.is_word`,
        time: 'O(L) per op', space: 'O(total chars)',
        why: 'Tries are how autocomplete works. The structure makes prefix queries trivial.' }
    ],
    gotchas: [
      'Recursion depth on a degenerate tree (linked-list shape) is O(n) — Python defaults to 1000, beyond that you need iterative or <code>sys.setrecursionlimit</code>.',
      'In-order traversal of a BST gives sorted order. If it doesn\'t, the BST is invalid — that\'s another way to validate.',
      'When recursing, always check for null at the start. Otherwise <code>node.left</code> on null crashes.',
      'BSTs in Blind 75 are usually balanced. Real-world (unbalanced) BSTs degrade to O(n) — mention AVL/Red-Black if probed.'
    ],
    videoSearch: 'binary tree neetcode',
    diagram: 'svgTree', cardIcon: 'svgTreeMini',
    takeaways: [
      'Binary tree: ≤2 children per node. Operations are O(h) where h is height.',
      'BST: left < node < right. O(log n) lookup if balanced, O(n) if degenerate.',
      'Three traversals: pre-order (root,L,R), in-order (L,root,R — sorted on a BST), post-order (L,R,root).',
      'Tries store strings letter-by-letter — O(L) lookup where L is word length.',
    ],
    practice: { type: 'problems', filter: { category: 'Tree' }, label: 'Tree Problems' },
  },
  { id: 'heaps', section: 'Data Structures', title: 'Heaps / Priority Queues', estMin: 12,
    summary: 'Always-O(log n) access to the min or max — built on a complete binary tree.',
    details: [
      { heading: 'What it is', body: `<p>A heap is a complete binary tree with one constraint: each parent is ≥ its children (max-heap) or ≤ its children (min-heap). The root is always the max (or min).</p>
<p>Push and pop: <code>O(log n)</code>. Peek the top: <code>O(1)</code>. Build a heap from n elements: <code>O(n)</code>.</p>` },
      { heading: 'How it works', body: `<p>Stored as an array using index math: parent of i is <code>(i − 1) / 2</code>; children are <code>2i + 1</code> and <code>2i + 2</code>. No pointers, no per-node allocation.</p>
<p>The "always know the current best" property without a full sort. Use built-in libraries: Python <code>heapq</code> (min-heap; negate values for max), Java <code>PriorityQueue</code>, JS needs a custom impl.</p>` },
      { heading: 'When to reach for it', body: `<p><strong>Top-K problems</strong>: maintain a heap of size K → O(n log K). Smaller heap = less work per push/pop than sorting all n.</p>
<p><strong>"Always need the next-best one"</strong>: scheduling, Dijkstra, merge-K-sorted-lists.</p>
<p><strong>Two-heap pattern</strong>: median-from-stream — max-heap of lower half + min-heap of upper half.</p>` }
    ],
    examples: [
      { title: 'Top K Frequent Elements — min-heap of size K', problemId: 74,
        problem: 'Return the k most frequent elements in an array.',
        approach: `<p>Count frequencies. Maintain a min-heap of size k keyed by count. For each (count, value), push; if heap exceeds size k, pop the smallest. The k that remain are your answer.</p>`,
        code: `import heapq
from collections import Counter

def top_k_frequent(nums, k):
    counts = Counter(nums)
    heap = []
    for val, freq in counts.items():
        heapq.heappush(heap, (freq, val))
        if len(heap) > k:
            heapq.heappop(heap)
    return [val for _, val in heap]`,
        time: 'O(n log k)', space: 'O(n)',
        why: 'Heap size = k means each push/pop is O(log k), not O(log n). For small k this is much faster than sorting.' },
      { title: 'Median from Data Stream — two heaps', problemId: 75,
        problem: 'Continuously compute the median of a stream of numbers.',
        approach: `<p>Two heaps: a max-heap (lower half) and a min-heap (upper half), kept balanced ±1. The median is the top of one (odd total) or the avg of both tops (even).</p>`,
        code: `import heapq
class MedianFinder:
    def __init__(self):
        self.lo = []   # max-heap (negated)
        self.hi = []   # min-heap

    def addNum(self, n):
        heapq.heappush(self.lo, -n)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2`,
        time: 'O(log n) addNum · O(1) findMedian', space: 'O(n)',
        why: 'The two-heap split keeps median at the boundary. Neither heap alone could give O(log n) median.' },
      { title: 'Merge K Sorted Lists — k-way merge', problemId: 43,
        problem: 'Merge k sorted linked lists into one sorted list.',
        approach: `<p>Min-heap of (value, list-index, node) for the heads. Pop the smallest, push its <code>.next</code>. Repeat until heap empty.</p>`,
        code: `import heapq
def merge_k(lists):
    heap = []
    for i, head in enumerate(lists):
        if head: heapq.heappush(heap, (head.val, i, head))
    dummy = tail = ListNode()
    while heap:
        val, i, node = heapq.heappop(heap)
        tail.next = node; tail = node
        if node.next: heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
        time: 'O(N log k)', space: 'O(k)',
        why: 'A heap of just the heads keeps the running search at O(log k). The "list-index" tiebreaker prevents Python from comparing nodes when values tie.' }
    ],
    gotchas: [
      'Python\'s <code>heapq</code> is a min-heap only. For a max-heap, negate values on push and pop.',
      'When pushing tuples and values can tie, include a tiebreaker (e.g., insertion order). Otherwise Python tries to compare the next field, and node objects may not be comparable.',
      'Don\'t conflate "heap" with "binary heap" with "priority queue" — they\'re related but the term you use depends on the language.'
    ],
    videoSearch: 'heap priority queue neetcode',
    diagram: 'svgHeap', cardIcon: 'svgHeapMini',
    takeaways: [
      'Min-heap: parent ≤ children. Max-heap: parent ≥ children.',
      'push and pop are O(log n). peek is O(1).',
      'Top-K problems: maintain a heap of size K → overall O(n log K).',
      'Stored as an array using index math: parent = (i−1)/2, children = 2i+1, 2i+2.',
    ],
    practice: { type: 'problems', filter: { category: 'Heap' }, label: 'Heap Problems' },
  },
  { id: 'graphs', section: 'Data Structures', title: 'Graphs', estMin: 18,
    summary: 'Nodes and edges — model networks, dependencies, and grids-as-graphs.',
    details: [
      { heading: 'What it is', body: `<p>A graph is nodes connected by edges. Edges can be <strong>directed</strong> (one-way) or <strong>undirected</strong>, <strong>weighted</strong> or unweighted, and may form cycles or not (a DAG = directed acyclic graph).</p>
<p>The standard interview representation is an <strong>adjacency list</strong>: a hash map from each node to a list of its neighbors. <code>O(V + E)</code> to iterate all edges.</p>` },
      { heading: 'How it works', body: `<p><strong>BFS</strong> uses a queue, visits closest neighbors first, finds shortest paths in unweighted graphs. <strong>DFS</strong> uses recursion (or a stack), goes deep before backtracking, used for connectivity and topological sort.</p>
<p><strong>Topological sort</strong>: orders DAG nodes so every edge points forward. Kahn's algorithm uses BFS with in-degree counts.</p>
<p><strong>Union-Find</strong>: tracks connected components in nearly <code>O(α(n))</code> per op (effectively O(1)). Two ops: <code>find(x)</code> returns the root of x's group; <code>union(x, y)</code> merges two groups.</p>` },
      { heading: 'When to reach for it', body: `<p>If a problem talks about "connections," "dependencies," "reachability," "groups," or has a 2D grid you traverse in 4 directions — it's a graph problem.</p>
<p>Choose: BFS for shortest path, DFS for any-path or exhaustive exploration, topo sort for ordering by dependency, Union-Find for grouping/merging.</p>` }
    ],
    examples: [
      { title: 'Number of Islands — DFS on a grid', problemId: 30,
        problem: 'Count connected groups of \'1\'s in a 2D grid (4-directional connectivity).',
        approach: `<p>For each unvisited \'1\', DFS to mark its whole connected component as visited (or sink to \'0\'). Count how many DFS starts you needed.</p>`,
        code: `def num_islands(grid):
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'   # mark visited
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1
    return count`,
        time: 'O(m·n)', space: 'O(m·n) recursion',
        why: 'Grid as graph: each cell is a node, connected to its 4 neighbors. Each cell is visited once.' },
      { title: 'Course Schedule — topological sort', problemId: 28,
        problem: 'Given prerequisites, determine if you can finish all courses (no cycles).',
        approach: `<p>Build the DAG. Compute in-degrees. Queue all in-degree-0 nodes. Pop, decrement neighbors\' in-degrees, queue them when they hit 0. If you process all n nodes, no cycle. Otherwise there\'s a cycle.</p>`,
        code: `from collections import deque, defaultdict
def can_finish(n, prereqs):
    graph = defaultdict(list)
    indeg = [0] * n
    for a, b in prereqs:
        graph[b].append(a)
        indeg[a] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    seen = 0
    while q:
        node = q.popleft()
        seen += 1
        for nei in graph[node]:
            indeg[nei] -= 1
            if indeg[nei] == 0:
                q.append(nei)
    return seen == n`,
        time: 'O(V + E)', space: 'O(V + E)',
        why: 'Kahn\'s algorithm is the cleanest way to detect cycles AND get a topological order at the same time.' },
      { title: 'Clone Graph — BFS with hash map', problemId: 27,
        problem: 'Given a reference to a node in an undirected graph, return a deep copy.',
        approach: `<p>BFS from the start. Maintain a hash map <code>{original: clone}</code>. When visiting a node, clone it if not seen, then connect its clone to clones of its neighbors.</p>`,
        code: `from collections import deque
def clone_graph(node):
    if not node: return None
    clones = {node: Node(node.val)}
    q = deque([node])
    while q:
        cur = q.popleft()
        for nei in cur.neighbors:
            if nei not in clones:
                clones[nei] = Node(nei.val)
                q.append(nei)
            clones[cur].neighbors.append(clones[nei])
    return clones[node]`,
        time: 'O(V + E)', space: 'O(V)',
        why: 'The hash map is the trick — it both deduplicates clones and tracks visited.' },
      { title: 'Number of Connected Components — Union-Find', problemId: 34,
        problem: 'Given n nodes and a list of undirected edges, count connected components.',
        approach: `<p>Initialize each node as its own root. For each edge (u, v), union u and v. Count distinct roots at the end.</p>`,
        code: `def count_components(n, edges):
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]   # path compression
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb: parent[ra] = rb

    for a, b in edges:
        union(a, b)
    return len(set(find(i) for i in range(n)))`,
        time: 'O((n + e) · α(n))', space: 'O(n)',
        why: 'Path compression (and union-by-rank, omitted here for brevity) makes operations effectively O(1).' }
    ],
    gotchas: [
      'Undirected edges go both ways — add both <code>graph[u].append(v)</code> AND <code>graph[v].append(u)</code> when building.',
      'Don\'t forget the visited set in BFS/DFS on graphs (unlike trees, graphs can have cycles).',
      'Recursion-based DFS can stack-overflow on deep graphs (n &gt; ~1000). Convert to iterative with an explicit stack if needed.',
      'For weighted shortest path use Dijkstra (priority queue), not BFS. BFS only works for unweighted (or all-equal-weight) graphs.'
    ],
    videoSearch: 'graph data structure william fiset',
    diagram: 'svgGraph', cardIcon: 'svgGraphMini',
    takeaways: [
      'Adjacency list (map of node → neighbors) is the standard interview representation.',
      'BFS finds shortest paths in unweighted graphs; DFS explores connectivity and paths.',
      'Topological sort orders DAG nodes by dependency — Course Schedule, build systems.',
      'Union-Find tracks connected components in nearly O(α(n)) per operation.',
    ],
    practice: { type: 'problems', filter: { category: 'Graph' }, label: 'Graph Problems' },
  },
  { id: 'matrix', section: 'Data Structures', title: 'Matrix / 2D Grid', estMin: 10,
    summary: '2D arrays — common for traversal, search, and grid-as-graph problems.',
    details: [
      { heading: 'What it is', body: `<p>A matrix is a 2D array — rows × columns. Accessed by <code>matrix[row][col]</code>. Most interview matrices are square or near-square grids.</p>` },
      { heading: 'How it works', body: `<p>Treat grids as <strong>graphs in disguise</strong>: each cell connects to its 4 neighbors (up/down/left/right) — sometimes 8. BFS or DFS solves "connected components" (Number of Islands), "shortest path" (Rotting Oranges-style), and "explore paths" (Word Search).</p>
<p>Watch for bounds: <code>0 ≤ r &lt; rows</code> AND <code>0 ≤ c &lt; cols</code>. A common bug is forgetting to check both before accessing <code>matrix[r][c]</code>.</p>` },
      { heading: 'When to reach for it', body: `<p>When you see a 2D grid, ask: am I doing <strong>traversal</strong> (BFS/DFS) or <strong>in-place transformation</strong>?</p>
<p>For in-place: think about whether you can use the matrix itself as scratch (e.g., flag values, sentinel values) to keep space at O(1).</p>` }
    ],
    examples: [
      { title: 'Set Matrix Zeroes — in-place flags', problemId: 46,
        problem: 'If an element is 0, set its entire row and column to 0. Do it in place.',
        approach: `<p>Use the first row and first column themselves as flag arrays. Track separately whether the first row/col originally had a zero. First pass marks; second pass zeroes.</p>`,
        code: `def set_zeroes(matrix):
    rows, cols = len(matrix), len(matrix[0])
    first_row = any(matrix[0][c] == 0 for c in range(cols))
    first_col = any(matrix[r][0] == 0 for r in range(rows))
    for r in range(1, rows):
        for c in range(1, cols):
            if matrix[r][c] == 0:
                matrix[r][0] = 0
                matrix[0][c] = 0
    for r in range(1, rows):
        for c in range(1, cols):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0
    if first_row:
        for c in range(cols): matrix[0][c] = 0
    if first_col:
        for r in range(rows): matrix[r][0] = 0`,
        time: 'O(m·n)', space: 'O(1)',
        why: 'Reusing the first row and column as flags is the classic trick to get O(1) extra space.' },
      { title: 'Rotate Image — transpose then reverse rows', problemId: 48,
        problem: 'Rotate an n × n matrix 90° clockwise in place.',
        approach: `<p>Two-step transformation: (1) transpose — swap M[i][j] with M[j][i] for i &lt; j. (2) Reverse each row. Both are in place; total O(n²).</p>`,
        code: `def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()`,
        time: 'O(n²)', space: 'O(1)',
        why: 'Two simple transformations beat any "rotate cell-by-cell" approach for clarity and bug count.' },
      { title: 'Spiral Matrix — shrinking boundaries', problemId: 47,
        problem: 'Return all elements of a matrix in spiral order (right, down, left, up, repeat).',
        approach: `<p>Maintain top/bottom/left/right boundaries. Walk one layer at a time and shrink the boundaries inward.</p>`,
        code: `def spiral_order(matrix):
    out, top, bot = [], 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bot and left <= right:
        for c in range(left, right + 1): out.append(matrix[top][c])
        top += 1
        for r in range(top, bot + 1): out.append(matrix[r][right])
        right -= 1
        if top <= bot:
            for c in range(right, left - 1, -1): out.append(matrix[bot][c])
            bot -= 1
        if left <= right:
            for r in range(bot, top - 1, -1): out.append(matrix[r][left])
            left += 1
    return out`,
        time: 'O(m·n)', space: 'O(1) excluding output',
        why: 'Maintaining four bounds is much cleaner than tracking direction-vectors and turn-counts.' }
    ],
    gotchas: [
      'Bounds: check both <code>0 ≤ r &lt; rows</code> and <code>0 ≤ c &lt; cols</code>. Off-by-one here is the #1 grid bug.',
      'On non-rectangular grids, <code>cols</code> may differ per row. Most Blind 75 problems assume rectangular.',
      'When sinking visited cells in DFS, restore them after if the problem requires the original grid intact.',
      'Spiral has special cases when one dimension is 1 — guard the third and fourth direction-walks with the size checks.'
    ],
    videoSearch: '2d matrix problems neetcode',
    diagram: 'svgMatrix', cardIcon: 'svgMatrixMini',
    takeaways: [
      'Treat the grid as a graph: each cell connects to its 4 (or 8) neighbors.',
      'BFS/DFS on grids: Number of Islands, flood fill, path-exists.',
      'Watch for in-place vs. copy when modifying — Set Matrix Zeroes, Rotate Image.',
      'Spiral traversal: maintain four boundaries (top/bottom/left/right) and shrink them.',
    ],
    practice: { type: 'problems', filter: { category: 'Matrix' }, label: 'Matrix Problems' },
  },
  { id: 'intervals', section: 'Data Structures', title: 'Intervals', estMin: 10,
    summary: 'Time ranges with start/end — sort first, then sweep through.',
    details: [
      { heading: 'What it is', body: `<p>An interval is a <code>[start, end]</code> pair. Problems usually ask you to merge overlapping ones, count non-overlapping ones, or schedule them.</p>` },
      { heading: 'How it works', body: `<p>The universal first step is <strong>sorting</strong> — usually by <code>start</code>, sometimes by <code>end</code> for greedy problems. After sorting, sweep through in one linear pass.</p>
<p>The overlap test: <code>[a.s, a.e]</code> and <code>[b.s, b.e]</code> overlap iff <code>a.s ≤ b.e AND b.s ≤ a.e</code>. Equivalently: not (a ends before b starts OR b ends before a starts). Memorize this.</p>` },
      { heading: 'When to reach for it', body: `<p>Any "calendar," "meeting," "scheduling," or "range" problem. Sort by start for merging; sort by end for greedy non-overlap. For "how many concurrent" problems, sweep with a counter or use a min-heap of end-times.</p>` }
    ],
    examples: [
      { title: 'Merge Intervals — sort by start, then sweep', problemId: 36,
        problem: 'Given a list of intervals, merge any that overlap.',
        approach: `<p>Sort by start. Walk through. If the next interval's start ≤ current end, merge by extending the current end. Otherwise, push the current and start a new one.</p>`,
        code: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    out = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return out`,
        time: 'O(n log n)', space: 'O(n) for output',
        why: 'Sorting + linear sweep is the universal pattern. The work is in the sort — the merge itself is trivial.' },
      { title: 'Non-overlapping Intervals — greedy by end', problemId: 37,
        problem: 'Find the minimum number of intervals to remove so the rest are non-overlapping.',
        approach: `<p>Sort by <strong>end</strong> (not start). Greedily keep the earliest-finishing interval. Any later interval whose start &lt; the last-kept end must be removed.</p>
<p>Intuition: keeping the soonest-finisher leaves the most room for future picks.</p>`,
        code: `def erase_overlap(intervals):
    intervals.sort(key=lambda x: x[1])
    end = float('-inf')
    removed = 0
    for s, e in intervals:
        if s >= end:
            end = e          # keep this one
        else:
            removed += 1     # conflicts → remove
    return removed`,
        time: 'O(n log n)', space: 'O(1)',
        why: 'Sort by end (not start) — that\'s the greedy insight. Sorting by start gives the wrong answer here.' },
      { title: 'Meeting Rooms II — min-heap of end times', problemId: 39,
        problem: 'Find the minimum number of meeting rooms needed for a list of meetings.',
        approach: `<p>Sort by start. Use a min-heap of end times for in-progress meetings. For each new meeting: if its start ≥ heap\'s min end, pop (a room freed up). Push the new end either way. The peak heap size is the answer.</p>`,
        code: `import heapq
def min_meeting_rooms(intervals):
    intervals.sort(key=lambda x: x[0])
    heap = []   # end times of meetings in progress
    for s, e in intervals:
        if heap and heap[0] <= s:
            heapq.heappop(heap)   # reuse a room
        heapq.heappush(heap, e)
    return len(heap)`,
        time: 'O(n log n)', space: 'O(n)',
        why: 'The heap tracks "rooms in use" — its size at any moment IS the answer.' }
    ],
    gotchas: [
      'Decide whether intervals are "closed" (<code>[a, b]</code>) or "half-open" (<code>[a, b)</code>) — affects the overlap test by exactly one off-by-one.',
      'Sort by start vs sort by end — different problems need different orderings. Get this right or your greedy fails.',
      'When sorting tuples in Python, by default it sorts by all fields. Use <code>key=lambda x: x[0]</code> to be explicit.'
    ],
    videoSearch: 'merge intervals neetcode',
    diagram: 'svgIntervals', cardIcon: 'svgIntervalsMini',
    takeaways: [
      'Sort by start time to make most problems linear after sort.',
      'Two intervals overlap iff a.start ≤ b.end AND b.start ≤ a.end.',
      'For non-overlapping count: sort by end and greedily pick the earliest finishing.',
      'Meeting Rooms II: a min-heap of end times tracks active meetings.',
    ],
    practice: { type: 'problems', filter: { category: 'Interval' }, label: 'Interval Problems' },
  },
  // Patterns
  { id: 'binary-search', section: 'Patterns', title: 'Binary Search', estMin: 10,
    summary: 'Halve the search space each step — O(log n) on sorted data.',
    details: [
      { heading: 'What it is', body: `<p>Binary search finds an element in a sorted array in <code>O(log n)</code> by repeatedly halving the search range. Each step asks: <em>is the answer in the left half or the right?</em></p>` },
      { heading: 'How it works', body: `<p>Standard template:</p>
<p><code>lo = 0, hi = n − 1</code>. Loop while <code>lo ≤ hi</code>. <code>mid = lo + (hi − lo) // 2</code> (avoids overflow). Compare arr[mid] to target. If equal, return. If less, <code>lo = mid + 1</code>. Else <code>hi = mid − 1</code>.</p>
<p>The pattern <strong>generalizes beyond sorted-array search</strong>. Any monotonic predicate — "given x, does it work?" where yes/no flips at some boundary — can be binary searched on the value space.</p>` },
      { heading: 'When to reach for it', body: `<p>Sorted array → search for value: classic binary search.</p>
<p>"Smallest/largest x such that f(x) is true" where f is monotonic → binary search on values, not indices.</p>
<p>Examples: capacity to ship in d days, Koko eating bananas, find peak in mountain array. Whenever you can phrase it as "is x feasible?", you can binary search.</p>` }
    ],
    lazyDetails: [
      { heading: '🎯 Like guessing a number 1 to 100',
        body: `<p>I'm thinking of a number between 1 and 100. Every guess, I'll tell you "higher" or "lower." How fast can you find it?</p>
<p>Smart way: guess 50. If I say "higher," guess 75. If "lower," guess 62. Each guess cuts the range in HALF. From 100 numbers, you'll find it in 7 guesses. From 1 million numbers, only about 20 guesses.</p>
<p>That's binary search. It only works when the data is in order — otherwise "higher" and "lower" don't mean anything.</p>` },
      { heading: 'How it works in code',
        body: `<p>You keep two markers: "lowest possible" and "highest possible." Look at the middle. Compare to your target.</p>
<p>If the middle is too small → throw away everything on the LEFT (the answer must be on the right side).</p>
<p>If the middle is too big → throw away everything on the RIGHT.</p>
<p>If the middle is exactly your target → done.</p>
<p>Repeat. Each step, half the candidates are gone. That's the magic of "log n" — you barely do any work even on huge inputs.</p>` },
      { heading: 'When to reach for it',
        body: `<p>The list must be sorted. That's the deal-breaker — if it isn't, sort it first or pick a different approach.</p>
<p>Beyond classic "find this value in a sorted array," binary search shows up anywhere you can ask a yes/no question that gets monotonically harder. "Can we ship all packages in 5 days?" → no. "What about 10 days?" → yes. The smallest "yes" is your answer, and you binary-search on the day count.</p>` }
    ],
    examples: [
      { title: 'Classic binary search — find target in sorted array', problemId: null,
        problem: 'Return the index of target in a sorted array, or -1 if not present.',
        approach: `<p>Standard template. Memorize this exactly — small variations cause infinite loops.</p>`,
        code: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == target: return mid
        if arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1`,
        time: 'O(log n)', space: 'O(1)',
        why: 'The template every other binary-search problem builds on. Get the boundary conditions right.' },
      { title: 'Search in Rotated Sorted Array — one half is always sorted', problemId: 8,
        problem: 'Given a sorted array rotated at some pivot, find the target.',
        approach: `<p>At each step, one of [lo..mid] or [mid..hi] is sorted. Check which by comparing arr[mid] to arr[lo]. If target is in the sorted half, search there; otherwise search the other.</p>`,
        code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target: return mid
        if nums[lo] <= nums[mid]:        # left half sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                             # right half sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
        time: 'O(log n)', space: 'O(1)',
        why: 'The trick: in a rotated sorted array, at least one half is still sorted. Use that half\'s endpoints to decide where to look.' },
      { title: 'Find Minimum in Rotated Sorted Array — narrowing toward the pivot', problemId: 7,
        problem: 'Find the minimum of a rotated sorted array.',
        approach: `<p>Compare arr[mid] to arr[hi]. If arr[mid] &gt; arr[hi], the min is to the right of mid (<code>lo = mid + 1</code>). Otherwise it\'s mid or to the left (<code>hi = mid</code>). Loop until lo = hi.</p>`,
        code: `def find_min(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return nums[lo]`,
        time: 'O(log n)', space: 'O(1)',
        why: 'Note <code>while lo &lt; hi</code> (not ≤) and <code>hi = mid</code> (not mid - 1). Different invariant for "find boundary" vs "find target."' }
    ],
    gotchas: [
      'Integer overflow: use <code>lo + (hi - lo) // 2</code>, not <code>(lo + hi) // 2</code>.',
      'Infinite loops: if <code>lo</code> or <code>hi</code> doesn\'t change in some branch, you\'ll loop forever. Especially common when <code>hi = mid</code> and the loop condition is <code>lo ≤ hi</code>.',
      '"Find target" uses <code>while lo ≤ hi</code> with <code>mid ± 1</code> updates. "Find boundary" uses <code>while lo &lt; hi</code> with <code>hi = mid</code> updates. Don\'t mix them up.',
      'Test with arrays of size 1 and 2 — most off-by-one bugs surface there.'
    ],
    videoSearch: 'binary search algorithm neetcode',
    diagram: 'svgBinarySearch', cardIcon: 'svgBinarySearchMini',
    code: { lang: 'Python', explain: 'Classic binary search. Note `mid = lo + (hi − lo) // 2` avoids integer overflow in languages where it matters.',
snippet: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1     # answer is in right half
        else:
            hi = mid - 1     # answer is in left half
    return -1` },
    takeaways: [
      'Set lo=0, hi=n−1. Loop while lo ≤ hi. Compare arr[mid] to target.',
      'Use mid = lo + (hi − lo) / 2 to avoid integer overflow.',
      'Works on rotated arrays too — just decide which half is sorted.',
      'Generalizes to "search a value space" — feasibility on monotonic predicates.',
    ],
    practice: { type: 'problems', filter: { ds: 'Binary Search' }, label: 'Binary Search Problems' },
  },
  { id: 'bfs-dfs', section: 'Patterns', title: 'BFS vs DFS', estMin: 14,
    videoSearch: 'bfs vs dfs neetcode',
    diagram: 'svgBfsDfs', cardIcon: 'svgBfsDfsMini',
    summary: 'Two ways to walk a tree or graph — same structure, very different behavior.',
    details: [
      { heading: 'What it is', body: `<p>Two strategies for walking a tree or graph:</p>
<p>• <strong>BFS</strong> uses a queue, visits closest neighbors first — level by level.<br>• <strong>DFS</strong> uses recursion (or a stack), goes deep before wide.</p>
<p>Same data structure, completely different traversal order.</p>` },
      { heading: 'How it works', body: `<p><strong>BFS</strong>: visit start, enqueue neighbors, dequeue next, repeat. The first time you reach a node is via the shortest path (in unweighted graphs).</p>
<p><strong>DFS</strong>: visit start, recurse into one neighbor and explore everything reachable, then return to try the next neighbor. Natural for trees, cycle detection, "explore all paths."</p>
<p>On a tree {1, [2, [4, 5]], [3, [6, 7]]}: BFS visits 1, 2, 3, 4, 5, 6, 7. DFS pre-order: 1, 2, 4, 5, 3, 6, 7.</p>` },
      { heading: 'When to reach for it', body: `<p><strong>Shortest path</strong> or minimum steps in unweighted graph → <strong>BFS</strong>.<br><strong>Connectivity, cycle detection, all paths</strong> → <strong>DFS</strong>.<br><strong>Topological sort</strong> → either works (Kahn\'s = BFS, post-order = DFS).</p>
<p>Memory: DFS uses O(depth) stack, BFS uses O(width) queue. On a deep skinny tree, DFS can overflow. On a wide tree, BFS\'s queue can balloon.</p>` }
    ],
    lazyDetails: [
      { heading: '🌊 BFS = ripples in a pond. 🦎 DFS = lizard up a tree.',
        body: `<p>You drop a pebble in a pond. The ripples spread out evenly: first the closest water moves, then a slightly bigger circle, then bigger. That's <strong>BFS</strong> — Breadth-First Search. You explore everything close to you first, then everything one step further, and so on.</p>
<p>Now picture a lizard running up a tree. It picks a branch and goes ALL the way to the tip before coming back to try another branch. That's <strong>DFS</strong> — Depth-First Search. You commit to one direction and exhaust it before backtracking.</p>` },
      { heading: 'When to use which',
        body: `<p><strong>BFS for shortest path</strong>: if you're asking "what's the fewest steps from A to B?", BFS is your friend. The first time the ripples reach B, you've found the shortest route.</p>
<p><strong>DFS for "is there ANY path"</strong>: if you're asking "can we reach this node at all?" or "explore every possible path," DFS is shorter to write and uses less memory on tall, skinny trees.</p>
<p>Mnemonic: <em>BFS for shortest, DFS for everything-else.</em></p>` },
      { heading: 'How they differ in code',
        body: `<p>BFS uses a <strong>queue</strong> (first in, first out — like a checkout line). You add neighbors to the back, process from the front. That's why nearby things come first.</p>
<p>DFS uses <strong>recursion</strong> (the call stack does the work) or an explicit stack (last in, first out — like a pile of plates). You dive deep before coming back.</p>
<p>The data structure (queue vs stack) is literally what makes the difference. Same exact algorithm template, totally different traversal order.</p>` }
    ],
    examples: [
      { title: 'BFS on a binary tree — level order', problemId: 64,
        problem: 'Return values level by level (one list per level).',
        approach: `<p>Queue holds the current level\'s nodes. Capture <code>len(queue)</code> at the start of each iteration to group siblings; dequeue exactly that many.</p>`,
        code: `from collections import deque
def level_order(root):
    if not root: return []
    result, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        result.append(level)
    return result`,
        time: 'O(n)', space: 'O(n)',
        why: 'The <code>len(q)</code> snapshot at the top of each iteration is the trick — it groups nodes by level.' },
      { title: 'DFS — Maximum Depth (recursive)', problemId: 60,
        problem: 'Find the maximum depth of a binary tree.',
        approach: `<p>Recurse on left and right; depth = 1 + max(left, right). Base case: null → 0.</p>`,
        code: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
        time: 'O(n)', space: 'O(h)',
        why: 'Depth-first feels natural for tree problems because the recursion follows the tree shape.' },
      { title: 'BFS shortest path — Word Ladder style', problemId: null,
        problem: 'Shortest sequence of one-letter changes from begin to end (each intermediate must be in the dictionary).',
        approach: `<p>BFS over words. Each word\'s neighbors are words differing by one letter. Distance = number of BFS levels needed to reach end.</p>`,
        code: `from collections import deque
def ladder_length(begin, end, word_list):
    words = set(word_list)
    if end not in words: return 0
    q = deque([(begin, 1)])
    while q:
        word, length = q.popleft()
        if word == end: return length
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                nxt = word[:i] + c + word[i+1:]
                if nxt in words:
                    words.remove(nxt)   # mark visited
                    q.append((nxt, length + 1))
    return 0`,
        time: 'O(L · 26 · n)', space: 'O(n)',
        why: 'Shortest path in unweighted graph → BFS. Always.' },
      { title: 'DFS — Number of Islands', problemId: 30,
        problem: 'Count connected groups of \'1\'s in a 2D grid.',
        approach: `<p>For each unvisited \'1\', DFS to mark its whole component. Count how many DFS starts.</p>`,
        code: `def num_islands(grid):
    rows, cols, count = len(grid), len(grid[0]), 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c); count += 1
    return count`,
        time: 'O(m·n)', space: 'O(m·n) recursion',
        why: 'Connectivity in a grid → DFS marks the entire component. Each cell visited once.' }
    ],
    gotchas: [
      'BFS in trees needs a queue, not a stack. Mixing them up gives DFS-like order.',
      'On graphs (with cycles), you MUST track visited — otherwise infinite loops.',
      'Recursive DFS can stack-overflow on deep graphs. Use iterative DFS with an explicit stack for n &gt; ~1000.',
      'BFS gives shortest path only in unweighted graphs. For weighted graphs, you need Dijkstra (priority queue), not a regular queue.'
    ],
    code: { lang: 'Python', explain: 'BFS uses a queue and visits level by level. DFS uses recursion (or a stack) and goes deep first.',
snippet: `from collections import deque

def bfs(root):                          # level-order
    if not root: return
    q = deque([root])
    while q:
        node = q.popleft()
        visit(node)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)

def dfs(node):                          # pre-order
    if not node: return
    visit(node)
    dfs(node.left)
    dfs(node.right)` },
    takeaways: [
      'BFS uses a queue, visits level by level. Finds shortest path in unweighted graphs.',
      'DFS uses recursion (or a stack), goes deep before wide. Natural for "explore all paths".',
      'Pick BFS for shortest distance, level grouping, minimum steps.',
      'Pick DFS for connectivity, cycle detection, topological sort, exhaustive search.',
    ],
    practice: { type: 'problems', filter: { ds: 'BFS/DFS' }, label: 'BFS / DFS Problems' },
  },
  { id: 'backtracking', section: 'Patterns', title: 'Backtracking', estMin: 14,
    summary: 'Try a choice → recurse → undo. Solves combinatorial search problems.',
    details: [
      { heading: 'What it is', body: `<p>Backtracking is recursive search where you make a choice, recurse, and then <strong>undo the choice</strong> if it doesn't pan out. The pattern: <em>choose → explore → un-choose</em>.</p>
<p>Maintain a partial solution (often a list called <code>path</code>). The "undo" step is what distinguishes backtracking from naive recursion.</p>` },
      { heading: 'How it works', body: `<p>Template:</p>
<p><code>def backtrack(state):<br>&nbsp;&nbsp;if is_solution(state): record(state); return<br>&nbsp;&nbsp;for choice in choices(state):<br>&nbsp;&nbsp;&nbsp;&nbsp;if not valid(choice, state): continue&nbsp;&nbsp;# prune<br>&nbsp;&nbsp;&nbsp;&nbsp;apply(choice, state)<br>&nbsp;&nbsp;&nbsp;&nbsp;backtrack(state)<br>&nbsp;&nbsp;&nbsp;&nbsp;undo(choice, state)</code></p>
<p><strong>Pruning is critical.</strong> Without it, you walk the entire decision tree and pay O(2ⁿ) or O(n!). With aggressive pruning, exponential algorithms often run "fast enough" in practice.</p>` },
      { heading: 'When to reach for it', body: `<p><strong>Combinatorial problems</strong>: subsets, permutations, combinations, N-Queens, Sudoku.</p>
<p><strong>Grid path problems</strong> with a "must visit each cell at most once" constraint: Word Search.</p>
<p><strong>"Find all valid X"</strong> where X is a structure with constraints: parentheses generation, palindrome partitioning.</p>
<p>If the problem says "all," "every," or has a small input (n ≤ 20), backtracking is a strong default.</p>` }
    ],
    lazyDetails: [
      { heading: '🚶 Going down a path; if blocked, walk back',
        body: `<p>You're in a maze. You see a fork. You pick left. You walk a few steps and hit a dead end. You walk BACK to the fork and try right. If right also dead-ends, you walk back further and try a different earlier choice.</p>
<p>That's backtracking: try a path, hit a wall, undo your last move, try a different one. Keep doing this until you find the exit (or prove there is no exit).</p>` },
      { heading: 'The three steps',
        body: `<p>Every backtracking solution does the same dance:</p>
<p>1. <strong>Choose</strong> — make a move (e.g., pick this number for your subset, place a queen on this square).</p>
<p>2. <strong>Explore</strong> — recurse: now solve the smaller subproblem assuming that choice was made.</p>
<p>3. <strong>Un-choose</strong> — back out the move so you can try a different one. THIS step is the key. Forget it and your code is wrong.</p>` },
      { heading: 'When to reach for it',
        body: `<p>Anytime the problem asks "find ALL valid X" or "is there ANY valid X" where X is built from a series of choices.</p>
<p>Common ones: all subsets of a list, all permutations, all valid combinations, Sudoku, N-Queens, Word Search on a grid, generating all valid parenthesis arrangements.</p>
<p>Big warning: backtracking is naturally slow (often O(2ⁿ) or O(n!)). It works for small inputs (n ≤ 20-ish). For bigger inputs, look for a smarter approach (often DP).</p>` }
    ],
    examples: [
      { title: 'Subsets — include or exclude each element', problemId: null,
        problem: 'Generate all 2ⁿ subsets of a set.',
        approach: `<p>At each index, try two choices: include nums[i] in the path, or skip it. After both branches recurse, the snapshot is taken at the leaf level (when index reaches n).</p>`,
        code: `def subsets(nums):
    result, path = [], []
    def backtrack(i):
        if i == len(nums):
            result.append(path[:])   # snapshot
            return
        path.append(nums[i])
        backtrack(i + 1)
        path.pop()                    # un-choose
        backtrack(i + 1)
    backtrack(0)
    return result`,
        time: 'O(n · 2ⁿ)', space: 'O(n · 2ⁿ)',
        why: 'The cleanest backtracking template — two binary choices per element. The pop is the un-choose.' },
      { title: 'Permutations — try each unused element', problemId: null,
        problem: 'Generate all n! permutations of a list.',
        approach: `<p>Track used elements with a boolean array. At each level, loop through all n choices, skip used ones, mark used, recurse, unmark.</p>`,
        code: `def permute(nums):
    result, path, used = [], [], [False] * len(nums)
    def backtrack():
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(len(nums)):
            if used[i]: continue
            used[i] = True
            path.append(nums[i])
            backtrack()
            path.pop()
            used[i] = False
    backtrack()
    return result`,
        time: 'O(n · n!)', space: 'O(n)',
        why: 'Permutations have n! leaves but the tree is wider, not deeper than 2ⁿ. The "used" array is the standard trick to avoid duplicates.' },
      { title: 'Word Search — DFS with backtracking on a grid', problemId: 49,
        problem: 'Determine if a word can be constructed from sequentially adjacent grid cells.',
        approach: `<p>Try DFS from each cell. Mark visited cells (mutate the grid temporarily); recurse on neighbors that match the next char; un-mark on return.</p>`,
        code: `def exist(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word): return True
        if r < 0 or r >= rows or c < 0 or c >= cols: return False
        if board[r][c] != word[i]: return False
        save, board[r][c] = board[r][c], '#'
        found = (dfs(r+1, c, i+1) or dfs(r-1, c, i+1) or
                 dfs(r, c+1, i+1) or dfs(r, c-1, i+1))
        board[r][c] = save           # un-mark
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0): return True
    return False`,
        time: 'O(m · n · 4^L)', space: 'O(L)',
        why: 'Mutating the grid as a "visited" marker is the clean trick. Restore on return — that\'s the backtrack step.' },
      { title: 'Combination Sum — repeat-allowed picking', problemId: null,
        problem: 'Find all unique combinations of candidates that sum to target. Each can be used unlimited times.',
        approach: `<p>Sort candidates. At each step, try each candidate ≥ the last picked (to avoid duplicate combinations). Stop when target reaches 0; prune if it goes negative.</p>`,
        code: `def combination_sum(candidates, target):
    candidates.sort()
    result, path = [], []
    def backtrack(start, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining: break   # prune
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i])  # i, not i+1
            path.pop()
    backtrack(0, target)
    return result`,
        time: 'O(N^(target/min))', space: 'O(target/min)',
        why: 'The <code>start</code> parameter prevents duplicate combinations. Sorting + early break is the pruning that makes this practical.' }
    ],
    gotchas: [
      'Forgetting to un-choose. The state accumulates across siblings → wrong answers.',
      'Recording <code>path</code> directly (instead of <code>path[:]</code>) saves a reference — later mutations corrupt all your saved results.',
      'Pruning matters. Without it, even small inputs (n = 20) blow up. Sort + early break is often the simplest pruning.',
      'Don\'t mutate input data without restoring it — the un-choose for grid problems is restoring the grid cell.'
    ],
    videoSearch: 'backtracking algorithm neetcode',
    diagram: 'svgBacktracking', cardIcon: 'svgBacktrackingMini',
    code: { lang: 'Python', explain: 'Generate all subsets. choose → recurse → un-choose. The "pop" is the magic that makes it backtracking.',
snippet: `def subsets(nums):
    result, path = [], []

    def backtrack(i):
        if i == len(nums):
            result.append(path[:])      # snapshot
            return
        # choice 1: include nums[i]
        path.append(nums[i])
        backtrack(i + 1)
        path.pop()                       # UN-choose
        # choice 2: skip nums[i]
        backtrack(i + 1)

    backtrack(0)
    return result` },
    takeaways: [
      'Pattern: choose → explore → un-choose. The "un-choose" step is the key.',
      'Use cases: subsets, permutations, combinations, N-Queens, Word Search.',
      'Prune aggressively — skip branches that cannot lead to a valid answer.',
      'Time is usually O(2ⁿ) or O(n!) — branching factor matters more than depth.',
    ],
    practice: { type: 'problems', filter: { ds: 'Backtracking' }, label: 'Backtracking Problems' },
  },
  { id: 'dp', section: 'Patterns', title: 'Dynamic Programming', estMin: 22, capstone: true,
    summary: 'Solve subproblems once, cache the answers — turns exponential into polynomial. Save this for last — DP combines recursion, memoization, and pattern recognition from earlier topics.',
    details: [
      { heading: 'What it is', body: `<p>DP breaks a problem into <strong>overlapping subproblems</strong> and caches the solutions. The result: an exponential brute force becomes polynomial.</p>
<p>Two requirements:</p>
<p>• <strong>Optimal substructure</strong>: the answer to the big problem is built from answers to smaller versions.<br>• <strong>Overlapping subproblems</strong>: those smaller versions repeat across the recursion tree.</p>` },
      { heading: 'How it works', body: `<p><strong>Top-down (memoization)</strong>: write natural recursion, add a cache. The first call computes; later calls with the same arguments return the cached result. Easiest to write.</p>
<p><strong>Bottom-up (tabulation)</strong>: build a table from base cases up to the answer. Iterative, no recursion overhead, often more space-efficient. Slightly harder to write — you must figure out the iteration order.</p>
<p>The hardest part is <strong>state design</strong> — what minimum info defines a subproblem? Fibonacci: state is just <code>n</code>. LCS: state is <code>(i, j)</code> — positions in two strings. Unique Paths: state is <code>(row, col)</code>.</p>` },
      { heading: 'When to reach for it', body: `<p>"Find the optimal X" or "count the ways" with overlapping subproblems → DP.</p>
<p>Recognize the patterns:</p>
<p>• <strong>1D DP</strong>: dp[i] depends on dp[i−1] or dp[i−2]. Climbing Stairs, House Robber.<br>• <strong>2D DP</strong>: dp[i][j] depends on neighbors. Unique Paths, LCS, Edit Distance.<br>• <strong>Knapsack-style</strong>: dp[i][w] = best with first i items and weight ≤ w.<br>• <strong>State-machine DP</strong>: explicit states like "holding stock" vs "not holding."</p>
<p>Most 2D DPs only need the previous row → space optimize from O(m·n) to O(n).</p>` }
    ],
    lazyDetails: [
      { heading: '📝 Doing your homework once and reusing it',
        body: `<p>Your teacher assigns 100 homework problems. You notice that problem #50 secretly requires the answer to problem #20. So does #75. So does #90.</p>
<p>The lazy way: solve #20 once, write the answer on a sticky note, and just look at the sticky note any time you need it later.</p>
<p>That's Dynamic Programming. You break a big problem into smaller pieces, solve each piece ONCE, and stash the answer. Whenever the same piece comes up again, you grab the cached answer instead of redoing the work.</p>` },
      { heading: 'Why it works',
        body: `<p>Without caching, solving Fibonacci(30) takes about a million function calls — most of them recomputing the same subproblems. With caching, it takes 30 calls. That's the magic: turning exponential brute force into linear time.</p>
<p>The key word is "<strong>overlapping</strong>" subproblems. If your recursion keeps asking the same smaller question over and over, you should be caching.</p>` },
      { heading: 'Two ways to write it',
        body: `<p><strong>Top-down (memoization)</strong>: write the natural recursion, then add a dictionary that remembers answers. First time: compute, store. Next time: just return the stored answer.</p>
<p><strong>Bottom-up (tabulation)</strong>: skip recursion entirely. Make a table. Fill in the smallest cases first, then use those to fill bigger ones. Eventually you've built up to the answer.</p>
<p>Both give the same speed. Top-down is easier to write, bottom-up is usually more memory-efficient.</p>
<p>The HARD part is figuring out what to remember. Once you know "what's the smallest amount of info I need to keep about a subproblem?", the rest is mechanical.</p>` }
    ],
    examples: [
      { title: 'Climbing Stairs — 1D DP, like Fibonacci', problemId: 16,
        problem: 'You can climb 1 or 2 stairs at a time. Count distinct ways to reach the top of n stairs.',
        approach: `<p><code>dp[i] = dp[i−1] + dp[i−2]</code>: ways to reach step i = ways to reach (i−1) plus ways to reach (i−2). Base cases: <code>dp[0] = dp[1] = 1</code>. Only the last two values matter, so use two variables.</p>`,
        code: `def climb_stairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(n - 2):
        a, b = b, a + b
    return b`,
        time: 'O(n)', space: 'O(1)',
        why: 'The simplest DP — recognize the recurrence, then space-optimize to two variables.' },
      { title: 'House Robber — 1D DP with a choice per index', problemId: 22,
        problem: 'Pick non-adjacent house values to maximize the total robbed.',
        approach: `<p>At each house, two choices: rob it (add nums[i] + dp[i−2]) or skip it (dp[i−1]). Take the max.</p>`,
        code: `def rob(nums):
    prev2, prev1 = 0, 0
    for n in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + n)
    return prev1`,
        time: 'O(n)', space: 'O(1)',
        why: 'Two variables suffice. The "rob or skip" choice is the recurrence — write it before coding.' },
      { title: 'Coin Change — 1D DP, minimize coins', problemId: 17,
        problem: 'Minimum number of coins to make amount; return -1 if impossible.',
        approach: `<p><code>dp[a]</code> = min coins for amount a. <code>dp[a] = 1 + min(dp[a − coin])</code> over all coins. Base: <code>dp[0] = 0</code>.</p>`,
        code: `def coin_change(coins, amount):
    INF = float('inf')
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1`,
        time: 'O(amount · coins)', space: 'O(amount)',
        why: 'Greedy fails for arbitrary coin denominations — DP is required. The 1D table is enough.' },
      { title: 'Longest Common Subsequence — 2D DP', problemId: 19,
        problem: 'Length of the longest subsequence common to two strings.',
        approach: `<p><code>dp[i][j]</code> = LCS length of s1[:i] and s2[:j]. If chars match: <code>dp[i][j] = dp[i−1][j−1] + 1</code>. Else: <code>max(dp[i−1][j], dp[i][j−1])</code>.</p>`,
        code: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
        time: 'O(m · n)', space: 'O(m · n)',
        why: 'Classic 2D DP. The recurrence is simple once you recognize "match or skip one of the two."' }
    ],
    gotchas: [
      'State design is the hard part. If you can\'t define the state precisely, you can\'t write the recurrence.',
      'Off-by-one when indexing into a DP table that\'s 1-indexed (size n+1) vs the 0-indexed input.',
      'Forgetting base cases. <code>dp[0]</code> is usually special — write it down before the recurrence.',
      'Top-down recursion can stack overflow on large n. Convert to bottom-up if depth is a concern.',
      'Most 2D DPs only need the previous row. Always check for the O(n) → O(1) space optimization.'
    ],
    videoSearch: 'dynamic programming neetcode',
    diagram: 'svgDP', cardIcon: 'svgDPMini',
    code: { lang: 'Python', explain: 'Fibonacci two ways. Naive recursion is O(2ⁿ). Memoized top-down is O(n). Bottom-up tabulation also O(n) with O(1) space.',
snippet: `# Naive: O(2^n) — exponential, recomputes everything
def fib_slow(n):
    if n < 2: return n
    return fib_slow(n - 1) + fib_slow(n - 2)

# Memoized (top-down DP): O(n)
def fib_memo(n, cache={}):
    if n < 2: return n
    if n in cache: return cache[n]
    cache[n] = fib_memo(n - 1) + fib_memo(n - 2)
    return cache[n]

# Tabulated (bottom-up DP): O(n) time, O(1) space
def fib_tab(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a` },
    takeaways: [
      'Two requirements: optimal substructure + overlapping subproblems.',
      'Top-down (memoization): write the recursion, then cache results.',
      'Bottom-up (tabulation): build a table from base cases up.',
      'State design is the hardest part — identify what you actually need to remember.',
      'Most 2D tables only need the previous row — gives an O(n) → O(1) row optimization.',
    ],
    practice: { type: 'problems', filter: { category: 'Dynamic Programming' }, label: 'DP Problems' },
  },
  { id: 'greedy', section: 'Patterns', title: 'Greedy Algorithms', estMin: 10,
    summary: 'Make the locally best choice at each step — sometimes that gives the global optimum.',
    details: [
      { heading: 'What it is', body: `<p>A greedy algorithm makes the locally best choice at each step and never reconsiders. <strong>Sometimes this gives the global optimum; sometimes it doesn\'t.</strong> The hard part is knowing when greedy works.</p>` },
      { heading: 'How it works', body: `<p>To prove correctness, write down the <strong>exchange argument</strong>: if some optimal solution makes a different choice than the greedy one at step k, you can swap in the greedy choice without making it worse. If you can\'t construct that argument, your greedy probably fails.</p>
<p>When greedy fails, you typically fall back to DP. Coin Change with arbitrary denominations is the canonical counter-example: <code>{1, 3, 4}</code>, target 6 → greedy picks <code>4 + 1 + 1 = 3 coins</code>, but DP finds <code>3 + 3 = 2 coins</code>.</p>` },
      { heading: 'When to reach for it', body: `<p>Interval problems are the most common greedy: <strong>sort, then sweep</strong> with a smart tie-breaker.</p>
<p>"Reach as far as possible" or "track the furthest" problems (Jump Game).</p>
<p>Quick test: construct a small adversarial example. If greedy fails on small input, it fails in general — switch to DP.</p>` }
    ],
    examples: [
      { title: 'Jump Game — track the furthest reach', problemId: 26,
        problem: 'Given an array of max-jump-lengths, can you reach the last index?',
        approach: `<p>Walk left to right, tracking the furthest index reachable so far. If at any point i &gt; furthest, you can\'t get there — return false.</p>`,
        code: `def can_jump(nums):
    furthest = 0
    for i, jump in enumerate(nums):
        if i > furthest: return False
        furthest = max(furthest, i + jump)
    return True`,
        time: 'O(n)', space: 'O(1)',
        why: 'You don\'t need to enumerate all paths. The single value <code>furthest</code> captures everything. That\'s the greedy insight.' },
      { title: 'Non-overlapping Intervals — sort by end, keep earliest finishers', problemId: 37,
        problem: 'Min number of intervals to remove so the rest don\'t overlap.',
        approach: `<p>Sort by end time. Greedily keep the earliest-finishing interval. Any later interval that starts before the kept one\'s end conflicts → remove it.</p>`,
        code: `def erase_overlap(intervals):
    intervals.sort(key=lambda x: x[1])
    end, removed = float('-inf'), 0
    for s, e in intervals:
        if s >= end: end = e
        else:        removed += 1
    return removed`,
        time: 'O(n log n)', space: 'O(1)',
        why: 'Sort by END, not start. Keeping the earliest finisher leaves the most room for future picks.' },
      { title: 'Best Time to Buy and Sell Stock — running min', problemId: 2,
        problem: 'Maximize profit from buying then selling once.',
        approach: `<p>Track the minimum price seen so far. The best profit ending today is <code>price − minSoFar</code>. Linear, O(1) space.</p>`,
        code: `def max_profit(prices):
    min_price = float('inf')
    best = 0
    for p in prices:
        min_price = min(min_price, p)
        best = max(best, p - min_price)
    return best`,
        time: 'O(n)', space: 'O(1)',
        why: 'Greedy + running aggregate. You never need to look at any earlier day except the cheapest.' }
    ],
    gotchas: [
      'Greedy doesn\'t always work. If you can\'t make an exchange argument, try a small counter-example before committing.',
      'Sort by start vs sort by end — they give different greedy answers. Pick based on the problem.',
      'Greedy with a tiebreaker is still greedy. Sometimes the tiebreaker is the actual cleverness.',
      'When greedy fails, DP is usually the answer. Coin Change with arbitrary denominations is the textbook example.'
    ],
    videoSearch: 'greedy algorithm neetcode',
    diagram: 'svgGreedy', cardIcon: 'svgGreedyMini',
    takeaways: [
      'Faster than DP, but only works when local choices lead to a global optimum.',
      'Common with intervals: pick by end-time, by start-time, or by length.',
      'Examples in Blind 75: Jump Game (max reach), Non-overlapping Intervals.',
      'Always justify *why* the greedy choice is safe — the exchange argument.',
    ],
    practice: { type: 'problems', filter: { ds: 'Greedy' }, label: 'Greedy Problems' },
  },
  // ── Advanced (Hard-tier) topics ─────────────────────────────────────────
  { id: 'monotonic-deque', section: 'Patterns', title: 'Monotonic Deque', estMin: 12, advanced: true,
    summary: 'A deque kept in monotonic order — the canonical structure for sliding-window maximum.',
    videoSearch: 'monotonic deque sliding window maximum neetcode',
    diagram: 'svgMonotonicDeque', cardIcon: 'svgMonotonicDequeMini',
    details: [
      { heading: 'What it is', body: `<p>A deque (double-ended queue) whose values are kept in monotonic order — strictly increasing or decreasing — by popping anything that violates the order before pushing.</p>
<p>The key property: at any moment, the front of the deque holds the current best (max or min) of a moving window.</p>` },
      { heading: 'How it works', body: `<p>To find max in a sliding window: maintain a <strong>decreasing</strong> deque of indices. Before pushing index i, pop from the back while <code>arr[back] ≤ arr[i]</code> (those will never be max while arr[i] is in the window). Pop from the front if it falls out of the window.</p>
<p>Each index is pushed once and popped once → total <code>O(n)</code>. The trick: you discard candidates that are dominated.</p>` },
      { heading: 'When to reach for it', body: `<p>"Sliding window max/min" or any "best in last k" problem. Also surfaces in Shortest Subarray with Sum at Least K (using a monotonic deque on prefix sums).</p>
<p>If you\'d reach for a heap, ask: "do entries fall out of relevance over time?" If yes, monotonic deque often gives <code>O(n)</code> instead of the heap\'s <code>O(n log n)</code>.</p>` }
    ],
    examples: [
      { title: 'Sliding Window Maximum — the canonical use', problemId: null,
        problem: 'For each window of size k as it slides across the array, return the maximum.',
        approach: `<p>Decreasing deque of indices. For each new i: pop the front if it\'s out of window (i − k); pop from back while <code>arr[back] ≤ arr[i]</code>; push i. Once i ≥ k − 1, record <code>arr[deque[0]]</code>.</p>`,
        code: `from collections import deque
def max_sliding_window(nums, k):
    dq, out = deque(), []
    for i, n in enumerate(nums):
        while dq and dq[0] <= i - k:
            dq.popleft()
        while dq and nums[dq[-1]] <= n:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            out.append(nums[dq[0]])
    return out`,
        time: 'O(n)', space: 'O(k)',
        why: 'A heap-based solution is O(n log k); the deque is strictly better here.' },
      { title: 'Shortest Subarray with Sum ≥ K — monotonic deque on prefix sums', problemId: null,
        problem: 'Find the length of the shortest contiguous subarray whose sum is ≥ K. Array can have negatives.',
        approach: `<p>Compute prefix sums. Maintain an <strong>increasing</strong> deque of prefix indices. For each j: while prefix[j] − prefix[front] ≥ K, that\'s a valid pair — record length j − front and pop front. Then pop from back while prefix[back] ≥ prefix[j] (back can never be a useful left-end if we have a smaller one).</p>`,
        code: `from collections import deque
def shortest_subarray(nums, k):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i, x in enumerate(nums): prefix[i+1] = prefix[i] + x
    dq = deque()
    best = n + 1
    for j in range(n + 1):
        while dq and prefix[j] - prefix[dq[0]] >= k:
            best = min(best, j - dq.popleft())
        while dq and prefix[dq[-1]] >= prefix[j]:
            dq.pop()
        dq.append(j)
    return best if best <= n else -1`,
        time: 'O(n)', space: 'O(n)',
        why: 'Hard-tier classic. Sliding window alone fails because of negatives — monotonic deque on prefix sums handles them.' }
    ],
    gotchas: [
      'You\'re storing <strong>indices</strong>, not values, so you can compare positions to detect "out of window."',
      'Pop the front (window-falloff) BEFORE pushing the new index — otherwise the new element can be popped immediately.',
      'For min instead of max, flip the comparison when popping the back.',
      'Don\'t use a Python <code>list</code> — popping from the front is O(n). Use <code>collections.deque</code>.'
    ],
    practice: { type: 'problems', filter: { ds: 'Sliding Window' }, label: 'Sliding Window Problems' },
  },
  { id: 'segment-tree', section: 'Data Structures', title: 'Segment Trees', estMin: 18, advanced: true,
    summary: 'Range queries + point updates in O(log n) — the heavy machinery of competitive programming.',
    videoSearch: 'segment tree william fiset',
    diagram: 'svgSegmentTree', cardIcon: 'svgSegmentTreeMini',
    details: [
      { heading: 'What it is', body: `<p>A binary tree where each node stores an aggregate (sum, min, max, gcd, etc.) over a range of the input array. Leaves correspond to single elements; internal nodes to combined ranges.</p>
<p>Both <strong>range queries</strong> and <strong>point updates</strong> run in <code>O(log n)</code>. With lazy propagation, range updates are also <code>O(log n)</code>.</p>` },
      { heading: 'How it works', body: `<p>Stored as an array of size ~4n. Build recursively: leaf = single element; internal = combine(left child, right child). Query: traverse the relevant subtree, combining contributions of nodes whose range fully sits inside the query range. Update: walk down to the leaf, then re-combine on the way back up.</p>
<p>For a Fenwick (Binary Indexed) tree variant: simpler code, less generic, only supports prefix-aggregable operations like sum.</p>` },
      { heading: 'When to reach for it', body: `<p>If a problem mixes <strong>range queries with mutations</strong> on the same data, segment tree is the answer. Examples: Range Sum with point updates, Range Minimum Query with updates, Counting Smaller Numbers After Self.</p>
<p>If you only need range queries on an <em>immutable</em> array, use prefix sums instead — they\'re simpler and faster.</p>` }
    ],
    examples: [
      { title: 'Range Sum with point updates', problemId: null,
        problem: 'Support sumRange(L, R) and update(i, val) on an array of size n.',
        approach: `<p>Build a segment tree where each node stores the sum of its range. Query sums up the contributions of nodes that lie fully inside [L, R]. Update walks to the leaf, then re-sums the path back up.</p>`,
        code: `class SegTree:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [0] * (4 * self.n)
        self._build(0, 0, self.n - 1, nums)

    def _build(self, node, l, r, nums):
        if l == r:
            self.tree[node] = nums[l]; return
        mid = (l + r) // 2
        self._build(2*node+1, l, mid, nums)
        self._build(2*node+2, mid+1, r, nums)
        self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]

    def update(self, i, val, node=0, l=0, r=None):
        if r is None: r = self.n - 1
        if l == r:
            self.tree[node] = val; return
        mid = (l + r) // 2
        if i <= mid: self.update(i, val, 2*node+1, l, mid)
        else:        self.update(i, val, 2*node+2, mid+1, r)
        self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]

    def query(self, ql, qr, node=0, l=0, r=None):
        if r is None: r = self.n - 1
        if qr < l or ql > r: return 0
        if ql <= l and r <= qr: return self.tree[node]
        mid = (l + r) // 2
        return (self.query(ql, qr, 2*node+1, l, mid) +
                self.query(ql, qr, 2*node+2, mid+1, r))`,
        time: 'O(log n) per op', space: 'O(n)',
        why: 'The base of all advanced range-query problems. Master this; the variants (min, max, gcd) follow the same structure.' }
    ],
    gotchas: [
      'Tree array size is 4n (not 2n) to be safe for non-power-of-two n.',
      'Off-by-one in the [l, r] range vs (l, r] vs [l, r). Pick a convention and stick with it.',
      'Lazy propagation is needed for range updates — without it, range updates are O(n log n).',
      'For prefix-only operations like sum, a Fenwick tree is shorter and faster (constant factors).'
    ],
    practice: { type: 'problems', filter: { ds: 'Array' }, label: 'Range-Query Problems' },
  },
  { id: 'kmp', section: 'Patterns', title: 'KMP Pattern Matching', estMin: 16, advanced: true,
    summary: 'String matching in O(|T| + |P|) by precomputing where to resume after a mismatch.',
    videoSearch: 'kmp algorithm abdul bari',
    diagram: 'svgKMP', cardIcon: 'svgKMPMini',
    details: [
      { heading: 'What it is', body: `<p>Knuth-Morris-Pratt searches for a pattern P inside a text T in <code>O(|T| + |P|)</code> time, never re-examining text characters. The trick: precompute a <strong>failure function</strong> (also called LPS — longest proper prefix that is also a suffix) for the pattern.</p>` },
      { heading: 'How it works', body: `<p>The LPS array tells you, on a mismatch at pattern index j, how far back you can resume the pattern without rewinding the text. <code>LPS[j]</code> = length of the longest proper prefix of P[0..j] that is also a suffix.</p>
<p>The match phase walks the text once. On mismatch, jump j to <code>LPS[j-1]</code>. The text index never decreases — that\'s why it\'s linear.</p>` },
      { heading: 'When to reach for it', body: `<p>"Find pattern in text" with large inputs. Also: Repeated Substring Pattern, Longest Happy Prefix, Shortest Palindrome (KMP on a clever string).</p>
<p>Brute-force string search is <code>O(|T|·|P|)</code> — fine for short patterns, painful for long ones.</p>` }
    ],
    examples: [
      { title: 'Find Pattern in Text — full KMP', problemId: null,
        problem: 'Return the first index where pattern occurs in text, or -1.',
        approach: `<p>Step 1: build LPS array for the pattern. Step 2: walk text and pattern with two indices; on mismatch, fall back via LPS instead of rewinding text.</p>`,
        code: `def kmp_search(text, pattern):
    if not pattern: return 0
    # build LPS
    lps = [0] * len(pattern)
    k = 0
    for i in range(1, len(pattern)):
        while k > 0 and pattern[k] != pattern[i]:
            k = lps[k - 1]
        if pattern[k] == pattern[i]:
            k += 1
        lps[i] = k
    # search
    j = 0
    for i in range(len(text)):
        while j > 0 and pattern[j] != text[i]:
            j = lps[j - 1]
        if pattern[j] == text[i]:
            j += 1
        if j == len(pattern):
            return i - j + 1
    return -1`,
        time: 'O(|T| + |P|)', space: 'O(|P|)',
        why: 'A staple of competitive programming. Often appears in Hard problems where the obvious O(n²) is too slow.' }
    ],
    gotchas: [
      'LPS is "longest <em>proper</em> prefix" — proper means strictly shorter than the string itself.',
      'The "while" inside both LPS-build and search is necessary, not just an "if" — multiple fallbacks may chain.',
      'Z-algorithm is an alternative with similar complexity and arguably cleaner semantics. Pick one and master it.',
      'For small patterns (|P| < ~20), brute force is faster in practice due to constant factors.'
    ],
    practice: { type: 'problems', filter: { category: 'String' }, label: 'String Problems' },
  },
  { id: 'line-sweep', section: 'Patterns', title: 'Line Sweep / Difference Array', estMin: 12, advanced: true,
    summary: 'Process events in sorted order — a clean linear pass once events are sorted.',
    videoSearch: 'line sweep algorithm neetcode',
    diagram: 'svgLineSweep', cardIcon: 'svgLineSweepMini',
    details: [
      { heading: 'What it is', body: `<p>Line sweep treats interval problems as a <strong>stream of events</strong>: each interval [s, e] becomes a +1 event at s and a −1 event at e. Sort events; sweep with a running counter.</p>
<p>The <strong>difference array</strong> is the discrete cousin: for range updates of the same delta, increment <code>diff[s]</code> and decrement <code>diff[e+1]</code>; final values come from the prefix sum.</p>` },
      { heading: 'How it works', body: `<p>Sort events by coordinate (with a tiebreaker — usually starts before ends). Walk through. At each event, update the active count. Track max-active-at-any-time, or read out per-coordinate.</p>
<p>For point queries on range updates: difference array → range update is O(1) per range, then one O(n) prefix-sum pass to materialize.</p>` },
      { heading: 'When to reach for it', body: `<p>"Maximum overlap of intervals," "minimum rooms," "concurrent meetings," "skyline" problems. Also any problem where you do many range-add operations and ask for final values once.</p>
<p>Line sweep is often a cleaner alternative to a min-heap of end times — same complexity, simpler code.</p>` }
    ],
    examples: [
      { title: 'Meeting Rooms II — peak concurrent count', problemId: 39,
        problem: 'Find the minimum number of meeting rooms needed for a list of meetings.',
        approach: `<p>For each meeting [s, e], create events (s, +1) and (e, −1). Sort by time (with end before start on ties so a meeting ending at t doesn\'t conflict with one starting at t). Sweep, track max running sum.</p>`,
        code: `def min_meeting_rooms(intervals):
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e, -1))
    events.sort()  # tie: -1 before +1 because -1 < 1
    rooms = peak = 0
    for _, delta in events:
        rooms += delta
        peak = max(peak, rooms)
    return peak`,
        time: 'O(n log n)', space: 'O(n)',
        why: 'Heap-based solution is O(n log n) too but slightly more code. Line sweep is the "cleaner" answer.' },
      { title: 'Range Addition — difference array', problemId: null,
        problem: 'Apply many [start, end, value] additions to an array; return the final array.',
        approach: `<p>Difference array: for each (s, e, v), do <code>diff[s] += v</code> and <code>diff[e+1] -= v</code>. Total update work: O(1) per range. Final pass: prefix sum gives the answer.</p>`,
        code: `def get_modified_array(length, updates):
    diff = [0] * (length + 1)
    for s, e, v in updates:
        diff[s] += v
        diff[e + 1] -= v
    out = [0] * length
    running = 0
    for i in range(length):
        running += diff[i]
        out[i] = running
    return out`,
        time: 'O(n + u)', space: 'O(n)',
        why: 'A naive solution applies each update directly: O(n × u). Difference array reduces it to O(n + u).' }
    ],
    gotchas: [
      'Tie-breaking on sort matters. "End before start at same time" or "start before end" — pick based on problem semantics (does an interval end inclusive or exclusive?).',
      'Difference array uses <code>diff[e+1] -= v</code> for inclusive ranges. <code>diff[e] -= v</code> for exclusive.',
      'For 2D range updates, use 2D difference arrays — same idea, just two dimensions.',
      'Don\'t confuse with prefix sum (which is for queries on immutable data). Difference array is for batch updates → final state.'
    ],
    practice: { type: 'problems', filter: { category: 'Interval' }, label: 'Interval Problems' },
  },
];

