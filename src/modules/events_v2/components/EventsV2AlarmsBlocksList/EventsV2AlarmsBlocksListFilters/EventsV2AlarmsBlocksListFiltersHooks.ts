import { entriesToObjectReducer } from 'helpers/data';
import queryString from 'query-string';
import { useCallback, useState } from 'react';
import useRouter from 'use-react-router';

type FilterParam<T> = keyof T;

type FilterValue<T = any> = 'ALL' | T[];

type FilterValues<T = any> = {
	[param in FilterParam<T>]: FilterValue;
};

export const FILTERS_VALUES: FilterValues = {
	reason: [true, false],
};

const useExtractedUrlFiltersParams = (urlParams: object) => {
	const urlFilterValues = Object.entries(urlParams)
		.filter(([p]) => p.startsWith('F_'))
		.reduce(entriesToObjectReducer, {});
	return { urlFilterValues };
};

export const getEmptyFilterParamsValues = () => {
	const filtersParamsNames = [...Object.keys(FILTERS_VALUES)];
	return filtersParamsNames.reduce((ob, next) => ({ ...ob, ['F_' + next]: null }), {});
};

export const useFilters = () => {
	const {
		location: { search },
	} = useRouter();
	const { urlFilterValues } = useExtractedUrlFiltersParams(queryString.parse(search));
	const [filtersValues, setFiltersValues] = useState<any>(urlFilterValues);

	const getFilterValue = useCallback(
		(param: string) => {
			return filtersValues['F_' + param] || 'ALL';
		},
		[filtersValues]
	);

	const setFilterValue = useCallback(
		(param: string, value: any) => {
			let nextFilterValues = { ...filtersValues, ['F_' + param]: value };
			if (nextFilterValues.F_reason.length === 2) {
				nextFilterValues = { F_reason: 'ALL' };
			}
			setFiltersValues(nextFilterValues);
		},
		[filtersValues]
	);

	return {
		filtersValues,
		getFilterValue,
		setFilterValue,
	};
};
