import cn from 'classnames';
import { DrawViewItem, getItemLabel } from 'modules/common/components/DrawView/items/items';
import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import * as React from 'react';
import styles from './DrawViewEditorForm.module.scss';

interface DrawViewEditorItemsListProps {
	items: DrawViewItem[];
	selected: number[];
	select: (itemsIds: number[]) => void;
}

const DrawViewEditorItemsList: React.FC<DrawViewEditorItemsListProps> = ({ items, selected, select }) => {
	return (
		<div className={styles.itemsListContainer}>
			<EditorFormGroup label='view_editor.params.view_items_list' disableCollapse>
				<div className={styles.wrapper}>
					<table>
						<tbody>
							{items
								.sort((a: any, b: any) => b.z - a.z)
								.map(item => (
									<tr key={item.id} className={cn({ [styles.selected]: selected.includes(item.id) })} onClick={() => select([item.id])}>
										<td className={styles.id}>{item.id}</td>
										<td className={styles.type}>{item.type}</td>
										<td className={styles.label}>{getItemLabel(item)}</td>
										<td className={styles.z}>{item.z}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</EditorFormGroup>
		</div>
	);
};

export default DrawViewEditorItemsList;
