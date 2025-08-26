import { useEffect, useRef } from "react";

const DEFAULT_DELAY = 10000;

export default (callback: any, delay: number = DEFAULT_DELAY) => {
    const savedCallback = useRef<any>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function worker() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }

        const id = setInterval(worker, delay);
        return () => {
            clearInterval(id);
        }
    }, [callback, delay]);
}