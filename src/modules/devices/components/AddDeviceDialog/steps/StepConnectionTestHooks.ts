import { API } from 'api/axios';
import { devicesAPI } from 'api/endpoints/devicesAPI';
import { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';

type DeviceTestResponse = {
	device: DeviceInfo | null;
	message?: string;
};

/**
 * Device connection test hook
 *
 * error - błąd serwera
 * failure - negatywny wynik testu połączenia
 *
 *
 * @param code
 * @param onDeviceFound
 */
export function useDeviceConnectionTest(code: string, onDeviceFound: (device: DeviceInfo | null) => void) {
	const [testing, setTesting] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [failure, setFailure] = useState<boolean>(false);

	const responseHandler = (device: DeviceInfo | null) => {
		if (device) {
			setFailure(false);
			setError(false);
			setTesting(false);
			onDeviceFound(device);
		}
	};

	const start = useCallback(() => {
		(async () => {
			setTesting(true);
			const longTimeoutConfig: AxiosRequestConfig = { timeout: 30000 };
			try {
				const response = await API.get<DeviceTestResponse>(devicesAPI.testDevice(code), longTimeoutConfig);
				responseHandler(response.data.device);
			} catch (err: any) {
				// setTesting(false);
				// setFailure(false);
				// setError(true);
				setTesting(false);
				setError(false);
				setFailure(true);
				onDeviceFound(null);
			}
		})();
	}, [code]);

	return {
		start,
		testing,
		error,
		failure,
	};
}
