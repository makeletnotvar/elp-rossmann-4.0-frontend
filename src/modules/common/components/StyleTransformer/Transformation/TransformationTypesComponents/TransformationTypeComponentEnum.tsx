import React, { useMemo } from 'react';
import Select from 'react-select';
import styles from './TransformationTypesComponents.module.scss';

interface TransformationTypeComponentEnumProps {
	index: number;
	value: string;
	updateSingleParam?: (paramIndex: number, target: 'value', inputValue: string | number) => void;
	transformerEnumValues?: { key: string; value: string }[];
}

const TransformationTypeComponentEnum: React.FC<TransformationTypeComponentEnumProps> = ({ index, value, updateSingleParam, transformerEnumValues }) => {
	const { transformerEnumValuesMapped } = useMemo(() => {
		const transformerEnumValuesMapped = (transformerEnumValues || []).find(enumValue => enumValue.value === value);
		return { transformerEnumValuesMapped };
	}, [transformerEnumValues, value]);

	return (
		<Select
			value={{ label: transformerEnumValuesMapped?.key as string, value: transformerEnumValuesMapped?.value as string }}
			onChange={(option: any) => updateSingleParam && updateSingleParam(index, 'value', option.value)}
			options={(transformerEnumValues || []).map(enumValue => ({ value: enumValue.value, label: enumValue.key }))}
			maxMenuHeight={200}
			className={styles.stateSelector}
		/>
	);
};

export default TransformationTypeComponentEnum;
