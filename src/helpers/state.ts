export function updateArrayItem<T>(arr: T[], paramName: keyof T, paramValue: any, nextItem: T ): T[] {
    return arr.map(item => item[paramName] === paramValue ? nextItem : item);
}

export function removeArrayItem<T>(arr: T[], paramName: keyof T, paramValue: any): T[] {
    return arr.filter(item => item[paramName] !== paramValue);
}