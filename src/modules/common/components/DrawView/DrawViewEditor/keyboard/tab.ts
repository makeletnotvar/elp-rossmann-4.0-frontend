
export function switchSelection(selected: number[], itemsIndexes: number[], selectHandler: (items: number[]) => void, reverse: boolean = false) {
    if (selected.length > 0) {
        const currentIndex = itemsIndexes.indexOf(selected[0]);
        const nextSelected = (currentIndex + 1) % itemsIndexes.length;
        selectHandler([itemsIndexes[nextSelected]]);
    } else {
        selectHandler([itemsIndexes[0]]);
    }
}

export function tabKeyHandler(evt: React.KeyboardEvent, selected: number[], view: DrawView, selectHandler: (items: number[]) => void) {
    if (view.config && view.config.items) {
        evt.preventDefault();
        const itemsIndexes: number[] = view.config.items.map(item => item.id);
        const reverse = evt.shiftKey;
        switchSelection(selected, itemsIndexes, selectHandler, reverse);
    }
}