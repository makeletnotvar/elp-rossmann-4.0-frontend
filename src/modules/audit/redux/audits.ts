import { API } from 'api/axios';
import { default as usersAPI } from 'api/endpoints/usersAPI';
import { AuditListRoutingPagitnationProps } from 'modules/audit/components/AuditList/AuditListHook';
import { AuditRootState } from 'modules/audit/redux';
import { ReduxAction } from 'modules/common/helpers/redux/actions';
import { AsyncReducerState, defaultAsyncReducerState } from 'modules/common/helpers/redux/reducers';
import { default as useSelector } from 'modules/common/helpers/redux/useSelector';
import { AnyAction, Dispatch } from 'redux';

const AUDIT_AUDIT_MODULE = 'audit/audit';

export interface AuditResponse {
	events: AuditEvent[] | null;
	count: number;
	countAll: number;
	message?: string;
}

const REQUEST = AUDIT_AUDIT_MODULE + '_REQUEST';
const RESPONSE_SUCCESS = AUDIT_AUDIT_MODULE + '_RESPONSE_SUCESS';
const RESPONSE_FAILURE = AUDIT_AUDIT_MODULE + '_RESPONSE_FAILURE';
const FETCH = AUDIT_AUDIT_MODULE + '_FETCH';

export interface AuditState extends AsyncReducerState {
	events: AuditEvent[] | null;
	count: number;
	countAll: number;
}

const initialState: AuditState = {
	events: null,
	count: -1,
	countAll: -1,
	...defaultAsyncReducerState,
};

const auditReducer = (state = initialState, action: AnyAction): AuditState => {
	switch (action.type) {
		case REQUEST:
			return { ...state, fetching: true, fetched: false };
		case RESPONSE_SUCCESS:
			return { ...state, fetching: false };
		case RESPONSE_FAILURE:
			return { ...state, fetching: false, fetched: false, error: true };
		case FETCH:
			return { ...state, fetched: true, events: action.payload.events, countAll: action.payload.countAll, count: action.payload.count };
		default:
			return state;
	}
};

const actions = {
	get: {
		request: (auditSettings: AuditListRoutingPagitnationProps) => async (dispatch: Dispatch<any>) => {
			try {
				dispatch({ type: REQUEST });
				const response = await API.get<AuditResponse>(usersAPI.getAuditEvents(auditSettings));
				dispatch(actions.get.success());
				dispatch(actions.get.fetch(response.data));
			} catch (err: any) {
				dispatch(actions.get.failure(err));
			}
		},
		fetch: (response: AuditResponse): ReduxAction<AuditResponse> => {
			return {
				type: FETCH,
				payload: response,
			};
		},
		success: (): AnyAction => {
			return { type: RESPONSE_SUCCESS };
		},
		failure: (error: string): AnyAction => {
			return { type: RESPONSE_FAILURE, error: true };
		},
	},
};

const selectAudit = (state: AuditRootState): AuditState => state.audit;

export const useAuditState = (): AuditState => {
	return useSelector<AuditRootState, AuditState>(selectAudit);
};

export default auditReducer;
export const auditActions = actions;
