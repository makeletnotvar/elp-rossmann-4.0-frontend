import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import DevicesStatusList from 'modules/buildings/components/BuildingsList/custom/BuildingMultipleDevicesCommunicationCell/DevicesStatusList/DevicesStatusList';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingMultipleDevicesCommunicationCell.module.scss';

interface BuildingMultipleDevicesCommunicationDialogProps {
	title: string;
	open: boolean;
	onClose: () => void;
	devices: BuildingDeviceStatus[];
	building: Building;
}

const BuildingMultipleDevicesCommunicationDialog: React.FC<BuildingMultipleDevicesCommunicationDialogProps> = ({ title, open, devices, onClose, building }) => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<Dialog {...{ open, onClose }} className={styles.dialog} maxWidth='sm' fullWidth fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<DialogTitle className={styles.title}>{title}</DialogTitle>
			<DialogContent className={styles.content}>
				<DevicesStatusList devices={devices} building={building} onClose={onClose} />
			</DialogContent>
			<DialogActions className={styles.actions}>
				<ConfirmButton noSubmit onClick={onClose}>
					{t('general.ok')}
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

export default BuildingMultipleDevicesCommunicationDialog;
