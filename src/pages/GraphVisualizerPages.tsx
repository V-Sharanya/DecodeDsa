"use client";

import React from "react";

import { useState, useCallback, useEffect } from "react";
import {
  Network,
  Plus,
  Search,
  RotateCcw,
  Code,
  BookOpen,
  Lightbulb,
  Target,
  Clock,
  Zap,
  ArrowRight,
  Shuffle,
  Play,
  Pause,
  SkipForward,
  MapPin,
  Route,
} from "lucide-react";

// Graph data structures
interface GraphNode {
  id: string;
  value: number;
  x: number;
  y: number;
  isHighlighted?: boolean;
  isVisited?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  distance?: number;
  parent?: string | null;
  color?: string;
  level?: number;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight?: number;
  isHighlighted?: boolean;
  isVisited?: boolean;
  isDirected?: boolean;
  color?: string;
}

interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
  isWeighted: boolean;
}

type GraphType = "undirected" | "directed" | "weighted" | "dag";
type AlgorithmType =
  | "bfs"
  | "dfs"
  | "dijkstra"
  | "bellman-ford"
  | "kruskal";

const algorithmInfo: Record<
  AlgorithmType,
  {
    name: string;
    description: string;
    complexity: string;
    useCase: string;
  }
> = {
  bfs: {
    name: "Breadth-First Search",
    description:
      "Explores nodes level by level, finding shortest path in unweighted graphs.",
    complexity: "O(V + E)",
    useCase: "Shortest path, level-order traversal, connected components",
  },
  dfs: {
    name: "Depth-First Search",
    description:
      "Explores as far as possible along each branch before backtracking.",
    complexity: "O(V + E)",
    useCase: "Cycle detection, topological sorting, connected components",
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    description:
      "Finds shortest paths from source to all vertices in weighted graphs.",
    complexity: "O((V + E) log V)",
    useCase: "GPS navigation, network routing, shortest path problems",
  },
  "bellman-ford": {
    name: "Bellman-Ford Algorithm",
    description: "Finds shortest paths and detects negative cycles.",
    complexity: "O(VE)",
    useCase: "Graphs with negative weights, currency arbitrage",
  },
  kruskal: {
    name: "Kruskal's Algorithm",
    description: "Finds minimum spanning tree by sorting edges.",
    complexity: "O(E log E)",
    useCase: "Network design, clustering, minimum cost connections",
  },
};

function GraphVisualizerPage() {
  const [graph, setGraph] = useState<GraphState>({
    nodes: [],
    edges: [],
    isDirected: false,
    isWeighted: false,
  });

  const [graphType, setGraphType] = useState<GraphType>("undirected");
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmType>("bfs");
  const [nodeValue, setNodeValue] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeWeight, setEdgeWeight] = useState("");
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");

  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithmSteps, setAlgorithmSteps] = useState<any[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  // UI states
  const [operationHistory, setOperationHistory] = useState<string[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  // we only need the setter to reflect count changes in any UI that reads it later
  const [, setNodeCounter] = useState(0);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [algorithmResult, setAlgorithmResult] = useState<any>(null);
  // Keep track of a single active timer to avoid runaway loops
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper functions
  // Use a ref so IDs are unique even when generating many nodes in a loop
  const nodeIdCounterRef = React.useRef(0);
  const generateNodeId = () => {
    nodeIdCounterRef.current += 1;
    // keep external counter in sync for any UI that displays count
    setNodeCounter(nodeIdCounterRef.current);
    return `node-${nodeIdCounterRef.current}`;
  };

  const generateEdgeId = () => `edge-${Date.now()}-${Math.random()}`;

  const addToHistory = (operation: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setOperationHistory((prev) => [
      `${timestamp}: ${operation}`,
      ...prev.slice(0, 19),
    ]);
  };

  // Graph operations
  const addNode = () => {
    if (!nodeValue || isNaN(Number(nodeValue))) {
      addToHistory("❌ Error: Please enter a valid number for node value");
      return;
    }

    const value = Number(nodeValue);
    if (graph.nodes.some((node) => node.value === value)) {
      addToHistory("❌ Error: Node with this value already exists");
      return;
    }

    const newNode: GraphNode = {
      id: generateNodeId(),
      value,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      isHighlighted: true,
    };

    setGraph((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));

    addToHistory(`✅ Added node with value ${value}`);
    setNodeValue("");

    // Remove highlight after animation
    setTimeout(() => {
      setGraph((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === newNode.id ? { ...node, isHighlighted: false } : node
        ),
      }));
    }, 1000);
  };

  const addEdge = () => {
    // Only use node values for edge creation (input is value, not id)
    const fromNode = graph.nodes.find(
      (node) => node.value === Number(edgeFrom)
    );
    const toNode = graph.nodes.find((node) => node.value === Number(edgeTo));
    const weight = edgeWeight ? Number(edgeWeight) : 1;

    if (!fromNode || !toNode) {
      addToHistory("❌ Error: One or both nodes don't exist");
      return;
    }

    if (fromNode.id === toNode.id) {
      addToHistory("❌ Error: Cannot create self-loop");
      return;
    }

    // Check if edge already exists
    const edgeExists = graph.edges.some(
      (edge) =>
        (edge.from === fromNode.id && edge.to === toNode.id) ||
        (!graph.isDirected &&
          edge.from === toNode.id &&
          edge.to === fromNode.id)
    );

    if (edgeExists) {
      addToHistory("❌ Error: Edge already exists");
      return;
    }

    const newEdge: GraphEdge = {
      id: generateEdgeId(),
      from: fromNode.id,
      to: toNode.id,
      weight: graph.isWeighted ? weight : undefined,
      isDirected: graph.isDirected,
      isHighlighted: true,
    };

    setGraph((prev) => ({
      ...prev,
      edges: [...prev.edges, newEdge],
    }));

    addToHistory(
      `✅ Added edge from ${fromNode.value} to ${toNode.value}${
        graph.isWeighted ? ` (weight: ${weight})` : ""
      }`
    );
    setEdgeFrom("");
    setEdgeTo("");
    setEdgeWeight("");

    // Remove highlight after animation
    setTimeout(() => {
      setGraph((prev) => ({
        ...prev,
        edges: prev.edges.map((edge) =>
          edge.id === newEdge.id ? { ...edge, isHighlighted: false } : edge
        ),
      }));
    }, 1000);
  };

  const clearGraph = () => {
    setGraph({
      nodes: [],
      edges: [],
      isDirected: graphType === "directed" || graphType === "dag",
      isWeighted: graphType === "weighted",
    });
    setAlgorithmSteps([]);
    setCurrentStep(0);
    setAlgorithmResult(null);
    addToHistory("🗑️ Graph cleared");
  };

  const generateRandomGraph = () => {
    const nodeCount = 6 + Math.floor(Math.random() * 4); // 6-9 nodes
    const nodes: GraphNode[] = [];

    // Create nodes in a circular layout
    for (let i = 0; i < nodeCount; i++) {
      const angle = (2 * Math.PI * i) / nodeCount;
      const radius = 150;
      const centerX = 400;
      const centerY = 250;

      nodes.push({
        id: generateNodeId(),
        value: i + 1,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }

    // Create random edges
    const edges: GraphEdge[] = [];
    const edgeCount = Math.floor(nodeCount * 1.5); // Moderate connectivity

    for (let i = 0; i < edgeCount; i++) {
      const fromIdx = Math.floor(Math.random() * nodeCount);
      let toIdx = Math.floor(Math.random() * nodeCount);

      // Avoid self-loops
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * nodeCount);
      }

      const from = nodes[fromIdx];
      const to = nodes[toIdx];

      // Check if edge already exists
      const edgeExists = edges.some(
        (edge) =>
          (edge.from === from.id && edge.to === to.id) ||
          (!graph.isDirected && edge.from === to.id && edge.to === from.id)
      );

      if (!edgeExists) {
        edges.push({
          id: generateEdgeId(),
          from: from.id,
          to: to.id,
          weight: graph.isWeighted
            ? Math.floor(Math.random() * 10) + 1
            : undefined,
          isDirected: graph.isDirected,
        });
      }
    }

    setGraph((prev) => ({
      ...prev,
      nodes,
      edges,
    }));

    addToHistory(
      `🎲 Generated random graph with ${nodeCount} nodes and ${edges.length} edges`
    );
  };

  // Algorithm implementations
  const runBFS = async () => {
    if (!startNode) {
      addToHistory("❌ Error: Please select a start node");
      return;
    }

    const startValue = Number(startNode);
    const startNodeObj = graph.nodes.find((node) => node.value === startValue);
    if (!startNodeObj) {
      addToHistory("❌ Error: Start node not found");
      return;
    }

    setIsAnimating(true);
    const steps: any[] = [];
    const visited = new Set<string>();
    const queue = [startNodeObj.id];
    const distances = new Map<string, number>();
    const parents = new Map<string, string | null>();

    distances.set(startNodeObj.id, 0);
    parents.set(startNodeObj.id, null);

    steps.push({
      type: "start",
      nodeId: startNodeObj.id,
      message: `Starting BFS from node ${startValue}`,
      queue: [...queue],
      visited: new Set(visited),
      distances: new Map(distances),
    });

    while (queue.length > 0) {
      const currentId = queue.shift()!;

      if (visited.has(currentId)) continue;

      visited.add(currentId);
      const currentNode = graph.nodes.find((n) => n.id === currentId)!;

      steps.push({
        type: "visit",
        nodeId: currentId,
        message: `Visiting node ${currentNode.value}`,
        queue: [...queue],
        visited: new Set(visited),
        distances: new Map(distances),
      });

      // Find neighbors
      const neighbors = graph.edges
        .filter(
          (edge) =>
            edge.from === currentId ||
            (!graph.isDirected && edge.to === currentId)
        )
        .map((edge) => (edge.from === currentId ? edge.to : edge.from))
        .filter((neighborId) => !visited.has(neighborId));

      for (const neighborId of neighbors) {
        if (!distances.has(neighborId)) {
          distances.set(neighborId, distances.get(currentId)! + 1);
          parents.set(neighborId, currentId);
          queue.push(neighborId);

          const neighborNode = graph.nodes.find((n) => n.id === neighborId)!;
          steps.push({
            type: "discover",
            nodeId: neighborId,
            edgeFrom: currentId,
            edgeTo: neighborId,
            message: `Discovered node ${
              neighborNode.value
            } at distance ${distances.get(neighborId)}`,
            queue: [...queue],
            visited: new Set(visited),
            distances: new Map(distances),
          });
        }
      }
    }

    steps.push({
      type: "complete",
      message: "BFS traversal complete",
      visited: new Set(visited),
      distances: new Map(distances),
      parents: new Map(parents),
    });

    setAlgorithmSteps(steps);
    setCurrentStep(0);
    addToHistory(`🔍 Started BFS from node ${startValue}`);
  };

  const runDFS = async () => {
    if (!startNode) {
      addToHistory("❌ Error: Please select a start node");
      return;
    }

    const startValue = Number(startNode);
    const startNodeObj = graph.nodes.find((node) => node.value === startValue);
    if (!startNodeObj) {
      addToHistory("❌ Error: Start node not found");
      return;
    }

    setIsAnimating(true);
    const steps: any[] = [];
    const visited = new Set<string>();

    const dfsRecursive = (nodeId: string) => {
      if (visited.has(nodeId)) return;

      visited.add(nodeId);
      const currentNode = graph.nodes.find((n) => n.id === nodeId)!;

      steps.push({
        type: "visit",
        nodeId,
        message: `Visiting node ${currentNode.value}`,
        visited: new Set(visited),
      });

      // Find neighbors
      const neighbors = graph.edges
        .filter(
          (edge) =>
            edge.from === nodeId || (!graph.isDirected && edge.to === nodeId)
        )
        .map((edge) => (edge.from === nodeId ? edge.to : edge.from))
        .filter((neighborId) => !visited.has(neighborId));

      for (const neighborId of neighbors) {
        const neighborNode = graph.nodes.find((n) => n.id === neighborId)!;
        steps.push({
          type: "discover",
          nodeId: neighborId,
          edgeFrom: nodeId,
          edgeTo: neighborId,
          message: `Exploring edge to node ${neighborNode.value}`,
          visited: new Set(visited),
        });

        dfsRecursive(neighborId);
      }
    };

    steps.push({
      type: "start",
      nodeId: startNodeObj.id,
      message: `Starting DFS from node ${startValue}`,
      visited: new Set(),
    });

    dfsRecursive(startNodeObj.id);

    steps.push({
      type: "complete",
      message: "DFS traversal complete",
      visited: new Set(visited),
    });

    setAlgorithmSteps(steps);
    setCurrentStep(0);
    addToHistory(`🔍 Started DFS from node ${startValue}`);
  };

  const runKruskal = async () => {
    if (!graph.isWeighted) {
      addToHistory("❌ Error: Kruskal's algorithm requires a weighted graph");
      return;
    }

    setIsAnimating(true);
    const steps: any[] = [];
    const mst: string[] = [];
    let mstWeight = 0;

    // 1. Sort all edges by weight
    const sortedEdges = [...graph.edges].sort(
      (a, b) => (a.weight || 0) - (b.weight || 0)
    );

    steps.push({
      type: "start",
      message: "Starting Kruskal's algorithm: Edges sorted by weight.",
      sortedEdges: sortedEdges.map((e) => e.id),
    });

    // 2. Initialize DSU
    const parent = new Map<string, string>();
    graph.nodes.forEach((node) => parent.set(node.id, node.id));

    const find = (nodeId: string): string => {
      if (parent.get(nodeId) === nodeId) return nodeId;
      const root = find(parent.get(nodeId)!);
      parent.set(nodeId, root); // Path compression
      return root;
    };

    const union = (id1: string, id2: string) => {
      const root1 = find(id1);
      const root2 = find(id2);
      if (root1 !== root2) {
        parent.set(root2, root1);
      }
    };

    // 3. Iterate through sorted edges
    for (const edge of sortedEdges) {
      steps.push({
        type: "check-edge",
        edgeId: edge.id,
        message: `Checking edge (${edge.from} to ${edge.to}) with weight ${edge.weight}`,
        mst,
        mstWeight,
      });

      const rootFrom = find(edge.from);
      const rootTo = find(edge.to);

      if (rootFrom !== rootTo) {
        // Add edge to MST
        mst.push(edge.id);
        mstWeight += edge.weight || 0;
        union(edge.from, edge.to);

        steps.push({
          type: "add-edge",
          edgeId: edge.id,
          message: `Added edge to MST. Current weight: ${mstWeight}`,
          mst: [...mst],
          mstWeight,
        });
      } else {
        // Edge creates a cycle
        steps.push({
          type: "skip-edge",
          edgeId: edge.id,
          message: `Skipping edge, it would form a cycle.`,
          mst: [...mst],
          mstWeight,
        });
      }
    }

    steps.push({
      type: "complete",
      message: `Kruskal's algorithm complete. MST weight: ${mstWeight}`,
      mst: [...mst],
      mstWeight,
    });

    setAlgorithmSteps(steps);
    setCurrentStep(0);
    addToHistory(`🌳 Started Kruskal's algorithm`);
  };


  const runDijkstra = async () => {
    if (!graph.isWeighted) {
      addToHistory("❌ Error: Dijkstra's algorithm requires a weighted graph");
      return;
    }

    if (!startNode) {
      addToHistory("❌ Error: Please select a start node");
      return;
    }

    const startValue = Number(startNode);
    const startNodeObj = graph.nodes.find((node) => node.value === startValue);
    if (!startNodeObj) {
      addToHistory("❌ Error: Start node not found");
      return;
    }

    setIsAnimating(true);
    const steps: any[] = [];
    const distances = new Map<string, number>();
    const parents = new Map<string, string | null>();
    const visited = new Set<string>();
    const unvisited = new Set(graph.nodes.map((n) => n.id));

    // Initialize distances
    graph.nodes.forEach((node) => {
      distances.set(
        node.id,
        node.id === startNodeObj.id ? 0 : Number.POSITIVE_INFINITY
      );
      parents.set(node.id, null);
    });

    steps.push({
      type: "start",
      nodeId: startNodeObj.id,
      message: `Starting Dijkstra from node ${startValue}`,
      distances: new Map(distances),
      visited: new Set(),
    });

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let currentId: string | null = null;
      let minDistance = Number.POSITIVE_INFINITY;

      for (const nodeId of Array.from(unvisited)) {
        const dist = distances.get(nodeId)!;
        if (dist < minDistance) {
          minDistance = dist;
          currentId = nodeId;
        }
      }

      if (!currentId || minDistance === Number.POSITIVE_INFINITY) break;

      unvisited.delete(currentId);
      visited.add(currentId);

      const currentNode = graph.nodes.find((n) => n.id === currentId)!;
      steps.push({
        type: "visit",
        nodeId: currentId,
        message: `Visiting node ${currentNode.value} with distance ${minDistance}`,
        distances: new Map(distances),
        visited: new Set(visited),
      });

      // Update distances to neighbors
      const neighbors = graph.edges
        .filter(
          (edge) =>
            edge.from === currentId ||
            (!graph.isDirected && edge.to === currentId)
        )
        .map((edge) => ({
          id: edge.from === currentId ? edge.to : edge.from,
          weight: edge.weight || 1,
          edgeId: edge.id,
        }))
        .filter((neighbor) => unvisited.has(neighbor.id));

      for (const neighbor of neighbors) {
        const newDistance = distances.get(currentId)! + neighbor.weight;
        const currentDistance = distances.get(neighbor.id)!;

        if (newDistance < currentDistance) {
          distances.set(neighbor.id, newDistance);
          parents.set(neighbor.id, currentId);

          const neighborNode = graph.nodes.find((n) => n.id === neighbor.id)!;
          steps.push({
            type: "relax",
            nodeId: neighbor.id,
            edgeFrom: currentId,
            edgeTo: neighbor.id,
            message: `Updated distance to node ${neighborNode.value}: ${newDistance}`,
            distances: new Map(distances),
            visited: new Set(visited),
          });
        }
      }
    }

    steps.push({
      type: "complete",
      message: "Dijkstra algorithm complete",
      distances: new Map(distances),
      parents: new Map(parents),
      visited: new Set(visited),
    });

    setAlgorithmSteps(steps);
    setCurrentStep(0);
    addToHistory(`🛣️ Started Dijkstra from node ${startValue}`);
  };

  // Helper to apply a single step to the graph and log it
  const applyStep = useCallback(
    (step: any, index: number) => {
      setGraph((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) => ({
          ...node,
          isHighlighted: step.nodeId === node.id,
          isVisited: step.visited?.has(node.id) || false,
          isStart: step.type === "start" && step.nodeId === node.id,
          distance: step.distances?.get(node.id),
        })),
        edges: prev.edges.map((edge) => ({
          ...edge,
          isHighlighted:
            step.edgeId === edge.id ||
            ((step.edgeFrom === edge.from && step.edgeTo === edge.to) ||
              (step.edgeFrom === edge.to && step.edgeTo === edge.from)),
          isVisited: step.mst?.includes(edge.id) || (step.visited?.has(edge.from) && step.visited?.has(edge.to)),
        })),
      }));
      if (step?.message) {
        addToHistory(`📍 Step ${index + 1}: ${step.message}`);
      }
    },
    [graph.isDirected] // Dependency for edge direction check
  );

  // Single controlled animation loop driven by currentStep
  useEffect(() => {
    // Clear any previous timer to avoid multiple concurrent timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current as unknown as number);
      timeoutRef.current = null;
    }

    if (!isAnimating || isPaused || algorithmSteps.length === 0) return;

    if (currentStep >= algorithmSteps.length) {
      // Completed
      setIsAnimating(false);
      const last = algorithmSteps[algorithmSteps.length - 1];
      if (last) setAlgorithmResult(last);
      return;
    }

    const step = algorithmSteps[currentStep];
    applyStep(step, currentStep);

    timeoutRef.current = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, animationSpeed) as unknown as ReturnType<typeof setTimeout>;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as unknown as number);
        timeoutRef.current = null;
      }
    };
  }, [
    isAnimating,
    isPaused,
    currentStep,
    animationSpeed,
    algorithmSteps,
    applyStep,
  ]);

  const startAnimation = () => {
    if (algorithmSteps.length === 0) return;
    // Clear any pending timer before starting
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current as unknown as number);
      timeoutRef.current = null;
    }
    setIsAnimating(true);
    setIsPaused(false);
    setCurrentStep(0);
  };

  const pauseAnimation = () => {
    // Toggle pause and clear any scheduled tick when pausing
    setIsPaused((prev) => {
      const next = !prev;
      if (next && timeoutRef.current) {
        clearTimeout(timeoutRef.current as unknown as number);
        timeoutRef.current = null;
      }
      return next;
    });
  };

  const stepForward = () => {
    if (currentStep < algorithmSteps.length - 1) {
      // Manual step should not run the auto-loop
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as unknown as number);
        timeoutRef.current = null;
      }
      if (isAnimating) setIsAnimating(false);
      if (!isPaused) setIsPaused(true);

      const nextIndex = currentStep + 1;
      const step = algorithmSteps[nextIndex];
      applyStep(step, nextIndex);
      setCurrentStep(nextIndex);
    }
  };

  const resetAnimation = () => {
    // Stop any running timer and animation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current as unknown as number);
      timeoutRef.current = null;
    }
    setIsAnimating(false);
    setIsPaused(false);
    setCurrentStep(0);
    setAlgorithmResult(null);

    // Reset graph visualization
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) => ({
        ...node,
        isHighlighted: false,
        isVisited: false,
        isStart: false,
        isEnd: false,
        distance: undefined,
      })),
      edges: prev.edges.map((edge) => ({
        ...edge,
        isHighlighted: false,
        isVisited: false,
      })),
    }));
  };

  // Cleanup on unmount to prevent stray timers
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as unknown as number);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Update graph type
  useEffect(() => {
    setGraph((prev) => ({
      ...prev,
      isDirected: graphType === "directed" || graphType === "dag",
      isWeighted: graphType === "weighted",
    }));
  }, [graphType]);

  const runSelectedAlgorithm = () => {
    resetAnimation();

    switch (selectedAlgorithm) {
      case "bfs":
        runBFS();
        break;
      case "dfs":
        runDFS();
        break;
      case "dijkstra":
        runDijkstra();
        break;
      case "kruskal":
        runKruskal();
        break;
      default:
        addToHistory(`❌ Algorithm ${selectedAlgorithm} not implemented yet`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
            <div className="flex items-center space-x-3 min-h-[110px]">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Interactive Graph Visualizer
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  Explore graph algorithms with step-by-step visualization
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTutorial(!showTutorial)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                <span>Tutorial</span>
              </button>
              <button
                onClick={() => setShowCode(!showCode)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Code className="w-5 h-5 md:w-6 md:h-6" />
                <span>Code</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Tutorial Panel */}
        {showTutorial && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">
                Graph Data Structure
              </h2>
            </div>
            <p className="text-blue-800 mb-4">
              A graph is a collection of vertices (nodes) connected by edges.
              Graphs can represent networks, relationships, paths, and many
              real-world problems.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">
                    Complexity
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Varies by algorithm: O(V+E) to O(V³)
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-800">
                    Applications
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  Social networks, GPS navigation, web crawling
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Graph Type and Algorithm Selector */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Graph Type
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {(
                  ["undirected", "directed", "weighted", "dag"] as GraphType[]
                ).map((type) => (
                  <button
                    key={type}
                    onClick={() => setGraphType(type)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                      graphType === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 dark:border-slate-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-semibold capitalize">
                      {type === "dag" ? "DAG" : type}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Algorithm
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(algorithmInfo).map((algorithm) => (
                  <button
                    key={algorithm}
                    onClick={() => setSelectedAlgorithm(algorithm as AlgorithmType)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                      selectedAlgorithm === algorithm
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 dark:border-slate-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-semibold">
                      {algorithmInfo[algorithm as AlgorithmType].name.split(" ")[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">
              {algorithmInfo[selectedAlgorithm].name}
            </h3>
            <p className="text-purple-800 text-sm mb-2">
              {algorithmInfo[selectedAlgorithm].description}
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <span className="text-green-700">
                <strong>Complexity:</strong>{" "}
                {algorithmInfo[selectedAlgorithm].complexity}
              </span>
              <span className="text-blue-700">
                <strong>Use Case:</strong>{" "}
                {algorithmInfo[selectedAlgorithm].useCase}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Graph Controls
              </h2>

              {/* Node Operations */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Add Node</h3>
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={nodeValue}
                      onChange={(e) => setNodeValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Node value"
                    />
                    <button
                      onClick={addNode}
                      disabled={!nodeValue}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Node</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Add Edge</h3>
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={edgeFrom}
                      onChange={(e) => setEdgeFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="From node"
                    />
                    <input
                      type="number"
                      value={edgeTo}
                      onChange={(e) => setEdgeTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="To node"
                    />
                    {graph.isWeighted && (
                      <input
                        type="number"
                        value={edgeWeight}
                        onChange={(e) => setEdgeWeight(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Weight"
                      />
                    )}
                    <button
                      onClick={addEdge}
                      disabled={!edgeFrom || !edgeTo}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Add Edge</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Algorithm Controls */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Algorithm Parameters
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={startNode}
                      onChange={(e) => setStartNode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Start node"
                    />
                    {(selectedAlgorithm === "dijkstra" ||
                      selectedAlgorithm === "bellman-ford") && (
                      <input
                        type="number"
                        value={endNode}
                        onChange={(e) => setEndNode(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="End node (optional)"
                      />
                    )}
                  </div>
                </div>

                <button
                  onClick={runSelectedAlgorithm}
                  disabled={graph.nodes.length === 0}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>
                    Run {algorithmInfo[selectedAlgorithm].name.split(" ")[0]}
                  </span>
                </button>
              </div>

              {/* Animation Controls */}
              {algorithmSteps.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Animation
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={startAnimation}
                      disabled={isAnimating && !isPaused}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      <Play className="w-3 h-3" />
                      <span>Play</span>
                    </button>
                    <button
                      onClick={pauseAnimation}
                      disabled={!isAnimating}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      <Pause className="w-3 h-3" />
                      <span>Pause</span>
                    </button>
                    <button
                      onClick={stepForward}
                      disabled={currentStep >= algorithmSteps.length - 1}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      <SkipForward className="w-3 h-3" />
                      <span>Step</span>
                    </button>
                  </div>
                  <button
                    onClick={resetAnimation}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Animation Speed: {animationSpeed}ms
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="100"
                      value={animationSpeed}
                      onChange={(e) =>
                        setAnimationSpeed(Number(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Utility Buttons */}
              <div className="space-y-2">
                <button
                  onClick={generateRandomGraph}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Random Graph</span>
                </button>
                <button
                  onClick={clearGraph}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear Graph</span>
                </button>
              </div>

              {/* Graph Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Graph Info</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Nodes:</span>
                    <span className="font-mono">{graph.nodes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edges:</span>
                    <span className="font-mono">{graph.edges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="capitalize">{graphType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Directed:</span>
                    <span
                      className={graph.isDirected ? "text-green-600" : "text-red-600"}
                    >
                      {graph.isDirected ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weighted:</span>
                    <span
                      className={graph.isWeighted ? "text-green-600" : "text-red-600"}
                    >
                      {graph.isWeighted ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3 space-y-8">
            {/* Graph Visualization */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Graph Visualization
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <span>
                    Algorithm: {algorithmInfo[selectedAlgorithm].name}
                  </span>
                  {algorithmSteps.length > 0 && (
                    <span>
                      Step: {currentStep + 1}/{algorithmSteps.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Graph Canvas */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 min-h-[500px] relative overflow-hidden">
                {graph.nodes.length === 0 ? (
                  <div className="flex items-center justify-center h-96 text-gray-500">
                    <div className="text-center">
                      <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        No graph to display
                      </p>
                      <p className="text-sm">
                        Add some nodes and edges to get started!
                      </p>
                    </div>
                  </div>
                ) : (
                  <GraphRenderer
                    graph={graph}
                    setGraph={setGraph}
                    onNodeClick={(nodeId) => {
                      // Handle node selection for removal
                      if (selectedNodes.includes(nodeId)) {
                        setSelectedNodes((prev) =>
                          prev.filter((id) => id !== nodeId)
                        );
                      } else {
                        setSelectedNodes((prev) => [...prev, nodeId]);
                      }
                    }}
                    selectedNodes={selectedNodes}
                  />
                )}
              </div>

              {/* Current Step Info */}
              {algorithmSteps.length > 0 &&
                currentStep < algorithmSteps.length && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-purple-800">
                        Step {currentStep + 1}:{" "}
                        {algorithmSteps[currentStep]?.type?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-purple-700 text-sm">
                      {algorithmSteps[currentStep]?.message}
                    </p>
                  </div>
                )}
            </div>

            {/* Algorithm Result */}
            {algorithmResult && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Algorithm Result
                </h2>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Route className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-800">
                      {algorithmInfo[selectedAlgorithm].name} Complete
                    </span>
                  </div>
                  <div className="text-green-700 text-sm space-y-1">
                    {algorithmResult.distances && (
                      <div>
                        <strong>Distances from start node:</strong>
                        <div className="mt-1 font-mono text-xs">
                          {Array.from(
                            algorithmResult.distances.entries() as IterableIterator<
                              [string, number]
                            >
                          ).map(([nodeId, distance]: [string, number]) => {
                            const node = graph.nodes.find(
                              (n) => n.id === nodeId
                            );
                            return (
                              <div key={nodeId}>
                                Node {node?.value}:{" "}
                                {distance === Number.POSITIVE_INFINITY
                                  ? "∞"
                                  : distance}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {algorithmResult.visited && (
                      <div>
                        <strong>Visited nodes:</strong>{" "}
                        {algorithmResult.visited.size}
                      </div>
                    )}
                    {selectedAlgorithm === 'kruskal' && algorithmResult.mstWeight !== undefined && (
                      <div>
                        <strong>Minimum Spanning Tree Weight:</strong>{" "}
                        {algorithmResult.mstWeight}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Operation History */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Operation History
              </h2>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {operationHistory.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-8">
                    No operations performed yet
                  </p>
                ) : (
                  operationHistory.map((operation, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-sm border-l-4 ${
                        operation.includes("❌")
                          ? "bg-red-50 text-red-700 border-red-400"
                          : operation.includes("✅")
                          ? "bg-green-50 text-green-700 border-green-400"
                          : operation.includes("🔍") || operation.includes("🛣️")
                          ? "bg-blue-50 text-blue-700 border-blue-400"
                          : operation.includes("📍")
                          ? "bg-purple-50 text-purple-700 border-purple-400"
                          : "bg-gray-50 text-gray-700 border-gray-400"
                      }`}
                    >
                      {operation}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Practice Questions Section - Card Style */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-700 p-6 mt-8">
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">Practice Questions (Graph)</h2>
              <ul className="space-y-3">
                <li>
                  <a href="https://leetcode.com/problems/course-schedule/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Course Schedule (Topological Sort) (LeetCode)</a>
                </li>
                <li>
                  <a href="https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Number of Connected Components in an Undirected Graph (LeetCode)</a>
                </li>
                <li>
                  <a href="https://leetcode.com/problems/shortest-path-in-binary-matrix/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Shortest Path in Binary Matrix (BFS) (LeetCode)</a>
                </li>
                <li>
                  <a href="https://leetcode.com/problems/network-delay-time/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Network Delay Time (Dijkstra) (LeetCode)</a>
                </li>
                <li>
                  <a href="https://leetcode.com/problems/clone-graph/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Clone Graph (DFS/BFS) (LeetCode)</a>
                </li>
                <li>
                  <a href="https://leetcode.com/problems/find-the-town-judge/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Find the Town Judge (LeetCode)</a>
                </li>
                <li>
                  <a href="https://practice.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Detect Cycle in an Undirected Graph (GFG)</a>
                </li>
                <li>
                  <a href="https://practice.geeksforgeeks.org/problems/shortest-path-in-unweighted-graph/1" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Shortest Path in Unweighted Graph (GFG)</a>
                </li>
                <li>
                  <a href="https://practice.geeksforgeeks.org/problems/kruskals-algorithm/1" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Kruskal's Algorithm (GFG)</a>
                </li>
                <li>
                  <a href="https://practice.geeksforgeeks.org/problems/prim%E2%80%99s-algorithm/1" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Prim's Algorithm (GFG)</a>
                </li>
              </ul>
            </div>

            {/* Code Implementation */}
            {showCode && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {algorithmInfo[selectedAlgorithm].name} Implementation
                </h2>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{getAlgorithmCode(selectedAlgorithm)}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Graph Renderer Component
function GraphRenderer({
  graph,
  setGraph,
  onNodeClick,
  selectedNodes,
}: {
  graph: GraphState;
  setGraph: React.Dispatch<React.SetStateAction<GraphState>>;
  onNodeClick: (nodeId: string) => void;
  selectedNodes: string[];
}) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [draggingNodeId, setDraggingNodeId] = React.useState<string | null>(
    null
  );
  const [dragOffset, setDragOffset] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  // Drag event handlers
  const handleNodeMouseDown = (e: React.MouseEvent, node: GraphNode) => {
    e.preventDefault();
    setDraggingNodeId(node.id);
    // Store offset from node center to mouse position
    setDragOffset({
      x:
        e.clientX -
        (svgRef.current?.getBoundingClientRect().left ?? 0) -
        node.x,
      y:
        e.clientY - (svgRef.current?.getBoundingClientRect().top ?? 0) - node.y,
    });
  };

  React.useEffect(() => {
    if (!draggingNodeId) return;
    const move = (e: MouseEvent) => {
      if (!draggingNodeId || !dragOffset) return;
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;
      // Node center should be at cursor
      let newX = e.clientX - svgRect.left - dragOffset.x;
      let newY = e.clientY - svgRect.top - dragOffset.y;
      const minX = 25,
        minY = 25,
        maxX = 800 - 25,
        maxY = 500 - 25;
      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));
      // Only update the dragged node's position
      const updatedNodes = graph.nodes.map((n) =>
        n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n
      );
      // Use setGraph to update state
      setGraph((prev: GraphState) => ({
        ...prev,
        nodes: updatedNodes,
      }));
    };
    const up = () => {
      setDraggingNodeId(null);
      setDragOffset(null);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [draggingNodeId, dragOffset, graph, setGraph]);

  const handleNodeClick = (nodeId: string) => {
    onNodeClick(nodeId);
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="500"
      viewBox="0 0 800 500"
      className="border border-gray-200 dark:border-slate-700 rounded-lg bg-white"
      style={{ userSelect: "none" }}
    >
      {/* Render edges first (so they appear behind nodes) */}
      {graph.edges.map((edge) => {
        const fromNode = graph.nodes.find((n) => n.id === edge.from);
        const toNode = graph.nodes.find((n) => n.id === edge.to);
        if (!fromNode || !toNode) return null;
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        if (!isFinite(length) || length === 0) return null; // Prevent NaN errors
        const unitX = dx / length;
        const unitY = dy / length;
        // Adjust line endpoints to not overlap with node circles
        const nodeRadius = 25;
        const startX = fromNode.x + unitX * nodeRadius;
        const startY = fromNode.y + unitY * nodeRadius;
        const endX = toNode.x - unitX * nodeRadius;
        const endY = toNode.y - unitY * nodeRadius;
        return (
          <g key={edge.id}>
            {/* Edge line */}
            <line
              x1={String(startX)}
              y1={String(startY)}
              x2={String(endX)}
              y2={String(endY)}
              stroke={
                edge.isHighlighted
                  ? "#f59e0b"
                  : edge.isVisited
                  ? "#10b981"
                  : "#6b7280"
              }
              strokeWidth={edge.isHighlighted ? "3" : "2"}
              className="transition-all duration-300"
            />
            {/* Arrow for directed graphs */}
            {graph.isDirected && (
              <polygon
                points={`${endX},${endY} ${endX - 8 * unitX + 4 * unitY},${
                  endY - 8 * unitY - 4 * unitX
                } ${endX - 8 * unitX - 4 * unitY},${
                  endY - 8 * unitY + 4 * unitX
                }`}
                fill={
                  edge.isHighlighted
                    ? "#f59e0b"
                    : edge.isVisited
                    ? "#10b981"
                    : "#6b7280"
                }
                className="transition-all duration-300"
              />
            )}
            {/* Edge weight */}
            {graph.isWeighted && edge.weight && (
              <text
                x={String((startX + endX) / 2)}
                y={String((startY + endY) / 2 - 5)}
                textAnchor="middle"
                fill="#374151"
                fontSize="12"
                fontWeight="bold"
                className="bg-white"
              >
                {edge.weight}
              </text>
            )}
          </g>
        );
      })}

      {/* Render nodes */}
      {graph.nodes.map((node) => (
        <g key={node.id}>
          {/* Node circle */}
          <circle
            cx={node.x}
            cy={node.y}
            r="25"
            fill={
              node.isStart
                ? "#10b981"
                : node.isEnd
                ? "#ef4444"
                : node.isHighlighted
                ? "#f59e0b"
                : node.isVisited
                ? "#8b5cf6"
                : selectedNodes.includes(node.id)
                ? "#f97316"
                : "#3b82f6"
            }
            stroke={
              selectedNodes.includes(node.id)
                ? "#ea580c"
                : node.isHighlighted
                ? "#d97706"
                : "#1e40af"
            }
            strokeWidth="2"
            className="cursor-pointer transition-all duration-300"
            style={{
              filter: "drop-shadow(0 0 8px #6366f1)",
              transition: "filter 0.2s",
              ...(draggingNodeId === node.id
                ? { filter: "drop-shadow(0 0 16px #f59e0b)" }
                : {}),
            }}
            onClick={() => handleNodeClick(node.id)}
            onMouseDown={(e) => handleNodeMouseDown(e, node)}
          />

          {/* Node value */}
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            className="pointer-events-none"
          >
            {node.value}
          </text>

          {/* Distance label for shortest path algorithms */}
          {node.distance !== undefined &&
            node.distance !== Number.POSITIVE_INFINITY && (
              <text
                x={node.x}
                y={node.y - 35}
                textAnchor="middle"
                fill="#374151"
                fontSize="10"
                fontWeight="bold"
                className="bg-white"
              >
                d: {node.distance}
              </text>
            )}

          {/* Start/End labels */}
          {node.isStart && (
            <text
              x={node.x}
              y={node.y + 45}
              textAnchor="middle"
              fill="#10b981"
              fontSize="10"
              fontWeight="bold"
            >
              START
            </text>
          )}
          {node.isEnd && (
            <text
              x={node.x}
              y={node.y + 45}
              textAnchor="middle"
              fill="#ef4444"
              fontSize="10"
              fontWeight="bold"
            >
              END
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

// Algorithm code implementations
function getAlgorithmCode(algorithm: AlgorithmType): string {
  const codes: Record<AlgorithmType, string> = {
    bfs: `def bfs(graph, start):
    """Breadth-First Search implementation"""
    visited = set()
    queue = [start]
    distances = {start: 0}
    parents = {start: None}
    
    while queue:
        current = queue.pop(0)
        
        if current in visited:
            continue
            
        visited.add(current)
        
        # Explore neighbors
        for neighbor in graph[current]:
            if neighbor not in visited:
                if neighbor not in distances:
                    distances[neighbor] = distances[current] + 1
                    parents[neighbor] = current
                    queue.append(neighbor)
    
    return visited, distances, parents`,

    dfs: `def dfs(graph, start, visited=None):
    """Depth-First Search implementation"""
    if visited is None:
        visited = set()
    
    visited.add(start)
    print(f"Visiting: {start}")
    
    # Recursively visit neighbors
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    
    return visited

def dfs_iterative(graph, start):
    """Iterative DFS using stack"""
    visited = set()
    stack = [start]
    
    while stack:
        current = stack.pop()
        
        if current not in visited:
            visited.add(current)
            print(f"Visiting: {current}")
            
            # Add neighbors to stack
            for neighbor in graph[current]:
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return visited`,

    kruskal: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))

    def find(self, i):
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i]) # Path compression
        return self.parent[i]

    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            self.parent[root_j] = root_i
            return True
        return False

def kruskals_algorithm(nodes, edges):
    """Kruskal's algorithm for Minimum Spanning Tree"""
    # Sort edges by weight
    sorted_edges = sorted(edges, key=lambda edge: edge['weight'])
    
    dsu = DSU(len(nodes))
    mst = []
    mst_weight = 0
    
    node_map = {node['id']: i for i, node in enumerate(nodes)}

    for edge in sorted_edges:
        from_node_idx = node_map[edge['from']]
        to_node_idx = node_map[edge['to']]
        
        if dsu.union(from_node_idx, to_node_idx):
            mst.append(edge)
            mst_weight += edge['weight']
            
    return mst, mst_weight`,

    dijkstra: `import heapq

def dijkstra(graph, start):
    """Dijkstra's shortest path algorithm"""
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    parents = {node: None for node in graph}
    visited = set()
    
    # Priority queue: (distance, node)
    pq = [(0, start)]
    
    while pq:
        current_distance, current = heapq.heappop(pq)
        
        if current in visited:
            continue
            
        visited.add(current)
        
        # Update distances to neighbors
        for neighbor, weight in graph[current].items():
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                parents[neighbor] = current
                heapq.heappush(pq, (distance, neighbor))
    
    return distances, parents

def get_shortest_path(parents, start, end):
    """Reconstruct shortest path"""
    path = []
    current = end
    
    while current is not None:
        path.append(current)
        current = parents[current]
    
    return path[::-1] if path[0] == end else []`,

    "bellman-ford": `def bellman_ford(graph, start):
    """Bellman-Ford algorithm for shortest paths"""
    # Initialize distances
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    parents = {node: None for node in graph}
    
    # Relax edges V-1 times
    for _ in range(len(graph) - 1):
        for u in graph:
            for v, weight in graph[u].items():
                if distances[u] + weight < distances[v]:
                    distances[v] = distances[u] + weight
                    parents[v] = u
    
    # Check for negative cycles
    for u in graph:
        for v, weight in graph[u].items():
            if distances[u] + weight < distances[v]:
                raise ValueError("Graph contains negative cycle")
    
    return distances, parents`,
  };

  return codes[algorithm] || "# Algorithm implementation not available";
}

export default GraphVisualizerPage;
