import MediaLayout from 'modules/media/components/MediaLayout/MediaLayout';
import { useDevice } from 'modules/media/hooks/useDevice';
import React from 'react';

const MediaLayoutContainer: React.FC = () => {
	const { device, fetched } = useDevice();

	return <>{fetched && <MediaLayout device={device} />}</>;
};

export default MediaLayoutContainer;
