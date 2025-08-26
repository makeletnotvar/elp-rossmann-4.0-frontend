import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { Formik } from 'formik';
import { theme } from 'modules/common/theme/materialTheme';
import React, { useState } from 'react';
import { StyleTransformer, StyleTransformerInputType, StyleTransformerType } from 'typings/styleTransformer';
import CancelButton from '../../Buttons/CancelButton';
import ConfirmButton from '../../Buttons/ConfirmButton';
import { UpdateItemParams } from '../../DrawView/DrawViewEditor/editingState';
import { DrawViewItem } from '../../DrawView/items/items';
import styles from './StyleTransformerDialog.module.scss';
import StyleTransformerDialogContent from './StyleTransformerDialogContent';

interface StyleTransformerDialogProps {
	isOpenStyleTransformerDialog: boolean;
	transformerId: string;
	inputType: StyleTransformerInputType;
	item: DrawViewItem;
	view: DrawView;
	updateItemParams: UpdateItemParams;
	styleTransformer: StyleTransformer;
	onClose: () => void;
	transformerEnumValues?: { key: string; value: string }[];
}

const INITIAL_VALUES: StyleTransformer = {
	pointRef: null,
	pointType: 'enum',
	active: false,
	name: 'Transformacja',
	styleTransformerInputType: StyleTransformerInputType.ENUM,
	type: StyleTransformerType.STATES,
	config: {} as any,
};

const StyleTransformerDialog: React.FC<StyleTransformerDialogProps> = ({
	isOpenStyleTransformerDialog,
	transformerId,
	inputType,
	view,
	styleTransformer,
	onClose,
	transformerEnumValues,
	updateItemParams,
	item,
}) => {
	const [transformationName, setTransformationName] = useState<string | undefined>('Transformacja');

	const submitHandler = (data: StyleTransformer) => {
		const transformer: StyleTransformer = {
			transformerId,
			...styleTransformer,
			...data,
			name: transformationName,
		};
		updateItemParams(item.id, {
			transformers: [...(item.transformers || []), transformer],
		});
	};

	return (
		<Dialog open={isOpenStyleTransformerDialog} onClose={onClose} maxWidth='lg' fullWidth fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<Formik initialValues={{ ...INITIAL_VALUES, ...styleTransformer }} onSubmit={submitHandler}>
				{props => {
					const { values, handleSubmit, setFieldValue } = props;
					return (
						<>
							<DialogTitle className={styles.dialogTitle}>
								<Typography component='span' variant='h6'>
									{styleTransformer.name || 'Transformacja'} ({transformerId})
								</Typography>
								<IconButton style={{ color: '#fff' }} size='small' onClick={onClose}>
									<CloseOutlined />
								</IconButton>
							</DialogTitle>
							<DialogContent className={styles.dialogContent}>
								<form className={styles.form} onSubmit={handleSubmit}>
									<StyleTransformerDialogContent
										inputType={inputType}
										view={view}
										transformerEnumValues={transformerEnumValues}
										values={values}
										setFieldValue={setFieldValue}
										setTransformationName={setTransformationName}
									/>
									<DialogActions>
										<CancelButton size='small' onClick={onClose}>
											ANULUJ
										</CancelButton>
										<ConfirmButton size='small'>ZAPISZ</ConfirmButton>
									</DialogActions>
								</form>
							</DialogContent>
						</>
					);
				}}
			</Formik>
		</Dialog>
	);
};

export default StyleTransformerDialog;
