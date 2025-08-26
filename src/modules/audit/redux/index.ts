import auditReducer, { AuditState } from 'modules/audit/redux/audits';
import { IModule } from 'redux-dynamic-modules';

export const userReducers: AuditRootState = {
	audit: auditReducer as any,
};

export interface AuditRootState {
	audit: AuditState;
}

export const getAuditModule = (): IModule<AuditRootState> => ({
	id: 'audit',
	reducerMap: {
		audit: auditReducer,
	},
	initialActions: [{ type: 'INIT_AUDIT_MODULE' }],
});
