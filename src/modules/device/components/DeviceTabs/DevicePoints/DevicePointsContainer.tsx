import Loader from 'modules/common/components/Loaders/Loader';
import DevicePoints from 'modules/device/components/DeviceTabs/DevicePoints/DevicePoints';
import { useDevicePoints } from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsHooks';
import queryString from 'query-string';
import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
// const styles = require("./DevicePointsContainer.scss");

interface DevicePointsContainerProps {
	device: DetailedDevice;
}

const DevicePointsContainer: React.FC<DevicePointsContainerProps> = ({ device }) => {
	const {
		history,
		location: { search },
	} = useRouter();
	const { d, p } = queryString.parse(search);
	const { t } = useTranslation();
	const { points, fetched, fetching, error: err } = useDevicePoints(device.uuid);
	const devicePointsCount = device.points ? device.points.length : 0;

	const onUpdateSettings = (ob: any) => {
		const { sortingDir, sortingParam } = ob;
		history.push(`${history.location.pathname}?d=${sortingDir}&p=${sortingParam}`);
	};

	const { sortedPoints, sortingDir, sortingParam } = useMemo(() => {
		const sortedPoints = points.sort((a: any, b: any) =>
			a[(p as string) || 'registerNumber'] > b[(p as string) || 'registerNumber']
				? (d || 'asc') === 'desc'
					? -1
					: 1
				: b[(p as string) || 'registerNumber'] > a[(p as string) || 'registerNumber']
				? (d || 'asc') === 'desc'
					? 1
					: -1
				: 0
		);

		return {
			sortedPoints,
			sortingDir: (d || 'asc') as 'asc' | 'desc' | undefined,
			sortingParam: (p || 'registerNumber') as string,
		};
	}, [points, d, p]);

	return (
		<>
			{fetching ? (
				<Loader label={t('devices.messages.loading_points')} />
			) : fetched || devicePointsCount === 0 ? (
				<DevicePoints points={sortedPoints} sortingDir={sortingDir} sortingParam={sortingParam} onUpdateSettings={onUpdateSettings} />
			) : err ? (
				t('devices.messages.load_error')
			) : (
				t('devices.messages.not_loaded')
			)}
		</>
	);
};

export default DevicePointsContainer;
