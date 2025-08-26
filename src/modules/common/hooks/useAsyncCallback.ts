import { DependencyList, useCallback } from "react";

/**
 * React.useCallback wrapper to call async methods
 * 
 * you can use:
 * useCallbackAsync(async () => {...some code})
 * 
 * instead of:
 * useCallback(() => {async function fetch(){...}, fetch()}, [])
 * 
 * @param fn 
 * @param deps 
 */
const useAsyncCallback = (fn: any, deps: DependencyList = []): any => {
    return useCallback((...args: any[]) => {
        fn && fn(...args);
    }, deps || []);
}

export default useAsyncCallback;