import React from 'react';
import styles from './TransformationTypesComponents.module.scss';

interface TransformationTypeComponentNumberProps {
	index: number;
	value: string;
	updateSingleParam?: (paramIndex: number, target: 'value', inputValue: string | number) => void;
}

const TransformationTypeComponentNumber: React.FC<TransformationTypeComponentNumberProps> = ({ index, value, updateSingleParam }) => {
	return (
		<input
			className={styles.value}
			type='number'
			defaultValue={value || 0}
			onChange={(evt: React.ChangeEvent<HTMLInputElement>) => updateSingleParam && updateSingleParam(index, 'value', Number(evt.target.value))}
		/>
	);
};

export default TransformationTypeComponentNumber;
