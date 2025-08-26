import BuildingData from 'modules/building/components/BuildingTabs/BuildingData/BuildingData';
import BuildingEdit from 'modules/building/components/BuildingTabs/BuildingEdit/BuildingEdit';
import BuildingInfo from 'modules/building/components/BuildingTabs/BuildingInfo/BuildingInfo';
import BuildingPoints from 'modules/building/components/BuildingTabs/BuildingPoints/BuildingPoints';
import BuildingViews from 'modules/building/components/BuildingTabs/BuildingViews/BuildingViews';
import BuildingVirtualHMI from 'modules/building/components/BuildingTabs/BuildingVirtualHMI/BuildingVirtualHMI';
import { AuthDevOrAdmin } from 'modules/common/components/Auth/Auth';
import EventsV2BuildingTabs from 'modules/events_v2/components/EventsV2Tabs/EventsV2BuildingTabs';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import BuildingUnits from './BuildingUnits/BuildingUnits';
import BuildingViewContainer from './BuildingView/BuildingViewContainer';

interface BuildingTabsProps {
	building: Building | undefined;
}

export const initialBuilding: Building = {
	uuid: '',
	code: '',
	description: '',
	address: '',
	province: '',
	lat: 0,
	long: 0,
	area: 0,
	status: 'NOT_READY',
	tags: [],

	bypass: false,
	ventTechnical: '',
	fancoils: '',

	deploymentDateTs: null,
	techDepartmentDateTs: null,
	additionals: null,
};

const BuildingTabs: React.FC<BuildingTabsProps> = ({ building }) => {
	return building ? (
		<Switch>
			<Route exact path={`/building/:uuid/info`} render={() => <BuildingInfo building={building} />} />
			<Route exact path={`/building/:uuid/data`} render={() => <BuildingData building={building} />} />
			<Route exact path={`/building/:uuid/view/:param`} render={() => <BuildingViewContainer building={building} />} />
			<Route exact path={`/building/:uuid/views`} render={() => <BuildingViews building={building} />} />
			<Route
				exact
				path={`/building/:uuid/edit`}
				render={() => (
					<AuthDevOrAdmin>
						<BuildingEdit building={building} />
					</AuthDevOrAdmin>
				)}
			/>
			<Route exact path={`/building/:uuid/units/:xid?/:action?`} render={() => <BuildingUnits building={building} />} />
			<Route exact path={`/building/:uuid/points`} render={() => <BuildingPoints building={building} />} />
			<Route
				exact
				path={`/building/:uuid/vhmi/:deviceUUID?`}
				render={() =>
					building.permissions && building.permissions === 2 ? <BuildingVirtualHMI building={building} /> : <Redirect to={`/building/${building?.uuid}/info`} />
				}
			/>
			<Route exact path={`/building/:uuid/events-v2/:tab?/:uuid?/:confirm?`} render={() => <EventsV2BuildingTabs building={building} />} />
			<Route exact path='/building/:uuid/*' render={() => <Redirect to={`/building/${building?.uuid}/info`} />} />
			<Route exact path='/building/:uuid' render={() => <Redirect to={`/building/${building?.uuid}/info`} />} />
		</Switch>
	) : (
		<Switch>
			<Route exact path={`/building/add/new`} render={() => <BuildingEdit building={initialBuilding} isNew={true} />} />
		</Switch>
	);
};

export default BuildingTabs;
