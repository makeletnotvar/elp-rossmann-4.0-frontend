import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { viewActions } from 'modules/common/redux/view';
import React, { useEffect, useRef } from 'react';
import DrawViewStatusItem from '../../../components/DrawViewStatusItem';
import { useCurrentBuildingEventsStatus } from '../../../helpers/useCurrentBuildingEventsStatus';
import styles from './Hp2.module.scss';
import { useHPStatus } from './useHpStatus';

interface Hp2Props extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'unitXid' | 'xidPreffixFilter' | 'editing'> {}
const Hp2: React.FC<Hp2Props> = ({ xidPreffixFilter, arg1, unitXid, editing }) => {
	const { isWorking, mode, tempRenderedValue } = useHPStatus(xidPreffixFilter);
	const { hasAlarm, isOnline, alarmsCount } = useCurrentBuildingEventsStatus(unitXid);

	return (
		<Hp2View
			unitXid={unitXid}
			editing={editing}
			isWorking={isWorking}
			mode={mode}
			isAlarmActive={hasAlarm}
			isComAlarm={!isOnline}
			arg1={arg1}
			alarmsCount={alarmsCount}
			tempRenderedValue={tempRenderedValue}
		/>
	);
};

interface Hp2ViewProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'unitXid' | 'editing'> {
	isWorking: boolean;
	mode: 'heating' | 'cooling' | 'other';
	isAlarmActive: boolean;
	isComAlarm: boolean;
	unitXid: string;
	editing: boolean;
	alarmsCount: number;
	tempRenderedValue: string | null;
}

const Hp2View: React.FC<Hp2ViewProps> = ({ isWorking, mode, isAlarmActive, arg1, unitXid, editing, isComAlarm, alarmsCount, tempRenderedValue }) => {
	const dispatch = useDispatch();

	const doubleClickHandler = () => {
		unitXid && dispatch(viewActions.setUnit(unitXid));
	};

	const bgRef = useRef<HTMLDivElement>(null);

	const alarmClass = styles[isAlarmActive ? 'hpContainerAlarm' : 'hpContainer'];
	const stateClass = styles[isWorking ? 'hpContainerOn' : 'hpContainerOff'];
	const speedClass = styles['hpContainerContentDefault'];

	return (
		<div ref={bgRef} className={styles.hpContent}>
			<div className={styles.hpNameContainer} style={{ display: arg1 ? 'flex' : 'none' }}>
				<span className={styles.hpName}>{arg1}</span>
			</div>
			<div className={speedClass}>
				<div
					style={{ cursor: unitXid ? 'pointer' : 'auto', filter: isComAlarm ? 'brightness(85%)' : 'none' }}
					onDoubleClick={!editing ? doubleClickHandler : undefined}
					className={alarmClass}
				>
					<div className={styles.hpContainerStatus}>
						<DrawViewStatusItem isOnline={!isComAlarm} eventsCount={alarmsCount} />
					</div>
					<div className={styles.hpContainerOnOff}>
						<div className={stateClass}></div>
					</div>
					<div className={styles.hpContainerGrid} />
				</div>
				{isWorking && <BubbleAnimation bgRef={bgRef} mode={mode} speed={isWorking || isComAlarm ? 0 : 5} maxDistance={100} />}
			</div>
			{tempRenderedValue && tempRenderedValue !== '--' && !isComAlarm ? (
				<div className={styles.hpTempContainer}>
					<span className={styles.hpTemp}>
						{tempRenderedValue}
						<span className={styles.hpUnit}>°C</span>
					</span>
				</div>
			) : null}
		</div>
	);
};

interface CreateBubbleProps {
	bg: HTMLDivElement;
	maxDistance: number;
	mode: 'heating' | 'cooling' | 'other';
	speed: number;
}

const createBubble = ({ bg, maxDistance, mode, speed }: CreateBubbleProps) => {
	const bubble = document.createElement('div');
	bubble.classList.add(styles.bubble);

	bubble.classList.add(styles[mode]);

	const size = Math.random() * 15 + 15;
	bubble.style.width = `${size}px`;
	bubble.style.height = `${size}px`;

	const startX = bg.offsetWidth / 1.75;
	const startY = bg.offsetHeight / 2;

	const angle = Math.random() * 2 * Math.PI;
	const xMove = Math.cos(angle) * maxDistance;
	const yMove = Math.sin(angle) * maxDistance;

	bubble.style.setProperty('--x', `${xMove}px`);
	bubble.style.setProperty('--y', `${yMove}px`);

	const animationDuration = Math.max(8 - speed, 4);
	bubble.style.animationDuration = `${animationDuration}s`;

	bubble.style.left = `${startX - size / 2}px`;
	bubble.style.top = `${startY - size / 2}px`;

	bg.appendChild(bubble);

	bubble.addEventListener('animationend', () => {
		bubble.remove();
	});
};

interface BubbleProps {
	bgRef: React.RefObject<HTMLDivElement>;
	maxDistance: number;
	mode: 'heating' | 'cooling' | 'other';
	speed: number;
}

const BubbleAnimation: React.FC<BubbleProps> = ({ bgRef, maxDistance, mode, speed }) => {
	useEffect(() => {
		const bg = bgRef.current;
		if (!bg) return;
		const intervalTime = speed <= 4 ? Math.max(200 - speed * 5, 20) : Math.max(100 - speed * 8, 20);
		const interval = setInterval(() => createBubble({ bg, maxDistance, mode, speed }), intervalTime);

		return () => {
			clearInterval(interval);
		};
	}, [bgRef, maxDistance, mode, speed]);

	return null;
};

export default Hp2;
