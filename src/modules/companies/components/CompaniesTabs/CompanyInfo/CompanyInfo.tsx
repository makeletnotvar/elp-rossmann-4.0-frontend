import { Chip, Typography } from '@mui/material';
import Param from 'modules/common/components/Params/Param';
import Params from 'modules/common/components/Params/Params';
import EngineerIcon from 'modules/common/icons/EngineerIcon';
import { useAuth } from 'modules/common/selectors/auth';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './CompanyInfo.module.scss';

interface CompanyInfoProps {
	company: CompanyWithDetails;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ company }) => {
	const { user: userAuth } = useAuth();
	const [usersRelations, setUsersRelations] = useState<{ uuid: string; name: string }[]>([]);
	const [buildingsAsServiceRelations, setBuildingsAsServiceRelations] = useState<{ uuid: string; name: string }[]>([]);
	const [buildingsAsInstallationRelations, setBuildingsAsInstallationRelations] = useState<{ uuid: string; name: string }[]>([]);

	const { t } = useTranslation();
	const { history } = useRouter();

	useEffect(() => {
		setUsersRelations(company?.users || []);
		setBuildingsAsServiceRelations(company?.buildingsAsService || []);
		setBuildingsAsInstallationRelations(company?.buildingsAsInstallation || []);
	}, [company]);

	return (
		<div className={styles.container}>
			<Params hideCount collapsable={false}>
				<Param label={t('companies.params.name')} testId='company-name-value' value={company.name} icon={EngineerIcon} />
			</Params>
			<div className={styles.relationsContainer}>
				<div className={styles.relationsHeader}>
					<Typography className={styles.relationsHeaderTitle}>Użytkownicy</Typography>
				</div>
				<div className={styles.relations}>
					{(usersRelations || []).length > 0 ? (
						(usersRelations || []).map(user => (
							<Chip
								size='small'
								key={user.uuid}
								disabled={userAuth?.type !== 'ADMIN' && userAuth?.type !== 'DEV'}
								label={user.name}
								onClick={() => history.push(`/user/${user.uuid}/info`)}
								className={styles.chip}
								style={{ backgroundColor: 'rgba(238, 238, 238, 0.86)' }}
							/>
						))
					) : (
						<span className={styles.empty}>Brak przypisanych użytkowników</span>
					)}
				</div>
			</div>
			<div className={styles.relationsContainer}>
				<div className={styles.relationsHeader}>
					<Typography className={styles.relationsHeaderTitle}>Instalacje</Typography>
				</div>
				<div className={styles.relations}>
					{(buildingsAsInstallationRelations || []).length > 0 ? (
						(buildingsAsInstallationRelations || []).map(building => (
							<Chip
								size='small'
								key={building.uuid}
								label={building.name}
								onClick={() => history.push(`/building/${building.uuid}/info`)}
								className={styles.chip}
								style={{ backgroundColor: 'rgba(238, 238, 238, 0.86)' }}
							/>
						))
					) : (
						<span className={styles.empty}>Brak przypisanych budynków</span>
					)}
				</div>
			</div>
			<div className={styles.relationsContainer}>
				<div className={styles.relationsHeader}>
					<Typography className={styles.relationsHeaderTitle}>Serwisy</Typography>
				</div>
				<div className={styles.relations}>
					{(buildingsAsServiceRelations || []).length > 0 ? (
						(buildingsAsServiceRelations || []).map(building => (
							<Chip
								size='small'
								key={building.uuid}
								label={building.name}
								onClick={() => history.push(`/building/${building.uuid}/info`)}
								className={styles.chip}
								style={{ backgroundColor: 'rgba(238, 238, 238, 0.86)' }}
							/>
						))
					) : (
						<span className={styles.empty}>Brak przypisanych budynków</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default CompanyInfo;
