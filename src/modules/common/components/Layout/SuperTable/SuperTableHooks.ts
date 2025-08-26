import { SuperTableDataColumns } from "./SuperTable";
import { useState, useCallback } from "react";

export const extractDataColumns = <T>(firstRow: T): (keyof T)[] =>
    firstRow ? Object.keys(firstRow) as (keyof T)[] : [];

export interface SortingOptions {
    param: string;
    dir: 'asc' | 'desc';
}
export const useTableSorting = (defaultOptions: SortingOptions) => {
    const [sorting, setSorting] = useState<SortingOptions>(defaultOptions);

    return {
        sorting,
        setSorting: (param: string, dir: 'asc' | 'desc') => {
            setSorting({param, dir});
        }
    }
}