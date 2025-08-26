import { useState, useCallback, useEffect } from "react";
import useRouter from "use-react-router";
import { entriesToObjectReducer, skipNullParams } from "helpers/data";
import queryString from 'query-string';

type FilterParam<T> = keyof T;

type FilterValue<T = any> = 'ALL' | T[];

type FilterValues<T = any> = {
    [param in FilterParam<T>]: FilterValue;
}

type Filters<T> = {
    [param in FilterParam<T>]?: FilterValue<any>;
};

type FilterType = 'MULTI' | 'RANGE' | 'BOOLEAN';

type FiltersConfig<T> = {
    [param in FilterParam<T>]: FilterType;
}

const FILTERS_CONFIG: FiltersConfig<RossmannBuildingFilterModel> = {
    province: 'MULTI',
    placeType: 'MULTI',
    ventTechnical: 'MULTI'
}

export const FILTERS_VALUES: FilterValues<RossmannBuildingFilterModel> = {
    ventTechnical: ['OWN', 'OUTSOURCE'],
    ventBrand: ['KLIMOR', 'VBW'],
    fancoils: ['HEATING', 'MULTI'],
    curtains: ['ELECTRIC', 'WATER'],
    heatSource: ['WN', 'OWN']
}


const useExtractedUrlFiltersParams = (urlParams: object) => {
  const urlFilterValues = Object.entries(urlParams)
    .filter(([p, v]) => p.startsWith("F_"))
    .reduce(entriesToObjectReducer, {});
  return {urlFilterValues};
}


export const useFilters = () => {
    const {location: {search}} = useRouter();
    const {urlFilterValues} = useExtractedUrlFiltersParams(queryString.parse(search));
    const [filtersValues, setFiltersValues] = useState<any>(urlFilterValues);
  
    const getFilterValue = useCallback((param: string) => {
      return filtersValues['F_' + param] || 'ALL'
    }, [filtersValues]);
  
    const setFilterValue = useCallback((param: string, value: any) => {
      const nextFilterValues = value !== null
        ? { ...filtersValues, ['F_' + param]: value }
        : skipNullParams(filtersValues);

      setFiltersValues(nextFilterValues);
    }, [filtersValues]);


    const toggleFilter = useCallback((filterName: string, checked: boolean) => {
      const nextFilterValues = filtersValues['F_' + filterName] || !checked
        ? Object.entries(filtersValues)
          .filter(([p,v]) => p !== 'F_' + filterName)
          .reduce(entriesToObjectReducer, {})
        : {...filtersValues, ['F_' + filterName]: 'ALL'}

      setFiltersValues(nextFilterValues);
    }, [filtersValues])
  
    return {
      filtersValues,
      getFilterValue,
      toggleFilter,
      setFilterValue
    }
  };