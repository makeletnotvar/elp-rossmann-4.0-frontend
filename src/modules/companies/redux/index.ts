import companiesReducer, { CompaniesState } from 'modules/companies/redux/companies';
import { IModule } from 'redux-dynamic-modules';
import companyReducer, { CompanyState } from './company';

export const companiesReducers: CompaniesRootState = {
	companies: companiesReducer as any,
	company: companyReducer as any,
};

export interface CompaniesRootState {
	companies: CompaniesState;
	company: CompanyState;
}

export const getCompaniesModule = (): IModule<CompaniesRootState> => ({
	id: 'companies',
	reducerMap: {
		companies: companiesReducer,
		company: companyReducer,
	},
	initialActions: [{ type: 'INIT_INSTALLATION_COMPANIES_MODULE' }],
});
