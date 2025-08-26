import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import CancelButton from 'modules/common/components/Buttons/CancelButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import { useAddDevice, useAddDeviceSteps } from 'modules/devices/components/AddDeviceDialog/AddDeviceDialogHooks';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AddDeviceDialog.module.scss';
import AddDeviceDialogContent from './AddDeviceDialogContent';

interface AddDeviceDialogProps {
	open: boolean;
	onClose: () => void;
}

const AddDeviceDialog: React.FC<AddDeviceDialogProps> = ({ open, onClose }) => {
	const { t } = useTranslation();
	const theme = useTheme();

	const { step, nextStepHandler, nextStepEnabled, prevStepHandler, prevStepEnabled, isFinalStep, setStepStatusHandler, reset } = useAddDeviceSteps();

	const { code, setCode, deviceFoundHandler, device, deviceConfig, updateDeviceConfigHandler, addHandler } = useAddDevice(onClose);

	const handleAdd = () => {
		addHandler();
		reset();
	};

	return (
		<Dialog open={open} maxWidth='md' onClose={onClose} fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<DialogTitle>
				{t('devices.messages.add_new_device')} {step > 0 && code && `[${code}]`}
			</DialogTitle>
			<DialogContent>
				<DialogContentText component='div'>
					<AddDeviceDialogContent
						step={step}
						onSetStepStatus={setStepStatusHandler}
						code={code}
						onCodeUpdate={setCode}
						onDeviceFound={deviceFoundHandler}
						device={device}
						onDeviceConfigChange={updateDeviceConfigHandler}
						deviceConfig={deviceConfig}
					/>
				</DialogContentText>
				<DialogActions className={styles.actions}>
					<CancelButton onClick={onClose}>{t('general.cancel')}</CancelButton>
					{!isFinalStep && (
						<CancelButton onClick={prevStepHandler} disabled={!prevStepEnabled}>
							{t('general.go_back')}
						</CancelButton>
					)}
					{isFinalStep ? (
						<ConfirmButton onClick={handleAdd} disabled={!nextStepEnabled}>
							{t('general.finish')}
						</ConfirmButton>
					) : (
						<ConfirmButton onClick={nextStepHandler} disabled={!nextStepEnabled}>
							{t('general.go_next')}
						</ConfirmButton>
					)}
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

export default AddDeviceDialog;
