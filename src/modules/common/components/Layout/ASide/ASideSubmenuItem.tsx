import { ExpandLess, ExpandMore, LockOutlined, SettingsOutlined } from '@mui/icons-material';
import { Badge, Collapse, List, ListItemButton, ListItemIcon, ListItemText, styled, Typography } from '@mui/material';
import cn from 'classnames';
import TooltipWrapper from 'modules/common/components/Layout/ASide/TooltipWrapper';
import * as React from 'react';
import useRouter from 'use-react-router';
import ASideMenuItem, { ASideMenuItemProps } from './ASideMenuItem';
import styles from './ASideMenuItem.module.scss';

interface SubMenuItem extends Omit<ASideMenuItemProps, 'index'> {
	key?: string;
}

interface ASideSubMenuItemProps extends ASideMenuItemProps {
	childrenItems?: SubMenuItem[];
}

export const StyledBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		top: '50%',
		left: '15%',
		border: `2px solid #32302e`,
		color: '#ffffff',
		fontWeight: 600,
		width: 20,
		height: 20,
		fontSize: 12,
	},
}));

export const StyledBadgeCustom = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		maxWidth: 25,
		minWidth: 15,
		height: 15,
		backgroundColor: '#205de0',
		color: '#fff',
	},
}));

export const StyledBadgeCustomDev = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		top: 0,
		right: 22,
		border: 'none',
		color: '#ffffff',
		fontWeight: 600,
		backgroundColor: 'transparent',
		borderRadius: '50%',
		width: 20,
		height: 20,
		fontSize: 12,
	},
}));

const ASideSubMenuItem: React.FC<ASideSubMenuItemProps> = ({
	isActive = false,
	disabled = false,
	Icon = SettingsOutlined,
	title,
	premiumMarked = false,
	route,
	absoluteRoute,
	onClick,
	badge,
	isOpen,
	index,
	className,
	devOnly,
	childrenItems = [],
}) => {
	const { history } = useRouter();
	const [open, setOpen] = React.useState(false);

	const clickHandler = (evt: React.MouseEvent) => {
		if (childrenItems.length > 0) {
			setOpen(!open);
		} else if (onClick) {
			onClick();
		} else if (absoluteRoute) {
			window.open(`${import.meta.env.VITE_APP_HOST}/energy`, '_self');
		} else {
			route && history.push(`/${route}`);
		}
	};

	const renderIcon = () => {
		if (premiumMarked) {
			return (
				<StyledBadge max={999} overlap='rectangular' badgeContent={'$'} className={className}>
					<Icon style={{ fontSize: '18px' }} />
				</StyledBadge>
			);
		}
		if (devOnly && !badge) {
			return (
				<StyledBadgeCustomDev
					max={999}
					overlap='rectangular'
					badgeContent={<LockOutlined fontSize='small' style={{ fontSize: '10px', padding: '1px', fill: '#303030' }} />}
				>
					<Icon style={{ fontSize: '18px' }} />
				</StyledBadgeCustomDev>
			);
		}
		if (badge) {
			return (
				<StyledBadgeCustom max={999} overlap='rectangular' className={className} badgeContent={badge}>
					<Icon style={{ fontSize: '18px' }} />
				</StyledBadgeCustom>
			);
		}
		return <Icon className={className} style={{ fontSize: '18px' }} />;
	};

	return (
		<>
			<TooltipWrapper title={title} active={isOpen || false} index={index}>
				<ListItemButton
					disabled={disabled}
					onClick={clickHandler}
					className={cn(styles.item, {
						[styles.active]: isActive || open,
					})}
					classes={{ gutters: styles.gutters }}
				>
					<ListItemIcon className={styles.listItem}>{renderIcon()}</ListItemIcon>
					<ListItemText
						primary={
							<Typography variant='body2' style={{ fontSize: '0.8rem' }}>
								{title}
							</Typography>
						}
					/>
					{childrenItems.length > 0 ? open ? <ExpandLess /> : <ExpandMore /> : null}
				</ListItemButton>
			</TooltipWrapper>
			{childrenItems.length > 0 && (
				<Collapse
					className={cn({
						[styles.activeSubmenu]: isActive || open,
					})}
					in={open}
					timeout='auto'
					unmountOnExit
				>
					<List component='div' disablePadding>
						{childrenItems.map((child, idx) => (
							<ASideMenuItem key={child.title + idx} index={index + idx + 1} isOpen={isOpen} {...child} />
						))}
					</List>
				</Collapse>
			)}
		</>
	);
};

export default ASideSubMenuItem;
