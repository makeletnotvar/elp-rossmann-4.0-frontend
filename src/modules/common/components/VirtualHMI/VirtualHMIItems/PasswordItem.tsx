import { Button } from '@mui/material';
import { VpnKeyOutlined } from '@mui/icons-material';
import { API } from 'api/axios';
import usersAPI from 'api/endpoints/usersAPI';
import VirtualHMIItemView from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItems';
import { VirtualHMIElement } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import React, { useCallback, useState } from 'react';
import styles from './VirtualHMIItems.module.scss';

interface PasswordItemProps {
	element: VirtualHMIElement;
	index: number;
	isTextItem: boolean;
	updatePath: (nextPath: string[]) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	pathStrings: string[];
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
}

const PasswordItem: React.FC<PasswordItemProps> = ({ element, index, updatePath, setIsLoading, selectedDeviceRef, pathStrings }) => {
	const [password, setPassword] = useState<string | number>('');

	const onClickPassword = useCallback(() => {
		setIsLoading(true);
		if (element.name.toLowerCase() === 'powtórz nowe hasło' || element.name.toLowerCase() === 're-type new password') {
			API.post(usersAPI.postAuditVHMISetpoint(), {
				deviceCode: selectedDeviceRef ? selectedDeviceRef.deviceCode : '',
				path: pathStrings.map(path => path.split('-')[1]),
				name: element.name.toUpperCase(),
				regName: element.regName ? element.regName : null,
				previousValue: null,
				nextValue: password,
			});
			updatePath([]);
		}
		(window as any).vHmi.deviceSendPassword(password);
	}, [password, element.name]);

	return (
		<VirtualHMIItemView name={element.name} icon={<VpnKeyOutlined className={styles.vhmiIcon} />}>
			<div className={styles.vhmiInputContainer}>
				<input type='password' value={password} maxLength={element.passwordLength} onChange={evt => setPassword(evt.target.value)} />
				<Button style={{ padding: 1.5 }} color='primary' variant='outlined' size='small' onClick={onClickPassword}>
					OK
				</Button>
			</div>
		</VirtualHMIItemView>
	);
};

export default PasswordItem;
