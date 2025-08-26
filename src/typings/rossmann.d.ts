type RMStatus = 'WORKING' | 'READY' | 'STOPED' | 'NOT_READY';
type RMPlaceType =
	| 'SHOP_CENTER' // centrum handlowe
	| 'SMALL_SHOP_CENTER' // małe centrum handlowe
	| 'DETACHED' // wolnostojący
	| 'RESIDENTIAL'; // mieszkalny

type RMVentTechnical = 'OWN' | 'OUTSOURCE';
type RMVentBrand = 'KLIMOR' | 'VBW';
type RMBypass = boolean;
type RMFancoils = 'HEATING' | 'MULTI';
type RMCurtains = 'ELECTRIC' | 'WATER';
type RMHeatSource = 'WN' | 'OWN';
type PointsXidsRefs = {
	[xid: string]: uuid;
};

interface RossmannBuildingConsumption {
	last1?: number;
	last7?: number;
	last30?: number;
}

interface RossmannBuildingModel {
	readonly pointsXidsRefs?: PointsXidsRefs;
	code?: string; // rossmann internal code to identify stores
	area?: number;
	status?: RMStatus;
	city?: string;
	province?: string;
	address?: string;
	lat?: number;
	long?: number;

	// Technical details
	placeType?: RMPlaceType; // typ budynku
	ventTechnical?: '' | 'NONE' | 'OWN' | 'OUTSOURCE'; // wentylacja własna, z centrum
	ventBrand?: '' | 'NONE' | 'KLIMOR' | 'VBW'; // firma centrali
	bypass?: boolean; // bypass
	fancoils?: '' | 'NONE' | 'HEATING' | 'MULTI';
	fancoilsCount?: number; // ilość klimakonwektorów
	curtains?: '' | 'NONE' | 'ELECTRIC' | 'WATER'; // elektryczne czy wodne kurtyny
	curtainsCount?: number; // ilość kurtyn
	heatSource?: '' | 'NONE' | 'WN' | 'OWN'; // WN i własny piec
	ahuConfig?: string;
	acBrand?: string; // brand klimatyzacji
	acCount?: number; // ilość klimatyzatorów
	hpBrand?: string; // brand pomp ciepła
	hpCount?: number; // ilość pomp ciepła

	consumptions?: RossmannBuildingConsumption;

	powerConnectionType?: 'OWN' | 'TENANT'; // Rodzaj przyłącza - własne/wynajmujący
	powerConnectionPower?: number; // Deklarowana moc przyłącza

	deploymentDateTs?: number | null;
	techDepartmentDateTs?: number | null;
	additionals?: string | null;

	readonly alarmsCount?: string; // ilość alarmów
	readonly alarmsMaxPriority?: string; // maksymalny poziom alarmu -> docelowa wartość number -> 0: 'NONE' | 1: 'INFORMATION' | 2: 'URGENT' | 3: 'CRITICAL' | 4: 'LIFE_SAFETY'
	readonly connection?: boolean; // aktualne połączenie
	readonly lastSync?: string; // ostatnia synchronizacja
}

type RossmannBuildingFilterModel = Pick<RossmannBuildingModel, 'province' | 'placeType' | 'ventTechnical', 'ventBrand', 'bypass'>;
