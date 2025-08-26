import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { getEmptyFilterParamsValues } from 'modules/buildings/components/BuildingsList/BuildingsListHooks';
import { useFilters } from 'modules/events_v2/components/EventsV2AlarmsBlocksList/EventsV2AlarmsBlocksListFilters/EventsV2AlarmsBlocksListFiltersHooks';
import { EventsAlarmsBlocksListFilterRouteProps } from 'modules/events_v2/components/EventsV2AlarmsBlocksList/EventsV2AlarmsBlocksListHooks';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventsV2AlarmsBlocksTitleBar.module.scss';

function getDefaultValues(value: any, values: any) {
	return values.reduce((vals: any, nextV: any) => ({ ...vals, [nextV]: value.includes(nextV) }), {});
}

interface EventsV2AlarmsBlocksTitleBarProps {
	updateSettings: (ob: EventsAlarmsBlocksListFilterRouteProps) => void;
}

const EventsV2AlarmsBlocksTitleBar: React.FC<EventsV2AlarmsBlocksTitleBarProps> = ({ updateSettings }) => {
	const { t } = useTranslation();
	const { filtersValues, getFilterValue, setFilterValue } = useFilters();
	const [filterValues, setFilters] = useState<any>(getDefaultValues(getFilterValue('reason'), ['OFF', 'WAITING']));

	const getChecked = (valueName: any) => {
		return filterValues[valueName] === true;
	};

	const updateCheckboxes = (evt: any) => {
		const nextFiltersState = {
			...filterValues,
			[evt.target.name]: evt.target.checked,
		};

		const filtersArray = Object.keys(nextFiltersState)
			.map(key => (nextFiltersState[key] ? key : null))
			.filter(v => v !== null) as any;

		setFilterValue('reason', filtersArray);
		setFilters(nextFiltersState);
	};

	useEffect(() => {
		if (!filtersValues.F_reason) {
			setFilters({ OFF: true, WAITING: true });
			updateSettings({ F_reason: ['ALL'] });
		}
	}, []);

	useEffect(() => {
		if (filtersValues.F_reason) {
			const emptyValues = getEmptyFilterParamsValues();
			const nextSettings = { ...emptyValues, ...filtersValues };
			updateSettings(nextSettings);
		}
	}, [filtersValues]);

	return (
		<div className={styles.miniTitleBar}>
			<FormControlLabel
				control={<Checkbox name='OFF' checked={getChecked('OFF')} onChange={updateCheckboxes} />}
				label={<Typography className={styles.checkboxLabel}>{t('alarmsblocks.params.type_values.OFF')}</Typography>}
			/>
			<FormControlLabel
				control={<Checkbox name='WAITING' checked={getChecked('WAITING')} onChange={updateCheckboxes} />}
				label={<Typography className={styles.checkboxLabel}>{t('alarmsblocks.params.type_values.WAITING')}</Typography>}
			/>
		</div>
	);
};

export default EventsV2AlarmsBlocksTitleBar;
