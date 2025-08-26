import MediaEventsListContainer from 'modules/media/components/MediaTabs/MediaEvents/MediaEventsList/MediaEventsListContainer';
import React from 'react';
import styles from './MediaEvents.module.scss';

interface MediaEventsProps {}

const MediaEvents: React.FC<MediaEventsProps> = () => {
	return (
		<div className={styles.container}>
			<MediaEventsListContainer />
		</div>
	);
};

export default MediaEvents;
