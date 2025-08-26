import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import useRouter from 'use-react-router';

const LANGUAGE_STRINGS = ['PL', 'EN'];
const ACTION_STRINGS = ['ZAPISZ', 'SAVE', 'JESTEŚ PEWNY ?', 'ARE YOU SURE?'];
const INACTIVE_STRINGS = ['NIE AKTYWNY', 'AKTYWNY', 'ACTIVE', 'INACTIVE', 'BRAK ALARMU', 'NO ALARM', ...ACTION_STRINGS];

export function useBuildingVirtualHMIRouter(isConnecting: boolean) {
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const {
		history,
		location: { search },
		match: {
			params: { uuid, deviceUUID },
		},
	} = useRouter<{ uuid?: string; deviceUUID?: string }>();

	const urlParams: { path: string } = useMemo(() => {
		const params: { path: string } = queryString.parse(search) as { path: string };
		return params;
	}, [search]);

	const { pathStrings } = useMemo(() => {
		const pathStrings = urlParams.path ? urlParams.path.split('$%^') : ([] as string[]);
		return { pathStrings };
	}, [urlParams.path]);

	const updatePath = (nextPath: string[]) => {
		if (!uuid || !deviceUUID) return;

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
				finalParamsPath = nextParamsPath ? `?${queryString.stringify({ path: nextParamsPath })}` : '';
			} else {
				const nextParamsPath = nextPath.join('$%^');
				finalParamsPath = nextParamsPath ? `?${queryString.stringify({ path: nextParamsPath })}` : '';
			}
		} else {
			(window as any).vHmi.onChangeNodePath([pathIndexes.length, ...pathIndexes]);
		}

		history.push(`/building/${uuid}/vhmi/${deviceUUID}${finalParamsPath}`);
	};

	useEffect(() => {
		let checkConnectionInterval: any = null;

		if (isConnecting && !isConnected) {
			checkConnectionInterval = setInterval(() => {
				setIsConnected((window as any).vHmi.webSocket.connected);
			}, 1000);
		} else {
			clearInterval(checkConnectionInterval);
		}

		return () => clearInterval(checkConnectionInterval);
	}, [isConnecting, isConnected]);

	useEffect(() => {
		if (!uuid || !deviceUUID) return;
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
	};
}
