import { ExitToAppOutlined, MenuOutlined, PersonOutlined } from '@mui/icons-material';
import { AppBar, Box, Divider, IconButton, MenuItem, Popover, Toolbar, Tooltip, Typography } from '@mui/material';
import cn from 'classnames';
import { APP_VERSION } from 'config/version';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { authActions } from 'modules/common/redux/auth';
import { useAuth } from 'modules/common/selectors/auth';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './Header.module.scss';

interface HeaderProps {
	isOpen: boolean;
	onOpen: () => void;
	hideMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isOpen, onOpen }) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { user } = useAuth();
	const userLabel = user ? user.username : '';
	const { history } = useRouter();

	const isMenuOpen = Boolean(anchorEl);

	function handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
		setAnchorEl(event.currentTarget);
	}

	function handleMenuClose() {
		setAnchorEl(null);
	}

	function handleLogout() {
		handleMenuClose();
		dispatch(authActions.logout.request());
	}

	function handleProfile() {
		if (user) {
			history.push(`/user/${user.uuid}/info`);
		}
		handleMenuClose();
	}

	const renderMenu = (
		<Popover
			open={Boolean(anchorEl)}
			anchorEl={anchorEl}
			onClose={handleMenuClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			PaperProps={{
				style: {
					marginTop: 5,
					minWidth: 160,
					borderRadius: 8,
					boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
				},
			}}
		>
			<Box sx={{ padding: 1 }}>
				<Typography sx={{ fontSize: '0.875rem' }} variant='body1' noWrap>
					{userLabel}
				</Typography>
			</Box>
			<Divider sx={{ m: '0!important' }} />
			<MenuItem disableGutters sx={{ padding: 0.5, fontSize: '0.875rem', gap: 1 }} onClick={handleProfile}>
				<PersonOutlined fontSize='small' sx={{ color: '#000', fontSize: 22, pl: 0.5 }} />
				{t('auth.profile')}
			</MenuItem>
			<Divider sx={{ m: '0!important' }} />
			<MenuItem disableGutters sx={{ padding: 0.5, fontSize: '0.875rem', gap: 1 }} onClick={handleLogout}>
				<ExitToAppOutlined fontSize='small' sx={{ color: '#000', fontSize: 22, pl: 0.5 }} />
				{t('auth.logout')}
			</MenuItem>
		</Popover>
	);

	return (
		<div className={cn(styles.grow, styles.root, { [styles.shifted]: isOpen })}>
			<AppBar position='static' style={{ maxHeight: 54, minHeight: 54 }} elevation={0}>
				<Toolbar style={{ maxHeight: 54, minHeight: 54, background: '#fff', paddingLeft: '23px', paddingRight: '23px' }}>
					<IconButton edge='start' className={styles.menuButton} color='inherit' aria-label='Open drawer' onClick={onOpen}>
						<MenuOutlined style={{ color: '#000' }} />
					</IconButton>
					<img src={`${import.meta.env.VITE_APP_PUBLIC_URL}/images/logoHeader.png`} className={styles.logo} />
					<Box component='span' sx={{ display: 'none', opacity: 0.7, fontSize: '0.7em' }}>
						{APP_VERSION}
					</Box>
					<label style={{ display: 'none', opacity: 0.7, fontSize: '0.7em' }}>{APP_VERSION}</label>
					<div className={styles.grow} />
					<Tooltip title={userLabel}>
						<IconButton edge='end' aria-owns={isMenuOpen ? 'material-appbar' : undefined} aria-haspopup='true' onClick={handleProfileMenuOpen} color='default'>
							<PersonOutlined style={{ color: '#000' }} />
						</IconButton>
					</Tooltip>
				</Toolbar>
			</AppBar>
			{renderMenu}
		</div>
	);
};

export default Header;
