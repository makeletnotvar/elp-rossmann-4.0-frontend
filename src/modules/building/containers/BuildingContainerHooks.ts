import { buildingActions, useBuildingState } from 'modules/building/redux/building';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { useEffect } from 'react';
import { pollActions } from '../../common/redux/poll';

export const useBuilding = (uuid: string | undefined, disableFetch?: boolean) => {
	const { building, fetching } = useBuildingState();
	const dispatch = useDispatch();

	useEffect(() => {
		if (uuid && !disableFetch) {
			const isAlreadyFetched = building && building.uuid === uuid;
			const isBuildingCreateAction = uuid === 'add' || uuid === 'new';

			if (isAlreadyFetched || isBuildingCreateAction) {
				// do nothing
			} else {
				dispatch(buildingActions.get.request(uuid));
			}
		}
	}, [building, uuid, disableFetch]);

	return {
		uuid,
		building,
		fetching,
	};
};

export const useBuildingPoints = () => {
	const { building, fetching } = useBuildingState();
	const dispatch = useDispatch();

	useEffect(() => {
		if (building) {
			const additionalBuildingAsyncDataToPoll: string[] = [];

			building.alarmsCount && additionalBuildingAsyncDataToPoll.push(building.alarmsCount);
			building.alarmsMaxPriority && additionalBuildingAsyncDataToPoll.push(building.alarmsMaxPriority);

			dispatch(buildingActions.getPoints.request(building.uuid, additionalBuildingAsyncDataToPoll));
		}
		return () => {
			dispatch(pollActions.poll.reset());
		};
	}, [building]);

	return {};
};
