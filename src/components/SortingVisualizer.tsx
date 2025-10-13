import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { ArrowUpDown, Code, Play, Pause, RotateCcw } from "lucide-react"
import ZoomableArrayCanvas from "./ZoomableArrayCanvas"

interface SortingVisualizerProps {
  algorithm: string
  inputArray: string
}

interface Step {
  array: number[]
  description: string
  code: string
  comparing?: number[]
  swapping?: number[]
  sorted?: number[]
  pivot?: number
}

interface SortResult {
  comparisons: number
  swaps: number
  steps: number
}

const bubbleSort = (arr: number[], steps: Step[]): Step[] => {
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let swapped = false

    steps.push({
      array: [...arr],
      description: `Pass ${i + 1}: Starting bubble sort pass`,
      code: `// Pass ${i + 1}\nfor (let j = 0; j < ${n - i - 1}; j++) {`,
    })

    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        description: `Comparing elements at positions ${j} and ${j + 1}: ${arr[j]} and ${arr[j + 1]}`,
        code: `if (arr[${j}] > arr[${j + 1}]) {\n  // ${arr[j]} > ${arr[j + 1]} is ${arr[j] > arr[j + 1]}\n}`,
        comparing: [j, j + 1],
      })

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true

        steps.push({
          array: [...arr],
          description: `Swapped ${arr[j]} and ${arr[j + 1]} because ${arr[j + 1]} < ${arr[j]}`,
          code: `// Swap elements\n[arr[${j}], arr[${j + 1}]] = [arr[${j + 1}], arr[${j}]];`,
          swapping: [j, j + 1],
        })
      }
    }

    if (!swapped) {
      steps.push({
        array: [...arr],
        description: `No swaps in this pass - array is sorted!`,
        code: `// No swaps occurred, array is sorted\nbreak;`,
      })
      break
    }
  }

  steps.push({
    array: [...arr],
    description: `Sorting complete! Final sorted array: [${arr.join(", ")}]`,
    code: `// Bubble sort completed\n// Final array: [${arr.join(", ")}]`,
    sorted: Array.from({ length: arr.length }, (_, i) => i),
  })

  return steps
}

const selectionSort = (arr: number[], steps: Step[]): Step[] => {
  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    steps.push({
      array: [...arr],
      description: `Pass ${i + 1}: Finding minimum element in unsorted portion`,
      code: `// Pass ${i + 1}\nlet minIdx = ${i};\nlet minValue = arr[${i}]; // ${arr[i]}`,
    })

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        description: `Comparing arr[${minIdx}] = ${arr[minIdx]} with arr[${j}] = ${arr[j]}`,
        code: `if (arr[${j}] < arr[${minIdx}]) {\n  // ${arr[j]} < ${arr[minIdx]} is ${arr[j] < arr[minIdx]}\n}`,
        comparing: [minIdx, j],
      })

      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({
          array: [...arr],
          description: `New minimum found: ${arr[j]} at position ${j}`,
          code: `minIdx = ${j}; // New minimum: ${arr[j]}`,
        })
      }
    }

    if (minIdx !== i) {
      steps.push({
        array: [...arr],
        description: `Swapping arr[${i}] = ${arr[i]} with arr[${minIdx}] = ${arr[minIdx]}`,
        code: `// Swap minimum with first unsorted element\n[arr[${i}], arr[${minIdx}]] = [arr[${minIdx}], arr[${i}]];`,
        swapping: [i, minIdx],
      })
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
    }

    steps.push({
      array: [...arr],
      description: `Position ${i} is now sorted with value ${arr[i]}`,
      code: `// Position ${i} is now in correct place`,
      sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
    })
  }

  steps.push({
    array: [...arr],
    description: `Selection sort complete! Final array: [${arr.join(", ")}]`,
    code: `// Selection sort completed\n// Final array: [${arr.join(", ")}]`,
    sorted: Array.from({ length: arr.length }, (_, i) => i),
  })

  return steps
}

const insertionSort = (arr: number[], steps: Step[]): Step[] => {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]
    let j = i - 1

    steps.push({
      array: [...arr],
      description: `Pass ${i}: Inserting ${key} into sorted portion`,
      code: `// Pass ${i}\nlet key = arr[${i}]; // ${key}\nlet j = ${i - 1};`,
      comparing: [i],
    })

    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr],
        description: `Comparing ${arr[j]} with ${key}. Since ${arr[j]} > ${key}, shift ${arr[j]} right`,
        code: `while (j >= 0 && arr[j] > key) {\n  arr[j + 1] = arr[j]; // Shift ${arr[j]} right\n  j--;\n}`,
        comparing: [j, j + 1],
      })

      arr[j + 1] = arr[j]
      j--

      steps.push({
        array: [...arr],
        description: `Shifted element right, continue checking position ${j >= 0 ? j : "none"}`,
        code: `// Element shifted, j = ${j}`,
      })
    }

    arr[j + 1] = key

    steps.push({
      array: [...arr],
      description: `Inserted ${key} at position ${j + 1}`,
      code: `arr[${j + 1}] = key; // Insert ${key}`,
      sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
    })
  }

  steps.push({
    array: [...arr],
    description: `Insertion sort complete! Final array: [${arr.join(", ")}]`,
    code: `// Insertion sort completed\n// Final array: [${arr.join(", ")}]`,
    sorted: Array.from({ length: arr.length }, (_, i) => i),
  })

  return steps
}

const mergeSort = (arr: number[], steps: Step[]): Step[] => {
  const mergeSortHelper = (arr: number[], left: number, right: number, depth = 0): void => {
    if (left >= right) return

    const mid = Math.floor((left + right) / 2)

    steps.push({
      array: [...arr],
      description: `Divide: Splitting array from index ${left} to ${right} at middle ${mid}`,
      code: `// Divide phase (depth ${depth})\nlet mid = Math.floor((${left} + ${right}) / 2); // ${mid}`,
      pivot: mid,
      comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i).filter(idx => idx !== mid),
    })

    mergeSortHelper(arr, left, mid, depth + 1)
    mergeSortHelper(arr, mid + 1, right, depth + 1)

    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)

    steps.push({
      array: [...arr],
      description: `Merge: Combining [${leftArr.join(", ")}] and [${rightArr.join(", ")}]`,
      code: `// Merge phase\nleft = [${leftArr.join(", ")}]\nright = [${rightArr.join(", ")}]`,
      comparing: Array.from({ length: leftArr.length }, (_, i) => left + i).concat(Array.from({ length: rightArr.length }, (_, i) => mid + 1 + i)),
    })

    let i = 0,
      j = 0,
      k = left

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        steps.push({
          array: [...arr],
          description: `${leftArr[i]} ≤ ${rightArr[j]}, so place ${leftArr[i]} at position ${k}`,
          code: `arr[${k}] = ${leftArr[i]}; // ${leftArr[i]} ≤ ${rightArr[j]}`,
          sorted: [k + i],
        })
        i++
      } else {
        arr[k] = rightArr[j]
        steps.push({
          array: [...arr],
          description: `${rightArr[j]} < ${leftArr[i]}, so place ${rightArr[j]} at position ${k}`,
          code: `arr[${k}] = ${rightArr[j]}; // ${rightArr[j]} < ${leftArr[i]}`,
          sorted: [k + i],
        })
        j++
      }
      k++
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      steps.push({
        array: [...arr],
        description: `Copy remaining element ${leftArr[i]} to position ${k}`,
        code: `arr[${k}] = ${leftArr[i]}; // Copy remaining`,
        sorted: Array.from({ length: k + 1 }, (_, idx) => idx).filter(idx => idx >= left),
      })
      i++
      k++
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      steps.push({
        array: [...arr],
        description: `Copy remaining element ${rightArr[j]} to position ${k}`,
        code: `arr[${k}] = ${rightArr[j]}; // Copy remaining`,
        sorted: Array.from({ length: k + 1 }, (_, idx) => idx).filter(idx => idx >= mid + 1),
      })
      j++
      k++
    }
  }

  mergeSortHelper(arr, 0, arr.length - 1)

  steps.push({
    array: [...arr],
    description: `Merge sort complete! Final array: [${arr.join(", ")}]`,
    code: `// Merge sort completed\n// Final array: [${arr.join(", ")}]`,
    sorted: Array.from({ length: arr.length }, (_, i) => i),
  })

  return steps
}

const quickSort = (arr: number[], steps: Step[]): Step[] => {
  const quickSortHelper = (arr: number[], low: number, high: number, depth = 0): void => {
    if (low < high) {
      steps.push({
        array: [...arr],
        description: `Partitioning array from index ${low} to ${high}`,
        code: `// Quick sort (depth ${depth})\n// Partition from ${low} to ${high}`,
      })

      const pi = partition(arr, low, high)

      steps.push({
        array: [...arr],
        description: `Pivot ${arr[pi]} is now in correct position ${pi}`,
        code: `// Pivot ${arr[pi]} placed at position ${pi}`,
        pivot: pi,
      })

      quickSortHelper(arr, low, pi - 1, depth + 1)
      quickSortHelper(arr, pi + 1, high, depth + 1)
    }
  }

  const partition = (arr: number[], low: number, high: number): number => {
    const pivot = arr[high]
    let i = low - 1

    steps.push({
      array: [...arr],
      description: `Choosing pivot: ${pivot} (last element)`,
      code: `let pivot = arr[${high}]; // ${pivot}\nlet i = ${low - 1};`,
      pivot: high,
    })

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        description: `Comparing ${arr[j]} with pivot ${pivot}`,
        code: `if (arr[${j}] <= pivot) {\n  // ${arr[j]} <= ${pivot} is ${arr[j] <= pivot}\n}`,
        comparing: [j, high],
      })

      if (arr[j] <= pivot) {
        i++
        if (i !== j) {
          steps.push({
            array: [...arr],
            description: `${arr[j]} ≤ ${pivot}, so swap arr[${i}] and arr[${j}]`,
            code: `i++; // i = ${i}\n[arr[${i}], arr[${j}]] = [arr[${j}], arr[${i}]];`,
            swapping: [i, j],
          })
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
        } else {
          steps.push({
            array: [...arr],
            description: `${arr[j]} ≤ ${pivot}, no swap needed`,
            code: `i++; // i = ${i}`,
          })
        }
      }
    }

    steps.push({
      array: [...arr],
      description: `Place pivot ${pivot} in correct position by swapping with arr[${i + 1}]`,
      code: `[arr[${i + 1}], arr[${high}]] = [arr[${high}], arr[${i + 1}]];`,
      swapping: [i + 1, high],
    })
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    return i + 1
  }

  quickSortHelper(arr, 0, arr.length - 1)

  steps.push({
    array: [...arr],
    description: `Quick sort complete! Final array: [${arr.join(", ")}]`,
    code: `// Quick sort completed\n// Final array: [${arr.join(", ")}]`,
    sorted: Array.from({ length: arr.length }, (_, i) => i),
  })

  return steps
}

const heapSort = (arr: number[], steps: Step[]): Step[] => {
  const n = arr.length

  steps.push({
    array: [...arr],
    description: `Building max heap from array`,
    code: `// Build max heap\n// Start from last non-leaf node`,
  })

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, steps)
  }

  steps.push({
    array: [...arr],
    description: `Max heap built: [${arr.join(", ")}]`,
    code: `// Max heap construction complete`,
  })

  for (let i = n - 1; i > 0; i--) {
    steps.push({
      array: [...arr],
      description: `Move current root ${arr[0]} to end (position ${i})`,
      code: `// Move root to end\n[arr[0], arr[${i}]] = [arr[${i}], arr[0]];`,
      swapping: [0, i],
    })
    ;[arr[0], arr[i]] = [arr[i], arr[0]]

    steps.push({
      array: [...arr],
      description: `Heapify remaining ${i} elements`,
      code: `// Heapify reduced heap of size ${i}`,
      sorted: Array.from({ length: n - i }, (_, idx) => n - 1 - idx),
    })

    heapify(arr, i, 0, steps)
  }

  steps.push({
    array: [...arr],
    description: `Heap sort complete! Final array: [${arr.join(", ")}]`,
    code: `// Heap sort completed\n// Final array: [${arr.join(", ")}]`,
    sorted: Array.from({ length: arr.length }, (_, i) => i),
  })

  return steps
}

const heapify = (arr: number[], n: number, i: number, steps: Step[]): void => {
  let largest = i
  const left = 2 * i + 1
  const right = 2 * i + 2

  if (left < n && arr[left] > arr[largest]) {
    largest = left
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right
  }

  if (largest !== i) {
    steps.push({
      array: [...arr],
      description: `Swap ${arr[i]} with ${arr[largest]} to maintain heap property`,
      code: `// Heapify: swap parent with larger child\n[arr[${i}], arr[${largest}]] = [arr[${largest}], arr[${i}]];`,
      swapping: [i, largest],
    })
    const temp = arr[i]
    arr[i] = arr[largest]
    arr[largest] = temp
    heapify(arr, n, largest, steps)
  }
}

const radixSort = (arr: number[], steps: Step[]): Step[] => {
  const getMax = (arr: number[]): number => {
    let max = arr[0]
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i]
      }
    }
    return max
  }

  const countingSort = (arr: number[], exp: number): void => {
    const n = arr.length
    const output = new Array(n)
    const count = new Array(10).fill(0)

    steps.push({
      array: [...arr],
      description: `Processing digit at position ${exp} (ones, tens, hundreds, etc.)`,
      code: `// Counting sort for digit position ${exp}\nlet count = new Array(10).fill(0);`,
    })

    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10
      count[digit]++
    }

    steps.push({
      array: [...arr],
      description: `Count array for current digit: [${count.join(", ")}]`,
      code: `// Count occurrences of each digit\ncount = [${count.join(", ")}]`,
    })

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1]
    }

    steps.push({
      array: [...arr],
      description: `Cumulative count array: [${count.join(", ")}]`,
      code: `// Build cumulative count array\ncount = [${count.join(", ")}]`,
    })

    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10
      output[count[digit] - 1] = arr[i]
      count[digit]--

      steps.push({
        array: [...output.map(v => v ?? 0)],
        description: `Placing ${arr[i]} at position based on digit ${digit}`,
        code: `output[${count[digit]}] = ${arr[i]}; // digit: ${digit}`,
      })
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i]
    }

    steps.push({
      array: [...arr],
      description: `Array after sorting by digit position ${exp}: [${arr.join(", ")}]`,
      code: `// Copy output back to arr\narr = [${arr.join(", ")}]`,
    })
  }

  const max = getMax(arr)

  steps.push({
    array: [...arr],
    description: `Starting Radix Sort. Maximum value: ${max}`,
    code: `// Find maximum number to know number of digits\nlet max = ${max};`,
  })

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSort(arr, exp)
  }

  steps.push({
    array: [...arr],
    description: `Radix sort complete! Final sorted array: [${arr.join(", ")}]`,
    code: `// Radix sort completed\n// Final array: [${arr.join(", ")}]`,
    sorted: Array.from({ length: arr.length }, (_, i) => i),
  })

  return steps
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ algorithm, inputArray }) => {
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(1000) // milliseconds
  const [sortResult, setSortResult] = useState<SortResult | null>(null)

  const generateSteps = useCallback((algorithm: string, array: number[]): Step[] => {
    const steps: Step[] = []
    const arr = [...array]

    steps.push({
      array: [...arr],
      description: `Initial array: [${arr.join(", ")}]`,
      code: `// Initial array\nlet arr = [${arr.join(", ")}];`,
    })

    switch (algorithm) {
      case "Bubble Sort":
        return bubbleSort(arr, steps)
      case "Selection Sort":
        return selectionSort(arr, steps)
      case "Insertion Sort":
        return insertionSort(arr, steps)
      case "Merge Sort":
        return mergeSort(arr, steps)
      case "Quick Sort":
        return quickSort(arr, steps)
      case "Heap Sort":
        return heapSort(arr, steps)
      case "Radix Sort":
        return radixSort(arr, steps)
      default:
        return steps
    }
  }, [])

  useEffect(() => {
    const array = inputArray
      .split(/[\s,]+/)
      .filter(n => n)
      .map(Number)
      .filter((n) => !isNaN(n))
    const newSteps = generateSteps(algorithm, array)
    setSteps(newSteps)
    setCurrentStep(0)

    const comparisons = newSteps.filter((step) => step.comparing?.length).length
    const swaps = newSteps.filter((step) => step.swapping?.length).length
    setSortResult({
      comparisons,
      swaps,
      steps: newSteps.length,
    })
  }, [algorithm, inputArray, generateSteps])

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1)
      }, playSpeed)
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, steps.length, playSpeed])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const getElementColor = (index: number): string => {
    const step = steps[currentStep]
    if (!step) return "bg-blue-500"

    if (step.sorted?.includes(index)) return "bg-green-500"
    if (step.swapping?.includes(index)) return "bg-red-500"
    if (step.comparing?.includes(index)) return "bg-yellow-500"
    if (step.pivot === index) return "bg-purple-500"

    return "bg-blue-500"
  }

  const getElementColorHex = (index: number): string => {
    const step = steps[currentStep]
    if (!step) return "#3b82f6"

    if (step.sorted?.includes(index)) return "#22c55e"
    if (step.swapping?.includes(index)) return "#ef4444"
    if (step.comparing?.includes(index)) return "#eab308"
    if (step.pivot === index) return "#a855f7"

    return "#3b82f6"
  }

  const prepareCanvasElements = () => {
    const step = steps[currentStep]
    if (!step) return []

    return step.array.map((value, index) => ({
      value,
      index,
      color: getElementColorHex(index),
    }))
  }

  const getCompleteAlgorithmCode = (algorithm: string): string => {
    switch (algorithm) {
      case "Bubble Sort":
        return `function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    if (!swapped) break;
  }

  return arr;
}`

      case "Selection Sort":
        return `function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }

  return arr;
}`

      case "Insertion Sort":
        return `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }

  return arr;
}`

      case "Merge Sort":
        return `function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}`

      case "Quick Sort":
        return `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);

    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }

  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`

      case "Heap Sort":
        return `function heapSort(arr) {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`

      case "Radix Sort":
        return `function radixSort(arr) {
  const max = Math.max(...arr);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSort(arr, exp);
  }

  return arr;
}

function countingSort(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }

  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}`

      default:
        return "// Algorithm implementation not available"
    }
  }

  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading visualization...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortResult && (
        <Card className="border-2 border-gray-300 border-dashed">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
              <div className="flex items-center justify-between space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <ArrowUpDown className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{algorithm} Statistics</h3>
                  <p className="text-gray-600">Step-by-step visualization of the sorting process</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3 text-center">
                <div className="flex flex-col gap-1 md:gap-0">
                  <div className="text-2xl font-bold text-blue-600">{sortResult.comparisons}</div>
                  <div className="text-sm text-gray-500">Comparisons</div>
                </div>
                <div className="flex flex-col gap-1 md:gap-0">
                  <div className="text-2xl font-bold text-red-600">{sortResult.swaps}</div>
                  <div className="text-sm text-gray-500">Swaps</div>
                </div>
                <div className="flex flex-col gap-1 md:gap-0">
                  <div className="text-2xl font-bold text-purple-600">{sortResult.steps}</div>
                  <div className="text-sm text-gray-500">Total Steps</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="w-full p-4 bg-white border rounded-lg shadow-sm md:p-6">
        <div className="flex items-center justify-between w-full mb-4">
          <h3 className="w-[60%] text-base md:text-lg font-semibold flex items-center" title="Array Visualization">
            <ArrowUpDown className="w-6 h-6 mr-2 text-blue-600" />
            <span className="truncate">Array Visualization</span>
          </h3>
          <div className="flex flex-col text-sm text-right text-gray-600 md:text-base md:flex-row md:gap-1">
            <span>Algorithm:</span>
            <span className="font-semibold text-blue-600">{algorithm}</span>
          </div>
        </div>

        {steps[currentStep]?.array.length >= 100 ? (
          <div className="flex justify-center">
            <ZoomableArrayCanvas
              elements={prepareCanvasElements()}
              width={Math.min(1000, typeof window !== 'undefined' ? window.innerWidth - 100 : 1000)}
              height={200}
            />
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg min-h-[80px]">
            {steps[currentStep]?.array.map((value, index) => (
              <div key={index} className="relative">
                <div
                  className={`w-12 h-12 flex items-center justify-center text-white rounded-md font-semibold transition-all duration-300 ${getElementColor(index)}`}
                >
                  {value}
                </div>
                <div className="mt-1 text-xs text-center text-gray-500">{index}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 p-4 text-sm bg-white border rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Unsorted</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Swapping</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Pivot</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Sorted</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-white border rounded-lg shadow-sm md:justify-between md:gap-2">
        <div className="flex space-x-2">
          <Button onClick={handleReset} variant="secondary">
            Reset
          </Button>
          <Button onClick={handlePrevious} disabled={currentStep === 0} variant="secondary">
            Previous
          </Button>
          <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
            Next
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Code className="w-5 h-5 mr-2" />
            Step Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-gray-700">{steps[currentStep]?.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Code Execution</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="p-4 overflow-x-auto font-mono text-sm text-green-400 bg-gray-900 rounded-md">
            <code>{steps[currentStep]?.code}</code>
          </pre>
        </CardContent>
      </Card>

      {currentStep === steps.length - 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Complete {algorithm} Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 overflow-x-auto overflow-y-auto font-mono text-sm text-green-400 bg-gray-900 rounded-md max-h-96">
              <code>{getCompleteAlgorithmCode(algorithm)}</code>
            </pre>
            <div className="p-3 mt-4 rounded-md bg-blue-50">
              <p className="text-sm text-blue-800">
                <strong>Complete Implementation:</strong> This is the full {algorithm} algorithm that you just
                visualized step by step. You can copy this code and use it in your own projects!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SortingVisualizer
