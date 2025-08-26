import { BarChartOutlined, ReportProblemOutlined, ShowChartOutlined, ViewModuleOutlined } from '@mui/icons-material';
import VertIconsList from 'modules/common/components/Lists/VertIconsList/VertIconsList';
import VertIconsListItem from 'modules/common/components/Lists/VertIconsList/VertIconsListItem';
import { useApp } from 'modules/common/selectors/app';
import { useActiveEventsCount } from 'modules/media/hooks/useActiveEventsCount';
import * as React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './MediaMenu.module.scss';

export const MEDIA_READINGS = 'readings';
export const MEDIA_CONSUMPTIONS = 'consumptions';
export const MEDIA_PARAMS = 'params';
export const MEDIA_EVENTS = 'events';

const useMediaMenu = () => {
	const {
		history,
		match: {
			params: { deviceUUID, tab: activeTab },
		},
	} = useRouter<{ deviceUUID: string; tab: string }>();

	const clickTabHandler = useCallback(
		(tab: string) => {
			if (tab !== activeTab) {
				history.push(`/media/${deviceUUID}/${tab}`);
			}
		},
		[activeTab]
	);

	return {
		activeTab,
		clickTabHandler,
	};
};

interface MediaMenuProps {
	deviceUUID: string;
}

const MediaMenu: React.FC<MediaMenuProps> = ({ deviceUUID }) => {
	const { alarmsCount, alarmsMaxPriority } = useActiveEventsCount(deviceUUID);
	const { clickTabHandler, activeTab } = useMediaMenu();
	const { t } = useTranslation();
	useApp();

	const badge = alarmsCount && alarmsCount > 0 ? String(alarmsCount) : '';
	const badgeClassName = styles[`level${alarmsMaxPriority}`];

	return (
		<VertIconsList className={styles.list} size={50}>
			<VertIconsListItem
				index={0}
				icon={ViewModuleOutlined}
				title={t('media.media_readings')}
				onClick={() => clickTabHandler(MEDIA_READINGS)}
				active={activeTab === MEDIA_READINGS}
			/>
			<VertIconsListItem
				index={1}
				icon={BarChartOutlined}
				title={t('media.media_consumptions')}
				onClick={() => clickTabHandler(MEDIA_CONSUMPTIONS)}
				active={activeTab === MEDIA_CONSUMPTIONS}
			/>
			<VertIconsListItem
				index={2}
				icon={ShowChartOutlined}
				title={t('media.media_params')}
				onClick={() => clickTabHandler(MEDIA_PARAMS)}
				active={activeTab === MEDIA_PARAMS}
			/>
			<VertIconsListItem
				index={3}
				badge={badge}
				badgeClassName={badgeClassName}
				icon={ReportProblemOutlined}
				title={t('media.media_events')}
				onClick={() => clickTabHandler(MEDIA_EVENTS)}
				active={activeTab === MEDIA_EVENTS}
			/>
		</VertIconsList>
	);
};

export default MediaMenu;
