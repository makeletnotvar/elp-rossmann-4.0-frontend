import DeviceEdit from 'modules/device/components/DeviceTabs/DeviceEdit/DeviceEdit';
import DeviceInfo from 'modules/device/components/DeviceTabs/DeviceInfo/DeviceInfo';
import DevicePointsContainer from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsContainer';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

interface DeviceTabsProps {
	device: Device | undefined;
}

const initialDevice: Partial<Device> = {};

const DeviceTabs: React.FC<DeviceTabsProps> = ({ device: device }) => {
	return device ? (
		<Switch>
			<Route exact path={`/device/:uuid/info`} render={() => <DeviceInfo device={device} />} />
			<Route exact path={`/device/:uuid/points/:pointUUID?`} render={() => <DevicePointsContainer device={device} />} />
			<Route exact path={`/device/:uuid/edit`} render={() => <DeviceEdit device={device} />} />
			<Route exact path={`/device/:uuid/new`} render={() => <DeviceEdit device={device} isNew={true} />} />
		</Switch>
	) : null;
};

export default DeviceTabs;
