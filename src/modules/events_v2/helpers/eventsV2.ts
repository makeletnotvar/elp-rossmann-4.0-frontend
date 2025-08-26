import { EventV2Priority } from '../types/eventV2-priority.type';

export function getEventsPriorityName(priorityNumber: number): EventV2Priority {
	const priorities: { [key: number]: EventV2Priority } = {
		0: 'NONE',
		1: 'INFORMATION',
		2: 'URGENT',
		3: 'CRITICAL',
		4: 'LIFE_SAFETY',
	};

	const priority = priorities[priorityNumber] || priorityNumber.toString();

	return priority;
}

export function getBuildingEventsPath(uuid: string): string {
	return `/events-v2/active/?F_building=${uuid}&p=isActive&d=desc`;
}

type PrioritiesClassNames = {
	[priority in EventV2Priority]: string;
};

export function getPriorityClassName(priority: EventV2Priority, styles: any) {
	const prioritiesClassNames: PrioritiesClassNames = {
		NONE: styles.none,
		INFORMATION: styles.information,
		URGENT: styles.urgent,
		CRITICAL: styles.critical,
		LIFE_SAFETY: styles.lifesafety,
	};

	return prioritiesClassNames[priority] || '';
}
