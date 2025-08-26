import DateSetter from 'modules/common/components/Params/Setters/DateSetter';
import EnumSetter from 'modules/common/components/Params/Setters/EnumSetter';
import NumericSetter from 'modules/common/components/Params/Setters/NumericSetter';
import React, { CSSProperties } from 'react';
import styles from './Setter.module.scss';

export interface SetterProps {
	point: Point;
	value: number;
	onChange: (nextValue: number) => void;
	disabled?: boolean;
	format?: 'hour';
	customStyle?: CSSProperties;
}

const Setter: React.FC<SetterProps> = props => {
	const { point, value, onChange, format } = props;

	const { type } = point;

	const setters = {
		enum: EnumSetter,
		numeric: NumericSetter,
	};

	const formats = {
		hour: DateSetter,
	};

	const SetterComponent = format !== undefined ? formats[format] : setters[point.type];

	return <div className={styles.container}>{SetterComponent && <SetterComponent {...props} />}</div>;
};

export default Setter;
