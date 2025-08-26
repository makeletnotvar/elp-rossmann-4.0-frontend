import { DateRangeOutlined } from '@mui/icons-material';
import { API } from 'api/axios';
import usersAPI from 'api/endpoints/usersAPI';
import VirtualHMIItemView from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItems';
import VirtualHMIItemsEditable from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItemsEditable/VirtualHMIItemsEditable';
import { VirtualHMIElement } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import React, { useCallback, useState } from 'react';
import styles from './VirtualHMIItems.module.scss';

interface DateMultiItemProps {
	element: VirtualHMIElement;
	index: number;
	isTextItem: boolean;
	updatePath: (nextPath: string[]) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	pathStrings: string[];
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
}

const DateMultiItem: React.FC<DateMultiItemProps> = ({ element, index, isLoading, setIsLoading, pathStrings, selectedDeviceRef }) => {
	const [value, setValue] = useState<string>(element.itemText || '');

	const onClickChangeTextInput = useCallback(() => {
		API.post(usersAPI.postAuditVHMISetpoint(), {
			deviceCode: selectedDeviceRef ? selectedDeviceRef.deviceCode : '',
			path: pathStrings.map(path => path.split('-')[1]),
			name: element.name.toUpperCase(),
			regName: element.regName ? element.regName : null,
			previousValue: element.itemText,
			nextValue: value,
		});
		setIsLoading(true);
		(window as any).vHmi.deviceSendDate({
			value,
			index,
			type: element.type,
		});
	}, [value, element, index]);

	return (
		<VirtualHMIItemView name={element.name} icon={<DateRangeOutlined className={styles.vhmiIcon} />}>
			{element.isEditable && element.isEditable === 1 ? (
				<VirtualHMIItemsEditable index={index} isLoading={isLoading} value={element.itemText || 'Brak danych'} onClickSubmit={onClickChangeTextInput}>
					<input className={styles.vhmiValue} value={value} onChange={evt => setValue(evt.target.value)} maxLength={element.bits} />
				</VirtualHMIItemsEditable>
			) : (
				<div className={styles.vhmiValue}>{element.itemText || 'Brak danych'}</div>
			)}
		</VirtualHMIItemView>
	);
};

export default DateMultiItem;
