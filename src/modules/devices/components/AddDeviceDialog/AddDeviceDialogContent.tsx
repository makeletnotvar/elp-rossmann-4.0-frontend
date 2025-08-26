import * as React from 'react';
import AddDeviceDialogContentStep from './AddDeviceDialogContentStep';
import AddDeviceDialogContentStepper from './AddDeviceDialogContentStepper';

export interface AddDeviceDialogContentProps {
	step: number;
	onSetStepStatus: (key: number, status: boolean) => void;
	code: string;
	onCodeUpdate: (nextCode: string) => void;
	onDeviceFound: (device: DeviceInfo) => void;
	device: DeviceInfo | null;
	onDeviceConfigChange: (nextConfig: DeviceAddBaseInfo) => void;
	deviceConfig: DeviceAddBaseInfo | null;
}

const AddDeviceDialogContent: React.FC<AddDeviceDialogContentProps> = ({
	step,
	onSetStepStatus,
	code,
	onCodeUpdate,
	onDeviceFound,
	device,
	deviceConfig,
	onDeviceConfigChange,
}) => {
	return (
		<>
			<AddDeviceDialogContentStepper step={step} />
			<AddDeviceDialogContentStep
				{...{
					step,
					onSetStepStatus,
					code,
					onCodeUpdate,
					onDeviceFound,
					device,
					onDeviceConfigChange,
					deviceConfig,
				}}
			/>
		</>
	);
};

export default AddDeviceDialogContent;
