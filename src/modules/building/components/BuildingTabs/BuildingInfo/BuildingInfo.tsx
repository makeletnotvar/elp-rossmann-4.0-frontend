import {
	AcUnitOutlined,
	BookmarkBorderOutlined,
	ClassOutlined,
	CodeOutlined,
	HomeOutlined,
	MapOutlined as MapIcon,
	MyLocationOutlined,
	PersonOutlineOutlined,
	PictureInPictureOutlined,
	QueryBuilderOutlined,
	SettingsOutlined,
	TerrainOutlined,
	ToysOutlined,
} from '@mui/icons-material';
import { dateWithoutTimeString } from 'helpers/date';
import Param2 from 'modules/common/components/Params/Param2';
import Params from 'modules/common/components/Params/Params';
import EngineerIcon from 'modules/common/icons/EngineerIcon';
import { useAuth } from 'modules/common/selectors/auth';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingInfo.module.scss';

interface BuildingInfoProps {
	building: Building;
}

const BuildingInfo: React.FC<BuildingInfoProps> = ({ building }) => {
	const { t } = useTranslation();
	const { user } = useAuth();

	const {
		uuid,
		city,
		province,
		address,
		lat,
		long,
		code,
		status,
		area,
		placeType,
		ventTechnical,
		ventBrand,
		bypass,
		fancoils,
		fancoilsCount = 0,
		curtains,
		curtainsCount = 0,
		heatSource,
		acBrand = '',
		acCount = 0,
		hpBrand = '',
		hpCount = 0,
		powerConnectionPower,
		powerConnectionType,
		deploymentDateTs,
		techDepartmentDateTs,
		additionals,
		installationCompany,
		serviceCompany,
		administrator,
	} = building;

	return (
		<>
			<div className={styles.container}>
				<Params title={'Identyfikacja i lokalizacja'} className={styles.params} hideCount>
					<Param2 testId='building-code-value' label={t(`project.code`)} value={code} icon={CodeOutlined} />
					<Param2 testId='building-status-value' label={t(`project.status`)} value={t(`project.status_values.${status}`)} icon={SettingsOutlined} />
					<Param2 testId='building-city-value' label={t(`project.city`)} value={city} icon={MyLocationOutlined} />
					<Param2 testId='building-address-value' label={t(`project.address`)} value={address} icon={MapIcon} />
					<Param2 testId='building-province-value' label={t(`project.province`)} value={province} icon={TerrainOutlined} />
				</Params>
				{(administrator || installationCompany || serviceCompany) && (
					<Params title='Obsługa' className={styles.params} hideCount>
						{installationCompany && (
							<Param2
								testId='building-installationCompany-value'
								label={t(`project.installationCompany`)}
								value={installationCompany.name}
								link={user?.type === 'DEV' || user?.type === 'ADMIN' ? `/companies/${installationCompany.uuid}/info` : undefined}
								icon={EngineerIcon}
							/>
						)}
						{serviceCompany && (
							<Param2
								testId='building-serviceCompany-value'
								label={t(`project.serviceCompany`)}
								value={serviceCompany.name}
								link={user?.type === 'DEV' || user?.type === 'ADMIN' ? `/companies/${serviceCompany.uuid}/info` : undefined}
								icon={EngineerIcon}
							/>
						)}
						{administrator && (
							<Param2
								testId='building-administrator-value'
								label={t(`project.administrator`)}
								value={administrator.name}
								link={user?.type === 'DEV' || user?.type === 'ADMIN' ? `/user/${administrator.uuid}/info` : undefined}
								icon={PersonOutlineOutlined}
							/>
						)}
					</Params>
				)}
				<Params title={t('buildings.building_info')} className={styles.params} hideCount>
					<Param2 testId='building-area-value' label={t(`project.area`)} value={(area || 0).toString()} icon={PictureInPictureOutlined} />
					<Param2 testId='building-placeType-value' label={t(`project.place_type`)} value={t(`project.type_values.${placeType}`)} icon={HomeOutlined} />
					<Param2
						testId='building-heatSource-value'
						label={t(`project.heatSource`)}
						value={t(`project.heat_source_values.${heatSource}`)}
						icon={PictureInPictureOutlined}
					/>
				</Params>
				<Params title={t('buildings.details')} className={styles.params} hideCount>
					<Param2
						testId='building-deploymentDateTs-value'
						label={t(`project.deploymentDateTs`)}
						value={dateWithoutTimeString(deploymentDateTs)}
						icon={QueryBuilderOutlined}
					/>
					<Param2
						testId='building-techDepartmentDateTs-value'
						label={t(`project.techDepartmentDateTs`)}
						value={techDepartmentDateTs && techDepartmentDateTs > 1 ? dateWithoutTimeString(techDepartmentDateTs) : '-'}
						icon={QueryBuilderOutlined}
					/>
				</Params>
				<Params title={'Dane pomocnicze'} className={styles.params} hideCount>
					<Param2 testId='building-additionals-value' label={t(`project.additionals`)} value={additionals} icon={SettingsOutlined} preLine longText />
				</Params>
				<Params title={t('buildings.building_devices')} className={styles.params} hideCount>
					<Param2
						testId='building-ventTechnical-value'
						pure
						label={t(`project.vent_technical`)}
						value={t(`project.vent_technical_values.${ventTechnical}`)}
						icon={ToysOutlined}
					/>
					<Param2 testId='building-ventBrand-value' pure label={t(`project.vent_brand`)} value={ventBrand} icon={ToysOutlined} />
					<Param2
						testId='building-bypass-value'
						pure
						label={t(`project.bypass`)}
						value={bypass ? t('general.yes') : t('general.no')}
						icon={PictureInPictureOutlined}
					/>
					<Params title={t('project.powerConnection')} className={styles.params} hideCount>
						<Param2
							testId='building-powerConnectionType-value'
							pure
							label={t(`project.powerConnectionType`)}
							value={t(`project.power_type_values.${powerConnectionType}`)}
							icon={ClassOutlined}
						/>
						<Param2
							testId='building-powerConnectionPower-value'
							pure
							label={t(`project.powerConnectionPower`)}
							value={(powerConnectionPower || 0) + ' kW'}
							icon={ClassOutlined}
						/>
					</Params>
					<Params title={t('project.fancoils')} className={styles.params} hideCount>
						<Param2 testId='building-fancoils-value' pure label={t(`project.fancoils`)} value={t(`project.fancoils_values.${fancoils}`)} icon={ClassOutlined} />
						<Param2 testId='building-fancoilsCount-value' pure label={t(`project.fancoilsCount`)} value={fancoilsCount} icon={ClassOutlined} />
					</Params>
					<Params title={t('project.curtains')} className={styles.params} hideCount>
						<Param2
							testId='building-curtains-value'
							pure
							label={t(`project.curtains`)}
							value={t(`project.curtains_values.${curtains}`)}
							icon={BookmarkBorderOutlined}
						/>
						<Param2
							testId='building-curtainsCount-value'
							pure
							label={t(`project.curtainsCount`)}
							value={curtainsCount || 'brak'}
							icon={BookmarkBorderOutlined}
						/>
					</Params>
					<Params title={t('project.ac')} className={styles.params} hideCount>
						<Param2 testId='building-acBrand-value' pure label={t(`project.acBrand`)} value={acBrand || 'brak'} icon={AcUnitOutlined} />
						<Param2 testId='building-acCount-value' pure label={t(`project.acCount`)} value={acCount || 'brak'} icon={AcUnitOutlined} />
					</Params>
					<Params title={t('project.hp')} className={styles.params} hideCount>
						<Param2 testId='building-hpBrand-value' pure label={t(`project.hpBrand`)} value={hpBrand || 'brak'} icon={AcUnitOutlined} />
						<Param2 testId='building-hpCount-value' pure label={t(`project.hpCount`)} value={hpCount || 'brak'} icon={AcUnitOutlined} />
					</Params>
				</Params>
			</div>
		</>
	);
};

export default BuildingInfo;
