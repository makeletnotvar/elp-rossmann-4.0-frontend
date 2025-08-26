import { EventV2Priority } from '../types/eventV2-priority.type';

export interface ElpEventV2 {
	uuid: string;
	name: string;
	code: string;
	isActive: boolean;
	activeTs: number;
	acknowledgeTs: number;
	deactiveTs: number;
	priority: EventV2Priority;
	comments: string[];
	acknowledgeable: boolean;
	acknowledged: boolean;
	acknowledgeUser: string | null;
	type: string;
	unitXid: string;
	building: {
		uuid: string | null;
		name: string | null;
	};
	device: {
		uuid: string | null;
		name: string | null;
	};
}
