import { NotificationsActiveOutlined } from '@mui/icons-material';
import { Badge, Button, Drawer, Fab, styled, useMediaQuery, useTheme } from '@mui/material';
import { API } from 'api/axios';
import eventsApi from 'api/endpoints/eventsAPI';
import cn from 'classnames';
import Loader from 'modules/common/components/Loaders/Loader';
import VirtualHMI from 'modules/common/components/VirtualHMI/VirtualHMI';
import { VirtualHMIData } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingVirtualHMI.module.scss';
import BuildingVirtualHMIAlarmsList from './BuildingVirtualHMIAlarmsList';

interface BuildingVirtualHMIViewProps {
	data: VirtualHMIData[];
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
	isConnecting: boolean;
	updatePath: (nextPath: string[]) => void;
	pathStrings: string[];
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	isError: boolean;
	isLoadingError: boolean;
	isLoadingData: boolean;
	setIsError: (error: boolean) => void;
	onClickConnectHMI: (deviceRef: BuildingDeviceReference) => Promise<void>;
}

const StyledBadge = styled(Badge)(() => ({
	'& .MuiBadge-badge': {
		top: '-20%',
		right: '-20%',
		width: '20px',
		height: '20px',
	},
}));

const BuildingVirtualHMIView: React.FC<BuildingVirtualHMIViewProps> = ({
	data,
	selectedDeviceRef,
	isConnecting,
	updatePath,
	pathStrings,
	isLoading,
	setIsLoading,
	isError,
	isLoadingError,
	isLoadingData,
	setIsError,
	onClickConnectHMI,
}) => {
	const [deviceEvents, setDeviceEvents] = useState<DeviceEvents[]>([]);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { t } = useTranslation();
	const theme = useTheme();
	const isMobileSize = useMediaQuery(theme.breakpoints.down('md'));

	useEffect(() => {
		if (data.length > 0 && selectedDeviceRef) {
			const request = async () => {
				const response = await API.get<{ deviceEvents: DeviceEvents[] }>(eventsApi.getDeviceEvents(selectedDeviceRef.uuid));
				if (response && response.data && response.data.deviceEvents) {
					setDeviceEvents(response.data.deviceEvents);
				}
			};
			request();
		}
	}, [selectedDeviceRef, data]);

	return (
		<div className={cn(styles.container, { [styles.isConnecting]: isConnecting })}>
			<div className={styles.content}>
				<div className={styles.contentLeft}>
					{isConnecting && !isError && !isLoadingData && !isLoadingError ? (
						<Loader label={t('vhmi.messages.connecting')} />
					) : !isConnecting && isError && !isLoadingData && !isLoadingError ? (
						<div className={styles.error}>
							<p style={{ whiteSpace: 'nowrap' }}>{t('vhmi.messages.no_response')}</p>
							<Button
								onClick={() => {
									setIsError(false);
									selectedDeviceRef && onClickConnectHMI(selectedDeviceRef);
								}}
								variant='contained'
								color='primary'
							>
								Spróbuj ponownie
							</Button>
						</div>
					) : (
						<>
							{isLoading ? (
								<Loader delay={500} label={t('vhmi.messages.loading')} />
							) : isLoadingData && !isConnecting && !isError && !isLoadingError ? (
								<Loader label={t('vhmi.messages.connecting')} />
							) : !isLoadingData && !isConnecting && !isError && isLoadingError ? (
								<Loader label={t('vhmi.messages.slow_response')} />
							) : null}
							<VirtualHMI
								data={data}
								updatePath={updatePath}
								pathStrings={pathStrings}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
								selectedDeviceRef={selectedDeviceRef}
							/>
						</>
					)}
				</div>
				{isMobileSize ? (
					data.length > 0 &&
					deviceEvents.length > 0 && (
						<>
							<Fab
								style={{ position: 'absolute', bottom: 25, right: 25, backgroundColor: '#f44336', color: '#fff' }}
								size='medium'
								onClick={() => setDrawerOpen(true)}
							>
								<StyledBadge overlap='rectangular' badgeContent={deviceEvents.length || 0} color='error' max={100}>
									<NotificationsActiveOutlined />
								</StyledBadge>
							</Fab>
							<Drawer style={{ height: '100%' }} anchor={'right'} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
								<BuildingVirtualHMIAlarmsList
									data={data}
									deviceEvents={deviceEvents}
									drawerOpen={drawerOpen}
									drawerClose={() => setDrawerOpen(false)}
									selectedDeviceRef={selectedDeviceRef}
								/>
							</Drawer>
						</>
					)
				) : (
					<BuildingVirtualHMIAlarmsList data={data} deviceEvents={deviceEvents} selectedDeviceRef={selectedDeviceRef} />
				)}
			</div>
		</div>
	);
};

export default BuildingVirtualHMIView;
