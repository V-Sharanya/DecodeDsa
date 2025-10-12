import React, { useRef } from "react"
import ZoomableViz from "../components/ui/ZoomableViz"

const ZoomableVizDemo = () => {
  const rootRef = useRef<SVGGElement | null>(null)

  const reset = () => {
    const svg = document.querySelector("svg")
    if (!svg) return
    const g = svg.querySelector("g[data-viz-root]") as SVGGElement | null
    if (g) g.setAttribute("transform", `translate(0 0) scale(1)`)
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Zoomable Visualization Demo</h2>
      <div className="mb-3">
        <button onClick={reset} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">Reset</button>
      </div>

      <ZoomableViz width={900} height={450}>
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0 L0 0 0 40" stroke="#e5e7eb" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x={-2000} y={-2000} width={4000} height={4000} fill="url(#grid)" />

        {/* sample nodes */}
        <g ref={rootRef}>
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i} transform={`translate(${i * 120 + 80} ${120 + (i % 3) * 60})`}>
              <circle r={36} fill={i % 2 ? "#6366f1" : "#06b6d4"} />
              <text x={0} y={6} textAnchor="middle" fill="#fff" fontSize={12} style={{ pointerEvents: "none" }}>
                Node {i + 1}
              </text>
            </g>
          ))}
        </g>
      </ZoomableViz>
    </div>
  )
}

export default ZoomableVizDemo
