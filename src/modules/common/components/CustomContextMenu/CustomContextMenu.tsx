import { ListItemIcon, ListItemText, Menu, MenuItem, SvgIconProps } from '@mui/material';
import { useAuth } from 'modules/common/selectors/auth';
import React, { FunctionComponent } from 'react';
import styles from './CustomContextMenu.module.scss';

export interface CustomContextMenuItemProps {
	label: string;
	onClick: () => void;
	icon?: MuiIconType | FunctionComponent<SvgIconProps>;
	disabled?: boolean;
	disableAndShow?: boolean;
	allowedUsers?: UserType[];
	devOnly?: boolean;
	devOrAdminOnly?: boolean;
	testId?: string;
	hideSeparator?: boolean;
}

interface CustomContextMenuProps {
	open: boolean;
	onClose: () => void;
	anchorEl?: HTMLElement | null;
	menuItems: CustomContextMenuItemProps[];
	customMenuItems?: React.ReactNode;
}

const CustomContextMenu: React.FC<CustomContextMenuProps> = ({ open, onClose, anchorEl, menuItems, customMenuItems }) => {
	const { user } = useAuth();
	return (
		<Menu
			style={{ padding: 0 }}
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'center',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			PaperProps={{
				style: {
					minWidth: 100,
					margin: 0,
					padding: 0,
				},
			}}
			open={open}
			onClose={onClose}
			className={styles.menu}
		>
			{menuItems.map((item, index) => {
				const Icon = item.icon ? item.icon : null;
				const hasAccess = item.allowedUsers
					? item.allowedUsers.includes(user?.type || 'NONE')
					: item.devOnly
					? user?.type === 'DEV'
					: item.devOrAdminOnly
					? (user?.type === 'DEV' || user?.type === 'ADMIN') && !item.disabled
					: !item.disabled;
				return (
					hasAccess && (
						<MenuItem
							key={index}
							data-testid={item.testId}
							style={{ borderBottom: item.hideSeparator || (menuItems || []).length - 1 === index ? 'none' : '1px solid #eee' }}
							onClick={() => {
								item.onClick();
								onClose();
							}}
							disableGutters
							disabled={item.disableAndShow}
							className={styles.menuItem}
						>
							{Icon && (
								<ListItemIcon style={{ justifyContent: 'center', minWidth: 10 }}>
									<Icon style={{ fontSize: '0.938rem' }} fontSize='small' />
								</ListItemIcon>
							)}
							<ListItemText style={{ fontSize: '0.813rem!important' }} primary={item.label} />
						</MenuItem>
					)
				);
			})}
			{customMenuItems}
		</Menu>
	);
};

export default CustomContextMenu;
