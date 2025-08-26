import { Add, Check, Edit, Mail } from '@mui/icons-material';
import { Chip, Typography } from '@mui/material';
import { API } from 'api/axios';
import buildingsAPI from 'api/endpoints/buildingsAPI';
import Param from 'modules/common/components/Params/Param';
import Params from 'modules/common/components/Params/Params';
import EngineerIcon from 'modules/common/icons/EngineerIcon';
import { useAuth } from 'modules/common/selectors/auth';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './UserInfo.module.scss';

interface UserInfoProps {
	username: string | null;
	mail: string;
	type: string;
	active: string;
	lastLoginDate: string;
	addDate: string;
	editDate: string;
	uuid: string;
	company: {
		uuid: string;
		name: string;
	};
}

const UserInfo: React.FC<UserInfoProps> = ({ uuid, username, mail, type, active, lastLoginDate, addDate, editDate, company }) => {
	const [buildingsRelations, setBuildingsRelations] = useState<{ uuid: string; name: string }[]>([]);
	const { user } = useAuth();

	const { t } = useTranslation();
	const { history } = useRouter();

	useEffect(() => {
		const getBuildingsByAdmin = async () => {
			try {
				const response = await API.get<{ buildings: { uuid: string; name: string }[] }>(buildingsAPI.getBuildingsByAdmin(uuid));
				setBuildingsRelations(response.data.buildings);
			} catch (err) {
				setBuildingsRelations([]);
			}
		};
		getBuildingsByAdmin();
	}, [uuid]);

	return (
		<div className={styles.container}>
			<Params>
				{username && <Param testId='user-label-value' label={t('users.username')} value={username} />}
				<Param
					testId='user-username-value'
					label={t('users.mail')}
					className={styles.paramUsername}
					classNameValue={styles.paramUsernameValue}
					value={mail}
					icon={Mail}
				/>
			</Params>
			<Params>
				<Param testId='user-type-value' label={t('users.type')} value={type} />
				<Param testId='user-active-value' label={t('users.active')} icon={Check} value={active} />
			</Params>
			{company && (
				<Params>
					<Param
						testId='user-company-value'
						label={t(`project.company`)}
						value={company.name}
						disableLink={user?.type !== 'DEV' && user?.type !== 'ADMIN'}
						link={`/companies/${company.uuid}/info`}
						icon={EngineerIcon}
					/>
				</Params>
			)}
			<Params>
				<Param testId='user-lastLogin-value' label={t('users.lastLogin')} value={lastLoginDate} />
				<Param testId='user-addTime-value' label={t('users.addTime')} icon={Add} value={addDate} />
				<Param testId='user-editTime-value' label={t('users.editTime')} icon={Edit} value={editDate} />
			</Params>
			{(buildingsRelations || []).length > 0 && (
				<div className={styles.relationsContainer}>
					<div className={styles.relationsHeader}>
						<Typography className={styles.relationsHeaderTitle}>{t('project.buildingsAdministrator')}</Typography>
					</div>
					<div className={styles.relations}>
						{(buildingsRelations || []).map(user => (
							<Chip
								size='small'
								key={user.uuid}
								label={user.name}
								onClick={() => history.push(`/building/${user.uuid}/info`)}
								className={styles.chip}
								style={{ backgroundColor: 'rgba(238, 238, 238, 0.86)' }}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default UserInfo;
