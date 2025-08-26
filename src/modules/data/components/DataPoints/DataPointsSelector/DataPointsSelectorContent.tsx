import { API } from 'api/axios';
import buildingsAPI from 'api/endpoints/buildingsAPI';
import dataAPI from 'api/endpoints/dataAPI';
import { DataPointsSelectorProps } from 'modules/data/components/DataPoints/DataPointsSelector/DataPointsSelector';
import DataPointsSelectorBuildingsList from 'modules/data/components/DataPoints/DataPointsSelector/DataPointsSelectorBuildingsList';
import DataPointsSelectorPointsList from 'modules/data/components/DataPoints/DataPointsSelector/DataPointsSelectorPointsList';
import * as React from 'react';
import { useEffect } from 'react';
import styles from './DataPointsSelectorContent.module.scss';

interface DataPointsSelectorContentProps extends Pick<DataPointsSelectorProps, 'onBuildingSelect' | 'lastSelectedBuilding' | 'currentSelectedPoints'> {
	selected: string | undefined;
	onSelect: (selected: string) => void;
}

const useBuildingsPoints = (lastSelectedBuilding: string | null) => {
	const [selectedBuilding, setSelectedBuilding] = React.useState(lastSelectedBuilding || undefined);
	const [buildings, setBuildings] = React.useState([]);
	const [points, setPoints] = React.useState([]);

	/**
	 *
	 * On first call (mount)
	 * Request buildings
	 *
	 */
	useEffect(() => {
		const request = async () => {
			const response = await API.get(buildingsAPI.getBuildingsList(''));
			setBuildings(response.data.buildings);

			if (!selectedBuilding) {
				const firstBuilding = response.data.buildings[0];
				firstBuilding && setSelectedBuilding(firstBuilding.uuid);
			}
		};
		request();
	}, []);

	/**
	 *
	 * If any change of selected building
	 * Request building's points
	 *
	 */
	useEffect(() => {
		const request = async () => {
			// const response = await API.get(viewsAPI.selectBuildingPoints(selectedBuilding, ''));\
			const QUERY = '';
			const response = await API.get(dataAPI.getDataPoints(QUERY, selectedBuilding));
			setPoints(response.data.points);
		};

		request();
	}, [selectedBuilding]);

	return {
		buildings,
		points,
		selectedBuilding,
		setSelectedBuilding,
	};
};

const DataPointsSelectorContent: React.FC<DataPointsSelectorContentProps> = ({
	selected,
	onSelect,
	currentSelectedPoints,
	lastSelectedBuilding,
	onBuildingSelect,
}) => {
	const { buildings, points, selectedBuilding, setSelectedBuilding } = useBuildingsPoints(lastSelectedBuilding);

	useEffect(() => {
		if (selectedBuilding !== undefined) {
			onBuildingSelect(selectedBuilding);
		}
	}, [selectedBuilding]);

	return (
		<div className={styles.content}>
			<DataPointsSelectorBuildingsList setSelectedBuilding={setSelectedBuilding} buildings={buildings} selectedBuilding={selectedBuilding} />
			<DataPointsSelectorPointsList setSelectedPoints={onSelect} points={points} selected={selected} currentSelectedPoints={currentSelectedPoints} />
		</div>
	);
};

export default DataPointsSelectorContent;
