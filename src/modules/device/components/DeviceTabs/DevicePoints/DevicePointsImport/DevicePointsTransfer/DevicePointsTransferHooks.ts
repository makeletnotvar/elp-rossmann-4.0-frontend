import { API } from 'api/axios';
import { devicesAPI } from 'api/endpoints/devicesAPI';
import { AxiosRequestConfig } from 'axios';
import { SECOND_IN_MS } from 'constants/date';
import { useRequest } from 'helpers/requests';
import { isEqual } from 'lodash';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import autoFillRegister from 'modules/device/helpers/autoFillRegister';
import { devicePointsActions } from 'modules/device/redux/devicePoints';
import { useCallback, useState } from 'react';

export interface RegistersRequest {
	registers: DeviceRegister[];
}

const FETCH_REGISTER_REQUEST_TIMEOUT_MS = 120 * SECOND_IN_MS;

export function useDeviceRegisters(uuid: string) {
	const fetchDeviceRegisters = () => {
		const longTimeoutConfig: AxiosRequestConfig = {
			timeout: FETCH_REGISTER_REQUEST_TIMEOUT_MS,
		};
		return API.get<RegistersRequest>(devicesAPI.getDeviceRegisters(uuid), longTimeoutConfig);
	};
	const DISABLE_AUTORUN = true;
	const { data, status, request: forceReload } = useRequest<RegistersRequest>(fetchDeviceRegisters, [uuid], DISABLE_AUTORUN);

	return {
		data,
		status,
		forceReload,
	};
}

export function useCurrentlyImportedPoints(deviceUUID: string) {
	const [pointsRefs, setPointsRefs] = useState<PointRegisterReference[]>([]);
	const dispatch = useDispatch();

	const add = useCallback(
		(pointRegisterReference: PointRegisterReference) => {
			const autoFilledRef = autoFillRegister(pointRegisterReference);
			setPointsRefs([...pointsRefs, autoFilledRef]);
		},
		[pointsRefs]
	);

	const remove = useCallback(
		(registerName: string) => {
			if (registerName) {
				setPointsRefs(pointsRefs.filter(point => point.registerName !== registerName));
			}
		},
		[pointsRefs]
	);

	const submit = useCallback(() => {
		if (deviceUUID) {
			dispatch(devicePointsActions.add.request(deviceUUID, pointsRefs));
		}
	}, [pointsRefs]);

	return {
		pointsRefs,
		add,
		remove,
		submit,
	};
}

export function pointToRegisterReference(points: Point[]): PointRegisterReference[] {
	return points.map(point => {
		const { uuid = '', name, registerName, registerNumber, customRender, type } = point;
		return {
			uuid,
			name,
			registerName,
			registerNumber,
			customRender,
			type,
		};
	});
}

export function isRegisterAlreadyExists(register: DeviceRegister, addedPoints: PointRegisterReference[]): boolean {
	return addedPoints.findIndex(point => point.registerName === register.name || point.registerNumber === register.number) > -1;
}

export function sortByRegisterNumber(registers: DeviceRegister[]) {
	return registers.sort((a, b) => a.number - b.number);
}

export const getCustomRenderDifferences = (point: any, register: any) => {
	const differences = [];
	for (const key in point.customRender) {
		if (point.customRender.hasOwnProperty(key)) {
			if (point.type === 'enum' && key === 'states') {
				if (point.customRender.states && !register.customRender.states) continue;
				if (point.customRender.states && register.customRender.states) {
					const stateDifferences = getStatesDifferences(point.customRender.states, register.customRender.states);
					differences.push(...stateDifferences);
				}
			} else if (point.type === 'numeric' && key === 'step') {
				const pointStep = parseFloat(point.customRender.step);
				const registerStep = parseFloat(register.customRender.step);
				if (!isNaN(pointStep) && !isNaN(registerStep) && pointStep.toFixed(2) !== registerStep.toFixed(2)) {
					differences.push(`Config | (Point ${key}: ${pointStep.toFixed(2)}) - (Reg ${key}: ${registerStep.toFixed(2)})`);
				}
			} else if (point.customRender[key] !== 'regType' && !isEqual(point.customRender[key], register.customRender[key])) {
				differences.push(`Config | (Point ${key}: ${point.customRender[key]}) - (Reg ${key}: ${register.customRender[key]})`);
			}
		}
	}
	return differences;
};

const getStatesDifferences = (pointStates: any, registerStates: any) => {
	const differences = [];
	for (const key in pointStates) {
		if (pointStates.hasOwnProperty(key) && !isEqual(pointStates[key], registerStates[key])) {
			differences.push(`Config | Point (${key}: ${pointStates[key]}) - Register ( ${key}: ${registerStates[key]})`);
		}
	}
	return differences;
};

export const customRenderTooltip = (customRender: any) => {
	if (customRender.hasOwnProperty('states')) {
		const statesString = Object.entries(customRender.states)
			.map(([key, value]) => `${key}: ${value}`)
			.join(', ');
		return statesString;
	} else {
		return Object.entries(customRender)
			.map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
			.join(', ');
	}
};
