import { LockOutlined, SettingsOutlined } from '@mui/icons-material';
import { Badge, ListItemButton, ListItemIcon, ListItemText, styled, Typography, useTheme } from '@mui/material';
import cn from 'classnames';
import TooltipWrapper from 'modules/common/components/Layout/ASide/TooltipWrapper';
import * as React from 'react';
import useRouter from 'use-react-router';
import styles from './ASideMenuItem.module.scss';

export interface ASideMenuItemProps {
	isActive?: boolean;
	Icon?: React.ComponentType<any>;
	title: string;
	disabled?: boolean;
	premiumMarked?: boolean;
	route?: string | undefined;
	absoluteRoute?: string;
	onClick?: any;
	badge?: string;
	isOpen?: boolean;
	index: number;
	devOnly?: boolean;
	className?: string;
	onClose?: () => void;
}

export const StyledBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		top: '50%',
		left: '15%',
		border: '2px solid #32302e',
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

const ASideMenuItem: React.FC<ASideMenuItemProps> = ({
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
	onClose,
}) => {
	const theme = useTheme();
	const { history } = useRouter();

	const clickHandler = (evt: React.MouseEvent) => {
		if (onClick) {
			onClick();
		} else if (absoluteRoute) {
			window.open(`${import.meta.env.VITE_APP_HOST}/${absoluteRoute}`, '_self');
		} else {
			route && history.push(`/${route}`);
		}
		onClose && onClose();
	};

	return (
		<TooltipWrapper title={title} active={isOpen || false} index={index}>
			<ListItemButton
				key={title}
				disabled={disabled}
				className={cn(styles.item, {
					[styles.active]: isActive,
					[styles.isDarkMode]: theme.palette.mode === 'dark',
				})}
				classes={{ gutters: styles.gutters }}
				onClick={clickHandler}
			>
				<ListItemIcon className={styles.listItem}>
					{premiumMarked ? (
						<StyledBadge max={999} overlap='rectangular' badgeContent={'$'} className={className}>
							<Icon style={{ fontSize: '18px' }} />
						</StyledBadge>
					) : devOnly && !badge ? (
						<StyledBadgeCustomDev
							max={999}
							overlap='rectangular'
							badgeContent={
								<>
									<LockOutlined
										data-testid='module-dev'
										fontSize='small'
										style={{ backgroundColor: 'transparent', borderRadius: '50%', fontSize: '10px', padding: '1px', fill: '#303030' }}
									/>
								</>
							}
						>
							<Icon style={{ fontSize: '18px' }} />
						</StyledBadgeCustomDev>
					) : badge ? (
						<StyledBadgeCustom max={999} overlap='rectangular' className={className} badgeContent={badge}>
							<Icon style={{ fontSize: '18px' }} />
						</StyledBadgeCustom>
					) : (
						<Icon className={className} style={{ fontSize: '18px' }} />
					)}
				</ListItemIcon>
				<ListItemText
					primary={
						<Typography variant='body2' style={{ fontSize: '0.8rem' }}>
							{title}
						</Typography>
					}
				/>
			</ListItemButton>
		</TooltipWrapper>
	);
};

export default ASideMenuItem;
