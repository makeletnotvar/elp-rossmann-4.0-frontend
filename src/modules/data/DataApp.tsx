// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import DataLayout from 'modules/data/components/DataLayout/DataLayout';
import { getDataModule } from 'modules/data/redux';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { DynamicModuleLoader } from 'redux-dynamic-modules';

const DataApp: React.FC = () => (
	<DynamicModuleLoader modules={[getDataModule()]}>
		<Switch>
			<Route path='/data' exact component={DataLayout} />
		</Switch>
	</DynamicModuleLoader>
);

export default DataApp;
