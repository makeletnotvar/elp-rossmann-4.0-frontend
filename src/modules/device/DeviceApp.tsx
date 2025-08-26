// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import DeviceContainer from 'modules/device/containers/DeviceContainer';
import { getDeviceModule } from 'modules/device/redux';
import * as React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules-react';

const DeviceApp: React.FC = () => {
	return (
		<>
			<DynamicModuleLoader modules={[getDeviceModule()]}>
				<DeviceContainer />
			</DynamicModuleLoader>
		</>
	);
};

export default DeviceApp;
