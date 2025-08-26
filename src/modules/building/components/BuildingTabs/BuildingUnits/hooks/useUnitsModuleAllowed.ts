import { DEV } from 'constants/user';
import { useBuilding } from 'modules/building/containers/BuildingContainerHooks';
import { UUID } from 'modules/common/types/uuid.type';

/**
 * It limits visibility of the units module to only the spcified buildings
 *   - 694 Czechowice Dziedzice
 *   - 2346 Żnin
 *   - 2017 Bełchatów
 */
const UNITS_MODULE_ALLOWED_BUILDING_CODES = [694, 2346, 2017];

export function useUnitsModuleAllowed(uuid: UUID, loggedUserType?: UserType) {
	const { building } = useBuilding(uuid);

	if (!building) {
		return false;
	}

	if (loggedUserType === DEV || UNITS_MODULE_ALLOWED_BUILDING_CODES.includes(Number(building.code))) {
		return true;
	}
}
