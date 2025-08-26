import { CloudOutlined } from '@mui/icons-material';
import { LinearProgress, Paper, Typography } from '@mui/material';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import { useDeviceConnectionTest } from 'modules/devices/components/AddDeviceDialog/steps/StepConnectionTestHooks';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AddDeviceDialogContentProps } from './../AddDeviceDialogContent';
import styles from './Step.module.scss';

export function StepConnectionTest({
	onSetStepStatus,
	code,
	onDeviceFound,
	device,
}: Pick<AddDeviceDialogContentProps, 'code' | 'onSetStepStatus' | 'device' | 'onDeviceFound'>) {
	const foundDeviceHandler = (nextDevice: DeviceInfo | null) => {
		if (nextDevice) {
			onDeviceFound(nextDevice);
			onSetStepStatus(1, true);
		}
	};
	const { start, testing, error, failure } = useDeviceConnectionTest(code, foundDeviceHandler);

	return (
		<div className={styles.container}>
			<Typography variant='h6' className={styles.title}>
				Testowanie połączenia z urządzeniem
			</Typography>
			<Typography variant='body1' className={styles.text2}>
				Przed dodaniem urządzenia musimy potwierdzić poprawność podanego kodu i podłączenia urządzenia do sieci Internet.
			</Typography>
			<div>
				{device ? <FoundDevice device={device} /> : <TestButton onClick={start} testing={testing} failure={failure} />}
				{!device && failure && <NotFoundDevice />}
			</div>
			{testing && <TestingProgress />}
		</div>
	);
}

interface TestButtonProps {
	testing: boolean;
	failure: boolean;
	onClick: () => void;
}

const TestButton: React.FC<TestButtonProps> = ({ testing, onClick, failure }) => {
	const { t } = useTranslation();
	return (
		<ConfirmButton data-testid='device-test-button' noSubmit size='large' className={styles.testButton} onClick={onClick} disabled={testing}>
			{failure
				? t('devices.add_dialog.steps.connection_test.try_again')
				: testing
				? t('devices.add_dialog.steps.connection_test.testing_in_progress')
				: t('devices.add_dialog.steps.connection_test.do_connection_test')}
		</ConfirmButton>
	);
};

const TestingProgress = () => (
	<>
		<div className={styles.progressWrapper}>
			<div>
				<LinearProgress color='primary' variant='query' className={styles.progress} />
			</div>
			<div>
				<CloudOutlined />
			</div>
		</div>
		<Typography variant='caption' className={styles.text4}>
			Trwa próba połączenia z urządzeniem. Może to potrwać kilkadziesiąt sekund.
		</Typography>
	</>
);

const FoundDevice: React.FC<{ device: DeviceInfo }> = ({ device }) => {
	return (
		<div style={{ marginTop: 50 }}>
			<Typography variant='caption' className={styles.text4}>
				System pomyślnie połączył się z urządzeniem:
			</Typography>
			<Paper className={styles.device}>
				<Typography variant='h6'>{device.softinfo}</Typography>
				<Typography variant='body1'>
					<strong>{device.model}</strong>
				</Typography>
				<Typography variant='body1'>Firmware: {device.firmware}</Typography>
			</Paper>
		</div>
	);
};

const NotFoundDevice: React.FC = () => (
	<>
		<Typography variant='h6' className={styles.text1} style={{ color: 'red' }}>
			Nie znaleziono
		</Typography>
		<Typography variant='body1' className={styles.text2}>
			Niestety nie udało się odnaleźć urządzenia. Sprawdź poprawność kodu, wprowadzonych ustawień sieciowych oraz dostępność połączenia Internet.
		</Typography>
	</>
);
