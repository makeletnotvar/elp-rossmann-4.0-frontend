import { ClearOutlined, DoneOutlined } from '@mui/icons-material';
import { Tooltip, Typography, Zoom } from '@mui/material';
import cn from 'classnames';
import { getBuildingName } from 'modules/building/helpers/building';
import BuildingMultipleDevicesCommunicationDialog from 'modules/buildings/components/BuildingsList/custom/BuildingMultipleDevicesCommunicationCell/BuildingMultipleDevicesCommunicationDialog';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React, { useState } from 'react';
import styles from './BuildingMultipleDevicesCommunicationCell.module.scss';

const BuildingMultipleDevicesCommunicationCell: React.FC<SuperTableCustomCellProps> = ({ row }) => {
	const building = row as Building;
	const [openDetails, setOpenDetails] = useState<boolean>(false);
	const isVirtualHmiActive = Boolean(building && building.permissions! > 1);
	const connectedDevices = (building?.devices || []).length;
	const connectedDevicesOnline = building?.devices?.filter(device => device.connection === true).length;
	const areAllDevicesOnline = connectedDevices > 0 && connectedDevices === connectedDevicesOnline;

	return (
		<>
			<Zoom in={true} timeout={100}>
				<Tooltip title={isVirtualHmiActive ? 'Kliknij aby zobaczyć szczegóły' : ''} enterDelay={100}>
					<div style={{ display: 'flex', gap: '10px' }}>
						<div
							className={cn(styles.communication, {
								[styles.fail]: areAllDevicesOnline === false,
								[styles.hidden]: isVirtualHmiActive === false,
							})}
							onClick={() => setOpenDetails(true)}
						>
							{areAllDevicesOnline ? <DoneOutlined /> : <ClearOutlined />}
						</div>
						<Typography variant='body2'>
							{connectedDevicesOnline}/{connectedDevices}
						</Typography>
					</div>
				</Tooltip>
			</Zoom>
			{isVirtualHmiActive && (
				<BuildingMultipleDevicesCommunicationDialog
					title={`Urządzenia dla ${getBuildingName(building)}`}
					devices={building.devices || []}
					building={building}
					open={openDetails}
					onClose={() => setOpenDetails(false)}
				/>
			)}
		</>
	);
};

export default BuildingMultipleDevicesCommunicationCell;
