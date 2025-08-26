import { ChevronLeftOutlined, ChevronRightOutlined } from '@mui/icons-material';
import { Drawer, IconButton } from '@mui/material';
import cn from 'classnames';
import { useIntervalEventsCountRequests } from 'modules/common/components/Layout/ASide/asideHooks';
import React from 'react';
import AuthWrapper from '../../../containers/AuthWrapper';
import ASideMenu from './ASideMenu';
import classes from './ASideStyles.module.scss';

interface MaterialHeaderProps {
	isOpen: boolean;
	onClose: () => void;
}

const ASide: React.FC<MaterialHeaderProps> = ({ isOpen, onClose }) => {
	useIntervalEventsCountRequests();

	return (
		<Drawer
			variant='permanent'
			className={cn(classes.drawer, {
				[classes.drawerOpen]: isOpen,
				[classes.drawerClose]: !isOpen,
			})}
			classes={{
				paper: cn({
					[classes.drawerOpen]: isOpen,
					[classes.drawerClose]: !isOpen,
				}),
			}}
			open={isOpen}
		>
			<div className={classes.toolbar}>
				<IconButton onClick={onClose}>{isOpen ? <ChevronLeftOutlined /> : <ChevronRightOutlined />}</IconButton>
			</div>
			<AuthWrapper>
				<ASideMenu isOpen={isOpen} onClose={onClose} isDebuggingEnabled={false} />
			</AuthWrapper>
		</Drawer>
	);
};

export default ASide;
