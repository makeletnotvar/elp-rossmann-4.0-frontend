import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

const GeneralIcon: React.FunctionComponent<SvgIconProps> = props => {
	return (
		<SvgIcon width='64' height='64' viewBox='0 0 64 64' {...props}>
			<g id='Layer_45' data-name='Layer 45'>
				<path d='m6.94 13.71h25.53c1.71 8.21 13.4 8.2 15.12 0h9.47a1.5 1.5 0 0 0 0-3h-9.47c-1.72-8.22-13.41-8.21-15.12 0h-25.53a1.5 1.5 0 0 0 0 3zm33.06-6.21a4.71 4.71 0 0 1 4.7 4.69c-.17 6.23-9.2 6.25-9.41 0a4.71 4.71 0 0 1 4.71-4.69z' />
				<path d='m57.06 30.5h-25.53c-1.71-8.21-13.4-8.21-15.12 0h-9.47a1.5 1.5 0 1 0 0 3h9.47c1.72 8.21 13.41 8.21 15.12 0h25.53a1.5 1.5 0 0 0 0-3zm-28.38 1.5c-.21 6.21-9.22 6.2-9.41 0 .19-6.23 9.23-6.22 9.41 0z' />
				<path d='m57.06 50.29h-9.47c-1.72-8.21-13.41-8.2-15.12 0h-25.53a1.5 1.5 0 1 0 0 3h25.53c1.71 8.22 13.41 8.21 15.12 0h9.47a1.5 1.5 0 0 0 0-3zm-17.06 6.21a4.71 4.71 0 0 1 -4.71-4.72c.21-6.23 9.24-6.19 9.41 0a4.71 4.71 0 0 1 -4.7 4.72z' />
			</g>
		</SvgIcon>
	);
};

export default GeneralIcon;
