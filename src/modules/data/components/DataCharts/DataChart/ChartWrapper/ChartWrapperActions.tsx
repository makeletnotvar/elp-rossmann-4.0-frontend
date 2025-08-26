import { ArchiveOutlined, CloseOutlined, EqualizerOutlined, FullscreenOutlined, MoreVertOutlined } from '@mui/icons-material';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ChartWrapper.module.scss';

interface ChartWrapperActionsProps {
	open: boolean;
	openHandler: () => void;
	closeHandler: () => void;
	onStatsOpen: () => void;
}

const ChartWrapperActions: React.FC<ChartWrapperActionsProps> = ({ open, openHandler, closeHandler, onStatsOpen }) => {
	const { t } = useTranslation();

	return (
		<div className={styles.dialContainer}>
			<SpeedDial
				ariaLabel='SpeedDial tooltip example'
				className={styles.dial}
				icon={<MoreVertOutlined />}
				openIcon={<CloseOutlined />}
				onBlur={closeHandler}
				onClick={open ? closeHandler : openHandler}
				onClose={closeHandler}
				onFocus={openHandler}
				// onMouseEnter={openHandler}
				onMouseLeave={closeHandler}
				open={open}
				direction='down'
			>
				<SpeedDialAction icon={<EqualizerOutlined />} tooltipTitle={t('data.statistics')} tooltipPlacement='left' onClick={onStatsOpen} />
				<SpeedDialAction icon={<ArchiveOutlined />} tooltipTitle={t('general.export')} tooltipPlacement='left' onClick={console.log} />
				<SpeedDialAction icon={<FullscreenOutlined />} tooltipTitle={t('general.fullscreen')} tooltipPlacement='left' onClick={console.log} />
			</SpeedDial>
		</div>
	);
};

export default ChartWrapperActions;
