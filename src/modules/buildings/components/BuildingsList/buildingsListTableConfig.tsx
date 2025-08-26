import { dateString, dateWithoutTimeString } from 'helpers/date';
import BuildingListAlarmsCellContainer from 'modules/buildings/components/BuildingsList/custom/BuildingListAlarmsCell/BuildingListAlarmsCellContainer';
import BuildingListConsumptionCell from 'modules/buildings/components/BuildingsList/custom/BuildingListConsumptionCell';
import BuildingListDetailsCell from 'modules/buildings/components/BuildingsList/custom/BuildingListDetailsCell';
import BuildingListRefPointCellContainer from 'modules/buildings/components/BuildingsList/custom/BuildingListRefPointCell/BuildingListRefPointCellContainer';
import { SuperTableDataColumn, SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { Link } from 'react-router-dom';
import styles from './BuildingsListContainer.module.scss';
import BuildingListCodeCell from './custom/BuildingListCodeCell';

export function createPointRefConfig(ob: Partial<SuperTableDataColumn>): SuperTableDataColumn {
	const SORTING_PARAM_NAME_PREFIX = 'xid_';
	return {
		ref: true,
		hidden: ob.hidden === undefined ? true : ob.hidden,
		shortName: true,
		custom: BuildingListRefPointCellContainer,
		align: 'left',
		title: ob.label,
		sortingParamNamePrefix: SORTING_PARAM_NAME_PREFIX,
		tdClassName: styles.async,
		...ob,
	} as SuperTableDataColumn;
}

export const getUserDefaultColumns = (user: UserAuth | null, buildingsFilters: BuildingsFiltersPoints[]): SuperTableDataColumns<Building> => {
	const visibleXids = new Set(['mode', 'workmode', 'unitstate', 'tset_klim', 'tseto', 'tavr', 'tmain_kasy', 'm_pow_avg_act']);

	const buildingsPointsColumns: SuperTableDataColumns<Building> = (buildingsFilters || [])
		.sort((a, b) => {
			const priority = (unitXid: string | undefined) => {
				if (unitXid === 'main') return 0;
				if (unitXid === 'ahu') return 1;
				if (unitXid === 'ahu2') return 2;
				if (unitXid?.includes('ac')) return 3;
				if (unitXid?.includes('fc')) return 4;
				if (unitXid?.includes('pc')) return 5;
				if (unitXid?.includes('cur')) return 6;
				return 7;
			};
			return priority(a?.unitXid) - priority(b?.unitXid);
		})
		.reduce((acc, point) => {
			if (!point?.xid) return acc;

			acc[point.xid] = createPointRefConfig({
				label: point.name || '',
				hidden: !visibleXids.has(point.xid),
				group: point.unitXid || '',
				groupName: point.unitName || '',
				...(point.suffix ? { unit: point.suffix } : {}),
			});

			return acc;
		}, {} as SuperTableDataColumns<Building>);

	return {
		code: {
			label: 'project.code',
			disabledHide: true,
			hidden: false,
			custom: BuildingListCodeCell,
			sticky: 'always',
			tdClassName: styles.code,
			thClassName: styles.code,
		},
		city: {
			label: 'project.city',
			searchable: true,
			disabledHide: true,
			sticky: 'always',
		},
		province: {
			label: 'project.province',
			hidden: true,
		},
		address: {
			label: 'project.address',
			hidden: true,
		},
		status: {
			label: 'project.status',
			translationPrefix: 'project.status_values',
			title: 'Aktualny stan budynku nadawany przez administratora',
			hidden: true,
		},
		placeType: {
			label: 'project.place_type',
			translationPrefix: 'project.type_values',
			hidden: true,
		},
		area: {
			label: 'project.area',
			align: 'right',
			hidden: true,
		},
		alarmsCount: {
			label: 'project.alarms',
			// async: true,
			custom: BuildingListAlarmsCellContainer,
			align: 'left',
			title: 'Liczba alarmów',
			tdClassName: styles.alarms,
			thClassName: styles.alarms,
		},
		lastSync: {
			label: 'project.last_sync',
			disabledSorting: true,
			custom: ({ value }) => <>{value > 0 ? dateString(value) : '-'}</>,
			// async: true,
			hidden: true,
		},
		installationCompany: {
			label: 'project.installationCompany',
			align: 'left',
			hidden: true,
			custom: ({ value }) =>
				value ? (
					value.uuid && value.name ? (
						user?.type === 'DEV' || user?.type === 'ADMIN' ? (
							<Link to={`/companies/${value.uuid}/info`}>{value.name}</Link>
						) : (
							value.name
						)
					) : (
						''
					)
				) : (
					''
				),
		},
		serviceCompany: {
			label: 'project.serviceCompany',
			align: 'left',
			hidden: true,
			custom: ({ value }) =>
				value ? (
					value.uuid && value.name ? (
						user?.type === 'DEV' || user?.type === 'ADMIN' ? (
							<Link to={`/companies/${value.uuid}/info`}>{value.name}</Link>
						) : (
							value.name
						)
					) : (
						''
					)
				) : (
					''
				),
		},
		administrator: {
			label: 'project.administrator',
			align: 'left',
			hidden: true,
			custom: ({ value }) =>
				value ? (
					value.uuid && value.name ? (
						user?.type === 'DEV' || user?.type === 'ADMIN' ? (
							<Link to={`/user/${value?.uuid}/info`}>{value.name}</Link>
						) : (
							value.name
						)
					) : (
						''
					)
				) : (
					''
				),
		},
		ventTechnical: {
			label: 'project.ventTechnical',
			hidden: true,
			translationPrefix: 'project.vent_technical_values',
		},
		ventBrand: {
			label: 'project.ventBrand',
			hidden: true,
		},
		bypass: {
			label: 'project.bypass',
			hidden: true,
			custom: ({ value }: { value: string }) => <>{value ? 'tak' : 'nie'}</>,
		},
		fancoils: {
			label: 'project.fancoils',
			hidden: true,
			translationPrefix: 'project.fancoils_values',
		},
		fancoilsCount: {
			label: 'project.fancoilsCount',
			hidden: true,
			align: 'right',
		},
		curtains: {
			label: 'project.curtains',
			hidden: true,
			translationPrefix: 'project.curtains_values',
		},
		curtainsCount: {
			label: 'project.curtainsCount',
			hidden: true,
			align: 'right',
		},
		acBrand: {
			label: 'project.acBrand',
			hidden: true,
		},
		acCount: {
			label: 'project.acCount',
			hidden: true,
			align: 'right',
		},
		heatSource: {
			label: 'project.heatSource',
			hidden: true,
			translationPrefix: 'project.heat_source_values',
		},
		powerConnectionType: {
			label: 'project.powerConnectionType',
			hidden: true,
			align: 'right',
			translationPrefix: 'project.power_type_values',
		},
		powerConnectionPower: {
			label: 'project.powerConnectionPower',
			hidden: true,
			unit: 'kWh',
		},
		deploymentDateTs: {
			label: 'project.deploymentDateTs',
			forceSortingParamName: 'deploymentDate',
			hidden: true,
			custom: ({ value }) => <>{value > 0 ? dateWithoutTimeString(value) : '-'}</>,
		},
		techDepartmentDateTs: {
			label: 'project.techDepartmentDateTs',
			forceSortingParamName: 'techDepartmentDate',
			hidden: true,
			custom: ({ value }) => <>{value > 0 ? dateWithoutTimeString(value) : '-'}</>,
		},
		additionals: {
			label: 'project.additionals',
			hidden: true,
			align: 'center',
			custom: BuildingListDetailsCell,
		},
		// Points REFS
		/**
		 * Stan drogerii
		 */
		...buildingsPointsColumns,
		last1: {
			label: 'Licznik - zużycie 1 dzień',
			custom: ({ value, row }) => <BuildingListConsumptionCell row={row} param='last1' />,
			unit: 'kWh',
			hidden: false,
			group: 'm',
			disabledSorting: true,
			ref: true,
			forceSortingParamName: 'consumption1',
		},
		last7: {
			label: 'Licznik - zużycie 7 dni',
			custom: ({ value, row }) => <BuildingListConsumptionCell row={row} param='last7' />,
			unit: 'kWh',
			hidden: true,
			disabledSorting: true,
			group: 'm',
			ref: true,
			forceSortingParamName: 'consumption7',
		},
		last30: {
			label: 'Licznik - zużycie 30 dni',
			custom: ({ value, row }) => <BuildingListConsumptionCell row={row} param='last30' />,
			hidden: true,
			unit: 'kWh',
			disabledSorting: true,
			group: 'm',
			ref: true,
			forceSortingParamName: 'consumption30',
		},
	};
};

const getVisibledColumns = (columnsConfig: SuperTableDataColumns<Building>): string[] => {
	return Object.entries(columnsConfig)
		.filter(([key, value]) => !value.hidden)
		.map(([key]) => key);
};

export const DEFAULT_VISIBLE_COLUMNS_LIST = (user: UserAuth | null, buildingsFilters: BuildingsFiltersPoints[]) =>
	getVisibledColumns(getUserDefaultColumns(user, buildingsFilters));
