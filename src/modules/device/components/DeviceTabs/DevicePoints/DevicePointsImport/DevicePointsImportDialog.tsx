import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { RequestStatus } from 'helpers/requests';
import CancelButton from 'modules/common/components/Buttons/CancelButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import DevicePointsTransferContainer from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsImport/DevicePointsTransfer/DevicePointsTransferContainer';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DevicePointsImport.module.scss';

interface DevicePointsImportDialogProps {
	onClose: () => void;
	onSubmit: () => void;
	uuid: string;
	pointsRefs: PointRegisterReference[];
	onAdd: (pointRegisterReference: PointRegisterReference) => void;
	onRemove: (registerName: string) => void;
	open: boolean;
	registers: DeviceRegister[];
	registersStatus: RequestStatus;
	onRegistersRequest: any;
	onRegistersRefresh: any;
}

const DevicePointsImportDialog: React.FC<DevicePointsImportDialogProps> = ({
	onClose,
	onSubmit,
	uuid,
	pointsRefs,
	onAdd,
	onRemove,
	open,
	registersStatus,
	registers,
	onRegistersRefresh,
	onRegistersRequest,
}) => {
	const { t } = useTranslation();
	const theme = useTheme();

	return (
		<Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth='xl' fullWidth={true} fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<DialogTitle className={styles.title}>{t('devices.messages.import_device_points')}</DialogTitle>
			<DialogContent className={styles.content}>
				<DevicePointsTransferContainer {...{ uuid, pointsRefs, onAdd, onRemove, onRegistersRefresh, onRegistersRequest, registers, registersStatus }} />
			</DialogContent>
			<DialogActions className={styles.actions}>
				<CancelButton onClick={onClose}>{t('general.cancel')}</CancelButton>
				<ConfirmButton noSubmit onClick={onSubmit} disabled={pointsRefs.length === 0}>
					{t('general.ok')}
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

export default DevicePointsImportDialog;
