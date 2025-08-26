export interface VirtualHMIPayload {
	element: VirtualHMIElement;
	index: number;
}

export interface VirtualHMIElement {
	name: string;
	type?: number;

	regName?: string;
	stringValue?: string;
	value?: number;
	minValue?: number;
	maxValue?: number;
	incValue?: number;
	enumValue?: string;

	unit?: string;
	itemText?: string;

	bits?: number;

	passwordLength?: number;

	items?: any;

	visualType?: VisualType;

	isEditable?: 0 | 1;
	noDotAfter?: boolean;
	unstable?: boolean;

	index?: number;
}

export interface VirtualHMIData {
	type: VirtualHMIItemType;
	payload: VirtualHMIPayload;
}

export enum VisualType {
	'Fixed' = 0x00,
	'Hex' = 0x01,
	'Decimal' = 0x02,
	'Enums' = 0x03,
	'RadioBoxes' = 0x04,
	'CheckBoxes' = 0x05,
	'Digital' = 0x06,
}

export type VirtualHMIItemType =
	| 'TextItem'
	| 'PasswordItem'
	| 'DateMultiItem'
	| 'TimeItem'
	| 'RegisterEnumItem'
	| 'SystemInfoItem';