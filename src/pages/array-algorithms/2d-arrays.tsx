"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Grid, ChevronLeft, ChevronRight, Code } from "lucide-react"
import { Button } from "../../components/ui/button"

interface MatrixCell {
  value: number
  isHighlighted: boolean
  isVisited: boolean
  isResult: boolean
  row: number
  col: number
}

interface Step {
  matrix: MatrixCell[][]
  description: string
  code: string
  result?: number[] | string
  currentPosition?: { row: number; col: number }
}

function TwoDArraysPage() {
  const [matrixInput, setMatrixInput] = useState<string>("")
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"spiral" | "rotate" | "search" | "set-zeros">("spiral")
  const [showFullCode, setShowFullCode] = useState<boolean>(false)
  const [searchTarget, setSearchTarget] = useState<number>(0)

  const resetVisualization = () => {
    setSteps([])
    setCurrentStep(0)
    setIsVisualizing(false)
    setShowFullCode(false)
  }

  const parseMatrix = (input: string): number[][] => {
    const rows = input.trim().split("\n")
    return rows.map((row) => row.split(",").map((cell) => Number.parseInt(cell.trim())))
  }

  const createMatrixCells = (matrix: number[][]): MatrixCell[][] => {
    return matrix.map((row, rowIndex) =>
      row.map((value, colIndex) => ({
        value,
        isHighlighted: false,
        isVisited: false,
        isResult: false,
        row: rowIndex,
        col: colIndex,
      })),
    )
  }

  const generateSpiralSteps = (matrix: number[][]) => {
    const newSteps: Step[] = []
    const rows = matrix.length
    const cols = matrix[0].length
    const result: number[] = []

    let top = 0,
      bottom = rows - 1,
      left = 0,
      right = cols - 1

    // Initial state
    newSteps.push({
      matrix: createMatrixCells(matrix),
      description: "Start spiral traversal from top-left corner",
      code: `# Initialize boundaries
top, bottom = 0, ${rows - 1}
left, right = 0, ${cols - 1}
result = []`,
    })

    while (top <= bottom && left <= right) {
      // Traverse right
      for (let col = left; col <= right; col++) {
        result.push(matrix[top][col])

        const currentMatrix = createMatrixCells(matrix)
        currentMatrix[top][col].isHighlighted = true

        // Mark all previously visited cells
        for (let i = 0; i < result.length - 1; i++) {
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              if (matrix[r][c] === result[i] && !currentMatrix[r][c].isHighlighted) {
                currentMatrix[r][c].isVisited = true
                break
              }
            }
          }
        }

        newSteps.push({
          matrix: currentMatrix,
          description: `Moving right: add ${matrix[top][col]} to result`,
          code: `# Traverse right
for col in range(left, right + 1):
    result.append(matrix[top][col])`,
          result: [...result],
          currentPosition: { row: top, col },
        })
      }
      top++

      // Traverse down
      for (let row = top; row <= bottom; row++) {
        result.push(matrix[row][right])

        const currentMatrix = createMatrixCells(matrix)
        currentMatrix[row][right].isHighlighted = true

        // Mark visited cells
        let resultIndex = 0
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (resultIndex < result.length - 1 && matrix[r][c] === result[resultIndex]) {
              if (!currentMatrix[r][c].isHighlighted) {
                currentMatrix[r][c].isVisited = true
              }
              resultIndex++
            }
          }
        }

        newSteps.push({
          matrix: currentMatrix,
          description: `Moving down: add ${matrix[row][right]} to result`,
          code: `# Traverse down
for row in range(top, bottom + 1):
    result.append(matrix[row][right])`,
          result: [...result],
          currentPosition: { row, col: right },
        })
      }
      right--

      // Traverse left
      if (top <= bottom) {
        for (let col = right; col >= left; col--) {
          result.push(matrix[bottom][col])

          const currentMatrix = createMatrixCells(matrix)
          currentMatrix[bottom][col].isHighlighted = true

          newSteps.push({
            matrix: currentMatrix,
            description: `Moving left: add ${matrix[bottom][col]} to result`,
            code: `# Traverse left
for col in range(right, left - 1, -1):
    result.append(matrix[bottom][col])`,
            result: [...result],
            currentPosition: { row: bottom, col },
          })
        }
        bottom--
      }

      // Traverse up
      if (left <= right) {
        for (let row = bottom; row >= top; row--) {
          result.push(matrix[row][left])

          const currentMatrix = createMatrixCells(matrix)
          currentMatrix[row][left].isHighlighted = true

          newSteps.push({
            matrix: currentMatrix,
            description: `Moving up: add ${matrix[row][left]} to result`,
            code: `# Traverse up
for row in range(bottom, top - 1, -1):
    result.append(matrix[row][left])`,
            result: [...result],
            currentPosition: { row, col: left },
          })
        }
        left++
      }
    }

    // Final result
    const finalMatrix = createMatrixCells(matrix)
    finalMatrix.forEach((row) => row.forEach((cell) => (cell.isResult = true)))

    newSteps.push({
      matrix: finalMatrix,
      description: `Spiral traversal complete: [${result.join(", ")}]`,
      code: `# Return spiral order
return result`,
      result,
    })

    return newSteps
  }

  const generateRotateSteps = (matrix: number[][]) => {
    const newSteps: Step[] = []
    const n = matrix.length
    const rotated = matrix.map((row) => [...row])

    // Initial state
    newSteps.push({
      matrix: createMatrixCells(matrix),
      description: "Rotate matrix 90 degrees clockwise",
      code: `# Rotate matrix 90 degrees clockwise
# Step 1: Transpose the matrix
# Step 2: Reverse each row`,
    })

    // Step 1: Transpose
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        ;[rotated[i][j], rotated[j][i]] = [rotated[j][i], rotated[i][j]]
      }
    }

    const transposedMatrix = createMatrixCells(rotated)
    newSteps.push({
      matrix: transposedMatrix,
      description: "Step 1: Transpose the matrix (swap rows and columns)",
      code: `# Transpose matrix
for i in range(n):
    for j in range(i + 1, n):
        matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]`,
    })

    // Step 2: Reverse each row
    for (let i = 0; i < n; i++) {
      rotated[i].reverse()
    }

    const finalMatrix = createMatrixCells(rotated)
    finalMatrix.forEach((row) => row.forEach((cell) => (cell.isResult = true)))

    newSteps.push({
      matrix: finalMatrix,
      description: "Step 2: Reverse each row to complete 90° clockwise rotation",
      code: `# Reverse each row
for i in range(n):
    matrix[i].reverse()`,
    })

    return newSteps
  }

  const generateSearchSteps = (matrix: number[][], target: number) => {
    const newSteps: Step[] = []
    const rows = matrix.length
    const cols = matrix[0].length

    // Initial state
    newSteps.push({
      matrix: createMatrixCells(matrix),
      description: `Search for ${target} in sorted 2D matrix`,
      code: `# Search in 2D matrix
# Start from top-right corner
target = ${target}
row, col = 0, ${cols - 1}`,
    })

    let row = 0,
      col = cols - 1
    let found = false

    while (row < rows && col >= 0) {
      const currentMatrix = createMatrixCells(matrix)
      currentMatrix[row][col].isHighlighted = true

      if (matrix[row][col] === target) {
        currentMatrix[row][col].isResult = true
        found = true

        newSteps.push({
          matrix: currentMatrix,
          description: `Found ${target} at position (${row}, ${col})!`,
          code: `# Found target!
return True`,
          currentPosition: { row, col },
        })
        break
      } else if (matrix[row][col] > target) {
        newSteps.push({
          matrix: currentMatrix,
          description: `${matrix[row][col]} > ${target}, move left`,
          code: `# Current value > target, move left
col -= 1`,
          currentPosition: { row, col },
        })
        col--
      } else {
        newSteps.push({
          matrix: currentMatrix,
          description: `${matrix[row][col]} < ${target}, move down`,
          code: `# Current value < target, move down
row += 1`,
          currentPosition: { row, col },
        })
        row++
      }
    }

    if (!found) {
      newSteps.push({
        matrix: createMatrixCells(matrix),
        description: `${target} not found in matrix`,
        code: `# Target not found
return False`,
      })
    }

    return newSteps
  }

  const handleVisualize = () => {
    try {
      const matrix = parseMatrix(matrixInput)
      if (matrix.length === 0 || matrix.some((row) => row.some(isNaN))) {
        throw new Error("Invalid matrix format")
      }

      // Validate matrix dimensions
      const cols = matrix[0].length
      if (matrix.some((row) => row.length !== cols)) {
        throw new Error("All rows must have the same number of columns")
      }

      resetVisualization()
      setIsVisualizing(true)

      let newSteps: Step[]
      switch (selectedAlgorithm) {
        case "spiral":
          newSteps = generateSpiralSteps(matrix)
          break
        case "rotate":
          if (matrix.length !== cols) {
            throw new Error("Matrix must be square for rotation")
          }
          newSteps = generateRotateSteps(matrix)
          break
        case "search":
          newSteps = generateSearchSteps(matrix, searchTarget)
          break
        default:
          newSteps = []
      }

      setSteps(newSteps)
      setIsVisualizing(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Please enter a valid matrix")
    }
  }

  const getFullCode = () => {
    switch (selectedAlgorithm) {
      case "spiral":
        return `def spiral_order(matrix):
    if not matrix or not matrix[0]:
        return []
    
    rows, cols = len(matrix), len(matrix[0])
    top, bottom = 0, rows - 1
    left, right = 0, cols - 1
    result = []
    
    while top <= bottom and left <= right:
        # Traverse right
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1
        
        # Traverse down
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1
        
        # Traverse left
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1
        
        # Traverse up
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1
    
    return result`

      case "rotate":
        return `def rotate_matrix(matrix):
    n = len(matrix)
    
    # Step 1: Transpose the matrix
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Step 2: Reverse each row
    for i in range(n):
        matrix[i].reverse()
    
    return matrix`

      case "search":
        return `def search_matrix(matrix, target):
    if not matrix or not matrix[0]:
        return False
    
    rows, cols = len(matrix), len(matrix[0])
    row, col = 0, cols - 1
    
    while row < rows and col >= 0:
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] > target:
            col -= 1
        else:
            row += 1
    
    return False`

      default:
        return ""
    }
  }

  // Helper type guard
  function isNumberArray(val: unknown): val is number[] {
    return Array.isArray(val) && val.every((x) => typeof x === 'number');
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
              <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
                <Grid className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                2D Arrays
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Algorithm Selection */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Algorithm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedAlgorithm("spiral")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "spiral"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Spiral Traversal
            </button>
            <button
              onClick={() => setSelectedAlgorithm("rotate")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "rotate"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Matrix Rotation
            </button>
            <button
              onClick={() => setSelectedAlgorithm("search")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedAlgorithm === "search"
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              2D Matrix Search
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Input</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="matrix-input" className="block text-sm font-medium text-gray-700 mb-2">
                Matrix (one row per line, comma-separated values)
              </label>
              <textarea
                id="matrix-input"
                value={matrixInput}
                onChange={(e) => setMatrixInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 h-32"
                placeholder={selectedAlgorithm === "rotate" ? "1,2,3\n4,5,6\n7,8,9" : "1,4,7,11\n2,5,8,12\n3,6,9,16"}
              />
            </div>
            {selectedAlgorithm === "search" && (
              <div>
                <label htmlFor="search-target" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Target
                </label>
                <input
                  id="search-target"
                  type="number"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(Number.parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter target value"
                />
              </div>
            )}
            <button
              onClick={handleVisualize}
              disabled={isVisualizing}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVisualizing ? "Visualizing..." : "Visualize"}
            </button>
          </div>
        </div>

        {/* Visualization Section */}
        {steps.length > 0 && (
          <div className="space-y-8">
            {/* Matrix Visualization */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Matrix Visualization</h2>
              <div className="flex justify-center">
                <div className="inline-block">
                  {steps[currentStep].matrix.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                      {row.map((cell, colIndex) => (
                        <div
                          key={colIndex}
                          className={`w-16 h-16 flex items-center justify-center border border-gray-300 text-lg font-semibold transition-all duration-200 ${
                            cell.isHighlighted
                              ? "bg-teal-500 text-white"
                              : cell.isResult
                                ? "bg-green-500 text-white"
                                : cell.isVisited
                                  ? "bg-teal-100 text-teal-700"
                                  : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          {cell.value}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Display */}
            {steps[currentStep] && typeof steps[currentStep].result !== 'undefined' && (() => {
              const result = steps[currentStep].result;
              return (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Result</h2>
                  <div className="text-lg font-mono bg-gray-50 p-4 rounded-lg">
                    {isNumberArray(result)
                      ? `[${result.join(", ")}]`
                      : result}
                  </div>
                </div>
              );
            })()}

            {/* Step Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Step Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700">{steps[currentStep].description}</p>
                    {steps[currentStep].currentPosition && (
                      <p className="text-sm text-gray-500 mt-2">
                        Current position: ({steps[currentStep].currentPosition!.row},{" "}
                        {steps[currentStep].currentPosition!.col})
                      </p>
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
                  className="flex items-center space-x-2 text-teal-600 hover:text-teal-700"
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

export default TwoDArraysPage
