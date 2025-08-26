import { HomeOutlined, MoreHorizOutlined, RefreshOutlined, SettingsRemoteOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { API } from 'api/axios';
import { dateString } from 'helpers/date';
import BuildingListCommunicationCell from 'modules/buildings/components/BuildingsList/custom/BuildingListCommunicationCell';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import Content from 'modules/common/components/Layout/Content/Content';
import SuperTable, { SuperTableDataColumns, SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import VirtualHMIDialog from 'modules/common/components/VirtualHMI/VirtualHMIDialog';
import VirtualHMIDialogButton from 'modules/common/components/VirtualHMI/VirtualHMIDialogButton';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useRouter from 'use-react-router';
import styles from './DevicesList.module.scss';

interface DevicesListProps {
	devices: DetailedDevice[];
	settings: Partial<SuperTableDisplaySettings>;
	onChangeSettings: (settings: Partial<SuperTableDisplaySettings>) => void;
	fetching: boolean;
	count: number;
	countAll: number;
}

const columns: SuperTableDataColumns<DetailedDevice> = {
	name: {
		label: 'devices.params.name',
		custom: ({ value, row }) => <Link to={`/device/${row.uuid}/info`}>{value}</Link>,
	},
	code: {
		label: 'devices.params.code',
	},
	model: {
		label: 'devices.params.model',
	},
	softinfo: {
		label: 'devices.params.softinfo',
	},
	firmware: {
		label: 'devices.params.firmware',
	},
	remoteIpAddress: {
		label: 'IP',
		custom: ({ value }) => <>{value}</>,
	},
	active: {
		label: 'devices.params.active',
		custom: ({ value }) => <>{value ? 'Aktywny' : 'Nieaktywny'}</>,
	},
	connection: {
		label: 'devices.params.connection',
		custom: BuildingListCommunicationCell,
	},
	lastSync: {
		label: 'devices.params.lastSync',
		custom: ({ value }) => <>{dateString(value)}</>,
	},
};

const DevicesList: React.FC<DevicesListProps> = ({ devices, settings, onChangeSettings, fetching, count, countAll }) => {
	const [selectedDeviceRef, setSelectedDeviceRef] = useState<(BuildingDeviceReference & { deviceCode?: string }) | null>(null);
	const [isConnecting, setIsConnecting] = useState<boolean>(false);
	const [isOpenVHMIDialog, setIsOpenVHMIDialog] = useState<boolean>(false);
	const { t } = useTranslation();
	const { query, rowsPerPage, sortingParam, sortingDir, offset } = settings;

	return (
		<div className={styles.container}>
			<Content>
				<SuperTable
					data={devices}
					columns={columns}
					onUpdateSettings={onChangeSettings}
					translator={t}
					sortable={true}
					rowActions={rowData => (
						<DeviceRowActions
							rowData={rowData}
							setIsConnecting={setIsConnecting}
							setIsOpenVHMIDialog={setIsOpenVHMIDialog}
							setSelectedDeviceRef={setSelectedDeviceRef}
						/>
					)}
					noResults={(query || '').length > 0 && (devices || []).length === 0}
					fetching={fetching}
					rowClassName={rowData => (!rowData.active ? styles.inactive : '')}
					count={countAll}
					{...{
						query,
						rowsPerPage,
						sortingParam,
						sortingDir,
						offset,
					}}
				/>
			</Content>
			<VirtualHMIDialog
				isConnecting={isConnecting}
				isOpenVHMIDialog={isOpenVHMIDialog}
				setIsConnecting={setIsConnecting}
				setIsOpenVHMIDialog={setIsOpenVHMIDialog}
				selectedDeviceRef={selectedDeviceRef}
			/>
		</div>
	);
};

interface DeviceRowActionsProps {
	rowData: any;
	setIsConnecting: any;
	setIsOpenVHMIDialog: any;
	setSelectedDeviceRef: any;
}

const DeviceRowActions: React.FC<DeviceRowActionsProps> = ({ rowData, setIsConnecting, setIsOpenVHMIDialog, setSelectedDeviceRef }) => {
	const { history } = useRouter();
	const { t } = useTranslation();

	const clickHandler = useCallback(() => {
		history.push(`/device/${rowData.uuid}/info`);
	}, []);

	const onClickBuilding = useCallback(() => {
		history.push(`/building/${rowData?.building?.uuid}/info`);
	}, []);

	return (
		<>
			<AuthDev>
				<VirtualHMIDialogButton
					device={rowData}
					setIsConnecting={setIsConnecting}
					setIsOpenVHMIDialog={setIsOpenVHMIDialog}
					setSelectedDeviceRef={setSelectedDeviceRef}
				/>
			</AuthDev>
			<AuthDev>
				<Tooltip title={t('Przekierowanie IP')} placement='bottom'>
					<span>
						<IconButton size='small' href={`http://${rowData.remoteIpAddress}`} disabled={!rowData.remoteIpAddress} target='_blank'>
							<SettingsRemoteOutlined fontSize='inherit' />
						</IconButton>
					</span>
				</Tooltip>
			</AuthDev>
			<Tooltip title={'Budynek'} placement='bottom'>
				<span>
					<IconButton size='small' onClick={() => onClickBuilding()}>
						<HomeOutlined fontSize='inherit' />
					</IconButton>
				</span>
			</Tooltip>
			<Tooltip title={'Reload device data'} placement='bottom'>
				<span>
					<IconButton size='small' onClick={() => API.post(`/device/${rowData.uuid}/reload`)}>
						<RefreshOutlined fontSize='inherit' />
					</IconButton>
				</span>
			</Tooltip>
			<Tooltip title={t('general.details')} placement='bottom'>
				<span>
					<IconButton data-testid={`device-more-button-${rowData.uuid}`} size='small' onClick={clickHandler}>
						<MoreHorizOutlined fontSize='inherit' />
					</IconButton>
				</span>
			</Tooltip>
		</>
	);
};

export default DevicesList;
