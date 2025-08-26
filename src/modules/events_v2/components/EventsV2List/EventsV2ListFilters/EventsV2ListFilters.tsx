import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import FilterAutocomplete from 'modules/common/components/Forms/FilterAutocomplete/FilterAutocomplete';
import { useFetchBuildingsList } from 'modules/events_v2/hooks/useFetchBuildingsList';
import { useFetchBuildingsToFillList } from 'modules/events_v2/hooks/useFetchBuildingsToFillList';
import { useFetchUnitXidsList } from 'modules/events_v2/hooks/useFetchUnitXidsList';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventsV2ListFilters.module.scss';
import { FILTERS_VALUES, useFilters } from './EventsV2ListFiltersHooks';

interface EventsV2ListFiltersProps {
	open: boolean;
	tab: 'active' | 'history';
	onClose: () => void;
	onSave: (filterValues: any) => void;
	buildingUUID?: string;
}

const EventsV2ListFilters: React.FC<EventsV2ListFiltersProps> = ({ open, tab, onClose, onSave, buildingUUID }) => {
	const [buildingFilter, setBuildingFilter] = useState<string>('');
	const { filtersValues, setFilterValue } = useFilters();

	const DATE_FORMAT = 'DD-MM-YYYY';
	const theme = useTheme();
	const { t } = useTranslation();
	const { data, fetching } = useFetchBuildingsList(buildingFilter);
	const { data: dataToFillList } = useFetchBuildingsToFillList(filtersValues.F_building);
	const { data: unitXidsData, fetching: fetchingUnits } = useFetchUnitXidsList(filtersValues.F_building);

	useEffect(() => {
		if (Array.isArray(filtersValues.F_building) && filtersValues.F_building.length > 1) {
			setFilterValue('unitXid', []);
		}
	}, [filtersValues.F_building]);

	return (
		<Dialog {...{ open, onClose }} disableEnforceFocus className={styles.dialog} maxWidth='xl' fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<DialogTitle className={styles.title}>{t('events.params.filterAlarms')}</DialogTitle>
			<DialogContent className={styles.content}>
				<FilterAutocomplete
					data={FILTERS_VALUES.priority.map((filterValue: string) => ({
						value: filterValue,
						label: t(`events.params.priority_values.${filterValue}`),
					}))}
					activeData={filtersValues.F_priority}
					label={t('events.params.priority')}
					placeholder={t('events.params.priority')}
					param='priority'
					onChange={setFilterValue}
				/>
				<FilterAutocomplete
					data={data.map(d => ({ value: d.uuid, label: d.name }))}
					dataToFill={(dataToFillList || []).map(d => ({ value: d?.uuid, label: d?.name }))}
					activeData={filtersValues.F_building}
					label={t('events.params.building')}
					placeholder={t('events.params.building')}
					loading={fetching}
					param='building'
					onChangeText={setBuildingFilter}
					onChange={setFilterValue}
					disabled={Boolean(buildingUUID)}
				/>
				{((Array.isArray(filtersValues.F_building) && filtersValues.F_building.length === 1) ||
					(!Array.isArray(filtersValues.F_building) && filtersValues.F_building)) && (
					<FilterAutocomplete
						data={(unitXidsData || []).map(d => ({ value: d.xid, label: d.name }))}
						activeData={filtersValues.F_unitXid}
						label={t('events.params.unitXid')}
						placeholder={t('events.params.unitXid')}
						loading={fetchingUnits}
						param='unitXid'
						onChange={setFilterValue}
					/>
				)}

				<LocalizationProvider dateAdapter={AdapterMoment}>
					<div style={{ display: 'flex', gap: 5, width: '100%' }}>
						<DatePicker
							label={t('data.dateOfOccurrenceFrom')}
							format={DATE_FORMAT}
							value={filtersValues.F_fromDate ? moment(filtersValues.F_fromDate) : null}
							maxDate={filtersValues.F_toDate ? moment(filtersValues.F_toDate) : undefined}
							onChange={value => setFilterValue('fromDate', value ? moment(value).toISOString() : null)}
							slotProps={{
								textField: {
									fullWidth: true,
									variant: 'standard',
									placeholder: t('data.date_from'),
									size: 'small',
								},
							}}
						/>
						<DatePicker
							label={t('data.dateOfOccurrenceTo')}
							format={DATE_FORMAT}
							value={filtersValues.F_toDate ? moment(filtersValues.F_toDate) : null}
							minDate={filtersValues.F_fromDate ? moment(filtersValues.F_fromDate) : undefined}
							onChange={value => setFilterValue('toDate', value ? moment(value).toISOString() : null)}
							slotProps={{
								textField: {
									fullWidth: true,
									variant: 'standard',
									placeholder: t('data.date_to'),
									size: 'small',
								},
							}}
						/>
					</div>
				</LocalizationProvider>
			</DialogContent>
			<DialogActions className={styles.actions}>
				<ConfirmButton noSubmit onClick={() => onSave(filtersValues)}>
					{t('general.ok')}
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

export default EventsV2ListFilters;
