type Point = { x: number; y: number };
type Size = { width: number; height: number };
type Box = Point & Size;
type Phase = { center: Point; radius: number };
type Tool = { radius: number; label?: Size };

const fullTurn = 2 * Math.PI;
const boxAt = ({ x, y }: Point, width: number, height: number): Box =>
	({ x: x - width / 2, y: y - height / 2, width, height });

function overlaps(a: Box, b: Box) {
	return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function inside(box: Box, canvas: Size, margin = 4) {
	return box.x >= margin && box.y >= margin
		&& box.x + box.width <= canvas.width - margin && box.y + box.height <= canvas.height - margin;
}

function angleDifference(a: number, b: number) {
	return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
}

function pointAt(origin: Point, angle: number, distance: number): Point {
	return { x: origin.x + Math.cos(angle) * distance, y: origin.y + Math.sin(angle) * distance };
}

export function placeCollapsedDots(origin: Phase, count: number, canvas: Size, phaseIndex: number) {
	const rotation = -Math.PI / 2 + phaseIndex * .73;

	return Array.from({ length: count }, (_, index) => {
		const angle = rotation + index * fullTurn / count + [0, -.18, .16, -.09][index % 4];
		const gap = [9, 17, 11, 22][(index + phaseIndex) % 4] + Math.floor(index / 8) * 10;
		const initialDistance = origin.radius + gap;
		// Tilt dots near an edge just enough to keep their entire glass outline visible.
		for (const bend of [0, -.16, .16, -.32, .32, -.5, .5]) {
			const point = pointAt(origin.center, angle + bend, initialDistance);
			if (inside(boxAt(point, 8, 8), canvas, 1)) return point;
		}
		return pointAt(origin.center, angle, origin.radius + 6);
	});
}

type Placement = { point: Point; above: boolean; angle: number; boxes: Box[]; cost: number };

export function placeToolSatellites(canvas: Size, origin: Phase, tools: Tool[], dots: Point[], otherPhases: Phase[]) {
	if (!tools.length) return [];

	const obstacles = [origin, ...otherPhases].map(({ center, radius }) => boxAt(center, radius * 2 + 6, radius * 2 + 6));
	const maxDistance = Math.hypot(canvas.width, canvas.height);
	const directions = 48;

	function choices(tool: Tool, index: number) {
		const dot = dots[index];
		const preferred = Math.atan2(dot.y - origin.center.y, dot.x - origin.center.x);
		const placements: Placement[] = [];
		const minDistance = origin.radius + tool.radius + 18;

		for (let step = 0; step < directions; step++) {
			const angle = preferred + step * fullTurn / directions;
			let found = 0;
			for (let distance = minDistance; distance < maxDistance && found < 5; distance += 19) {
				const point = pointAt(origin.center, angle, distance);
				const node = boxAt(point, tool.radius * 2 + 7, tool.radius * 2 + 7);
				if (!inside(node, canvas) || obstacles.some((obstacle) => overlaps(node, obstacle))) continue;

				const preferAbove = Math.sin(angle) < -.35;
				const crossesPhase = otherPhases.some(({ center, radius }) => crossesCircle(origin.center, point, center, radius + 3));
				const baseCost = distance + 40 * angleDifference(angle, preferred) + (crossesPhase ? 100 : 0);
				for (const above of tool.label ? [preferAbove, !preferAbove] : [false]) {
					const boxes = [node];
					if (tool.label) {
						const label = tool.label;
						const y = point.y + (above ? -1 : 1) * (tool.radius + 8 + label.height / 2);
						const text = boxAt({ x: point.x, y }, label.width + 4, label.height + 4);
						if (!inside(text, canvas) || obstacles.some((obstacle) => overlaps(text, obstacle))) continue;
						boxes.push(text);
					}

					const cost = baseCost + (above !== preferAbove && tool.label ? 8 : 0);
					placements.push({ point, above, angle, boxes, cost });
					found += 1;
				}
			}
		}
		return placements.sort((a, b) => a.cost - b.cost);
	}

	const candidates = tools.map(choices);

	function search(budget: number) {
		let states: { placements: Placement[]; cost: number }[] = [{ placements: [], cost: 0 }];
		for (const options of candidates) {
			const shortlist = options.slice(0, budget);
			const next = [];
			for (const state of states) {
				for (const item of shortlist) {
					if (state.placements.some((prior) => prior.boxes.some((a) => item.boxes.some((b) => overlaps(a, b))))) continue;

					const spacingCost = state.placements.reduce((cost, prior) => {
						const separation = angleDifference(item.angle, prior.angle);
						const cutsThroughNode = crossesBox(origin.center, item.point, prior.boxes[0])
							|| crossesBox(origin.center, prior.point, item.boxes[0]);
						return cost + 65 * Math.max(0, .7 - separation) + (cutsThroughNode ? 140 : 0);
					}, 0);
					next.push({ placements: [...state.placements, item], cost: state.cost + item.cost + spacingCost });
				}
			}
			states = next.sort((a, b) => a.cost - b.cost).slice(0, 20);
		}
		return states[0]?.placements;
	}

	return search(70) ?? search(210) ?? [];
}

function crossesCircle(start: Point, end: Point, point: Point, radius: number) {
	const dx = end.x - start.x;
	const dy = end.y - start.y;
	const along = ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy);
	return along > 0 && along < 1 && Math.hypot(point.x - start.x - along * dx, point.y - start.y - along * dy) < radius;
}

function crossesBox(start: Point, end: Point, box: Box) {
	const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
	return crossesCircle(start, end, center, Math.min(box.width, box.height) / 2);
}
