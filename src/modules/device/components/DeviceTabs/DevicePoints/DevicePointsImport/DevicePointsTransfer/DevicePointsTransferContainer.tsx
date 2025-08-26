import { RequestStatus } from 'helpers/requests';
import { usePoints } from 'modules/common/redux/points';
import DevicePointsTransfer from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsImport/DevicePointsTransfer/DevicePointsTransfer';
import { pointToRegisterReference } from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsImport/DevicePointsTransfer/DevicePointsTransferHooks';
import * as React from 'react';
// const styles = require("./DevicePointsTransferContainer.scss");

interface DevicePointsTransferContainerProps {
	uuid: string;
	pointsRefs: PointRegisterReference[];
	onAdd: (pointRegisterReference: PointRegisterReference) => void;
	onRemove: (registerName: string) => void;
	registers: DeviceRegister[];
	registersStatus: RequestStatus;
	onRegistersRefresh: any;
	onRegistersRequest: any;
}

const DevicePointsTransferContainer: React.FC<DevicePointsTransferContainerProps> = ({
	uuid,
	pointsRefs,
	onAdd,
	onRemove,
	registers,
	registersStatus,
	onRegistersRefresh,
	onRegistersRequest,
}) => {
	const { points, fetched, fetching, error } = usePoints();

	return !fetching ? (
		<DevicePointsTransfer
			addedPoints={pointToRegisterReference(points)}
			registers={registers}
			imported={pointsRefs}
			onAdd={onAdd}
			onRemove={onRemove}
			onRegistersRefresh={onRegistersRefresh}
			onRegistersRequest={onRegistersRequest}
			registersStatus={registersStatus}
		/>
	) : null;
};

export default DevicePointsTransferContainer;
