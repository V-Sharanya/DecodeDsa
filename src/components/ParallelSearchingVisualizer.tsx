import React from 'react';
import SearchingVisualizer from './SearchingVisualizer';
import { Info } from 'lucide-react';

// This is the "rulebook" for the props. We are telling TypeScript
// that this component MUST receive an inputArray and a targetValue.
interface ParallelSearchingVisualizerProps {
  inputArray: string;
  targetValue: number;
}

const ParallelSearchingVisualizer: React.FC<ParallelSearchingVisualizerProps> = ({ inputArray, targetValue }) => {
  const arrayLength = inputArray.split(/[\s,]+/).filter(n => n).length;
  const isLargeArray = arrayLength >= 100;

  return (
    <div className="space-y-6">
      {isLargeArray && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <strong>Large Array Detected ({arrayLength} elements)</strong>
            <p className="mt-1">
              Canvas-based visualization with zoom and pan controls is enabled. Use scroll to zoom, drag to pan, or use the control buttons.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel: Always shows Linear Search */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h3 className="text-lg font-bold text-center mb-4 text-gray-800">Linear Search</h3>
          <SearchingVisualizer
            algorithm="Linear Search"
            inputArray={inputArray}
            targetValue={targetValue}
          />
        </div>

        {/* Right Panel: Always shows Binary Search */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h3 className="text-lg font-bold text-center mb-4 text-gray-800">Binary Search</h3>
          <SearchingVisualizer
            algorithm="Binary Search"
            inputArray={inputArray}
            targetValue={targetValue}
          />
        </div>
      </div>
    </div>
  );
};

export default ParallelSearchingVisualizer;