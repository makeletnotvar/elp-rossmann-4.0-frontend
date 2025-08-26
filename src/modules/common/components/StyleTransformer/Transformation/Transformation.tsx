import React from 'react';
import { StyleTransformer, StyleTransformerInputType, StyleTransformerType } from 'typings/styleTransformer';
import styles from './Transformation.module.scss';
import TransformationTypeScript from './TransformationTypes/TransformationTypeScript/TransformationTypeScript';
import TransformationTypeStateEnum from './TransformationTypes/TransformationTypeStateEnum/TransformationTypeStateEnum';
import TransformationTypeStateNumeric from './TransformationTypes/TransformationTypeStateNumeric/TransformationTypeStateNumeric';
import TransformationTypeTransition from './TransformationTypes/TransformationTypeTransition/TransformationTypeTransition';

interface TransformationProps {
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

const Transformation: React.FC<TransformationProps> = ({ point, inputType, transformerEnumValues, values, setFieldValue }) => {
	const StateComponentType = {
		enum: TransformationTypeStateEnum,
		numeric: TransformationTypeStateNumeric,
	};
	const StateComponent = StateComponentType[point.type];

	const StyleTransformers = {
		[StyleTransformerType.STATES]: StateComponent,
		[StyleTransformerType.TRANSITION]: TransformationTypeTransition,
		[StyleTransformerType.SCRIPT]: TransformationTypeScript,
	};

	const StyleTransformer = StyleTransformers[values.type];

	return (
		<div className={styles.container}>
			{values.type === StyleTransformerType.TRANSITION && point.type !== 'numeric' ? (
				<div className={styles.empty}>Wybierz punkt numeryczny</div>
			) : (
				<StyleTransformer point={point} inputType={inputType} transformerEnumValues={transformerEnumValues} values={values} setFieldValue={setFieldValue} />
			)}
		</div>
	);
};

export default Transformation;
