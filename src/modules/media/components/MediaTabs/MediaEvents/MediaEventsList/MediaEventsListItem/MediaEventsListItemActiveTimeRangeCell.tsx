import { isValidTimestamp } from 'helpers/date';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import useEventV2DurationTime from 'modules/events_v2/hooks/useEventV2DurationTime';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

const MediaEventsListItemActiveTimeRangeCell: React.FC<SuperTableCustomCellProps<any, ElpEvent>> = ({ row }) => {
	const { activeTs, deactiveTs } = row as ElpEvent;
	const { duration, durationType } = useEventV2DurationTime(activeTs, deactiveTs);

	return (
		<MediaEventsListItemActiveTimeRangeCellView
			duration={duration}
			durationTimeType={durationType}
			durationPreffix={isValidTimestamp(deactiveTs) ? 'for' : 'since'}
		/>
	);
};

const MediaEventsListItemActiveTimeRangeCellView: React.FC<{
	duration: number;
	durationPreffix: 'since' | 'for';
	durationTimeType: string;
}> = ({ duration, durationPreffix, durationTimeType }) => {
	const { t } = useTranslation();
	const translatedType = t(`media.params.time_range_type.${durationTimeType}`);
	const translatetPreffix = t(`media.params.duration_${durationPreffix}`);

	return (
		<span>
			{translatetPreffix} {duration} {translatedType}
		</span>
	);
};

export default MediaEventsListItemActiveTimeRangeCell;
