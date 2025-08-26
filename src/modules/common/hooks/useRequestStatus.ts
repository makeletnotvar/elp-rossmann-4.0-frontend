import { useState } from "react";

export type RequestStatus = 'NONE' | 'FETCHING' | 'FETCHED' | 'FAILURE' | 'SUCCESS';

export const REQUEST_NONE = 'NONE';
export const REQUEST_FETCHING = 'FETCHING';
export const REQUEST_SUCCESS = 'SUCCESS';
export const REQUEST_FAILURE = 'FAILURE';

export const useRequestStatus = () => {
    const [status, setStatus] = useState<RequestStatus>(REQUEST_NONE);
    const [errorMessage, setErrorMessage] = useState<string>('');

    return {
        status, 
        setStatus,
        errorMessage,
        setErrorMessage,
        setFetching: () => setStatus(REQUEST_FETCHING),
        setSuccess: () => setStatus(REQUEST_SUCCESS),
        setFailure: (errorMessage?: string) => {
            setStatus(REQUEST_FAILURE);
            errorMessage && setErrorMessage(errorMessage);
        },
        reset: () => {
            setErrorMessage('');
            setStatus(REQUEST_NONE);
        },
    }
}