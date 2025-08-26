import { AddOutlined, SaveOutlined } from '@mui/icons-material';
import { Fab, IconButton, Paper, Tooltip } from '@mui/material';
import DataPointsList from 'modules/data/components/DataPoints/DataPointsList/DataPointsList';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DataPoints.module.scss';

export interface DataPointsProps {
	points: Point[];
	fetched: boolean;
	fetching: boolean;
	onRemove: (uuid: string) => void;
	onAdd: () => void;
	onListSave: (points: string[]) => void;
	isListSaveEnabled: boolean;
	isSaving: boolean;
}

const DataPoints: React.FC<DataPointsProps> = ({ points, fetching, fetched, onRemove, onAdd, onListSave, isListSaveEnabled }) => {
	const { t } = useTranslation();
	const disabledActions = fetching;

	return (
		<>
			<Paper className={styles.listContainer}>
				<DataPointsList {...{ fetched, fetching, points }} onRemove={onRemove} />
				<Paper className={styles.actions}>
					<Tooltip title={t('data.messages.save_current_config')}>
						<span>
							<IconButton
								color='default'
								size='small'
								disabled={disabledActions || !isListSaveEnabled}
								onClick={() => onListSave(points.map(p => p.uuid || ''))}
							>
								<SaveOutlined />
							</IconButton>
						</span>
					</Tooltip>
					<Tooltip title={t('data.messages.add_point_to_chart')}>
						<span>
							<Fab data-testid='add-chart-point-button' color='primary' size='small' disabled={disabledActions || points.length >= 5} onClick={onAdd}>
								<AddOutlined />
							</Fab>
						</span>
					</Tooltip>
				</Paper>
			</Paper>
		</>
	);
};

export default DataPoints;
