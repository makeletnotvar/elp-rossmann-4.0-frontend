// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import ConsumptionContainer from './containers/ConsumptionContainer/ConsumptionContainer';
import { getConsumptionModule } from './redux';
// const styles = require("./ConsumptionApp.scss");

interface ConsumptionAppProps {}

/**
 *
 * Consumption App has two main pages to display:
 * - Building select page   - to select which building consumption data user wants to show (displayed if building is not specified)
 * - Consumption dashboard  - consumption data dashboard (displayed if building is specified and data is fetched)
 *
 */
const ConsumptionApp: React.FC<ConsumptionAppProps> = () => (
	<DynamicModuleLoader modules={[getConsumptionModule()]}>
		<Switch>
			<Route path='/consumption' exact component={ConsumptionContainer} />
			<Route path='/consumption/:uuid' exact component={ConsumptionContainer} />
		</Switch>
	</DynamicModuleLoader>
);

export default ConsumptionApp;
