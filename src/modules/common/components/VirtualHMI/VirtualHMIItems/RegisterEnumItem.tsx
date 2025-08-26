import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { LinearScaleOutlined } from '@mui/icons-material';
import { API } from 'api/axios';
import usersAPI from 'api/endpoints/usersAPI';
import cn from 'classnames';
import VirtualHMIItemView from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItems';
import VirtualHMIItemsEditable from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItemsEditable/VirtualHMIItemsEditable';
import { VirtualHMIElement } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import React from 'react';
import styles from './VirtualHMIItems.module.scss';

interface RegisterEnumItemProps {
	element: VirtualHMIElement;
	index: number;
	isTextItem: boolean;
	updatePath: (nextPath: string[]) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
	pathStrings: string[];
}

const RegisterEnumItem: React.FC<RegisterEnumItemProps> = ({ element, index, isLoading, setIsLoading, selectedDeviceRef, pathStrings }) => {
	const onChangeRadioInput = (value: string) => {
		API.post(usersAPI.postAuditVHMISetpoint(), {
			deviceCode: selectedDeviceRef ? selectedDeviceRef.deviceCode : '',
			path: pathStrings.map(path => path.split('-')[1]),
			name: `${element.name} ${element.regName ? `(${element.regName})` : ''}`.toUpperCase(),
			regName: element.regName ? element.regName : null,
			previousValue: element.enumValue,
			nextValue: element.items[value],
		});
		setIsLoading(true);
		(window as any).vHmi.deviceChangeValue({ value, index, type: element.type });
	};

	return (
		<VirtualHMIItemView
			name={`${element.name} ${element.regName ? `(${element.regName})` : ''}`}
			icon={<LinearScaleOutlined className={cn(styles.vhmiIcon, { [styles.isEnum]: true })} />}
		>
			{element.isEditable && element.isEditable === 1 ? (
				<VirtualHMIItemsEditable index={index} isLoading={isLoading} value={element.enumValue || 'Brak danych'}>
					<RadioGroup
						row
						value={Object.keys(element.items).find(key => element.items[key] === element.enumValue)}
						onChange={evt => onChangeRadioInput((evt.target as HTMLInputElement).value)}
					>
						{(Object.entries(element.items) || []).map(([key, name]: any) => (
							<FormControlLabel
								className={styles.formControlLabel}
								key={key}
								value={key}
								control={<Radio className={styles.vhmiRadioButton} size='small' />}
								label={name}
							/>
						))}
					</RadioGroup>
				</VirtualHMIItemsEditable>
			) : (
				<div className={styles.vhmiValue}>{element.enumValue || 'Brak danych'}</div>
			)}
		</VirtualHMIItemView>
	);
};

export default RegisterEnumItem;
