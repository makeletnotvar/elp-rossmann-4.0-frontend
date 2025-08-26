import { IconButton } from '@mui/material';
import { AddOutlined, RemoveOutlined, TimelineOutlined } from '@mui/icons-material';
import { API } from 'api/axios';
import usersAPI from 'api/endpoints/usersAPI';
import cn from 'classnames';
import VirtualHMIItemView from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItems';
import VirtualHMIItemsEditable from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItemsEditable/VirtualHMIItemsEditable';
import { VirtualHMIElement } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import React, { useCallback, useState } from 'react';
import styles from './VirtualHMIItems.module.scss';

interface RegisterValueItemProps {
	element: VirtualHMIElement;
	index: number;
	isTextItem: boolean;
	updatePath: (nextPath: string[]) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	pathStrings: string[];
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
}

const RegisterValueItem: React.FC<RegisterValueItemProps> = ({ element, index, isLoading, setIsLoading, selectedDeviceRef, pathStrings }) => {
	const [value, setValue] = useState<string>(element.stringValue || '');

	const onClickChangeTextInput = useCallback(() => {
		setIsLoading(true);
		const increment = Number(element.incValue) || 0.1;
		const roundedValue = (Math.round(Number(value) / increment) * increment).toFixed(1);
		if (Number(element.stringValue).toFixed(1) !== roundedValue) {
			API.post(usersAPI.postAuditVHMISetpoint(), {
				deviceCode: selectedDeviceRef ? selectedDeviceRef.deviceCode : '',
				path: pathStrings.map(path => path.split('-')[1]),
				name: `${element.name} ${element.regName ? `(${element.regName})` : ''}`.toUpperCase(),
				regName: element.regName ? element.regName : null,
				previousValue: element.stringValue,
				nextValue: roundedValue,
			});
			(window as any).vHmi.deviceSendRegisterValue({
				value: roundedValue,
				index,
				type: element.type,
				visualType: element.visualType,
				minValue: element.minValue,
				maxValue: element.maxValue,
			});
		} else {
			setIsLoading(false);
		}
	}, [value, element, index]);

	const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		setValue(evt.target.value);
	};

	const handleBlur = () => {
		const numericValue = parseFloat(value);
		const increment = Number(element.incValue) || 0.1;
		const roundedValue = Number((Math.round(Number(numericValue) / increment) * increment).toFixed(1));
		if (roundedValue > Number(element.maxValue)) {
			setValue(String(element.maxValue));
		} else if (roundedValue < Number(element.minValue)) {
			setValue(String(element.minValue));
		} else {
			setValue(String(roundedValue));
		}
	};

	return (
		<VirtualHMIItemView
			name={`${element.name} ${element.regName ? `(${element.regName})` : ''}`}
			icon={<TimelineOutlined className={cn(styles.vhmiIcon, { [styles.isNumeric]: true })} />}
		>
			{element.isEditable && element.isEditable === 1 ? (
				<VirtualHMIItemsEditable
					index={index}
					isLoading={isLoading}
					value={`${element.stringValue} ${element.unit}` || 'Brak danych'}
					onClickSubmit={onClickChangeTextInput}
				>
					<div className={styles.vhmiCustomInputContainer}>
						<IconButton
							onClick={() =>
								setValue(prevValue => {
									const newValue = Number(Number(prevValue) - Number(element.incValue) || 0.1).toFixed(1);
									if (Number(newValue) > Number(element.maxValue)) {
										return String(element.maxValue);
									} else if (Number(newValue) < Number(element.minValue)) {
										return String(element.minValue);
									} else {
										return newValue;
									}
								})
							}
							size='small'
							className={cn(styles.vhmiActionButton, styles.decrement)}
							disabled={Number(value) <= Number(element.minValue)}
						>
							<RemoveOutlined />
						</IconButton>
						<div className={styles.vhmiCustomInput}>
							<input
								id={value}
								step={Number(element.incValue) || 0.1}
								className={styles.vhmiValue}
								value={value}
								onChange={handleChange}
								onBlur={handleBlur}
								maxLength={element.bits}
								max={Number(element.maxValue) || 100}
								min={Number(element.minValue) || 0}
							/>
							<span className={styles.vhmiUnit}>{element.unit}</span>
						</div>
						<IconButton
							onClick={() =>
								setValue(prevValue => {
									const newValue = Number(Number(prevValue) + Number(element.incValue) || 0.1).toFixed(1);
									if (Number(newValue) > Number(element.maxValue)) {
										return String(element.maxValue);
									} else if (Number(newValue) < Number(element.minValue)) {
										return String(element.minValue);
									} else {
										return newValue;
									}
								})
							}
							size='small'
							className={cn(styles.vhmiActionButton, styles.increment)}
							disabled={Number(value) >= Number(element.maxValue)}
						>
							<AddOutlined />
						</IconButton>
					</div>
				</VirtualHMIItemsEditable>
			) : element.value == -32768 || element.value == -2147483648 ? (
				<div className={styles.vhmiValue}>{element.unstable || 'Brak danych'}</div>
			) : (
				<div className={styles.vhmiValue}>{`${element.stringValue} ${element.unit}` || 'Brak danych'}</div>
			)}
		</VirtualHMIItemView>
	);
};

export default RegisterValueItem;
