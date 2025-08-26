import { ArrowBackOutlined, ArrowDownwardOutlined, ArrowForwardOutlined, ArrowUpwardOutlined } from '@mui/icons-material';
import React from 'react';

interface DrawViewItemPipeArrowProps {
	direction: 'left' | 'right' | 'up' | 'down';
	color: string;
	size: number;
}

const DrawViewItemPipeArrow: React.FC<DrawViewItemPipeArrowProps> = ({ direction, color, size }) => {
	const ARROW_STYLE = {
		up: {
			top: '50%',
			left: '50%',
			transform: `translate(-50%, -50%) scale(${size})`,
		},
		down: {
			top: '50%',
			left: '50%',
			transform: `translate(-50%, -50%) scale(${size})`,
		},
		left: {
			top: '50%',
			left: '50%',
			transform: `translate(-50%, -50%) scale(${size})`,
		},
		right: {
			top: '50%',
			left: '50%',
			transform: `translate(-50%, -50%) scale(${size})`,
		},
	};

	const ICONS = {
		up: ArrowUpwardOutlined,
		down: ArrowDownwardOutlined,
		left: ArrowBackOutlined,
		right: ArrowForwardOutlined,
	};

	const ArrowIcon = (ICONS as any)[direction];

	return (
		<ArrowIcon
			style={{
				position: 'absolute',
				fill: color,
				...(ARROW_STYLE as any)[direction],
			}}
		/>
	);
};

export default DrawViewItemPipeArrow;
