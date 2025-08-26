import { useDispatch } from 'modules/common/helpers/redux/useActions';
import CustomFileInputView from 'modules/files/components/CustomFileInput/CustomFileInputView';
import { useFiles } from 'modules/files/hooks/useFiles';
import { useFolders } from 'modules/files/hooks/useFolders';
import { filesActions } from 'modules/files/redux/files';
import React, { useCallback, useEffect, useState } from 'react';
export interface CustomFileInputProps {
	value: string | undefined;
	onChange: (file: FileType | null) => void;
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({ value, onChange }) => {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [choosedFile, setChoosedFile] = useState<FileType | null>(null);
	const [folder, setFolder] = useState<string | undefined>();
	const { folders, fetching: fetchingFolders } = useFolders();
	const { files, fetching: fetchingFiles } = useFiles(folder);
	const [choosedFiles, setChoosedFiles] = useState<File[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<FileType[]>([]);
	const filteredFiles = searchResults.length > 0 ? searchResults : files;
	const dispatch = useDispatch();

	const onOpenDialog = () => {
		setOpenDialog(true);
	};

	const onSubmitDialog = () => {
		onChange(choosedFile);
		setOpenDialog(false);
	};

	const onCloseDialog = () => {
		setOpenDialog(false);
		setFolder(undefined);
		dispatch(filesActions.resetFiles());
	};

	const onChangeFile = (file: FileType | null) => {
		setChoosedFile(file);
	};

	const onChangeFolder = (folderPath: string) => {
		setFolder(folderPath);
	};

	const onSubmit = useCallback(() => {
		const formData = new FormData();
		choosedFiles.forEach(choosedFile => formData.append('files', choosedFile));
		if (folder) {
			dispatch(filesActions.upload.request(formData, folder));
		}
		setChoosedFiles([]);
	}, [choosedFiles, folder]);

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
	}, []);

	return (
		<CustomFileInputView
			value={value}
			files={filteredFiles.sort()}
			fetchingFiles={fetchingFiles}
			onChangeFile={onChangeFile}
			folders={folders.sort()}
			fetchingFolders={fetchingFolders}
			folder={folder}
			onChangeFolder={onChangeFolder}
			openDialog={openDialog}
			onOpenDialog={onOpenDialog}
			onSubmitDialog={onSubmitDialog}
			onCloseDialog={onCloseDialog}
			choosedFiles={choosedFiles}
			setChoosedFiles={setChoosedFiles}
			onSubmit={onSubmit}
			onSearch={searchHandler}
			onSetQuery={setSearchQuery}
			onReset={resetSearchHandler}
			query={searchQuery}
		/>
	);
};

export default CustomFileInput;
