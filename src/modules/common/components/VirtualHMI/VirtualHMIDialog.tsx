import { Dialog, DialogActions, DialogContent, useMediaQuery, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import ConfirmButton from '../Buttons/ConfirmButton';
import Loader from '../Loaders/Loader';
import VirtualHMI from './VirtualHMI';
import styles from './VirtualHMI.module.scss';
import { useBuildingVirtualHMIDialogRouter } from './hooks/useBuildingVHMIDialogRouter';
import { useVHMI } from './hooks/useVHMI';

interface VirtualHMIDialogProps {
	isOpenVHMIDialog: boolean;
	setIsOpenVHMIDialog: React.Dispatch<React.SetStateAction<boolean>>;
	isConnecting: boolean;
	setIsConnecting: React.Dispatch<React.SetStateAction<boolean>>;
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
}

const VirtualHMIDialog: React.FC<VirtualHMIDialogProps> = ({ isOpenVHMIDialog, setIsOpenVHMIDialog, isConnecting, setIsConnecting, selectedDeviceRef }) => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [, setCountdownLoading] = useState<number>(10);
	const { data } = useVHMI(setIsLoading);
	const { updatePath, pathStrings } = useBuildingVirtualHMIDialogRouter();
	const theme = useTheme();
	const isMobileSize = useMediaQuery(theme.breakpoints.down('xs'));

	const onClickDisconnectHMI = useCallback(() => {
		updatePath([]);
		(window as any).vHmi.disconnect();
		setIsOpenVHMIDialog(false);
	}, []);

	useEffect(() => {
		if (data.length > 0) {
			setIsConnecting(false);
		}
	}, [data]);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		if (isLoading) {
			setCountdownLoading(10);
			intervalId = setInterval(() => {
				setCountdownLoading(prevCountdown => {
					if (prevCountdown === 1) {
						window.location.reload();
						return 10;
					} else {
						return prevCountdown - 1;
					}
				});
			}, 1000);
		}
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [isLoading]);

	return (
		<Dialog open={isOpenVHMIDialog} onClose={onClickDisconnectHMI} maxWidth='lg' fullWidth fullScreen={isMobileSize}>
			<DialogContent className={styles.vhmiDialogContent}>
				{data.length === 0 && isConnecting === true ? (
					<Loader label='Trwa łączenie z virtual hmi' />
				) : (
					<VirtualHMI
						data={data}
						updatePath={updatePath}
						pathStrings={pathStrings}
						isLoading={isLoading}
						setIsLoading={setIsLoading}
						selectedDeviceRef={selectedDeviceRef}
					/>
				)}
			</DialogContent>
			<DialogActions style={{ display: 'flex', justifyContent: 'center', width: 'calc(100% - 16px)' }}>
				<ConfirmButton noSubmit onClick={onClickDisconnectHMI} disabled={isConnecting}>
					Zamknij
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

export default VirtualHMIDialog;
