import React from 'react';
import styles from './TransformationTypesComponents.module.scss';

interface TransformationTypeComponentTextProps {
	index: number;
	value: string;
	updateSingleParam?: (paramIndex: number, target: 'value', inputValue: string | number) => void;
}

const TransformationTypeComponentText: React.FC<TransformationTypeComponentTextProps> = ({ index, value, updateSingleParam }) => {
	return (
		<input
			className={styles.value}
			type='text'
			defaultValue={value}
			onChange={(evt: React.ChangeEvent<HTMLInputElement>) => updateSingleParam && updateSingleParam(index, 'value', evt.target.value)}
		/>
	);
};

export default TransformationTypeComponentText;
