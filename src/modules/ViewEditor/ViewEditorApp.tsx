// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import ViewEditorContainer from 'modules/ViewEditor/ViewEditorContainer';
import { getViewEditorModule } from 'modules/ViewEditor/redux';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import * as React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules';

const ViewEditor: React.FC = () => {
	return (
		<>
			<AuthDev>
				<DynamicModuleLoader modules={[getViewEditorModule()]}>
					<ViewEditorContainer />
				</DynamicModuleLoader>
			</AuthDev>
		</>
	);
};

export default ViewEditor;
