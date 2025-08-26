// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import AlarmsConfigLayout from 'modules/alarmsConfig/components/AlarmsConfigLayout/AlarmsConfigLayout';
import * as React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import { getAlarmsConfigModule } from './redux/index';

const AlarmsConfigApp: React.FC = () => {
	return (
		<DynamicModuleLoader modules={[getAlarmsConfigModule()]}>
			<AlarmsConfigLayout />
		</DynamicModuleLoader>
	);
};

export default AlarmsConfigApp;
