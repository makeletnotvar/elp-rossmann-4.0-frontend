import { MANUFAKTURA_CODE } from "config/system";

export const isFancoilsRequired = (code?: string): boolean => {
    return Number(code) !== MANUFAKTURA_CODE;
}

export const isHeatPumpsRequired = (building: Building): boolean => {
    return Object.keys(building.pointsXidsRefs || {})
        .some(xid => xid.startsWith('hp_') || xid.startsWith('pc_'));
}

export const isExtendedACRequired = (code?: string): boolean => {    
    return Number(code) === MANUFAKTURA_CODE;
}