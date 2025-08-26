// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import BuildingsListContainer from 'modules/buildings/components/BuildingsList/BuildingsListContainer';
import { getDefaultBuildingsPath } from 'modules/buildings/helpers/buildings';
import { getBuildingsModule } from 'modules/buildings/redux';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { DynamicModuleLoader } from 'redux-dynamic-modules';

/***
 * BUILDINGS
 *
 *
 * Main core of module is a table with buildings.
 * Buildings are loading from server depends on pagination/filtering/searching params.
 * Responsed buildings has a static prop which represents uuid, then it's handle like a typical point value by poll service.
 * All async columns and values are collected and requested in poll service when table is mounting.
 * In current implementation all async points is requested in background, even those from hidden columns.
 *
 *
 */

const BuildingsApp: React.FC = () => {
	return (
		<DynamicModuleLoader modules={[getBuildingsModule()]}>
			<Switch>
				<Redirect from='/buildings' exact to={`/${getDefaultBuildingsPath()}`} />
				<Route path='/buildings/list' exact render={() => <BuildingsListContainer />} />
			</Switch>
		</DynamicModuleLoader>
	);
};

export default BuildingsApp;
