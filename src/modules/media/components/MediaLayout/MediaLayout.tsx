import { DeviceHubOutlined } from '@mui/icons-material';
import Content from 'modules/common/components/Layout/Content/Content';
import Loader from 'modules/common/components/Loaders/Loader';
import { useDevicePoints } from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsHooks';
import MediaMenu from 'modules/media/components/MediaLayout/MediaMenu/MediaMenu';
import MediaTabs from 'modules/media/components/MediaTabs/MediaTabs';
import MediaTitleBar from 'modules/media/components/MediaTitleBar/MediaTitleBar';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './MediaLayout.module.scss';

interface MediaLayoutProps {
	device: DetailedDevice | null;
}

const MediaLayout: React.FC<MediaLayoutProps> = ({ device }) => {
	const {
		match: {
			params: { deviceUUID, tab },
		},
	} = useRouter<{ deviceUUID: string; tab: string }>();
	const { t } = useTranslation();
	const { points, fetched, fetching } = useDevicePoints(deviceUUID);

	return (
		<div className={styles.container}>
			<MediaTitleBar label={`${device ? `${device.name}` : ''} - ${t(`media.media_${tab}`)}`} icon={DeviceHubOutlined}>
				<div id='media-title-bar-content'></div>
			</MediaTitleBar>
			<Content className={styles.main}>
				<aside className={styles.menu}>
					<MediaMenu deviceUUID={deviceUUID} />
				</aside>
				<section className={styles.content}>
					{fetched && <MediaTabs points={points} />}
					{fetching && <Loader />}
				</section>
			</Content>
		</div>
	);
};

export default MediaLayout;
