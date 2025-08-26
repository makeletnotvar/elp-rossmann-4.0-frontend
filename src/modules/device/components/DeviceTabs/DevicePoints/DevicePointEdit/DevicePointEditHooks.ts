import { useDispatch } from "modules/common/helpers/redux/useActions";
import { useState, useCallback } from "react";
import { devicePointsActions } from "modules/device/redux/devicePoints";

export function usePointEdit() {
    const dispatch = useDispatch();
    const [saveBuffer, setSaveBuffer] = useState<Point | null>(null);

    const confirmHandler = useCallback(() => {
        if (saveBuffer && saveBuffer.uuid) {
            dispatch(devicePointsActions.update.request(saveBuffer.uuid, saveBuffer));
            setSaveBuffer(null)
        }
    }, [saveBuffer]);

    return {
        saveHandler: setSaveBuffer,
        confirmHandler,
        isConfirmOpen: saveBuffer != null,
        closeHandler: () => setSaveBuffer(null)
    };
}

export function usePointDelete() { 
    const dispatch = useDispatch();
    const deleteHandler = useCallback((uuid: string) => {
        dispatch(devicePointsActions.remove.request(uuid))
    }, []);

    return { deleteHandler }
}