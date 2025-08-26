import { useEffect, useState } from 'react';
import { useAlarmsConfigState } from '../../redux/alarmsConfig';

export function useDetailedAlarmConfig(code?: string): { alarmConfig: AlarmConfig | null } {
	const [alarmConfig, setAlarmConfig] = useState<AlarmConfig | null>(null);
	const { alarmsConfig } = useAlarmsConfigState();

	useEffect(() => {
		const alarmConfig = alarmsConfig.find(e => code && e.code.toLocaleLowerCase() === code.toLocaleLowerCase()) || null;
		setAlarmConfig(alarmConfig);
	}, [code, alarmsConfig]);

	return { alarmConfig };
}
