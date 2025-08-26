import { entriesToObjectReducer } from 'helpers/data';
import queryString from 'query-string';
import { useCallback, useState } from 'react';
import useRouter from 'use-react-router';

type FilterParam<T> = keyof T;

type FilterValue<T = any> = 'ALL' | T[];

type FilterValues<T = any> = {
	[param in FilterParam<T>]: FilterValue;
};

export const FILTERS_VALUES: FilterValues<RossmannBuildingFilterModel> = {
	priority: ['NONE', 'INFORMATION', 'URGENT', 'CRITICAL', 'LIFE_SAFETY'],
	isActive: ['ACTIVE', 'INACTIVE'],
	type: ['NONE', 'DEVICE_POINT_ALARM'],
};

const useExtractedUrlFiltersParams = (urlParams: object) => {
	const urlFilterValues = Object.entries(urlParams)
		.filter(([p]) => p.startsWith('F_'))
		.reduce(entriesToObjectReducer, {});
	return { urlFilterValues };
};

export const useFilters = () => {
	const {
		location: { search },
	} = useRouter();
	const { urlFilterValues } = useExtractedUrlFiltersParams(queryString.parse(search));
	const [filtersValues, setFiltersValues] = useState<any>(urlFilterValues);

	const setFilterValue = useCallback(
		(param: string, value: any) => {
			const nextFilterValues = { ...filtersValues, ['F_' + param]: value };
			setFiltersValues(nextFilterValues);
		},
		[filtersValues]
	);

	return {
		filtersValues,
		setFilterValue,
	};
};
