import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { getEventsPriorityName } from 'modules/events_v2/helpers/eventsV2';
import * as React from 'react';
import MediaListAlarmsCell from './MediaListAlarmsCell';

/**
 * It's a custom column value component for SuperTable.
 *
 * Connected to [alarmsCount] param, so incoming 'value' prop is real value, not reference.
 * Additional param [eventsMaxPriority] is getting from whole building model, so it's UUID,
 * which needs to be requested in server.
 *
 */
const MediaListAlarmsCellContainer: React.FC<SuperTableCustomCellProps<number, MediaDevice>> = ({ value: count, row: device }) => {
	const DEFAULT_MAX_PRIORITY = 0;

	// Here is the way for pooled value

	// const eventMaxPriorityUUID = building ? building.alarmsMaxPriority : undefined;
	// const maxPriority = usePointValue(eventMaxPriorityUUID || null);
	// const maxPriorityValue = maxPriority ? maxPriority.value : DEFAULT_MAX_PRIORITY || DEFAULT_MAX_PRIORITY;
	// const stringifiedMaxPriority = getEventsPriorityName(maxPriorityValue);

	const maxPriorityValue = device ? device.alarmsMaxPriority || 0 : 0;
	const stringifiedMaxPriority = getEventsPriorityName(Number(maxPriorityValue));

	return !count || count.toString() === '---' || count === 0 ? null : (
		<MediaListAlarmsCell count={count} maxPriority={stringifiedMaxPriority} deviceUUID={device ? device.uuid : 'ALL'} />
	);
};

export default MediaListAlarmsCellContainer;
