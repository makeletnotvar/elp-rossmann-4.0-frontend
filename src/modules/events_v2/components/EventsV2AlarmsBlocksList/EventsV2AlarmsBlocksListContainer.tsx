import ConfirmDialog from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { convertPaginationRouteProps } from 'modules/common/helpers/router/router';
import EventsAlarmsBlocksList from 'modules/events_v2/components/EventsV2AlarmsBlocksList/EventsV2AlarmsBlocksList';
import { useEventV2AlarmBlockDelete } from 'modules/events_v2/hooks/useEventV2AlarmBlockDelete';
import { useAlarmsBlocksState } from 'modules/events_v2/redux/alarmsBlocks';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { STATUSES } from '../../../../vredux';
import EventsV2Portal from '../EventsV2Portal/EventsV2Portal';
import EventV2AlarmBlockDetailsContainer from './EventV2AlarmBlockDetails/EventV2AlarmBlockDetailsContainer';
import { useDetailedEventAlarmBlockRoute, useEventsAlarmsBlocksFilters } from './EventsV2AlarmsBlocksListHooks';
import EventsV2AlarmsBlocksTitleBar from './EventsV2AlarmsBlocksTitleBar/EventsV2AlarmsBlocksTitleBar';

interface EventsV2AlarmsBlocksListContainerProps {
	setDisabledTabs: React.Dispatch<React.SetStateAction<boolean>>;
	buildingUUID?: string;
}

const EventsV2AlarmsBlocksListContainer: React.FC<EventsV2AlarmsBlocksListContainerProps> = ({ setDisabledTabs, buildingUUID }) => {
	const { t } = useTranslation();
	const { settings, updateSettings, activeFilters } = useEventsAlarmsBlocksFilters(buildingUUID);

	const {
		data: { alarmsBlocks, count },
		status,
	} = useAlarmsBlocksState();

	useEffect(() => {
		if (status === STATUSES.FETCHING) {
			setDisabledTabs(true);
		} else {
			setDisabledTabs(false);
		}
	}, [status]);

	const { detailedEventAlarmBlockCode, setDetailedEventAlarmBlock, closeDetailsHandler: closeDetails } = useDetailedEventAlarmBlockRoute(buildingUUID);

	const { deleteHandler, confirmHandler, isConfirmOpen, closeHandler } = useEventV2AlarmBlockDelete(closeDetails);

	const updateSettingsHandler = useCallback(
		(nextSettings: Partial<SuperTableDisplaySettings>) => {
			const convertedRouteProps = convertPaginationRouteProps(nextSettings);
			updateSettings(convertedRouteProps);
		},
		[updateSettings]
	);

	return (
		<>
			<EventsV2Portal>
				<EventsV2AlarmsBlocksTitleBar updateSettings={updateSettings} />
			</EventsV2Portal>
			<EventsAlarmsBlocksList
				alarmsblocks={alarmsBlocks}
				settings={settings as Partial<SuperTableDisplaySettings>}
				onChangeSettings={updateSettingsHandler}
				fetching={status === STATUSES.FETCHING}
				count={count}
				activeFiltersColumns={activeFilters.map(p => p[0].substring(2))}
				onEventAlarmBlockDetailsDialog={setDetailedEventAlarmBlock}
				onDelete={deleteHandler}
				buildingUUID={buildingUUID}
			/>
			{detailedEventAlarmBlockCode && <EventV2AlarmBlockDetailsContainer uuid={detailedEventAlarmBlockCode} onClose={closeDetails} onDelete={deleteHandler} />}
			<ConfirmDialog
				title={t('alarmsblocks.messages.deleting_alarm')}
				message={t('alarmsblocks.messages.sure_to_delete_alarm')}
				open={isConfirmOpen}
				onCancel={closeHandler}
				onConfirm={confirmHandler}
			/>
		</>
	);
};

export default EventsV2AlarmsBlocksListContainer;
