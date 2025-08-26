import DrawViewEditorItemForm from 'modules/common/components/DrawView/DrawViewEditor/DrawViewEditorForm/DrawViewEditorItemForm';
import DrawViewEditorItemsList from 'modules/common/components/DrawView/DrawViewEditor/DrawViewEditorForm/DrawViewEditorItemsList';
import DrawViewEditorViewForm from 'modules/common/components/DrawView/DrawViewEditor/DrawViewEditorForm/DrawViewEditorViewForm';
import { EditingViewStateActions } from 'modules/common/components/DrawView/DrawViewEditor/editingState';
import { DrawViewItem } from 'modules/common/components/DrawView/items/items';
import * as React from 'react';
import { getItem, getItemElement } from '../helpers/items';
import styles from './DrawViewEditorForm.module.scss';

interface DrawViewEditorFormProps {
	view: DrawView;
	selected: number[];
	select: (items: number[]) => void;
	actions: EditingViewStateActions;
}

function useSelectedItem(
	items: DrawViewItem[],
	selected: number[]
): { item: DrawViewItem | undefined; itemEl: HTMLElement | null } | undefined {
	if (selected.length === 1) {
		return {
			item: getItem(items, selected[0]),
			itemEl: getItemElement(selected[0]),
		};
	}
}

const DrawViewEditorForm: React.FC<DrawViewEditorFormProps> = ({ view, selected, select, actions }) => {
	const { config = {} } = view;
	const selectedItem = useSelectedItem((config as DrawViewConfig).items!, selected);

	const itemEdit = selectedItem && selectedItem.item && selectedItem.itemEl && config;

	return (
		<div className={styles.container}>
			<div className={styles.topWrapper}>
				{itemEdit ? (
					<DrawViewEditorItemForm
						item={selectedItem!.item as DrawViewItem}
						itemEl={selectedItem!.itemEl as HTMLElement}
						workspaceHeight={view.config!.height || 0}
						workspaceWidth={view.config!.width || 0}
						actions={actions}
						view={view}
					/>
				) : (
					<DrawViewEditorViewForm view={view} actions={actions} />
				)}
			</div>
			<DrawViewEditorItemsList items={view.config!.items!} select={select} selected={selected} />
		</div>
	);
};

export default DrawViewEditorForm;
