import { useBuildingState } from 'modules/building/redux/building';
import { useApp } from 'modules/common/selectors/app';
import { useEffect, useState } from 'react';

export const useCurrentBuildingEventsStatus = (unitXid: string) => {
	const [isOnline, setOnline] = useState(false);
	const [hasAlarm, setAlarm] = useState(false);
	const [alarmsCount, setAlarmsCount] = useState<number>(0);

	const { building } = useBuildingState();
	const { events } = useApp();

	useEffect(() => {
		if (building) {
			const unitEvents = events.filter(event => event.building.uuid === building.uuid && event.unitXid === unitXid);

			if (unitEvents) {
				const isOnline = unitEvents.findIndex(ev => ev.code.toLocaleLowerCase().includes('com')) === -1;
				setOnline(isOnline);

				// alarm is active, when count of alarms is greater than 1 + connection alarm
				setAlarmsCount(unitEvents.length);
				setAlarm(unitEvents.length > (isOnline ? 0 : 1));
			}
		}
	}, [building, events, unitXid]);

	return {
		isOnline,
		hasAlarm,
		alarmsCount,
	};
};
