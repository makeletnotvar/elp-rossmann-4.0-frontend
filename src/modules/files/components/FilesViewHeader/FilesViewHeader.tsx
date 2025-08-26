import cn from 'classnames';
import DropAndSelectFiles from 'modules/files/components/FilesViewHeader/DropAndSelectFiles';
import FilesViewHeaderSearch from 'modules/files/components/FilesViewHeader/FilesViewHeaderSearch';
import React from 'react';
import styles from './FilesViewHeader.module.scss';

interface FilesViewHeaderProps {
	files: FileType[];
	enableUpload?: boolean;
	choosedFiles: File[];
	setChoosedFiles: (files: File[]) => void;
	onSubmit: () => void;
	query: string;
	onSearch: (query: string) => void;
	onSetQuery: (query: string) => void;
	onReset: () => void;
	containerRef: React.RefObject<HTMLDivElement>;
}

const FilesViewHeader: React.FC<FilesViewHeaderProps> = ({
	query,
	enableUpload,
	onSetQuery,
	onReset,
	onSearch,
	choosedFiles,
	files,
	setChoosedFiles,
	onSubmit,
	containerRef,
}) => {
	return (
		<div className={cn(styles.container, { [styles.library]: !enableUpload })}>
			{enableUpload && (
				<DropAndSelectFiles
					allowedExtensions={['image/png', 'image/jpeg', 'image/gif']}
					setChoosedFiles={setChoosedFiles}
					choosedFiles={choosedFiles}
					onSubmit={onSubmit}
					files={files}
					containerRef={containerRef}
				/>
			)}
			<FilesViewHeaderSearch onChange={onSetQuery} query={query} onSearch={() => onSearch(query)} onReset={onReset} />
		</div>
	);
};

export default FilesViewHeader;
