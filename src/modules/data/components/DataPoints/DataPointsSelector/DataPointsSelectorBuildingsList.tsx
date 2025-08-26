import { List, ListItem, ListItemText, TextField, useMediaQuery, useTheme } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';
import { useMemo } from 'react';
import Select from 'react-select';
import styles from './DataPointsSelectorContent.module.scss';
import { useFilter } from './dataPointsSelectorHooks';

interface DataPointsSelectorBuildingsListProps {
	buildings: Reference[];
	setSelectedBuilding: (uuid: string) => void;
	selectedBuilding?: string;
}

const DataPointsSelectorBuildingsList: React.FC<DataPointsSelectorBuildingsListProps> = ({ buildings, setSelectedBuilding, selectedBuilding }) => {
	const { filteredItems, filterQuery, setFilterQuery, isActive } = useFilter(buildings);

	const countLabel = isActive ? `${filteredItems.length} / ${buildings.length}` : buildings.length;

	const formattedCurentValue = useMemo((): { label: string; value: string } | null => {
		const item = buildings.find(item => item.uuid === selectedBuilding);
		return item ? { label: item.name, value: item.uuid } : null;
	}, [selectedBuilding, buildings]);

	const theme = useTheme();
	const isMobileSize = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<div className={styles.buildingsContainer}>
			<label className={styles.label}>Wybierz budynek ({countLabel})</label>
			{!isMobileSize && (
				<div className={styles.filter}>
					<TextField
						className={styles.filterInput}
						type='search'
						value={filterQuery}
						onChange={evt => setFilterQuery(evt.currentTarget.value)}
						placeholder='Filtruj'
					/>
				</div>
			)}
			{isMobileSize ? (
				<Select
					value={formattedCurentValue}
					onChange={(option: any) => setSelectedBuilding(option.value)}
					options={filteredItems.map(item => ({ label: item.name, value: item.uuid }))}
					className={styles.select}
					maxMenuHeight={200}
				/>
			) : (
				<List dense={true} className={styles.list}>
					{filteredItems.map((buildingRef: Reference) => (
						<ListItem key={buildingRef.uuid} className={cn(styles.listItem, { [styles.active]: buildingRef.uuid === selectedBuilding })}>
							<ListItemText key={buildingRef.uuid} onClick={() => setSelectedBuilding(buildingRef.uuid)}>
								{buildingRef.name}
							</ListItemText>
						</ListItem>
					))}
				</List>
			)}
		</div>
	);
};

export default DataPointsSelectorBuildingsList;
