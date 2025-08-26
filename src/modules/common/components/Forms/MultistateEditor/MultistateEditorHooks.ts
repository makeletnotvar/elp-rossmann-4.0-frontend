import { useState, useEffect } from "react";
import { MultistateValue, MultistateStates } from "modules/common/components/Forms/MultistateEditor/MultistateEditor";

export function objectStatesToArray(value: MultistateValue | undefined): MultistateStates {
    return value
        ? Object.entries(value)
            .map(([key, value]) => ({ key: Number(key), value }))
        : [];
}

export function arrayStatesToObject(states: MultistateStates): MultistateValue {
    return states.reduce(
        (ob, nextState) => ({
            ...ob,
            [nextState.key]: nextState.value
        }), {});
}

export function useMultistateEditor(initialValue: MultistateValue) {
    const [states, nextState] = useState<MultistateStates>(objectStatesToArray(initialValue));

    useEffect(() => {
        nextState(objectStatesToArray(initialValue));
    }, [initialValue])
    
    return { states }
};