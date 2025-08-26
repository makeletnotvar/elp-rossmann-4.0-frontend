import Content from 'modules/common/components/Layout/Content/Content';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import EngineerIcon from 'modules/common/icons/EngineerIcon';
import { INSTALLATION_COMPANY_NEW } from 'modules/companies/constants/company';
import initialCompany from 'modules/companies/constants/initialCompany';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import useRouter from 'use-react-router';
import CompanyEditContainer from '../CompaniesTabs/CompanyEdit/CompanyEditContainer';
import CompanyInfoContainer from '../CompaniesTabs/CompanyInfo/CompanyInfoContainer';
import styles from './CompaniesLayout.module.scss';
import CompaniesMenuContainer from './CompaniesMenu/CompaniesMenuContainer';

interface CompanyLayoutProps {
	company: CompanyWithDetails | null;
	fetched: boolean;
}

const CompanyLayout: React.FC<CompanyLayoutProps> = ({ company, fetched }) => {
	const {
		match: {
			params: { tab },
		},
	} = useRouter<{ tab: string }>();
	const { t } = useTranslation();

	const label: string = tab === INSTALLATION_COMPANY_NEW ? t('companies.new_company') : `${company?.name} - ${t('companies.tabs.' + tab)}`;

	return (
		<>
			{company || tab === INSTALLATION_COMPANY_NEW ? (
				<div className={styles.containerMenu}>
					<TitleBar label={label} icon={EngineerIcon}></TitleBar>
					<Content className={styles.main}>
						<aside className={styles.menu}>
							<CompaniesMenuContainer isNew={!company && tab === INSTALLATION_COMPANY_NEW} />
						</aside>
						<section className={styles.content}>
							{company && tab !== INSTALLATION_COMPANY_NEW ? (
								<Switch>
									<Route exact path='/companies/:uuid/info' render={() => fetched && <CompanyInfoContainer company={company} />} />
									<Route exact path='/companies/:uuid/edit' render={() => fetched && <CompanyEditContainer company={company} />} />
								</Switch>
							) : (
								<Switch>
									<Route exact path={`/companies/add/new`} render={() => <CompanyEditContainer company={initialCompany} isNew={true} />} />
								</Switch>
							)}
						</section>
					</Content>
				</div>
			) : null}
		</>
	);
};

export default CompanyLayout;
