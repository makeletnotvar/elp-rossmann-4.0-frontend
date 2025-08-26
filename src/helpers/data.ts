export const entriesToObjectReducer = (all: any, [p, v]: any) => ({ ...all, [p]: v });

/**
 * Return object with ignored params with null value
 *
 * {x: 0, y: 1, z: null} => {x:0, y:1}
 *
 * @param ob
 */
export const skipNullParams = <T = any>(ob: any): Partial<T> => {
	return Object.entries(ob)
		.filter(([p, v]) => v !== null)
		.reduce(entriesToObjectReducer, {});
};

/**
 * Return object with ignored params with null value
 *
 * {x: 0, y: 1, z: null} => {x:0, y:1}
 *
 * @param ob
 */
export const skipUndefinedParams = <T = any>(ob: any): Partial<T> => {
	return Object.entries(ob)
		.filter(([p, v]) => v !== undefined)
		.reduce(entriesToObjectReducer, {});
};

/**
 * Return unique items array
 * [0,1,1,2,3,2,4] => [0,1,2,3,4]
 *
 * @param arr
 */
export const uniqueArray = <T = any>(arr: T[]): T[] => Array.from(new Set(arr));

export const noUndefinedArrayItems = <T = any>(arr: T[]): T[] => arr.filter(n => n !== undefined);
/**
 * Return unique objects array based on @uniqueParam
 *
 * ([{x: 0, y:10}, {x: 0, y:50}, {x: 0, y:80}], 'x') => [{x: 0, y: 10}]
 *
 * @param array
 * @param uniqueParam
 */
export const uniqueObjectsArray = <T = Object>(array: T[], uniqueParam: keyof T): T[] => {
	return array.filter((ob, index, arr) => {
		const currentParam = ob[uniqueParam];
		const firstOccurIndex = arr.findIndex(ob => ob[uniqueParam] === currentParam);
		return firstOccurIndex === index;
	});
};

(window as any).uniqueObjects = uniqueObjectsArray;

/**
 * Returns specified param of array last item
 *
 * @param arr
 * @param param
 */
export const lastItemParam = <T = any>(arr: T[], param: keyof T): any => arr[arr.length - 1][param];

/**
 * Returns array with n numbers
 *
 * @param n
 * @param offset
 */
export const nArray = (n: number, offset: number = 0): number[] => {
	return Array.from(Array(n).keys()).map(n => n + offset);
};

/**
 * Returns "b" array items, which are not item of "a" array
 *
 * @param a
 * @param b
 */
export const arrayDiff = <T = string | number>(a: T[], b: T[]): T[] => {
	return b.filter(bValue => !a.includes(bValue));
};

/**
 * Make array from optional array single item -  T[] | T => T[]
 * @param arr
 */
export const arrayize = <T = any>(arr: T[] | T): T[] => {
	return arr instanceof Array ? arr : [arr];
};

export const mergeWithoutDuplicates = <T = any>(arr1: T[], arr2: T[], param: keyof T): T[] => {
	return [...arr1, ...arr2.filter(arr2Item => arr1.findIndex(arr1Item => arr1Item[param] === arr2Item[param]) === -1)];
};

/**
 * Filter object props by value, and specified filter handler
 *
 * @param ob
 * @param filter
 */
type ObjectProps<T> = {
	[key: string]: T;
};
export const filterObjectProps = <T>(ob: ObjectProps<T>, filter: (o: T, k?: string) => boolean): ObjectProps<T> => {
	return Object.entries(ob)
		.filter(([key, value]) => filter(value, key))
		.reduce(entriesToObjectReducer, {});
};

export const countObjectProps = (ob: any) => {
	return Object.keys(ob).length;
};

export const countArraysCommonItems = (arr1: any[], arr2: any[]) => {
	return arr1.filter(item => arr2.includes(item)).length;
};

export const stringComparator = (fullString: string, queryString: string): boolean => {
	const SPLIT_CHAR = ' ';

	const _fullString = fullString.toLowerCase();
	const _queryString = queryString.toLowerCase();

	const queryWords: string[] = _queryString.split(SPLIT_CHAR);

	return !queryWords.some(splitPart => !_fullString.includes(splitPart));
};
