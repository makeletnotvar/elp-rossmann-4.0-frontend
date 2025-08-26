import { createUrl } from 'api/helpers';

const filesAPI = {
	getFolders: () => createUrl('/files/folders'),
	getFiles: (folderPath: string) => createUrl(`/files/files?path=${folderPath}`),
	upload: (folderPath: string) => createUrl(`/files/upload?path=${folderPath}`),
	delete: (file: string, folderPath: string) => createUrl(`/files/delete?path=${folderPath}&file=${file}`),
	rename: (folderPath: string) => createUrl(`/files/rename?path=${folderPath}`),
};

export default filesAPI;
