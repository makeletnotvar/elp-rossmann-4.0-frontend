import { countObjectProps, skipNullParams } from 'helpers/data';
import Content from 'modules/common/components/Layout/Content/Content';
import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { convertPaginationRouteProps } from 'modules/common/helpers/router/router';
import EventsTitleBar from 'modules/events/components/EventsLayout/EventsTitleBar/EventsTitleBar';
import EventsList from 'modules/events/components/EventsList/EventsList';
import EventsListFilters from 'modules/events/components/EventsList/EventsListFilters/EventsListFilters';
import { getEmptyFilterParamsValues } from 'modules/events/components/EventsList/EventsListFilters/EventsListFiltersHooks';
import { useEventsState } from 'modules/events/redux/events';
import * as React from 'react';
import { useCallback } from 'react';
import EventDetailsContainer from '../EventDetails/EventDetailsContainer';
import styles from './EventsList.module.scss';
import { useDetailedEventRoute, useEventsFilters } from './EventsListHooks';

const EventsListContainer: React.FC = () => {
	const { settings, updateSettings, activeFilters } = useEventsFilters();
	const {
		data: { events, count },
		status,
	} = useEventsState();

	const { detailedEventUUID, setDetailedEvent, closeDetailsHandler: closeDetails } = useDetailedEventRoute();
	const [filtersDialog, setFiltersDialog] = React.useState<boolean>(false);

	const updateSettingsHandler = useCallback(
		(nextSettings: Partial<SuperTableDisplaySettings>) => {
			const convertedRouteProps = convertPaginationRouteProps(nextSettings);
			updateSettings(convertedRouteProps);
		},
		[updateSettings]
	);

	/**
	 * Used @updateSettings method are getting current URL search query and merge new params provded as argument object.
	 * We need to allow filters reseting, so before update we need to get object with all filters set with nulls.
	 * Then any merging with current active filters will automatically skip inactive filters, and won't put it to next URL route.
	 *
	 * @param filtersValues
	 */
	const saveFiltersHandler = (filtersValues: any) => {
		const emptyValues = getEmptyFilterParamsValues();
		const nextSettings = { ...emptyValues, ...filtersValues };

		updateSettings(nextSettings);

		setFiltersDialog(false);
	};

	const searchHandler = useCallback((query: string) => {
		updateSettings(convertPaginationRouteProps({ query }));
	}, []);

	const searchResetHandler = useCallback(() => {
		searchHandler('');
	}, []);

	return (
		<div className={styles.container}>
			<EventsTitleBar
				query={settings.q || ''}
				onResetSearch={searchResetHandler}
				onSearch={searchHandler}
				activeFiltersCount={countObjectProps(skipNullParams(activeFilters))}
				onFiltersOpen={() => setFiltersDialog(true)}
			/>
			<Content>
				<EventsList
					events={events}
					settings={settings as Partial<SuperTableDisplaySettings>}
					onChangeSettings={updateSettingsHandler}
					fetching={status === 'FETCHING'}
					count={count}
					onEventDetails={setDetailedEvent}
					activeFiltersColumns={activeFilters.map(p => p[0].substring(2))}
				/>
			</Content>
			<EventsListFilters open={filtersDialog} onClose={() => setFiltersDialog(false)} onSave={saveFiltersHandler} />
			{detailedEventUUID && <EventDetailsContainer uuid={detailedEventUUID} onClose={closeDetails} />}
		</div>
	);
};

export default EventsListContainer;
