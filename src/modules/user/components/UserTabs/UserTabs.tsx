import UserEditContainer from 'modules/user/components/UserTabs/UserEdit/UserEditContainer';
import UserInfoContainer from 'modules/user/components/UserTabs/UserInfo/UserInfoContainer';
import UserPasswordContainer from 'modules/user/components/UserTabs/UserPassword/UserPasswordContainer';
import UserPermissionsContainer from 'modules/user/components/UserTabs/UserPermissions/UserPermissionsContainer';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

interface UsersTabsProps {
	user: User;
}

const UsersTabs: React.FC<UsersTabsProps> = ({ user }) => {
	return (
		<Switch>
			<Redirect exact from='/user/:uuid' to='/user/:uuid/info' />
			<Route exact path='/user/:uuid/info' render={() => <UserInfoContainer user={user} />} />
			<Route exact path='/user/:uuid/edit' component={UserEditContainer} />
			<Route exact path='/user/add/new' render={() => <UserEditContainer isNew />} />
			<Route exact path='/user/:uuid/password' component={UserPasswordContainer} />
			<Route exact path='/user/:userUUID/permissions' component={UserPermissionsContainer} />
		</Switch>
	);
};

export default UsersTabs;
