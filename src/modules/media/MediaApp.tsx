// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import MediaContainer from 'modules/media/containers/MediaContainer';
import { getMediaModule } from 'modules/media/redux';
import * as React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules';

const MediaApp: React.FC = () => {
	return (
		<DynamicModuleLoader modules={[getMediaModule()]}>
			<MediaContainer />
		</DynamicModuleLoader>
	);
};

export default MediaApp;
