import { VpnLockOutlined } from '@mui/icons-material';
import { IconButton, Tooltip, Zoom } from '@mui/material';
import { API } from 'api/axios';
import devicesAPI from 'api/endpoints/devicesAPI';
import { useAuth } from 'modules/common/selectors/auth';
import { DeviceResponse } from 'modules/device/redux/device';
import React, { useCallback } from 'react';

interface VirtualHMIDialogButtonProps {
	device: Partial<Device>;
	setIsOpenVHMIDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setIsConnecting: React.Dispatch<React.SetStateAction<boolean>>;
	setSelectedDeviceRef: (deviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null) => void;
}

const VirtualHMIDialogButton: React.FC<VirtualHMIDialogButtonProps> = ({ device, setIsConnecting, setIsOpenVHMIDialog, setSelectedDeviceRef }) => {
	const { user } = useAuth();

	const onClickConnectHMI = useCallback(async () => {
		if (device.uuid) {
			const deviceResponse = await API.get<DeviceResponse>(devicesAPI.getDevice(device.uuid));
			const { uuid, name, code: deviceCode } = deviceResponse.data.device;
			if (uuid && name && deviceCode) {
				const onRequestVHMI = async () => {
					setIsOpenVHMIDialog(true);
					setIsConnecting(true);
					setTimeout(() => {
						if (user) {
							const request = async () => {
								const response = await API.get<{ wsid: string }>(devicesAPI.connectVirtualHMI());
								if (response && response.data.wsid) {
									const wsid = response.data.wsid;
									(window as any).vHmi.connect(deviceCode, user.uuid, wsid);
									setSelectedDeviceRef({ uuid, name, deviceCode });
								}
							};
							request();
						}
					}, 2000);
				};
				onRequestVHMI();
			}
		}
	}, [user, device]);

	return (
		<>
			<Tooltip title={`Virtual HMI`} placement='bottom'>
				<Zoom in={true} timeout={100}>
					<IconButton size='small' onClick={onClickConnectHMI}>
						<VpnLockOutlined fontSize='inherit' />
					</IconButton>
				</Zoom>
			</Tooltip>
		</>
	);
};

export default VirtualHMIDialogButton;
