import DateMultiItem from 'modules/common/components/VirtualHMI/VirtualHMIItems/DateMultiItem';
import PasswordItem from 'modules/common/components/VirtualHMI/VirtualHMIItems/PasswordItem';
import RegisterCheckboxesItem from 'modules/common/components/VirtualHMI/VirtualHMIItems/RegisterCheckboxesItem';
import RegisterDigitalItem from 'modules/common/components/VirtualHMI/VirtualHMIItems/RegisterDigitalItem';
import RegisterEnumItem from 'modules/common/components/VirtualHMI/VirtualHMIItems/RegisterEnumItem';
import RegisterValueItem from 'modules/common/components/VirtualHMI/VirtualHMIItems/RegisterValueItem';
import SystemInfoItem from 'modules/common/components/VirtualHMI/VirtualHMIItems/SystemInfoItem';
import TextItem from 'modules/common/components/VirtualHMI/VirtualHMIItems/TextItem';
import TimeItem from 'modules/common/components/VirtualHMI/VirtualHMIItems/TimeItem';
import { VirtualHMIItemType, VirtualHMIPayload } from 'modules/common/components/VirtualHMI/types/virtualHMI';
import React from 'react';

interface VirtualHMIItemProps {
	type: VirtualHMIItemType;
	payload: VirtualHMIPayload;
	updatePath: (nextPath: string[]) => void;
	pathStrings: string[];
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	selectedDeviceRef: (BuildingDeviceReference & { deviceCode?: string }) | null;
}

const VirtualHMIItem: React.FC<VirtualHMIItemProps> = ({ type, payload, updatePath, pathStrings, isLoading, setIsLoading, selectedDeviceRef }) => {
	const COMPONENTS = {
		TextItem: TextItem,
		PasswordItem: PasswordItem,
		DateMultiItem: DateMultiItem,
		TimeItem: TimeItem,
		RegisterEnumItem: RegisterEnumItem,
		RegisterValueItem: RegisterValueItem,
		RegisterDigitalItem: RegisterDigitalItem,
		RegisterCheckboxesItem: RegisterCheckboxesItem,
		SystemInfoItem: SystemInfoItem,
	};

	const Component = COMPONENTS[type as VirtualHMIItemType];

	return (
		<>
			{!isLoading && (
				<Component
					key={`${payload.index}${payload.element.name.toUpperCase()}${payload.element.regName || ''}`}
					element={payload.element}
					index={payload.index}
					isTextItem={type === 'TextItem'}
					updatePath={updatePath}
					pathStrings={pathStrings}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					selectedDeviceRef={selectedDeviceRef}
				/>
			)}
		</>
	);
};

export default VirtualHMIItem;
