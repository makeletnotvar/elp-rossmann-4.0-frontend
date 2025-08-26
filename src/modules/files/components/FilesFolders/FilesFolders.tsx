import { FolderOutlined } from '@mui/icons-material';
import { TreeItem, TreeView } from '@mui/lab';
import cn from 'classnames';
import { generateFolderPathTree } from 'modules/files/helpers/generateFolderPathTree';
import React from 'react';
import styles from './FilesFolders.module.scss';

interface FilesFoldersProps {
	folders: string[];
	folder?: string;
	filesCount: number;
	loadingFoldersAndFiles: boolean;
	onChange: (folderPath: string) => void;
}

const FilesFolders: React.FC<FilesFoldersProps> = ({ folders, folder, filesCount, loadingFoldersAndFiles, onChange }) => {
	return (
		<div className={styles.container}>
			<TreeView
				className={styles.treeViewContainer}
				defaultCollapseIcon={<FolderOutlined />}
				defaultExpandIcon={<FolderOutlined />}
				defaultExpanded={generateFolderPathTree(folder || '')}
			>
				<div
					className={cn({
						[styles.loadingData]: loadingFoldersAndFiles,
					})}
				>
					<FilesFoldersTree folders={folders} folderPath={folder} filesCount={filesCount} loadingFoldersAndFiles={loadingFoldersAndFiles} onChange={onChange} />
				</div>
			</TreeView>
		</div>
	);
};

interface FilesFoldersTreeProps {
	folders: string[];
	path?: string;
	folderPath: string | undefined;
	filesCount: number;
	loadingFoldersAndFiles: boolean;
	onChange: (folderPath: string) => void;
}

const FilesFoldersTree: React.FC<FilesFoldersTreeProps> = ({ folders, path, folderPath, filesCount, loadingFoldersAndFiles, onChange }) => {
	const subfolders = folders.filter(folder => {
		if (path !== undefined) {
			return folder.startsWith(`${path}/${folder.split('/').pop()}`);
		} else {
			return !folder.includes('/');
		}
	});

	if (subfolders.length === 0) {
		return null;
	}

	return (
		<>
			{subfolders.map((subfolder, index) => {
				const subfolderName = subfolder.split('/').pop() as string;
				const selectedFolder = folderPath === subfolder;

				return (
					<TreeItem
						className={cn(styles.treeViewItem, {
							[styles.selectedFolder]: selectedFolder,
							[styles.loadingDataTwo]: loadingFoldersAndFiles,
						})}
						key={index}
						nodeId={subfolder}
						onClick={() => onChange(subfolder)}
						label={subfolderName.charAt(0).toUpperCase() + subfolderName.slice(1)}
					>
						<FilesFoldersTree
							folders={folders}
							path={subfolder}
							folderPath={folderPath}
							filesCount={filesCount}
							loadingFoldersAndFiles={loadingFoldersAndFiles}
							onChange={onChange}
						/>
					</TreeItem>
				);
			})}
		</>
	);
};

export default FilesFolders;
