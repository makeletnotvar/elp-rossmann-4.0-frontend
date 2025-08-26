import { useMenuActions } from 'modules/common/components/DrawView/DrawViewEditor/DrawViewEditorMenuBar/DrawViewEditorMenuBar';
import { arrowKeysDownHandler, arrowKeysUpHandler } from 'modules/common/components/DrawView/DrawViewEditor/keyboard/arrows';
import {
	boldTextHandler,
	copyViewItemsHandler,
	deleteHandler,
	duplicateHandler,
	italicTextHandler,
	pasteViewItemsHandler,
	selectAllHandler,
	underlineTextHandler,
	unselectAllHandler,
	updateZPostionHandler,
} from 'modules/common/components/DrawView/DrawViewEditor/keyboard/shortcuts';
import { tabKeyHandler } from 'modules/common/components/DrawView/DrawViewEditor/keyboard/tab';
import { useCallback, useEffect } from 'react';
import { EditingViewStateActions } from '../editingState';

function mount(keyDownHandler: any, keyUpHandler: any) {
	window.addEventListener('keydown', keyDownHandler);
	window.addEventListener('keyup', keyUpHandler);

	return () => {
		window.removeEventListener('keydown', keyDownHandler);
		window.removeEventListener('keyup', keyUpHandler);
	};
}

export const useKeyboard = (
	selected: number[],
	view: DrawView,
	selectHandler: (items: number[]) => void,
	actions: EditingViewStateActions,
	editorFocus: boolean
) => {
	const { saveView } = useMenuActions(view);

	const keyPressHandler: any = useCallback(
		(evt: React.KeyboardEvent) => {
			const { key, ctrlKey } = evt;
			const noActiveDialogs = !document.querySelector('div[role=dialog]');
			if (editorFocus) {
				switch (key) {
					case 'ArrowUp':
					case 'ArrowRight':
					case 'ArrowLeft':
					case 'ArrowDown':
						arrowKeysDownHandler(evt, selected, view, actions);
						break;
					case 'Tab':
						tabKeyHandler(evt, selected, view, selectHandler);
						break;
					case '.':
						ctrlKey && noActiveDialogs && unselectAllHandler(evt, view, selectHandler);
						break;
					case 'a':
						ctrlKey && noActiveDialogs && selectAllHandler(evt, view, selectHandler);
						break;
					case 'b':
						ctrlKey && boldTextHandler(evt, view, selected, actions.updateItemStyle);
						break;
					case 'c':
						ctrlKey && noActiveDialogs && copyViewItemsHandler(evt, view, selected, actions.copyItems);
						break;
					case 'd':
						ctrlKey && noActiveDialogs && duplicateHandler(evt, view, selected, selectHandler, actions.duplicateItems);
						break;
					case 'u':
						ctrlKey && underlineTextHandler(evt, view, selected, actions.updateItemStyle);
						break;
					case 'i':
						ctrlKey && italicTextHandler(evt, view, selected, actions.updateItemStyle);
						break;
					case 'v':
						ctrlKey && noActiveDialogs && pasteViewItemsHandler(evt, view, selectHandler, actions.pasteItems);
						break;
					case 'z':
						ctrlKey && actions.undoAction();
						break;
					case 'y':
						ctrlKey && actions.redoAction();
						break;
					case 's':
						if (ctrlKey) {
							evt.preventDefault();
							saveView();
						}
						break;
					case 'Delete':
						ctrlKey && noActiveDialogs && deleteHandler(evt, selected, selectHandler, actions.deleteItems);
						break;
					case 'PageDown':
					case 'PageUp':
						updateZPostionHandler(evt, view.config!.items!, selected, actions.updateItemParams);
						break;
					default:
						break;
				}
			}
		},
		[selected, view, editorFocus]
	);

	const keyUpHandler: any = useCallback(
		(evt: React.KeyboardEvent) => {
			const { key } = evt;

			switch (key) {
				case 'ArrowUp':
				case 'ArrowRight':
				case 'ArrowLeft':
				case 'ArrowDown':
					arrowKeysUpHandler(evt, selected, actions);
					break;
				default:
					break;
			}
		},
		[selected, view, editorFocus]
	);

	useEffect(() => mount(keyPressHandler, keyUpHandler), [selected, editorFocus, view]);

	return { view };
};
