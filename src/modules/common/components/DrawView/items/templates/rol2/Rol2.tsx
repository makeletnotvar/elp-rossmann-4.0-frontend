import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import usePointRenderedValue from 'modules/common/hooks/usePointRenderedValue';
import { viewActions } from 'modules/common/redux/view';
import React, { useRef } from 'react';
import styles from './Rol2.module.scss';

interface Rol2Props extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'unitXid' | 'xidPreffixFilter' | 'editing'> {}
const Rol2: React.FC<Rol2Props> = ({ xidPreffixFilter, arg1, arg2, arg3, unitXid, editing }) => {
	const controlRenderedValue = usePointRenderedValue(null, xidPreffixFilter, '--', true);

	return <Rol2View unitXid={unitXid} editing={editing} controlRenderedValue={controlRenderedValue} arg1={arg1} arg2={arg2} arg3={arg3} />;
};

interface Rol2ViewProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'unitXid' | 'editing'> {
	controlRenderedValue?: string | null;
	unitXid: string;
	editing: boolean;
}

const Rol2View: React.FC<Rol2ViewProps> = ({ controlRenderedValue, arg1, arg2, arg3, unitXid, editing }) => {
	const dispatch = useDispatch();

	const doubleClickHandler = () => {
		unitXid && dispatch(viewActions.setUnit(unitXid));
	};

	const bgRef = useRef<HTMLDivElement>(null);

	const alarmClass = styles['rolContainer'];
	const speedClass = styles['rolContainerContent'];

	return (
		<div ref={bgRef} className={styles.rolContent}>
			<div className={styles.rolNameContainer} style={{ display: arg1 ? 'flex' : 'none' }}>
				<span className={styles.rolName}>{arg1}</span>
			</div>
			<div className={speedClass} style={{ transform: `rotate(${arg3}deg)` }}>
				<div
					style={{ cursor: unitXid ? 'pointer' : 'auto', width: `${arg2}px` }}
					onDoubleClick={!editing ? doubleClickHandler : undefined}
					className={alarmClass}
				/>
			</div>
			<div className={styles.rolControlContainer}>
				<span className={styles.rolControl}>
					{controlRenderedValue}
					{controlRenderedValue && controlRenderedValue !== '--' && <span className={styles.rolUnit}>%</span>}
				</span>
			</div>
		</div>
	);
};

export default Rol2;
