import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { SettingsOutlined } from '@mui/icons-material';
import { API } from 'api/axios';
import usersAPI from 'api/endpoints/usersAPI';
import { nArray } from 'helpers/data';
import VirtualHMIItemView from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItems';
import VirtualHMIItemsEditable from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItemsEditable/VirtualHMIItemsEditable';
import { VirtualHMIElement } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import React from 'react';
import styles from './VirtualHMIItems.module.scss';

interface RegisterCheckboxesItemProps {
	element: VirtualHMIElement;
	index: number;
	isTextItem: boolean;
	updatePath: (nextPath: string[]) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	pathStrings: string[];
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
}

const RegisterCheckboxesItem: React.FC<RegisterCheckboxesItemProps> = ({ element, index, isLoading, setIsLoading, selectedDeviceRef, pathStrings }) => {
	const onChangeCheckboxInput = (value: string, checked: boolean) => {
		API.post(usersAPI.postAuditVHMISetpoint(), {
			deviceCode: selectedDeviceRef ? selectedDeviceRef.deviceCode : '',
			path: pathStrings.map(path => path.split('-')[1]),
			name: `${element.name} ${element.regName ? `(${element.regName})` : ''}`.toUpperCase(),
			regName: element.regName ? element.regName : null,
			previousValue: Boolean(element.value && element.value & 1),
			nextValue: checked,
		});
		setIsLoading(true);
		(window as any).vHmi.deviceChangeCheckboxesValue({ value, index, type: element.type, checked });
	};

	return (
		<VirtualHMIItemView name={`${element.name} ${element.regName ? `(${element.regName})` : ''}`} icon={<SettingsOutlined className={styles.vhmiIcon} />}>
			{element.isEditable && element.isEditable === 1 ? (
				<VirtualHMIItemsEditable index={index} isLoading={isLoading} value={element.enumValue || 'Brak danych'}>
					<FormGroup row>
						{nArray(element.bits || 0).map((_, i) => (
							<FormControlLabel
								value={Math.pow(2, i)}
								control={
									<Checkbox
										className={styles.vhmiCheckboxButton}
										size='small'
										checked={Boolean(element.value && element.value & 1)}
										onChange={evt => onChangeCheckboxInput(evt.currentTarget.value, Boolean(element.value && element.value & 1))}
									/>
								}
								label={Math.pow(2, i)}
							/>
						))}
					</FormGroup>
				</VirtualHMIItemsEditable>
			) : (
				<div className={styles.vhmiValue}>{element.enumValue || 'Brak danych'}</div>
			)}
		</VirtualHMIItemView>
	);
};

export default RegisterCheckboxesItem;
