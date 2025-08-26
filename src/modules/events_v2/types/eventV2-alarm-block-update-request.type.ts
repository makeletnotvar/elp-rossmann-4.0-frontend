import { ElpEventV2AlarmBlock } from '../interfaces/eventV2-alarm-block.interface';

export type ElpEventV2AlarmBlockUpdateRequest = Omit<ElpEventV2AlarmBlock, 'startTs' | 'user'>;
