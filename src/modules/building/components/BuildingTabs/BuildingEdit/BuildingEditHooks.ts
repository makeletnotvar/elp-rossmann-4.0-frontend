import { useReducer, Reducer, useCallback, useMemo } from "react";

const UPDATE_PARAM = "UPDATE_PARAM";

const buildingReducer = (state: Building, action: any): Building => {
    switch (action.type) {
        case UPDATE_PARAM:
            const { param, value } = action.payload;
            return { ...state, [param]: value };
        default:
            return state;
    }
};

const validBuildlingDefinition: ValidatorDefinition<Building> = {
    "code": [code => code.length > 0]
}; 

export function useEditingBuilding(_building: Building) {
    const [building, dispatch] = useReducer<Reducer<Building, any>>(buildingReducer, _building);

    const setBuildingParam = useCallback((param: string, value: any) => {
        dispatch({ type: UPDATE_PARAM, payload: { param, value } });
    }, [building]);

    const changeTextParamHandler = useCallback((param: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        setBuildingParam(param, evt.currentTarget.value);
    }, [building]);

    const changeNumberParamHandler = useCallback((param: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        setBuildingParam(param, Number(evt.currentTarget.value));
    }, [building]);

    const isValid = useValidator<Building>(building, validBuildlingDefinition);

    return {
        building,
        setBuildingParam,
        changeTextParamHandler,
        changeNumberParamHandler,
        isValid
    };
}


type ValidatorDefinition<T> = {
    [key in keyof T]?: ((param: any) => boolean)[];
}

interface ValidatorResult<T> {
    isValid: boolean;
    params: {
        [key in keyof T]?: string;
    }
}

function useValidator<T>(ob: T, def: ValidatorDefinition<T>): ValidatorResult<T>{
    const result: ValidatorResult<T> = {
        isValid: true,
        params: {}
    }

    Object.entries(def)
        .forEach(([param, fns]) => {
            const paramValue = ob[param as keyof T];
            const isValid: boolean = Boolean((fns as any).every((fn: (param: any) => boolean) => fn(paramValue)));

            if(isValid){
                result.isValid = result.isValid;
                result.params[param as keyof T] = 'invalid';
            }
        });

    return result;
}