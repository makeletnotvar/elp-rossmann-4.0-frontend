import { isEqual } from 'lodash';
import { getItem, getItemElement } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import { limitItemWorkspacePosition } from 'modules/common/components/DrawView/DrawViewEditor/helpers/position';
import { DRAW_VIEW_ITEM_RECT } from 'modules/common/components/DrawView/items/DrawViewItemRect/DrawViewItemRectComponent';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { pointsActions } from 'modules/common/redux/points';
import { pollActions } from 'modules/common/redux/poll';
import { UINotificationsActions } from 'modules/common/redux/uiNotifications';
import { CSSProperties, Reducer, useCallback, useEffect, useReducer, useState } from 'react';
import items, { DrawViewItem } from '../items/items';

export type UpdateItemPosition = (itemId: number, x: number, y: number) => void;
export type UpdateItemParams = (itemId: number, params: Partial<DrawViewItem>) => void;
export type UpdateItemStyle = (itemId: number, nextStyle: CSSProperties) => void;
export type DuplicateItems = (items: number[]) => void;
export type DeleteItems = (items: number[]) => void;
export type AddItem = (itemType: string, position?: { x: number; y: number }, customTemplate?: any) => any;
export type UpdateViewParam = (param: string, value: any, configParam: boolean) => void;
export type PasteItems = (items: DrawViewItem[]) => void;
export type CopyItems = (count?: number) => void;
export type UndoAction = () => void;
export type RedoAction = () => void;

export interface EditingViewStateActions {
	updateItemPosition: UpdateItemPosition;
	updateItemParams: UpdateItemParams;
	updateItemStyle: UpdateItemStyle;
	duplicateItems: DuplicateItems;
	deleteItems: DeleteItems;
	addItem: AddItem;
	updateViewParam: UpdateViewParam;
	pasteItems: PasteItems;
	copyItems: CopyItems;
	undoAction: UndoAction;
	redoAction: RedoAction;
}

export const VIEW_EDITOR_UPDATE_ITEM_PARAMS = 'VIEW_EDITOR_UPDATE_ITEM_PARAMS';
export const VIEW_EDITOR_UPDATE_ITEM_STYLE = 'VIEW_EDITOR_UPDATE_ITEM_STYLE';
export const VIEW_EDITOR_ADD_ITEM = 'VIEW_EDITOR_ADD_ITEM';
export const VIEW_EDITOR_DUPLICATE_ITEMS = 'VIEW_EDITOR_DUPLICATE_ITEMS';
export const VIEW_EDITOR_DELETE_ITEMS = 'VIEW_EDITOR_DELETE_ITEMS';
export const VIEW_EDITOR_PASTE_ITEMS = 'VIEW_EDITOR_PASTE_ITEMS';
export const VIEW_EDITOR_UPDATE_VIEW_PARAM = 'VIEW_EDITOR_UPDATE_VIEW_PARAM';
export const VIEW_EDITOR_UPDATE_VIEW_CONFIG_PARAM = 'VIEW_EDITOR_UPDATE_VIEW_CONFIG_PARAM';
export const HISTORY_LOAD = 'HISTORY_LOAD';

export const createNewItemId = (items: DrawViewItem[]): number => {
	const id = Math.max(...items.map(item => item.id), -1) + 1;
	return Number.isFinite(id) ? id : 0;
};

const viewReducer = (state: DrawView, action: any): DrawView => {
	switch (action.type) {
		case VIEW_EDITOR_UPDATE_ITEM_PARAMS: {
			const { itemId, nextParams } = action.payload;
			return {
				...state,
				config: {
					...state.config,
					items: state.config!.items!.map(item => (item.id === itemId ? { ...item, ...nextParams } : item)),
				},
			};
		}
		case VIEW_EDITOR_UPDATE_ITEM_STYLE: {
			const { itemId, nextStyle } = action.payload;
			return {
				...state,
				config: {
					...state.config,
					items: state.config!.items!.map(item => (item.id === itemId ? { ...item, style: { ...(item.style || {}), ...nextStyle } } : item)),
				},
			};
		}
		case VIEW_EDITOR_ADD_ITEM: {
			return {
				...state,
				config: {
					...state.config,
					items: [...state.config!.items!, { ...action.payload.item }],
				},
			};
		}
		case VIEW_EDITOR_PASTE_ITEMS: {
			const currentItems = state.config!.items || [];
			const newItems = action.payload.items;

			return {
				...state,
				config: {
					...state.config,
					items: [...currentItems, ...newItems],
				},
			};
		}
		case VIEW_EDITOR_DUPLICATE_ITEMS: {
			const { items: sourceItemsIds } = action.payload;

			if (state.config && state.config.items) {
				const items = state.config.items;
				const newId = createNewItemId(items);

				const newItems = sourceItemsIds
					.map((sourceItemId: number, index: number) => {
						const sourceItem = getItem(state.config!.items!, sourceItemId);
						if (sourceItem) {
							const { x, y } = limitItemWorkspacePosition(getItemElement(sourceItem.id)!, 20, 20, state.config!.width || 500, state.config!.width || 1000);

							return {
								...sourceItem,
								id: newId + index,
								x,
								y,
							};
						}
						return null;
					})
					.filter((item: DrawViewItem | null): item is DrawViewItem => item !== null);

				return {
					...state,
					config: {
						...state.config,
						items: [...items, ...newItems],
					},
				};
			}
			return state;
		}
		case VIEW_EDITOR_DELETE_ITEMS: {
			const { items: itemsIdsToDelete } = action.payload;
			return {
				...state,
				config: {
					...state.config,
					items: state.config!.items!.filter(item => !itemsIdsToDelete.includes(item.id)),
				},
			};
		}
		case VIEW_EDITOR_UPDATE_VIEW_PARAM: {
			const { param, value } = action.payload;
			return {
				...state,
				[param]: value,
			};
		}
		case VIEW_EDITOR_UPDATE_VIEW_CONFIG_PARAM: {
			const { param, value } = action.payload;
			return {
				...state,
				config: {
					...state.config,
					[param]: value,
				},
			};
		}
		case HISTORY_LOAD: {
			return action.payload;
		}
		default:
			return state;
	}
};

const getMaxZIndex = (view: DrawView): number => {
	if (view.config && view.config.items) {
		const nextZ = Math.max(...view.config.items.map(item => item.z || 0));
		return Number.isFinite(nextZ) ? nextZ : 0;
	}
	return 0;
};

export const useEditingView = (_view: DrawView) => {
	const [past, setPast] = useState<DrawView[]>([]);
	const [future, setFuture] = useState<DrawView[]>([]);
	const [isHistoryAction, setIsHistoryAction] = useState(false);

	const addToHistory = useCallback((nextHistoryState: DrawView) => {
		setPast(prevPast => {
			const lastState = prevPast[prevPast.length - 1];
			if (!isEqual(lastState, nextHistoryState)) {
				return [...prevPast, nextHistoryState];
			}
			return prevPast;
		});
	}, []);

	const viewReducerCallback = useCallback(
		(state: DrawView, action: any) => {
			if (action.type !== HISTORY_LOAD && !isHistoryAction) {
				addToHistory(state);
			}
			return viewReducer(state, action);
		},
		[addToHistory, isHistoryAction]
	);

	const [view, dispatchState] = useReducer<Reducer<DrawView, any>>(viewReducerCallback, _view);

	useEffect(() => {
		dispatchState({ type: HISTORY_LOAD, payload: _view });
	}, [JSON.stringify(_view)]);

	const dispatchApi = useDispatch();
	const [editorFocus, setEditorFocus] = useState<boolean>(false);

	const updateItemPosition: UpdateItemPosition = (itemId, x, y) => {
		updateItemParams(itemId, { x, y });
	};

	const updateItemParams: UpdateItemParams = (itemId, nextParams) => {
		dispatchState({
			type: VIEW_EDITOR_UPDATE_ITEM_PARAMS,
			payload: { itemId, nextParams },
		});
		const pointRef: Reference | undefined = (nextParams as any).pointRef;
		const isPointRefUpdate = Boolean(pointRef);

		if (isPointRefUpdate) {
			setTimeout(() => {
				const pointsList = [pointRef!.uuid];
				dispatchApi(pointsActions.get.request(pointsList, true));
				dispatchApi(pollActions.poll.request(pointsList, true));
			}, 500);
		}
	};

	const updateItemStyle: UpdateItemStyle = (itemId, nextStyle) => {
		dispatchState({
			type: VIEW_EDITOR_UPDATE_ITEM_STYLE,
			payload: { itemId, nextStyle },
		});
	};

	const duplicateItems: DuplicateItems = items => {
		dispatchState({
			type: VIEW_EDITOR_DUPLICATE_ITEMS,
			payload: { items },
		});
	};

	const deleteItems: DeleteItems = items => {
		dispatchState({
			type: VIEW_EDITOR_DELETE_ITEMS,
			payload: { items },
		});
	};

	const pasteItems: PasteItems = (items: DrawViewItem[]) => {
		dispatchState({
			type: VIEW_EDITOR_PASTE_ITEMS,
			payload: { items },
		});
	};

	const copyItems: CopyItems = (count?: number) => {
		dispatchApi(UINotificationsActions.add({ message: `Skopiowano ${count} elementów.`, variant: 'success', timeout: 800, requireConfirm: false }));
	};

	const addItem: AddItem = async (itemType: string, position?: { x: number; y: number }, customTemplate?: any) => {
		const nextAvaiableZIndex = getMaxZIndex(view) + 1;
		const id = createNewItemId(view.config!.items!);
		const itemTypeTemplate = items[itemType].template;

		let x = (view.config!.width || 0) / 2;
		let y = (view.config!.height || 0) / 2;

		if (itemType === DRAW_VIEW_ITEM_RECT) {
			x -= 100 / 2;
			y -= 100 / 2;
		}

		const item = {
			id,
			x: position ? position.x : x,
			y: position ? position.y : y,
			z: nextAvaiableZIndex,
			...itemTypeTemplate,
			...customTemplate,
		};

		dispatchState({
			type: VIEW_EDITOR_ADD_ITEM,
			payload: { item },
		});

		return Promise.resolve(item);
	};

	const updateViewParam = (param: string, value: any, config: boolean = false) => {
		dispatchState({
			type: config ? VIEW_EDITOR_UPDATE_VIEW_CONFIG_PARAM : VIEW_EDITOR_UPDATE_VIEW_PARAM,
			payload: { param, value },
		});
	};

	const undoAction = useCallback(() => {
		setIsHistoryAction(true);
		if (past.length > 0) {
			const lastPastItem = past[past.length - 1];
			const nextPastItems = past.slice(0, past.length - 1);
			setPast(nextPastItems);
			setFuture([view, ...future]);
			setTimeout(() => {
				dispatchState({
					type: HISTORY_LOAD,
					payload: lastPastItem,
				});
				setIsHistoryAction(false);
			}, 1);
		} else {
			setIsHistoryAction(false);
		}
	}, [past, future, view]);

	const redoAction = useCallback(() => {
		setIsHistoryAction(true);
		if (future.length > 0) {
			const nextState = future[0];
			const nextFuture = future.slice(1);
			setPast([...past, view]);
			setFuture(nextFuture);
			setTimeout(() => {
				dispatchState({
					type: HISTORY_LOAD,
					payload: nextState,
				});
				setIsHistoryAction(false);
			}, 1);
		} else {
			setIsHistoryAction(false);
		}
	}, [past, future, view]);

	return {
		view,
		editorFocus,
		setEditorFocus,
		actions: {
			updateItemPosition,
			updateItemParams,
			updateItemStyle,
			duplicateItems,
			deleteItems,
			addItem,
			updateViewParam,
			pasteItems,
			copyItems,
			redoAction,
			undoAction,
		},
	};
};
