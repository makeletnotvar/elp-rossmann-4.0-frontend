import { getItemElement } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';

export function getItemDataPosition(itemElement: HTMLElement): { x: number; y: number } {
	return {
		x: parseFloat(itemElement.getAttribute('data-pos-x') || '0'),
		y: parseFloat(itemElement.getAttribute('data-pos-y') || '0'),
	};
}

export function setItemDataPosition(itemElement: HTMLElement, x: number, y: number) {
	itemElement.setAttribute('data-pos-x', String(parseFloat(itemElement.style.left || '')));
	itemElement.setAttribute('data-pos-y', String(parseFloat(itemElement.style.top || '')));
}

export function limitItemWorkspacePosition(
	item: HTMLElement,
	moveX: number,
	moveY: number,
	workspaceWidth: number,
	workspaceHeight: number,
	step: number = 1
): { x: number; y: number } {
	const { x: currentX, y: currentY } = getItemDataPosition(item);
	const MARGIN = 2;

	let nextX = currentX + moveX;
	let nextY = currentY + moveY;

	let ignoreLimits = false;
	const treeWalker = document.createTreeWalker(item, NodeFilter.SHOW_ELEMENT, {
		acceptNode(node) {
			if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP;
			for (let i = 0; i < node.classList.length; i++) {
				if (node.classList[i].startsWith('DrawViewItemStaticImage')) {
					return NodeFilter.FILTER_ACCEPT;
				}
			}
			return NodeFilter.FILTER_SKIP;
		},
	});

	if (treeWalker.nextNode()) {
		ignoreLimits = true;
	}

	if (!ignoreLimits) {
		// left edge
		if (nextX < 0) {
			nextX = 0;
		}

		// top edge
		if (nextY < 0) {
			nextY = 0;
		}

		// right edge
		const maxX = workspaceWidth - item.offsetWidth - MARGIN;
		if (nextX > maxX) {
			nextX = maxX;
		}

		// bottom edge
		const maxY = workspaceHeight - item.offsetHeight - MARGIN;
		if (nextY > maxY) {
			nextY = maxY;
		}
	}

	return {
		x: Math.round(nextX / step) * step,
		y: Math.round(nextY / step) * step,
	};
}

export function updateItemsPositions(itemsIds: number[], updateItemPositionHandler: (itemId: number, x: number, y: number) => void) {
	itemsIds.forEach(itemId => {
		const itemElement = getItemElement(itemId);

		if (itemElement) {
			setItemDataPosition(itemElement, itemElement.offsetLeft, itemElement.offsetTop);
			updateItemPositionHandler(itemId, itemElement.offsetLeft, itemElement.offsetTop);
		}
	});
}
