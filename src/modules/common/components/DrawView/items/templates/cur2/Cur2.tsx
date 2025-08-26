import { Tooltip } from '@mui/material';
import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import usePointRenderedValue from 'modules/common/hooks/usePointRenderedValue';
import { usePointByXid, usePointValueByXid } from 'modules/common/redux/poll';
import { viewActions } from 'modules/common/redux/view';
import React, { useEffect, useRef } from 'react';
import DrawViewStatusItem from '../../../components/DrawViewStatusItem';
import { getGear } from '../../../helpers/getGear';
import { getModeCur } from '../../../helpers/getModeCur';
import { useCurrentBuildingEventsStatus } from '../../../helpers/useCurrentBuildingEventsStatus';
import styles from './Cur2.module.scss';

interface Cur2Props extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'unitXid' | 'xidPreffixFilter' | 'editing'> {}
const Cur2: React.FC<Cur2Props> = ({ xidPreffixFilter, arg1, unitXid, editing }) => {
	const mode = usePointValueByXid(xidPreffixFilter + '_mode', true);
	const tempRenderedValue = usePointRenderedValue(null, xidPreffixFilter + '_tout', '--', true);

	const pointMode = usePointByXid(xidPreffixFilter + '_mode');
	const pointSpeed = usePointByXid(xidPreffixFilter + '_vent_pwr');
	const speedRenderedValue = usePointRenderedValue(pointSpeed && pointSpeed.uuid ? pointSpeed.uuid : null);
	const modeRenderedValue = usePointRenderedValue(pointMode && pointMode.uuid ? pointMode.uuid : null);

	const { hasAlarm, isOnline, alarmsCount } = useCurrentBuildingEventsStatus(unitXid);

	return (
		<Cur2View
			unitXid={unitXid}
			editing={editing}
			mode={mode}
			modeStates={(pointMode?.customRender as EnumRender)?.states}
			speedStates={(pointSpeed?.customRender as EnumRender)?.states}
			tempRenderedValue={tempRenderedValue}
			speedRenderedValue={speedRenderedValue}
			modeRenderedValue={modeRenderedValue}
			isAlarmActive={hasAlarm}
			isComAlarm={!isOnline}
			arg1={arg1}
			alarmsCount={alarmsCount}
		/>
	);
};

interface Cur2ViewProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'unitXid' | 'editing'> {
	mode: PointValue | null;
	tempRenderedValue?: string | null;
	speedRenderedValue?: string | null;
	modeRenderedValue?: string | null;
	isAlarmActive: boolean;
	isComAlarm: boolean;
	unitXid: string;
	editing: boolean;
	alarmsCount: number;
	modeStates: {
		[key: number]: string;
	};
	speedStates: {
		[key: number]: string;
	};
}

const Cur2View: React.FC<Cur2ViewProps> = ({
	mode,
	tempRenderedValue,
	isAlarmActive,
	arg1,
	unitXid,
	editing,
	isComAlarm,
	modeStates,
	speedStates,
	speedRenderedValue,
	modeRenderedValue,
	alarmsCount,
}) => {
	const isWorking = Boolean(modeRenderedValue && !modeRenderedValue.toLocaleLowerCase().includes('stop')) && !isComAlarm;
	const dispatch = useDispatch();

	const doubleClickHandler = () => {
		unitXid && dispatch(viewActions.setUnit(unitXid));
	};

	const bgRef = useRef<HTMLDivElement>(null);

	const alarmClass = styles[isAlarmActive ? 'curContainerAlarm' : 'curContainer'];
	const stateClass = styles[isWorking ? 'curContainerOn' : 'curContainerOff'];
	const speedClass = styles['curContainerContent'];

	return (
		<div ref={bgRef} className={styles.curContent}>
			<div className={styles.curNameContainer} style={{ display: arg1 ? 'flex' : 'none' }}>
				<span className={styles.curName}>{arg1}</span>
			</div>
			<div className={speedClass}>
				<Tooltip title={speedRenderedValue || ''}>
					<div className={styles.curMode} style={{ visibility: isWorking && !isComAlarm ? 'visible' : 'hidden' }}>
						{speedRenderedValue && speedRenderedValue.toLocaleLowerCase().includes('auto') ? (
							<span className={styles.curModeAuto}>A</span>
						) : speedRenderedValue && !speedRenderedValue.toLocaleLowerCase().includes('auto') && !speedRenderedValue.toLocaleLowerCase().includes('stop') ? (
							[...Array(getGear(speedRenderedValue, speedStates))].map((_, index) => <div key={index}></div>)
						) : (
							''
						)}
					</div>
				</Tooltip>
				<div
					style={{ cursor: unitXid ? 'pointer' : 'auto', filter: isComAlarm ? 'brightness(85%)' : 'none' }}
					onDoubleClick={!editing ? doubleClickHandler : undefined}
					className={alarmClass}
				>
					<div className={styles.curContainerStatus}>
						<DrawViewStatusItem isOnline={!isComAlarm} eventsCount={alarmsCount} />
					</div>
					<div className={styles.curContainerOnOff}>
						<div className={stateClass}></div>
					</div>
					<div className={styles.curContainerGrid} />
				</div>
				<BubbleAnimation
					bgRef={bgRef}
					mode={getModeCur(isComAlarm, mode, modeStates, isWorking)}
					speed={!isWorking || isComAlarm ? 0 : speedRenderedValue ? [...Array(getGear(speedRenderedValue, speedStates))].length : 0}
					maxDistance={100}
				/>
			</div>
			{tempRenderedValue && tempRenderedValue !== '--' && !isComAlarm ? (
				<div className={styles.curTempContainer}>
					<span className={styles.curTemp}>
						{tempRenderedValue}
						<span className={styles.curUnit}>°C</span>
					</span>
				</div>
			) : null}
		</div>
	);
};

interface CreateBubbleProps {
	bg: HTMLDivElement;
	maxDistance: number;
	mode: 'heating' | 'cooling' | 'vent' | 'empty';
	speed: number;
}

const createBubble = ({ bg, maxDistance, mode, speed }: CreateBubbleProps) => {
	const bubble = document.createElement('div');
	bubble.classList.add(styles.bubble);

	bubble.classList.add(styles[mode]);

	const size = Math.random() * 15 + 15;
	bubble.style.width = `${size}px`;
	bubble.style.height = `${size}px`;

	const startX = bg.offsetWidth / 2;
	const startY = bg.offsetHeight / 2;

	const angle = Math.random() * 2 * Math.PI;
	const xMove = Math.cos(angle) * maxDistance;
	const yMove = maxDistance;

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
	mode: 'heating' | 'cooling' | 'vent' | 'empty';
	speed: number;
}

const BubbleAnimation: React.FC<BubbleProps> = ({ bgRef, maxDistance, mode, speed }) => {
	useEffect(() => {
		if (mode !== 'empty') {
			const bg = bgRef.current;
			if (!bg) return;
			const intervalTime = speed <= 4 ? Math.max(200 - speed * 5, 20) : Math.max(100 - speed * 8, 20);
			const interval = setInterval(() => createBubble({ bg, maxDistance, mode, speed }), intervalTime);

			return () => {
				clearInterval(interval);
			};
		}
	}, [bgRef, maxDistance, mode, speed]);

	return null;
};

export default Cur2;
