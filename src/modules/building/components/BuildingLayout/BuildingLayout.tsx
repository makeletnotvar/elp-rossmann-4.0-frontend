import { Tooltip, Typography } from '@mui/material';
import { HomeOutlined } from '@mui/icons-material';
import BuildingMenu, { BUILDING_NEW } from 'modules/building/components/BuildingLayout/BuildingMenu/BuildingMenu';
import BuildingStatus from 'modules/building/components/BuildingLayout/BuildingStatus';
import BuildingTabs from 'modules/building/components/BuildingTabs/BuildingTabs';
import { getBuildingConnection, getBuildingName } from 'modules/building/helpers/building';
import Content from 'modules/common/components/Layout/Content/Content';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './BuildingLayout.module.scss';

interface BuildingLayoutProps {
	building: Building | undefined;
}

const BuildingLayout: React.FC<BuildingLayoutProps> = ({ building }) => {
	const {
		match: {
			params: { tab },
		},
	} = useRouter<{ uuid: string; tab: string }>();
	const { t } = useTranslation();
	const buildingName = getBuildingName(building);
	const buildingConnection = getBuildingConnection(building);
	const titlePath = `general.${buildingConnection ? 'connectionOnline' : 'connectionOffline'}`;
	const title = t(titlePath);

	const label: string = tab === BUILDING_NEW ? t('buildings.new_building') : `${buildingName} - ${t('buildings.tabs.' + tab)}`;

	return (
		<>
			{building || tab === BUILDING_NEW ? (
				<div className={styles.container}>
					<TitleBar
						label={label}
						custom={
							<>
								<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
									<Tooltip title={title} enterDelay={100}>
										{buildingConnection ? (
											<div style={{ color: '#fff', backgroundColor: 'green', borderRadius: '50%', width: '8px', height: '8px' }} />
										) : (
											<div style={{ color: '#fff', backgroundColor: 'red', borderRadius: '50%', width: '8px', height: '8px' }} />
										)}
									</Tooltip>
									<div style={{ display: 'flex', gap: 3, flexFlow: 'row nowrap' }}>
										{tab === BUILDING_NEW ? (
											<Typography
												style={{
													fontWeight: 400,
													whiteSpace: 'nowrap',
													textOverflow: 'ellipsis',
													width: 'max-content',
													fontSize: '0.938rem',
													color: '#303030',
													lineHeight: 1,
												}}
											>
												{t('buildings.new_building')}
											</Typography>
										) : (
											<>
												<Typography
													style={{
														fontWeight: 400,
														whiteSpace: 'nowrap',
														textOverflow: 'ellipsis',
														width: 'max-content',
														fontSize: '0.938rem',
														color: '#303030',
														lineHeight: 1,
													}}
												>
													{building?.city}
												</Typography>
												<Typography
													style={{
														fontWeight: 600,
														whiteSpace: 'nowrap',
														textOverflow: 'ellipsis',
														width: 'max-content',
														fontSize: '0.938rem',
														color: '#303030',
														lineHeight: 1,
													}}
												>
													{building?.code}
												</Typography>
												<Typography
													style={{
														fontWeight: 400,
														whiteSpace: 'nowrap',
														textOverflow: 'ellipsis',
														width: 'max-content',
														fontSize: '0.938rem',
														color: '#303030',
														lineHeight: 1,
													}}
												>
													- {t('buildings.tabs.' + tab)}
												</Typography>
											</>
										)}
									</div>
								</div>
							</>
						}
						icon={HomeOutlined}
					>
						{tab !== BUILDING_NEW && <BuildingStatus />}
						<div id='building-title-bar-content'></div>
					</TitleBar>
					<Content className={styles.main}>
						<aside className={styles.menu}>
							<BuildingMenu />
						</aside>
						<section className={styles.content}>
							<BuildingTabs building={building} />
						</section>
					</Content>
				</div>
			) : null}
		</>
	);
};

export default BuildingLayout;
