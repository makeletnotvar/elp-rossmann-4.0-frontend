import { AssignmentOutlined, CodeOutlined, SettingsOutlined, SettingsSystemDaydreamOutlined } from '@mui/icons-material';
import { dateString } from 'helpers/date';
import Param from 'modules/common/components/Params/Param';
import Params from 'modules/common/components/Params/Params';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DeviceInfo.module.scss';

interface DeviceInfoProps {
	device: Device & Partial<DeviceDetails>;
}

const DeviceInfo: React.FC<DeviceInfoProps> = ({ device }) => {
	const { t } = useTranslation();
	const {
		uuid,
		name,
		code,
		model,
		softinfo,
		firmware,
		description,
		tags,
		active,
		addTs,
		editTs,
		lastSync,
		connection,
		error,
		building,
		user,
		remoteIpAddress,
	} = device;

	return (
		<>
			<div className={styles.container}>
				<Params title={t('buildings.identity')} hideCount>
					<Param testId='device-name-value' label={t(`devices.params.name`)} value={name} icon={CodeOutlined} />
					<Param testId='device-code-value' label={t(`devices.params.code`)} value={code} icon={CodeOutlined} />
					<Param testId='device-description-value' label={t(`devices.params.description`)} value={description} icon={AssignmentOutlined} />
				</Params>
				<Params title={t('buildings.status')} hideCount>
					<Param
						testId='device-active-value'
						label={t('devices.params.active')}
						value={t(active ? 'general.active' : 'general.inactive')}
						icon={SettingsOutlined}
					/>
					<Param
						testId='device-connection-value'
						label={t('devices.params.connection')}
						value={t(connection ? 'general.ok' : 'general.fail')}
						icon={SettingsOutlined}
					/>
					<Param testId='device-lastSync-value' label={t('devices.params.lastSync')} value={dateString(lastSync)} icon={SettingsOutlined} />
				</Params>
				<Params title={t('devices.params.related_building')} hideCount>
					<Param
						testId='device-building-value'
						label={t(`devices.params.building`)}
						value={building ? building.name : ''}
						icon={AssignmentOutlined}
						link={building ? `/building/${building.uuid}/info` : ``}
					/>
				</Params>
				<Params title={t('devices.params.device_details')} hideCount>
					<Param testId='device-model-value' label={t(`devices.params.model`)} value={model} icon={CodeOutlined} />
					<Param testId='device-softinfo-value' label={t(`devices.params.softinfo`)} value={softinfo} icon={AssignmentOutlined} />
					<Param testId='device-firmware-value' label={t(`devices.params.firmware`)} value={firmware} icon={SettingsSystemDaydreamOutlined} />
					<Param
						testId='device-remoteIpAddress-value'
						label={t(`devices.params.remoteIpAddress`)}
						value={remoteIpAddress}
						icon={SettingsSystemDaydreamOutlined}
					/>
				</Params>
				<Params title={t('devices.params.user')} hideCount>
					<Param testId='device-user-value' label={t(`devices.params.user`)} value={user ? user.name : ''} icon={AssignmentOutlined} />
					<Param testId='device-addDate-value' label={t(`devices.params.addDate`)} value={dateString(addTs)} icon={AssignmentOutlined} />
					<Param testId='device-editDate-value' label={t(`devices.params.editDate`)} value={dateString(editTs)} icon={SettingsSystemDaydreamOutlined} />
				</Params>
			</div>
		</>
	);
};

export default DeviceInfo;
