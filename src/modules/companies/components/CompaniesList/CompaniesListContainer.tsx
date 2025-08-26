import Content from 'modules/common/components/Layout/Content/Content';
import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { convertPaginationRouteProps } from 'modules/common/helpers/router/router';
import React, { useCallback } from 'react';
import useRouter from 'use-react-router';
import CompaniesTitleBar from '../CompaniesLayout/CompaniesTitleBar/CompaniesTitleBar';
import CompaniesList from './CompaniesList';
import { useCompaniesData, useCompaniesFilters } from './CompaniesListHooks';

interface CompaniesListContainerProps {}

const CompaniesListContainer: React.FC<CompaniesListContainerProps> = () => {
	const { history } = useRouter();
	const { settings, shortSettings, updateSettings } = useCompaniesFilters();
	const { companies, fetching, countAll, count } = useCompaniesData(shortSettings);

	const updateSettingsHandler = useCallback((nextSettings: Partial<SuperTableDisplaySettings>) => {
		const convertedRouteProps = convertPaginationRouteProps(nextSettings);
		updateSettings(convertedRouteProps);
	}, []);

	const searchHandler = useCallback((query: string) => {
		updateSettings(convertPaginationRouteProps({ query }));
	}, []);

	const searchResetHandler = useCallback(() => {
		searchHandler('');
	}, []);

	const onAddCompany = useCallback(() => {
		history.push(`/companies/add/new`);
	}, []);

	return (
		<Content>
			<CompaniesTitleBar query={settings.query || ''} onAdd={onAddCompany} onResetSearch={searchResetHandler} onSearch={searchHandler} />
			<CompaniesList companies={companies} settings={settings} onChangeSettings={updateSettingsHandler} fetching={fetching} count={count} countAll={countAll} />
		</Content>
	);
};

export default CompaniesListContainer;
