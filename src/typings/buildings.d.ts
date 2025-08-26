type BuildingType = any;

type BuildingUserRef = {
	name: string;
	uuid: string;
};

/**
 * Building base model
 */
interface Building extends BuildingProjectParameters {
	readonly uuid: string;
	description?: string;
	type?: BuildingType;
	tags?: string[];

	readonly addTs?: number;
	readonly editTs?: number;

	user?: BuildingUserRef;

	readonly devices?: BuildingDeviceReference[];

	installationCompany?: Ref<Company>;
	serviceCompany?: Ref<Company>;
	administrator?: Ref<User> | null;
	readonly user?: BuildingUserRef;
	readyForAllUsers?: boolean;
	readonly permissions?: 0 | 1 | 2;
}

/**
 * Building custom parameters
 */

interface BuildingCustomParameters {
	[param: string]: string | number | boolean;
}

interface BuildingDeviceStatus {
	uuid: string;
	name: string;
	connection?: boolean; // add support for multiple devices buildings
	lastSync?: number; // add support for multiple devices buildings
}

/**
 * Building parameters strictly related to project
 */
interface BuildingProjectParameters extends RossmannBuildingModel {}

type BuildingDeviceReference = {
	uuid: string;
	name: string;
	description?: string;
	connection?: boolean;
};

interface BuildingsFiltersPoints {
	xid: string;
	name: string;
	unitXid: string;
	unitName: string;
	suffix?: string;
}
