import { EnergySavingsLeafOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import TemplateAlarmIcon from 'modules/common/components/DrawView/items/templates/commons/TemplateAlarmIcon/TemplateAlarmIcon';
import TemplateComIcon from 'modules/common/components/DrawView/items/templates/commons/TemplateComIcon/TemplateComIcon';
import { usePointValueByXid } from 'modules/common/redux/poll';
import React from 'react';
import styles from './Hp.module.scss';

interface HpProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'xidPreffixFilter'> {}

const Hp: React.FC<HpProps> = ({ xidPreffixFilter, arg1, arg2, arg3 }) => {
	const communicationAlarm = usePointValueByXid(xidPreffixFilter + '_com', true) || null;
	const alarm = usePointValueByXid(xidPreffixFilter + '_alarm', true) || null;
	const onoff = usePointValueByXid(xidPreffixFilter + '_onoffr', true) || null;
	const mode = usePointValueByXid(xidPreffixFilter + '_mode', true) || null;
	const tmain = usePointValueByXid(xidPreffixFilter + '_tmain', true) || null;

	const tmainValue = tmain !== null ? tmain.value : null;
	const isHeating = mode !== null && mode.value === 4;

	return (
		<HpImage
			communicationAlarm={communicationAlarm !== null && Boolean(communicationAlarm.value)}
			onOff={onoff !== null && Boolean(onoff.value)}
			alarm={alarm !== null && Boolean(alarm.value)}
			isHeating={isHeating}
			tMain={tmainValue}
			{...{ arg1, arg2, arg3 }}
		/>
	);
};

export interface HpImageProps extends Pick<DrawViewItemValueComponentProps, 'arg1'> {
	alarm: boolean;
	communicationAlarm: boolean;
	onOff: boolean;
	isHeating: boolean;
	tMain: number | null;
}

export const HpImage: React.FC<HpImageProps> = ({ alarm, communicationAlarm, isHeating, tMain, onOff, arg1 }) => {
	const classNames = cn([styles.device], {
		[styles.nocom]: communicationAlarm,
		[styles.on]: onOff,
		[styles.heating]: isHeating,
	});

	const tmainClassNames = cn(styles.tmain, { [styles.alarm]: alarm });

	return (
		<div data-testid='container' className={styles.container}>
			{arg1 && <label>{arg1}</label>}
			<div data-testid='device' className={classNames}>
				<div className={styles.box}>
					<EnergySavingsLeafOutlined className={styles.icon} />
					<TemplateAlarmIcon active={alarm} className={styles.alarmIcon} />
					<TemplateComIcon active={communicationAlarm} className={styles.comIcon} />
				</div>
			</div>
			{tMain !== null && (
				<div className={tmainClassNames}>
					{tMain !== null ? tMain.toFixed(1) : '-'}
					<span>°C</span>
				</div>
			)}
		</div>
	);
};

export default Hp;
