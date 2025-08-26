interface Device {
	readonly uuid: string; // uuid
	readonly code?: string; // kod elponline
	readonly firmware?: string; // firmware info
	readonly softinfo?: string; // soft info
	readonly model?: string; // model sterownika
	name?: string; // nazwa własna

	description?: string;
	tags?: string[];
	active: boolean;

	lastSync: number; // timestamp ostatniej synchronizacji
	error: boolean; // czy występuje błąd
	connection?: boolean; // połączenie
	remoteIpAddress?: string; // zdalny ip
}

// Szczegółowe dane i informacje powiązane z urządzeniem
interface DeviceDetails {
	readonly addTs: number; // timestamp dodania
	editTs: number; // timestamp ostatniej edycji
	user?: {
		// dodany przez
		uuid: string;
		name: string;
	};
	building?: {
		// ref do budynku
		uuid: string;
		name: string;
	};
	points?: {
		// lista powiązanych punktów
		name: string;
		uuid: string;
	}[];
}

interface DeviceInfo {
	readonly code?: string; // kod elponline
	readonly firmware?: string; // firmware info
	readonly softinfo?: string; // soft info
	readonly model?: string; // model sterownika
}

type DetailedDevice = Device & Partial<DeviceDetails>;

type PointType = 'enum' | 'numeric';

type PointArchiveConfig = {
	time: number;
	change: number;
};

interface Point {
	readonly uuid?: string; // uuid
	settable?: boolean; // definicja użytkownika czy point ma być nastawialny
	readonly settableRegister?: boolean; // czy punkt w ogóle może być ustawialny (pobierane ze sterownika)
	xid?: string; // identyfikator powtarzalny wskazujący na funkcje np: tset (temperatura zadana)
	readonly registerName?: string; // oryginalna nazwa rejestru
	readonly registerNumber?: number; // oryginalna nazwa rejestru
	name: string; // nazwa własna
	type: PointType; // numeric | enum
	customRender?: EnumRender | NumericRender; // obiekt definiujący jak wartość ma być przetworzona i wyświetlana\
	active?: boolean; // czy aktywny
	virtual?: boolean; // czy wirtualny (wirtualny === nie pochodzi ze sterownika tylko to wartość generowana przez serwer)
	archive?: boolean; // czy ma być zapisywany
	archiveConfig?: PointArchiveConfig; // konfiguracja archiwizacji - do rozwinięcia z czasem
	unitXid?: string;

	fullName?: string;

	// dane referencyjne
	readonly deviceUUID?: string; // UUID urządzenia - deprecated
	readonly buildingUUID?: string; // UUID budynku - deprecated
	readonly device?: Reference; // todo:
	readonly building?: Reference;
}

interface PointValue {
	value: number;
	ts: number;
}

interface PointListItem {
	uuid: string;
	name: string;
	customName?: string;
	pointType?: string;
	customRenderer?: object;
}

interface SourceRender {
	regType?: number; // 0 - Fixed, 1 - Hex, 2 - Decimal, 3 - Enums, Radio - 4, Check - 5, Digital - 6
	isEditable?: boolean; // not using in UI
	unstable?: string; // not using in UI
}

interface EnumRender extends SourceRender {
	states: {
		[key: number]: string;
	};
}

interface NumericRender extends SourceRender {
	decimals?: number;
	suffix?: string;
	min?: number;
	max?: number;
	step?: number;
}

interface PointReference {
	uuid: string;
	name: string;
}

interface PointRegisterReference extends PointReference {
	registerName?: string;
	registerNumber?: number;
	type?: PointType;
	customRender?: EnumRender | NumericRender;
}

interface DeviceRegister {
	number: number;
	name: string;
	customName?: string;
	type: PointType;
	customRender?: EnumRender | NumericRender;
}

interface DeviceAddBaseInfo {
	code: string; // kod sterownika elp
	name: string; // nazwa własna sterownika
	description?: string; // dodatkowy opis sterownika
	customRender?: EnumRender | NumericRender; // render sterownika
}
