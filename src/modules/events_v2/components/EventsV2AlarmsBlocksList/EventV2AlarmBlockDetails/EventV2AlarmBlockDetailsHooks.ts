import { ElpEventV2AlarmBlockInstance } from 'modules/events_v2/interfaces/eventV2-alarm-block-instance.interface';
import { useAlarmsBlocksState } from 'modules/events_v2/redux/alarmsBlocks';

export function useDetailedEventAlarmBlock(code: string): { alarmBlock: ElpEventV2AlarmBlockInstance | null } {
	const {
		data: { alarmsBlocks },
	} = useAlarmsBlocksState();
	return {
		alarmBlock: alarmsBlocks.find((a: any) => a.code === code) || null,
	};
}
