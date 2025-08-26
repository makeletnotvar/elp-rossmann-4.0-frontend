import { LockOutlined } from '@mui/icons-material';
import { Badge, ListItem, ListItemIcon, styled, Tooltip } from '@mui/material';
import cn from 'classnames';
import { ADMIN, DEV } from 'constants/user';
import { useBuildingState } from 'modules/building/redux/building';
import { useAuth } from 'modules/common/selectors/auth';
import { getPriorityClassName } from 'modules/events_v2/helpers/eventsV2';
import React, { CSSProperties } from 'react';
import styles from './VertIconsList.module.scss';

interface VertIconsListItemProps {
	title?: string;
	icon: any;
	className?: string;
	badgeClassName?: string;
	size?: number;
	active?: boolean;
	onClick: (evt: any) => void;
	badge?: string;
	index?: number;
	disabled?: boolean;
	devOnly?: boolean;
	devOrAdminOnly?: boolean;
	permission?: 0 | 1 | 2;
	alarmsMaxPriority?: EventPriority;
	testId?: string;
}

const VertIconsListItem: React.FC<VertIconsListItemProps> = ({
	icon: Icon,
	className,
	badgeClassName,
	size,
	active,
	title,
	onClick,
	badge,
	index = 0,
	disabled = false,
	devOnly = false,
	devOrAdminOnly = false,
	alarmsMaxPriority,
	permission,
	testId,
}) => {
	const { user } = useAuth();
	const { building } = useBuildingState();
	const isDevUserLogged = user && user.type === DEV;
	const isDevOrAdminUserLogged = user && (user.type === DEV || user.type === ADMIN);

	const style: CSSProperties = {};

	if (size) {
		style.width = size;
		style.height = size;
	}

	return (
		<>
			{devOnly && isDevUserLogged && permission && building?.permissions === permission ? (
				<Tooltip PopperProps={{ style: { marginLeft: -10 } }} placement='right' title={title ? title : ''} enterDelay={100}>
					<ListItem className={cn(styles.item, className, { [styles.active]: active })} style={style} onClick={onClick} data-testid={testId}>
						<BadgeWrapper alarmsMaxPriority={alarmsMaxPriority} devOnly>
							<ListItemIcon classes={{ root: styles.listItem }} style={{ justifyContent: 'center' }}>
								<Icon style={{ margin: 'auto', fontSize: '18px' }} />
							</ListItemIcon>
						</BadgeWrapper>
					</ListItem>
				</Tooltip>
			) : devOrAdminOnly && isDevOrAdminUserLogged && permission && building?.permissions === permission ? (
				<Tooltip PopperProps={{ style: { marginLeft: -10 } }} placement='right' title={title ? title : ''} enterDelay={100}>
					<ListItem className={cn(styles.item, className, { [styles.active]: active })} style={style} onClick={onClick} data-testid={testId}>
						<BadgeWrapper alarmsMaxPriority={alarmsMaxPriority} badge={badge}>
							<ListItemIcon classes={{ root: styles.listItem }} style={{ justifyContent: 'center' }}>
								<Icon style={{ margin: 'auto', fontSize: '18px' }} />
							</ListItemIcon>
						</BadgeWrapper>
					</ListItem>
				</Tooltip>
			) : devOnly && isDevUserLogged ? (
				<Tooltip PopperProps={{ style: { marginLeft: -10 } }} placement='right' title={title ? title : ''} enterDelay={100}>
					<ListItem className={cn(styles.item, className, { [styles.active]: active })} style={style} onClick={onClick} data-testid={testId}>
						<BadgeWrapper alarmsMaxPriority={alarmsMaxPriority} devOnly>
							<ListItemIcon classes={{ root: styles.listItem }} style={{ justifyContent: 'center' }}>
								<Icon style={{ margin: 'auto', fontSize: '18px' }} />
							</ListItemIcon>
						</BadgeWrapper>
					</ListItem>
				</Tooltip>
			) : devOrAdminOnly && isDevOrAdminUserLogged ? (
				<Tooltip PopperProps={{ style: { marginLeft: -10 } }} placement='right' title={title ? title : ''} enterDelay={100}>
					<ListItem className={cn(styles.item, className, { [styles.active]: active })} style={style} onClick={onClick} data-testid={testId}>
						<BadgeWrapper alarmsMaxPriority={alarmsMaxPriority} badge={badge}>
							<ListItemIcon classes={{ root: styles.listItem }} style={{ justifyContent: 'center' }}>
								<Icon style={{ margin: 'auto', fontSize: '18px' }} />
							</ListItemIcon>
						</BadgeWrapper>
					</ListItem>
				</Tooltip>
			) : !devOrAdminOnly && !devOnly && permission ? (
				<>
					{building?.permissions === permission && (
						<Tooltip PopperProps={{ style: { marginLeft: -10 } }} placement='right' title={title ? title : ''} enterDelay={100}>
							<ListItem className={cn(styles.item, className, { [styles.active]: active })} style={style} onClick={onClick} data-testid={testId}>
								<BadgeWrapper alarmsMaxPriority={alarmsMaxPriority} badge={badge}>
									<ListItemIcon classes={{ root: styles.listItem }} style={{ justifyContent: 'center' }}>
										<Icon style={{ margin: 'auto', fontSize: '18px' }} />
									</ListItemIcon>
								</BadgeWrapper>
							</ListItem>
						</Tooltip>
					)}
				</>
			) : (
				!devOrAdminOnly &&
				!devOnly &&
				!permission && (
					<Tooltip PopperProps={{ style: { marginLeft: -10 } }} placement='right' title={title ? title : ''} enterDelay={100}>
						<ListItem className={cn(styles.item, className, { [styles.active]: active })} style={style} onClick={onClick} data-testid={testId}>
							<BadgeWrapper alarmsMaxPriority={alarmsMaxPriority} badge={badge}>
								<ListItemIcon classes={{ root: styles.listItem }} style={{ justifyContent: 'center' }}>
									<Icon style={{ margin: 'auto', fontSize: '18px' }} />
								</ListItemIcon>
							</BadgeWrapper>
						</ListItem>
					</Tooltip>
				)
			)}
		</>
	);
};

const StyledBadgeCustom = styled(Badge)(() => ({
	'& .MuiBadge-badge': {
		right: 19,
		top: 0,
		maxWidth: '25px',
		minWidth: '15px',
		height: '15px',
		backgroundColor: '#205de0',
		color: '#fff',
	},
}));

const StyledBadgeCustomDev = styled(Badge)(() => ({
	'& .MuiBadge-badge': {
		top: 0,
		right: 45,
		border: `none`,
		fontWeight: 600,
		color: '#ffffff',
		borderRadius: '50%',
		width: '20px',
		height: '20px',
		fontSize: '12px',
	},
}));

const BadgeWrapper: React.FC<{ devOnly?: boolean; badge?: string; badgeClassName?: string; alarmsMaxPriority?: EventPriority; children: React.ReactNode }> = ({
	devOnly,
	badge,
	badgeClassName,
	children,
	alarmsMaxPriority,
}) => {
	return (
		<>
			{devOnly && !badge ? (
				<StyledBadgeCustomDev
					max={99}
					overlap='rectangular'
					badgeContent={
						<>
							<LockOutlined fontSize='small' style={{ backgroundColor: '', borderRadius: '50%', fontSize: '10px', padding: '1px', fill: '#303030' }} />
						</>
					}
				>
					{children}
				</StyledBadgeCustomDev>
			) : badge ? (
				<StyledBadgeCustom
					max={99}
					overlap='rectangular'
					badgeContent={badge}
					className={alarmsMaxPriority ? getPriorityClassName(alarmsMaxPriority || 'NONE', styles) : badgeClassName}
				>
					{children}
				</StyledBadgeCustom>
			) : (
				<>{children}</>
			)}
		</>
	);
};

export default VertIconsListItem;
