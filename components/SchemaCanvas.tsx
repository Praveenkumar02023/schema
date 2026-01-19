'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
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
} from '@xyflow/react';
import { useSchemaStore } from '../store/useSchemaStore';
import TableNode from './TableNode';

const nodeTypes: NodeTypes = {
  table: TableNode,
};

// Elegant edge styling - Thin grey lines with highlighted text
const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: false,
  style: { 
    strokeWidth: 0.8, // Very thin line like reference image
    stroke: '#a1a1aa',
  },
  labelStyle: {
    fill: '#3b82f6', // Blue highlight color for visibility
    fontWeight: 700,
    fontSize: 11,
    fontFamily: 'ui-monospace, monospace',
    cursor: 'pointer',
  },
  labelBgStyle: {
    fill: 'transparent', // No background box
    fillOpacity: 0,
  },
  labelBgPadding: [4, 6] as [number, number],
  labelBgBorderRadius: 0,
};

// Connection line style (while dragging)
const connectionLineStyle = {
  stroke: '#a1a1aa',
  strokeWidth: 1.5,
  strokeDasharray: '4,4',
};

// Helper to get marker type based on relation
// Uses ER diagram crow's foot notation: Arrow = "one", Crow's foot = "many", Circle = "one" in 1:N
function getMarkerForRelationType(relationType: string, end: 'start' | 'end') {
  if (relationType === '1-1') {
    // 1:1 - Standard arrows on both ends (both are "one")
    return 'url(#arrow-one)';
  } else if (relationType === '1-N') {
    // 1:N - Circle on "1" side (start), Crow's foot on "N" side (end)
    if (end === 'start') {
      return 'url(#circle-one)';
    } else {
      return 'url(#crowsfoot)';
    }
  } else if (relationType === 'N-N') {
    // N:N - Crow's feet on both ends (both are "many")
    return 'url(#crowsfoot)';
  }
  return 'url(#arrow-one)';
}

// Cycle through relation types
function getNextRelationType(current: string): string {
  const types = ['1-1', '1-N', 'N-N'];
  const currentIndex = types.indexOf(current);
  return types[(currentIndex + 1) % types.length];
}

export default function SchemaCanvas() {
  const tables = useSchemaStore((state) => state.tables);
  const relations = useSchemaStore((state) => state.relations);
  const updateTablePosition = useSchemaStore((state) => state.updateTablePosition);
  const addRelation = useSchemaStore((state) => state.addRelation);
  const updateRelation = useSchemaStore((state) => state.updateRelation);
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
  })), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  // Sync nodes when tables change (but not during drag)
  useEffect(() => {
    setNodes(tables.map((table) => ({
      id: table.id,
      position: table.position,
      data: { table },
      type: 'table',
      draggable: true,
    })));
  }, [tables, setNodes]);

  // Custom handler to persist position only when drag ends
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      // Apply changes to local state for visual feedback
      onNodesChange(changes);
      
      // Persist to store only when drag completes
      changes.forEach((change) => {
        if (change.type === 'position' && change.position && change.dragging === false) {
          updateTablePosition(change.id, change.position);
        }
      });
    },
    [onNodesChange, updateTablePosition]
  );

  // Map store relations to ReactFlow edges with custom markers
  const edges: Edge[] = useMemo(() => relations.map((rel) => ({
    id: rel.id,
    source: rel.sourceTableId,
    target: rel.targetTableId,
    sourceHandle: `${rel.sourceColumnId}-source`,
    targetHandle: `${rel.targetColumnId}-target`,
    label: rel.type, // Always show relation type
    type: 'smoothstep',
    markerStart: getMarkerForRelationType(rel.type, 'start'),
    markerEnd: getMarkerForRelationType(rel.type, 'end'),
    style: { 
      stroke: selectedEdgeId === rel.id ? '#3b82f6' : '#a1a1aa', 
      strokeWidth: selectedEdgeId === rel.id ? 1.5 : 0.8 
    },
    animated: false,
  })), [relations, selectedEdgeId]);
  
  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target || !params.sourceHandle || !params.targetHandle) return;

    const sourceColumnId = params.sourceHandle.replace('-source', '');
    const targetColumnId = params.targetHandle.replace('-target', '');

    addRelation({
      id: crypto.randomUUID(),
      sourceTableId: params.source,
      sourceColumnId,
      targetTableId: params.target,
      targetColumnId,
      type: '1-N', // Default to 1-N for now
    });
  }, [addRelation]);

  // Click on edge label to cycle through relation types
  const onEdgeClick = useCallback((_: any, edge: Edge) => {
    setSelectedEdgeId(edge.id);
    const currentType = edge.label as string;
    const nextType = getNextRelationType(currentType);
    updateRelation(edge.id, nextType as any);
  }, [updateRelation]);

  // Handle keyboard events for deletion
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
    <div className="h-full w-full bg-zinc-50 dark:bg-zinc-950 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        
        // UX Configurations - Optimized for smooth dragging
        snapToGrid={false} // REMOVED: This was causing sticky movement
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.1, maxZoom: 1.5 }}
        minZoom={0.1}
        maxZoom={2}
        
        // Connection Configuration
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        connectOnClick={false} // Require drag to connect
        
        // Visual Improvements
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={connectionLineStyle}
        connectionMode={ConnectionMode.Loose} // Allow connections from any handle
        colorMode="system"
        
        // Performance: Prevent re-renders during drag
        autoPanOnNodeDrag={true}
        panOnDrag={[1, 2]} // Middle and right mouse button for panning
        selectionOnDrag={false}
      >
        {/* Custom SVG Markers for Crow's Foot Notation */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            {/* Crow's Foot Marker for "Many" (N) side - Three prongs */}
            <marker
              id="crowsfoot"
              viewBox="0 0 20 20"
              refX="20"
              refY="10"
              markerWidth="20"
              markerHeight="20"
              orient="auto"
            >
              {/* Three lines spreading out like a trident */}
              <path
                d="M 0,10 L 12,10 M 12,10 L 20,4 M 12,10 L 20,10 M 12,10 L 20,16"
                stroke="#a1a1aa"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />
            </marker>
            
            {/* Circle Marker for "One" (1) side in 1:N relations */}
            <marker
              id="circle-one"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="10"
              markerHeight="10"
              orient="auto"
            >
              <circle
                cx="5"
                cy="5"
                r="3"
                stroke="#a1a1aa"
                strokeWidth="1.2"
                fill="white"
              />
            </marker>
            
            {/* Single Arrow for "One" (1) side in 1:1 relations */}
            <marker
              id="arrow-one"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="10"
              markerHeight="10"
              orient="auto"
            >
              <path
                d="M 0,0 L 10,5 L 0,10 z"
                fill="#a1a1aa"
              />
            </marker>
          </defs>
        </svg>

        <Background 
          gap={24} 
          size={2}
          color="currentColor"
          variant={BackgroundVariant.Dots}
          className="text-zinc-300 dark:text-zinc-800 opacity-50" 
        />
        
        {/* Floating Controls Dock (Glassmorphism) */}
        <Panel position="bottom-center" className="mb-8">
          <div className="flex items-center gap-1 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/50">
            <Controls 
              showInteractive={false} // Cleaner, icon-only look
              className="!static !shadow-none !border-none !bg-transparent !m-0 [&>button]:!border-none [&>button]:!bg-transparent [&>button]:!rounded-lg hover:[&>button]:!bg-zinc-200/50 dark:hover:[&>button]:!bg-zinc-700/50 [&>button>svg]:!fill-zinc-600 dark:[&>button>svg]:!fill-zinc-400 !flex-row !gap-1" 
            />
          </div>
        </Panel>

        {/* Floating MiniMap (Glassmorphism) */}
        <Panel position="bottom-right" className="mb-8 mr-8">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 p-1">
            <MiniMap 
              className="!static !m-0 !bg-transparent"
              nodeColor={(n) => {
                // Return a color based on your node data if needed, or a sleek default
                return '#6366f1'; 
              }}
              maskColor="rgba(24, 24, 27, 0.1)" // Matches zinc tones
              zoomable
              pannable
            />
          </div>
        </Panel>

      </ReactFlow>
    </div>
  );
}