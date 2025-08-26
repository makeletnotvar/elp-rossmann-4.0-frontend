/**
 *
 * EVENTY
 *
 * Eventy są pobierane ze sterownika osobno, nie jako osobno zdefiniowane punkty.
 * Każdy nowy event odnotowany w sterowniku musi pojawić się w systemie.
 * Dodatkowo każda aktualizacja musi sprawdzać czy event nie został dezaktywowany.
 *
 * Zdarzenia z rozwojem systemu będą miały wiele źródeł np.
 * - alarm punktu sterownika
 * - zdarzenie systemowe
 *
 */

type EventPriority = 'NONE' | 'INFORMATION' | 'URGENT' | 'CRITICAL' | 'LIFE_SAFETY';
type EventType = 'NONE' | 'DEVICE_POINT_ALARM';

interface ElpEvent {
	code: string;
	uuid: string; // uuid
	isActive: boolean; // czy zdarzenie jest aktualnie aktywne
	activeTs: number; // czas aktywacji
	deactiveTs: number; // czas deaktywacji, czyli powrotu do normy - niektóre zdarzenia nie mają powrotu do normy (np zalogowanie użytkownika)
	priority: EventPriority; // klasa priorytetu
	comments?: EventComment[]; // komentarze
	readonly name: string; // np. oryginalna nazwa alarmu ze sterownika
	type: EventType;
	readonly acknowledgeable: boolean; // czy alarm można potwierdzić
	readonly acknowledged: boolean; // czy został potwierdzony
	readonly acknowledgeUser: string | null; // uuid usera, który potwierdził (jeśli potwierdzenie z elponline)
	readonly acknowledgeTs: number | null; // czas potwierdzenia (jeśli potwierdzenie z elponline)
	lastWeekCount: number;
	lastMonthCount: number;
	summaryCount: number;
	building?: {
		uuid: string;
		name: string;
	};
	device?: {
		uuid: string;
		name: string;
	};
}

type EventComment = {
	user: string; // user uuid - wyróżniamy usera, na wypadek gdzie wielu userów zarządza jednym projektem
	text: string; // text
	ts: number; // add timestamp
};

interface BuildingEvent {
	uuid: string;
	date_time_start: string;
	code: string;
	name: string;
	description: string;
	priority: number;
	priorityIndex: number;
	registerName: string;
	unitXid: string;
	activeTs: number;
	building: {
		uuid: string;
		name: string;
	};
}

interface DevicePointAlarm extends ElpEvent {
	readonly type: 'DEVICE_POINT_ALARM';
	readonly registerName: string; // oryginalna nazwa rejestru np. (A_SupFc)
	readonly point: Reference; // uuid punktu - null gdy nie ma przypisanego punktu w systemie
	readonly device: Reference; // uuid urządzenia
}

type EventFilterModel = Pick<ElpEvent, 'isActive' | 'type' | 'acknowledged' | 'priority'>;

type EventAlarmBlockFilterModel = Pick<ElpEvent, 'type'>;

type ElpEventAlarmBlockCreateRequest = Omit<ElpEventBlock, 'startTs' | 'user'>;

type ElpEventAlarmBlockUpdateRequest = Pick<ElpEventBlock, 'type' | 'time' | 'comment'>;

type ElpEventAlarmBlockType = 'NONE' | 'OFF' | 'WAITING';

interface ElpEventAlarmBlock {
	deviceUUID: string; // uuid urządzenia, którego alarm dotyczy
	startTs: number;
	name: string;
	code: string; // kod alarmu ze sterownika np. NW1_A_B1
	type: ElpEventAlarmBlockType; //
	time: number; // in hour (default=48)
	comment?: string;
	user: string;
}

interface ElpEventAlarmBlockInstance extends Omit<ElpEventAlarmBlock, 'deviceUUID'> {
	lastOccurTs?: number;
	isActive?: string;
	building?: Reference;
	device: Reference;
}

interface AlarmBlockIdentifyProps {
	deviceUUID: string;
	code: string;
}

interface ElpEventInstance {
	uuid: string;
	building: Ref<Building>;
	device: Ref<Device>;
	start: Date; // czas rejestracji na serwerze
	deviceTime?: Date; // czas pobrany ze sterownika
	end?: Date | null; // czas rejestracji na serwerze
	durationInMinutes: number;
	unitXid?: string;
	acknowledge?: ElpEventAcknowledge | null;
}

interface ElpEventStats {
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

type ElpEventAcknowledge = {
	user: Ref<User>;
	datetime: Date;
};

enum DataPeriod {
	'CUSTOM' = 'CUSTOM',
	'LAST_WEEK' = 'LAST_WEEK',
	'LAST_MONTH' = 'LAST_MONTH',
	'LAST_YEAR' = 'LAST_YEAR',
	'LAST_DAY' = 'LAST_DAY',
}

enum DataPeriodType {
	'QUARTER_HOUR' = 'QUARTER_HOUR',
	'HOURLY' = 'HOURLY',
	'DAILY' = 'DAILY',
	'WEEKLY' = 'WEEKLY',
	'MONTHLY' = 'MONTHLY',
}

type EventHeatmaps = [string, number];
type GetEventHeatmapsDTO = EventHeatmaps;
