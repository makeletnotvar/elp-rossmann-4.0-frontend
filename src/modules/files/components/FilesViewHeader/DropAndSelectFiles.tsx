import { ClearOutlined, SendOutlined } from '@mui/icons-material';
import { IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import cn from 'classnames';
import ConfirmDialog, { useConfirmDialog } from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './DropAndSelectFiles.module.scss';

interface DropAndSelectFilesProps {
	files: FileType[];
	onSubmit: () => void;
	allowedExtensions: string[];
	choosedFiles: File[];
	setChoosedFiles: (files: File[]) => void;
	containerRef: React.RefObject<HTMLDivElement>;
}

interface ConfirmDialogProps {
	existingFiles: File[];
	choosedFiles: File[];
	filteredFiles: File[];
}

const DropAndSelectFiles: React.FC<DropAndSelectFilesProps> = ({ containerRef, choosedFiles, onSubmit, files, allowedExtensions, setChoosedFiles }) => {
	const [drag, setDrag] = useState<boolean>(false);
	const dragCounter = useRef(0);
	const theme = useTheme();
	const isMobileSize = useMediaQuery(theme.breakpoints.down('md'));
	const { closeConfirm, openConfirm, isConfirm, data, set } = useConfirmDialog<ConfirmDialogProps>();
	const choosedFilesNames = [...choosedFiles].map(file => file.name);

	const addDragOverlay = useCallback(() => {
		if (containerRef.current) {
			const existingOverlay = containerRef.current.querySelector(`.${styles.dragOverlay}`);
			if (!existingOverlay) {
				const overlay = document.createElement('div');
				overlay.className = styles.dragOverlay;
				overlay.textContent = 'Upuść pliki tutaj';
				containerRef.current.appendChild(overlay);
			}
		}
	}, [containerRef]);

	const removeDragOverlay = useCallback(() => {
		if (containerRef.current) {
			const overlay = containerRef.current.querySelector(`.${styles.dragOverlay}`);
			if (overlay) {
				containerRef.current.removeChild(overlay);
			}
		}
	}, [containerRef]);

	const handleDragEnter = useCallback(
		(evt: DragEvent) => {
			evt.preventDefault();
			dragCounter.current += 1;
			if (!drag) {
				setDrag(true);
				addDragOverlay();
			}
		},
		[drag, addDragOverlay]
	);

	const handleDragLeave = useCallback(
		(evt: DragEvent) => {
			evt.preventDefault();
			dragCounter.current -= 1;
			if (dragCounter.current === 0) {
				setDrag(false);
				removeDragOverlay();
			}
		},
		[removeDragOverlay]
	);

	const handleDragOver = useCallback((evt: DragEvent) => {
		evt.preventDefault();
	}, []);

	const handleDrop = useCallback(
		(evt: DragEvent) => {
			evt.preventDefault();
			dragCounter.current = 0;
			setDrag(false);
			removeDragOverlay();

			const newFiles = evt.dataTransfer && evt.dataTransfer.files;
			if (newFiles) {
				const fileArray = Array.from(newFiles);
				const filesNames = files.map(file => {
					const splittedFileNameBySlash = file.name.split('\\');
					const fileName = splittedFileNameBySlash[splittedFileNameBySlash.length - 1];
					return fileName;
				});

				const filteredFiles = fileArray.filter(file => {
					const fileExtension = file.type.toLocaleLowerCase();
					return allowedExtensions.includes(fileExtension);
				});

				const existingFiles = filteredFiles.filter(newFile => filesNames.includes(newFile.name));

				if (existingFiles.length > 0) {
					set({ existingFiles, choosedFiles, filteredFiles });
					openConfirm();
				}

				setChoosedFiles([...choosedFiles, ...filteredFiles]);
			}
		},
		[files, choosedFiles, allowedExtensions]
	);

	const handleChoose = useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			const newFiles: File[] = Array.from(evt.target.files || []);
			const filesNames = files.map(file => {
				const splittedFileNameBySlash = file.name.split('\\');
				const fileName = splittedFileNameBySlash[splittedFileNameBySlash.length - 1];
				return fileName;
			});

			if (newFiles) {
				const filteredFiles = newFiles.filter(file => {
					const fileExtension = file.type.toLocaleLowerCase();
					return allowedExtensions.includes(fileExtension);
				});

				const existingFiles = filteredFiles.filter(newFile => filesNames.includes(newFile.name));

				if (existingFiles.length > 0) {
					set({ existingFiles, choosedFiles, filteredFiles });
					openConfirm();
				}

				setChoosedFiles([...choosedFiles, ...filteredFiles]);
			}
		},
		[files, choosedFiles, allowedExtensions]
	);

	useEffect(() => {
		const viewContainer = containerRef.current;

		if (viewContainer) {
			viewContainer.addEventListener('dragenter', handleDragEnter);
			viewContainer.addEventListener('dragover', handleDragOver);
			viewContainer.addEventListener('dragleave', handleDragLeave);
			viewContainer.addEventListener('drop', handleDrop);

			return () => {
				viewContainer.removeEventListener('dragenter', handleDragEnter);
				viewContainer.removeEventListener('dragover', handleDragOver);
				viewContainer.removeEventListener('dragleave', handleDragLeave);
				viewContainer.removeEventListener('drop', handleDrop);
			};
		}
	}, [handleDragEnter, handleDragOver, handleDragLeave, handleDrop, containerRef]);

	const onConfirmDialog = useCallback(() => {
		closeConfirm();
		if (data) {
			setChoosedFiles([...data.choosedFiles, ...data.filteredFiles]);
		}
	}, [data, closeConfirm, setChoosedFiles]);

	const onCloseDialog = useCallback(() => {
		closeConfirm();
		if (data) {
			setChoosedFiles(data.filteredFiles.filter(file => !data.existingFiles.includes(file)));
		}
	}, [data, closeConfirm, setChoosedFiles]);

	return (
		<div className={styles.dropAndSelectContainer}>
			<div className={cn(styles.dropFileInput)}>
				<div className={cn(styles.dropFileInputLabel)}>
					{choosedFiles.length === 0 && <p style={{ fontSize: '0.8em' }}>Upuść plik lub kliknij i wybierz</p>}
					{choosedFilesNames.length > 0 && (
						<p style={{ fontSize: '0.8em' }}>{isMobileSize ? `Wybrane pliki: ${choosedFilesNames.length}` : choosedFilesNames.join(', ')}</p>
					)}
				</div>
				<input className={cn(styles.dropFileInputInput)} type='file' value='' accept={allowedExtensions.join(', ')} multiple onChange={handleChoose} />
			</div>
			{choosedFiles.length > 0 && (
				<div className={styles.actions}>
					<Tooltip title='Usuń wybrane pliki'>
						<span>
							<IconButton size='small' onClick={() => setChoosedFiles([])} disabled={choosedFiles.length === 0}>
								<ClearOutlined />
							</IconButton>
						</span>
					</Tooltip>
					<Tooltip title='Wyślij wybrane pliki'>
						<span>
							<IconButton size='small' onClick={onSubmit} disabled={choosedFiles.length === 0}>
								<SendOutlined />
							</IconButton>
						</span>
					</Tooltip>
				</div>
			)}
			<ConfirmDialog
				title={'Zastąp pliki'}
				message={`Pliki ${data && [...data.existingFiles].map(file => file.name).join(', ')} już istnieją. Czy chcesz je zastąpić?`}
				onConfirm={onConfirmDialog}
				onCancel={onCloseDialog}
				open={isConfirm}
			/>
		</div>
	);
};

export default DropAndSelectFiles;
