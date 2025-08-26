/* eslint-disable no-mixed-spaces-and-tabs */
import cn from 'classnames';
import { buildingUnitsActions } from 'modules/building/redux/buildingUnits';
import DrawViewToolsContainer from 'modules/common/components/DrawView/DrawViewEditor/DrawViewTools/DrawViewToolsContainer';
import { DrawViewItem } from 'modules/common/components/DrawView/items/items';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useDraggable } from 'react-use-draggable-scroll';
import { useTransformer } from '../../StyleTransformer/context/StyleTransformerContext';
import styles from './DrawViewEditor.module.scss';
import DrawViewEditorContext from './DrawViewEditorContext/DrawViewEditorContext';
import DrawViewEditorForm from './DrawViewEditorForm/DrawViewEditorForm';
import { useDrawViewStyle, useWorkspaceZoom } from './DrawViewEditorHooks';
import DrawViewEditorItemContext from './DrawViewEditorItemContext/DrawViewEditorItemContext';
import DrawViewEditorItemsProvider from './DrawViewEditorItemsProvider/DrawViewEditorItemsProvider';
import DrawViewEditorMenuBar from './DrawViewEditorMenuBar/DrawViewEditorMenuBar';
import { useEditingView } from './editingState';
import { useOutsideClick } from './helpers/useOutsideClick';
import { useKeyboard } from './keyboard/keyboardHooks';
import { useMouse } from './mouse/mouseHooks';

interface DrawViewEditorProps {
	view: DrawView;
	editing: boolean;
}

const DrawViewEditor: React.FC<DrawViewEditorProps> = ({ view, editing }) => {
	const [loadingImage, setLoadingImage] = useState<boolean>(true);
	const divRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
	const { events } = useDraggable(divRef);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [ctrlMouse, setCtrlMouse] = useState<boolean>(false);
	const { view: editingView, actions, editorFocus, setEditorFocus } = useEditingView(view);
	const { zoom, wheelHandler } = useWorkspaceZoom(editingView, divRef);
	const [contextMenu, setContextMenu] = useState<any>(null);
	const style = useDrawViewStyle(editingView, zoom);

	/**
	 * Keyboard and mouse events handlers written as hooks
	 */
	const { mouseDownHandler, selected, toggleSelectionHandler, select, dragging } = useMouse(editingView, actions, editorFocus, setEditorFocus, zoom, ctrlMouse);
	useKeyboard(selected, editingView, select, actions, editorFocus);
	const items: DrawViewItem[] = editingView && editingView.config && editingView.config.items ? editingView.config.items : [];
	const ref = useOutsideClick(() => {
		setEditorFocus(false);
	});
	const { setActive } = useTransformer();

	useEffect(() => {
		const isImgItem = items.some(item => item.type === 'static_image' || item.type === 'dynamic_image');
		if (!isImgItem) {
			setLoadingImage(false);
		}
	}, [items]);

	useEffect(() => {
		view && view?.building && view?.building?.uuid && dispatch(buildingUnitsActions.get.request(view?.building?.uuid));
	}, [view]);

	const onSetImageLoading = (loadingImage: boolean) => {
		setLoadingImage(loadingImage);
	};

	const handleClick = (evt: React.MouseEvent, type: string) => {
		evt.preventDefault();
		evt.stopPropagation();
		if (!contextMenu) {
			setContextMenu({
				type,
				top: evt.pageY,
				left: evt.pageX,
				x: evt.clientX,
				y: evt.clientY,
			});
		}
	};

	return (
		<>
			{/* {loadingImage && (
				<Loader
					label='Ładowanie widoku'
					style={{ backgroundColor: '#fff', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				/>
			)} */}
			<div className={styles.container}>
				<DrawViewEditorMenuBar
					editingView={editingView}
					ctrlMouse={ctrlMouse}
					setCtrlMouse={setCtrlMouse}
					undoAction={actions.undoAction}
					redoAction={actions.redoAction}
				/>
				<div className={styles.row}>
					<div className={styles.workspaceWrapper} onWheel={wheelHandler} onMouseDown={evt => evt.ctrlKey && events.onMouseDown(evt)} ref={divRef}>
						<div
							ref={ref}
							style={style}
							className={cn(styles.workspace, {
								[styles.grid]: true,
								[styles.dragging]: dragging,
							})}
							data-workspace
							onClick={() => setEditorFocus(true)}
							onMouseDown={mouseDownHandler}
							onContextMenu={evt => handleClick(evt, 'VIEW')}
						>
							{items
								? items.map((item: DrawViewItem) => {
										return (
											<DrawViewEditorItemsProvider
												key={item.id}
												item={item}
												setActive={setActive}
												isSelected={selected.includes(item.id)}
												onSelect={toggleSelectionHandler(item.id)}
												select={select}
												actions={actions}
												editing={editing}
												handleClick={handleClick}
												selected={selected}
												buildingUUID={editingView.building?.uuid}
												onSetImageLoading={onSetImageLoading}
											/>
										);
								  })
								: 'view.editor.error'}
							<div data-select-rect className={styles.selectRect} style={{ display: 'none' }}></div>
						</div>
					</div>
					<DrawViewEditorForm view={editingView} selected={selected} actions={actions} select={select} />
				</div>
			</div>
			<DrawViewEditorContext actions={actions} contextMenu={contextMenu} select={select} setContextMenu={setContextMenu} view={editingView} />
			<DrawViewEditorItemContext
				selected={selected}
				view={editingView}
				select={select}
				actions={actions}
				editorFocus={editorFocus}
				setContextMenu={setContextMenu}
				contextMenu={contextMenu}
			/>
			{/* Rendered remotely in portal */}
			<DrawViewToolsContainer actions={actions} select={select} view={editingView} />
		</>
	);
};

export default DrawViewEditor;
