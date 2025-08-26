import { Box } from '@mui/material';
import cn from 'classnames';
import UINotificationsContainer from 'modules/common/components/UINotifications/UINotificationsContainer';
import { useAuth } from 'modules/common/selectors/auth';
import * as React from 'react';
import { useState } from 'react';
import useRouter from 'use-react-router';
import ASide from './ASide/ASide';
import Header from './Header/Header';
import styles from './Layout.module.scss';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { fetched, user } = useAuth();
	const {
		location: { pathname },
	} = useRouter();
	const [open, setOpen] = useState(false);

	const isAuthorized = fetched && Boolean(user);
	const isPasswordExpiredPage = pathname.includes('password-expired');
	const showHeader = isAuthorized;
	const showAside = isAuthorized && !isPasswordExpiredPage;

	return (
		<div className={styles.root}>
			{showHeader && <Header isOpen={open} onOpen={() => setOpen(true)} hideMenu={isPasswordExpiredPage} />}
			{showAside && <ASide isOpen={open} onClose={() => setOpen(false)} />}
			<Box
				component='div'
				className={cn(styles.pageContentWrapper, {
					[styles.unauthorized]: !isAuthorized,
					[styles.withoutHeader]: !showHeader,
				})}
				sx={{
					paddingLeft: { xs: 0, sm: '52px' },
				}}
			>
				{children}
			</Box>
			<UINotificationsContainer />
		</div>
	);
};

export default Layout;
