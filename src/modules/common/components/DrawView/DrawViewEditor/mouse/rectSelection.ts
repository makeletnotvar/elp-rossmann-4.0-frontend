import { MouseDragStartPosition } from 'modules/common/components/DrawView/DrawViewEditor/mouse/mouseHooks';

function isItemMatchSelectRect(item: HTMLElement, rect: { x1: number; x2: number; y1: number; y2: number }): boolean {
	const x = item.offsetLeft;
	const y = item.offsetTop;
	const { x1, x2, y1, y2 } = rect;

	const greaterX = Math.max(x1, x2);
	const lowerX = Math.min(x1, x2);
	const greaterY = Math.max(y1, y2);
	const lowerY = Math.min(y1, y2);

	return x >= lowerX && x <= greaterX && y >= lowerY && y <= greaterY;
}

export function showRectSelect() {
	setRectSelect(0, 0, 0, 0);
	const rectEl: HTMLElement | null = document.querySelector('[data-select-rect]');
	if (rectEl) rectEl.style.display = 'block';
}

export function hideRectSelect() {
	const rectEl: HTMLElement | null = document.querySelector('[data-select-rect]');
	if (rectEl) {
		rectEl.style.display = 'none';
		setRectSelect(0, 0, 0, 0);
	}
}

export function setRectSelect(left: number, top: number, width: number, height: number) {
	const rectEl: HTMLElement | null = document.querySelector('[data-select-rect]');

	if (rectEl) {
		rectEl.style.left = `${left}px`;
		rectEl.style.top = `${top}px`;
		rectEl.style.width = `${width}px`;
		rectEl.style.height = `${height}px`;
	}
}

export function relativeWorkspaceCursorPosition(x: number, y: number, zoom: number = 1) {
	const workspaceEl = document.querySelector('[data-workspace]');
	if (workspaceEl) {
		const { top, left } = workspaceEl.getBoundingClientRect();
		return { x: x / zoom - left, y: y / zoom - top };
	}

	return { x, y };
}

export function rectSelect(evt: MouseEvent, dragStartPosition: MouseDragStartPosition, selectHandler: (selected: number[]) => void, zoom: number): void {
	const { clientX, clientY } = evt;
	const { x: x1, y: y1 } = relativeWorkspaceCursorPosition(dragStartPosition.x, dragStartPosition.y, zoom);
	const { x: x2, y: y2 } = relativeWorkspaceCursorPosition(clientX, clientY, zoom);

	const greaterX = Math.max(x1, x2);
	const lowerX = Math.min(x1, x2);
	const greaterY = Math.max(y1, y2);
	const lowerY = Math.min(y1, y2);

	setRectSelect(lowerX, lowerY, greaterX - lowerX, greaterY - lowerY);

	const selectedItems = Array.from<HTMLElement>(document.querySelectorAll('[data-item-id]'))
		.filter(item => isItemMatchSelectRect(item, { x1, x2, y1, y2 }))
		.map(item => Number(item.dataset.itemId));

	selectHandler(selectedItems);
}
