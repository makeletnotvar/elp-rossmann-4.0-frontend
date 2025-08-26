import { isValidTimestamp } from 'helpers/date';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import useEventV2DurationTime from 'modules/events_v2/hooks/useEventV2DurationTime';
import { ElpEventV2 } from 'modules/events_v2/interfaces/eventV2.interface';
import 'moment/locale/pl';
import React from 'react';
import { useTranslation } from 'react-i18next';

const EventsV2ListItemActiveTimeRangeCell: React.FC<SuperTableCustomCellProps<any, ElpEventV2>> = ({ row }) => {
	const { activeTs, deactiveTs } = row as ElpEventV2;
	const { duration, durationType } = useEventV2DurationTime(activeTs, deactiveTs);

	return (
		<EventsV2ListItemActiveTimeRangeCellView
			duration={duration}
			durationTimeType={durationType}
			durationPreffix={isValidTimestamp(deactiveTs) ? 'for' : 'since'}
		/>
	);
};

const EventsV2ListItemActiveTimeRangeCellView: React.FC<{ duration: number; durationPreffix: 'since' | 'for'; durationTimeType: string }> = ({
	duration,
	durationPreffix,
	durationTimeType,
}) => {
	const { t } = useTranslation();
	const translatedType = t(`events.params.time_range_type.${durationTimeType}`);
	const translatetPreffix = t(`events.params.duration_${durationPreffix}`);

	return (
		<span>
			{translatetPreffix} {duration} {translatedType}
		</span>
	);
};

export default EventsV2ListItemActiveTimeRangeCell;
