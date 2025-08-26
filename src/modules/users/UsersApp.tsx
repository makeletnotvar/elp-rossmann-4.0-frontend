// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import UsersLayout from 'modules/users/components/UsersLayout/UsersLayout';
import { getUsersModule } from 'modules/users/redux';
import * as React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules';

interface UsersAppProps {}

const UsersApp: React.FC<UsersAppProps> = () => {
	return (
		<DynamicModuleLoader modules={[getUsersModule()]}>
			<UsersLayout />
		</DynamicModuleLoader>
	);
};

export default UsersApp;
