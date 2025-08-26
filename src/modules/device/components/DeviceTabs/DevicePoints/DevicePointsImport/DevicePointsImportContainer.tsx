import DevicePointsImportDialog from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsImport/DevicePointsImportDialog';
import {
	useCurrentlyImportedPoints,
	useDeviceRegisters,
} from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsImport/DevicePointsTransfer/DevicePointsTransferHooks';
import * as React from 'react';
// const styles = require("./DevicePointsImportContainer.scss");

interface DevicePointsImportContainerProps {
	deviceUUID: string;
	onClose: () => void;
	open: boolean;
}

const DevicePointsImportContainer: React.FC<DevicePointsImportContainerProps> = ({ deviceUUID, onClose, open }) => {
	const { pointsRefs, add, remove, submit } = useCurrentlyImportedPoints(deviceUUID);
	const { data, status, forceReload: onRefresh } = useDeviceRegisters(deviceUUID);

	const submitHandler = () => {
		submit();
		onClose();
	};

	return (
		<DevicePointsImportDialog
			onClose={onClose}
			onSubmit={submitHandler}
			uuid={deviceUUID}
			onAdd={add}
			onRemove={remove}
			pointsRefs={pointsRefs}
			open={open}
			registers={data ? data.registers : []}
			registersStatus={status}
			onRegistersRefresh={onRefresh}
			onRegistersRequest={onRefresh}
		/>
	);
};

export default DevicePointsImportContainer;
