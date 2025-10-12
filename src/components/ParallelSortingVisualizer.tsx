"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { ArrowUpDown, Code, Play, Pause, RotateCcw, Zap } from "lucide-react"
import { generateSteps, type Step } from "../utils/sortingAlgorithms"
import ZoomableArrayCanvas from "./ZoomableArrayCanvas"

interface ParallelSortingVisualizerProps {
  algorithm1: string
  algorithm2: string
  inputArray: string
}

interface SortResult {
  comparisons: number
  swaps: number
  steps: number
}

const ParallelSortingVisualizer: React.FC<ParallelSortingVisualizerProps> = ({ 
  algorithm1, 
  algorithm2, 
  inputArray 
}) => {
  const [steps1, setSteps1] = useState<Step[]>([])
  const [steps2, setSteps2] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(1000) // milliseconds
  const [sortResult1, setSortResult1] = useState<SortResult | null>(null)
  const [sortResult2, setSortResult2] = useState<SortResult | null>(null)

  useEffect(() => {
    const array = inputArray
      .split(/[\s,]+/)
      .filter(n => n)
      .map(Number)
      .filter((n) => !isNaN(n))
    
    const newSteps1 = generateSteps(algorithm1, array)
    const newSteps2 = generateSteps(algorithm2, array)
    
    setSteps1(newSteps1)
    setSteps2(newSteps2)
    setCurrentStep(0)

    // Calculate metrics
    const comparisons1 = newSteps1.filter((step) => step.comparing?.length).length
    const swaps1 = newSteps1.filter((step) => step.swapping?.length).length
    setSortResult1({ comparisons: comparisons1, swaps: swaps1, steps: newSteps1.length })

    const comparisons2 = newSteps2.filter((step) => step.comparing?.length).length
    const swaps2 = newSteps2.filter((step) => step.swapping?.length).length
    setSortResult2({ comparisons: comparisons2, swaps: swaps2, steps: newSteps2.length })
  }, [algorithm1, algorithm2, inputArray])

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < Math.max(steps1.length, steps2.length) - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1)
      }, playSpeed)
    } else if (currentStep >= Math.max(steps1.length, steps2.length) - 1) {
      setIsPlaying(false)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, steps1.length, steps2.length, playSpeed])

  const handleNext = () => {
    if (currentStep < Math.max(steps1.length, steps2.length) - 1) {
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

  const getElementColor = (index: number, steps: Step[], stepIndex: number): string => {
    const step = steps[stepIndex]
    if (!step) return "bg-blue-500"

    if (step.sorted?.includes(index)) return "bg-green-500"
    if (step.swapping?.includes(index)) return "bg-red-500"
    if (step.comparing?.includes(index)) return "bg-yellow-500"
    if (step.pivot === index) return "bg-purple-500"

    return "bg-blue-500"
  }

  const getElementColorHex = (index: number, steps: Step[], stepIndex: number): string => {
    const step = steps[stepIndex]
    if (!step) return "#3b82f6" // blue-500

    if (step.sorted?.includes(index)) return "#22c55e" // green-500
    if (step.swapping?.includes(index)) return "#ef4444" // red-500
    if (step.comparing?.includes(index)) return "#eab308" // yellow-500
    if (step.pivot === index) return "#a855f7" // purple-500

    return "#3b82f6" // blue-500
  }

  const prepareCanvasElements = (steps: Step[], stepIndex: number) => {
    const step = steps[stepIndex]
    if (!step) return []

    return step.array.map((value, index) => ({
      value,
      index,
      color: getElementColorHex(index, steps, stepIndex),
    }))
  }

  if (steps1.length === 0 || steps2.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading parallel visualization...</div>
      </div>
    )
  }

  const maxSteps = Math.max(steps1.length, steps2.length)
  const currentStep1 = Math.min(currentStep, steps1.length - 1)
  const currentStep2 = Math.min(currentStep, steps2.length - 1)

  return (
    <div className="space-y-6">
      {/* Comparison Header */}
      <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Parallel Algorithm Comparison</h3>
                <p className="text-gray-600">{algorithm1} vs {algorithm2}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-sm font-medium text-gray-700 mb-1">{algorithm1}</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{sortResult1?.comparisons || 0}</div>
                    <div className="text-gray-500">Comparisons</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">{sortResult1?.swaps || 0}</div>
                    <div className="text-gray-500">Swaps</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{sortResult1?.steps || 0}</div>
                    <div className="text-gray-500">Steps</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-sm font-medium text-gray-700 mb-1">{algorithm2}</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{sortResult2?.comparisons || 0}</div>
                    <div className="text-gray-500">Comparisons</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">{sortResult2?.swaps || 0}</div>
                    <div className="text-gray-500">Swaps</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{sortResult2?.steps || 0}</div>
                    <div className="text-gray-500">Steps</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parallel Array Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Algorithm 1 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <ArrowUpDown className="w-5 h-5 mr-2 text-blue-600" />
              {algorithm1}
            </h3>
            <Badge variant="default">
              Step {currentStep1 + 1} of {steps1.length}
            </Badge>
          </div>

          {steps1[currentStep1]?.array.length >= 100 ? (
            <div className="flex justify-center">
              <ZoomableArrayCanvas
                elements={prepareCanvasElements(steps1, currentStep1)}
                width={Math.min(500, typeof window !== 'undefined' ? window.innerWidth / 2 - 100 : 500)}
                height={180}
              />
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg min-h-[80px]">
              {steps1[currentStep1]?.array.map((value, index) => (
                <div key={index} className="relative">
                  <div
                    className={`w-12 h-12 flex items-center justify-center text-white rounded-md font-semibold transition-all duration-300 ${getElementColor(index, steps1, currentStep1)}`}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1">{index}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">{steps1[currentStep1]?.description}</p>
          </div>
        </div>

        {/* Algorithm 2 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <ArrowUpDown className="w-5 h-5 mr-2 text-purple-600" />
              {algorithm2}
            </h3>
            <Badge variant="default">
              Step {currentStep2 + 1} of {steps2.length}
            </Badge>
          </div>

          {steps2[currentStep2]?.array.length >= 100 ? (
            <div className="flex justify-center">
              <ZoomableArrayCanvas
                elements={prepareCanvasElements(steps2, currentStep2)}
                width={Math.min(500, typeof window !== 'undefined' ? window.innerWidth / 2 - 100 : 500)}
                height={180}
              />
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg min-h-[80px]">
              {steps2[currentStep2]?.array.map((value, index) => (
                <div key={index} className="relative">
                  <div
                    className={`w-12 h-12 flex items-center justify-center text-white rounded-md font-semibold transition-all duration-300 ${getElementColor(index, steps2, currentStep2)}`}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1">{index}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 p-3 bg-purple-50 rounded-md">
            <p className="text-sm text-purple-800">{steps2[currentStep2]?.description}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm bg-white rounded-lg p-4 shadow-sm border">
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

      {/* Enhanced Controls */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button onClick={handleReset} variant="secondary" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button onClick={handlePrevious} disabled={currentStep === 0} variant="secondary" size="sm">
              Previous
            </Button>
            <Button 
              onClick={togglePlay} 
              variant={isPlaying ? "secondary" : "primary"}
              size="sm"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button onClick={handleNext} disabled={currentStep === maxSteps - 1} size="sm">
              Next
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Speed:</label>
              <select 
                value={playSpeed} 
                onChange={(e) => setPlaySpeed(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value={2000}>0.5x</option>
                <option value={1000}>1x</option>
                <option value={500}>2x</option>
                <option value={250}>4x</option>
              </select>
            </div>
            <Badge variant="default" className="text-sm">
              Step {currentStep + 1} of {maxSteps}
            </Badge>
          </div>
        </div>
      </div>

      {/* Code Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Code className="w-5 h-5 mr-2" />
              {algorithm1} Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm font-mono">
              <code>{steps1[currentStep1]?.code}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Code className="w-5 h-5 mr-2" />
              {algorithm2} Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm font-mono">
              <code>{steps2[currentStep2]?.code}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ParallelSortingVisualizer