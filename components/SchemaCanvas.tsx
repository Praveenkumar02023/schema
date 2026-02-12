'use client';

import { useCallback, useMemo, useState, useEffect, MouseEvent } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  OnNodesChange,
  NodeTypes,
  Connection,
  MarkerType,
  MiniMap,
  BackgroundVariant,
  Panel,
  ConnectionLineType,
  applyNodeChanges,
  useNodesState,
  ConnectionMode,
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from '@xyflow/react';
import { useSchemaStore } from '../store/useSchemaStore';
import TableNode from './TableNode';
import { RelationType } from '@/lib/types';

// --- Custom Edge Component ---
function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  markerStart,
  label,
  data,
}: EdgeProps) {
  const updateRelation = useSchemaStore((state) => state.updateRelation);

  const offset = typeof data?.offset === 'number' ? data.offset : 0;

  // Dynamic Center Calculation to avoid cutting through nodes
  let centerX = (sourceX + targetX) / 2;

  // Gap to maintain between line and node
  const safeGap = 80;

  if (sourcePosition === 'right' && targetPosition === 'right') {
    // Both Right: Route to the right of the right-most node
    centerX = Math.max(sourceX, targetX) + safeGap + offset;
  } else if (sourcePosition === 'left' && targetPosition === 'left') {
    // Both Left: Route to the left of the left-most node
    centerX = Math.min(sourceX, targetX) - safeGap - offset;
  } else if (sourcePosition === 'right' && targetPosition === 'left') {
    // Right to Left (Standard L->R flow)
    // If nodes are crossing (Target is left of Source), push the vertical line outward?
    // Actually, if crossing, (sx+tx)/2 is inside the overlap.
    // But our handle strategy below tries to avoid this.
    // If we are here, we trust the gap.
    centerX = (sourceX + targetX) / 2 + offset;
  } else if (sourcePosition === 'left' && targetPosition === 'right') {
    // Left to Right (Reverse flow)
    centerX = (sourceX + targetX) / 2 + offset;
  }

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
    centerX,
    // let library calculate best centerY
  });

  const onLabelClick = (event: MouseEvent) => {
    event.stopPropagation();
    const currentType = label as RelationType;
    if (!currentType) return;

    // Cycle Types
    const types: RelationType[] = ['1-1', '1-N', 'N-N'];
    const nextType = types[(types.indexOf(currentType) + 1) % types.length];

    updateRelation(id, nextType);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} markerStart={markerStart} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 100, // Ensure label is interactive and above other elements
          }}
          className="nodrag nopan"
        >
          <div
            onClick={onLabelClick}
            className="px-2 py-0.5 bg-[#09090b] border border-zinc-700 hover:border-blue-500 rounded text-[9px] font-mono font-bold text-zinc-300 hover:text-white transition-all cursor-pointer select-none shadow-md ring-1 ring-black/50"
            title="Click to change relation type"
          >
            {label}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes: NodeTypes = {
  table: TableNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// Connection line style (while dragging)
const connectionLineStyle = {
  stroke: '#3b82f6',
  strokeWidth: 2,
  strokeDasharray: '5,5',
};

// Precise ER Marker Logic
function getMarkerForRelationType(relationType: string, end: 'start' | 'end') {
  if (relationType === '1-1') {
    return 'url(#one)'; // Both ends have 'one'
  } else if (relationType === '1-N') {
    if (end === 'start') {
      return 'url(#one)'; // Start is 1
    } else {
      return 'url(#crowsfoot)'; // End is N
    }
  } else if (relationType === 'N-N') {
    return 'url(#crowsfoot)'; // Both ends are N
  }
  return 'url(#one)';
}

export default function SchemaCanvas() {
  const tables = useSchemaStore((state) => state.tables);
  const relations = useSchemaStore((state) => state.relations);
  const updateTablePosition = useSchemaStore((state) => state.updateTablePosition);
  const addRelation = useSchemaStore((state) => state.addRelation);
  const updateRelation = useSchemaStore((state) => state.updateRelation); // Added missing import
  const deleteRelation = useSchemaStore((state) => state.deleteRelation);
  const setSelectedTableId = useSchemaStore((state) => state.setSelectedTableId);

  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Use ReactFlow's state management for smooth dragging
  const initialNodes: Node[] = useMemo(() => tables.map((table) => ({
    id: table.id,
    position: table.position,
    data: { table },
    type: 'table',
    draggable: true,
    zIndex: 10,
  })), [tables]); // Added tables dep

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  // Sync nodes when tables change (but not during drag)
  useEffect(() => {
    setNodes(tables.map((table) => ({
      id: table.id,
      position: table.position,
      data: { table },
      type: 'table',
      draggable: true,
      zIndex: 10,
    })));
  }, [tables, setNodes]);

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      changes.forEach((change) => {
        if (change.type === 'position' && change.position && change.dragging === false) {
          updateTablePosition(change.id, change.position);
        }
      });
    },
    [onNodesChange, updateTablePosition]
  );

  // --- Smart Edge Calculation ---
  const edges: Edge[] = useMemo(() => {
    const edgeGroups = new Map<string, number>();

    return relations.map((rel) => {
      // Group by sorted pair ID to handle bidirectional or multi-edge relations between same tables
      const pairKey = [rel.sourceTableId, rel.targetTableId].sort().join('-');
      const existingCount = edgeGroups.get(pairKey) || 0;
      edgeGroups.set(pairKey, existingCount + 1);

      // Determine optimal handles based on relative positions (using nodes for real-time drag updates)
      const sourceNode = nodes.find((n) => n.id === rel.sourceTableId);
      const targetNode = nodes.find((n) => n.id === rel.targetTableId);

      const sourcePos = sourceNode?.position || { x: 0, y: 0 };
      const targetPos = targetNode?.position || { x: 0, y: 0 };

      let sourceHandleSuffix = 'right';
      let targetHandleSuffix = 'left';

      // Advanced Heuristics for clean layout
      const nodeWidth = 300; // Slightly larger safety buffer for node width
      const xDiff = targetPos.x - sourcePos.x;
      const yDiff = targetPos.y - sourcePos.y;

      // Increase safety threshold for L-R direct connections
      // We only want L-R if there is PLENTY of space between them
      if (xDiff > nodeWidth + 100) {
        // Target is clearly to the Right with good gap
        sourceHandleSuffix = 'right';
        targetHandleSuffix = 'left';
      } else if (xDiff < -(nodeWidth + 100)) {
        // Target is clearly to the Left
        sourceHandleSuffix = 'left';
        targetHandleSuffix = 'right';
      } else {
        // Default to bus-style routing (Right-Right) for vertical stacks or close nodes
        sourceHandleSuffix = 'right';
        targetHandleSuffix = 'right';
      }

      // Calculate Offsets
      // For Same-Side connections (R-R or L-L), we stack OUTWARD to avoid cutting back.
      // For Cross connections (L-R), we alternate around the center.
      let offset = 0;

      const isSameSide = sourceHandleSuffix === targetHandleSuffix;

      if (isSameSide) {
        // Stack strictly outward: 0, 25, 50, 75...
        // We use the count to spacing.
        // Note: edgeGroups counts ALL edges between pair.
        // We might want to separate A->B and B->A if we want distinct lines, 
        // but grouping them is usually cleaner.
        offset = existingCount * 25;
      } else {
        // Alternating: 0, 25, -25, 50, -50
        if (existingCount > 0) {
          const multiplier = Math.ceil(existingCount / 2);
          const direction = existingCount % 2 === 1 ? 1 : -1;
          offset = multiplier * 25 * direction;
        }
      }

      const isSelected = selectedEdgeId === rel.id;

      return {
        id: rel.id,
        source: rel.sourceTableId,
        target: rel.targetTableId,
        sourceHandle: `${rel.sourceColumnId}-${sourceHandleSuffix}`,
        targetHandle: `${rel.targetColumnId}-${targetHandleSuffix}`,
        label: rel.type,
        type: 'custom',
        data: { offset },
        markerStart: getMarkerForRelationType(rel.type, 'start'),
        markerEnd: getMarkerForRelationType(rel.type, 'end'),
        style: {
          stroke: isSelected ? '#3b82f6' : '#71717a',
          strokeWidth: isSelected ? 2.5 : 1.5,
          cursor: 'pointer',
        },
        animated: false,
        zIndex: isSelected ? 5 : -1,
      };
    });
  }, [relations, selectedEdgeId, nodes]);

  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target || !params.sourceHandle || !params.targetHandle) return;

    // Handle Loose connection mode where we might connect source-source, target-target, etc.
    // Our handle IDs are formatted as `${colId}-left` or `${colId}-right`
    const sourceColumnId = params.sourceHandle.replace(/-left|-right|-source|-target/g, '');
    const targetColumnId = params.targetHandle.replace(/-left|-right|-source|-target/g, '');

    addRelation({
      id: crypto.randomUUID(),
      sourceTableId: params.source,
      sourceColumnId,
      targetTableId: params.target,
      targetColumnId,
      type: '1-N',
    });
  }, [addRelation]);

  // Click on the EDGE LINE itself
  const onEdgeClick = useCallback((_: any, edge: Edge) => {
    setSelectedEdgeId(edge.id);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedEdgeId && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault();
        deleteRelation(selectedEdgeId);
        setSelectedEdgeId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEdgeId, deleteRelation]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedTableId(node.id);
    setSelectedEdgeId(null);
  }, [setSelectedTableId]);

  const onPaneClick = useCallback(() => {
    setSelectedTableId(null);
    setSelectedEdgeId(null);
  }, [setSelectedTableId]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="h-full w-full bg-zinc-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent_40%)] pointer-events-none" />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}

        snapToGrid={false}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.1, maxZoom: 1.5 }}
        minZoom={0.1}
        maxZoom={2}

        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        connectOnClick={false}

        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={connectionLineStyle}
        connectionMode={ConnectionMode.Loose}
        colorMode="dark"

        autoPanOnNodeDrag={true}
        panOnDrag={true}
        selectionOnDrag={false}
        proOptions={{ hideAttribution: true }}
      >
        {/* Custom SVG Markers defined here */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            {/* Crow's Foot: N */}
            <marker
              id="crowsfoot"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="12"
              markerHeight="12"
              orient="auto"
            >
              <path d="M0,0 L10,5 L0,10" fill="none" stroke="#71717a" strokeWidth="1.5" />
              <path d="M5,5 L10,5" fill="none" stroke="#71717a" strokeWidth="1.5" />
            </marker>

            {/* Single Bar: 1 */}
            <marker
              id="one"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="12"
              markerHeight="12"
              orient="auto"
            >
              <path d="M5,0 L5,10" fill="none" stroke="#71717a" strokeWidth="1.5" />
              <path d="M1,5 L9,5" fill="none" stroke="#71717a" strokeWidth="1.5" />
            </marker>

            {/* Arrow used for 1-1 optionally, but strict ER uses 'one' */}
            <marker
              id="arrow-one"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#71717a" />
            </marker>
          </defs>
        </svg>

        <Background
          gap={20}
          size={1}
          color="#3f3f46"
          variant={BackgroundVariant.Dots}
          className="opacity-20"
        />

        <Panel position="bottom-center" className="mb-8 hidden sm:block">
          <div className="flex items-center gap-1 p-2 rounded-2xl border border-white/5 bg-zinc-900/80 backdrop-blur-xl shadow-2xl">
            <Controls
              showInteractive={false}
              className="!static !shadow-none !border-none !bg-transparent !m-0 [&>button]:!border-none [&>button]:!bg-transparent [&>button]:!rounded-lg hover:[&>button]:!bg-white/10 [&>button>svg]:!fill-zinc-400 !flex-row !gap-1"
            />
          </div>
        </Panel>

        <Panel position="bottom-right" className="mb-8 mr-8 hidden sm:block">
          <div className="overflow-hidden rounded-xl border border-white/5 bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-1">
            <MiniMap
              className="!static !m-0 !bg-transparent"
              nodeColor="#3b82f6"
              maskColor="rgba(0, 0, 0, 0.4)"
              zoomable
              pannable
            />
          </div>
        </Panel>

      </ReactFlow>
    </div>
  );
}