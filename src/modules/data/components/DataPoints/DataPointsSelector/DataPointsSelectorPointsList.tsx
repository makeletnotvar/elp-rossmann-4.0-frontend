import { List, ListItemButton, ListItemText, TextField, useMediaQuery, useTheme } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';
import { useMemo } from 'react';
import Select from 'react-select';
import styles from './DataPointsSelectorContent.module.scss';
import { useFilter } from './dataPointsSelectorHooks';

interface DataPointsSelectorPointsListProps {
	points: Reference[];
	setSelectedPoints: (uuid: string) => void;
	currentSelectedPoints: string[];
	selected?: string;
}

const DataPointsSelectorPointsList: React.FC<DataPointsSelectorPointsListProps> = ({ points, selected, setSelectedPoints, currentSelectedPoints }) => {
	const { filteredItems, filterQuery, setFilterQuery, isActive } = useFilter(points);

	const countLabel = isActive ? `${filteredItems.length} / ${points.length}` : points.length;

	const formattedCurentValue = useMemo((): { label: string; value: string } | null => {
		const item = points.find(item => item.uuid === selected);
		return item ? { label: item.name, value: item.uuid } : null;
	}, [selected, points]);

	const theme = useTheme();
	const isMobileSize = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<div className={styles.pointsContainer}>
			<label className={styles.label}>Wybierz punkt ({countLabel})</label>
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
				<span data-testid='options-select'>
					<Select
						value={formattedCurentValue}
						onChange={(option: any) => !(currentSelectedPoints || []).includes(option.value) && setSelectedPoints(option.value)}
						options={filteredItems.map(item => ({ label: item.name, value: item.uuid }))}
						className={styles.select}
						isOptionDisabled={(option: any) => (currentSelectedPoints || []).includes(option.value)}
						maxMenuHeight={200}
					/>
				</span>
			) : (
				<List dense className={styles.list}>
					{filteredItems.map((pointRef: Reference) => {
						const isSelected = (currentSelectedPoints || []).includes(pointRef.uuid);

						return (
							<ListItemButton
								key={pointRef.uuid}
								className={cn(styles.listItem, { [styles.active]: pointRef.uuid === selected })}
								disabled={isSelected}
								onClick={() => !isSelected && setSelectedPoints(pointRef.uuid)}
							>
								<ListItemText primary={pointRef.name} />
							</ListItemButton>
						);
					})}
				</List>
			)}
		</div>
	);
};

export default DataPointsSelectorPointsList;
