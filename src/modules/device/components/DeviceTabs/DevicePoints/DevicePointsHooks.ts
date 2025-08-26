import { useDispatch } from "modules/common/helpers/redux/useActions";
import { pointsActions, usePoints } from "modules/common/redux/points";
import { useDeviceState } from "modules/device/redux/device";
import { useEffect, useState } from "react";
import { STATUSES } from "vredux";

function getDevicePointsUUIDs(device: Device & Partial<DeviceDetails>): string[] {
    if (device && device.points) {
        return device.points.map(pointRef => pointRef.uuid);
    }
    return [];
}

export function useDevicePoints(uuid: string = '') {
    const { data: { device }, status } = useDeviceState();
    const { points, fetched, fetching, error } = usePoints();
    const dispatch = useDispatch();

    useEffect(() => {
        if (device && status === STATUSES.FETCHED) {
            const points = getDevicePointsUUIDs(device);
            if (points.length > 0) {
                dispatch(pointsActions.get.request(points));
            }
        }
    }, [uuid, device]);

    return {
        device,
        points,
        fetched,
        fetching,
        error
    };
}

export function usePointsImport() {
    const [importActive, setImportActive] = useState<boolean>(false);

    return {
        importActive,
        setImportActive
    }
}