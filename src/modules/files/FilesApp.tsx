// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import FilesContainer from 'modules/files/components/FilesContainer/FilesContainer';
import * as React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import { getFilesModule } from './redux/index';

const FilesApp: React.FC = () => {
	return (
		<DynamicModuleLoader modules={[getFilesModule()]}>
			<FilesContainer />
		</DynamicModuleLoader>
	);
};

export default FilesApp;
