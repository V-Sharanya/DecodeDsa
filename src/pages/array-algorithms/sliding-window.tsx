"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Grid, ChevronLeft, ChevronRight, Code } from "lucide-react"
import { Button } from "../../components/ui/button"

interface ArrayElement {
  value: number
  isHighlighted: boolean
  isWindowStart: boolean
  isWindowEnd: boolean
}

interface Step {
  array: ArrayElement[]
  windowSum: number
  maxSum: number
  description: string
  code: string
  windowStart: number
  windowEnd: number
}

function SlidingWindowPage() {
  const [arrayInput, setArrayInput] = useState<string>("1, 3, -1, -3, 5, 3, 6, 7")
  const [windowSize, setWindowSize] = useState<number>(3)
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"max-sum" | "min-sum" | "avg-sum">("max-sum")
  const [showFullCode, setShowFullCode] = useState<boolean>(false)

  const resetVisualization = () => {
    setSteps([])
    setCurrentStep(0)
    setIsVisualizing(false)
    setShowFullCode(false)
  }

  const generateSlidingWindowSteps = (array: number[]) => {
    const newSteps: Step[] = []
    let currentSum = 0
    let maxSum = Number.NEGATIVE_INFINITY
    let minSum = Number.POSITIVE_INFINITY

    // Initial state
    newSteps.push({
      array: array.map((value) => ({
        value,
        isHighlighted: false,
        isWindowStart: false,
        isWindowEnd: false,
      })),
      windowSum: 0,
      maxSum: Number.NEGATIVE_INFINITY,
      description: "Initialize sliding window algorithm",
      code: `# Initialize variables
windowSize = ${windowSize}
currentSum = 0
maxSum = -∞`,
      windowStart: 0,
      windowEnd: 0,
    })

    // Calculate initial window sum
    for (let i = 0; i < windowSize; i++) {
      currentSum += array[i]
    }
    maxSum = currentSum
    minSum = currentSum

    const initialArray = array.map((value, index) => ({
      value,
      isHighlighted: index < windowSize,
      isWindowStart: index === 0,
      isWindowEnd: index === windowSize - 1,
    }))

    newSteps.push({
      array: initialArray,
      windowSum: currentSum,
      maxSum: selectedAlgorithm === "max-sum" ? maxSum : selectedAlgorithm === "min-sum" ? minSum : currentSum,
      description: `Calculate initial window sum: ${array.slice(0, windowSize).join(" + ")} = ${currentSum}`,
      code: `# Calculate first window
for i in range(windowSize):
    currentSum += array[i]
maxSum = currentSum  # ${currentSum}`,
      windowStart: 0,
      windowEnd: windowSize - 1,
    })

    // Slide the window
    for (let i = 1; i <= array.length - windowSize; i++) {
      const removedElement = array[i - 1]
      const addedElement = array[i + windowSize - 1]
      currentSum = currentSum - removedElement + addedElement

      if (selectedAlgorithm === "max-sum") {
        maxSum = Math.max(maxSum, currentSum)
      } else if (selectedAlgorithm === "min-sum") {
        minSum = Math.min(minSum, currentSum)
      }

      const currentArray = array.map((value, index) => ({
        value,
        isHighlighted: index >= i && index < i + windowSize,
        isWindowStart: index === i,
        isWindowEnd: index === i + windowSize - 1,
      }))

      newSteps.push({
        array: currentArray,
        windowSum: currentSum,
        maxSum: selectedAlgorithm === "max-sum" ? maxSum : selectedAlgorithm === "min-sum" ? minSum : currentSum,
        description: `Slide window: remove ${removedElement}, add ${addedElement}. New sum: ${currentSum}`,
        code: `# Slide window right
currentSum = currentSum - array[${i - 1}] + array[${i + windowSize - 1}]
# ${currentSum - addedElement + removedElement} - ${removedElement} + ${addedElement} = ${currentSum}
${selectedAlgorithm === "max-sum" ? "maxSum" : selectedAlgorithm === "min-sum" ? "minSum" : "avgSum"} = ${
          selectedAlgorithm === "max-sum" ? maxSum : selectedAlgorithm === "min-sum" ? minSum : currentSum
        }`,
        windowStart: i,
        windowEnd: i + windowSize - 1,
      })
    }

    // Final result
    const finalResult = selectedAlgorithm === "max-sum" ? maxSum : selectedAlgorithm === "min-sum" ? minSum : currentSum
    newSteps.push({
      array: array.map((value) => ({
        value,
        isHighlighted: false,
        isWindowStart: false,
        isWindowEnd: false,
      })),
      windowSum: currentSum,
      maxSum: finalResult,
      description: `Algorithm complete! ${
        selectedAlgorithm === "max-sum" ? "Maximum" : selectedAlgorithm === "min-sum" ? "Minimum" : "Final"
      } window sum: ${finalResult}`,
      code: `# Return result
return ${selectedAlgorithm === "max-sum" ? "maxSum" : selectedAlgorithm === "min-sum" ? "minSum" : "currentSum"}`,
      windowStart: -1,
      windowEnd: -1,
    })

    return newSteps
  }

  const handleVisualize = () => {
    try {
      const numbers = arrayInput.split(",").map((num) => {
        const parsed = Number.parseInt(num.trim())
        if (isNaN(parsed)) throw new Error("Invalid number")
        return parsed
      })

      if (windowSize <= 0 || windowSize > numbers.length) {
        throw new Error(`Window size must be between 1 and ${numbers.length}`)
      }

      resetVisualization()
      setIsVisualizing(true)

      const newSteps = generateSlidingWindowSteps(numbers)
      setSteps(newSteps)
      setIsVisualizing(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Please enter valid input")
    }
  }

  const getFullCode = () => {
    const algorithmType = selectedAlgorithm === "max-sum" ? "max" : selectedAlgorithm === "min-sum" ? "min" : "avg"
    return `def sliding_window_${algorithmType}(array, windowSize):
    if len(array) < windowSize:
        return None
    
    # Calculate first window sum
    currentSum = sum(array[:windowSize])
    ${algorithmType}Sum = currentSum
    
    # Slide the window
    for i in range(1, len(array) - windowSize + 1):
        currentSum = currentSum - array[i-1] + array[i+windowSize-1]
        ${algorithmType}Sum = ${algorithmType === "max" ? "max" : algorithmType === "min" ? "min" : ""}(${algorithmType}Sum, currentSum)
    
    return ${algorithmType}Sum`
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
              <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg">
                <Grid className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Sliding Window Algorithm
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Algorithm Selection */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Algorithm Variant</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedAlgorithm("max-sum")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "max-sum"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Maximum Window Sum
            </button>
            <button
              onClick={() => setSelectedAlgorithm("min-sum")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "min-sum"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Minimum Window Sum
            </button>
            <button
              onClick={() => setSelectedAlgorithm("avg-sum")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "avg-sum"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Window Sum Tracking
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Input</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="array-input" className="block text-sm font-medium text-gray-700 mb-2">
                Array (comma-separated numbers)
              </label>
              <input
                id="array-input"
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 1, 3, -1, -3, 5, 3, 6, 7"
              />
            </div>
            <div>
              <label htmlFor="window-size" className="block text-sm font-medium text-gray-700 mb-2">
                Window Size
              </label>
              <input
                id="window-size"
                type="number"
                value={windowSize}
                onChange={(e) => setWindowSize(Number(e.target.value))}
                min="1"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                placeholder="Enter window size"
              />
            </div>
            <button
              onClick={handleVisualize}
              disabled={isVisualizing}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-yellow-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVisualizing ? "Visualizing..." : "Visualize"}
            </button>
          </div>
        </div>

        {/* Visualization Section */}
        {steps.length > 0 && (
          <div className="space-y-8">
            {/* Array Visualization */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Array Visualization</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {steps[currentStep].array.map((element, index) => (
                  <div key={index} className="relative text-center">
                    <div
                      className={`w-16 h-16 flex items-center justify-center rounded-lg text-lg font-semibold transition-all duration-300 ${
                        element.isWindowStart
                          ? "bg-orange-500 text-white shadow-lg border-4 border-orange-300"
                          : element.isWindowEnd
                            ? "bg-yellow-500 text-white shadow-lg border-4 border-yellow-300"
                            : element.isHighlighted
                              ? "bg-orange-100 text-orange-700 shadow-md"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {element.value}
                    </div>
                    {element.isWindowStart && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-orange-600">
                        START
                      </div>
                    )}
                    {element.isWindowEnd && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-yellow-600">
                        END
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">i={index}</div>
                  </div>
                ))}
              </div>

              {/* Window size indicator */}
              <div className="text-center mt-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-lg">
                  <span className="text-orange-800 font-semibold">Window Size: {windowSize}</span>
                </div>
              </div>
            </div>

            {/* Window Analysis */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Window Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{steps[currentStep].windowSum}</div>
                  <div className="text-sm text-orange-700">Current Window Sum</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{steps[currentStep].maxSum}</div>
                  <div className="text-sm text-green-700">
                    {selectedAlgorithm === "max-sum"
                      ? "Maximum Sum Found"
                      : selectedAlgorithm === "min-sum"
                        ? "Minimum Sum Found"
                        : "Current Result"}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{windowSize}</div>
                  <div className="text-sm text-blue-700">Window Size</div>
                </div>
              </div>
            </div>

            {/* Step Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Step Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700">{steps[currentStep].description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                      disabled={currentStep === 0}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <span className="text-gray-600">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                    <button
                      onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                      disabled={currentStep === steps.length - 1}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                </div>
                <Button onClick={()=> setCurrentStep(0)} variant="secondary">
                  Reset
                </Button>
              </div>
            </div>

            {/* Code Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Code</h2>
                <button
                  onClick={() => setShowFullCode(!showFullCode)}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
                >
                  <Code className="w-5 h-5" />
                  <span>{showFullCode ? "Show Current Step" : "Show Full Code"}</span>
                </button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-800">{showFullCode ? getFullCode() : steps[currentStep].code}</code>
              </pre>
            </div>

            {/* Algorithm Insights */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Algorithm Insights</h2>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="font-semibold text-orange-800">Efficiency:</div>
                  <div className="text-orange-700">
                    Sliding window reduces time complexity from O(n×k) to O(n) by reusing calculations
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-800">Key Technique:</div>
                  <div className="text-blue-700">
                    Remove the leftmost element and add the new rightmost element in each step
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-800">Applications:</div>
                  <div className="text-green-700">Maximum/minimum subarray, moving averages, substring problems</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default SlidingWindowPage
