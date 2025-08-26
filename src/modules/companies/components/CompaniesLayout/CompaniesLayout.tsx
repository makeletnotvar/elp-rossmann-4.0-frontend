import { useCompany } from 'modules/companies/hooks/useCompany';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import useRouter from 'use-react-router';
import CompaniesListContainer from '../CompaniesList/CompaniesListContainer';
import styles from './CompaniesLayout.module.scss';
import CompanyLayout from './CompanyLayout';

const CompaniesLayout: React.FC = () => {
	const {
		match: {
			params: { uuid },
		},
	} = useRouter<{ uuid: string }>();
	const { company, fetched } = useCompany(uuid);

	return (
		<div className={styles.container}>
			<Switch>
				<Route exact path='/companies' component={CompaniesListContainer} />
				<Route exact path='/companies/:uuid?/:tab?' render={() => <CompanyLayout company={company} fetched={fetched} />} />
			</Switch>
		</div>
	);
};

export default CompaniesLayout;
