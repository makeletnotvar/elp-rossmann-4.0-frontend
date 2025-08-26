import { useBuilding } from 'modules/building/containers/BuildingContainerHooks';
import { usePoints, usePointsList } from 'modules/common/redux/points';
import { usePointsValuesPoll, usePoll } from 'modules/common/redux/poll';
import { getViewPoints } from 'modules/ViewEditor/ViewEditorHooks';

export default (view: DrawView, isNew: boolean) => {
	const viewBuilding = useBuilding(view.building ? view.building.uuid : undefined);
	const viewPoints = getViewPoints(view, viewBuilding ? viewBuilding.building : null) || [];

	usePointsValuesPoll(viewPoints);
	usePointsList(viewPoints);

	const { pollCount } = usePoll();
	const { fetched } = usePoints();
	const hasPoints = viewPoints.length > 0;
	const hasFetchedPoints = fetched && pollCount > 0;

	const isViewInitializedWithValues = isNew || !hasPoints || (hasPoints && hasFetchedPoints);

	return {
		isViewInitializedWithValues,
	};
};
