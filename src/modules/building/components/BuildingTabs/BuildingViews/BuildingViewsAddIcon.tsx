import { Fab, Grow, Tooltip } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingViews.module.scss';

interface BuildingViewsAddIconProps {
	buildingUUID: string;
	onAdd: () => void;
}

const BuildingViewsAddIcon: React.FC<BuildingViewsAddIconProps> = ({ buildingUUID, onAdd }) => {
	const { t } = useTranslation('');

	return (
		<AuthDev>
			<div className={styles.addButtonContainer}>
				<Grow in={true}>
					<Tooltip title={t('buildings.messages.add_new_view')}>
						<Fab data-testid='add-building-view' color='primary' size='medium' onClick={onAdd}>
							<AddOutlined />
						</Fab>
					</Tooltip>
				</Grow>
			</div>
		</AuthDev>
	);
};

export default BuildingViewsAddIcon;
