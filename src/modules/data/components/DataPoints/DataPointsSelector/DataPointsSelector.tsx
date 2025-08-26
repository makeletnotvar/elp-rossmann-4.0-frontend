import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import CancelButton from 'modules/common/components/Buttons/CancelButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import DataPointsSelectorContent from 'modules/data/components/DataPoints/DataPointsSelector/DataPointsSelectorContent';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DataPointsSelector.module.scss';

export interface DataPointsSelectorProps {
	onClose: () => void;
	onAdd: (nextPoint: string) => void;
	currentSelectedPoints: string[];
	onBuildingSelect: (building: string) => void;
	lastSelectedBuilding: string | null;
}

const DataPointsSelector: React.FC<DataPointsSelectorProps> = ({ onClose, currentSelectedPoints, onAdd, onBuildingSelect, lastSelectedBuilding }) => {
	const [selected, setSelected] = useState<string>();
	const { t } = useTranslation();
	const theme = useTheme();

	const handleSubmit = () => {
		if (selected) {
			onAdd(selected);
			onClose();
		}
	};

	return (
		<Dialog open={true} onClose={onClose} maxWidth='xl' fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<DialogTitle className={styles.title}>{t('data.messages.add_point_to_chart')}</DialogTitle>
			<DialogContent className={styles.content}>
				<DataPointsSelectorContent
					selected={selected}
					onSelect={setSelected}
					currentSelectedPoints={currentSelectedPoints}
					onBuildingSelect={onBuildingSelect}
					lastSelectedBuilding={lastSelectedBuilding}
				/>
			</DialogContent>
			<DialogActions className={styles.actions}>
				<CancelButton onClick={onClose}>Anuluj</CancelButton>
				<ConfirmButton onClick={handleSubmit} disabled={!selected}>
					{t('data.messages.select_point')}
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

export default DataPointsSelector;
