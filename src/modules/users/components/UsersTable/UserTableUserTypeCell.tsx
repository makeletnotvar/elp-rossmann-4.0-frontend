import { Avatar } from '@mui/material';
import * as React from 'react';

const UserTableUserTypeCell: React.FC<any> = ({ value, row }) => {
	const active = row.active;

	const AVATAR_COLOR = {
		DEV: '#d20962',
		ADMIN: '#037ef3',
		USER: '#52565e',
	};

	return (
		<Avatar
			style={{
				height: !active ? '16px' : '20px',
				width: !active ? '16px' : '20px',
				fontSize: !active ? '7px' : '10px',
				opacity: !active ? 0.5 : 1,
				backgroundColor: (AVATAR_COLOR as any)[value as any],
				margin: 'auto auto',
			}}
		>
			{(value || '').split('')[0].toUpperCase()}
		</Avatar>
	);
};

export default UserTableUserTypeCell;
