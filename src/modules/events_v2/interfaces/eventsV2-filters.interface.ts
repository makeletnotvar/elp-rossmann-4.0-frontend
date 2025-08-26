import { EventV2Priority } from '../types/eventV2-priority.type';

export type EventsV2RequestFilters = {
	q?: string;
	F_unitXid?: string | string[];
	F_active?: boolean;
	F_blocked?: boolean;
	F_priority?: EventV2Priority | EventV2Priority[];
	buildingUUID?: string | string[];
	deviceUUID?: string | string[];
	F_fromDate?: string;
	F_toDate?: string;
};
