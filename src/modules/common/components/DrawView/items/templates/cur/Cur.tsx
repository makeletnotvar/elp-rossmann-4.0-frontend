import cn from 'classnames';
import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import TemplateAlarmIcon from 'modules/common/components/DrawView/items/templates/commons/TemplateAlarmIcon/TemplateAlarmIcon';
import TemplateComIcon from 'modules/common/components/DrawView/items/templates/commons/TemplateComIcon/TemplateComIcon';
import CurIcon from 'modules/common/components/DrawView/items/templates/cur/CurIcon';
import { usePointValueByXid } from 'modules/common/redux/poll';
import React from 'react';
import styles from './Cur.module.scss';

interface CurProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'xidPreffixFilter'> {}
const Cur: React.FC<CurProps> = ({ xidPreffixFilter, arg1, arg2, arg3 }) => {
	const mode = usePointValueByXid(xidPreffixFilter + '_mode', true);
	const communicationAlarm = usePointValueByXid(xidPreffixFilter + '_com', true);
	const alarm = usePointValueByXid(xidPreffixFilter + '_alarm', true);

	const modeValue = mode ? mode.value : 0;
	const isWorking = modeValue !== 0 && modeValue !== 9;
	const alarmValue = Boolean(alarm && alarm.value);
	const communicationAlarmValue = Boolean(communicationAlarm && communicationAlarm.value);

	return <CurView isWorking={isWorking || true} mode={modeValue} communicationAlarm={communicationAlarmValue} alarm={alarmValue} arg1={arg1} />;
};

interface CurViewProps extends Pick<DrawViewItemValueComponentProps, 'arg1'> {
	isWorking: boolean;
	mode: number | null;
	alarm: boolean;
	communicationAlarm: boolean;
}

const CurView: React.FC<CurViewProps> = ({ isWorking, mode, communicationAlarm, alarm, arg1 }) => {
	const classNames = cn([styles.curtain], {
		[styles.on]: isWorking,
		[styles.alarm]: alarm,
	});

	const acSpeedClassName = styles[`gear${mode}`];

	return (
		<div className={styles.container}>
			{arg1 && <label>{arg1}</label>}
			<div className={classNames}>
				<div className={styles.device}>
					<CurIcon active={isWorking} />
					<TemplateAlarmIcon active={Boolean(alarm)} className={styles.alarmIcon} />
					<TemplateComIcon active={Boolean(communicationAlarm)} className={styles.comIcon} />
				</div>
			</div>
		</div>
	);
};

export default Cur;
