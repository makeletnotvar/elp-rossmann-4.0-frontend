import { ListItemText, Menu, MenuItem } from '@mui/material';
import { DeleteOutline, FileCopyOutlined, InsertDriveFileOutlined } from '@mui/icons-material';
import ConfirmDialog, { useConfirmDialog } from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { EditingViewStateActions } from '../editingState';
import { copyViewItemsHandler, deleteHandler, duplicateHandler } from '../keyboard/shortcuts';
import styles from './DrawViewEditorItemContext.module.scss';

interface DrawViewEditorItemContextProps {
	contextMenu: any;
	setContextMenu: React.Dispatch<any>;
	actions: EditingViewStateActions;
	select: (items: number[]) => void;
	selected: number[];
	view: DrawView;
	editorFocus: boolean;
}

const DrawViewEditorItemContext: React.FC<DrawViewEditorItemContextProps> = ({ contextMenu, setContextMenu, actions, select, selected, view }) => {
	const { t } = useTranslation();
	const { closeConfirm, openConfirm, isConfirm, set, data } = useConfirmDialog();

	const removeItemHandler = useCallback(() => {
		deleteHandler(data, selected, select, actions.deleteItems);
		closeConfirm();
	}, [selected, data]);

	const copyItemHandler = useCallback(
		(evt: any) => {
			copyViewItemsHandler(evt, view, selected, actions.copyItems);
			setContextMenu(null);
		},
		[selected, view]
	);

	const duplicateItemHandler = useCallback(
		(evt: any) => {
			duplicateHandler(evt, view, selected, select, actions.duplicateItems);
			setContextMenu(null);
		},
		[selected, view]
	);

	return (
		<>
			<Menu
				open={(contextMenu && contextMenu.type === 'VIEW_ITEM') || false}
				onClose={() => setContextMenu(null)}
				anchorReference='anchorPosition'
				anchorPosition={contextMenu ? { top: contextMenu.top, left: contextMenu.left } : undefined}
				className={styles.menu}
			>
				<MenuItem className={styles.menuItem} onClick={evt => copyItemHandler(evt)}>
					<InsertDriveFileOutlined />
					<ListItemText primary={t('general.copy')} />
				</MenuItem>
				<MenuItem className={styles.menuItem} onClick={evt => duplicateItemHandler(evt)}>
					<FileCopyOutlined />
					<ListItemText primary={t('general.duplicate')} />
				</MenuItem>
				<MenuItem
					className={styles.menuItem}
					onClick={evt => {
						set(evt);
						setContextMenu(null);
						openConfirm();
					}}
				>
					<DeleteOutline />
					<ListItemText primary={t('general.delete')} />
				</MenuItem>
			</Menu>
			<ConfirmDialog
				title={t('view_editor.messages.deleting_items')}
				message={`${t('view_editor.messages.sure_to_delete_items')}?`}
				open={isConfirm}
				onCancel={closeConfirm}
				onConfirm={removeItemHandler}
			/>
		</>
	);
};

export default DrawViewEditorItemContext;
