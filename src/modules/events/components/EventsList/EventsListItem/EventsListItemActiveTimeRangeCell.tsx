import { isValidTimestamp } from 'helpers/date';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import useEventDurationTime from 'modules/events/hooks/useEventDurationTime';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

const EventsListItemActiveTimeRangeCell: React.FC<SuperTableCustomCellProps<any, ElpEvent>> = ({ row }) => {
	const { activeTs, deactiveTs } = row as ElpEvent;
	const { duration, durationType } = useEventDurationTime(activeTs, deactiveTs);

	return (
		<EventsListItemActiveTimeRangeCellView
			duration={duration}
			durationTimeType={durationType}
			durationPreffix={isValidTimestamp(deactiveTs) ? 'for' : 'since'}
		/>
	);
};

const EventsListItemActiveTimeRangeCellView: React.FC<{ duration: number; durationPreffix: 'since' | 'for'; durationTimeType: string }> = ({
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

export default EventsListItemActiveTimeRangeCell;
