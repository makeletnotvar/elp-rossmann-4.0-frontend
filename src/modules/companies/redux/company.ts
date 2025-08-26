import { API } from 'api/axios';
import companiesAPI from 'api/endpoints/companiesAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { AnyAction, Dispatch } from 'redux';
import { CompaniesRootState } from '.';

const INSTALLATION_COMPANIES_MODULE = 'company/company';

export interface CompanyResponse {
	company: CompanyWithDetails | null;
}

export interface CompanyDetailsResponse {
	companyDetails: CompanyDetails | null;
}

export interface CompanyState extends AsyncReducerState {
	company: CompanyWithDetails | null;
}

const initialState: CompanyState = {
	company: null,
	...defaultAsyncReducerState,
};

const REQUEST = INSTALLATION_COMPANIES_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = INSTALLATION_COMPANIES_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = INSTALLATION_COMPANIES_MODULE + '_RESPONSE_FAILURE';
const FETCH = INSTALLATION_COMPANIES_MODULE + '_FETCH';
const RESET = INSTALLATION_COMPANIES_MODULE + '_RESET';

const companyReducer = (state = initialState, action: AnyAction): CompanyState => {
	switch (action.type) {
		case REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
			return {
				...state,
				fetched: true,
				company: action.payload.company,
			};
		case RESET:
			return initialState;
		default:
			return state;
	}
};

const actions = {
	getSingle: {
		request: (uuid: string) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const responseCompany = await API.get<CompanyResponse>(companiesAPI.getSingle(uuid));
				if (responseCompany.data && responseCompany.data.company && responseCompany.data.company.uuid) {
					const responseCompanyDetails = await API.get<CompanyDetailsResponse>(companiesAPI.getDetails(uuid));
					dispatch(actions.getSingle.success());
					dispatch(
						actions.getSingle.fetch({
							company: {
								...responseCompany.data.company,
								...responseCompanyDetails.data.companyDetails,
							},
						})
					);
				}
			} catch (err: any) {
				dispatch(actions.getSingle.failure(err));
			}
		},
		fetch: (response: CompanyResponse): ReduxAction<CompanyResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => ({
			type: RESPONSE_SUCCESS,
		}),
		failure: (err: string): AnyAction => ({
			type: RESPONSE_FAILURE,
			error: true,
		}),
	},
};

const selectCompany = (state: CompaniesRootState): CompanyState => state.company;

export const useCompanyState = (): CompanyState => {
	return useSelector<CompaniesRootState, CompanyState>(selectCompany) || {};
};

export default companyReducer;
export const companyActions = actions;
