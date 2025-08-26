import { Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { CloseOutlined, CropLandscapeOutlined, RemoveOutlined } from '@mui/icons-material';
import cn from 'classnames';
import HTMLEditorForm from 'modules/common/components/DrawView/items/DrawViewItemHTML/HTMLEditor/HTMLEditorForm';
import React from 'react';
import Draggable from 'react-draggable';
import styles from './HTMLEditor.module.scss';

export interface HTMLEditorDialogProps {
	html: string;
	open: boolean;
	onClose: () => void;
	onSave: (html: string) => void;
}

const HTMLEditorDialog: React.FC<HTMLEditorDialogProps> = ({ open, html, onClose, onSave }) => {
	const [minimized, setMinimized] = React.useState<boolean>(false);
	const [maximized, setMaximized] = React.useState<boolean>(false);
	const [positionDraggable, setPositionDraggable] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [disabledDraggable, setDisabledDraggable] = React.useState<boolean>(false);
	const contentClassNames = cn(styles.content, { [styles.minimized]: minimized });
	const theme = useTheme();

	return (
		<Draggable position={positionDraggable} onDrag={(evt, data) => setPositionDraggable({ x: data.x, y: data.y })} disabled={disabledDraggable}>
			<Dialog
				open={open}
				maxWidth={minimized ? 'xs' : 'lg'}
				fullWidth
				hideBackdrop
				className={styles.dialog}
				fullScreen={useMediaQuery(theme.breakpoints.down('xs')) || (maximized && !minimized)}
				onClose={onClose}
			>
				<DialogTitle style={{ paddingRight: '14px' }}>
					<div className={styles.title}>
						<label>Edytor HTML</label>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
							<IconButton
								onClick={() => {
									setMinimized(!minimized);
									setDisabledDraggable(false);
									setPositionDraggable({ x: 0, y: 0 });
								}}
								size='small'
								color={minimized ? 'primary' : 'default'}
							>
								<RemoveOutlined fontSize='inherit' />
							</IconButton>
							<IconButton
								onClick={() => {
									setMaximized(!maximized);
									if (!minimized) {
										setPositionDraggable({ x: 0, y: 0 });
									}
								}}
								size='small'
								color={maximized ? 'primary' : 'default'}
							>
								<CropLandscapeOutlined fontSize='inherit' />
							</IconButton>
							<IconButton onClick={onClose} size='small'>
								<CloseOutlined fontSize='inherit' />
							</IconButton>
						</div>
					</div>
				</DialogTitle>
				<DialogContent
					onMouseEnter={() => setDisabledDraggable(true)}
					onMouseLeave={() => !maximized && minimized && setDisabledDraggable(false)}
					className={contentClassNames}
				>
					<HTMLEditorForm html={html} onClose={onClose} onSave={onSave} />
				</DialogContent>
			</Dialog>
		</Draggable>
	);
};

export default HTMLEditorDialog;
