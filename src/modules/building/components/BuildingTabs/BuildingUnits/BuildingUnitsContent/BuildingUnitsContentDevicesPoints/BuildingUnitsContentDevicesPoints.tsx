import { Paper } from '@mui/material';
import { BubbleChartOutlined } from '@mui/icons-material';
import Params from 'modules/common/components/Params/Params';
import PointValueParam2 from 'modules/common/components/Params/PointValueParam/PointValueParam2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../BuildingUnitsContent.module.scss';

interface BuildingUnitsContentDevicesPointsProps {
	unitsPoints: Point[];
}

const BuildingUnitsContentDevicesPoints: React.FC<BuildingUnitsContentDevicesPointsProps> = ({ unitsPoints }) => {
	const { t } = useTranslation();
	return (
		<Paper className={styles.content} elevation={1}>
			<div className={styles.label}>
				<BubbleChartOutlined fontSize='inherit' />
				<span>
					{t('buildings.units.device_points')} <span style={{ opacity: 0.5 }}>({(unitsPoints || []).length})</span>
				</span>
			</div>
			{unitsPoints.length > 0 ? (
				<Params className={styles.params} wrapperStyle={{ padding: '3px 3px 3px 9px' }}>
					{unitsPoints.map(point => {
						return <PointValueParam2 key={point.uuid} label={point.name} uuid={point.uuid} settable />;
					})}
				</Params>
			) : (
				<div className={styles.noResults}>{t('buildings.units.no_devices_points')}</div>
			)}
		</Paper>
	);
};

export default BuildingUnitsContentDevicesPoints;
