"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Binary, ChevronLeft, ChevronRight, Code } from "lucide-react"
import { Button } from "../../components/ui/button"

interface BitElement {
  value: number
  binaryString: string
  isHighlighted: boolean
  isResult: boolean
}

interface Step {
  numbers: BitElement[]
  description: string
  code: string
  operation?: string
  result?: number | boolean
}

function BitManipulationPage() {
  const [arrayInput, setArrayInput] = useState<string>("")
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    "single-number" | "count-bits" | "power-of-two" | "reverse-bits"
  >("single-number")
  const [showFullCode, setShowFullCode] = useState<boolean>(false)

  const resetVisualization = () => {
    setSteps([])
    setCurrentStep(0)
    setIsVisualizing(false)
    setShowFullCode(false)
  }

  const toBinaryString = (num: number, bits = 8) => {
    return num.toString(2).padStart(bits, "0")
  }

  const generateSingleNumberSteps = (array: number[]) => {
    const newSteps: Step[] = []
    let result = 0

    // Initial state
    newSteps.push({
      numbers: array.map((num) => ({
        value: num,
        binaryString: toBinaryString(num),
        isHighlighted: false,
        isResult: false,
      })),
      description: "Find the single number using XOR operation",
      code: `# XOR all numbers - duplicates cancel out
result = 0`,
    })

    // Process each number
    for (let i = 0; i < array.length; i++) {
      const prevResult = result
      result ^= array[i]

      const currentNumbers = array.map((num, idx) => ({
        value: num,
        binaryString: toBinaryString(num),
        isHighlighted: idx === i,
        isResult: false,
      }))

      newSteps.push({
        numbers: currentNumbers,
        description: `XOR with ${array[i]}: ${prevResult} ^ ${array[i]} = ${result}`,
        code: `# XOR operation
result = result ^ array[i]
# ${toBinaryString(prevResult)} ^ ${toBinaryString(array[i])} = ${toBinaryString(result)}`,
        operation: `${toBinaryString(prevResult)} ^ ${toBinaryString(array[i])} = ${toBinaryString(result)}`,
        result: result,
      })
    }

    // Final result
    newSteps.push({
      numbers: array.map((num) => ({
        value: num,
        binaryString: toBinaryString(num),
        isHighlighted: false,
        isResult: num === result,
      })),
      description: `Single number found: ${result}`,
      code: `# Return the single number
return result`,
      result: result,
    })

    return newSteps
  }

  const generateCountBitsSteps = (array: number[]) => {
    const newSteps: Step[] = []

    newSteps.push({
      numbers: array.map((num) => ({
        value: num,
        binaryString: toBinaryString(num),
        isHighlighted: false,
        isResult: false,
      })),
      description: "Count set bits (1s) in each number",
      code: `# Count set bits in each number
def count_bits(n):
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count`,
    })

    // Process each number
    for (let i = 0; i < array.length; i++) {
      const num = array[i]
      let count = 0
      let temp = num

      // Count bits step by step
      const bitSteps: string[] = []
      while (temp > 0) {
        if (temp & 1) count++
        bitSteps.push(`${temp} & 1 = ${temp & 1}`)
        temp >>= 1
      }

      const currentNumbers = array.map((n, idx) => ({
        value: n,
        binaryString: toBinaryString(n),
        isHighlighted: idx === i,
        isResult: idx < i,
      }))

      newSteps.push({
        numbers: currentNumbers,
        description: `Counting bits in ${num}: ${count} set bits`,
        code: `# Counting bits in ${num}
${bitSteps.join("\n")}
# Total set bits: ${count}`,
        result: count,
      })
    }

    return newSteps
  }

  const generatePowerOfTwoSteps = (array: number[]) => {
    const newSteps: Step[] = []

    newSteps.push({
      numbers: array.map((num) => ({
        value: num,
        binaryString: toBinaryString(num),
        isHighlighted: false,
        isResult: false,
      })),
      description: "Check if numbers are powers of 2 using n & (n-1) == 0",
      code: `# Power of 2 check: n & (n-1) == 0
def is_power_of_two(n):
    return n > 0 and (n & (n-1)) == 0`,
    })

    // Process each number
    for (let i = 0; i < array.length; i++) {
      const num = array[i]
      const isPowerOfTwo = num > 0 && (num & (num - 1)) === 0

      const currentNumbers = array.map((n, idx) => ({
        value: n,
        binaryString: toBinaryString(n),
        isHighlighted: idx === i,
        isResult: idx === i && isPowerOfTwo,
      }))

      newSteps.push({
        numbers: currentNumbers,
        description: `Checking ${num}: ${num} & ${num - 1} = ${num & (num - 1)} ${isPowerOfTwo ? "(Power of 2!)" : "(Not power of 2)"}`,
        code: `# Check ${num}
${toBinaryString(num)} & ${toBinaryString(num - 1)} = ${toBinaryString(num & (num - 1))}
# Result: ${isPowerOfTwo}`,
        result: isPowerOfTwo,
      })
    }

    return newSteps
  }

  const generateReverseBitsSteps = (array: number[]) => {
    const newSteps: Step[] = []

    newSteps.push({
      numbers: array.map((num) => ({
        value: num,
        binaryString: toBinaryString(num),
        isHighlighted: false,
        isResult: false,
      })),
      description: "Reverse bits of each number",
      code: `# Reverse bits
def reverse_bits(n):
    result = 0
    for i in range(8):  # 8-bit numbers
        result = (result << 1) | (n & 1)
        n >>= 1
    return result`,
    })

    // Process each number
    for (let i = 0; i < array.length; i++) {
      const num = array[i]
      let result = 0
      let temp = num

      // Reverse bits
      for (let bit = 0; bit < 8; bit++) {
        result = (result << 1) | (temp & 1)
        temp >>= 1
      }

      const currentNumbers = array.map((n, idx) => ({
        value: n,
        binaryString: toBinaryString(n),
        isHighlighted: idx === i,
        isResult: false,
      }))

      newSteps.push({
        numbers: currentNumbers,
        description: `Reversing ${num}: ${toBinaryString(num)} → ${toBinaryString(result)} (${result})`,
        code: `# Reverse bits of ${num}
Original:  ${toBinaryString(num)}
Reversed:  ${toBinaryString(result)}
Result: ${result}`,
        result: result,
      })
    }

    return newSteps
  }

  const handleVisualize = () => {
    try {
      const numbers = arrayInput.split(",").map((num) => Number.parseInt(num.trim()))
      if (numbers.some(isNaN) || numbers.some((n) => n < 0 || n > 255)) {
        throw new Error("Please enter valid numbers between 0-255")
      }

      resetVisualization()
      setIsVisualizing(true)

      let newSteps: Step[]
      switch (selectedAlgorithm) {
        case "single-number":
          newSteps = generateSingleNumberSteps(numbers)
          break
        case "count-bits":
          newSteps = generateCountBitsSteps(numbers)
          break
        case "power-of-two":
          newSteps = generatePowerOfTwoSteps(numbers)
          break
        case "reverse-bits":
          newSteps = generateReverseBitsSteps(numbers)
          break
        default:
          newSteps = []
      }

      setSteps(newSteps)
      setIsVisualizing(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Please enter valid numbers")
    }
  }

  const getFullCode = () => {
    switch (selectedAlgorithm) {
      case "single-number":
        return `def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result`

      case "count-bits":
        return `def count_bits(n):
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count

def count_all_bits(nums):
    return [count_bits(num) for num in nums]`

      case "power-of-two":
        return `def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

def check_all_powers(nums):
    return [is_power_of_two(num) for num in nums]`

      case "reverse-bits":
        return `def reverse_bits(n):
    result = 0
    for i in range(8):  # 8-bit numbers
        result = (result << 1) | (n & 1)
        n >>= 1
    return result

def reverse_all_bits(nums):
    return [reverse_bits(num) for num in nums]`

      default:
        return ""
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
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <Binary className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Bit Manipulation
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Algorithm Selection */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Algorithm</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedAlgorithm("single-number")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "single-number"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Single Number
            </button>
            <button
              onClick={() => setSelectedAlgorithm("count-bits")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "count-bits"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Count Set Bits
            </button>
            <button
              onClick={() => setSelectedAlgorithm("power-of-two")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "power-of-two"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Power of Two
            </button>
            <button
              onClick={() => setSelectedAlgorithm("reverse-bits")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "reverse-bits"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Reverse Bits
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Input</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="array-input" className="block text-sm font-medium text-gray-700 mb-2">
                Numbers (0-255, comma-separated)
              </label>
              <input
                id="array-input"
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500"
                placeholder={selectedAlgorithm === "single-number" ? "e.g., 2, 2, 1" : "e.g., 5, 8, 16, 3"}
              />
            </div>
            <button
              onClick={handleVisualize}
              disabled={isVisualizing}
              className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVisualizing ? "Visualizing..." : "Visualize"}
            </button>
          </div>
        </div>

        {/* Visualization Section */}
        {steps.length > 0 && (
          <div className="space-y-8">
            {/* Binary Visualization */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Binary Representation</h2>
              <div className="space-y-4">
                {steps[currentStep].numbers.map((element, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                      element.isHighlighted
                        ? "bg-yellow-100 border-2 border-yellow-500"
                        : element.isResult
                          ? "bg-green-100 border-2 border-green-500"
                          : "bg-gray-50"
                    }`}
                  >
                    <div className="w-12 text-center font-semibold">{element.value}</div>
                    <div className="font-mono text-lg">
                      {element.binaryString.split("").map((bit, bitIndex) => (
                        <span
                          key={bitIndex}
                          className={`inline-block w-6 text-center ${
                            bit === "1" ? "text-blue-600 font-bold" : "text-gray-400"
                          }`}
                        >
                          {bit}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">(Index {index})</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operation Display */}
            {steps[currentStep].operation && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Current Operation</h2>
                <div className="font-mono text-lg bg-gray-50 p-4 rounded-lg">{steps[currentStep].operation}</div>
              </div>
            )}

            {/* Result Display */}
            {steps[currentStep] && typeof steps[currentStep].result !== 'undefined' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Result</h2>
                <div className="text-2xl font-bold text-green-600">
                  {typeof steps[currentStep].result === "boolean"
                    ? steps[currentStep].result?.toString()
                    : steps[currentStep].result}
                </div>
              </div>
            )}

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
                  className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700"
                >
                  <Code className="w-5 h-5" />
                  <span>{showFullCode ? "Show Current Step" : "Show Full Code"}</span>
                </button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-800">{showFullCode ? getFullCode() : steps[currentStep].code}</code>
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default BitManipulationPage
