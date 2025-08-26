import { createNewView } from 'modules/ViewEditor/ViewEditorHooks';
import { useBuilding } from 'modules/building/containers/BuildingContainerHooks';
import { NEW_VIEW_UUID } from 'modules/common/components/DrawView/DrawViewEditor/DrawViewEditorMenuBar/DrawViewEditorMenuBar';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { useView, viewActions } from 'modules/common/redux/view';
import { useEffect } from 'react';
import useRouter from 'use-react-router';

export default () => {
	const {
		match: {
			params: { uuid: viewUUID, buildingUUID },
		},
	} = useRouter<{ uuid: string; buildingUUID: string }>();

	const { view: fetchedView, fetched, error, fetching } = useView();
	const dispatch = useDispatch();
	const isNew = viewUUID === NEW_VIEW_UUID;
	const newView: DrawView = createNewView(buildingUUID);
	const building = useBuilding(buildingUUID);
	const isViewLoaded = Boolean(fetchedView) && fetched;
	const isBuildingLoaded = isNew || Boolean(building && building.building);
	const isViewReady = isNew || (isViewLoaded && isBuildingLoaded);
	const view: DrawView | null = (viewUUID === NEW_VIEW_UUID ? newView : fetchedView) as DrawView;

	useEffect(() => {
		if (!isNew) {
			const LOAD_VIEW_RELATED_BUILDING = true;
			dispatch(viewActions.get.request(viewUUID, LOAD_VIEW_RELATED_BUILDING));
		}
	}, [isNew, viewUUID]);

	return {
		isNew,
		isViewReady,
		view,
		error,
		fetching,
	};
};
