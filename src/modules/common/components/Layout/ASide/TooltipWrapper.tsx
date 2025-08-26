import { Tooltip } from '@mui/material';
import React from 'react';

interface TooltipWrapperProps {
	children: React.ReactNode;
	title: string;
	active: boolean;
	index: number;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ title, active, children, index }) => (
	<>
		{active ? (
			children
		) : (
			<Tooltip PopperProps={{ style: { marginLeft: -10 } }} title={title} placement='right' style={{ maxWidth: 40 }}>
				<span>{children as any}</span>
			</Tooltip>
		)}
	</>
);

export default TooltipWrapper;
