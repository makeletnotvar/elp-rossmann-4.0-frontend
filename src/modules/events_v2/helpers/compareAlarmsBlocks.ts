import { ElpEventV2AlarmBlockIdentifyProps } from '../interfaces/eventV2-alarm-block-identify.interface';
import { ElpEventV2AlarmBlockInstance } from '../interfaces/eventV2-alarm-block-instance.interface';

type AlarmsBlockCompareType = ElpEventV2AlarmBlockIdentifyProps | ElpEventV2AlarmBlockInstance;

function getAlarmBlockDeviceUUID(alarmBlock: ElpEventV2AlarmBlockIdentifyProps | ElpEventV2AlarmBlockInstance) {
	if ((alarmBlock as ElpEventV2AlarmBlockInstance).device) {
		return (alarmBlock as ElpEventV2AlarmBlockInstance).device.uuid;
	} else {
		return (alarmBlock as ElpEventV2AlarmBlockIdentifyProps).deviceUUID;
	}
}

export function compareAlarmsBlocks(alarmsBlockA: AlarmsBlockCompareType, alarmBlockB: AlarmsBlockCompareType) {
	const isEqual = alarmsBlockA.code === alarmBlockB.code && getAlarmBlockDeviceUUID(alarmsBlockA) === getAlarmBlockDeviceUUID(alarmBlockB);
	return isEqual;
}
