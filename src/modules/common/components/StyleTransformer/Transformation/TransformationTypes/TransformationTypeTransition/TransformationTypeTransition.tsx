import { Typography } from '@mui/material';
import React from 'react';
import { StyleTransformer, StyleTransformerInputType, StyleTransformerTransitionConfig } from 'typings/styleTransformer';
import TransformationTypeComponentColor from '../../TransformationTypesComponents/TransformationTypeComponentColor';
import styles from './TransformationTypeTransition.module.scss';

interface TransformationTypeTransitionProps {
	point: Point;
	inputType: StyleTransformerInputType;
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
}

const EMPTY_PARAMS = {
	start: {
		input: 0,
		value: '#000000',
	},
	end: {
		input: 0,
		value: '#000000',
	},
};

const TransformationTypeTransition: React.FC<TransformationTypeTransitionProps> = ({ values, setFieldValue }) => {
	return (
		<div className={styles.container}>
			<Typography style={{ padding: '5px', paddingLeft: '0px' }} variant='body1'>
				Transformacja płynnego przejścia
			</Typography>
			<div className={styles.stateContainer}>
				<div className={styles.state}>
					<Typography>Start: </Typography>
					<input
						className={styles.value}
						type='number'
						defaultValue={
							(values.config as StyleTransformerTransitionConfig).start
								? (values.config as StyleTransformerTransitionConfig).start.input
								: EMPTY_PARAMS.start.input
						}
						onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setFieldValue('start.input', evt.target.value)}
					/>
					<TransformationTypeComponentColor
						index={0}
						value={
							(values.config as StyleTransformerTransitionConfig).start
								? ((values.config as StyleTransformerTransitionConfig).start.value as string)
								: EMPTY_PARAMS.start.value
						}
						valueKey='start.value'
						setFieldValue={setFieldValue}
					/>
				</div>
				<div className={styles.state}>
					<Typography>Stop: </Typography>
					<input
						className={styles.value}
						type='number'
						defaultValue={
							(values.config as StyleTransformerTransitionConfig).end ? (values.config as StyleTransformerTransitionConfig).end.input : EMPTY_PARAMS.start.input
						}
						onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setFieldValue('end.input', evt.target.value)}
					/>
					<TransformationTypeComponentColor
						index={1}
						value={
							(values.config as StyleTransformerTransitionConfig).end
								? ((values.config as StyleTransformerTransitionConfig).end.value as string)
								: EMPTY_PARAMS.start.value
						}
						valueKey='end.value'
						setFieldValue={setFieldValue}
					/>
				</div>
			</div>
		</div>
	);
};

export default TransformationTypeTransition;
