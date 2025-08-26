import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { EventV2Priority } from 'modules/events_v2/types/eventV2-priority.type';
import React from 'react';
import { useTranslation } from 'react-i18next';

const EventsV2AlarmsBlocksListItemTypeCell: React.FunctionComponent<SuperTableCustomCellProps<EventV2Priority>> = ({ row }) => {
	const { t } = useTranslation();

	return <>{t(`alarmsblocks.params.type_values.${row.type}`)}</>;
};

export default EventsV2AlarmsBlocksListItemTypeCell;
