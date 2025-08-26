import { dateString } from 'helpers/date';
import UserInfo from 'modules/user/components/UserTabs/UserInfo/UserInfo';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export interface UserInfoContainerProps {
	user: User;
}

const UserInfoContainer: React.FC<UserInfoContainerProps> = ({ user }) => {
	const { t } = useTranslation();
	const loginDateString = dateString(user.lastLoginTs);
	const addDateString = dateString(user.addTs);
	const editDateString = dateString(user.editTs);

	const activeString = user.active ? t('general.yes') : t('general.no');

	return (
		<UserInfo
			username={user.label || null}
			mail={user.username}
			active={activeString}
			type={user.type || '????'}
			lastLoginDate={loginDateString}
			addDate={addDateString}
			editDate={editDateString}
			uuid={user.uuid}
			company={user.company}
		/>
	);
};

export default UserInfoContainer;
