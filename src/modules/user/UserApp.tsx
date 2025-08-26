// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import UserLayoutContainer from 'modules/user/components/UserLayout/UserLayoutContainer';
import { getUserModule } from 'modules/user/redux';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { DynamicModuleLoader } from 'redux-dynamic-modules';

interface UserAppProps {}

const UserApp: React.FC<UserAppProps> = () => {
	return (
		<DynamicModuleLoader modules={[getUserModule()]}>
			<Switch>
				<Route path='/user/:userUUID/:tab?' component={UserLayoutContainer} />
			</Switch>
		</DynamicModuleLoader>
	);
};

export default UserApp;
