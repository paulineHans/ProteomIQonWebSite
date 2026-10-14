import React from 'react';
import {
	Background,
	Controls,
	Handle,
	MarkerType,
	Position,
	ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodes = [
	{
		id: 'mzml',
		type: 'workflow',
		position: { x: 0, y: 130 },
		data: { phase: 'Prepare', label: 'MzML to MzLite', description: 'Convert raw input', href: '/tools/mzml-to-mzlite/', accent: 'sky' },
	},
	{
		id: 'peptide-db',
		type: 'workflow',
		position: { x: 0, y: 320 },
		data: { phase: 'Prepare', label: 'PeptideDB', description: 'Build the search space', href: '/tools/peptide-db/', accent: 'sky' },
	},
	{
		id: 'psm',
		type: 'workflow',
		position: { x: 270, y: 225 },
		data: { phase: 'Identify', label: 'Peptide Spectrum Matching', description: 'Match spectra to peptides', href: '/tools/peptide-spectrum-matching/', accent: 'orange' },
	},
	{
		id: 'psm-statistics',
		type: 'workflow',
		position: { x: 555, y: 225 },
		data: { phase: 'Identify', label: 'PSM Statistics', description: 'Score and filter matches', href: '/tools/psm-statistics/', accent: 'orange' },
	},
	{
		id: 'protein-inference',
		type: 'workflow',
		position: { x: 840, y: 225 },
		data: { phase: 'Infer', label: 'Protein Inference', description: 'Assemble protein groups', href: '/tools/protein-inference/', accent: 'teal' },
	},
	{
		id: 'quantification',
		type: 'workflow',
		position: { x: 1125, y: 225 },
		data: { phase: 'Quantify', label: 'PSM-Based Quantification', description: 'Measure peptide ions', href: '/tools/psm-based-quantification/', accent: 'green' },
	},
	{
		id: 'lfq',
		type: 'workflow',
		position: { x: 1410, y: 225 },
		data: { phase: 'Summarize', label: 'Label-Free Protein Quantification', description: 'Summarize protein intensity', href: '/tools/label-free-protein-quantification/', accent: 'red' },
	},
];

const edges = [
	{ id: 'mzml-psm', source: 'mzml', target: 'psm', markerEnd: { type: MarkerType.ArrowClosed, color: '#77b6ba' } },
	{ id: 'peptide-db-psm', source: 'peptide-db', target: 'psm', markerEnd: { type: MarkerType.ArrowClosed, color: '#77b6ba' } },
	{ id: 'psm-statistics', source: 'psm', target: 'psm-statistics', markerEnd: { type: MarkerType.ArrowClosed, color: '#77b6ba' } },
	{ id: 'statistics-inference', source: 'psm-statistics', target: 'protein-inference', markerEnd: { type: MarkerType.ArrowClosed, color: '#77b6ba' } },
	{ id: 'inference-quantification', source: 'protein-inference', target: 'quantification', markerEnd: { type: MarkerType.ArrowClosed, color: '#77b6ba' } },
	{ id: 'quantification-lfq', source: 'quantification', target: 'lfq', markerEnd: { type: MarkerType.ArrowClosed, color: '#77b6ba' } },
];

function WorkflowNode({ data }) {
	const navigateToTool = () => window.location.assign(data.href);
	const handleKeyDown = (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			navigateToTool();
		}
	};

	return (
		<div
			className={`workflow-node workflow-node-${data.accent}`}
			role="link"
			tabIndex="0"
			aria-label={`Open ${data.label}`}
			onClick={navigateToTool}
			onKeyDown={handleKeyDown}
		>
			<Handle type="target" position={Position.Left} />
			<span className="workflow-node-phase">{data.phase}</span>
			<strong className="workflow-node-label">{data.label}</strong>
			<span className="workflow-node-description">{data.description}</span>
			<span className="workflow-node-arrow" aria-hidden="true">→</span>
			<Handle type="source" position={Position.Right} />
		</div>
	);
}

const nodeTypes = { workflow: WorkflowNode };

export default function Workflow() {
	return (
		<div className="workflow-canvas" aria-label="Interactive ProteomIQon workflow map">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				fitView
				fitViewOptions={{ padding: 0.18, minZoom: 0.35, maxZoom: 1.1 }}
				nodesDraggable={false}
				nodesConnectable={false}
				zoomOnScroll
				panOnDrag
				proOptions={{ hideAttribution: true }}
			>
				<Background color="#507289" gap={28} size={1} />
				<Controls showInteractive={false} />
			</ReactFlow>
		</div>
	);
}
