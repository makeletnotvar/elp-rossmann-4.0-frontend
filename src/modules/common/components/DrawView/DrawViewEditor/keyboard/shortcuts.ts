import { UpdateItemParams, UpdateItemStyle, createNewItemId } from 'modules/common/components/DrawView/DrawViewEditor/editingState';
import JSClipboard from 'modules/common/components/DrawView/DrawViewEditor/helpers/JSClipboard';
import { getItem } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import items, { DrawViewItem } from 'modules/common/components/DrawView/items/items';
import { CSSProperties } from 'react';

export const ITEMS_COPY_ACTION_IDENTIFIER = 'VtGSOOCIrp';

export function selectAllHandler(evt: React.KeyboardEvent, view: DrawView, selectHandler: (items: number[]) => void) {
	evt.preventDefault();

	if (view && view.config && view.config.items) {
		const itemsIndexes = view.config.items.map(item => item.id);
		selectHandler(itemsIndexes);
	}
}

export function unselectAllHandler(evt: React.KeyboardEvent, view: DrawView, selectHandler: (items: number[]) => void) {
	evt.preventDefault();

	if (view && view.config && view.config.items) {
		selectHandler([]);
	}
}

export function copyViewItemsHandler(evt: React.KeyboardEvent, view: DrawView, selected: number[], onCopy: (count: number) => void) {
	const selectedIsNotEmpty: boolean = selected.length > 0;

	if (view && view.config && view.config.items && selectedIsNotEmpty) {
		const viewItems: DrawViewItem[] = view.config.items;
		const selectedItems: DrawViewItem[] = viewItems.filter(item => selected.includes(item.id));

		if (selectedItems.length > 0) {
			JSClipboard.copyObject(ITEMS_COPY_ACTION_IDENTIFIER, selectedItems);
			onCopy(selectedItems.length);
		}
	}
}

export function pasteViewItemsHandler(evt: React.KeyboardEvent, view: DrawView, selectHandler: (items: number[]) => void, onPaste?: any) {
	if (evt.currentTarget.tagName !== 'input') {
		JSClipboard.pasteObject(ITEMS_COPY_ACTION_IDENTIFIER).then((items: any) => {
			if (items && items.length > 0 && view && view.config && view.config.items) {
				const newId = createNewItemId(view.config.items);
				const nextItems = items.map((item: DrawViewItem, index: number) => ({ ...item, id: newId + index }));
				const nextItemsIds = nextItems.map((item: DrawViewItem) => item.id);
				setTimeout(() => {
					nextItemsIds.length > 0 && selectHandler(nextItemsIds);
				}, 1);
				onPaste(nextItems);
			}
		});
	}
}

export function duplicateHandler(
	evt: React.KeyboardEvent,
	view: DrawView,
	selected: number[],
	selectHandler: (items: number[]) => void,
	onDuplicate: (itemsIds: number[]) => void
) {
	evt.preventDefault();

	if (selected.length > 0) {
		onDuplicate(selected);

		if (view && view.config && view.config.items) {
			const newId = createNewItemId(view.config.items);
			const nextSelected = (selected.map((id, index) => newId + index) as number[]) || [];
			setTimeout(() => {
				nextSelected.length > 0 && selectHandler(nextSelected);
			}, 1);
		}
	}
}

export function deleteHandler(evt: React.KeyboardEvent, selected: number[], selectHandler: (items: number[]) => void, onDelete: (itemsIds: number[]) => void) {
	evt.preventDefault();

	if (selected.length > 0) {
		onDelete(selected);
		selectHandler([]);
	}
}

export function updateZPostionHandler(evt: React.KeyboardEvent, items: DrawViewItem[], selected: number[], updateItemParams: UpdateItemParams) {
	evt.preventDefault();
	selected.map(selectedId => {
		const item = getItem(items, selectedId);
		const currentZ = item && item.z ? item.z : 0;
		const modZ = evt.key === 'PageDown' ? -1 : 1;
		let z = currentZ + modZ;
		if (z < 1) z = 1;
		if (z > 999) z = 999;
		updateItemParams(selectedId, { z });
	});
}

const isItemTextStyleEnabled = (_items: DrawViewItem[], itemId: number): boolean => {
	const item = getItem(_items, itemId);
	if (item) {
		const itemConfig = items[item.type];
		return Boolean(itemConfig && itemConfig.styles && itemConfig.styles.includes('text'));
	}
	return false;
};

const updateTextStyleHandler = (
	evt: React.KeyboardEvent,
	view: DrawView,
	selected: number[],
	updateItemStyleHandler: UpdateItemStyle,
	param: keyof CSSProperties,
	value: string
) => {
	evt.preventDefault();
	if (selected.length > 0 && view.config && view.config.items) {
		const refItemId = selected[0];
		const refItem = getItem(view.config.items, refItemId);

		if (refItem) {
			const style = refItem.style || {};
			const nextState: any = style[param] !== value ? value : '';

			selected.forEach(selectedId => {
				if (isItemTextStyleEnabled(view.config!.items!, selectedId)) {
					updateItemStyleHandler(selectedId, { [param]: nextState });
				}
			});
		}
	}
};

export function boldTextHandler(evt: React.KeyboardEvent, view: DrawView, selected: number[], updateItemStyleHandler: UpdateItemStyle) {
	updateTextStyleHandler(evt, view, selected, updateItemStyleHandler, 'fontWeight', 'bold');
}

export function underlineTextHandler(evt: React.KeyboardEvent, view: DrawView, selected: number[], updateItemStyleHandler: UpdateItemStyle) {
	updateTextStyleHandler(evt, view, selected, updateItemStyleHandler, 'textDecoration', 'underline');
}

export function italicTextHandler(evt: React.KeyboardEvent, view: DrawView, selected: number[], updateItemStyleHandler: UpdateItemStyle) {
	updateTextStyleHandler(evt, view, selected, updateItemStyleHandler, 'fontStyle', 'italic');
}
