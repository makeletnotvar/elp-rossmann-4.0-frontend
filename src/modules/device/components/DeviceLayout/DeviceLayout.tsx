import { HomeOutlined } from '@mui/icons-material';
import { BUILDING_NEW } from 'modules/building/components/BuildingLayout/BuildingMenu/BuildingMenu';
import Content from 'modules/common/components/Layout/Content/Content';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import DeviceMenu from 'modules/device/components/DeviceLayout/DeviceMenu/DeviceMenu';
import DeviceTabs from 'modules/device/components/DeviceTabs/DeviceTabs';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './DeviceLayout.module.scss';

interface DeviceLayoutProps {
	device: Device | undefined;
}

const DeviceLayout: React.FC<DeviceLayoutProps> = ({ device }) => {
	const {
		match: {
			params: { tab },
		},
	} = useRouter<{ tab: string }>();
	const { t } = useTranslation();

	const deviceName = device && device.name ? `${t('devices.params.device')}  ${device.name}` : '';

	const label: string = tab === BUILDING_NEW ? t('devices.new_device') : `${deviceName} - ${t('devices.tabs.' + tab)}`;

	return (
		<div className={styles.container}>
			<TitleBar label={label} icon={HomeOutlined}>
				<div id='device-title-bar-content'></div>
			</TitleBar>
			<Content className={styles.main}>
				<aside className={styles.menu}>{device && <DeviceMenu />}</aside>
				<section className={styles.content}>
					<DeviceTabs device={device} />
				</section>
			</Content>
		</div>
	);
};

export default DeviceLayout;
