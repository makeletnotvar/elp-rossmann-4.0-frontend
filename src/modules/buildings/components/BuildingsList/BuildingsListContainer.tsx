import { countObjectProps, filterObjectProps } from 'helpers/data';
import BuildingListRowActions from 'modules/buildings/components/BuildingsList/BuildingListRowActions';
import {
	getEmptyFilterParamsValues,
	useBuidlingsListPaginationRouter,
	useBuildingsAsyncPoints,
} from 'modules/buildings/components/BuildingsList/BuildingsListHooks';
import BuildingsListConfig from 'modules/buildings/components/BuildingsListConfig/BuildingsListConfig';
import BuildingsListFilters from 'modules/buildings/components/BuildingsListFilters/BuildingsListFilters';
import BuildingsTitleBar from 'modules/buildings/components/BuildingsTitleBar/BuildingsTitleBar';
import { useBuildingsState } from 'modules/buildings/redux/buildings';
import Content from 'modules/common/components/Layout/Content/Content';
import SuperTable, { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { convertPaginationRouteProps } from 'modules/common/helpers/router/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './BuildingsListContainer.module.scss';

interface BuildingsListContainerProps {}

const BuildingsListContainer: React.FC<BuildingsListContainerProps> = () => {
	const { history } = useRouter();
	const { update, dir, offset, q, rowsPerPage, param, columns, activeFilters, fetchingFilters } = useBuidlingsListPaginationRouter();
	const { fetching, buildings, count } = useBuildingsState();
	const [filtersDialog, setFiltersDialog] = useState<boolean>(false);
	const [configDialog, setConfigDialog] = useState<boolean>(false);
	const { t } = useTranslation();

	/**
	 *
	 * useBuildingsAsyncPoints hook handle table config, extract async columns and then collect all data points references (uuids)
	 * and send request to poll service for continuous getting time updated values.
	 *
	 */
	useBuildingsAsyncPoints(buildings, columns);

	/**
	 * handler
	 */
	const filtersOpenHandler = (): void => {
		setFiltersDialog(true);
	};

	const configOpenHandler = (): void => {
		setConfigDialog(true);
	};

	const saveConfigHandler = (columns: string[]): void => {
		update(convertPaginationRouteProps({ columns }));
	};

	const searchHandler = (query: string): void => {
		update(convertPaginationRouteProps({ query }));
	};

	const resetSearchHandler = (): void => {
		searchHandler('');
	};

	/* Update settings handler */
	const updateSettingsHandler = (ob: Partial<SuperTableDisplaySettings>): void => {
		update(convertPaginationRouteProps(ob));
	};

	// To skip unnecessary url filter routes, we starting with 'undefined' values object, and then merge it with next values
	const saveFiltersHandler = (filtersValues: any) => {
		const emptyValues = getEmptyFilterParamsValues();
		update({
			...emptyValues,
			...filtersValues,
		});

		setFiltersDialog(false);
	};

	const addHandler = () => {
		history.push(`/building/add/new`);
	};

	return (
		<>
			<div className={styles.container}>
				<BuildingsTitleBar
					query={q}
					activeFiltersCount={activeFilters.length}
					onFiltersOpen={filtersOpenHandler}
					onConfigOpen={configOpenHandler}
					onSearch={searchHandler}
					onResetSearch={resetSearchHandler}
					onAdd={addHandler}
					activeColumnsCount={countObjectProps(filterObjectProps(columns, column => !column.hidden))}
				/>
				<Content>
					<SuperTable
						activeFilterColumns={activeFilters.map(p => p[0].substr(2))}
						columns={columns}
						data={buildings}
						fetching={fetching || fetchingFilters}
						checkable={false}
						sortable={true}
						sortingDir={dir}
						sortingParam={param}
						rowsPerPage={rowsPerPage}
						offset={offset}
						count={count}
						onUpdateSettings={updateSettingsHandler}
						rowActions={BuildingListRowActions}
						query={q}
						noResults={q.length > 0 && buildings.length === 0}
						translator={t}
					/>
				</Content>
			</div>
			{filtersDialog && <BuildingsListFilters open={filtersDialog} onClose={() => setFiltersDialog(false)} onSave={saveFiltersHandler} />}
			{configDialog && <BuildingsListConfig open={configDialog} onClose={() => setConfigDialog(false)} columns={columns} onSave={saveConfigHandler} />}
		</>
	);
};

export default BuildingsListContainer;
