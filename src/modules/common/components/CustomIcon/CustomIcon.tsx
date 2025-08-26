import { RadioButtonUncheckedOutlined } from '@mui/icons-material';
import React, { CSSProperties } from 'react';
import { IconsConfig } from './icons/icons';

interface CustomIconProps {
	name?: string;
	nameToFilter?: string;
	point?: Point | null;
	color?: string;
	fontSize?: 'small' | 'inherit' | 'large' | 'medium' | undefined;
	style?: CSSProperties;
}

export const CustomIcon: React.FC<CustomIconProps> = ({ name, point, color, fontSize, style, nameToFilter }) => {
	const sortedIcons = [...IconsConfig].sort((a, b) => (a.priority || 0) - (b.priority || 0));

	const filteredIcons = sortedIcons.filter(({ name: iconName, filter }) => {
		return name ? iconName === name : point && filter && filter(point, nameToFilter);
	});

	const Icon = filteredIcons[0]?.icon || RadioButtonUncheckedOutlined;

	return (
		<Icon
			fontSize={fontSize}
			style={{
				color: color ? color : '#808080',
				'&:hover': { color: color ? color : '#808080' },
				...style,
			}}
		/>
	);
};
