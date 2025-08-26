import { API } from 'api/axios';
import devicesAPI from 'api/endpoints/devicesAPI';
import BuildingVirtualHMIView from 'modules/building/components/BuildingTabs/BuildingVirtualHMI/BuildingVirtualHMIView';
import { useBuildingVirtualHMIRouter } from 'modules/common/components/VirtualHMI/hooks/useBuildingVHMIRouter';
import { useVHMI } from 'modules/common/components/VirtualHMI/hooks/useVHMI';
import { useAuth } from 'modules/common/selectors/auth';
import { DeviceResponse } from 'modules/device/redux/device';
import React, { useCallback, useEffect, useState } from 'react';
import useRouter from 'use-react-router';

interface BuildingVirtualHMIProps {
	building: Building;
}

const BuildingVirtualHMI: React.FC<BuildingVirtualHMIProps> = ({ building }) => {
	const [selectedDeviceRef, setSelectedDeviceRef] = useState<(BuildingDeviceReference & { deviceCode?: string }) | null>(
		building.devices ? building.devices[0] : null
	);
	const [, setCountdownLoading] = useState<number>(10);
	const [blockReconnect, setBlockReconnect] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isConnecting, setIsConnecting] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [isLoadingError, setIsLoadingError] = useState<boolean>(false);
	const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
	const { user } = useAuth();
	const { data } = useVHMI(setIsLoading);

	const {
		history,
		location: { search },
	} = useRouter<{ deviceUUID?: string }>();
	const { updatePath, pathStrings } = useBuildingVirtualHMIRouter(isConnecting);

	useEffect(() => {
		if (data.length > 0) {
			setIsConnecting(false);
			setIsConnecting(false);
			setIsLoadingError(false);
			setIsLoadingData(false);
		}
	}, [data, isError]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (data.length === 0) {
				setIsConnecting(false);
				setIsLoadingError(false);
				setIsLoadingData(false);
				setIsError(true);
			}
		}, 30000);

		return () => clearTimeout(timer);
	}, [data, isError]);

	useEffect(() => {
		if (selectedDeviceRef && selectedDeviceRef.uuid && blockReconnect === false) {
			API.get<DeviceResponse>(devicesAPI.getDevice(selectedDeviceRef.uuid)).then(device => {
				const { uuid, name, description, code: deviceCode } = device.data.device;
				if (deviceCode && uuid && name) {
					const deviceRef = { uuid, name, description };
					const onRequestVHMI = async () => {
						setIsConnecting(true);
						setTimeout(() => {
							if (user) {
								const request = async () => {
									const response = await API.get<{ wsid: string }>(devicesAPI.connectVirtualHMI());
									if (response && response.data.wsid) {
										const wsid = response.data.wsid;
										(window as any).vHmi.connect(deviceCode, user.uuid, wsid);
										setBlockReconnect(true);
										setSelectedDeviceRef({ ...deviceRef, deviceCode });
										history.replace(`/building/${building.uuid}/vhmi/${deviceRef.uuid}${search}`);
									}
								};
								request();
							}
						});
					};
					onRequestVHMI();
				}
			});
		}
	}, [building, selectedDeviceRef, blockReconnect]);

	const onClickConnectHMI = useCallback(async () => {
		const searchParams = new URLSearchParams(search);
		if (searchParams.has('reconnectTimes')) {
			searchParams.delete('reconnectTimes');
			history.push({ search: searchParams.toString() });
		}
		if (selectedDeviceRef && selectedDeviceRef.uuid && blockReconnect === false) {
			API.get<DeviceResponse>(devicesAPI.getDevice(selectedDeviceRef.uuid)).then(device => {
				const { uuid, name, description, code: deviceCode } = device.data.device;
				if (deviceCode && uuid && name) {
					const deviceRef = { uuid, name, description };
					const onRequestVHMI = async () => {
						setIsConnecting(true);
						setTimeout(() => {
							if (user) {
								const request = async () => {
									const response = await API.get<{ wsid: string }>(devicesAPI.connectVirtualHMI());
									if (response && response.data.wsid) {
										const wsid = response.data.wsid;
										(window as any).vHmi.connect(deviceCode, user.uuid, wsid);
										setBlockReconnect(true);
										setSelectedDeviceRef({ ...deviceRef, deviceCode });
										history.replace(`/building/${building.uuid}/vhmi/${deviceRef.uuid}${search}`);
									}
								};
								request();
							}
						});
					};
					onRequestVHMI();
				}
			});
		}
	}, [building, selectedDeviceRef, blockReconnect, search]);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		const searchParams = new URLSearchParams(search);
		const reconnectTimes = parseInt(searchParams.get('reconnectTimes') || '0');
		if (isLoading && reconnectTimes < 3) {
			setCountdownLoading(import.meta.env.VITE_APP_VHMI_REFRESH_TIME || 8);
			intervalId = setInterval(() => {
				setCountdownLoading(prevCountdown => {
					if (prevCountdown === 1) {
						searchParams.set('reconnectTimes', String(reconnectTimes + 1));
						history.push({ search: searchParams.toString() });
						history.go(0);
						return import.meta.env.VITE_APP_VHMI_REFRESH_TIME || 8;
					} else if (prevCountdown === 3) {
						setIsLoadingData(false);
						setIsLoadingError(true);
						return prevCountdown - 1;
					} else if (prevCountdown === 6) {
						setIsLoadingData(true);
						return prevCountdown - 1;
					} else {
						return prevCountdown - 1;
					}
				});
			}, 1000);
		} else if (reconnectTimes === 3) {
			setTimeout(() => {
				setIsLoadingError(false);
				setIsLoadingData(false);
				setIsError(true);
			}, 100);
		} else {
			const searchParams = new URLSearchParams(search);
			if (searchParams.has('reconnectTimes')) {
				searchParams.delete('reconnectTimes');
				history.push({ search: searchParams.toString() });
			}
		}
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [isLoading, search]);

	return (
		<BuildingVirtualHMIView
			data={data}
			selectedDeviceRef={selectedDeviceRef}
			updatePath={updatePath}
			isConnecting={isConnecting}
			pathStrings={pathStrings ? pathStrings : []}
			isLoading={isLoading}
			setIsLoading={setIsLoading}
			isError={isError}
			setIsError={setIsError}
			isLoadingError={isLoadingError}
			isLoadingData={isLoadingData}
			onClickConnectHMI={onClickConnectHMI}
		/>
	);
};

export default BuildingVirtualHMI;
