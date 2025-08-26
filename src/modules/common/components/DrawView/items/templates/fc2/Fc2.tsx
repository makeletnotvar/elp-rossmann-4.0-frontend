import { Tooltip } from '@mui/material';
import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import usePointRenderedValue from 'modules/common/hooks/usePointRenderedValue';
import { usePointByXid, usePointValueByXid } from 'modules/common/redux/poll';
import { viewActions } from 'modules/common/redux/view';
import React, { useEffect, useRef } from 'react';
import DrawViewStatusItem from '../../../components/DrawViewStatusItem';
import { getGear } from '../../../helpers/getGear';
import { getMode } from '../../../helpers/getMode';
import { getState } from '../../../helpers/getState';
import { useCurrentBuildingEventsStatus } from '../../../helpers/useCurrentBuildingEventsStatus';
import styles from './Fc2.module.scss';

interface Fc2Props extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'unitXid' | 'xidPreffixFilter' | 'editing'> {}
const Fc2: React.FC<Fc2Props> = ({ xidPreffixFilter, arg1, unitXid, editing }) => {
	const onoff = usePointValueByXid(xidPreffixFilter + '_onoff', true);
	const mode = usePointValueByXid(xidPreffixFilter + '_modetemp', true);
	const modeY1 = usePointValueByXid(xidPreffixFilter + '_y1', true);
	const modeY2 = usePointValueByXid(xidPreffixFilter + '_y2', true);
	const tempRenderedValue = usePointRenderedValue(null, xidPreffixFilter + '_tmain', '--', true);

	const pointMode = usePointByXid(xidPreffixFilter + '_modetemp');
	const pointModeY1 = usePointByXid(xidPreffixFilter + '_y1');
	const pointModeY2 = usePointByXid(xidPreffixFilter + '_y2');

	const pointState = usePointByXid(xidPreffixFilter + '_onoff');

	const pointSpeed = usePointByXid(xidPreffixFilter + '_vent');
	const speedRenderedValue = usePointRenderedValue(pointSpeed && pointSpeed.uuid ? pointSpeed.uuid : null);

	const { hasAlarm, isOnline, alarmsCount } = useCurrentBuildingEventsStatus(unitXid);

	return (
		<Fc2View
			unitXid={unitXid}
			editing={editing}
			state={onoff}
			mode={mode}
			modeY1={modeY1}
			modeY2={modeY2}
			modeStates={(pointMode?.customRender as EnumRender)?.states}
			modeY1States={(pointModeY1?.customRender as EnumRender)?.states}
			modeY2States={(pointModeY2?.customRender as EnumRender)?.states}
			workmodeStates={(pointState?.customRender as EnumRender)?.states}
			speedStates={(pointSpeed?.customRender as EnumRender)?.states}
			tempRenderedValue={tempRenderedValue}
			speedRenderedValue={speedRenderedValue}
			isAlarmActive={hasAlarm}
			isComAlarm={!isOnline}
			arg1={arg1}
			alarmsCount={alarmsCount}
		/>
	);
};

interface Fc2ViewProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'unitXid' | 'editing'> {
	state: PointValue | null;
	mode: PointValue | null;
	modeY1: PointValue | null;
	modeY2: PointValue | null;
	tempRenderedValue?: string | null;
	speedRenderedValue?: string | null;
	isAlarmActive: boolean;
	isComAlarm: boolean;
	unitXid: string;
	editing: boolean;
	alarmsCount: number;
	modeStates: {
		[key: number]: string;
	};
	modeY1States: {
		[key: number]: string;
	};
	modeY2States: {
		[key: number]: string;
	};
	workmodeStates: {
		[key: number]: string;
	};
	speedStates: {
		[key: number]: string;
	};
}

const Fc2View: React.FC<Fc2ViewProps> = ({
	mode,
	modeY1,
	modeY2,
	tempRenderedValue,
	state,
	isAlarmActive,
	arg1,
	unitXid,
	editing,
	isComAlarm,
	modeStates,
	modeY1States,
	modeY2States,
	workmodeStates,
	speedStates,
	speedRenderedValue,
	alarmsCount,
}) => {
	const dispatch = useDispatch();
	const stateWorkmode = getState(state, workmodeStates);

	const doubleClickHandler = () => {
		unitXid && dispatch(viewActions.setUnit(unitXid));
	};

	const bgRef = useRef<HTMLDivElement>(null);

	const alarmClass = styles[isAlarmActive ? 'fcContainerAlarm' : 'fcContainer'];
	const stateClass = styles[stateWorkmode === 'working' ? 'fcContainerOn' : 'fcContainerOff'];
	const speedClass = styles['fcContainerContent'];

	return (
		<div ref={bgRef} className={styles.fcContent}>
			<div className={styles.fcNameContainer} style={{ display: arg1 ? 'flex' : 'none' }}>
				<span className={styles.fcName}>{arg1}</span>
			</div>
			<div className={speedClass}>
				<Tooltip title={speedRenderedValue || ''}>
					<div className={styles.fcMode} style={{ visibility: stateWorkmode === 'working' && !isComAlarm ? 'visible' : 'hidden' }}>
						{speedRenderedValue && speedRenderedValue.toLocaleLowerCase().includes('auto') ? (
							<span className={styles.fcModeAuto}>A</span>
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
					<div className={styles.fcContainerStatus}>
						<DrawViewStatusItem isOnline={!isComAlarm} eventsCount={alarmsCount} />
					</div>
					<div className={styles.fcContainerOnOff}>
						<div className={stateClass}></div>
					</div>
					<div className={styles.fcContainerGrid} />
				</div>
				<BubbleAnimation
					bgRef={bgRef}
					mode={getMode({ isComAlarm, mode, modeStates, stateWorkmode, modeY1States, modeY2States, modeY1, modeY2 })}
					speed={stateWorkmode === 'stopped' || isComAlarm ? 0 : speedRenderedValue ? [...Array(getGear(speedRenderedValue, speedStates))].length : 0}
					maxDistance={100}
				/>
			</div>
			{tempRenderedValue && tempRenderedValue !== '--' && !isComAlarm ? (
				<div className={styles.fcTempContainer}>
					<span className={styles.fcTemp}>
						{tempRenderedValue}
						<span className={styles.fcUnit}>°C</span>
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

export default Fc2;
