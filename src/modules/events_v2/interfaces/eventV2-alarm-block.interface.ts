import { ElpEventV2AlarmBlockType } from '../types/eventV2-alarm-block-type.type';

export interface ElpEventV2AlarmBlock {
	deviceUUID: string | null;
	startTs: number;
	name: string;
	code: string;
	type: ElpEventV2AlarmBlockType; //
	time: number | null;
	comment?: string;
	user: string;
}
