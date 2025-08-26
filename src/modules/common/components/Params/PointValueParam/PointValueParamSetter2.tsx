import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { CloseOutlined, SettingsOutlined } from '@mui/icons-material';
import { t } from 'i18next';
import React, { useState } from 'react';
import CancelButton from '../../Buttons/CancelButton';
import ConfirmButton from '../../Buttons/ConfirmButton';
import Setter2 from '../Setters/Setter2';
import styles from './PointValueParam.module.scss';

interface PointValueParamSetter2Props {
	point: Point;
	value: number;
	fetching: boolean;
	onSave: (nextValue: number) => void;
	onCancel: () => void;
}

const PointValueParamSetter2: React.FC<PointValueParamSetter2Props> = ({ point, value, fetching, onSave, onCancel }) => {
	const [isValid, setIsValid] = useState<boolean>(true);
	const [editorValue, setEditorValue] = useState<number>(value);

	return (
		<Dialog open={true} onClose={onCancel} fullWidth maxWidth='xs'>
			<DialogTitle className={styles.dialogTitle}>
				<Box style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
					<SettingsOutlined style={{ fontSize: '1.125rem' }} />
					<Typography style={{ fontSize: '1rem' }}>Ustaw nową wartość</Typography>
				</Box>
				<IconButton size='small' onClick={onCancel}>
					<CloseOutlined fontSize='inherit' />
				</IconButton>
			</DialogTitle>
			<DialogContent className={styles.dialogContent}>
				<Typography style={{ fontSize: '0.875rem', marginBottom: 2 }}>{point?.name}:</Typography>
				<Setter2 {...{ point, value: editorValue, onChange: setEditorValue, setIsValid }} />
			</DialogContent>
			<DialogActions style={{ paddingLeft: 15, paddingRight: 15 }}>
				<CancelButton size='small' onClick={onCancel}>
					{t('general.cancel')}
				</CancelButton>
				<ConfirmButton disabled={!isValid} size='small' onClick={() => onSave(editorValue)}>
					{t('general.set')}
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

export default PointValueParamSetter2;
