import { CircularProgress } from '@mui/material';
import CancelButton from 'modules/common/components/Buttons/CancelButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import CustomFileInputDialog from 'modules/files/components/CustomFileInput/CustomFileInputDialog/CustomFileInputDialog';
import React, { lazy, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CustomFileInputView.module.scss';
const FilesFolders = lazy(() => import('modules/files/components/FilesFolders/FilesFolders'));
const FilesView = lazy(() => import('modules/files/components/FilesView/FilesView'));
const FilesViewHeader = lazy(() => import('modules/files/components/FilesViewHeader/FilesViewHeader'));

interface CustomFileInputViewProps {
	value: string | undefined;
	onChangeFile: (file: FileType | null) => void;
	folders: string[];
	fetchingFolders: boolean;
	files: FileType[];
	fetchingFiles: boolean;
	folder?: string;
	onChangeFolder: (folderPath: string) => void;
	openDialog: boolean;
	onOpenDialog: () => void;
	onSubmitDialog: () => void;
	onCloseDialog: () => void;
	choosedFiles: File[];
	setChoosedFiles: (files: File[]) => void;
	onSubmit: () => void;
	query: string;
	onSearch: (query: string) => void;
	onSetQuery: (query: string) => void;
	onReset: () => void;
}

const CustomFileInputView: React.FC<CustomFileInputViewProps> = ({
	value,
	onChangeFile,
	folders,
	fetchingFolders,
	files,
	fetchingFiles,
	folder,
	onChangeFolder,
	openDialog,
	onSubmitDialog,
	onOpenDialog,
	onCloseDialog,
	choosedFiles,
	setChoosedFiles,
	onSubmit,
	query,
	onSearch,
	onSetQuery,
	onReset,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation();
	const loadingFoldersAndFiles = fetchingFolders && fetchingFiles;
	const folderPathExist = Boolean(folder);

	return (
		<>
			<div className={styles.container}>
				<input style={{ height: '100%' }} readOnly type='text' defaultValue={value} />
				<button style={{ height: '100%', fontSize: '11px' }} onClick={onOpenDialog}>
					Wybierz
				</button>
			</div>
			<CustomFileInputDialog open={openDialog} onClose={onCloseDialog}>
				<div className={styles.dialogContainer}>
					<FilesFolders
						folders={folders}
						folder={folder}
						onChange={folderPath => {
							onChangeFolder(folderPath);
							if (choosedFiles.length > 0) {
								setChoosedFiles([]);
							}
							if (query) {
								onReset();
							}
						}}
						loadingFoldersAndFiles={fetchingFolders}
						filesCount={(files && files.length) || 0}
					/>
					<div className={styles.viewContainer} ref={containerRef}>
						{folderPathExist && !loadingFoldersAndFiles && (
							<>
								<FilesViewHeader
									containerRef={containerRef}
									files={files}
									choosedFiles={choosedFiles}
									setChoosedFiles={setChoosedFiles}
									onSubmit={onSubmit}
									onSearch={onSearch}
									onSetQuery={onSetQuery}
									onReset={onReset}
									query={query}
									enableUpload
								/>
								<FilesView files={files} folder={folder} choosedFileURL={value} onChange={onChangeFile} enableRenameAndDelete />
							</>
						)}
						{!folderPathExist && (
							<div className={styles.loading}>
								<h2 style={{ color: '#ccc' }}>Wybierz folder</h2>
							</div>
						)}
						{loadingFoldersAndFiles && (
							<div className={styles.loading}>
								<CircularProgress disableShrink variant='indeterminate' color='primary' />
							</div>
						)}
					</div>
				</div>
				<div className={styles.footer}>
					<CancelButton onClick={onCloseDialog}>{t('general.cancel')}</CancelButton>
					<ConfirmButton noSubmit onClick={onSubmitDialog}>
						{t('general.choose')}
					</ConfirmButton>
				</div>
			</CustomFileInputDialog>
		</>
	);
};

export default CustomFileInputView;
