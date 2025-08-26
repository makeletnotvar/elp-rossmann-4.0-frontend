import Content from 'modules/common/components/Layout/Content/Content';
import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { convertPaginationRouteProps } from 'modules/common/helpers/router/router';
import DevicesTitleBar from 'modules/devices/components/DevicesLayout/DevicesTitleBar/DevicesTitleBar';
import DevicesList from 'modules/devices/components/DevicesList/DevicesList';
import { useDevicesData, useDevicesFilters } from 'modules/devices/components/DevicesList/DevicesListHooks';
import * as React from 'react';
import { useCallback } from 'react';
import { STATUSES } from 'vredux';
import AddDeviceDialogContainer from '../AddDeviceDialog/AddDeviceDialogContainer';
import { useAddDeviceDialog } from './DevicesListHooks';

interface DevicesListContainerProps {}

const DevicesListContainer: React.FC<DevicesListContainerProps> = () => {
	const { settings, shortSettings, updateSettings } = useDevicesFilters();
	const { devices, status, countAll, count } = useDevicesData(shortSettings);
	const { open, openHandler, closeHandler } = useAddDeviceDialog();

	const updateSettingsHandler = useCallback((nextSettings: Partial<SuperTableDisplaySettings>) => {
		const convertedRouteProps = convertPaginationRouteProps(nextSettings);
		updateSettings(convertedRouteProps);
	}, []);

	const searchHandler = useCallback((query: string) => {
		updateSettings(convertPaginationRouteProps({ query }));
	}, []);

	const searchResetHandler = useCallback(() => {
		searchHandler('');
	}, []);

	return (
		<Content>
			<DevicesTitleBar query={settings.query || ''} onAdd={openHandler} onResetSearch={searchResetHandler} onSearch={searchHandler} />
			<DevicesList
				devices={devices}
				settings={settings}
				onChangeSettings={updateSettingsHandler}
				fetching={status === STATUSES.FETCHING}
				count={count}
				countAll={countAll}
			/>
			<AddDeviceDialogContainer open={open} onClose={closeHandler} />
		</Content>
	);
};

export default DevicesListContainer;
