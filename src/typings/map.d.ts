interface MapBuildingGroupPin {
	id: string;
	data: [number, number, number?]; // [alarmsCount, maxAlarmPriority, offlineCount]
	pos: [lat, lng];
	count: number;
}

interface MapBuildingPin {
	name: string;
	uuid: string;
	data: [number, number, number?]; // [alarmsCount, maxAlarmPriority, offlineCount]
	pos: [lat, lng];
}

interface MapBuildingStats {
	total: number;
	offline: number;
	alarm: number;
}

interface MapBuildingPinDetails {
	uuid: string;
	name: string;
	code: string;
	city: string;
	address: string;
	connection: boolean;
	alarmsCount: number;
	alarmsMaxPriority: number;
	workmode: string;
	tsetactual: number;
	tavr: number;
	permissions?: 0 | 1 | 2;
	administrator: Ref<User> | null;
	installationCompany: Ref<User> | null;
	serviceCompany?: Ref<Company>;
}
