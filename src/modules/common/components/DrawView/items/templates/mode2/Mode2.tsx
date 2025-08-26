import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import usePointRenderedValue from 'modules/common/hooks/usePointRenderedValue';
import { usePointByXid } from 'modules/common/redux/poll';
import React from 'react';
import styles from './Mode2.module.scss';

interface Mode2Props extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'unitXid' | 'xidPreffixFilter' | 'editing'> {}
const Mode2: React.FC<Mode2Props> = ({ arg1, arg2, unitXid, editing }) => {
	const value = usePointByXid(arg2 || '');
	const renderedValue = usePointRenderedValue(value && value.uuid ? value.uuid : null);

	return <Mode2View unitXid={unitXid} editing={editing} renderedValue={renderedValue} arg1={arg1} />;
};

interface Mode2ViewProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'unitXid' | 'editing'> {
	renderedValue?: string | null;
}

const Mode2View: React.FC<Mode2ViewProps> = ({ arg1, renderedValue }) => {
	return (
		<div className={styles.modeContent}>
			<span className={styles.modeValue}>{renderedValue}</span>
			<span className={styles.modeTitle}>{arg1}</span>
		</div>
	);
};
export default Mode2;
