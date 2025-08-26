import ConfirmDialog from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import { usePoint } from 'modules/common/redux/points';
import DevicePointEdit from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointEdit/DevicePointEdit';
import { usePointEdit } from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointEdit/DevicePointEditHooks';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface DevicePointEditContainerProps {
	uuid: string;
	isNew: boolean;
	onDelete: any;
}

const DevicePointEditContainer: React.FC<DevicePointEditContainerProps> = ({ uuid, isNew = false, onDelete }) => {
	const point = usePoint(isNew ? undefined : uuid);
	const { saveHandler, confirmHandler, isConfirmOpen, closeHandler } = usePointEdit();
	const { t } = useTranslation();

	return (
		<>
			{point && <DevicePointEdit point={point} isNew={isNew} onSave={saveHandler} onDelete={onDelete} />}
			<ConfirmDialog
				title={t('devices.messages.saving_changes')}
				message={`${t('devices.messages.sure_to_saving_changes')}`}
				open={isConfirmOpen}
				onCancel={closeHandler}
				onConfirm={confirmHandler}
			/>
		</>
	);
};

export default DevicePointEditContainer;
