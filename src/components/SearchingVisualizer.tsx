"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { CheckCircle, XCircle, Search, Target } from "lucide-react"
import ZoomableArrayCanvas from "./ZoomableArrayCanvas"

interface SearchingVisualizerProps {
  algorithm: string
  inputArray: string
  targetValue: number
}

interface Step {
  array: number[]
  description: string
  code: string
  currentIndex?: number
  comparing?: number[]
  found?: boolean
  foundIndex?: number
  left?: number
  right?: number
  mid?: number
  searchComplete?: boolean
}

const SearchingVisualizer: React.FC<SearchingVisualizerProps> = ({ algorithm, inputArray, targetValue }) => {
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [searchResult, setSearchResult] = useState<{ found: boolean; index: number; comparisons: number } | null>(null)

  const generateSteps = useCallback((algorithm: string, array: number[], target: number): Step[] => {
    const steps: Step[] = []
    const arr = [...array]

    // For binary search, sort the array first
    if (algorithm === "Binary Search") {
      const originalArr = [...arr]
      arr.sort((a, b) => a - b)

      if (JSON.stringify(originalArr) !== JSON.stringify(arr)) {
        steps.push({
          array: [...arr],
          description: `Array sorted for Binary Search: [${arr.join(", ")}]`,
          code: `// Binary Search requires sorted array\nlet arr = [${originalArr.join(", ")}].sort();\n// Sorted: [${arr.join(", ")}]`,
        })
      } else {
        steps.push({
          array: [...arr],
          description: `Array is already sorted: [${arr.join(", ")}]`,
          code: `// Array is already sorted for Binary Search\nlet arr = [${arr.join(", ")}];`,
        })
      }
    } else {
      steps.push({
        array: [...arr],
        description: `Initial array: [${arr.join(", ")}], Target: ${target}`,
        code: `// Linear Search Setup\nlet arr = [${arr.join(", ")}];\nlet target = ${target};`,
      })
    }

    switch (algorithm) {
      case "Linear Search":
        return linearSearch(arr, target, steps)
      case "Binary Search":
        return binarySearch(arr, target, steps)
      default:
        return steps
    }
  }, [])

  useEffect(() => {
    const array = inputArray
      .split(/[\s,]+/).filter(n => n)
      .map(Number)
      .filter((n) => !isNaN(n))
    const newSteps = generateSteps(algorithm, array, targetValue)
    setSteps(newSteps)
    setCurrentStep(0)

    // Calculate search result
    const lastStep = newSteps[newSteps.length - 1]
    if (lastStep) {
      const comparisons = newSteps.filter((step) => step.comparing).length
      setSearchResult({
        found: lastStep.found || false,
        index: lastStep.foundIndex || -1,
        comparisons,
      })
    }
  }, [algorithm, inputArray, targetValue, generateSteps])

  const linearSearch = (arr: number[], target: number, steps: Step[]): Step[] => {
    steps.push({
      array: [...arr],
      description: `Starting Linear Search for target ${target}`,
      code: `function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {`,
    })

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        description: `Checking element at index ${i}: ${arr[i]}`,
        code: `    if (arr[${i}] === target) {\n      // ${arr[i]} === ${target} is ${arr[i] === target}\n    }`,
        currentIndex: i,
        comparing: [i],
      })

      if (arr[i] === target) {
        steps.push({
          array: [...arr],
          description: `🎉 Target ${target} found at index ${i}!`,
          code: `      return ${i}; // Found target at index ${i}\n  }\n}`,
          foundIndex: i,
          found: true,
          searchComplete: true,
        })
        return steps
      }

      steps.push({
        array: [...arr],
        description: `${arr[i]} ≠ ${target}, continue to next element`,
        code: `    // ${arr[i]} ≠ ${target}, continue searching`,
      })
    }

    steps.push({
      array: [...arr],
      description: `❌ Target ${target} not found in the array`,
      code: `  return -1; // Target not found\n}`,
      found: false,
      searchComplete: true,
    })

    return steps
  }

  const binarySearch = (arr: number[], target: number, steps: Step[]): Step[] => {
    let left = 0
    let right = arr.length - 1

    steps.push({
      array: [...arr],
      description: `Initialize Binary Search: left = ${left}, right = ${right}`,
      code: `function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;`,
      left,
      right,
    })

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)

      steps.push({
        array: [...arr],
        description: `Calculate middle: mid = Math.floor((${left} + ${right}) / 2) = ${mid}`,
        code: `  while (left <= right) {\n    let mid = Math.floor((${left} + ${right}) / 2); // ${mid}`,
        left,
        right,
        mid,
      })

      steps.push({
        array: [...arr],
        description: `Compare arr[${mid}] = ${arr[mid]} with target ${target}`,
        code: `    if (arr[${mid}] === target) {\n      // ${arr[mid]} === ${target} is ${arr[mid] === target}\n    }`,
        left,
        right,
        mid,
        comparing: [mid],
      })

      if (arr[mid] === target) {
        steps.push({
          array: [...arr],
          description: `🎉 Target ${target} found at index ${mid}!`,
          code: `      return ${mid}; // Found target at index ${mid}\n    }\n  }\n}`,
          foundIndex: mid,
          found: true,
          searchComplete: true,
          mid,
        })
        return steps
      } else if (arr[mid] < target) {
        steps.push({
          array: [...arr],
          description: `${arr[mid]} < ${target}, search right half`,
          code: `    } else if (arr[${mid}] < target) {\n      left = ${mid + 1}; // Search right half`,
          left,
          right,
          mid,
        })
        left = mid + 1
      } else {
        steps.push({
          array: [...arr],
          description: `${arr[mid]} > ${target}, search left half`,
          code: `    } else {\n      right = ${mid - 1}; // Search left half`,
          left,
          right,
          mid,
        })
        right = mid - 1
      }

      steps.push({
        array: [...arr],
        description: `Update search range: left = ${left}, right = ${right}`,
        code: `    // New range: left = ${left}, right = ${right}`,
        left,
        right,
      })
    }

    steps.push({
      array: [...arr],
      description: `❌ Target ${target} not found in the array`,
      code: `  return -1; // Target not found\n}`,
      found: false,
      searchComplete: true,
    })

    return steps
  }

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
  }

  const getElementColor = (index: number): string => {
    const step = steps[currentStep]
    if (!step) return "bg-blue-500"

    if (step.foundIndex === index && step.found) return "bg-green-500"
    if (step.comparing?.includes(index)) return "bg-yellow-500"
    if (step.currentIndex === index) return "bg-orange-500"
    if (step.mid === index) return "bg-purple-500"
    if (algorithm === "Binary Search" && step.left !== undefined && step.right !== undefined) {
      if (index < step.left || index > step.right) return "bg-gray-400"
    }

    return "bg-blue-500"
  }

  const getElementColorHex = (index: number): string => {
    const step = steps[currentStep]
    if (!step) return "#3b82f6" // blue-500

    if (step.foundIndex === index && step.found) return "#22c55e" // green-500
    if (step.comparing?.includes(index)) return "#eab308" // yellow-500
    if (step.currentIndex === index) return "#f97316" // orange-500
    if (step.mid === index) return "#a855f7" // purple-500
    if (algorithm === "Binary Search" && step.left !== undefined && step.right !== undefined) {
      if (index < step.left || index > step.right) return "#9ca3af" // gray-400
    }

    return "#3b82f6" // blue-500
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
      case "Linear Search":
        return `function linearSearch(arr, target) {
  // Iterate through each element in the array
  for (let i = 0; i < arr.length; i++) {
    // Check if current element matches target
    if (arr[i] === target) {
      return i; // Return index if found
    }
  }
  
  return -1; // Return -1 if not found
}

// Usage example:
const array = [64, 34, 25, 12, 22, 11, 90];
const target = 22;
const result = linearSearch(array, target);

if (result !== -1) {
  console.log(\`Element found at index: \${result}\`);
} else {
  console.log("Element not found");
}`

      case "Binary Search":
        return `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // Calculate middle index
    let mid = Math.floor((left + right) / 2);
    
    // Check if target is at middle
    if (arr[mid] === target) {
      return mid; // Found target
    }
    
    // If target is greater, ignore left half
    if (arr[mid] < target) {
      left = mid + 1;
    }
    // If target is smaller, ignore right half
    else {
      right = mid - 1;
    }
  }
  
  return -1; // Target not found
}

// Usage example:
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const target = 7;
const result = binarySearch(sortedArray, target);

if (result !== -1) {
  console.log(\`Element found at index: \${result}\`);
} else {
  console.log("Element not found");
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
      {/* Search Result Summary */}
      {searchResult && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-6">
            <div className="w-full flex items-center justify-between">
              <div className="w-full flex items-center space-x-3">
                {searchResult.found ? (
                  <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
                )}
                <div>
                  <h3 className="text-lg font-semibold truncate">{searchResult.found ? "Target Found!" : "Target Not Found"}</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {searchResult.found
                      ? `Found at index ${searchResult.index}`
                      : "Target value does not exist in the array"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{searchResult.comparisons}</div>
                <div className="text-sm text-gray-500">Comparisons</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Array Visualization */}
      <div className="w-full bg-white rounded-lg p-6 shadow-sm border">
        <div className="w-full flex items-center justify-between mb-4">
          <h3 className="w-[60%] text-lg font-semibold flex items-center">
            <Target className="w-6 h-6 mr-2 text-green-600" />
            <span className="truncate">Array Visualization</span>
          </h3>
          <div className="text-gray-600">
            Target: <span className="font-semibold text-green-600">{targetValue}</span>
          </div>
        </div>

        {steps[currentStep]?.array.length >= 100 ? (
          // Canvas-based visualization for large arrays
          <div className="flex justify-center">
            <ZoomableArrayCanvas
              elements={prepareCanvasElements()}
              width={Math.min(1000, typeof window !== 'undefined' ? window.innerWidth - 100 : 1000)}
              height={200}
            />
          </div>
        ) : (
          // DOM-based visualization for small arrays
          <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg min-h-[80px]">
            {steps[currentStep]?.array.map((value, index) => (
              <div key={index} className="relative">
                <div
                  className={`w-12 h-12 flex items-center justify-center text-white rounded-md font-semibold transition-all duration-300 ${getElementColor(index)}`}
                >
                  {value}
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">{index}</div>

                {/* Binary Search Pointers */}
                {algorithm === "Binary Search" && steps[currentStep] && (
                  <>
                    {steps[currentStep].left === index && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-600">
                        L
                      </div>
                    )}
                    {steps[currentStep].right === index && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-red-600">
                        R
                      </div>
                    )}
                    {steps[currentStep].mid === index && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-purple-600">
                        M
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Unvisited</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Comparing</span>
        </div>
        {algorithm === "Linear Search" && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>Current</span>
          </div>
        )}
        {algorithm === "Binary Search" && (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>Middle</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span>Out of Range</span>
            </div>
          </>
        )}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Found</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center md:justify-between flex-wrap gap-4 md:gap-2 bg-white rounded-lg p-4 shadow-sm border">
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
        <Badge variant="default" className="text-sm">
          Step {currentStep + 1} of {steps.length}
        </Badge>
      </div>

      {/* Step Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Step Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{steps[currentStep]?.description}</p>
        </CardContent>
      </Card>

      {/* Code Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Code Execution</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm font-mono">
            <code>{steps[currentStep]?.code}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Complete Algorithm Code - Show only when search is complete */}
      {steps[currentStep]?.searchComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Complete {algorithm} Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm font-mono max-h-96 overflow-y-auto">
              <code>{getCompleteAlgorithmCode(algorithm)}</code>
            </pre>
            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <p className="text-sm text-green-800">
                <strong>💡 Complete Implementation:</strong> This is the full {algorithm} algorithm that you just
                visualized step by step. You can copy this code and use it in your own projects!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SearchingVisualizer
