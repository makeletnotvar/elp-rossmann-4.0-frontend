import { ElpEventV2AlarmBlock } from './eventV2-alarm-block.interface';

export interface ElpEventV2AlarmBlockInstance extends Omit<ElpEventV2AlarmBlock, 'deviceUUID'> {
	lastOccurTs?: number;
	isActive?: string;
	building?: { uuid: string; name: string };
	device: { uuid: string; name: string };
}
