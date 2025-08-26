import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

const AdministratorIcon: React.FunctionComponent<SvgIconProps> = props => {
	return (
		<SvgIcon viewBox='0 0  24 24' {...props}>
			<g id='Icon'>
				<path d='m12 1.25c-5.933 0-10.75 4.817-10.75 10.75s4.817 10.75 10.75 10.75 10.75-4.817 10.75-10.75-4.817-10.75-10.75-10.75zm0 1.5c5.105 0 9.25 4.145 9.25 9.25s-4.145 9.25-9.25 9.25-9.25-4.145-9.25-9.25 4.145-9.25 9.25-9.25z'></path>
				<path d='m3.553 18.647c1.97 2.498 5.022 4.103 8.447 4.103s6.477-1.605 8.447-4.103l-.794-.694c-1.95-1.977-4.659-3.203-7.653-3.203-2.998 0-5.712 1.23-7.662 3.213.003-.003-.338.294-.785.684z'></path>
				<circle cx='12' cy='9.5' r='4.25'></circle>
			</g>
		</SvgIcon>
	);
};

export default AdministratorIcon;
