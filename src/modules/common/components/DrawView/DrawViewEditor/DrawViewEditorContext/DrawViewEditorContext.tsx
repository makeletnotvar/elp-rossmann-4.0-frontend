import {
	AssignmentOutlined,
	BorderStyleOutlined,
	CameraOutlined,
	ChevronLeftOutlined,
	ChevronRightOutlined,
	CodeOutlined,
	ControlCameraOutlined,
	ExpandLessOutlined,
	ExpandMoreOutlined,
	Filter1Outlined,
	FormatBoldOutlined,
	InsertPhotoOutlined,
	RemoveOutlined,
} from '@mui/icons-material';
import { ListItemText, Menu, MenuItem } from '@mui/material';
import { NestedMenuItem } from 'mui-nested-menu';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DRAW_VIEW_ITEM_DYNAMIC_IMAGE } from '../../items/DrawViewItemDynamicImage/DrawViewItemDynamicImageComponent';
import { DRAW_VIEW_ITEM_HTML } from '../../items/DrawViewItemHTML/DrawViewItemHTMLComponent';
import { DRAW_VIEW_ITEM_PARAM } from '../../items/DrawViewItemParam/DrawViewItemParamComponent';
import { DRAW_VIEW_ITEM_PIPE, pipeTemplate } from '../../items/DrawViewItemPipe/DrawViewItemPipeComponent';
import { DRAW_VIEW_ITEM_RECT } from '../../items/DrawViewItemRect/DrawViewItemRectComponent';
import { DRAW_VIEW_ITEM_STATIC_IMAGE } from '../../items/DrawViewItemStaticImage/DrawViewItemStaticImageComponent';
import { DRAW_VIEW_ITEM_STATIC_TEXT } from '../../items/DrawViewItemStaticText/DrawViewItemStaticTextComponent';
import { DRAW_VIEW_ITEM_VALUE } from '../../items/DrawViewItemValue/DrawViewItemValueComponent';
import { DrawViewItem } from '../../items/items';
import { EditingViewStateActions } from '../editingState';
import JSClipboard from '../helpers/JSClipboard';
import { ITEMS_COPY_ACTION_IDENTIFIER, pasteViewItemsHandler } from '../keyboard/shortcuts';
import styles from './DrawViewEditorContext.module.scss';

interface DrawViewEditorContextProps {
	contextMenu: any;
	setContextMenu: React.Dispatch<any>;
	actions: EditingViewStateActions;
	select: (items: number[]) => void;
	view: DrawView;
}

const DrawViewEditorContext: React.FC<DrawViewEditorContextProps> = ({ contextMenu, setContextMenu, actions, select, view }) => {
	const { t } = useTranslation();
	const [isPasteDisabled, setIsPasteDisabled] = useState(true);

	const checkIfCopied = useCallback(async () => {
		const isCopied = await isCopiedAnyItem();
		setIsPasteDisabled(!isCopied);
	}, []);

	useEffect(() => {
		checkIfCopied();
	}, [checkIfCopied, contextMenu]);

	const addItemHandler = useCallback(
		(itemType: string, style?: any) => () => {
			const position = {
				x: contextMenu.x - (style.width || 100),
				y: contextMenu.y - 90,
			};
			actions.addItem(itemType, position).then((item: DrawViewItem) => select([item.id]));
			setContextMenu(null);
		},

		[contextMenu]
	);

	const addItemPipeHandler = useCallback(
		(itemType: string, template?: any, style?: any, initialDir?: any) => () => {
			const position = {
				x: contextMenu.x - (initialDir === 'right' || initialDir === 'left' ? style.width - 85 : style.width + 65),
				y: contextMenu.y - 90,
			};
			actions
				.addItem(itemType, position, template ? template : { ...pipeTemplate, direction: initialDir, style: { ...pipeTemplate.style, ...style } })
				.then((item: DrawViewItem) => select([item.id]));
			setContextMenu(null);
		},
		[contextMenu]
	);

	const pasteItemHandler = useCallback(
		(evt: any) => {
			pasteViewItemsHandler(evt, view, select, actions.pasteItems);
			setContextMenu(null);
		},
		[view]
	);

	const isCopiedAnyItem = async () => {
		try {
			const isCopied = await JSClipboard.pasteObject(ITEMS_COPY_ACTION_IDENTIFIER);
			return !!isCopied;
		} catch (error) {
			return false;
		}
	};

	return (
		<Menu
			open={(contextMenu && contextMenu.type === 'VIEW') || false}
			onClose={() => setContextMenu(null)}
			anchorReference='anchorPosition'
			anchorPosition={contextMenu ? { top: contextMenu.top, left: contextMenu.left } : undefined}
			className={styles.menu}
		>
			<MenuItem disabled={isPasteDisabled} className={styles.menuItem} onClick={evt => pasteItemHandler(evt)}>
				<AssignmentOutlined />
				<ListItemText primary={t('general.paste')} />
			</MenuItem>
			<MenuItem className={styles.menuItem} onClick={addItemHandler(DRAW_VIEW_ITEM_STATIC_TEXT, { width: 110 })}>
				<FormatBoldOutlined />
				<ListItemText primary={t('view_editor.items.static_text')} />
			</MenuItem>
			<MenuItem className={styles.menuItem} onClick={addItemHandler(DRAW_VIEW_ITEM_STATIC_IMAGE, { width: 150 })}>
				<InsertPhotoOutlined />
				<ListItemText primary={t('view_editor.items.static_image')} />
			</MenuItem>
			<MenuItem className={styles.menuItem} onClick={addItemHandler(DRAW_VIEW_ITEM_VALUE, { width: 110 })}>
				<Filter1Outlined />
				<ListItemText primary={t('view_editor.items.value')} />
			</MenuItem>
			<MenuItem className={styles.menuItem} onClick={addItemHandler(DRAW_VIEW_ITEM_DYNAMIC_IMAGE, { width: 150 })}>
				<CameraOutlined />
				<ListItemText primary={t('view_editor.items.dynamic_image')} />
			</MenuItem>
			<MenuItem className={styles.menuItem} onClick={addItemHandler(DRAW_VIEW_ITEM_RECT, { width: 110 })}>
				<BorderStyleOutlined />
				<ListItemText primary={t('view_editor.items.rect')} />
			</MenuItem>
			<MenuItem className={styles.menuItem} onClick={addItemHandler(DRAW_VIEW_ITEM_HTML, { width: 150 })}>
				<CodeOutlined />
				<ListItemText primary={t('view_editor.items.html')} />
			</MenuItem>
			<MenuItem className={styles.menuItem} onClick={addItemHandler(DRAW_VIEW_ITEM_PARAM, { width: 190 })}>
				<ControlCameraOutlined />
				<ListItemText primary={t('view_editor.items.param')} />
			</MenuItem>
			<NestedMenuItem
				className={styles.menuItem}
				label={t('view_editor.items.pipe')}
				leftIcon={<RemoveOutlined />}
				parentMenuOpen={(contextMenu && contextMenu.type === 'VIEW') || false}
				onClick={() => setContextMenu(null)}
				sx={{ fontSize: '12px' }}
			>
				<MenuItem className={styles.menuItem} onClick={addItemPipeHandler(DRAW_VIEW_ITEM_PIPE, undefined, { width: 10, height: 300 }, 'up')}>
					<ExpandLessOutlined />
				</MenuItem>
				<MenuItem className={styles.menuItem} onClick={addItemPipeHandler(DRAW_VIEW_ITEM_PIPE, undefined, { width: 300, height: 10 }, 'right')}>
					<ChevronRightOutlined />
				</MenuItem>
				<MenuItem className={styles.menuItem} onClick={addItemPipeHandler(DRAW_VIEW_ITEM_PIPE, undefined, { width: 300, height: 10 }, 'left')}>
					<ChevronLeftOutlined />
				</MenuItem>
				<MenuItem className={styles.menuItem} onClick={addItemPipeHandler(DRAW_VIEW_ITEM_PIPE, undefined, { width: 10, height: 300 }, 'down')}>
					<ExpandMoreOutlined />
				</MenuItem>
			</NestedMenuItem>
		</Menu>
	);
};

export default DrawViewEditorContext;
