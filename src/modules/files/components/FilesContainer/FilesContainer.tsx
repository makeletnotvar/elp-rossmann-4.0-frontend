import { CircularProgress } from '@mui/material';
import Content from 'modules/common/components/Layout/Content/Content';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { useFiles } from 'modules/files/hooks/useFiles';
import { useFilesFilters } from 'modules/files/hooks/useFilesFilters';
import { useFolders } from 'modules/files/hooks/useFolders';
import { filesActions } from 'modules/files/redux/files';
import * as React from 'react';
import { lazy, useCallback, useEffect, useRef, useState } from 'react';
import styles from './FilesContainer.module.scss';
const FilesFolders = lazy(() => import('modules/files/components/FilesFolders/FilesFolders'));
const FilesView = lazy(() => import('modules/files/components/FilesView/FilesView'));
const FilesViewHeader = lazy(() => import('modules/files/components/FilesViewHeader/FilesViewHeader'));

const FilesContainer: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [choosedFiles, setChoosedFiles] = useState<File[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<FileType[]>([]);
	const { folders, fetching: fetchingFolders } = useFolders();
	const {
		updateSettings,
		urlParams: { path },
	} = useFilesFilters();
	const { files, fetching: fetchingFiles } = useFiles();
	const dispatch = useDispatch();
	const filteredFiles = searchResults.length > 0 ? searchResults : files;
	const loadingFoldersAndFiles = fetchingFolders && fetchingFiles;
	const folderPathExist = Boolean(path);

	const onClickFolder = (folderPath: string) => {
		updateSettings({ path: folderPath });
	};

	const onSubmit = useCallback(() => {
		const formData = new FormData();
		choosedFiles.forEach(choosedFile => formData.append('files', choosedFile));
		if (path) {
			dispatch(filesActions.upload.request(formData, path));
		}
		setChoosedFiles([]);
	}, [choosedFiles]);

	const searchHandler = useCallback(
		(query: string): void => {
			const filteredResults = files.filter(folderFile => folderFile.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
			setSearchResults(filteredResults);
		},
		[files]
	);

	const resetSearchHandler = (): void => {
		searchHandler('');
		setSearchQuery('');
		setSearchResults([]);
	};

	useEffect(() => {
		resetSearchHandler();
	}, [path]);

	return (
		<div className={styles.container}>
			<Content className={styles.content}>
				<FilesFolders
					folders={folders.sort()}
					onChange={onClickFolder}
					loadingFoldersAndFiles={loadingFoldersAndFiles}
					filesCount={(files && files.length) || 0}
					folder={path}
				/>
				<div className={styles.viewContainer} ref={containerRef}>
					{folderPathExist && !loadingFoldersAndFiles && (
						<>
							<FilesViewHeader
								containerRef={containerRef}
								files={files.sort()}
								choosedFiles={choosedFiles}
								setChoosedFiles={setChoosedFiles}
								onSubmit={onSubmit}
								onSearch={searchHandler}
								onSetQuery={setSearchQuery}
								onReset={resetSearchHandler}
								query={searchQuery}
								enableUpload
							/>
							<FilesView files={filteredFiles.sort()} folder={path} enableRenameAndDelete />
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
			</Content>
		</div>
	);
};

export default FilesContainer;
