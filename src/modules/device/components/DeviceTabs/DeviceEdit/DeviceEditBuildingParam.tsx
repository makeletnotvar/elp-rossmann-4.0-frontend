import { API } from 'api/axios';
import buildingsAPI from 'api/endpoints/buildingsAPI';
import cn from 'classnames';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import SelectDialogContainer, { SelectDialogContainerProps, SelectItemType } from 'modules/common/components/Dialogs/SelectDialog/SelectDialogContainer';
import Params from 'modules/common/components/Params/Params';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DeviceEdit.module.scss';

interface DeviceEditBuildingParamProps {
	buildingRef:
		| {
				name: string;
				uuid: string;
		  }
		| null
		| undefined;

	onChange: (ob: { uuid: string; name: string }) => void;
}

const DeviceEditBuildingParam: React.FC<DeviceEditBuildingParamProps> = ({ buildingRef: buildingRef, onChange }) => {
	const { t } = useTranslation();
	const [dialogOpen, setDialogOpen] = useState(false);

	const confirmHandler = useCallback((value: string, label: string) => {
		onChange({ uuid: value, name: label });
	}, []);

	return (
		<>
			<Params title={t('devices.params.building')} className={cn(styles.params, styles.buildingRef)} hideCount collapsable={false}>
				{buildingRef ? (
					<span className={styles.buildingRefLabel}>{buildingRef.name}</span>
				) : (
					<span className={styles.buildingRefEmptyLabel}>{t('devices.messages.no_related_building')}</span>
				)}
				<DeviceEditBuildingParamButton isEmpty={!buildingRef} onClick={() => setDialogOpen(true)} />
			</Params>
			{dialogOpen && (
				<DeviceEditBuildingParamSelect onClose={() => setDialogOpen(false)} onChange={confirmHandler} value={buildingRef ? buildingRef.uuid : undefined} />
			)}
		</>
	);
};

interface DeviceEditBuildingParamSelectProps extends Pick<SelectDialogContainerProps, 'value' | 'onChange' | 'onClose'> {
	//
}

const fetchBuildingsList = (q: string) =>
	new Promise<SelectItemType[]>(async (resolve, reject) => {
		try {
			const response = await API.get(buildingsAPI.getBuildingsList(q));
			resolve(response.data.buildings);
		} catch (err: any) {
			reject(err);
		}
	});

const DeviceEditBuildingParamSelect: React.FC<DeviceEditBuildingParamSelectProps> = ({ value, onChange, onClose }) => {
	const { t } = useTranslation();
	const q = '';

	return (
		<SelectDialogContainer
			asyncData={fetchBuildingsList(q)}
			onClose={onClose}
			onChange={onChange}
			value={value}
			title={t('devices.messages.building_reference')}
			message={t('devices.messages.select_building')}
		/>
	);
};
interface DeviceEditBuildingParamButtonProps {
	isEmpty: boolean;
	onClick: () => void;
}

const DeviceEditBuildingParamButton: React.FC<DeviceEditBuildingParamButtonProps> = ({ isEmpty, onClick }) => {
	const label = isEmpty ? 'general.choose' : 'general.change';
	const { t } = useTranslation();

	return (
		<ConfirmButton noSubmit onClick={onClick} className={styles.chooseBuildingButton}>
			{t(label)}
		</ConfirmButton>
	);
};

export default DeviceEditBuildingParam;
