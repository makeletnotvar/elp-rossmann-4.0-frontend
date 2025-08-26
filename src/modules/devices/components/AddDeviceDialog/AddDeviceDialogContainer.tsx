import * as React from 'react';
import AddDeviceDialog from './AddDeviceDialog';
interface AddDeviceDialogContainerProps {
	open: boolean;
	onClose: () => void;
}

const AddDeviceDialogContainer: React.FC<AddDeviceDialogContainerProps> = ({ open, onClose }) => {
	return (
		<>
			<AddDeviceDialog open={open} onClose={onClose} />
		</>
	);
};

export default AddDeviceDialogContainer;
