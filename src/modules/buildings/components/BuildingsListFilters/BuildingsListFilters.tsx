import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { escapeDiacritics } from 'helpers/text';
import { fetchUsersList } from 'modules/building/components/BuildingTabs/BuildingEdit/BuildingEditAdministratorParam';
import { fetchCompaniesList } from 'modules/building/components/BuildingTabs/BuildingEdit/BuildingEditInstallationCompanyParam';
import { FILTERS_VALUES, useFilters } from 'modules/buildings/components/BuildingsListFilters/BuildingsListFiltersHooks';
import { AuthDevOrAdmin } from 'modules/common/components/Auth/Auth';
import ClearButton from 'modules/common/components/Buttons/ClearButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import { useSelectorData } from 'modules/common/components/Dialogs/SelectDialog/SelectDialogContainer';
import FilterAutocomplete from 'modules/common/components/Forms/FilterAutocomplete/FilterAutocomplete';
import provinces from 'modules/common/helpers/data/provinces';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingsListFilters.module.scss';

interface BuildingsListFiltersProps {
	open: boolean;
	onClose: () => void;
	onSave: (filterValues: any) => void;
}

const BuildingsListFilters: React.FC<BuildingsListFiltersProps> = ({ open, onClose, onSave }) => {
	const { filtersValues, setFilterValue } = useFilters();
	const { data, fetching } = useSelectorData(fetchCompaniesList());
	const { data: dataUsers, fetching: fetchingUsers } = useSelectorData(fetchUsersList());

	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<Dialog {...{ open, onClose }} className={styles.dialog} maxWidth='xl' fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<DialogTitle className={styles.title}>Filtruj drogerie</DialogTitle>
			<DialogContent className={styles.content}>
				<FilterAutocomplete
					data={provinces.map(data => ({ value: escapeDiacritics(data), label: escapeDiacritics(data) }))}
					activeData={filtersValues.F_province}
					label={t('project.province')}
					placeholder={t('project.province')}
					param='province'
					onChange={setFilterValue}
				/>
				<FilterAutocomplete
					data={[
						{ value: 'ACTIVE', label: 'Aktywny' },
						{ value: 'INACTIVE', label: 'Nieaktywny' },
					]}
					activeData={filtersValues.F_alarms}
					activeDataBy='value'
					label={t('project.alarms')}
					placeholder={t('project.alarms')}
					param='alarms'
					onChange={setFilterValue}
				/>
				<FilterAutocomplete
					data={[
						{ value: 'OK', label: 'Online' },
						{ value: 'ERROR', label: 'Offline' },
					]}
					activeData={filtersValues.F_comm}
					activeDataBy='value'
					label={t('project.comm')}
					placeholder={t('project.comm')}
					param='comm'
					onChange={setFilterValue}
				/>
				<FilterAutocomplete
					data={FILTERS_VALUES.ventTechnical.map((filterValue: string) => ({ value: filterValue, label: t(`project.vent_technical_values.${filterValue}`) }))}
					activeData={filtersValues.F_ventTechnical}
					activeDataBy='value'
					label={t('project.ventTechnical')}
					placeholder={t('project.ventTechnical')}
					param='ventTechnical'
					onChange={setFilterValue}
				/>
				<FilterAutocomplete
					data={FILTERS_VALUES.ventBrand.map((filterValue: string) => ({ value: filterValue, label: filterValue }))}
					activeData={filtersValues.F_ventBrand}
					label={t('project.ventBrand')}
					placeholder={t('project.ventBrand')}
					param='ventBrand'
					onChange={setFilterValue}
				/>
				<FilterAutocomplete
					data={FILTERS_VALUES.fancoils.map((filterValue: string) => ({ value: filterValue, label: t(`project.fancoils_values.${filterValue}`) }))}
					activeData={filtersValues.F_fancoils}
					activeDataBy='value'
					label={t('project.fancoils')}
					placeholder={t('project.fancoils')}
					param='fancoils'
					onChange={setFilterValue}
				/>
				<FilterAutocomplete
					data={FILTERS_VALUES.curtains.map((filterValue: string) => ({ value: filterValue, label: t(`project.curtains_values.${filterValue}`) }))}
					activeData={filtersValues.F_curtains}
					activeDataBy='value'
					label={t('project.curtains')}
					placeholder={t('project.curtains')}
					param='curtains'
					onChange={setFilterValue}
				/>
				<FilterAutocomplete
					data={FILTERS_VALUES.heatSource.map((filterValue: string) => ({ value: filterValue, label: t(`project.heat_source_values.${filterValue}`) }))}
					activeData={filtersValues.F_heatSource}
					activeDataBy='value'
					label={t('project.heatSource')}
					placeholder={t('project.heatSource')}
					param='heatSource'
					onChange={setFilterValue}
				/>
				<AuthDevOrAdmin>
					<FilterAutocomplete
						data={data.map(data => ({ value: data.uuid, label: data.name }))}
						activeData={filtersValues.F_installation_company}
						label={t('project.installationCompany')}
						placeholder={t('project.installationCompany')}
						loading={fetching}
						param='installation_company'
						onChange={setFilterValue}
					/>
					<FilterAutocomplete
						data={data.map(data => ({ value: data.uuid, label: data.name }))}
						activeData={filtersValues.F_service_company}
						label={t('project.serviceCompany')}
						placeholder={t('project.serviceCompany')}
						loading={fetching}
						param='service_company'
						onChange={setFilterValue}
					/>

					<FilterAutocomplete
						data={dataUsers.map(data => ({ value: data.uuid, label: data.name }))}
						activeData={filtersValues.F_administrator}
						label={t('project.administrator')}
						placeholder={t('project.administrator')}
						loading={fetchingUsers}
						param='administrator'
						onChange={setFilterValue}
					/>
				</AuthDevOrAdmin>
			</DialogContent>
			<DialogActions style={{ padding: 10 }}>
				<ClearButton onClick={() => onSave({})}>{t('general.clear')}</ClearButton>
				<ConfirmButton noSubmit onClick={() => onSave(filtersValues)}>
					Ok
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

export default BuildingsListFilters;
