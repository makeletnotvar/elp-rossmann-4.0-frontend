import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import useRouter from 'use-react-router';

const LANGUAGE_STRINGS = ['PL', 'EN'];
const ACTION_STRINGS = ['ZAPISZ', 'SAVE', 'JESTEŚ PEWNY ?', 'ARE YOU SURE ?', 'JESTEŚ PEWNY?', 'ARE YOU SURE?'];
const INACTIVE_STRINGS = ['NIE AKTYWNY', 'AKTYWNY', 'ACTIVE', 'INACTIVE', 'BRAK ALARMU', 'NO ALARM', ...ACTION_STRINGS];

export function useBuildingVirtualHMIDialogRouter() {
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const {
		history,
		location: { search, pathname },
	} = useRouter();

	const { path, ...otherPath }: { path: string } = useMemo(() => {
		const params: { path: string } = queryString.parse(search) as { path: string };
		return params;
	}, [search]);

	const { pathStrings } = useMemo(() => {
		const pathStrings = path ? path.split('$%^') : ([] as string[]);
		return { pathStrings };
	}, [path]);

	const updatePath = (nextPath: string[]) => {
		let finalParamsPath = '';

		const pathIndexes = nextPath.map(path => Number(path.split('-')[0]));
		const pathWithoutIndexes = nextPath.map(path => path.split('-')[1]);

		const hasLanguageStrings = pathWithoutIndexes.some(pathWithoutIndex => LANGUAGE_STRINGS.includes(pathWithoutIndex));
		const hasInactiveStrings = pathWithoutIndexes.some(pathWithoutIndex => INACTIVE_STRINGS.includes(pathWithoutIndex));
		const hasActionStrings = pathWithoutIndexes.some(pathWithoutIndex => ACTION_STRINGS.includes(pathWithoutIndex));

		if (!hasLanguageStrings) {
			if (hasInactiveStrings) {
				if (hasActionStrings) {
					(window as any).vHmi.onChangeNodePath([pathIndexes.length, ...pathIndexes]);
				}
				const nextParamsPath = nextPath.slice(0, nextPath.length - 2).join('$%^');
				finalParamsPath = nextParamsPath ? `?${queryString.stringify({ ...otherPath, path: nextParamsPath })}` : `?${queryString.stringify({ ...otherPath })}`;
			} else {
				const nextParamsPath = nextPath.join('$%^');
				finalParamsPath = nextParamsPath ? `?${queryString.stringify({ ...otherPath, path: nextParamsPath })}` : `?${queryString.stringify({ ...otherPath })}`;
			}
		} else {
			(window as any).vHmi.onChangeNodePath([pathIndexes.length, ...pathIndexes]);
		}

		history.push(`${pathname}${finalParamsPath}`);
	};

	useEffect(() => history.push(`${pathname}?${queryString.stringify({ ...otherPath })}`), []);

	useEffect(() => {
		let checkConnectionInterval: any = null;
		if (!isConnected) {
			checkConnectionInterval = setInterval(() => {
				setIsConnected((window as any).vHmi.webSocket.connected);
			}, 1000);
		} else {
			return () => clearInterval(checkConnectionInterval);
		}
	}, [isConnected]);

	useEffect(() => {
		if (isConnected) {
			if (pathStrings.length > 0) {
				const pathIndexes = pathStrings.map(path => Number(path.split('-')[0]));
				(window as any).vHmi.onChangeNodePath([pathIndexes.length, ...pathIndexes]);
			} else {
				(window as any).vHmi.onChangeNodePath([]);
			}
		}
	}, [isConnected, pathStrings]);

	return {
		pathStrings,
		updatePath,
		otherPath,
	};
}
