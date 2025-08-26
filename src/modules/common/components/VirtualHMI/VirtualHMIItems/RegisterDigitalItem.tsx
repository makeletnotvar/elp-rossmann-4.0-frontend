import { SettingsOutlined } from '@mui/icons-material';
import { API } from 'api/axios';
import usersAPI from 'api/endpoints/usersAPI';
import VirtualHMIItemView from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItems';
import VirtualHMIItemsEditable from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItemsEditable/VirtualHMIItemsEditable';
import { VirtualHMIElement } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import React, { useCallback, useState } from 'react';
import styles from './VirtualHMIItems.module.scss';

interface RegisterDigitalItemProps {
	element: VirtualHMIElement;
	index: number;
	isTextItem: boolean;
	updatePath: (nextPath: string[]) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	pathStrings: string[];
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
}

const RegisterDigitalItem: React.FC<RegisterDigitalItemProps> = ({ element, index, isLoading, setIsLoading, selectedDeviceRef, pathStrings }) => {
	const [value, setValue] = useState<number>(element.value || 0);

	const onClickChangeTextInput = useCallback(() => {
		setIsLoading(true);
		API.post(usersAPI.postAuditVHMISetpoint(), {
			deviceCode: selectedDeviceRef ? selectedDeviceRef.deviceCode : '',
			path: pathStrings.map(path => path.split('-')[1]),
			name: `${element.name} ${element.regName ? `(${element.regName})` : ''}`.toUpperCase(),
			regName: element.regName ? element.regName : null,
			previousValue: element.value,
			nextValue: value,
		});
		(window as any).vHmi.deviceSendDigitalValue({
			value,
			index,
			type: element.type,
		});
	}, [value, element, index]);

	return (
		<VirtualHMIItemView name={`${element.name} ${element.regName ? `(${element.regName})` : ''}`} icon={<SettingsOutlined className={styles.vhmiIcon} />}>
			<VirtualHMIItemsEditable index={index} isLoading={isLoading} value={element.value || 0} onClickSubmit={onClickChangeTextInput}>
				<input type='number' className={styles.vhmiValue} value={element.value} onChange={evt => setValue(Number(evt.target.value))} maxLength={element.bits} />
			</VirtualHMIItemsEditable>
		</VirtualHMIItemView>
	);
};

export default RegisterDigitalItem;
