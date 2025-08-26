import { InfoOutlined } from '@mui/icons-material';
import cn from 'classnames';
import VirtualHMIItemView from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItems';
import { VirtualHMIElement } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import React from 'react';
import styles from './VirtualHMIItems.module.scss';

interface SystemInfoItemProps {
	element: VirtualHMIElement;
	index: number;
	isTextItem: boolean;
	updatePath: (nextPath: string[]) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
}

const SystemInfoItem: React.FC<SystemInfoItemProps> = ({ element }) => {
	return (
		<VirtualHMIItemView name={element.itemText || element.name} icon={<InfoOutlined className={cn(styles.vhmiIcon, { [styles.isInfo]: true })} />} isTextItem />
	);
};

export default SystemInfoItem;
