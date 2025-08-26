import { Tooltip } from '@mui/material';
import { AHURecType, useGetAHURecType } from 'modules/building/components/BuildingTabs/BuildingUnits/helpers/getAHURecType';
import { DrawViewItemValueComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import React from 'react';
import useRouter from 'use-react-router';
import DrawViewStatusItem from '../../../components/DrawViewStatusItem';
import { useCurrentBuildingEventsStatus } from '../../../helpers/useCurrentBuildingEventsStatus';
import styles from './ahu2.module.scss';
import { useAhuData } from './useAhuData';

interface Ahu2Props extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'arg2' | 'arg3' | 'pointRef' | 'pointXid' | 'buildingUUID' | 'editing'> {}
const Ahu2: React.FC<Ahu2Props> = ({ arg1, pointRef, pointXid, buildingUUID, editing }) => {
	const ahuType = useGetAHURecType();
	const { b1Value, b2Value, pwrsupValue, mode, ahuUUID, unitStateValue } = useAhuData(buildingUUID);
	const { isOnline, alarmsCount } = useCurrentBuildingEventsStatus('ahu');

	return (
		<Ahu2View
			arg1={arg1}
			isWorking={!isNaN(parseFloat(pwrsupValue)) && parseFloat(pwrsupValue) > 0}
			ahuType={ahuType}
			mode={mode}
			b1Value={b1Value}
			b2Value={b2Value}
			pointRef={pointRef}
			pointXid={pointXid}
			buildingUUID={buildingUUID}
			ahuUUID={ahuUUID}
			isComAlarm={!isOnline}
			alarmsCount={alarmsCount}
			unitStateValue={unitStateValue}
			editing={editing}
		/>
	);
};

interface Ahu2ViewProps extends Pick<DrawViewItemValueComponentProps, 'arg1' | 'editing'> {
	isWorking?: boolean;
	ahuType: AHURecType;
	b1Value: string;
	b2Value: string;
	pointRef: PointReference | null;
	pointXid?: string;
	mode: 'cooling' | 'heating' | 'mixed' | 'other';
	buildingUUID?: string;
	ahuUUID?: string | null;
	isComAlarm: boolean;
	unitStateValue: string;
	alarmsCount: number;
}

const Ahu2View: React.FC<Ahu2ViewProps> = ({
	isWorking,
	unitStateValue,
	ahuType,
	arg1,
	b1Value,
	b2Value,
	mode,
	ahuUUID,
	buildingUUID,
	isComAlarm,
	alarmsCount,
	editing,
}) => {
	const { history } = useRouter();

	return (
		<div className={styles.container}>
			<div className={styles.nameContainer} style={{ display: arg1 ? 'flex' : 'none' }}>
				<span className={styles.name}>{arg1}</span>
			</div>
			<div
				style={{ cursor: !editing && ahuUUID && buildingUUID ? 'pointer' : 'default' }}
				onDoubleClick={() => !editing && ahuUUID && buildingUUID && history.push(`/building/${buildingUUID}/view/${ahuUUID}`)}
			>
				<div className={`${styles.duct}`} style={{ backgroundColor: isComAlarm ? 'rgb(196, 196, 196)' : '#fff' }}>
					<div className={styles.alarmIcon} style={{ filter: isComAlarm ? 'brightness(85%)' : 'none' }}>
						<DrawViewStatusItem isOnline={!isComAlarm} eventsCount={alarmsCount} />
					</div>
					<span className={styles.tempInfo}>Wywiew</span>
					{!isComAlarm && (
						<Tooltip title='Temperatura wywiewu'>
							<span className={styles.temp}>
								{b2Value}
								<span className={styles.unit}>°C</span>
							</span>
						</Tooltip>
					)}
					{isWorking && (
						<>
							<div className={`${styles.airflowLeft} ${styles.l1} ${styles[mode || 'other']}`}></div>
							<div className={`${styles.airflowLeft} ${styles.l2} ${styles[mode || 'other']}`}></div>
							<div className={`${styles.airflowLeft} ${styles.l3} ${styles[mode || 'other']}`}></div>
						</>
					)}
				</div>
				<div className={`${styles.duct}`} style={{ backgroundColor: isComAlarm ? 'rgb(196, 196, 196)' : '#fff' }}>
					<span className={styles.tempInfo}>Nawiew</span>
					{!isComAlarm && (
						<Tooltip title='Temperatura nawiewu'>
							<span className={styles.temp}>
								{b1Value}
								<span className={styles.unit}>°C</span>
							</span>
						</Tooltip>
					)}
					{isWorking && (
						<>
							<div className={`${styles.airflowRight} ${styles.r1} ${styles[mode || 'other']}`}></div>
							<div className={`${styles.airflowRight} ${styles.r2} ${styles[mode || 'other']}`}></div>
							<div className={`${styles.airflowRight} ${styles.r3} ${styles[mode || 'other']}`}></div>
						</>
					)}
				</div>
				<div
					className={`${styles[(ahuType || AHURecType.CROSS).toLocaleLowerCase()]}`}
					style={{ backgroundColor: isComAlarm ? 'rgb(196, 196, 196)' : '#fff' }}
				></div>
			</div>
			{!isComAlarm && (
				<div className={styles.unitStateContainer} style={{ display: arg1 ? 'flex' : 'none' }}>
					<span className={styles.unitState}>{unitStateValue}</span>
				</div>
			)}
		</div>
	);
};

export default Ahu2;
