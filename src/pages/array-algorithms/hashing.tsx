"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Hash, ChevronLeft, ChevronRight, Code } from "lucide-react"
import { Button } from "../../components/ui/button"

interface ArrayElement {
  value: number | string
  isHighlighted: boolean
  isTarget: boolean
  isFrequent: boolean
}

interface HashMapEntry {
  key: string
  value: number
  isActive: boolean
}

interface Step {
  array: ArrayElement[]
  hashMap: HashMapEntry[]
  description: string
  code: string
  result?: string
}

function HashingPage() {
  const [arrayInput, setArrayInput] = useState<string>("")
  const [target, setTarget] = useState<number>(0)
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"frequency" | "two-sum" | "duplicates" | "first-unique">(
    "frequency",
  )
  const [showFullCode, setShowFullCode] = useState<boolean>(false)

  const resetVisualization = () => {
    setSteps([])
    setCurrentStep(0)
    setIsVisualizing(false)
    setShowFullCode(false)
  }

  const generateFrequencySteps = (array: (number | string)[]) => {
    const newSteps: Step[] = []
    const hashMap = new Map<string, number>()

    // Initial state
    newSteps.push({
      array: array.map((item) => ({
        value: item,
        isHighlighted: false,
        isTarget: false,
        isFrequent: false,
      })),
      hashMap: [],
      description: "Initialize empty hash map for frequency counting",
      code: `# Initialize hash map
frequency_map = {}`,
    })

    // Process each element
    for (let i = 0; i < array.length; i++) {
      const element = String(array[i])
      const currentCount = hashMap.get(element) || 0
      hashMap.set(element, currentCount + 1)

      const currentArray = array.map((item, idx) => ({
        value: item,
        isHighlighted: idx === i,
        isTarget: false,
        isFrequent: false,
      }))

      const currentHashMap = Array.from(hashMap.entries()).map(([key, value]) => ({
        key,
        value,
        isActive: key === element,
      }))

      newSteps.push({
        array: currentArray,
        hashMap: currentHashMap,
        description: `Processing element '${element}': frequency = ${hashMap.get(element)}`,
        code: `# Update frequency count
if element in frequency_map:
    frequency_map[element] += 1
else:
    frequency_map[element] = 1`,
      })
    }

    // Final result
    const finalHashMap = Array.from(hashMap.entries()).map(([key, value]) => ({
      key,
      value,
      isActive: false,
    }))

    newSteps.push({
      array: array.map((item) => ({
        value: item,
        isHighlighted: false,
        isTarget: false,
        isFrequent: false,
      })),
      hashMap: finalHashMap,
      description: "Frequency counting complete",
      code: `# Return frequency map
return frequency_map`,
      result: `Frequencies: ${Array.from(hashMap.entries())
        .map(([k, v]) => `${k}:${v}`)
        .join(", ")}`,
    })

    return newSteps
  }

  const generateTwoSumHashSteps = (array: number[]) => {
    const newSteps: Step[] = []
    const hashMap = new Map<number, number>()

    // Initial state
    newSteps.push({
      array: array.map((num) => ({
        value: num,
        isHighlighted: false,
        isTarget: false,
        isFrequent: false,
      })),
      hashMap: [],
      description: `Looking for two numbers that sum to ${target}`,
      code: `# Initialize hash map
num_map = {}
target = ${target}`,
    })

    // Process each element
    for (let i = 0; i < array.length; i++) {
      const complement = target - array[i]

      if (hashMap.has(complement)) {
        // Found the pair
        const complementIndex = hashMap.get(complement)!
        const currentArray = array.map((num, idx) => ({
          value: num,
          isHighlighted: idx === i || idx === complementIndex,
          isTarget: idx === i || idx === complementIndex,
          isFrequent: false,
        }))

        const currentHashMap = Array.from(hashMap.entries()).map(([key, value]) => ({
          key: String(key),
          value,
          isActive: key === complement,
        }))

        newSteps.push({
          array: currentArray,
          hashMap: currentHashMap,
          description: `Found pair: ${array[complementIndex]} + ${array[i]} = ${target}`,
          code: `# Found the complement
return [num_map[complement], i]`,
          result: `Indices: [${complementIndex}, ${i}]`,
        })
        return newSteps
      }

      // Add current number to hash map
      hashMap.set(array[i], i)

      const currentArray = array.map((num, idx) => ({
        value: num,
        isHighlighted: idx === i,
        isTarget: false,
        isFrequent: false,
      }))

      const currentHashMap = Array.from(hashMap.entries()).map(([key, value]) => ({
        key: String(key),
        value,
        isActive: key === array[i],
      }))

      newSteps.push({
        array: currentArray,
        hashMap: currentHashMap,
        description: `Checking ${array[i]}, looking for complement ${complement}`,
        code: `# Check for complement
complement = target - array[i]
if complement in num_map:
    return [num_map[complement], i]
num_map[array[i]] = i`,
      })
    }

    // No solution found
    newSteps.push({
      array: array.map((num) => ({
        value: num,
        isHighlighted: false,
        isTarget: false,
        isFrequent: false,
      })),
      hashMap: Array.from(hashMap.entries()).map(([key, value]) => ({
        key: String(key),
        value,
        isActive: false,
      })),
      description: "No two numbers sum to target",
      code: `# No solution found
return []`,
      result: "No solution",
    })

    return newSteps
  }

  const generateDuplicatesSteps = (array: (number | string)[]) => {
    const newSteps: Step[] = []
    const hashMap = new Map<string, number>()
    const duplicates: string[] = []

    // Initial state
    newSteps.push({
      array: array.map((item) => ({
        value: item,
        isHighlighted: false,
        isTarget: false,
        isFrequent: false,
      })),
      hashMap: [],
      description: "Finding duplicates using hash map",
      code: `# Initialize hash map
seen = {}
duplicates = []`,
    })

    // Process each element
    for (let i = 0; i < array.length; i++) {
      const element = String(array[i])
      const currentCount = hashMap.get(element) || 0
      hashMap.set(element, currentCount + 1)

      const isDuplicate = currentCount > 0
      if (isDuplicate && !duplicates.includes(element)) {
        duplicates.push(element)
      }

      const currentArray = array.map((item, idx) => ({
        value: item,
        isHighlighted: idx === i,
        isTarget: isDuplicate,
        isFrequent: duplicates.includes(String(item)),
      }))

      const currentHashMap = Array.from(hashMap.entries()).map(([key, value]) => ({
        key,
        value,
        isActive: key === element,
      }))

      newSteps.push({
        array: currentArray,
        hashMap: currentHashMap,
        description: isDuplicate ? `Found duplicate: '${element}'` : `First occurrence of '${element}'`,
        code: `# Check for duplicates
if element in seen:
    duplicates.append(element)
seen[element] = seen.get(element, 0) + 1`,
      })
    }

    // Final result
    newSteps.push({
      array: array.map((item) => ({
        value: item,
        isHighlighted: false,
        isTarget: false,
        isFrequent: duplicates.includes(String(item)),
      })),
      hashMap: Array.from(hashMap.entries()).map(([key, value]) => ({
        key,
        value,
        isActive: false,
      })),
      description: "Duplicate detection complete",
      code: `# Return duplicates
return duplicates`,
      result: `Duplicates: [${duplicates.join(", ")}]`,
    })

    return newSteps
  }

  const generateFirstUniqueSteps = (array: (number | string)[]) => {
    const newSteps: Step[] = []
    const hashMap = new Map<string, number>()

    // First pass: count frequencies
    for (let i = 0; i < array.length; i++) {
      const element = String(array[i])
      hashMap.set(element, (hashMap.get(element) || 0) + 1)
    }

    // Initial state
    newSteps.push({
      array: array.map((item) => ({
        value: item,
        isHighlighted: false,
        isTarget: false,
        isFrequent: false,
      })),
      hashMap: Array.from(hashMap.entries()).map(([key, value]) => ({
        key,
        value,
        isActive: false,
      })),
      description: "Frequency map built, now finding first unique element",
      code: `# Build frequency map
for element in array:
    freq_map[element] = freq_map.get(element, 0) + 1`,
    })

    // Second pass: find first unique
    for (let i = 0; i < array.length; i++) {
      const element = String(array[i])
      const frequency = hashMap.get(element)!

      const currentArray = array.map((item, idx) => ({
        value: item,
        isHighlighted: idx === i,
        isTarget: frequency === 1 && idx === i,
        isFrequent: hashMap.get(String(item))! > 1,
      }))

      const currentHashMap = Array.from(hashMap.entries()).map(([key, value]) => ({
        key,
        value,
        isActive: key === element,
      }))

      if (frequency === 1) {
        newSteps.push({
          array: currentArray,
          hashMap: currentHashMap,
          description: `Found first unique element: '${element}'`,
          code: `# Found first unique element
if freq_map[element] == 1:
    return element`,
          result: `First unique: ${element}`,
        })
        return newSteps
      }

      newSteps.push({
        array: currentArray,
        hashMap: currentHashMap,
        description: `'${element}' appears ${frequency} times (not unique)`,
        code: `# Check if element is unique
if freq_map[element] == 1:
    return element`,
      })
    }

    // No unique element found
    newSteps.push({
      array: array.map((item) => ({
        value: item,
        isHighlighted: false,
        isTarget: false,
        isFrequent: true,
      })),
      hashMap: Array.from(hashMap.entries()).map(([key, value]) => ({
        key,
        value,
        isActive: false,
      })),
      description: "No unique element found",
      code: `# No unique element
return None`,
      result: "No unique element",
    })

    return newSteps
  }

  const handleVisualize = () => {
    try {
      let processedArray: (number | string)[]

      if (selectedAlgorithm === "two-sum") {
        processedArray = arrayInput.split(",").map((num) => {
          const parsed = Number.parseInt(num.trim())
          if (isNaN(parsed)) throw new Error("Invalid number")
          return parsed
        })
      } else {
        // For other algorithms, allow both numbers and strings
        processedArray = arrayInput.split(",").map((item) => {
          const trimmed = item.trim()
          const parsed = Number.parseInt(trimmed)
          return isNaN(parsed) ? trimmed : parsed
        })
      }

      resetVisualization()
      setIsVisualizing(true)

      let newSteps: Step[]
      switch (selectedAlgorithm) {
        case "frequency":
          newSteps = generateFrequencySteps(processedArray)
          break
        case "two-sum":
          newSteps = generateTwoSumHashSteps(processedArray as number[])
          break
        case "duplicates":
          newSteps = generateDuplicatesSteps(processedArray)
          break
        case "first-unique":
          newSteps = generateFirstUniqueSteps(processedArray)
          break
        default:
          newSteps = []
      }

      setSteps(newSteps)
      setIsVisualizing(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Please enter valid input")
    }
  }

  const getFullCode = () => {
    switch (selectedAlgorithm) {
      case "frequency":
        return `def count_frequency(array):
    # Initialize hash map
    frequency_map = {}
    
    # Count frequencies
    for element in array:
        if element in frequency_map:
            frequency_map[element] += 1
        else:
            frequency_map[element] = 1
    
    return frequency_map`

      case "two-sum":
        return `def two_sum_hash(array, target):
    # Initialize hash map
    num_map = {}
    
    # Process each element
    for i, num in enumerate(array):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    
    return []  # No solution found`

      case "duplicates":
        return `def find_duplicates(array):
    # Initialize hash map
    seen = {}
    duplicates = []
    
    # Find duplicates
    for element in array:
        if element in seen:
            if element not in duplicates:
                duplicates.append(element)
        seen[element] = seen.get(element, 0) + 1
    
    return duplicates`

      case "first-unique":
        return `def first_unique_element(array):
    # Build frequency map
    freq_map = {}
    for element in array:
        freq_map[element] = freq_map.get(element, 0) + 1
    
    # Find first unique element
    for element in array:
        if freq_map[element] == 1:
            return element
    
    return None  # No unique element`

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
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Hashing & Frequency Count
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
              onClick={() => setSelectedAlgorithm("frequency")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "frequency"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Frequency Count
            </button>
            <button
              onClick={() => setSelectedAlgorithm("two-sum")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "two-sum"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Two Sum (Hash)
            </button>
            <button
              onClick={() => setSelectedAlgorithm("duplicates")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "duplicates"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Find Duplicates
            </button>
            <button
              onClick={() => setSelectedAlgorithm("first-unique")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "first-unique"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              First Unique
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Input</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="array-input" className="block text-sm font-medium text-gray-700 mb-2">
                Array (comma-separated {selectedAlgorithm === "two-sum" ? "numbers" : "values"})
              </label>
              <input
                id="array-input"
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500"
                placeholder={selectedAlgorithm === "two-sum" ? "e.g., 2, 7, 11, 15" : "e.g., a, b, c, a, b"}
              />
            </div>
            {selectedAlgorithm === "two-sum" && (
              <div>
                <label htmlFor="target-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Sum
                </label>
                <input
                  id="target-input"
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number.parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500"
                  placeholder="Enter target sum"
                />
              </div>
            )}
            <button
              onClick={handleVisualize}
              disabled={isVisualizing}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div
                    key={index}
                    className={`w-16 h-16 flex items-center justify-center rounded-lg text-lg font-semibold transition-all duration-200 ${
                      element.isTarget
                        ? "bg-green-500 text-white"
                        : element.isFrequent
                          ? "bg-red-500 text-white"
                          : element.isHighlighted
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {element.value}
                  </div>
                ))}
              </div>
            </div>

            {/* Hash Map Visualization */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hash Map</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {steps[currentStep].hashMap.map((entry, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      entry.isActive ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-700">{entry.key}</div>
                    <div className="text-lg font-bold text-red-600">{entry.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Step Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700">{steps[currentStep].description}</p>
                    {steps[currentStep].result && (
                      <p className="text-green-600 font-semibold mt-2">{steps[currentStep].result}</p>
                    )}
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
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
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

export default HashingPage
