import { useState, useCallback, useEffect } from "react";
import { AxiosResponse } from "axios";

export enum RequestStatus {
    'INITIALIZED',
    'FETCHING',
    'FETCHED',
    'ERROR',
};

/**
 * Axios request wrapper hook
 * 
 * @param requestPromise 
 * @param deps 
 */
export function useRequest<T = any>(requestPromise: () => Promise<AxiosResponse<T>>, deps: any[] = [], disableAutorun: boolean = false) {
    const [status, setStatus] = useState<RequestStatus>(RequestStatus.INITIALIZED);
    const [data, setData] = useState<T | undefined>();
    const [error, setError] = useState(null);

    const request = useCallback(() => {
        const req = () => {
            setStatus(RequestStatus.FETCHING);
            requestPromise()
                .then(data => {
                    setData(data.data);
                    setStatus(RequestStatus.FETCHED);
                })
                .catch(err => {
                    setData(undefined);
                    setStatus(RequestStatus.ERROR);
                    setError(err);
                })
        };

        req();
    }, deps);

    useEffect(() => {
        !disableAutorun && request()
    }, [...deps, disableAutorun]);

    return {
        data,
        status,
        error,
        request
    }
}