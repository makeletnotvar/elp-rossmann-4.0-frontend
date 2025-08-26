import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { usePoint } from 'modules/common/redux/points';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleTransformer, StyleTransformerInputType, StyleTransformerType } from 'typings/styleTransformer';
import { fetchAsyncPoints } from '../../DrawView/items/DrawViewItemValue/DrawViewItemValuePointSelector';
import { default as StyleTransformerPointSelector } from '../StyleTransformerPointSelector/StyleTransformerPointSelector';
import { default as StyleTransformerTransformation } from '../Transformation/Transformation';
import StyleTransformerTransormationTypeSelector from '../Transformation/TransormationTypeSelector/TransormationTypeSelector';
import styles from './StyleTransformerDialog.module.scss';

interface StyleTransformerDialogContentProps {
	inputType: StyleTransformerInputType;
	view: DrawView;
	transformerEnumValues?: { key: string; value: string }[];
	values: StyleTransformer;
	setFieldValue: {
		(
			field: 'transformerId' | 'pointRef' | 'type' | 'name' | 'config' | 'pointType' | 'active' | 'styleTransformerInputType',
			value: any,
			shouldValidate?: boolean | undefined
		): void;
		(field: string, value: any): void;
	};
	setTransformationName: (transformationName: string) => void;
}

const StyleTransformerDialogContent: React.FC<StyleTransformerDialogContentProps> = ({
	inputType,
	view,
	transformerEnumValues,
	values,
	setFieldValue,
	setTransformationName,
}) => {
	const point = usePoint(values.pointRef?.uuid || '');
	const { t } = useTranslation();

	const onSetSelectedType = (selectedType: StyleTransformerType) => {
		setFieldValue('type', selectedType);
		setFieldValue('config', {});
	};

	return (
		<div className={styles.container}>
			<div className={styles.mainOptions}>
				<div className={styles.mainOptionsLeft}>
					<StyleTransformerPointSelector
						pointRef={values.pointRef}
						asyncData={fetchAsyncPoints(view?.building?.uuid as string, '')}
						setFieldValue={setFieldValue}
					/>
					{point && (
						<>
							<TextField
								label='Nazwa tranformacji'
								variant='outlined'
								size='small'
								className={styles.value}
								type='text'
								defaultValue={values.name || ''}
								onChange={evt => setTransformationName(evt.target.value)}
								style={{ padding: '0!important' }}
							/>
							<StyleTransformerTransormationTypeSelector selectedType={values.type} setSelectedType={onSetSelectedType} inputType={inputType} />
							<FormControlLabel
								className={styles.mainOptionsActive}
								label={t('general.active')}
								control={<Checkbox size='small' checked={values.active || false} onChange={evt => setFieldValue('active', evt.target.checked)} />}
							/>
						</>
					)}
				</div>
				{/* {pointValue && (
					<div className={styles.mainOptionsRight}>
						<Typography>Wartość punktu</Typography>
						<Typography color='textSecondary' variant='body2'>
							({pointValue})
						</Typography>
					</div>
				)} */}
			</div>
			{point && (
				<div className={styles.transformation}>
					<StyleTransformerTransformation
						inputType={inputType}
						point={point}
						transformerEnumValues={transformerEnumValues}
						values={values}
						setFieldValue={setFieldValue}
					/>
				</div>
			)}
		</div>
	);
};

export default StyleTransformerDialogContent;
