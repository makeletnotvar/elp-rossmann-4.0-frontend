import { ElpEventV2Acknowledge } from '../types/eventV2-acknowledge.type';

export interface ElpEventV2Instance {
	uuid: string;
	building: { uuid: string; name: string };
	device: { uuid: string; name: string };
	start: number; // czas rejestracji na serwerze
	deviceTime?: Date; // czas pobrany ze sterownika
	end?: Date | null; // czas rejestracji na serwerze
	durationInMinutes: number;
	unitXid?: string;
	acknowledge?: ElpEventV2Acknowledge | null;
	unitName?: string;
	priority: number;
	isActive?: boolean;
}
