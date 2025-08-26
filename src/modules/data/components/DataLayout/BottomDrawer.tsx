import { BubbleChartOutlined } from '@mui/icons-material';
import { SwipeableDrawer, Typography } from '@mui/material';
import DataPointsContainer from 'modules/data/components/DataPoints/DataPointsContainer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DataLayout.module.scss';

interface DrawerProps {
	open: boolean;
	setOpen: (nextValue: boolean) => void;
}

const BottomDrawer: React.FC<DrawerProps> = ({ open, setOpen }) => {
	const { t } = useTranslation();
	return (
		<SwipeableDrawer anchor='bottom' open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} className={styles.drawer}>
			<Typography variant='h1' className={styles.title}>
				<BubbleChartOutlined style={{ marginRight: 10 }} />
				<span>{t('data.messages.configure_chart')}</span>
			</Typography>
			<div className={styles.drawerContent}>
				<DataPointsContainer setOpen={setOpen} />
			</div>
		</SwipeableDrawer>
	);
};

export default BottomDrawer;
