import DeviceLayout from 'modules/device/components/DeviceLayout/DeviceLayout';
import { useDevice } from 'modules/device/containers/DeviceContainerHooks';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

const DeviceContainer: React.FC = () => {
	const { device } = useDevice();
	return (
		<>
			<Switch>
				<Route path='/device/:uuid/:tab?' render={() => <DeviceLayout device={device || undefined} />} />
			</Switch>
		</>
	);
};

export default DeviceContainer;
