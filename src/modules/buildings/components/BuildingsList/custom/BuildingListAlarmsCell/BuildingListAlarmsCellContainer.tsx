import BuildingListAlarmsCell from 'modules/buildings/components/BuildingsList/custom/BuildingListAlarmsCell/BuildingListAlarmsCell';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { getEventsPriorityName } from 'modules/events_v2/helpers/eventsV2';
import * as React from 'react';

/**
 * It's a custom column value component for SuperTable.
 *
 * Connected to [alarmsCount] param, so incoming 'value' prop is real value, not reference.
 * Additional param [eventsMaxPriority] is getting from whole building model, so it's UUID,
 * which needs to be requested in server.
 *
 */
const BuildingListAlarmsCellContainer: React.FC<SuperTableCustomCellProps<number, Partial<Building>>> = ({ value: count, row: building }) => {
	const DEFAULT_MAX_PRIORITY = 0;

	// Here is the way for pooled value

	// const eventMaxPriorityUUID = building ? building.alarmsMaxPriority : undefined;
	// const maxPriority = usePointValue(eventMaxPriorityUUID || null);
	// const maxPriorityValue = maxPriority ? maxPriority.value : DEFAULT_MAX_PRIORITY || DEFAULT_MAX_PRIORITY;
	// const stringifiedMaxPriority = getEventsPriorityName(maxPriorityValue);

	const maxPriorityValue = building ? building.alarmsMaxPriority || 0 : 0;
	const stringifiedMaxPriority = getEventsPriorityName(Number(maxPriorityValue));

	return !count || count.toString() === '---' || count === 0 ? null : (
		<BuildingListAlarmsCell count={count} maxPriority={stringifiedMaxPriority} buildingUUID={building && building.uuid ? building.uuid : 'ALL'} />
	);
};

export default BuildingListAlarmsCellContainer;
