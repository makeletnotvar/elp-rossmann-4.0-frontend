export interface BuildingEventV2 {
	uuid: string;
	date_time_start: string;
	code: string;
	name: string;
	description: string;
	priority: number;
	registerName: string;
	unitXid: string;
	activeTs: number;
	building: {
		uuid: string;
		name: string;
	};
}
