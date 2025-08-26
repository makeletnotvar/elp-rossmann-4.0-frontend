// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import SettingsLayout from 'modules/settings/components/SettingsLayout/SettingsLayout';
import * as React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules-react';
interface SettingsAppProps {}

const SettingsApp: React.FC<SettingsAppProps> = () => {
	return (
		<DynamicModuleLoader modules={[]}>
			<SettingsLayout />
		</DynamicModuleLoader>
	);
};

export default SettingsApp;
