import { API } from 'api/axios';
import buildingsAPI from 'api/endpoints/buildingsAPI';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import SelectDialogContainer from 'modules/common/components/Dialogs/SelectDialog/SelectDialogContainer';
import { useConsumptionState } from 'modules/consumption/redux/consumption';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './ConsumptionSelectBuilding.module.scss';

interface ConsumptionSelectBuildingProps {
	value: string;
	onChange: (value: string, label: string) => void;
}

const fetchBuildingsList = (q: string) =>
	new Promise<{ uuid: string; name: string }[]>(async (resolve, reject) => {
		try {
			const response = await API.get(buildingsAPI.getBuildingsList(q));
			resolve(response.data.buildings);
		} catch (err: any) {
			reject(err);
		}
	});

export const useSelectBuildingDialog = () => {
	const [open, setOpen] = useState<boolean>(false);

	return {
		open,
		onOpen: () => setOpen(true),
		onClose: () => setOpen(false),
	};
};

const ConsumptionSelectBuilding: React.FC<ConsumptionSelectBuildingProps> = ({ onChange, value }) => {
	const {
		data: { building },
	} = useConsumptionState();
	const { open, onOpen, onClose } = useSelectBuildingDialog();
	const [cachedLabel, setLabel] = useState<string>('');
	const { t } = useTranslation();
	const {
		history,
		match: {
			params: { uuid },
		},
	} = useRouter<{ uuid: string }>();
	const q = '';

	const changeHandler = (value: string, label: string) => {
		onChange(value, label);
		setLabel(label);
	};

	const fetchedBuildingName = building ? building.name : null;

	return (
		<>
			<div className={styles.buildingSelectField}>
				<label>{cachedLabel || fetchedBuildingName || 'Brak budynku'}</label>
				<ConfirmButton testId='chart-settings-button' noSubmit onClick={onOpen}>
					Wybierz
				</ConfirmButton>
			</div>
			{open && (
				<SelectDialogContainer
					asyncData={fetchBuildingsList(q)}
					onClose={onClose}
					onChange={changeHandler}
					value={value}
					title={t('devices.messages.building_reference')}
					message={t('devices.messages.select_building')}
				/>
			)}
		</>
	);
};

export default ConsumptionSelectBuilding;
