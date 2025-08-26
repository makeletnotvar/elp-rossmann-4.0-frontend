import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { viewsActions } from 'modules/common/redux/views';
import { useCallback, useEffect } from 'react';
import useRouter from 'use-react-router';

export function useBuildingViews() {
	const dispatch = useDispatch();
	const {
		history,
		match: {
			params: { uuid },
		},
	} = useRouter<{ uuid: string }>();

	const moreHandler = useCallback(
		(viewUUID: string) => {
			history.push(`/building/${uuid}/view/${viewUUID}`);
		},
		[uuid]
	);

	const removeHandler = useCallback((viewUUID: string) => {
		dispatch(viewsActions.remove.request(viewUUID));
	}, []);

	const editHandler = useCallback((viewUUID: string) => {
		history.push(`/viewEditor/${viewUUID}`);
	}, []);

	const addHandler = useCallback(() => {
		history.push(`/viewEditor/new/${uuid}`);
	}, [uuid]);

	/**
	 *
	 * Request building views on load
	 *
	 */
	useEffect(() => {
		dispatch(viewsActions.get.request(uuid));
	}, [uuid]);

	return {
		moreHandler,
		removeHandler,
		editHandler,
		addHandler,
	};
}
