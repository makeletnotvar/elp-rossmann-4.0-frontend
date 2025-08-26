import { ArrowForwardIosOutlined } from '@mui/icons-material';
import VirtualHMIItemView from 'modules/common/components/VirtualHMI/VirtualHMIItems/VirtualHMIItems';
import { VirtualHMIElement } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import React, { useCallback } from 'react';
import styles from './VirtualHMIItems.module.scss';

interface TextItemProps {
	element: VirtualHMIElement;
	index: number;
	isTextItem: boolean;
	updatePath: (nextPath: string[]) => void;
	pathStrings: string[];
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
}

const TextItem: React.FC<TextItemProps> = ({ element, index, isTextItem, updatePath, pathStrings, isLoading, setIsLoading }) => {
	const onClickTextItem = useCallback(() => {
		if (!isLoading) {
			setIsLoading(true);
			updatePath([...pathStrings, `${index}-${element.name.toUpperCase()}`]);
		}
	}, [element, isLoading, pathStrings]);

	return (
		<VirtualHMIItemView name={element.name} onClick={onClickTextItem} isTextItem={isTextItem} icon={<ArrowForwardIosOutlined className={styles.vhmiIcon} />} />
	);
};

export default TextItem;
