// ── Sorting reference data ─────────────────────────────────────────────────
const SORTING_ALGOS = [
  {
    id: 'merge', name: 'Merge Sort', group: 'O(n log n)', mustKnow: true,
    summary: 'Divide-and-conquer: split the array in half recursively, then merge sorted halves.',
    keyIdea: 'The merge step is the workhorse — two sorted halves can be merged in O(n) by comparing front elements.',
    whenToUse: 'When stability matters or you need guaranteed O(n log n). Default choice for sorting linked lists.',
    timeAvg: 'O(n log n)', timeWorst: 'O(n log n)', timeBest: 'O(n log n)',
    space: 'O(n)', stable: true,
    pseudocode: `function mergeSort(arr):
  if len(arr) <= 1: return arr
  mid = len(arr) // 2
  left  = mergeSort(arr[:mid])
  right = mergeSort(arr[mid:])
  return merge(left, right)

function merge(L, R):
  result = []
  i = j = 0
  while i < len(L) and j < len(R):
    if L[i] <= R[j]: result.append(L[i]); i++
    else:            result.append(R[j]); j++
  return result + L[i:] + R[j:]`
  },
  {
    id: 'quick', name: 'Quick Sort', group: 'O(n log n)', mustKnow: true,
    summary: 'Pick a pivot, partition the array so smaller elements go left and larger go right, recurse.',
    keyIdea: 'Partition is in-place and O(n). Choosing a good pivot (random or median-of-three) avoids the O(n²) worst case.',
    whenToUse: 'Best average-case performance and cache-friendly. Preferred for general-purpose in-place sorting.',
    timeAvg: 'O(n log n)', timeWorst: 'O(n²)', timeBest: 'O(n log n)',
    space: 'O(log n)', stable: false,
    pseudocode: `function quickSort(arr, lo, hi):
  if lo < hi:
    p = partition(arr, lo, hi)
    quickSort(arr, lo, p - 1)
    quickSort(arr, p + 1, hi)

function partition(arr, lo, hi):
  pivot = arr[hi]
  i = lo - 1
  for j = lo to hi - 1:
    if arr[j] <= pivot:
      i++; swap(arr[i], arr[j])
  swap(arr[i+1], arr[hi])
  return i + 1`
  },
  {
    id: 'heap', name: 'Heap Sort', group: 'O(n log n)', mustKnow: false,
    summary: 'Build a max-heap, then repeatedly extract the max element to sort in place.',
    keyIdea: 'Build the heap in O(n) using Floyd\'s bottom-up algorithm. Each extraction is O(log n).',
    whenToUse: 'When you need guaranteed O(n log n) worst case AND O(1) space. Less cache-friendly than quick sort.',
    timeAvg: 'O(n log n)', timeWorst: 'O(n log n)', timeBest: 'O(n log n)',
    space: 'O(1)', stable: false,
    pseudocode: `function heapSort(arr):
  n = len(arr)
  // Build max-heap (Floyd's algorithm)
  for i = n//2 - 1 down to 0:
    heapify(arr, n, i)
  // Extract elements one by one
  for i = n - 1 down to 1:
    swap(arr[0], arr[i])
    heapify(arr, i, 0)

function heapify(arr, n, i):
  largest = i
  l, r = 2*i + 1, 2*i + 2
  if l < n and arr[l] > arr[largest]: largest = l
  if r < n and arr[r] > arr[largest]: largest = r
  if largest != i:
    swap(arr[i], arr[largest])
    heapify(arr, n, largest)`
  },
  {
    id: 'insertion', name: 'Insertion Sort', group: 'O(n²)', mustKnow: true,
    summary: 'Build the sorted portion one element at a time by inserting each new element into its correct position.',
    keyIdea: 'O(n) best case on nearly-sorted data — each element only shifts a small amount. Used as the base case in Timsort.',
    whenToUse: 'Small arrays (n < 20), nearly-sorted data, or as a subroutine in hybrid sorts.',
    timeAvg: 'O(n²)', timeWorst: 'O(n²)', timeBest: 'O(n)',
    space: 'O(1)', stable: true,
    pseudocode: `function insertionSort(arr):
  for i = 1 to len(arr) - 1:
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j + 1] = arr[j]
      j--
    arr[j + 1] = key`
  },
  {
    id: 'selection', name: 'Selection Sort', group: 'O(n²)', mustKnow: true,
    summary: 'Find the minimum of the unsorted portion, swap it to the front, advance the boundary.',
    keyIdea: 'Always makes exactly n-1 swaps, regardless of input. Useful when writes (swaps) are expensive.',
    whenToUse: 'When minimizing the number of swaps matters more than total comparisons. Rarely used in practice.',
    timeAvg: 'O(n²)', timeWorst: 'O(n²)', timeBest: 'O(n²)',
    space: 'O(1)', stable: false,
    pseudocode: `function selectionSort(arr):
  n = len(arr)
  for i = 0 to n - 2:
    minIdx = i
    for j = i + 1 to n - 1:
      if arr[j] < arr[minIdx]:
        minIdx = j
    swap(arr[i], arr[minIdx])`
  },
];

const SORTING_QUESTIONS = [
  { id:'sort_q0', question:'Which two sorting algorithms are stable (preserve relative order of equal elements)?',
    options:['Merge Sort and Insertion Sort','Quick Sort and Heap Sort','Heap Sort and Selection Sort','Quick Sort and Merge Sort'],
    answer:0, explanation:'Merge Sort and Insertion Sort are stable. Quick Sort and Heap Sort are not — they swap non-adjacent elements.' },
  { id:'sort_q1', question:'Which O(n log n) sort uses only O(1) auxiliary space?',
    options:['Merge Sort','Quick Sort','Heap Sort','None of them'],
    answer:2, explanation:'Heap Sort sorts in place. Merge Sort needs O(n), Quick Sort needs O(log n) for the call stack.' },
  { id:'sort_q2', question:'When does Quick Sort hit its O(n²) worst case?',
    options:['When the input is random','When the pivot is always the min or max element','When the array has duplicates','When n is small'],
    answer:1, explanation:'A bad pivot (e.g., last-element pivot on already-sorted input) makes one partition empty, giving n levels of O(n) work.' },
  { id:'sort_q3', question:'Which sort runs in O(n) on a nearly-sorted array?',
    options:['Heap Sort','Selection Sort','Insertion Sort','Quick Sort'],
    answer:2, explanation:'Insertion Sort\'s inner while-loop exits early when elements are nearly in place — best case O(n).' },
  { id:'sort_q4', question:'Which sort makes exactly n−1 swaps regardless of input?',
    options:['Bubble Sort','Selection Sort','Insertion Sort','Merge Sort'],
    answer:1, explanation:'Selection Sort swaps the minimum into position once per outer iteration: exactly n−1 total swaps.' },
  { id:'sort_q5', question:'Why does Merge Sort need O(n) extra space?',
    options:['For the recursion call stack','For the temporary buffer used during merging','For the pivot selection','To track sorted boundaries'],
    answer:1, explanation:'The merge step needs an auxiliary array. The call stack is only O(log n).' },
  { id:'sort_q6', question:'What sorting algorithm do Python\'s sorted() and modern JavaScript engines use?',
    options:['Quick Sort','Heap Sort','Timsort (hybrid of Merge + Insertion)','Radix Sort'],
    answer:2, explanation:'Timsort combines Merge Sort\'s reliability with Insertion Sort\'s speed on small/sorted runs. It is stable.' },
  { id:'sort_q7', question:'Which is true about Heap Sort?',
    options:['Stable, O(n) space','Unstable, O(1) space','Stable, O(log n) space','Unstable, O(n) space'],
    answer:1, explanation:'In-place (O(1) space) but unstable — swapping non-adjacent elements during heapify breaks stability.' },
  { id:'sort_q8', question:'You need to sort a large linked list. Best choice?',
    options:['Quick Sort','Heap Sort','Merge Sort','Insertion Sort'],
    answer:2, explanation:'Merge Sort works naturally on linked lists — splitting and merging only need pointer manipulation, no random access.' },
  { id:'sort_q9', question:'For n = 10,000, roughly how much faster is O(n log n) than O(n²)?',
    options:['~10x faster','~100x faster','~750x faster','~10,000x faster'],
    answer:2, explanation:'n² = 100,000,000 vs n log₂ n ≈ 133,000 → about 750× fewer operations.' },
];

