import { CategoryOutlined, HomeOutlined, PhotoOutlined, TabletOutlined } from '@mui/icons-material';
import { IconButton, Tooltip, Typography } from '@mui/material';
import BuildingListAlarmsCellContainer from 'modules/buildings/components/BuildingsList/custom/BuildingListAlarmsCell/BuildingListAlarmsCellContainer';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import Loader from 'modules/common/components/Loaders/Loader';
import Params from 'modules/common/components/Params/Params';
import StaticValueParam2 from 'modules/common/components/Params/PointValueParam/StaticValueParam2';
import { useAuth } from 'modules/common/selectors/auth';
import { mapPinDataActions, useMapPinDataState } from 'modules/map/redux/mapPin';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import useRouter from 'use-react-router';
import styles from './MapHint.module.scss';

interface MapHintProps {
	pin: MapBuildingPin;
	popupKey: {
		openedUUID: string | null;
		popupKey: number;
	};
}

const MapHint: React.FC<MapHintProps> = ({ pin, popupKey }) => {
	const { pinDetails, fetching } = useMapPinDataState();
	const { t } = useTranslation();
	const { history } = useRouter();
	const dispatch = useDispatch();
	const { user } = useAuth();

	const { matchName, matchCode } = useMemo(() => {
		const codeRegex = /\[(\d+)\]/;
		const nameRegex = /\[\d+\]\s*(.*)/;
		const matchCode = pin.name.match(codeRegex);
		const matchName = pin.name.match(nameRegex);

		return {
			matchCode,
			matchName,
		};
	}, [pin]);

	useEffect(() => {
		if (pin.uuid && pin.uuid === popupKey.openedUUID) {
			dispatch(mapPinDataActions.getMapPinData.request(pin.uuid));
		}
	}, [pin.uuid, popupKey]);

	return (
		<div className={styles.hint}>
			{fetching ? (
				<div
					style={{
						width: '100%',
						height: '100%',
						minHeight: '172px',
						display: 'flex',
						justifyContent: 'center',
						flexDirection: 'column',
						alignItems: 'center',
						paddingTop: 20,
					}}
				>
					<Loader />
				</div>
			) : (
				<>
					<div style={{ display: 'flex', flexDirection: 'column', marginBottom: 12 }}>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '20px', width: 'calc(100% - 30px)' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<Tooltip title={t(`general.${pinDetails?.connection ? 'connectionOnline' : 'connectionOffline'}`).toUpperCase()} enterDelay={100}>
									{pinDetails?.connection ? (
										<div style={{ color: '#fff', backgroundColor: 'green', borderRadius: '50%', width: '8px', height: '8px' }} />
									) : (
										<div style={{ color: '#fff', backgroundColor: 'red', borderRadius: '50%', width: '8px', height: '8px' }} />
									)}
								</Tooltip>
								<div
									style={{ display: 'flex', gap: 3, flexFlow: 'row nowrap', cursor: 'pointer' }}
									onClick={() => history.push(`/building/${pinDetails?.uuid}/info`)}
								>
									<Typography
										style={{
											fontWeight: 400,
											whiteSpace: 'nowrap',
											textOverflow: 'ellipsis',
											width: 'max-content',
											fontSize: '0.938rem',
											color: '#303030',
										}}
									>
										{pinDetails?.city || (matchName && matchName[1]) || ''}
									</Typography>
									<Typography
										style={{
											fontWeight: 600,
											whiteSpace: 'nowrap',
											textOverflow: 'ellipsis',
											width: 'max-content',
											fontSize: '0.938rem',
											color: '#303030',
										}}
									>
										{pinDetails?.code || (matchCode && matchCode[1]) || ''}
									</Typography>
								</div>
							</div>
							<BuildingListAlarmsCellContainer
								value={pinDetails?.alarmsCount}
								row={{ uuid: pinDetails.uuid, alarmsMaxPriority: String(pinDetails.alarmsMaxPriority) }}
							/>
						</div>
						<Typography
							style={{
								fontWeight: 400,
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis',
								width: 'max-content',
								fontSize: '0.688rem',
								color: '#878787',
								lineHeight: 1,
							}}
						>
							{pinDetails?.address}
						</Typography>
					</div>
					<Params style={{ border: 'none' }} wrapperStyle={{ gap: 0, padding: 0 }} hideCount collapsable={false}>
						<StaticValueParam2
							icon='workmode'
							style={{ border: 'none' }}
							label={t(`project.workmode`)}
							value={pinDetails?.workmode ? `${pinDetails.workmode}` : '-'}
						/>
						<StaticValueParam2
							style={{ border: 'none' }}
							label={t(`project.tsetactual`)}
							icon='settings'
							custom={
								pinDetails?.tsetactual ? (
									<span style={{ display: 'flex', fontSize: '1rem', fontWeight: '500' }}>
										{pinDetails.tsetactual.toFixed(1)}
										<span style={{ fontSize: '0.688rem', color: '#878787', fontWeight: '400', paddingTop: 3 }}>°C</span>
									</span>
								) : (
									'-'
								)
							}
						/>
						<StaticValueParam2
							style={{ border: 'none' }}
							label={t(`project.tavr`)}
							icon='thermometer'
							custom={
								pinDetails?.tavr ? (
									<span style={{ display: 'flex', fontSize: '1rem', fontWeight: '500' }}>
										{pinDetails.tavr.toFixed(1)}
										<span style={{ fontSize: '0.688rem', color: '#878787', fontWeight: '400', paddingTop: 3 }}>°C</span>
									</span>
								) : (
									'-'
								)
							}
						/>
						{pinDetails.administrator && pinDetails.administrator.uuid ? (
							<StaticValueParam2
								icon='administration'
								style={{ border: 'none' }}
								label={t(`project.administrator`)}
								value={pinDetails.administrator.name}
								link={user?.type === 'DEV' || user?.type === 'ADMIN' ? `/user/${pinDetails.administrator.uuid}/info` : undefined}
							/>
						) : null}
						{pinDetails.installationCompany && pinDetails.installationCompany.uuid ? (
							<StaticValueParam2
								icon='installationCompany'
								style={{ border: 'none' }}
								label={t(`project.installationCompany`)}
								value={pinDetails.installationCompany.name}
								link={user?.type === 'DEV' || user?.type === 'ADMIN' ? `/companies/${pinDetails.installationCompany.uuid}/info` : undefined}
							/>
						) : null}
						{pinDetails.serviceCompany && pinDetails.serviceCompany.uuid ? (
							<StaticValueParam2
								icon='serviceCompany'
								style={{ border: 'none' }}
								label={t(`project.serviceCompany`)}
								value={pinDetails.serviceCompany.name}
								link={user?.type === 'DEV' || user?.type === 'ADMIN' ? `/companies/${pinDetails.serviceCompany.uuid}/info` : undefined}
							/>
						) : null}
					</Params>
					<div className={styles.actions}>
						<AuthDev>
							{pinDetails?.uuid ? (
								<Tooltip title={t('buildings.building_devices')}>
									<IconButton onClick={() => history.push(`/building/${pinDetails?.uuid}/units`)} size='small' color='inherit'>
										<CategoryOutlined />
									</IconButton>
								</Tooltip>
							) : null}
						</AuthDev>
						{pinDetails?.uuid ? (
							<Tooltip title={t('buildings.building_views')}>
								<IconButton onClick={() => history.push(`/building/${pinDetails?.uuid}/views`)} size='small' color='inherit'>
									<PhotoOutlined />
								</IconButton>
							</Tooltip>
						) : null}
						{pinDetails?.uuid && pinDetails?.permissions && pinDetails?.permissions === 2 ? (
							<Tooltip title={t('buildings.building_vhmi')}>
								<IconButton onClick={() => history.push(`/building/${pinDetails?.uuid}/vhmi`)} size='small' color='inherit'>
									<TabletOutlined />
								</IconButton>
							</Tooltip>
						) : null}
						{pinDetails?.uuid ? (
							<Tooltip title={t('Drogeria')}>
								<IconButton onClick={() => history.push(`/building/${pinDetails?.uuid}/info`)} size='small' color='inherit'>
									<HomeOutlined />
								</IconButton>
							</Tooltip>
						) : null}
					</div>
				</>
			)}
		</div>
	);
};

export default MapHint;
