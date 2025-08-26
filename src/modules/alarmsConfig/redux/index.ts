import alarmsConfigReducer, { AlarmsConfigState } from 'modules/alarmsConfig/redux/alarmsConfig';
import { IModule } from 'redux-dynamic-modules';

export const alarmsConfigReducers: AlarmsConfigRootState = {
	alarmsConfig: alarmsConfigReducer as any,
};

export interface AlarmsConfigRootState {
	alarmsConfig: AlarmsConfigState;
}

export const getAlarmsConfigModule = (): IModule<AlarmsConfigRootState> => ({
	id: 'alarmsConfig',
	reducerMap: {
		alarmsConfig: alarmsConfigReducer,
	},
	initialActions: [{ type: 'INIT_ALARMS_CONFIG_MODULE' }],
});
