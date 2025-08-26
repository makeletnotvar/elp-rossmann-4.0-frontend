import { UI } from "config/ui";
import { getItemsElements } from "modules/common/components/DrawView/DrawViewEditor/helpers/items";
import { limitItemWorkspacePosition, setItemDataPosition } from "modules/common/components/DrawView/DrawViewEditor/helpers/position";
import { EditingViewStateActions } from '../editingState';
import { getItemElement } from '../helpers/items';


type KeyboardMove = { x?: number, y?: number };

export function moveItemsByKeyArrows(items: HTMLElement[], move: KeyboardMove, step = 1, workspaceWidth: number, workspaceHeight: number) {
    const { x, y } = move;
    const moveX = (x || 0) * step;
    const moveY = (y || 0) * step;

    items.forEach(
        item => {
            const { x: nextX, y: nextY } = limitItemWorkspacePosition(item, moveX, moveY, workspaceWidth, workspaceHeight);
            item.style.left = `${nextX}px`;
            item.style.top = `${nextY}px`;
            setItemDataPosition(item, nextX, nextY);
        }
    );
}

export function getXYMoveByKey(key: string): KeyboardMove | null {
    switch (key) {
        case 'ArrowUp':
            return { y: -1 };
        case 'ArrowDown':
            return { y: 1 };
        case 'ArrowLeft':
            return { x: -1 };
        case 'ArrowRight':
            return { x: 1 };
        default:
            return null;
    }
}



export function arrowKeysDownHandler(evt: React.KeyboardEvent, selected: number[], view: DrawView, actions: EditingViewStateActions) {
    evt.preventDefault();

    const $elements: HTMLElement[] = getItemsElements(selected);

    const move = getXYMoveByKey(evt.key);
    const workspaceConfig = view.config!;

    const step = evt.shiftKey
        ? evt.ctrlKey
            ? UI.VIEW_EDITOR.KEYBOARD_MOVES.FAST
            : UI.VIEW_EDITOR.KEYBOARD_MOVES.MID
        : UI.VIEW_EDITOR.KEYBOARD_MOVES.DEFAULT;

    if (move !== null)
        moveItemsByKeyArrows($elements, move, step, workspaceConfig.width || 0, workspaceConfig.height || 0);
}

export function arrowKeysUpHandler(evt: React.KeyboardEvent, selected: number[], actions: EditingViewStateActions) {
    selected.forEach(
        itemId => {
            const itemEl = getItemElement(itemId);
            itemEl && actions.updateItemPosition(itemId, itemEl.offsetLeft, itemEl.offsetTop);
        }
    )
}