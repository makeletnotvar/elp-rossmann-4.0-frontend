import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { useCallback, useState } from 'react';
import { eventsV2Actions } from '../redux/eventsV2';

export const useEventV2Acknowledge = (uuid: string) => {
	const dispatch = useDispatch();
	const [acknowledging, setAcknowledging] = useState<boolean>(false);

	const acknowledgeHandler = useCallback(() => {
		setAcknowledging(true);
		dispatch(eventsV2Actions.acknowledge(uuid)).then(() => setAcknowledging(false));
	}, [uuid]);

	return {
		acknowledgeHandler,
		acknowledging,
	};
};
