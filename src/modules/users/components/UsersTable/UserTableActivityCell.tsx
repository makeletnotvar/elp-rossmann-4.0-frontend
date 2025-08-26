import * as React from 'react';
import { useTranslation } from 'react-i18next';

const UserTableActivityCell: React.FC<any> = ({ value }) => {
	const { t } = useTranslation();
	return <span>{value ? t('users.active') : t('users.inactive')}</span>;
};

export default UserTableActivityCell;
