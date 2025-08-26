import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { filesActions, useFilesState } from 'modules/files/redux/files';
import { useEffect } from 'react';

export function useFiles(folderPath?: string) {
	const dispatch = useDispatch();
	const { files, fetching } = useFilesState();

	useEffect(() => {
		if (folderPath) {
			dispatch(filesActions.getFiles.request(folderPath));
		}
	}, [folderPath]);

	return { files, fetching };
}
