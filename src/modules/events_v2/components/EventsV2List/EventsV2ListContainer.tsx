import { FilterListOutlined } from '@mui/icons-material';
import { Badge, IconButton, styled } from '@mui/material';
import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { convertPaginationRouteProps } from 'modules/common/helpers/router/router';
import EventsV2List from 'modules/events_v2/components/EventsV2List/EventsV2List';
import { useEventsV2State } from 'modules/events_v2/redux/eventsV2';
import React, { useCallback, useEffect, useState } from 'react';
import { STATUSES } from '../../../../vredux';
import EventsV2Portal from '../EventsV2Portal/EventsV2Portal';
import EventV2ConfirmContainer from './EventV2Confirm/EventV2ConfirmContainer';
import EventV2DetailsContainer from './EventV2Details/EventV2DetailsContainer';
import styles from './EventsV2List.module.scss';
import EventsV2ListFilters from './EventsV2ListFilters/EventsV2ListFilters';
import { useConfirmEventRoute, useDetailedEventRoute, useEventsFilters } from './EventsV2ListHooks';
import EventsV2Search from './EventsV2Search/EventsV2Search';

interface EventsV2ListContainerProps {
	tab: 'active' | 'history';
	setDisabledTabs: React.Dispatch<React.SetStateAction<boolean>>;
	buildingUUID?: string;
}

const EventsV2ListContainer: React.FC<EventsV2ListContainerProps> = ({ tab, setDisabledTabs, buildingUUID }) => {
	const [filtersDialog, setFiltersDialog] = useState<boolean>(false);
	const { settings, updateSettings, activeFilters } = useEventsFilters(tab, buildingUUID);

	const {
		data: { events, count },
		status,
	} = useEventsV2State();
	const { detailedEventUUID, setDetailedEvent, closeDetailsHandler: closeDetails } = useDetailedEventRoute(tab, buildingUUID);
	const { confirm, setConfirmEvent, closeConfirmHandler: closeConfirm } = useConfirmEventRoute(tab, buildingUUID);

	useEffect(() => {
		if (status === STATUSES.FETCHING) {
			setDisabledTabs(true);
		} else {
			setDisabledTabs(false);
		}
	}, [status]);

	const updateSettingsHandler = useCallback(
		(nextSettings: Partial<SuperTableDisplaySettings>) => {
			const convertedRouteProps = convertPaginationRouteProps(nextSettings, {});
			updateSettings(convertedRouteProps);
		},
		[updateSettings]
	);

	const updateFiltersHandler = useCallback(
		(nextFilters: Partial<SuperTableDisplaySettings>) => {
			const convertedRouteProps = convertPaginationRouteProps({}, nextFilters);
			updateSettings(convertedRouteProps);
			setFiltersDialog(false);
		},
		[updateSettings]
	);

	return (
		<React.Fragment>
			<EventsV2Portal>
				<div className={styles.headerContainer}>
					<EventsV2Search query={settings.query || ''} onChange={updateSettingsHandler} onReset={() => updateSettingsHandler({ query: '' })} />
					<StyledBadge overlap='rectangular' badgeContent={(activeFilters || []).length} color='primary'>
						<IconButton size='small' onClick={() => setFiltersDialog(true)}>
							<FilterListOutlined />
						</IconButton>
					</StyledBadge>
				</div>
			</EventsV2Portal>
			<EventsV2List
				events={events}
				settings={settings as Partial<SuperTableDisplaySettings>}
				onChangeSettings={updateSettingsHandler}
				fetching={status === STATUSES.FETCHING}
				count={count}
				onEventDetailsDialog={setDetailedEvent}
				onEventConfirmDialog={setConfirmEvent}
				activeFiltersColumns={activeFilters.map(p => p[0].substring(2))}
				tab={tab}
				buildingUUID={buildingUUID}
			/>
			{detailedEventUUID && <EventV2DetailsContainer tab={tab} uuid={detailedEventUUID} onClose={closeDetails} />}
			{confirm && <EventV2ConfirmContainer buildingUUID={buildingUUID} uuid={confirm} onClose={closeConfirm} />}
			{filtersDialog && (
				<EventsV2ListFilters buildingUUID={buildingUUID} open={filtersDialog} tab={tab} onClose={() => setFiltersDialog(false)} onSave={updateFiltersHandler} />
			)}
		</React.Fragment>
	);
};

const StyledBadge = styled(Badge)(() => ({
	'& .MuiBadge-badge': {
		top: 8,
		right: 4,
		width: 20,
		cursor: 'pointer',
		fontSize: '0.75rem',
	},
}));

export default EventsV2ListContainer;
