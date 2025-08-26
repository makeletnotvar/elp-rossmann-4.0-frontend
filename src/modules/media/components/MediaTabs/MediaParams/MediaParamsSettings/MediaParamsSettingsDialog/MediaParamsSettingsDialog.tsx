import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, useMediaQuery, useTheme } from '@mui/material';
import { FieldArray } from 'formik';
import { isArray } from 'lodash';
import CancelButton from 'modules/common/components/Buttons/CancelButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import Params from 'modules/common/components/Params/Params';
import { POINTS_LIST } from 'modules/media/constants/points';
import React, { useState } from 'react';
import styles from './MediaParamsSettingsDialog.module.scss';

interface MediaParamsSettingsDialogProps {
	open: boolean;
	valuesPoints?: string[];
	setFieldValue: any;
	onClose: () => void;
}

const MediaParamsSettingsDialog: React.FC<MediaParamsSettingsDialogProps> = ({ open, valuesPoints, setFieldValue, onClose }) => {
	const theme = useTheme();
	const [selectedPoints, setSelectedPoints] = useState<string[] | undefined>(valuesPoints);

	const valuesPointsCount = selectedPoints ? (isArray(selectedPoints) ? selectedPoints.length : 1) : 0;

	const handleCheckboxChange = (evt: any, checkedPoints: string[]) => {
		const { name, checked } = evt.target;
		let updatedPoints = isArray(checkedPoints) ? [...checkedPoints] : [checkedPoints];

		if (checked) {
			if (updatedPoints.length < 10) {
				updatedPoints = [...updatedPoints, name];
			}
		} else {
			if (updatedPoints.length > 1) {
				updatedPoints = updatedPoints.filter(point => point !== name);
			}
		}
		setSelectedPoints(updatedPoints);
	};

	const onChoose = () => {
		setFieldValue('p', selectedPoints);
		onClose();
	};

	const isDisabledPoint = (xid: string) => {
		const isDiabledPoint = !selectedPoints!.includes(xid) && valuesPointsCount >= 10;
		return isDiabledPoint;
	};

	const isMobileSize = useMediaQuery(theme.breakpoints.down('xs'));

	return (
		<Dialog {...{ open, onClose }} className={styles.dialog} maxWidth='xl' fullWidth fullScreen={isMobileSize}>
			<DialogTitle id='draggable-dialog-title' style={{ paddingBottom: 5 }}>
				Punkty ({valuesPointsCount} z 10)
			</DialogTitle>
			<DialogContent className={styles.content}>
				<FieldArray name='p'>
					{() => (
						<>
							<Params title='Główny' hideCount className={styles.params} collapsable={isMobileSize}>
								{POINTS_LIST.MAIN.map(point => (
									<React.Fragment key={point.xid}>
										<div>
											<FormControlLabel
												className={styles.formControl}
												control={
													<Checkbox
														name={point.xid}
														checked={selectedPoints && selectedPoints.includes(point.xid)}
														onChange={event => handleCheckboxChange(event, selectedPoints || [])}
														color='primary'
													/>
												}
												disabled={isDisabledPoint(point.xid)}
												label={point.name}
											/>
										</div>
										{point.divider && point.divider === true && <div className={styles.divider}></div>}
									</React.Fragment>
								))}
							</Params>
							<Params title='Klimatyzacja' hideCount className={styles.params} collapsable={isMobileSize}>
								{POINTS_LIST.AIRCONDITIONING.map(point => (
									<React.Fragment key={point.xid}>
										<div>
											<FormControlLabel
												className={styles.formControl}
												control={
													<Checkbox
														name={point.xid}
														checked={selectedPoints && selectedPoints.includes(point.xid)}
														onChange={event => handleCheckboxChange(event, selectedPoints || [])}
														color='primary'
													/>
												}
												disabled={isDisabledPoint(point.xid)}
												label={point.name}
											/>
										</div>
										{point.divider && point.divider === true && <div className={styles.divider}></div>}
									</React.Fragment>
								))}
							</Params>
						</>
					)}
				</FieldArray>
			</DialogContent>
			<DialogActions style={{ padding: 10 }}>
				<CancelButton onClick={onClose}>Anuluj</CancelButton>
				<ConfirmButton onClick={onChoose} disabled={valuesPointsCount === 0}>
					Wybierz
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

export default MediaParamsSettingsDialog;
