import React from 'react';
import StyleTransformerColorSelector from '../../StyleTransformerColorSelector/StyleTransformerColorSelector';

interface TransformationTypeComponentColorProps {
	index: number;
	value: string;
	updateSingleParam?: (paramIndex: number, target: 'value', inputValue: string | number) => void;
	setFieldValue?: {
		(field: any, value: any, shouldValidate?: boolean | undefined): void;
		(field: string, value: any): void;
	};
	valueKey?: string;
}

const TransformationTypeComponentColor: React.FC<TransformationTypeComponentColorProps> = ({ index, value, updateSingleParam, setFieldValue, valueKey }) => {
	return (
		<StyleTransformerColorSelector
			id={index}
			color={value}
			onChange={color => (updateSingleParam ? updateSingleParam(index, 'value', color) : setFieldValue ? setFieldValue(valueKey, color) : null)}
		/>
	);
};

export default TransformationTypeComponentColor;
