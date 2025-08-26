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
import styles from './Ac2.module.scss';

interface Ac2Props extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'unitXid' | 'xidPreffixFilter' | 'editing'> {}
const Ac2: React.FC<Ac2Props> = ({ xidPreffixFilter, arg1, unitXid, editing }) => {
	const onoff = usePointValueByXid(xidPreffixFilter + '_onoff', true);
	const mode = usePointValueByXid(xidPreffixFilter + '_mode', true);
	const tempRenderedValue = usePointRenderedValue(null, xidPreffixFilter + '_treg', '--', true);

	const pointMode = usePointByXid(xidPreffixFilter + '_mode');
	const pointState = usePointByXid(xidPreffixFilter + '_onoff');

	const pointSpeed = usePointByXid(xidPreffixFilter + '_speed');
	const speedRenderedValue = usePointRenderedValue(pointSpeed && pointSpeed.uuid ? pointSpeed.uuid : null);

	const { hasAlarm, isOnline, alarmsCount } = useCurrentBuildingEventsStatus(unitXid);

	return (
		<Ac2View
			unitXid={unitXid}
			editing={editing}
			state={onoff}
			mode={mode}
			modeStates={(pointMode?.customRender as EnumRender)?.states}
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

interface Ac2ViewProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'unitXid' | 'editing'> {
	state: PointValue | null;
	mode: PointValue | null;
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
	workmodeStates: {
		[key: number]: string;
	};
	speedStates: {
		[key: number]: string;
	};
}

const Ac2View: React.FC<Ac2ViewProps> = ({
	mode,
	tempRenderedValue,
	state,
	isAlarmActive,
	arg1,
	unitXid,
	editing,
	isComAlarm,
	modeStates,
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

	const alarmClass = styles[isAlarmActive ? 'acContainerAlarm' : 'acContainer'];
	const stateClass = styles[stateWorkmode === 'working' ? 'acContainerOn' : 'acContainerOff'];
	const speedClass = styles['acContainerContent'];

	return (
		<div ref={bgRef} className={styles.acContent}>
			<div className={styles.acNameContainer} style={{ display: arg1 ? 'flex' : 'none' }}>
				<span className={styles.acName}>{arg1}</span>
			</div>
			<div className={speedClass}>
				<Tooltip title={speedRenderedValue || ''}>
					<div className={styles.acMode} style={{ visibility: stateWorkmode === 'working' && !isComAlarm ? 'visible' : 'hidden' }}>
						{speedRenderedValue && speedRenderedValue.toLowerCase().includes('auto') ? (
							<span className={styles.acModeAuto}>A</span>
						) : speedRenderedValue && !speedRenderedValue.toLowerCase().includes('stop') ? (
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
					<div className={styles.acContainerStatus}>
						<DrawViewStatusItem isOnline={!isComAlarm} eventsCount={alarmsCount} />
					</div>
					<div className={styles.acContainerOnOff}>
						<div className={stateClass}></div>
					</div>
					<div className={styles.acContainerGrid}>
						<svg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 512 512'>
							<path
								fill='#E4EAF7'
								d='M456.23,512H55.77C24.969,512,0,487.031,0,456.23V55.77C0,24.969,24.969,0,55.77,0h400.46 C487.031,0,512,24.969,512,55.77v400.46C512,487.031,487.031,512,456.23,512z'
							/>
							<path
								fill='#D7DEED'
								d='M376.742,417.206H135.258c-22.347,0-40.464-18.116-40.464-40.464V135.258 c0-22.347,18.116-40.464,40.464-40.464h241.485c22.347,0,40.464,18.116,40.464,40.464v241.485 C417.206,399.09,399.09,417.206,376.742,417.206z'
							/>
							<path
								fill='#FFFFFF'
								d='M373.178,402.938H138.822c-16.436,0-29.759-13.324-29.759-29.759V138.822 c0-16.436,13.324-29.759,29.759-29.759h234.357c16.436,0,29.759,13.324,29.759,29.759v234.357 C402.938,389.614,389.614,402.938,373.178,402.938z'
							/>
							<path
								fill='#C7CFE2'
								d='M370.464,376.699H141.536c-3.443,0-6.235-2.791-6.235-6.234V141.536c0-3.443,2.791-6.235,6.235-6.235 h228.928c3.443,0,6.234,2.791,6.234,6.235v228.928C376.699,373.907,373.907,376.699,370.464,376.699z'
							/>
							<g>
								<path
									fill='#D7DEED'
									d='M369.138,75.477H142.862c-17.991,0-32.575-14.584-32.575-32.575V0h291.426v42.901 C401.713,60.892,387.129,75.477,369.138,75.477z'
								/>
								<path
									fill='#D7DEED'
									d='M401.713,512H110.287v-41.923c0-17.952,14.553-32.504,32.504-32.504h226.418 c17.952,0,32.504,14.553,32.504,32.504L401.713,512L401.713,512z'
								/>
								<path
									fill='#D7DEED'
									d='M437.048,369.698V143.351c0-17.971,14.569-32.54,32.54-32.54H512v291.426h-42.412 C451.617,402.238,437.048,387.669,437.048,369.698z'
								/>
								<path
									fill='#D7DEED'
									d='M0,402.238V110.812h42.412c17.971,0,32.54,14.569,32.54,32.54v226.347 c0,17.971-14.569,32.54-32.54,32.54L0,402.238L0,402.238z'
								/>
							</g>
							<g>
								<rect x='135.3' y='208.19' fill='#959CB3' width='241.4' height='15.743' />
								<rect x='135.3' y='261.73' fill='#959CB3' width='241.4' height='15.743' />
								<rect x='135.3' y='181.41' fill='#959CB3' width='241.4' height='15.743' />
								<rect x='135.3' y='234.96' fill='#959CB3' width='241.4' height='15.743' />
								<rect x='135.3' y='288.51' fill='#959CB3' width='241.4' height='15.743' />
								<rect x='135.3' y='154.64' fill='#959CB3' width='241.4' height='15.743' />
								<rect x='135.3' y='342.05' fill='#959CB3' width='241.4' height='15.743' />
								<rect x='135.3' y='315.28' fill='#959CB3' width='241.4' height='15.743' />
							</g>
							<g>
								<path
									fill='#FFFFFF'
									d='M36.381,367.078c-4.347,0-7.872-3.524-7.872-7.872V149.995c0-4.347,3.524-7.872,7.872-7.872 s7.872,3.524,7.872,7.872v209.211C44.252,363.554,40.728,367.078,36.381,367.078z'
								/>
								<path
									fill='#FFFFFF'
									d='M360.605,42.895h-209.21c-4.347,0-7.872-3.524-7.872-7.872s3.524-7.872,7.872-7.872h209.211 c4.347,0,7.872,3.524,7.872,7.872S364.953,42.895,360.605,42.895z'
								/>
								<path
									fill='#FFFFFF'
									d='M360.605,482.658h-209.21c-4.347,0-7.872-3.524-7.872-7.872s3.524-7.872,7.872-7.872h209.211 c4.347,0,7.872,3.524,7.872,7.872S364.953,482.658,360.605,482.658z'
								/>
								<path
									fill='#FFFFFF'
									d='M474.524,367.078c-4.347,0-7.872-3.524-7.872-7.872V149.995c0-4.347,3.524-7.872,7.872-7.872 s7.872,3.524,7.872,7.872v209.211C482.396,363.554,478.871,367.078,474.524,367.078z'
								/>
								<path
									fill='#FFFFFF'
									d='M215.767,384.57c-4.347,0-7.872-3.524-7.872-7.872V135.736c0-4.347,3.524-7.872,7.872-7.872 s7.872,3.524,7.872,7.872v240.963C223.639,381.046,220.114,384.57,215.767,384.57z'
								/>
								<path
									fill='#FFFFFF'
									d='M296.233,384.57c-4.347,0-7.872-3.524-7.872-7.872V135.736c0-4.347,3.524-7.872,7.872-7.872 c4.347,0,7.872,3.524,7.872,7.872v240.963C304.105,381.046,300.58,384.57,296.233,384.57z'
								/>
							</g>
						</svg>
					</div>
				</div>
				<BubbleAnimation
					bgRef={bgRef}
					mode={getMode({ isComAlarm, mode, modeStates, stateWorkmode })}
					speed={stateWorkmode === 'stopped' || isComAlarm ? 0 : speedRenderedValue ? [...Array(getGear(speedRenderedValue, speedStates))].length : 0}
					maxDistance={100}
				/>
			</div>
			{tempRenderedValue && tempRenderedValue !== '--' && !isComAlarm ? (
				<div className={styles.acTempContainer}>
					<span className={styles.acTemp}>
						{tempRenderedValue}
						<span className={styles.acUnit}>°C</span>
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

export default Ac2;
