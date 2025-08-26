import { BubbleChartOutlined, EditOutlined, InfoOutlined } from '@mui/icons-material';
import VertIconsList from 'modules/common/components/Lists/VertIconsList/VertIconsList';
import VertIconsListItem from 'modules/common/components/Lists/VertIconsList/VertIconsListItem';
import * as React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './DeviceMenu.module.scss';

interface DeviceMenuProps {}

interface DeviceRouteProps {
	uuid: string;
	tab?: string;
}

export const DEVICE_INFO = 'info';
export const DEVICE_EDIT = 'edit';
export const DEVICE_NEW = 'new';
export const DEVICE_POINTS = 'points';

const useDeviceMenu = () => {
	const {
		history,
		match: {
			params: { uuid, tab: activeTab },
		},
	} = useRouter<DeviceRouteProps>();

	const clickTabHandler = useCallback(
		(tab: string) => {
			if (tab !== activeTab) {
				history.push(`/device/${uuid}/${tab}`);
			}
		},
		[activeTab]
	);

	return {
		activeTab,
		clickTabHandler,
	};
};

const DeviceMenu: React.FC<DeviceMenuProps> = () => {
	const { clickTabHandler, activeTab } = useDeviceMenu();
	const { t } = useTranslation();

	return (
		<VertIconsList className={styles.list} size={50}>
			<>
				<VertIconsListItem icon={InfoOutlined} title={t('devices.tabs.info')} onClick={() => clickTabHandler(DEVICE_INFO)} active={activeTab === DEVICE_INFO} />
				<VertIconsListItem
					icon={EditOutlined}
					title={t('devices.tabs.edit')}
					testId='device-edit-button'
					onClick={() => clickTabHandler(DEVICE_EDIT)}
					active={activeTab === DEVICE_EDIT}
				/>
				<VertIconsListItem
					icon={BubbleChartOutlined}
					title={t('devices.tabs.points')}
					onClick={() => clickTabHandler(DEVICE_POINTS)}
					active={activeTab === DEVICE_POINTS}
				/>
			</>
		</VertIconsList>
	);
};

export default DeviceMenu;
