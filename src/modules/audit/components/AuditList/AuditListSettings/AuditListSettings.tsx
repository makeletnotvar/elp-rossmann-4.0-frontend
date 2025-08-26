import { ExpandMoreOutlined } from '@mui/icons-material';
import { AppBar, Chip, Fab } from '@mui/material';
import cn from 'classnames';
import { AuditListRoutingPagitnationProps } from 'modules/audit/components/AuditList/AuditListHook';
import { sortDataByKeys } from 'modules/audit/helpers/data';
import { useGetBuildingSettablePoints, useGetBuildingsList, useGetUsersList } from 'modules/audit/hooks/useGetAuditsFiltersData';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AuditListSettings.module.scss';
import AuditListSettingsForm from './AuditListSettingsForm/AuditsListSettingsForm';

interface AuditListSettingsProps {
	openFilters: boolean;
	setOpenFilters: React.Dispatch<React.SetStateAction<boolean>>;
	values: AuditListRoutingPagitnationProps;
	updateSettingsDataHandler: (nextValues: AuditListRoutingPagitnationProps) => void;
}

const AuditListSettings: React.FC<AuditListSettingsProps> = ({ values: currentValues, updateSettingsDataHandler, openFilters, setOpenFilters }) => {
	const { t } = useTranslation();
	const { dataBuildings } = useGetBuildingsList();
	const { dataUsers } = useGetUsersList();
	const { dataPoints } = useGetBuildingSettablePoints(currentValues);

	const [isActiveFields, setIsActiveFields] = useState({
		type: Boolean(currentValues.type) || false,
		fromTs: true,
		toTs: Boolean(currentValues.toTs) || false,
		building: Boolean(currentValues.building) || false,
		user: Boolean(currentValues.user) || false,
		point: Boolean(currentValues.point) || false,
	});

	useEffect(() => {
		setIsActiveFields({
			type: Boolean(currentValues.type) || false,
			fromTs: true,
			toTs: Boolean(currentValues.toTs) || false,
			building: Boolean(currentValues.building) || false,
			user: Boolean(currentValues.user) || false,
			point: Boolean(currentValues.point) || false,
		});
	}, [currentValues.type, currentValues.toTs, currentValues.building, currentValues.user, currentValues.point]);

	const DATE_FORMAT = 'DD-MM-YYYY';
	const activeFiltersLength = Object.entries(currentValues).filter(([, currentValue]) => currentValue !== undefined || currentValue !== null).length;

	return (
		<AppBar className={cn(styles.appBar, { [styles.openAppBar]: openFilters })} position='static' elevation={0}>
			{!openFilters && (
				<div className={styles.activeFiltersContainer}>
					<div style={{ display: 'flex', gap: '10px' }}>
						<span style={{ display: 'flex', alignItems: 'center', color: '#000', fontSize: '14px' }}>Filtry ({activeFiltersLength})</span>
						<div className={styles.activeFilters}>
							{Object.entries(sortDataByKeys(currentValues)).map(([key, value]) => {
								const formattedValue =
									key === 'fromTs' || key === 'toTs'
										? moment(Number(value)).format(DATE_FORMAT)
										: key === 'type'
										? t(`audit.types.${value}`)
										: key === 'user'
										? dataUsers.length > 0
											? dataUsers.filter(user => user.uuid === value)[0].name
											: null
										: key === 'building'
										? dataBuildings.length > 0
											? dataBuildings.filter(building => building.uuid === value)[0].name
											: null
										: key === 'point'
										? dataPoints.length > 0
											? dataPoints.filter(building => building.uuid === value)[0].name
											: null
										: value;
								return formattedValue ? (
									<Chip
										disabled={key === 'fromTs'}
										className={styles.chip}
										style={{ backgroundColor: 'rgba(238, 238, 238, 0.86)' }}
										key={key}
										size='small'
										label={
											<>
												<span>{t(`audit.${key}`)}:</span> {formattedValue}
											</>
										}
										onDelete={() => {
											if (key === 'type') {
												updateSettingsDataHandler({ ...currentValues, building: null as any, point: null as any, [key]: null as any });
											} else if (key === 'building') {
												updateSettingsDataHandler({ ...currentValues, point: null as any, [key]: null as any });
											} else {
												updateSettingsDataHandler({ ...currentValues, [key]: null });
											}
										}}
									/>
								) : null;
							})}
						</div>
					</div>
					<Fab color='primary' size='small' className={styles.addIconFab} onClick={() => setOpenFilters(true)}>
						<ExpandMoreOutlined />
					</Fab>
				</div>
			)}
			{openFilters && (
				<AuditListSettingsForm
					openFilters={openFilters}
					setOpenFilters={setOpenFilters}
					currentValues={currentValues}
					dataBuildings={dataBuildings}
					dataUsers={dataUsers}
					dataPoints={dataPoints}
					isActiveFields={isActiveFields}
					setIsActiveFields={setIsActiveFields}
					updateSettingsDataHandler={updateSettingsDataHandler}
				/>
			)}
		</AppBar>
	);
};

export default AuditListSettings;
