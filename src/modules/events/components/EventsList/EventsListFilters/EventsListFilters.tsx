import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import FilterGroupMulti from 'modules/common/components/Forms/FilterGroup/FilterGroupMulti';
import { useFilters } from 'modules/events/components/EventsList/EventsListFilters/EventsListFiltersHooks';
import * as React from 'react';
import styles from './EventsListFilters.module.scss';

interface EventsListFiltersProps {
	open: boolean;
	onClose: () => void;
	onSave: (filterValues: any) => void;
}

// 'active' | 'type' | 'acknowledged' | 'priority'

const EventsListFilters: React.FC<EventsListFiltersProps> = ({ open, onClose, onSave }) => {
	const { getFilterValue, toggleFilter, filtersValues, setFilterValue } = useFilters();
	const theme = useTheme();

	return (
		<Dialog {...{ open, onClose }} className={styles.dialog} maxWidth='xl' fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<DialogTitle id='draggable-dialog-title'>Filtruj obiekty</DialogTitle>
			<DialogContent className={styles.content}>
				<div>
					<FilterGroupMulti
						active={!!filtersValues.F_active}
						onToggle={toggleFilter}
						label='Aktywność'
						param='active'
						value={getFilterValue('active')}
						onChange={setFilterValue}
						values={['inactive', 'active']}
					/>
				</div>
			</DialogContent>
			<DialogActions style={{ padding: 10 }}>
				<Button variant='contained' onClick={evt => onSave({})}>
					Wyczyść
				</Button>
				<Button variant='contained' color='secondary' onClick={evt => onSave(filtersValues)}>
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EventsListFilters;
