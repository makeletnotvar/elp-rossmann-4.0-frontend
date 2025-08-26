import cn from 'classnames';
import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import AcIcon from 'modules/common/components/DrawView/items/templates/ac/AcIcon';
import TemplateAlarmIcon from 'modules/common/components/DrawView/items/templates/commons/TemplateAlarmIcon/TemplateAlarmIcon';
import TemplateComIcon from 'modules/common/components/DrawView/items/templates/commons/TemplateComIcon/TemplateComIcon';
import { usePointValueByXid } from 'modules/common/redux/poll';
import React from 'react';
import styles from './Ac.module.scss';

interface AcProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'xidPreffixFilter'> {}
const Ac: React.FC<AcProps> = ({ xidPreffixFilter, arg1, arg2, arg3 }) => {
	const onoff = usePointValueByXid(xidPreffixFilter + '_onoff', true);
	const speed = usePointValueByXid(xidPreffixFilter + '_speed', true);
	const communicationAlarm = usePointValueByXid(xidPreffixFilter + '_com', true);
	const alarm = usePointValueByXid(xidPreffixFilter + '_alarm', true);

	return (
		<ACView
			onoff={Boolean(onoff && onoff.value)}
			speed={speed ? speed.value : null}
			communicationAlarm={Boolean(communicationAlarm && communicationAlarm.value)}
			alarm={Boolean(alarm && alarm.value)}
			arg1={arg1}
		/>
	);
};

interface ACViewProps extends Pick<DrawViewItemValueComponentProps, 'arg1'> {
	alarm: boolean;
	communicationAlarm: boolean;
	onoff: boolean;
	speed: number | null;
}

const ACView: React.FC<ACViewProps> = ({ onoff, speed, communicationAlarm, alarm, arg1 }) => {
	const classNames = cn([styles.ac], {
		[styles.on]: onoff,
		[styles.alarm]: alarm,
	});

	const acSpeedClassName = styles[`gear${speed}`];

	return (
		<div className={styles.container}>
			{arg1 && <label>{arg1}</label>}
			<div className={classNames}>
				<div className={styles.device}>
					<div className={cn(styles.bar, acSpeedClassName)}>{speed || ''}</div>
					<AcIcon active={onoff} />
					<TemplateAlarmIcon active={Boolean(alarm)} className={styles.alarmIcon} />
					<TemplateComIcon active={Boolean(communicationAlarm)} className={styles.comIcon} />
				</div>
			</div>
		</div>
	);
};

export default Ac;
