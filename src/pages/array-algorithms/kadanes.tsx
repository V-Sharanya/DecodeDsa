"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, TrendingUp, ChevronLeft, ChevronRight, Code, Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "../../components/ui/button"

interface ArrayElement {
  value: number
  isHighlighted: boolean
  isCurrentSum: boolean
  isMaxSum: boolean
}

interface Step {
  array: ArrayElement[]
  maxSoFar: number
  currentMax: number
  start: number
  end: number
  description: string
  code: string
}

const KadanesAlgorithm = () => {
  const [arrayInput, setArrayInput] = useState<string>("-2, 1, -3, 4, -1, 2, 1, -5, 4")
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000)
  const [showFullCode, setShowFullCode] = useState<boolean>(false)

  const resetVisualization = () => {
    setSteps([])
    setCurrentStep(0)
    setIsRunning(false)
    setShowFullCode(false)
  }

  const generateKadaneSteps = (array: number[]) => {
    const newSteps: Step[] = []
    let maxSoFar = Number.NEGATIVE_INFINITY
    let currentMax = 0
    let start = 0
    let end = 0
    let j = 0

    // Initial state
    newSteps.push({
      array: array.map((value) => ({
        value,
        isHighlighted: false,
        isCurrentSum: false,
        isMaxSum: false,
      })),
      maxSoFar: Number.NEGATIVE_INFINITY,
      currentMax: 0,
      start: 0,
      end: 0,
      description: "Initialize variables: maxSoFar = -∞, currentMax = 0",
      code: `# Initialize Kadane's algorithm
maxSoFar = -∞
currentMax = 0
start = 0, end = 0`,
    })

    for (let i = 0; i < array.length; i++) {
      const currentJ = j
      const stepStart = start
      const stepEnd = end
      currentMax += array[i]

      // Step: Add current element
      const currentArray = array.map((value, index) => ({
        value,
        isHighlighted: index >= currentJ && index <= i,
        isCurrentSum: index === i,
        isMaxSum: index >= stepStart && index <= stepEnd,
      }))

      newSteps.push({
        array: currentArray,
        maxSoFar,
        currentMax,
        start: stepStart,
        end: stepEnd,
        description: `Add element ${array[i]} to current sum: ${currentMax - array[i]} + ${array[i]} = ${currentMax}`,
        code: `# Add current element to sum
currentMax += array[${i}]  # ${currentMax}`,
      })

      // Check if we found a new maximum
      if (currentMax > maxSoFar) {
        maxSoFar = currentMax
        start = j
        end = i
        const maxStart = start
        const maxEnd = end
        const maxArray = array.map((value, index) => ({
          value,
          isHighlighted: index >= currentJ && index <= i,
          isCurrentSum: index === i,
          isMaxSum: index >= maxStart && index <= maxEnd,
        }))

        newSteps.push({
          array: maxArray,
          maxSoFar,
          currentMax,
          start: maxStart,
          end: maxEnd,
          description: `New maximum found! Update maxSoFar = ${maxSoFar}, subarray from ${maxStart} to ${maxEnd}`,
          code: `# Update maximum
if currentMax > maxSoFar:
    maxSoFar = ${maxSoFar}
    start = ${maxStart}, end = ${maxEnd}`,
        })
      }

      // Reset if current sum becomes negative
      if (currentMax < 0) {
        currentMax = 0
        j = i + 1
        const resetStart = start
        const resetEnd = end
        const resetArray = array.map((value, index) => ({
          value,
          isHighlighted: false,
          isCurrentSum: false,
          isMaxSum: index >= resetStart && index <= resetEnd,
        }))

        newSteps.push({
          array: resetArray,
          maxSoFar,
          currentMax,
          start: resetStart,
          end: resetEnd,
          description: `Current sum is negative (${currentMax + array[i]}), reset to 0 and start new subarray`,
          code: `# Reset negative sum
if currentMax < 0:
    currentMax = 0
    start = ${j}`,
        })
      }
    }

    // Final result
    const finalStart = start
    const finalEnd = end
    const finalArray = array.map((value, index) => ({
      value,
      isHighlighted: false,
      isCurrentSum: false,
      isMaxSum: index >= finalStart && index <= finalEnd,
    }))

    newSteps.push({
      array: finalArray,
      maxSoFar,
      currentMax,
      start: finalStart,
      end: finalEnd,
      description: `Algorithm complete! Maximum subarray sum is ${maxSoFar}`,
      code: `# Final result
return maxSoFar  # ${maxSoFar}`,
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

      resetVisualization()
      setIsRunning(true)

      const newSteps = generateKadaneSteps(numbers)
      setSteps(newSteps)
      setIsRunning(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Please enter valid numbers separated by commas")
    }
  }

  const handleAutoPlay = () => {
    if (isRunning) {
      setIsRunning(false)
    } else {
      setIsRunning(true)
      if (currentStep >= steps.length - 1) {
        setCurrentStep(0)
      }
    }
  }

  useEffect(() => {
    if (!isRunning) return

    const timeoutId = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setIsRunning(false)
      }
    }, animationSpeed)

    return () => clearTimeout(timeoutId) // Cleanup on unmount or re-render
  }, [isRunning, currentStep, steps, animationSpeed])

  const getFullCode = () => {
    return `def kadanes_algorithm(array):
    maxSoFar = float('-inf')
    currentMax = 0
    start = 0
    end = 0
    temp_start = 0
    
    for i in range(len(array)):
        currentMax += array[i]
        
        if currentMax > maxSoFar:
            maxSoFar = currentMax
            start = temp_start
            end = i
        
        if currentMax < 0:
            currentMax = 0
            temp_start = i + 1
    
    return maxSoFar, start, end`
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
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Kadane's Algorithm
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Algorithm Info */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Maximum Subarray Problem</h2>
          <p className="text-gray-600 mb-4">
            Kadane's algorithm efficiently finds the maximum sum of any contiguous subarray in O(n) time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-800">Time Complexity</div>
              <div className="text-purple-700">O(n)</div>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg">
              <div className="font-semibold text-pink-800">Space Complexity</div>
              <div className="text-pink-700">O(1)</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-800">Algorithm Type</div>
              <div className="text-blue-700">Dynamic Programming</div>
            </div>
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., -2, 1, -3, 4, -1, 2, 1, -5, 4"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleVisualize}
                disabled={isRunning}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? "Visualizing..." : "Visualize"}
              </button>
              {steps.length > 0 && (
                <button
                  onClick={handleAutoPlay}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isRunning ? "Pause" : "Auto Play"}</span>
                </button>
              )}
            </div>
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
                  <div key={index} className="text-center">
                    <div
                      className={`w-16 h-16 flex items-center justify-center rounded-lg text-lg font-semibold transition-all duration-300 ${
                        element.isMaxSum
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                          : element.isCurrentSum
                            ? "bg-blue-100 text-blue-700 shadow-md border-2 border-blue-300"
                            : element.isHighlighted
                              ? "bg-purple-100 text-purple-700 shadow-md"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {element.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">i={index}</div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 text-sm mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                  <span>Maximum Subarray</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                  <span>Current Element</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-100 rounded"></div>
                  <span>Current Subarray</span>
                </div>
              </div>
            </div>

            {/* Algorithm State */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Algorithm State</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{steps[currentStep].maxSoFar}</div>
                  <div className="text-sm text-purple-700">Max So Far</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{steps[currentStep].currentMax}</div>
                  <div className="text-sm text-blue-700">Current Sum</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{steps[currentStep].start}</div>
                  <div className="text-sm text-green-700">Start Index</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{steps[currentStep].end}</div>
                  <div className="text-sm text-orange-700">End Index</div>
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

            {/* Animation Controls */}
            {steps.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Animation Controls</h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleAutoPlay}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isRunning ? "Pause" : "Play"}</span>
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Animation Speed</label>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="200"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Fast</span>
                    <span>Slow</span>
                  </div>
                </div>
              </div>
            )}

            {/* Code Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Code</h2>
                <button
                  onClick={() => setShowFullCode(!showFullCode)}
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                >
                  <Code className="w-5 h-5" />
                  <span>{showFullCode ? "Show Current Step" : "Show Full Code"}</span>
                </button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-800">{showFullCode ? getFullCode() : steps[currentStep]?.code}</code>
              </pre>
            </div>

            {/* Algorithm Insights */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Algorithm Insights</h2>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-semibold text-purple-800">Key Principle:</div>
                  <div className="text-purple-700">
                    At each position, decide whether to extend the current subarray or start a new one
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-800">Decision Rule:</div>
                  <div className="text-blue-700">current_sum = max(current_sum + arr[i], arr[i])</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default KadanesAlgorithm
