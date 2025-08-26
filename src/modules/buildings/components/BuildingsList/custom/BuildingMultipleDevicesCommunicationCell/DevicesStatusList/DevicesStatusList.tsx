import { MoreHorizOutlined, VpnLockOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import BuildingListCommunicationCell from 'modules/buildings/components/BuildingsList/custom/BuildingListCommunicationCell';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import SuperTable, { SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import DateCell from 'modules/common/components/Tables/DateCell';
import React from 'react';
import useRouter from 'use-react-router';

interface DevicesStatusListProps {
	devices: BuildingDeviceStatus[];
	building: Building;
	onClose: () => void;
}

const DEVICES_STATUS: SuperTableDataColumns = {
	name: {
		label: 'Urządzenie',
		custom: ({ value, row }) => (
			<>
				<a href={row.url} style={{ color: '#333' }}>
					{value}
				</a>
			</>
		),
	},
	connection: {
		label: 'Status',
		custom: BuildingListCommunicationCell,
		align: 'center',
	},
	lastSync: {
		label: 'Synchronizacja',
		custom: DateCell,
		align: 'right',
	},
};

const DevicesStatusList: React.FC<DevicesStatusListProps> = ({ devices, building, onClose }) => {
	return (
		<SuperTable
			columns={DEVICES_STATUS}
			data={devices}
			pagination={false}
			hidePagination
			rowActions={row => <DeviceStatusActions status={row} building={building} onClose={onClose} />}
		/>
	);
};

const DeviceStatusActions: React.FC<{
	status: BuildingDeviceStatus;
	building: Building;
	onClose: () => void;
}> = ({ status, building, onClose }) => {
	const { history } = useRouter();

	const moreHandler = React.useCallback(() => {
		history.push(`/device/${status.uuid}/info`);
	}, []);

	const virtualHMIHandleClick = () => {
		history.push(`/building/${building.uuid}/vhmi/${status.uuid}`);
		onClose();
	};

	return (
		<>
			<Tooltip title={`Virtual HMI`} placement='bottom'>
				<span>
					<IconButton style={{ opacity: status.connection ? 1 : 0.33 }} size='small' onClick={virtualHMIHandleClick} disabled={!status.connection}>
						<VpnLockOutlined fontSize='inherit' />
					</IconButton>
				</span>
			</Tooltip>
			<AuthDev>
				<span>
					<IconButton size='small' onClick={moreHandler}>
						<MoreHorizOutlined fontSize='inherit' />
					</IconButton>
				</span>
			</AuthDev>
		</>
	);
};

export default DevicesStatusList;
