import BuildingDashboardParamsChart from 'modules/building/components/BuildingTabs/BuildingsDashboard/BuildingDashboardParams/BuildingDashboardEnergy/BuildingDashboardEnergy';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingDashboardParams.module.scss';

interface BuildingDashboardParamsProps {
	building: Building;
}

const BuildingDashboardParams: React.FC<BuildingDashboardParamsProps> = ({ building }) => {
	const { t } = useTranslation();
	return (
		<div className={styles.params}>
			<BuildingDashboardParamsChart building={building} />
			{/* <div className={styles.top}>
                <PointValueParam forceDisplay label={t('points.mode')} xid="mode" className={styles.param} labelsClassName={styles.labels} hideIcon />
                <PointValueParam forceDisplay label={t('points.unitstate')} xid="unitstate" className={styles.param} labelsClassName={styles.labels} hideIcon />
                <PointValueParam forceDisplay label={t('points.tseto')} xid="tseto" className={styles.param} labelsClassName={styles.labels} hideIcon />
                <PointValueParam forceDisplay label="Temperatura średnia" xid="tavr" className={styles.param} labelsClassName={styles.labels} hideIcon />
                <PointValueParam forceDisplay label={t('points.mode')} xid="mode" className={styles.param} labelsClassName={styles.labels} hideIcon />
            </div> */}
		</div>
	);
};

export default BuildingDashboardParams;
