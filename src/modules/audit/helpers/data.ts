export const ORDER_BY_KEYS = ['fromTs', 'toTs', 'type', 'user', 'building', 'point'];

export const sortDataByKeys = (data: any) => {
	const sortedData = {} as any;
	ORDER_BY_KEYS.forEach(key => {
		if (key in data) {
			sortedData[key] = data[key];
		}
	});
	return sortedData;
};

export enum AuditEventTypeEnum {
	'LOGIN' = 'LOGIN',
	'SETPOINT' = 'SETPOINT',
	'VIRTUAL_HMI' = 'VIRTUAL_HMI',
	'BUILDING_UPDATE' = 'BUILDING_UPDATE',
	'EVENT_ACKNOWLEDGE' = 'EVENT_ACKNOWLEDGE',
	'VIRTUAL_HMI_SETPOINT' = 'VIRTUAL_HMI_SETPOINT',
}
