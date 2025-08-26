import { filterObjectProps, skipNullParams } from 'helpers/data';
import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';

export const numQuery = (queryValue: any, queryDefaultValue: any): number => (queryValue === undefined ? queryDefaultValue || 0 : Number(queryValue));

export const mergeQueryParams = <T = any>(prevQuery: any, nextQuery: any): T => {
	const merged = Object.keys(nextQuery).reduce((concated: any, nextKey) => {
		const value = nextQuery[nextKey as keyof T];
		return value !== undefined ? { ...concated, [nextKey]: value } : concated;
	}, prevQuery);
	const nullSkipped: T = skipNullParams<T>(merged) as T;

	return nullSkipped;
};

export const convertPaginationRouteProps = <T>(ob: Partial<SuperTableDisplaySettings>, filters: any = {}): any => {
	return {
		p: ob.sortingParam,
		d: ob.sortingDir,
		o: ob.offset,
		s: ob.rowsPerPage,
		q: ob.query,
		c: ob.columns,
		...filters,
	};
};

export const extractFiltersFromObject = (queryObject: any): { [param: string]: string } => {
	return filterObjectProps(queryObject, (value, key) => String(key).startsWith('F_'));
};
