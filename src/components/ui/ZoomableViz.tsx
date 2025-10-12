import React, { useRef, useEffect } from "react"

type Props = {
  width?: number
  height?: number
  children?: React.ReactNode
  initialScale?: number
}

// Simple pan & zoom for SVG: wheel to zoom (centered at cursor), drag to pan.
export default function ZoomableViz({ width = 800, height = 400, children, initialScale = 1 }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const stateRef = useRef({ scale: initialScale, x: 0, y: 0, isPanning: false, startX: 0, startY: 0 })

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const getPoint = (clientX: number, clientY: number) => {
      const pt = svg.createSVGPoint()
      pt.x = clientX
      pt.y = clientY
      const screenCTM = svg.getScreenCTM()
      if (!screenCTM) return pt
      return pt.matrixTransform(screenCTM.inverse())
    }

    const applyTransform = () => {
      const { scale, x, y } = stateRef.current
      const g = svg.querySelector("g[data-viz-root]") as SVGGElement | null
      if (g) {
        g.setAttribute("transform", `translate(${x} ${y}) scale(${scale})`)
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const { scale } = stateRef.current
      const delta = -e.deltaY
      const zoomFactor = 1 + delta * 0.001
      const pt = getPoint(e.clientX, e.clientY)

      // Zoom around cursor: translate so that pt remains under cursor
      const newScale = Math.max(0.2, Math.min(8, scale * zoomFactor))
      const scaleRatio = newScale / scale

      // Compute new x,y
      const { x, y } = stateRef.current
      const newX = pt.x - scaleRatio * (pt.x - x)
      const newY = pt.y - scaleRatio * (pt.y - y)

      stateRef.current.scale = newScale
      stateRef.current.x = newX
      stateRef.current.y = newY
      applyTransform()
    }

    const onPointerDown = (e: PointerEvent) => {
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
      stateRef.current.isPanning = true
      stateRef.current.startX = e.clientX
      stateRef.current.startY = e.clientY
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!stateRef.current.isPanning) return
      const dx = e.clientX - stateRef.current.startX
      const dy = e.clientY - stateRef.current.startY
      stateRef.current.startX = e.clientX
      stateRef.current.startY = e.clientY

      // Adjust by current scale so panning amount feels natural
      stateRef.current.x += dx / stateRef.current.scale
      stateRef.current.y += dy / stateRef.current.scale
      applyTransform()
    }

    const onPointerUp = (e: PointerEvent) => {
      stateRef.current.isPanning = false
      ;(e.target as Element).releasePointerCapture?.(e.pointerId)
    }

    svg.addEventListener("wheel", onWheel, { passive: false })
    svg.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)

    // initial transform
    applyTransform()

    return () => {
      svg.removeEventListener("wheel", onWheel)
      svg.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [])

  return (
    <div className="border rounded bg-white shadow-sm" style={{ width }}>
      <svg ref={svgRef} width={width} height={height} className="block touch-pan-y">
        <g data-viz-root>{children}</g>
      </svg>
    </div>
  )
}
