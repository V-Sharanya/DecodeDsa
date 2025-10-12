"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Calculator, ChevronLeft, ChevronRight, Code } from "lucide-react"
import { Button } from "../../components/ui/button"

interface ArrayElement {
  value: number
  isHighlighted: boolean
  isPrefixSum: boolean
  isRange: boolean
}

interface Step {
  array: ArrayElement[]
  prefixSum: number[]
  description: string
  code: string
}

function PrefixSumPage() {
  const [arrayInput, setArrayInput] = useState<string>("")
  const [rangeInput, setRangeInput] = useState<string>("")
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false)
  const [showFullCode, setShowFullCode] = useState<boolean>(false)
  const [operation, setOperation] = useState<"prefix" | "range">("prefix")

  const resetVisualization = () => {
    setSteps([])
    setCurrentStep(0)
    setIsVisualizing(false)
    setShowFullCode(false)
  }

  const generatePrefixSumSteps = (array: number[]) => {
    const newSteps: Step[] = []
    const prefixSum: number[] = new Array(array.length + 1).fill(0)

    // Initial state
    newSteps.push({
      array: array.map(num => ({
        value: num,
        isHighlighted: false,
        isPrefixSum: false,
        isRange: false
      })),
      prefixSum: [0],
      description: "Initialize prefix sum array with 0",
      code: `# Initialize prefix sum array
prefix_sum = [0] * (len(array) + 1)`
    })

    // Calculate prefix sum
    for (let i = 0; i < array.length; i++) {
      prefixSum[i + 1] = prefixSum[i] + array[i]
      
      const currentArray = array.map((num, idx) => ({
        value: num,
        isHighlighted: idx <= i,
        isPrefixSum: idx === i,
        isRange: false
      }))

      newSteps.push({
        array: currentArray,
        prefixSum: [...prefixSum],
        description: `Calculate prefix sum at index ${i}: ${prefixSum[i + 1]}`,
        code: `# Calculate prefix sum
prefix_sum[i + 1] = prefix_sum[i] + array[i]`
      })
    }

    return newSteps
  }

  const generateRangeSumSteps = (array: number[], range: string) => {
    const [start, end] = range.split(',').map(num => parseInt(num.trim()))
    if (isNaN(start) || isNaN(end) || start < 0 || end >= array.length || start > end) {
      throw new Error("Invalid range")
    }

    const newSteps: Step[] = []
    const prefixSum: number[] = new Array(array.length + 1).fill(0)

    // Calculate prefix sum
    for (let i = 0; i < array.length; i++) {
      prefixSum[i + 1] = prefixSum[i] + array[i]
    }

    // Initial state
    newSteps.push({
      array: array.map(num => ({
        value: num,
        isHighlighted: false,
        isPrefixSum: false,
        isRange: false
      })),
      prefixSum: [...prefixSum],
      description: "Calculate prefix sum array",
      code: `# Calculate prefix sum array
prefix_sum = [0] * (len(array) + 1)
for i in range(len(array)):
    prefix_sum[i + 1] = prefix_sum[i] + array[i]`
    })

    // Show range sum calculation
    const rangeSum = prefixSum[end + 1] - prefixSum[start]
    const currentArray = array.map((num, idx) => ({
      value: num,
      isHighlighted: idx >= start && idx <= end,
      isPrefixSum: false,
      isRange: true
    }))

    newSteps.push({
      array: currentArray,
      prefixSum: [...prefixSum],
      description: `Range sum from index ${start} to ${end}: ${rangeSum}`,
      code: `# Calculate range sum
range_sum = prefix_sum[end + 1] - prefix_sum[start]`
    })

    return newSteps
  }

  const handleVisualize = () => {
    try {
      const numbers = arrayInput.split(',').map(num => parseInt(num.trim()))
      if (numbers.some(isNaN)) {
        throw new Error("Invalid number in array")
      }

      resetVisualization()
      setIsVisualizing(true)
      const newSteps = operation === "prefix"
        ? generatePrefixSumSteps(numbers)
        : generateRangeSumSteps(numbers, rangeInput)
      setSteps(newSteps)
      setIsVisualizing(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Please enter valid input")
    }
  }

  const getFullCode = () => {
    if (operation === "prefix") {
      return `def calculate_prefix_sum(array):
    # Initialize prefix sum array
    prefix_sum = [0] * (len(array) + 1)
    
    # Calculate prefix sum
    for i in range(len(array)):
        prefix_sum[i + 1] = prefix_sum[i] + array[i]
    
    return prefix_sum`
    } else {
      return `def range_sum_query(array, start, end):
    # Calculate prefix sum array
    prefix_sum = [0] * (len(array) + 1)
    for i in range(len(array)):
        prefix_sum[i + 1] = prefix_sum[i] + array[i]
    
    # Calculate range sum
    return prefix_sum[end + 1] - prefix_sum[start]`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/array-algorithms" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Prefix Sum
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Input Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Input</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <button
                onClick={() => setOperation("prefix")}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  operation === "prefix"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Prefix Sum
              </button>
              <button
                onClick={() => setOperation("range")}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  operation === "range"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Range Sum
              </button>
            </div>
            <div>
              <label htmlFor="array-input" className="block text-sm font-medium text-gray-700 mb-2">
                Array (comma-separated numbers)
              </label>
              <input
                id="array-input"
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 1, 2, 3, 4, 5"
              />
            </div>
            {operation === "range" && (
              <div>
                <label htmlFor="range-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Range (start,end)
                </label>
                <input
                  id="range-input"
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 1,3"
                />
              </div>
            )}
            <button
              onClick={handleVisualize}
              disabled={isVisualizing}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Visualize
            </button>
          </div>
        </div>

        {steps.length > 0 && (
          <>
            {/* Step Navigation */}
            <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Step {currentStep + 1} of {steps.length}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                    disabled={currentStep === steps.length - 1}
                    className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>
              <Button onClick={()=> setCurrentStep(0)} variant="secondary">
                Reset
              </Button>
            </div>

            {/* Array Visualization */}
            <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Array Visualization</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {steps[currentStep].array.map((element, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 flex items-center justify-center rounded-lg text-lg font-bold transition-all duration-300 ${
                      element.isRange
                        ? "bg-pink-500 text-white"
                        : element.isPrefixSum
                        ? "bg-purple-500 text-white"
                        : element.isHighlighted
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {element.value}
                  </div>
                ))}
              </div>
            </div>

            {/* Prefix Sum Array */}
            <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Prefix Sum Array</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {steps[currentStep].prefixSum.map((sum, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 flex items-center justify-center rounded-lg text-lg font-bold bg-gray-100 text-gray-700"
                  >
                    {sum}
                  </div>
                ))}
              </div>
            </div>

            {/* Code Display */}
            <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Code</h2>
                <button
                  onClick={() => setShowFullCode(!showFullCode)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Code className="w-5 h-5" />
                  {showFullCode ? "Show Step Code" : "Show Full Code"}
                </button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-800">
                  {showFullCode ? getFullCode() : steps[currentStep].code}
                </code>
              </pre>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default PrefixSumPage
export {} 