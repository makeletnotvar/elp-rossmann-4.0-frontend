import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { alarmsBlocksActions } from 'modules/events_v2/redux/alarmsBlocks';
import { useCallback, useState } from 'react';
import { ElpEventV2AlarmBlockIdentifyProps } from '../interfaces/eventV2-alarm-block-identify.interface';

export function useEventV2AlarmBlockDelete(closeDetails: () => void) {
	const dispatch = useDispatch();
	const [deleteAlarmBlock, setdeleteAlarmBlock] = useState<ElpEventV2AlarmBlockIdentifyProps | null>(null);

	const confirmHandler = useCallback(() => {
		if (deleteAlarmBlock) {
			dispatch(alarmsBlocksActions.delete(deleteAlarmBlock));
			setdeleteAlarmBlock(null);
			closeDetails();
		}
	}, [deleteAlarmBlock]);

	return {
		deleteHandler: setdeleteAlarmBlock,
		confirmHandler,
		isConfirmOpen: deleteAlarmBlock != null,
		closeHandler: () => setdeleteAlarmBlock(null),
	};
}
