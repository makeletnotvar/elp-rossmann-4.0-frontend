export function getAlarmColor(isAlarmActive: boolean, connectionAlarm: boolean = false, alarmMaxPriority = 0) {
	const DEFAULT_COLOR = '#205de0';

	const PRIORITY_COLORS = ['#b3b5b9', '#74d2e7', '#ffb900', '#ff6319', '#e22d3e'];

	const priorityColor = PRIORITY_COLORS[alarmMaxPriority];

	const color = isAlarmActive ? priorityColor : connectionAlarm ? '#52565e' : DEFAULT_COLOR;

	return color;
}
