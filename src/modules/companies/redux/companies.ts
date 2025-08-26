import { API } from 'api/axios';
import companiesAPI from 'api/endpoints/companiesAPI';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import useSelector from 'modules/common/helpers/redux/useSelector';
import { UINotificationsActions } from 'modules/common/redux/uiNotifications';
import { CompaniesRootState } from 'modules/companies/redux';
import { AnyAction, Dispatch } from 'redux';
import { companyActions } from './company';

const COMPANIES_MODULE = 'companies/companies';

export interface CompaniesResponse {
	companies: Company[];
	count: number;
	countAll: number;
}

export interface CompanyResponse {
	company: Company;
}

export interface CompaniesState extends AsyncReducerState {
	companies: Company[];
	count: number;
	countAll: number;
}

const initialState: CompaniesState = {
	companies: [],
	count: 0,
	countAll: 0,
	...defaultAsyncReducerState,
};

const REQUEST = COMPANIES_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = COMPANIES_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = COMPANIES_MODULE + '_RESPONSE_FAILURE';
const FETCH = COMPANIES_MODULE + '_FETCH';
const RESET = COMPANIES_MODULE + '_RESET';

const ADD_REQUEST = COMPANIES_MODULE + 'ADD_REQUEST';
const ADD_RESPONSE_SUCCESS = COMPANIES_MODULE + 'ADD_RESPONSE_SUCESS';
const ADD_RESPONSE_FAILURE = COMPANIES_MODULE + 'ADD_RESPONSE_FAILURE';
const ADD_FETCH = COMPANIES_MODULE + 'ADD_FETCH';

const UPDATE_REQUEST = COMPANIES_MODULE + 'UPDATE_REQUEST';
const UPDATE_RESPONSE_SUCCESS = COMPANIES_MODULE + 'UPDATE_RESPONSE_SUCESS';
const UPDATE_RESPONSE_FAILURE = COMPANIES_MODULE + 'UPDATE_RESPONSE_FAILURE';
const UPDATE_FETCH = COMPANIES_MODULE + 'UPDATE_FETCH';

const DELETE_REQUEST = COMPANIES_MODULE + 'DELETE_REQUEST';
const DELETE_RESPONSE_SUCCESS = COMPANIES_MODULE + 'DELETE_RESPONSE_SUCESS';
const DELETE_RESPONSE_FAILURE = COMPANIES_MODULE + 'DELETE_RESPONSE_FAILURE';
const DELETE_FETCH = COMPANIES_MODULE + 'DELETE_FETCH';

const companiesReducer = (state = initialState, action: AnyAction): CompaniesState => {
	switch (action.type) {
		case REQUEST:
		case UPDATE_REQUEST:
		case ADD_REQUEST:
		case DELETE_REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
		case UPDATE_RESPONSE_SUCCESS:
		case ADD_RESPONSE_SUCCESS:
		case DELETE_RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
		case UPDATE_RESPONSE_FAILURE:
		case ADD_RESPONSE_FAILURE:
		case DELETE_RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
			return {
				...state,
				fetched: true,
				companies: action.payload.companies,
				countAll: action.payload.countAll,
				count: action.payload.count,
			};
		case UPDATE_FETCH:
			return {
				...state,
				fetched: true,
				companies: state.companies.map(company => (company.uuid === action.payload.company.uuid ? action.payload.company : company)),
			};
		case ADD_FETCH:
			return {
				...state,
				fetched: true,
				companies: [...state.companies, action.payload.company],
				countAll: state.countAll + 1,
				count: state.count + 1,
			};
		case DELETE_FETCH:
			return {
				...state,
				fetched: true,
				companies: state.companies.filter(company => company.uuid !== action.payload.uuid),
				countAll: state.countAll - 1,
				count: state.count - 1,
			};
		case RESET:
			return initialState;

		default:
			return state;
	}
};

const actions = {
	getMany: {
		request: (settings: any) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<CompaniesResponse>(companiesAPI.getMany(settings));
				dispatch(actions.getMany.success());
				dispatch(actions.getMany.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.getMany.failure(err));
			}
		},
		fetch: (response: CompaniesResponse): ReduxAction<CompaniesResponse> => {
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
	update: {
		request: (company: Company) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: UPDATE_REQUEST });
			try {
				const response = await API.put<CompanyResponse>(companiesAPI.update(company.uuid), { company });
				dispatch(actions.update.success());
				dispatch(UINotificationsActions.add({ message: 'Firma instalacyjna została zaktualizowana', variant: 'success' }));
				dispatch(actions.update.fetch(response.data));
				if (response.data) {
					dispatch(companyActions.getSingle.request(response.data.company.uuid));
				}
				return Promise.resolve(response.data.company);
			} catch (err: any) {
				dispatch(UINotificationsActions.add({ message: 'Błąd w aktualizacji firmy instalacyjnej', variant: 'error' }));
				dispatch(actions.update.failure(err));
				return Promise.reject();
			}
		},
		fetch: (response: CompanyResponse): ReduxAction<CompanyResponse> => ({ type: UPDATE_FETCH, payload: response }),
		success: (): AnyAction => ({ type: UPDATE_RESPONSE_SUCCESS }),
		failure: (err: string): AnyAction => ({ type: UPDATE_RESPONSE_FAILURE, error: true }),
	},
	add: {
		request: (company: Company) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: ADD_REQUEST });

			try {
				const response = await API.post<CompanyResponse>(companiesAPI.add(), { company });
				dispatch(actions.add.success());
				dispatch(UINotificationsActions.add({ message: 'Firma instalacyjna została dodana', variant: 'success' }));
				dispatch(actions.add.fetch(response.data));
				return Promise.resolve(response.data.company);
			} catch (err: any) {
				dispatch(actions.add.failure(err));
				dispatch(UINotificationsActions.add({ message: 'Błąd w dodawaniu firmy instalacyjnej', variant: 'error' }));
				return Promise.reject();
			}
		},
		fetch: (response: CompanyResponse): ReduxAction<CompanyResponse> => ({ type: ADD_FETCH, payload: response }),
		success: (): AnyAction => ({ type: ADD_RESPONSE_SUCCESS }),
		failure: (err: string): AnyAction => ({ type: ADD_RESPONSE_FAILURE, error: true }),
	},
	delete: {
		request: (code: string) => async (dispatch: Dispatch<any>) => {
			dispatch({ type: DELETE_REQUEST });

			try {
				await API.delete<{ code: string }>(companiesAPI.delete(code));
				dispatch(actions.delete.success());
				dispatch(UINotificationsActions.add({ message: 'Firma instalacyjna została usunięta', variant: 'success' }));
				dispatch(actions.delete.fetch({ code }));
				return Promise.resolve({ code });
			} catch (err: any) {
				dispatch(actions.delete.failure(err));
				dispatch(UINotificationsActions.add({ message: 'Błąd przy usuwaniu firmy instalacyjnej', variant: 'error' }));
				return Promise.reject();
			}
		},
		fetch: (code: { code: string }): AnyAction => ({ type: DELETE_FETCH, payload: code }),
		success: (): AnyAction => ({ type: DELETE_RESPONSE_SUCCESS }),
		failure: (err: string): AnyAction => ({ type: DELETE_RESPONSE_FAILURE, error: true }),
	},
};

const selectCompanies = (state: CompaniesRootState): CompaniesState => state.companies;

export const useCompaniesState = (): CompaniesState => {
	return useSelector<CompaniesRootState, CompaniesState>(selectCompanies) || {};
};

export default companiesReducer;
export const companiesActions = actions;
