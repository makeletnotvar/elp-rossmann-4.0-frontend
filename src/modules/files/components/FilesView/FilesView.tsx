import { CloseOutlined, DateRangeOutlined, DeleteOutlined, DescriptionOutlined, EditOutlined, ImageOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Dialog, Drawer, IconButton, InputAdornment, ListItemText, Menu, MenuItem, TextField, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import cn from 'classnames';
import CancelButton from 'modules/common/components/Buttons/CancelButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import ConfirmDialog, { useConfirmDialog } from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import Param from 'modules/common/components/Params/Param';
import Params from 'modules/common/components/Params/Params';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { filesActions } from 'modules/files/redux/files';
import moment from 'moment';
import * as React from 'react';
import { useCallback, useState } from 'react';
import styles from './FilesView.module.scss';

interface FilesViewProps {
	files: FileType[];
	folder?: string;
	onChange?: (file: FileType) => void;
	choosedFileURL?: string;
	enableRenameAndDelete?: boolean;
}

const FilesView: React.FC<FilesViewProps> = ({ files, folder, onChange, choosedFileURL, enableRenameAndDelete }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [doubleClickedFile, setDoubleClickedFile] = useState<FileType | null>(null);
	const [clickedFile, setClickedFile] = useState<FileType | null>(null);
	const [clickedMoreFile, setClickedMoreFile] = useState<FileType | null>(null);
	const [renamingFile, setRenamingFile] = useState<FileType | null>(null);
	const [newFileName, setNewFileName] = useState<string>('');
	const dispatch = useDispatch();
	const { closeConfirm, openConfirm, isConfirm } = useConfirmDialog();
	const theme = useTheme();

	const onClickContext = (evt: any, file: FileType | null) => {
		evt.preventDefault();
		setClickedFile(file);
		setAnchorEl(evt.currentTarget);
	};

	const onCloseContext = () => {
		setAnchorEl(null);
	};

	const onClickMore = (file: FileType | null) => {
		onCloseContext();
		setClickedMoreFile(file);
	};

	const onDelete = (file: FileType | null) => {
		if (file && folder) {
			dispatch(filesActions.delete.request(file.name, folder));
		}
	};

	const confirmedDeleteHandler = useCallback(() => {
		closeConfirm();
		onDelete(clickedFile);
	}, [clickedFile]);

	const onRename = async () => {
		if (clickedFile && newFileName && folder) {
			dispatch(filesActions.rename.request(folder, { newFileName: `${newFileName}.${clickedFile.name.split('.').pop()}`, oldFileName: clickedFile.name }));
			setRenamingFile(null);
			setNewFileName('');
		}
	};

	return (
		<div className={styles.container}>
			{files &&
				files.length > 0 &&
				files.map(file => {
					return (
						<Tooltip key={file.name} title={`${file.name}`}>
							<div
								className={cn(styles.item, {
									[styles.tempSelectedItem]: clickedFile && file.name === clickedFile.name,
									[styles.selectedItem]: choosedFileURL && choosedFileURL === file.url,
								})}
								onClick={() => {
									onChange && onChange(file);
									setClickedFile(file);
								}}
								onDoubleClick={() => setDoubleClickedFile(file)}
								onContextMenu={evt => onClickContext(evt, file)}
							>
								<img
									src={`/${import.meta.env.VITE_APP_FILES_MAIN_FOLDER}/${file.url}`}
									alt={file.name}
									className={styles.image}
									onError={(e: any) => {
										e.target.onerror = null;
										e.target.src = '/images/files/error.png';
									}}
								/>
								<div className={styles.name}>{file.name.split('/').pop()}</div>
							</div>
						</Tooltip>
					);
				})}
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'center',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'center',
					horizontal: 'left',
				}}
				open={Boolean(anchorEl)}
				onClose={onCloseContext}
				className={styles.menu}
				elevation={1}
			>
				<MenuItem
					className={styles.menuItem}
					onClick={() => {
						onCloseContext();
						setDoubleClickedFile(clickedFile);
					}}
				>
					<DescriptionOutlined />
					<ListItemText primary='Zobacz plik' />
				</MenuItem>
				{enableRenameAndDelete && (
					<>
						<MenuItem
							className={styles.menuItem}
							onClick={() => {
								onCloseContext();
								openConfirm();
							}}
						>
							<DeleteOutlined />
							<ListItemText primary='Usuń plik' />
						</MenuItem>
						<MenuItem
							className={styles.menuItem}
							onClick={() => {
								onCloseContext();
								setRenamingFile(clickedFile);
							}}
						>
							<EditOutlined />
							<ListItemText primary='Zmień nazwę' />
						</MenuItem>
					</>
				)}
				<MenuItem className={styles.menuItem} onClick={() => onClickMore(clickedFile)}>
					<MoreHorizOutlined />
					<ListItemText primary='Szczegóły' />
				</MenuItem>
			</Menu>
			<Drawer transitionDuration={0} anchor={'right'} open={Boolean(clickedMoreFile)} onClose={() => setClickedMoreFile(null)}>
				<div className={styles.moreDrawer}>
					<div className={styles.moreDrawerHeader}>
						{clickedMoreFile && clickedMoreFile.name.split('/').pop()}
						<IconButton style={{ color: '#fff' }} onClick={() => setClickedMoreFile(null)}>
							<CloseOutlined />
						</IconButton>
					</div>
					<div className={styles.moreDrawerContentImage}>
						<img
							src={(clickedMoreFile && `/${import.meta.env.VITE_APP_FILES_MAIN_FOLDER}/${clickedMoreFile.url}`) || ''}
							alt={(clickedMoreFile && clickedMoreFile.name) || ''}
							className={styles.moreDrawerImage}
							onDoubleClick={() => {
								setClickedMoreFile(null);
								setDoubleClickedFile(clickedMoreFile);
							}}
							onError={(e: any) => {
								e.target.onerror = null;
								e.target.src = '/images/files/error.png';
							}}
						/>
					</div>
					<Params title={'Szczegóły'} hideCount collapsable={false}>
						<Param label={'Data utworzenia'} value={clickedMoreFile && moment(clickedMoreFile.createdOn).format('lll')} icon={DateRangeOutlined} />
						<Param label={'Data modyfikacji'} value={clickedMoreFile && moment(clickedMoreFile.lastModified).format('lll')} icon={DateRangeOutlined} />
						<Param label={'Wielkość'} value={`${clickedMoreFile && clickedMoreFile.size} KB`} icon={ImageOutlined} />
						<Param label={'Format'} value={clickedMoreFile && clickedMoreFile.format} icon={ImageOutlined} />
					</Params>
				</div>
			</Drawer>
			<Dialog
				transitionDuration={0}
				open={Boolean(doubleClickedFile)}
				onClose={() => setDoubleClickedFile(null)}
				maxWidth='xl'
				fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}
			>
				<div className={styles.moreDialog}>
					<div className={styles.moreDialogHeader}>
						{doubleClickedFile && doubleClickedFile.name.split('/').pop()}
						<IconButton style={{ color: '#fff' }} onClick={() => setDoubleClickedFile(null)}>
							<CloseOutlined />
						</IconButton>
					</div>
					<div className={styles.moreDialogContent}>
						<img
							src={(doubleClickedFile && `/${import.meta.env.VITE_APP_FILES_MAIN_FOLDER}/${doubleClickedFile.url}`) || ''}
							alt={(doubleClickedFile && doubleClickedFile.name) || ''}
							className={styles.moreDialogImage}
							onError={(e: any) => {
								e.target.onerror = null;
								e.target.src = '/images/files/error.png';
							}}
						/>
					</div>
				</div>
			</Dialog>
			<Dialog open={Boolean(renamingFile)} onClose={() => setRenamingFile(null)}>
				<div className={styles.renameDialog}>
					<div className={styles.renameDialogHeader}>Zmień nazwę pliku</div>
					<div className={styles.renameDialogContent}>
						<TextField
							autoFocus
							margin='dense'
							label='Nowa nazwa pliku'
							type='text'
							fullWidth
							value={newFileName || (clickedFile && clickedFile.name.split('.').shift())}
							onChange={e => setNewFileName(e.target.value)}
							InputProps={{
								endAdornment: <InputAdornment position='end'>{`.${clickedFile && clickedFile.name.split('.').pop()}`}</InputAdornment>,
							}}
						/>
					</div>
					<div className={styles.renameDialogActions}>
						<CancelButton onClick={() => setRenamingFile(null)}>Anuluj</CancelButton>
						<ConfirmButton onClick={onRename}>Ok</ConfirmButton>
					</div>
				</div>
			</Dialog>
			<ConfirmDialog
				title={'Usuwanie pliku'}
				message={`Czy na pewno chcesz usunąć plik ${clickedFile && clickedFile.name}?`}
				open={isConfirm}
				onCancel={closeConfirm}
				onConfirm={confirmedDeleteHandler}
			/>
		</div>
	);
};

export default FilesView;
