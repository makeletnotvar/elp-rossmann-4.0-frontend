import { getEmptyFilterParamsValues } from 'modules/buildings/components/BuildingsList/BuildingsListHooks';
import Content from 'modules/common/components/Layout/Content/Content';
import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { convertPaginationRouteProps } from 'modules/common/helpers/router/router';
import MediaEventDetailsContainer from 'modules/media/components/MediaTabs/MediaEvents/MediaEventDetails/MediaEventDetailsContainer';
import MediaEventsList from 'modules/media/components/MediaTabs/MediaEvents/MediaEventsList/MediaEventsList';
import { useDetailedMediaEventRoute, useMediaEventsFilters } from 'modules/media/components/MediaTabs/MediaEvents/MediaEventsList/MediaEventsListHooks';
import { useMediaEventsState } from 'modules/media/redux/mediaEvents';
import * as React from 'react';
import { useCallback } from 'react';
import { STATUSES } from 'vredux';

const MediaEventsListContainer: React.FC = () => {
	const { settings, updateSettings, activeFilters } = useMediaEventsFilters();
	const {
		data: { mediaEvents, count },
		status,
	} = useMediaEventsState();
	const { detailedMediaEventUUID, setDetailedMediaEvent, closeDetailsHandler: closeDetails } = useDetailedMediaEventRoute();
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
		<Content>
			<MediaEventsList
				mediaEvents={mediaEvents}
				settings={settings as Partial<SuperTableDisplaySettings>}
				onChangeSettings={updateSettingsHandler}
				fetching={status === STATUSES.FETCHING}
				count={count}
				onEventDetails={setDetailedMediaEvent}
				activeFiltersColumns={activeFilters.map(p => p[0].substring(2))}
			/>
			{detailedMediaEventUUID && <MediaEventDetailsContainer uuid={detailedMediaEventUUID} onClose={closeDetails} />}
		</Content>
	);
};

export default MediaEventsListContainer;
