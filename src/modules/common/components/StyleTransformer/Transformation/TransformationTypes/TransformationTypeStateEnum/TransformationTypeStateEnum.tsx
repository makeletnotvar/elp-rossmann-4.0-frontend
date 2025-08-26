import { IconButton, Typography } from '@mui/material';
import { AddOutlined, ClearOutlined } from '@mui/icons-material';
import React, { useMemo } from 'react';
import Select from 'react-select';
import { StyleTransformer, StyleTransformerInputType, StyleTransformerStatesConfig } from 'typings/styleTransformer';
import { StyleTransformerInput } from '../../TransformationTypesComponents/StyleTransformerInputComponent';
import styles from './TransformationTypeStateEnum.module.scss';

interface TransformationTypeStateEnumProps {
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
	value: null,
};

const TransformationTypeStateEnum: React.FC<TransformationTypeStateEnumProps> = ({ point, inputType, transformerEnumValues, values, setFieldValue }) => {
	const transformerConfig = values.config as StyleTransformerStatesConfig;

	const StyleTransformerInputComponent = StyleTransformerInput[inputType];
	const { states } = useMemo(() => {
		const states = Object.entries((point.customRender as EnumRender).states).map(([value, label]) => ({ label, value: Number(value) }));
		return { states };
	}, [point]);

	const addParamHandler = () => {
		const nextParams = [
			...((values.config as StyleTransformerStatesConfig).states || []),
			{ ...EMPTY_PARAM, value: inputType === StyleTransformerInputType.COLOR ? '#000000' : null },
		];
		setFieldValue('config.states', nextParams);
	};

	const updateSingleParam = (paramIndex: number, target: 'input' | 'value', inputValue: string | number) => {
		const nextParams = (values.config as StyleTransformerStatesConfig).states.map(({ input, value }, index) => {
			if (paramIndex === index) {
				const nextParamName = target === 'input' ? inputValue : input;
				const nextValue = target === 'value' ? inputValue : value;
				return {
					input: nextParamName,
					value: nextValue,
				};
			} else {
				return { input, value };
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
				<Typography variant='body1'>Transformacja stanu statusu</Typography>
				<IconButton size='small' onClick={addParamHandler}>
					<AddOutlined />
				</IconButton>
			</div>
			<div className={styles.stateContainer}>
				{((values.config as StyleTransformerStatesConfig).states || []).map(({ input, value }, index) => {
					return (
						<div className={styles.state} key={index}>
							<Select
								value={{ value: input, label: (point.customRender as EnumRender).states[input] }}
								onChange={(option: any) => updateSingleParam(index, 'input', option.value)}
								options={states.map(item => ({ value: item.value, label: item.label }))}
								isOptionDisabled={item =>
									(transformerConfig && transformerConfig.states.map(state => state.input).includes(item.value)) ||
									(values.config as StyleTransformerStatesConfig).states.map(state => state.input).includes(item.value) ||
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

export default TransformationTypeStateEnum;
