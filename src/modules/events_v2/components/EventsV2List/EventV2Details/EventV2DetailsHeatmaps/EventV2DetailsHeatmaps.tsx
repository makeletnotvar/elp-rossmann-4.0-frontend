import { DataPeriodType } from 'modules/events_v2/enums/data-period-type.enum';
import { DataPeriod } from 'modules/events_v2/enums/data-period.enum';
import { useEventV2HeatmapsRequest } from 'modules/events_v2/hooks/useEventV2HeatmapsRequest';
import { ElpEventV2 } from 'modules/events_v2/interfaces/eventV2.interface';
import { EventV2HeatmapsRequestParams } from 'modules/events_v2/redux/heatmaps';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import EventV2DetailsHeatmapsView from './EventV2DetailsHeatmapsView';

interface EventV2DetailsHeatmapsProps {
	event: ElpEventV2;
	params: {
		eventUUID: string | null;
		alarmCode: string | null;
		deviceUUID: string | null;
	};
}

const EventV2DetailsHeatmaps: React.FC<EventV2DetailsHeatmapsProps> = ({ params }) => {
	const [settings, setSettings] = useState<{ period: DataPeriod; type: DataPeriodType; date: Moment }>({
		period: 'LAST_MONTH' as DataPeriod,
		type: 'HOURLY' as DataPeriodType,
		date: moment(),
	});
	const { heatmaps, statusHeatmaps, generateHandler } = useEventV2HeatmapsRequest();

	useEffect(() => {
		const commonParams = {
			...params,
			deviceUUID: params.deviceUUID,
			type: settings.type,
			period: settings.period,
			year: settings.date.year(),
		};

		const fullParams: EventV2HeatmapsRequestParams =
			settings.type === DataPeriodType.HOURLY ? { ...commonParams, month: settings.date.month() + 1 } : commonParams;

		generateHandler(fullParams);
	}, [settings.type, settings.period, settings.date, params.eventUUID, params.alarmCode, params.deviceUUID]);

	return (
		<EventV2DetailsHeatmapsView
			heatmaps={heatmaps}
			status={{ isError: statusHeatmaps.isError, isFetching: statusHeatmaps.isFetching, isSuccess: statusHeatmaps.isSuccess }}
			updateSettings={setSettings}
			settings={settings}
		/>
	);
};

export default EventV2DetailsHeatmaps;
