import { useBuilding } from 'modules/building/containers/BuildingContainerHooks';
import * as React from 'react';
import useRouter from 'use-react-router';
import styles from './BuildingStatus.module.scss';
import BuildingWeather from './BuildingWeather/BuildingWeather';

interface BuildingStatusProps {}

const BuildingStatus: React.FC<BuildingStatusProps> = () => {
	const {
		match: {
			params: { uuid },
		},
	} = useRouter<{ uuid: string }>();
	const buildingState = useBuilding(uuid);
	const building: Building | null = buildingState.building || null;
	const buildingCity = building ? building.city : null;

	return (
		<div className={styles.container}>
			<BuildingWeather lat={building?.lat} lon={building?.long} city={buildingCity || ''} />
		</div>
	);
};

export default BuildingStatus;
