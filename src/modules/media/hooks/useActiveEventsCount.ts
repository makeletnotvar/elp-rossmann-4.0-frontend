import { API } from "api/axios";
import eventsApi from "api/endpoints/eventsAPI";
import { useCallback, useEffect, useState } from "react";

export interface AlarmsCount {
    alarmsCount: number;
    alarmsMaxPriority: number
}
export const useActiveEventsCount = (deviceUUID: string) => {
    const [data, setData] = useState<AlarmsCount>({ alarmsCount: 0, alarmsMaxPriority: 0 });

    const request = useCallback(async () => {
        const response = await API.get<{ eventsSummary: AlarmsCount }>(eventsApi.getEventsCount({ deviceUUID, media: true }));
        if (response.data.eventsSummary) {
            setData(response.data.eventsSummary);
        }
    }, [deviceUUID]);

    useEffect(() => {
        setTimeout(() => {
            request();
        }, 0);

        const interval = setInterval(() => {
            request();
        }, 30000);

        return () => {
            clearInterval(interval);
        }
    }, [deviceUUID]);

    return data;
}