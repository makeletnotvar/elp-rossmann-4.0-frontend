interface AlarmConfig {
	code: string; // unique, identifier
	name: string;
	priority: EventPriority;
	isBlocking: boolean;
	unitXid?: any;
}
