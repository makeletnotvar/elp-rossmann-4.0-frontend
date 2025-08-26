import { Menu, MenuItem } from '@mui/material';
import React from 'react';
import ConfirmButton from '../../Buttons/ConfirmButton';
import styles from './MenuButton.module.scss';

export interface MenuButtonItem {
	label: string;
	onClick: () => void;
	icon?: any;
	disabled?: boolean;
	fn?: boolean;
}

interface MenuButtonProps {
	label: string;
	items?: MenuButtonItem[];
	onClick?: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, items = [], onClick }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);

	function handleClick(event: any) {
		Boolean(items.length) && setAnchorEl(event.currentTarget);
		onClick && onClick();
	}

	function handleClose() {
		setAnchorEl(null);
	}

	return (
		<>
			<ConfirmButton noSubmit onClick={handleClick} className={styles.button}>
				{label}
			</ConfirmButton>
			<Menu className={styles.menu} id='simple-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} style={{ marginTop: 15 }}>
				{items.map((item: MenuButtonItem, index: number) => {
					const Icon = item.icon || null;
					return (
						<MenuItem
							dense
							className={styles.menuItem}
							disabled={item.disabled || false}
							onClick={
								item.fn
									? item.onClick
									: () => {
											handleClose();
											item.onClick();
									  }
							}
							key={index}
						>
							{item.label}
							{Icon && <Icon />}
						</MenuItem>
					);
				})}
			</Menu>
		</>
	);
};

export default MenuButton;
