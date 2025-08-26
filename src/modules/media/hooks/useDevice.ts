import { useDispatch } from "modules/common/helpers/redux/useActions";
import useSelector from "modules/common/helpers/redux/useSelector";
import { DeviceRootState } from "modules/device/redux";
import { deviceActions } from "modules/device/redux/device";
import { useEffect } from "react";
import useRouter from "use-react-router";
import { STATUSES } from "vredux";

export const useDevice = () => {
  const { data: { device }, status } = useSelector((state: DeviceRootState) => state.device);

  const { match: { params: { deviceUUID } } } = useRouter<{ deviceUUID: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    const isAlreadyFetched = device && device.uuid === deviceUUID;
    if (isAlreadyFetched) {
    } else {
      dispatch(deviceActions.fetch({ uuid: deviceUUID }));
    }
  }, [device ? device.uuid : null]);

  return {
    device,
    fetching: status === STATUSES.FETCHING,
    fetched: status === STATUSES.FETCHED
  }
}