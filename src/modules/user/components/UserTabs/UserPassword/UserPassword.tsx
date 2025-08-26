import UserPasswordFormContainer from 'modules/user/components/UserTabs/UserPassword/UserPasswordForm/UserPasswordFormContainer';
import * as React from 'react';

interface UserPasswordProps {}

const UserPassword: React.FC<UserPasswordProps> = () => {
	return (
		<div className='container'>
			<UserPasswordFormContainer />
		</div>
	);
};

export default UserPassword;
