import { useDispatch } from "modules/common/helpers/redux/useActions";
import { appActions } from "modules/common/redux/app";
import { useEffect } from "react";

/**
 * Get current alarms state: count and max priority
 * It called at ASide component mounting, so after user authorization
 */
export const useIntervalEventsCountRequests = () => {
    const dispatch = useDispatch();
  
    useEffect(() => {
      // Request active events count after 1 second delay, then in 10 sec interval 
      setTimeout(() => {
        dispatch(appActions.requestEventsCount() as any);
      }, 0);
  
      setInterval(() => {
        dispatch(appActions.requestEventsCount() as any);
      }, 10000);
    }, []);
  }