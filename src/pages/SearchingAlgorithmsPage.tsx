import React, { useState } from 'react';
import { Search, Clock, Code2, GitCompare, Eye } from 'lucide-react';
import SearchingVisualizer from '../components/SearchingVisualizer';
import ParallelSearchingVisualizer from '../components/ParallelSearchingVisualizer';

interface SearchingAlgorithm {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  bestCase: string;
  worstCase: string;
}

const searchingAlgorithms: SearchingAlgorithm[] = [
  {
    name: 'Linear Search',
    description: 'A simple search algorithm that checks every element in the array sequentially until the target is found or the array ends.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    bestCase: 'O(1) - Target is first element',
    worstCase: 'O(n) - Target is last element or not found'
  },
  {
    name: 'Binary Search',
    description: 'An efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    bestCase: 'O(1) - Target is middle element',
    worstCase: 'O(log n) - Maximum divisions needed'
  }
];

function SearchingAlgorithmsPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SearchingAlgorithm | null>(null);
  const [selectedAlgorithm2, setSelectedAlgorithm2] = useState<SearchingAlgorithm | null>(null);
  const [inputArray, setInputArray] = useState<string>('');
  const [targetValue, setTargetValue] = useState<string>('');
  const [showVisualization, setShowVisualization] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);

  const handleAlgorithmSelect = (algorithm: SearchingAlgorithm) => {
    setSelectedAlgorithm(algorithm);
    setShowVisualization(false);
    // Set default values based on algorithm
    if (algorithm.name === 'Binary Search') {
      setInputArray('1 3 5 7 9 11 13 15 17 19');
      setTargetValue('7');
    } else {
      setInputArray('64 34 25 12 22 11 90 88');
      setTargetValue('22');
    }
  };

   const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputArray.trim() && targetValue.trim()) {
      // In comparison mode, both must be selected
      if (comparisonMode) {
        if (selectedAlgorithm && selectedAlgorithm2) {
          setShowVisualization(true);
        } else {
          alert('Please select two algorithms to compare.');
        }
      } else {
        setShowVisualization(true);
      }
    }
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Searching Algorithms Visualizer
                </h1>
                <p className="mt-2 text-gray-600">
                  {comparisonMode ? "Compare Linear Search vs. Binary Search" : "Explore how different searching algorithms find elements in arrays"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setComparisonMode(false)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  !comparisonMode ? "bg-white shadow-sm text-green-600" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Single View</span>
              </button>
              <button
                onClick={() => setComparisonMode(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  comparisonMode ? "bg-white shadow-sm text-emerald-600" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <GitCompare className="w-4 h-4" />
                <span className="text-sm font-medium">Compare</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {searchingAlgorithms.map((algorithm) => (
            <div
              key={algorithm.name}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 transform hover:-translate-y-1 ${
                  comparisonMode
                    ? selectedAlgorithm?.name === algorithm.name
                      ? "border-green-500 ring-2 ring-green-200" 
                      : selectedAlgorithm2?.name === algorithm.name
                      ? "border-purple-600 ring-2 ring-purple-200" 
                      : "border-gray-200 hover:border-green-300"
                    : selectedAlgorithm?.name === algorithm.name
                    ? "border-green-500 ring-2 ring-green-200" 
                    : "border-gray-200 hover:border-green-300"
                }`}
              onClick={() =>{
                if(comparisonMode){
                  if(!selectedAlgorithm){
                    setSelectedAlgorithm(algorithm)
                  }
                  else if(!selectedAlgorithm2 &&  algorithm.name !== selectedAlgorithm.name)
                    setSelectedAlgorithm2(algorithm)
                  else if(selectedAlgorithm.name === algorithm.name)
                    setSelectedAlgorithm(null);
                  else if(selectedAlgorithm2?.name === algorithm.name)
                    setSelectedAlgorithm2(null);
                  else
                    setSelectedAlgorithm2(algorithm);
                }
                else
                  handleAlgorithmSelect(algorithm);
              } }
            >
            <div className = "p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{algorithm.name}</h3>
              <div className="flex items-center space-x-2">
                {/* Badge for Algorithm 1 */}
                {comparisonMode && selectedAlgorithm?.name === algorithm.name && (
                  <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    Algorithm 1
                  </div>
                )}
                {/* Badge for Algorithm 2 */}
                {comparisonMode && selectedAlgorithm2?.name === algorithm.name && (
                  <div className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                    Algorithm 2
                  </div>
                )}
                <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">{algorithm.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Time Complexity</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">{algorithm.timeComplexity}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Code2 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Space Complexity</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{algorithm.spaceComplexity}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-green-700">Best Case:</span>
                    <span className="text-gray-600 ml-2">{algorithm.bestCase}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-red-700">Worst Case:</span>
                    <span className="text-gray-600 ml-2">{algorithm.worstCase}</span>
                  </div>
                </div>
              </div>
              </div>
          ))}
        </div>

        {selectedAlgorithm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                 {comparisonMode ? "Compare Searching Algorithms" : `Visualize ${selectedAlgorithm.name}`}
              </h3>
              
              {selectedAlgorithm.name === 'Binary Search' && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Binary Search requires a sorted array. The array will be automatically sorted if needed.
                  </p>
                </div>
              )}

              <form onSubmit={handleInputSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="array-input" className="block text-sm font-medium text-gray-700 mb-2">
                      Array Elements
                    </label>
                    <input
                      id="array-input"
                      type="text"
                      value={inputArray}
                      onChange={(e) => setInputArray(e.target.value)}
                      placeholder="Enter array (e.g., 64 34 25 12 22 11 90)"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="target-input" className="block text-sm font-medium text-gray-700 mb-2">
                      Target Value
                    </label>
                    <input
                      id="target-input"
                      type="text"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="Enter target value"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
                
                <p className="text-sm text-gray-500">
                  💡 <strong>Tip:</strong> For arrays with 100+ elements, zoom and pan controls will be automatically enabled for better visualization.
                </p>
                
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Search className="w-5 h-5 mr-2" />
                   {comparisonMode ? "Start Comparison" : "Start Search Visualization"}
                </button>
              </form>

              {showVisualization && (
                <div className="mt-8 border-t pt-8">
                  {comparisonMode && selectedAlgorithm2 ? (
                    // ---> THIS IS WHERE IT IS CALLED <---
                    <ParallelSearchingVisualizer
                      inputArray={inputArray}
                      targetValue={parseInt(targetValue)}
                    />
                  ) : !comparisonMode && selectedAlgorithm ? (
                    <SearchingVisualizer
                      algorithm={selectedAlgorithm.name}
                      inputArray={inputArray}
                      targetValue={parseInt(targetValue)}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchingAlgorithmsPage;
