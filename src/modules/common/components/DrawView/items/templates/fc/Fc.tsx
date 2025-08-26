import cn from 'classnames';
import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import TemplateAlarmIcon from 'modules/common/components/DrawView/items/templates/commons/TemplateAlarmIcon/TemplateAlarmIcon';
import TemplateComIcon from 'modules/common/components/DrawView/items/templates/commons/TemplateComIcon/TemplateComIcon';
import FcIcon from 'modules/common/components/DrawView/items/templates/fc/FcIcon';
import { usePointValueByXid } from 'modules/common/redux/poll';
import React from 'react';
import styles from './Fc.module.scss';

interface FcProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'xidPreffixFilter'> {}
const Fc: React.FC<FcProps> = ({ xidPreffixFilter, arg1, arg2, arg3 }) => {
	const onoff = usePointValueByXid(xidPreffixFilter + '_onoff', true);
	const mode = usePointValueByXid(xidPreffixFilter + '_mode', true);
	const tmain = usePointValueByXid(xidPreffixFilter + '_tmain', true);
	const communicationAlarm = usePointValueByXid(xidPreffixFilter + '_com', true);
	const alarm = usePointValueByXid(xidPreffixFilter + '_alarm', true);

	return (
		<FCView
			onoff={Boolean(onoff && onoff.value)}
			mode={mode ? mode.value : null}
			tmain={tmain ? tmain.value : null}
			communicationAlarm={Boolean(communicationAlarm && communicationAlarm.value)}
			alarm={Boolean(alarm && alarm.value)}
			arg1={arg1}
		/>
	);
};

interface FCViewProps extends Pick<DrawViewItemValueComponentProps, 'arg1'> {
	alarm: boolean;
	communicationAlarm: boolean;
	onoff: boolean;
	mode: number | null;
	tmain: number | null;
}

const FCView: React.FC<FCViewProps> = ({ onoff, mode, tmain, communicationAlarm, alarm, arg1 }) => {
	const classNames = cn([styles.fc], {
		[styles.on]: onoff,
		[styles.alarm]: alarm,
	});

	const isModeVisible = Boolean(onoff) && mode !== null;

	return (
		<div className={styles.container}>
			{arg1 && <label>{arg1}</label>}
			<div className={classNames}>
				<div className={styles.device}>
					{isModeVisible && <GearLabel mode={mode!} />}
					<FcIcon active={onoff} />
					<TemplateAlarmIcon active={Boolean(alarm)} className={styles.alarmIcon} />
					<TemplateComIcon active={Boolean(communicationAlarm)} className={styles.comIcon} />
				</div>
			</div>
			{tmain !== null && <TMain value={tmain} alarm={alarm} />}
		</div>
	);
};

const GearLabel: React.FC<{ mode: number }> = ({ mode }) => {
	const modes: { [val: string]: { label: string; classname: string } } = {
		'0': { label: '', classname: '' },
		'1': { label: '', classname: '' },
		'2': { label: '1', classname: styles.gear1 },
		'3': { label: '2', classname: styles.gear2 },
		'4': { label: '3', classname: styles.gear3 },
	};
	const { label: modeLabel, classname: modeClassNames } = modes[mode || 0];

	const classes = cn(styles.mode, { [modeClassNames]: Boolean(modeClassNames) });

	return <div className={classes}> {modeLabel || ''} </div>;
};

const TMain: React.FC<{ value: number; alarm: boolean }> = ({ value, alarm }) => {
	const classes = cn(styles.tmain, {
		[styles.alarm]: alarm,
	});

	return (
		<div className={classes}>
			{value.toFixed(1)}
			<span>°C</span>
		</div>
	);
};

export default Fc;
