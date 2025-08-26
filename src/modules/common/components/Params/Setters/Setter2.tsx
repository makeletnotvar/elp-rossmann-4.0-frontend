import React, { CSSProperties } from 'react';
import EnumSetter2 from './EnumSetter2';
import NumericSetter2 from './NumericSetter2';
import styles from './Setter2.module.scss';

export interface Setter2Props {
	point: Point;
	value: number;
	onChange: (nextValue: number) => void;
	disabled?: boolean;
	customStyle?: CSSProperties;
	setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const Setter2: React.FC<Setter2Props> = props => {
	const { point, value, onChange } = props;
	const { type } = point;

	const setters = {
		enum: EnumSetter2,
		numeric: NumericSetter2,
	};

	const SetterComponent = setters[point.type];

	return <div className={styles.container}>{SetterComponent && <SetterComponent {...props} />}</div>;
};

export default Setter2;
