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
    strokeWidth: 1.5,
    stroke: '#52525b', // zinc-600
  },
  labelStyle: {
    fill: '#e4e4e7', // zinc-200
    fontWeight: 600,
    fontSize: 10,
    fontFamily: 'monospace',
  },
  labelBgStyle: {
    fill: '#18181b', // zinc-950
    fillOpacity: 1,
  },
  labelBgPadding: [4, 2] as [number, number],
  labelBgBorderRadius: 4,
};

// Connection line style (while dragging)
const connectionLineStyle = {
  stroke: '#3b82f6',
  strokeWidth: 2,
  strokeDasharray: '4,4',
};

// Helper to get marker type based on relation
function getMarkerForRelationType(relationType: string, end: 'start' | 'end') {
  if (relationType === '1-1') {
    return 'url(#arrow-one)';
  } else if (relationType === '1-N') {
    if (end === 'start') {
      return 'url(#circle-one)';
    } else {
      return 'url(#crowsfoot)';
    }
  } else if (relationType === 'N-N') {
    return 'url(#crowsfoot)';
  }
  return 'url(#arrow-one)';
}

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

  const edges: Edge[] = useMemo(() => relations.map((rel) => ({
    id: rel.id,
    source: rel.sourceTableId,
    target: rel.targetTableId,
    sourceHandle: `${rel.sourceColumnId}-source`,
    targetHandle: `${rel.targetColumnId}-target`,
    label: rel.type,
    type: 'smoothstep',
    markerStart: getMarkerForRelationType(rel.type, 'start'),
    markerEnd: getMarkerForRelationType(rel.type, 'end'),
    style: {
      stroke: selectedEdgeId === rel.id ? '#3b82f6' : '#52525b',
      strokeWidth: selectedEdgeId === rel.id ? 2 : 1.5
    },
    animated: false,
    zIndex: selectedEdgeId === rel.id ? 10 : 0,
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
      type: '1-N',
    });
  }, [addRelation]);

  const onEdgeClick = useCallback((_: any, edge: Edge) => {
    setSelectedEdgeId(edge.id);
    const currentType = edge.label as string;
    const nextType = getNextRelationType(currentType);
    updateRelation(edge.id, nextType as any);
  }, [updateRelation]);

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
        onNodesChange={handleNodesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
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

        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={connectionLineStyle}
        connectionMode={ConnectionMode.Loose}
        colorMode="dark"

        autoPanOnNodeDrag={true}
        panOnDrag={[1, 2]}
        selectionOnDrag={false}
        proOptions={{ hideAttribution: true }}
      >
        {/* Custom SVG Markers */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <marker
              id="crowsfoot"
              viewBox="0 0 20 20"
              refX="20"
              refY="10"
              markerWidth="16"
              markerHeight="16"
              orient="auto"
            >
              <path
                d="M 0,10 L 12,10 M 12,10 L 20,4 M 12,10 L 20,10 M 12,10 L 20,16"
                stroke="#52525b"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </marker>
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
                stroke="#52525b"
                strokeWidth="1.5"
                fill="#18181b"
              />
            </marker>
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
                fill="#52525b"
              />
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