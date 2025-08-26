// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import DevicesLayout from 'modules/devices/components/DevicesLayout/DevicesLayout';
import { getDevicesModule } from 'modules/devices/redux';
import * as React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules-react';
// const styles = require("./DevicesApp.scss");

interface DevicesAppProps {}

/**
 * Devices APP
 *
 * In device points list editor due to long time requrest for registers collection, registers are fetched in background and memoized.
 * User could manually reload it on demand.
 *
 *
 *
 */
const DevicesApp: React.FC<DevicesAppProps> = () => {
	return (
		<DynamicModuleLoader modules={[getDevicesModule()]}>
			<DevicesLayout />
		</DynamicModuleLoader>
	);
};

export default DevicesApp;
