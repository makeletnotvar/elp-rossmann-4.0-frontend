import { TextField, Typography } from '@mui/material';
import { StepProps } from 'modules/devices/components/AddDeviceDialog/AddDeviceDialogContentStep';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Step.module.scss';

const DEVICE_CODE_LENGTH = 24;

// Step 0
export function StepDeviceEnable({ onSetStepStatus, code, onCodeUpdate }: StepProps) {
	const { t } = useTranslation();
	const isValid = code.length === DEVICE_CODE_LENGTH;

	const changeCodeHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const nextCodeValue = evt.currentTarget.value.toUpperCase();

		if (nextCodeValue.length <= DEVICE_CODE_LENGTH) {
			onCodeUpdate(nextCodeValue);
		}
	};

	useEffect(() => {
		onSetStepStatus(0, isValid);
	}, [code]);

	return (
		<>
			<div className={styles.container}>
				<Typography variant='h6' className={styles.title}>
					Uruchom usługę ELPOnline na swoim urządzeniu
				</Typography>
				<Typography variant='body1' className={styles.text2}>
					Opcję tę znajdziesz na wyświetlaczu sterownika w menu ustawień systemowych.
				</Typography>
				<Typography variant='body1' className={styles.text3}>
					Parametr <strong>ELP on-line</strong> zmień na <strong>enabled</strong>.
				</Typography>
				<Typography variant='caption' className={styles.text4}>
					Pamiętaj, że Twoje urządzenie musi być wpięte do sieci Internet przez przewód Ethernet oraz skonfigurowane zgodnie z ustawieniami sieci lokalnej.
				</Typography>
				<Typography variant='body1' className={styles.text5}>
					Podaj {DEVICE_CODE_LENGTH}-znakowy identyfikator urządzenia, abyśmy mogli je zidentyfikować.
				</Typography>
				<div className={styles.codeContainer}>
					<TextField
						data-testid='device-code-input'
						value={code}
						onChange={changeCodeHandler}
						className={styles.codeInput}
						error={!isValid}
						placeholder='XXXXXXXXXXXX XXXXXXXXXXXX'
					/>
				</div>
			</div>
		</>
	);
}
