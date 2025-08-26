import { UI } from 'config/ui';
import { getItemElement, getItemsElements } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import { limitItemWorkspacePosition, updateItemsPositions } from 'modules/common/components/DrawView/DrawViewEditor/helpers/position';
import {
	hideRectSelect,
	rectSelect,
	relativeWorkspaceCursorPosition,
	showRectSelect,
} from 'modules/common/components/DrawView/DrawViewEditor/mouse/rectSelection';
import { useCallback, useEffect, useState } from 'react';
import { EditingViewStateActions, UpdateItemStyle } from '../editingState';

export type MouseDragStartPosition = { x: number; y: number };
type Size = { width: number; height: number };
type ItemSizes = { [id: number]: Size };

function dragItems(
	evt: MouseEvent,
	selected: number[],
	dragStartPosition: MouseDragStartPosition,
	workspaceWidth: number,
	workspaceHeight: number,
	zoom: number,
	ctrlMouse: boolean
) {
	const STEP_IN_PX = evt.ctrlKey && (ctrlMouse ? evt.shiftKey : true) ? UI.VIEW_EDITOR.MOUSE_MOVE_STEP_PX : 1;

	const moveX = (evt.clientX - dragStartPosition.x) / zoom;
	const moveY = (evt.clientY - dragStartPosition.y) / zoom;

	getItemsElements(selected).forEach(itemElement => {
		const { x, y } = limitItemWorkspacePosition(itemElement, moveX, moveY, workspaceWidth, workspaceHeight, STEP_IN_PX);
		itemElement.style.left = `${x}px`;
		itemElement.style.top = `${y}px`;
	});
}

function getItemsResizedSizes(
	evt: MouseEvent,
	selected: number[],
	dragStartPosition: MouseDragStartPosition,
	zoom: number,
	resizeInitialSizes: ItemSizes,
	callback: (sizes: ItemSizes) => void
) {
	const moveX = (evt.clientX - dragStartPosition.x) / zoom;
	const moveY = (evt.clientY - dragStartPosition.y) / zoom;

	const resizedSizes =
		selected.reduce((sizes, nextItemId) => {
			const size = resizeInitialSizes[nextItemId];
			const el = getItemElement(nextItemId);
			const nextWidth = size!.width + moveX;
			const nextHeight = size!.height + moveY;

			if (el) {
				el.style.width = `${Math.round(nextWidth)}px`;
				el.style.height = `${Math.round(nextHeight)}px`;
			}

			return {
				...sizes,
				[nextItemId]: {
					width: Math.round(nextWidth),
					height: Math.round(nextHeight),
				},
			};
		}, {} as ItemSizes) || {};

	callback(resizedSizes);
}

function resizeItems(nextSizes: ItemSizes, updateItemStyle: UpdateItemStyle) {
	return Object.entries(nextSizes).forEach(([itemId, nextSize]) => {
		updateItemStyle(Number(itemId), nextSize);
	});
}

function getItemsSizes(selected: number[]): ItemSizes {
	return selected.reduce((sizes, nextItemId) => {
		const el = getItemElement(nextItemId);
		return { ...sizes, [nextItemId]: { width: el!.offsetWidth, height: el!.offsetHeight } };
	}, {} as ItemSizes);
}

function dragView(evt: MouseEvent, dragStart: MouseDragStartPosition) {
	const workspaceEl: HTMLElement | null = document.querySelector('[data-workspace]');
	const { x: clientX, y: clientY } = relativeWorkspaceCursorPosition(evt.clientX, evt.clientY);
	const { x: startX, y: startY } = relativeWorkspaceCursorPosition(dragStart.x, dragStart.y);

	if (workspaceEl) {
		workspaceEl.style.transform = `translate(${clientX - startX}px, ${clientY - startY}px)`;
	}
}

function useSelection() {
	const [selected, select] = useState<number[]>([]);

	const toggleSelectedItem = useCallback(
		(index: number) => {
			const nextSelected = selected.includes(index) ? selected.filter(i => i !== index) : [...selected, index];

			select(nextSelected);
		},
		[selected]
	);

	const toggleSelectionHandler = useCallback(
		(index: number) => (evt: React.MouseEvent<HTMLDivElement>) => {
			evt.stopPropagation();
			evt.shiftKey ? toggleSelectedItem(index) : select(selected.length > 1 && evt.shiftKey ? [...selected, index] : [index]);
		},
		[selected]
	);

	const resetSelectionHandler = useCallback(() => {
		select([]);
	}, []);

	return {
		selected,
		select,
		toggleSelectionHandler,
		resetSelectionHandler,
	};
}

function isItemOrChildElement(element: HTMLElement | null): boolean {
	return element !== null && Boolean(element.dataset.itemId || isItemOrChildElement(element!.parentElement));
}

function isItemDraggingEvent(evt: React.MouseEvent<HTMLElement>): boolean {
	const element: HTMLElement | null = (evt.nativeEvent as any).toElement as HTMLElement;
	return isItemOrChildElement(element);
}

function isItemResizingEvent(evt: React.MouseEvent<HTMLElement>): boolean {
	return checkIfAnyParentNode(evt.target as HTMLElement, (el: HTMLElement) => Boolean(el.getAttribute('data-resize')));
}

function checkIfAnyParentNode(el: HTMLElement, fn: (el: HTMLElement) => boolean): boolean {
	return (el && fn(el)) || Boolean(el.parentElement && checkIfAnyParentNode(el.parentElement, fn));
}

function isEditorTargetEvent(evt: MouseEvent): boolean {
	return checkIfAnyParentNode(evt.target as HTMLElement, el => Boolean(el.dataset.workspace));
}

export function useMouse(
	view: DrawView,
	actions: EditingViewStateActions,
	editorFocus: boolean,
	setEditorFocus: (focus: boolean) => void,
	zoom: number,
	ctrlMouse: boolean
) {
	const [dragging, setDragging] = useState<boolean>(false);
	const [dragStartPosition, setDragStartPosition] = useState<MouseDragStartPosition | null>(null);
	const [viewDragging, setViewDragging] = useState<boolean>(false);

	const [resizing, setResizing] = useState<boolean>(false);
	const [resizeInitialSizes, startResizeInitialSizes] = useState<{ [id: number]: Size } | null>(null);
	const [resizeFinalSizes, setResizeFinalSizes] = useState<{ [id: number]: Size } | null>(null);

	const { selected, toggleSelectionHandler, select } = useSelection();
	const [rectSelecting, setRectSelecting] = useState<boolean>(false);

	/**
	 * Mouse event has many scenarios:
	 *
	 * * start dragging
	 * * start resizing
	 * * start selecting by rectangle
	 */
	const mouseDownHandler = useCallback(
		(evt: React.MouseEvent<HTMLElement>) => {
			evt.preventDefault();
			setEditorFocus(true);
			hideRectSelect();
			setDragStartPosition({ x: evt.clientX, y: evt.clientY });
			setResizeFinalSizes(null);

			if (isItemResizingEvent(evt)) {
				setResizing(true);
				startResizeInitialSizes(getItemsSizes(selected));
			} else if (isItemDraggingEvent(evt)) {
				setDragging(true);
			} else if (evt.shiftKey) {
				setRectSelecting(true);
				showRectSelect();
			} else {
				select([]);
			}
		},
		[selected, rectSelecting, dragStartPosition, dragging, resizing, resizeFinalSizes]
	);

	const mouseUpHandler = useCallback(
		(evt: MouseEvent) => {
			setDragStartPosition(null);
			startResizeInitialSizes(null);
			hideRectSelect();

			// Mouse up out of editor, unset focus
			if (!isEditorTargetEvent(evt)) {
				setEditorFocus(false);
			}

			if (dragging) {
				setDragging(false);
			} else if (resizing) {
				setResizing(false);
				if (resizeFinalSizes) {
					resizeItems(resizeFinalSizes, actions.updateItemStyle);
				}
			} else if (rectSelecting) {
				setRectSelecting(false);
			} else if (viewDragging) {
				setViewDragging(false);
			}

			updateItemsPositions(selected, actions.updateItemPosition);
		},
		[dragging, rectSelecting, selected, resizing, resizeFinalSizes, resizeInitialSizes, viewDragging]
	);

	const mouseMoveHandler = useCallback(
		(evt: MouseEvent) => {
			if (dragStartPosition) {
				if (dragging && (ctrlMouse ? evt.ctrlKey : true)) {
					const config = view.config!;
					dragItems(evt, selected, dragStartPosition, config.width || 0, config.height || 0, zoom, ctrlMouse);
				} else if (resizing && resizeInitialSizes) {
					getItemsResizedSizes(evt, selected, dragStartPosition, zoom, resizeInitialSizes, setResizeFinalSizes);
				} else if (rectSelecting) {
					rectSelect(evt, dragStartPosition, select, zoom);
				} else if (viewDragging) {
					dragView(evt, dragStartPosition);
				}
			}
		},
		[selected, dragging, dragStartPosition, rectSelecting, zoom, resizing, resizeInitialSizes, viewDragging]
	);

	/**
	 * Events binded to window
	 */
	useEffect(() => {
		window.addEventListener('mouseup', mouseUpHandler);
		window.addEventListener('mousemove', mouseMoveHandler);

		return () => {
			window.removeEventListener('mouseup', mouseUpHandler);
			window.removeEventListener('mousemove', mouseMoveHandler);
		};
	}, [dragging, resizing, rectSelecting, resizeFinalSizes, viewDragging]);

	return {
		mouseDownHandler,
		toggleSelectionHandler,
		selected,
		select,
		viewDragging,
		dragging,
	};
}
