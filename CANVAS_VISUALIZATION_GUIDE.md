# Canvas-Based Visualization for Large Arrays

## Overview

For arrays with **100 or more elements**, the sorting and searching visualizers automatically switch from DOM-based rendering to an optimized **Canvas-based visualization** with zoom and pan capabilities.

## Features

### 🔍 Automatic Detection
- Arrays with < 100 elements use standard DOM rendering
- Arrays with ≥ 100 elements automatically use Canvas rendering
- No configuration needed - it just works!

### 🎨 Color Coding (Same as Before)
All color meanings are preserved:
- **🔵 Blue (#3b82f6)**: Unsorted/Unvisited elements
- **🟡 Yellow (#eab308)**: Elements being compared
- **🔴 Red (#ef4444)**: Elements being swapped
- **🟣 Purple (#a855f7)**: Pivot element (Quick Sort) or Middle element (Binary Search)
- **🟢 Green (#22c55e)**: Sorted elements or Found target
- **⚫ Gray (#9ca3af)**: Out of range (Binary Search)

### 🎮 Interactive Controls

#### Zoom Controls
- **Mouse Wheel**: Scroll up to zoom in, scroll down to zoom out
- **Zoom In Button** (+): Increase zoom level
- **Zoom Out Button** (-): Decrease zoom level
- **Zoom Range**: 10% to 500%

#### Pan Controls
- **Click & Drag**: Click and hold, then drag to move the view
- **Pan Mode Button**: Toggle pan mode on/off
- Enabled automatically for large arrays

#### View Controls
- **Fit to View** (⊡): Automatically fit the entire array in the viewport
- **Reset View** (↺): Reset zoom to 100% and pan to origin

### 📊 Information Display
- Current zoom percentage
- Total number of elements
- Interactive hints (e.g., "Scroll to zoom • Drag to pan")

## Usage Examples

### Small Array (< 100 elements)
```javascript
// Input: "5 2 8 1 9"
// Result: Standard DOM visualization with boxes
```

### Large Array (≥ 100 elements)
```javascript
// Input: Array of 150 numbers
// Result: Canvas visualization with zoom/pan controls
```

### Generating Test Arrays

#### Random Array Generator (for testing)
```javascript
// Generate 150 random numbers between 1-1000
Array.from({length: 150}, () => Math.floor(Math.random() * 1000) + 1).join(' ')

// Generate sorted array of 200 numbers
Array.from({length: 200}, (_, i) => i + 1).join(' ')

// Generate reverse sorted array of 120 numbers
Array.from({length: 120}, (_, i) => 120 - i).join(' ')
```

## Performance Optimizations

### Viewport Culling
Only elements visible in the current viewport are rendered, improving performance for very large arrays.

### Efficient Rendering
Canvas API provides hardware-accelerated rendering, much faster than DOM manipulation for large datasets.

### Smooth Animations
- Transforms are applied at the Canvas level
- No layout recalculation overhead
- 60 FPS animation capability

## Browser Compatibility

### Desktop
- ✅ Chrome/Edge (Chromium) - Fully supported
- ✅ Firefox - Fully supported
- ✅ Safari - Fully supported
- ✅ Opera - Fully supported

### Mobile
- ✅ Mobile Chrome/Safari - Touch gestures supported
- ⚠️ Pan mode works best on tablets and desktops

## Technical Details

### Component Structure
```
ZoomableArrayCanvas.tsx
├── Canvas rendering with 2D context
├── Zoom state management (0.1x - 5x)
├── Pan state management (x, y offsets)
├── Mouse event handlers (wheel, drag)
├── Control buttons overlay
└── Info display overlay
```

### Integration Points
- `SortingVisualizer.tsx` - Sorts visualization
- `SearchingVisualizer.tsx` - Search visualization
- `ParallelSortingVisualizer.tsx` - Side-by-side comparison
- `ParallelSearchingVisualizer.tsx` - Search comparison

### Props Interface
```typescript
interface ArrayElement {
  value: number    // Element value to display
  index: number    // Element index in array
  color: string    // Hex color code (#rrggbb)
}

interface ZoomableArrayCanvasProps {
  elements: ArrayElement[]
  width?: number              // Canvas width (default: 800)
  height?: number             // Canvas height (default: 200)
  onElementClick?: (index: number) => void  // Optional click handler
}
```

## Keyboard Shortcuts (Future Enhancement)
- `+` / `=`: Zoom in
- `-` / `_`: Zoom out
- `0`: Reset view
- `F`: Fit to view
- `Space`: Toggle pan mode
- Arrow keys: Pan view

## Troubleshooting

### Issue: Canvas appears blurry
**Solution**: The canvas automatically handles high-DPI displays. If it appears blurry, try refreshing the page.

### Issue: Pan/Zoom not working
**Solution**: 
1. Ensure array has ≥ 100 elements
2. Check that pan mode is enabled (button highlighted)
3. Try clicking "Reset View" button

### Issue: Performance lag with very large arrays (1000+)
**Solution**: 
1. The viewport culling should handle this automatically
2. If still slow, try reducing the array size
3. Future: We'll add aggregated view option for 1000+ elements

### Issue: Controls not visible
**Solution**: Controls are only shown for arrays with ≥ 100 elements. For smaller arrays, use the standard DOM visualization.

## Best Practices

### For Learning
1. Start with small arrays (< 100) to understand the algorithm
2. Test with medium arrays (100-500) to see efficiency
3. Use large arrays (500+) to appreciate optimization

### For Teaching
1. Begin demonstrations with visible arrays (< 100)
2. Show the transition to Canvas mode for large datasets
3. Emphasize the importance of efficient visualization for big data

### For Testing
1. Test edge cases: exactly 100 elements
2. Test performance: 1000+ elements
3. Test on different screen sizes
4. Test zoom extremes (10% and 500%)

## Future Enhancements
- [ ] Aggregated histogram view for 1000+ elements
- [ ] Keyboard shortcuts for all controls
- [ ] Touch gestures for mobile (pinch to zoom)
- [ ] Export visualization as image/video
- [ ] Custom color themes
- [ ] Animation speed control integration
- [ ] Element highlighting on hover

## Credits
Inspired by best practices from:
- Google Chrome DevTools Performance Panel
- Observable Notebook visualizations
- D3.js zoom/pan behaviors
- Canvas API documentation (MDN)

---

**Version**: 1.0.0  
**Last Updated**: October 12, 2025  
**Author**: DecodeDSA Team
