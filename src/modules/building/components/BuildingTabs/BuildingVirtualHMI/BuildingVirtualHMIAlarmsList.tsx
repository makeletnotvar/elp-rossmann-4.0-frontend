import { IconButton } from '@mui/material';
import { CloseOutlined, ReportProblemOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { VirtualHMIData } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import React from 'react';
import styles from './BuildingVirtualHMI.module.scss';
import BuildingVirtualHMIAlarmsListItem from './BuildingVirtualHMIAlarmsListItem';

interface BuildingVirtualHMIAlarmsListProps {
	data: VirtualHMIData[];
	deviceEvents: DeviceEvents[];
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
	drawerOpen?: boolean;
	drawerClose?: () => void;
}

const BuildingVirtualHMIAlarmsList: React.FC<BuildingVirtualHMIAlarmsListProps> = ({ data, deviceEvents, selectedDeviceRef, drawerOpen, drawerClose }) => {
	return (
		data.length > 0 &&
		deviceEvents.length > 0 &&
		selectedDeviceRef && (
			<div className={cn(styles.contentRight, { [styles.drawerOpen]: drawerOpen })}>
				<div className={styles.label}>
					<div>
						<ReportProblemOutlined style={{ marginTop: -0.8 }} fontSize='small' />
						Aktywne alarmy <span style={{ opacity: 0.6 }}>({deviceEvents.length})</span>
					</div>
					{drawerOpen && (
						<IconButton size='small' onClick={drawerClose}>
							<CloseOutlined fontSize='inherit' />
						</IconButton>
					)}
				</div>
				<div className={cn(styles.list, { [styles.drawerOpen]: drawerOpen })}>
					{deviceEvents
						.sort((a, b) => b.activeTs - a.activeTs)
						.map(event => (
							<BuildingVirtualHMIAlarmsListItem key={event.code} event={event} />
						))}
				</div>
			</div>
		)
	);
};

export default BuildingVirtualHMIAlarmsList;
