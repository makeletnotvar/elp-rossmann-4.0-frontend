import { TextField, Typography } from '@mui/material';
import Params from 'modules/common/components/Params/Params';
import { StepProps } from 'modules/devices/components/AddDeviceDialog/AddDeviceDialogContentStep';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Step.module.scss';

export function StepDeviceInfo({ onSetStepStatus, device, deviceConfig, onDeviceConfigChange }: StepProps) {
	const { t } = useTranslation();

	/**
	 * Initial deviceConfig based on device params
	 */
	const initial: DeviceAddBaseInfo = {
		code: device && device.code ? device.code : '',
		name: device && device.softinfo ? device.softinfo : '',
		description: device && device.softinfo ? device.softinfo : '',
	};

	const _deviceConfig = deviceConfig || initial;

	const updateParam = (param: keyof DeviceAddBaseInfo) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		onDeviceConfigChange({
			...(deviceConfig || initial),
			[param]: evt.target.value,
		});
	};

	/**
	 * If deviceConfig is configured set status to enable "next/finish" button
	 */
	useEffect(() => {
		device !== null && onSetStepStatus(2, true);
	}, [device]);

	/**
	 * On component mount set initial deviceConfig in parent component,
	 * if current set is null
	 */
	useEffect(() => {
		deviceConfig === null && onDeviceConfigChange(_deviceConfig);
	}, []);

	return (
		<>
			<Typography>Informacje o sterowniku</Typography>
			<div>
				<Params className={styles.form}>
					<TextField
						value={_deviceConfig.code}
						disabled
						placeholder={t('devices.params.code')}
						label={t('devices.params.code')}
						onChange={updateParam('code')}
					/>
					<TextField value={_deviceConfig.name} placeholder={t('devices.params.name')} label={t('devices.params.name')} onChange={updateParam('name')} />
					<TextField
						value={_deviceConfig.description}
						placeholder={t('devices.params.description')}
						label={t('devices.params.description')}
						onChange={updateParam('description')}
					/>
				</Params>
			</div>
		</>
	);
}
