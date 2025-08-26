export interface ElpEventV2Stats {
	totalDurationInMinutes: number;
	timeSinceLastOccurrenceInMinutes: number;
	occurrences: {
		total: number;
		lastWeek: number;
		lastMonth: number;
		lastYear: number;
		averageWeekly: number;
		averageMonthly: number;
	};
	durations: {
		longest: {
			duration: number;
			start: Date;
			end: Date;
		};
		shortest: {
			duration: number;
			start: Date;
			end: Date;
		};
		average: number;
	};
}
