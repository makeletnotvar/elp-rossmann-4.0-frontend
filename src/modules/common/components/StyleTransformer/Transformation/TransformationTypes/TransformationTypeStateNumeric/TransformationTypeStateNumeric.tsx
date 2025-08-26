import { IconButton, Typography } from '@mui/material';
import { AddOutlined, ClearOutlined } from '@mui/icons-material';
import React from 'react';
import Select from 'react-select';
import { StyleTransformer, StyleTransformerInputType, StyleTransformerOperator, StyleTransformerStatesConfig } from 'typings/styleTransformer';
import { StyleTransformerInput } from '../../TransformationTypesComponents/StyleTransformerInputComponent';
import styles from './TransformationTypeStateNumeric.module.scss';

interface TransformationTypeStateNumericProps {
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

const EMPTY_PARAM = {
	input: 0,
	operator: StyleTransformerOperator.EQUAL,
	value: null,
};

const TransformationTypeStateNumeric: React.FC<TransformationTypeStateNumericProps> = ({ point, inputType, transformerEnumValues, values, setFieldValue }) => {
	const transformerConfig = values.config as StyleTransformerStatesConfig;

	const StyleTransformerInputComponent = StyleTransformerInput[inputType];

	const OPERATORS = {
		[StyleTransformerOperator.EQUAL]: '=',
		[StyleTransformerOperator.GREATER]: '>',
		[StyleTransformerOperator.GREATER_EQUAL]: '>=',
		[StyleTransformerOperator.LOWER]: '<',
		[StyleTransformerOperator.LOWER_EQUAL]: '<=',
	};

	const addParamHandler = () => {
		const nextParams = [
			...((values.config as StyleTransformerStatesConfig).states || []),
			{ ...EMPTY_PARAM, value: inputType === StyleTransformerInputType.COLOR ? '#000000' : null },
		];
		setFieldValue('config.states', nextParams);
	};

	const updateSingleParam = (paramIndex: number, target: 'input' | 'operator' | 'value', inputValue: string | number) => {
		const nextParams = (values.config as StyleTransformerStatesConfig).states.map(({ input, operator, value }, index) => {
			if (paramIndex === index) {
				const nextParamName = target === 'input' ? inputValue : input;
				const nextOperator = target === 'operator' ? inputValue : operator;
				const nextValue = target === 'value' ? inputValue : value;
				return {
					input: nextParamName,
					operator: nextOperator,
					value: nextValue,
				};
			} else {
				return { input, operator, value };
			}
		});
		setFieldValue('config.states', nextParams);
	};

	const removeSingleParam = (index: number) => {
		const nextParams = (values.config as StyleTransformerStatesConfig).states.filter((_, i) => i !== index);
		setFieldValue('config.states', nextParams);
	};

	return (
		<div className={styles.container}>
			<div className={styles.addTransform}>
				<Typography variant='body1'>Transformacja stanu numerycznego</Typography>
				<IconButton size='small' onClick={addParamHandler}>
					<AddOutlined />
				</IconButton>
			</div>
			<div className={styles.stateContainer}>
				{((values.config as StyleTransformerStatesConfig).states || []).map(({ input, operator, value }, index) => {
					return (
						<div className={styles.state} key={index}>
							<input
								className={styles.value}
								type='number'
								step={(point.customRender as NumericRender).step}
								defaultValue={input}
								onChange={(evt: React.ChangeEvent<HTMLInputElement>) => updateSingleParam(index, 'input', Number(evt.target.value))}
							/>
							<Select
								value={{ value: operator || StyleTransformerOperator.EQUAL, label: (OPERATORS as any)[operator || StyleTransformerOperator.EQUAL] }}
								onChange={(option: any) => updateSingleParam(index, 'operator', option.value)}
								options={Object.entries(OPERATORS).map(([key, operator]) => ({ value: key, label: operator }))}
								isOptionDisabled={item =>
									(transformerConfig && transformerConfig.states.map(state => state.operator).includes(item.value as StyleTransformerOperator)) ||
									(values.config as StyleTransformerStatesConfig).states.map(state => state.operator).includes(item.value as StyleTransformerOperator) ||
									false
								}
								maxMenuHeight={200}
								className={styles.stateSelector}
							/>
							<StyleTransformerInputComponent
								index={index}
								value={value || ''}
								updateSingleParam={updateSingleParam}
								transformerEnumValues={transformerEnumValues}
							/>
							<IconButton size='small' onClick={() => removeSingleParam(index)}>
								<ClearOutlined />
							</IconButton>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default TransformationTypeStateNumeric;
