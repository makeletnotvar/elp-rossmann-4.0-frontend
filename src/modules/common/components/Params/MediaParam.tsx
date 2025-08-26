import { SettingsOutlined } from '@mui/icons-material';
import { IconButton, SvgIconProps, Tooltip } from '@mui/material';
import cn from 'classnames';
import PointValueMediaParamIcon from 'modules/common/components/Params/PointValueParam/PointValueMediaParamIcon';
import PointValueParamSetter from 'modules/common/components/Params/PointValueParam/PointValueParamSetter';
import { renderPointValueTime } from 'modules/common/helpers/points/renderers';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { usePoint } from 'modules/common/redux/points';
import { pollActions, usePointValue } from 'modules/common/redux/poll';
import * as React from 'react';
import { useCallback, useState } from 'react';
import paramsStyles from './Params.module.scss';
import styles from './PointValueParam/PointValueParam.module.scss';

interface MediaParamProps {
	xid?: string;
	value?: string | number;
	icon?: React.ComponentType<SvgIconProps>;
	label: string;
	className?: string;
	hideIcon?: boolean;
	disabledActions?: boolean;
	settable?: boolean;
	format?: 'hour';
}

const MediaParam: React.FC<MediaParamProps> = ({ xid, value, icon, label, className, hideIcon = false, disabledActions, settable, format }) => {
	const [editing, setEditing] = useState<boolean>(false);
	const [fetching, setFetching] = useState<boolean>(false);
	const dispatch = useDispatch();
	const point = usePoint(null, xid);
	const pointValue = usePointValue(point ? point.uuid : '');
	const tooltipLabel = renderPointValueTime(point, pointValue);

	const isPointSettable = settable && point && point.settable;
	const showEditing = editing && isPointSettable;
	const showSetButton = settable && isPointSettable;

	const formattedValue = format === 'hour' && pointValue ? formatTime(pointValue.value) : value;

	const saveHandler = useCallback(
		(nextValue: number) => {
			setFetching(true);
			const request = async () => {
				await dispatch(pollActions.setpoint.request(point!.uuid!, nextValue));
				setFetching(false);
				setEditing(false);
			};

			request();
		},
		[point]
	);

	const cancelHandler = useCallback(() => {
		setEditing(false);
	}, []);

	const editHandler = useCallback(() => {
		setEditing(true);
	}, []);

	return (
		<div className={cn(paramsStyles.param, className)}>
			<div className={cn(paramsStyles.labelsWrapper)}>
				<label className={paramsStyles.label}>{label}</label>
				<div className={paramsStyles.value}>
					{point && pointValue && xid ? (
						showEditing ? (
							<PointValueParamSetter value={pointValue.value} point={point} onCancel={cancelHandler} onSave={saveHandler} fetching={fetching} format={format} />
						) : (
							<>
								<Tooltip title={tooltipLabel} enterDelay={100}>
									<span>{formattedValue}</span>
								</Tooltip>
								{showSetButton && <SetButton onClick={editHandler} disabled={false} />}
							</>
						)
					) : (
						'--'
					)}
				</div>
			</div>
			{!hideIcon && (
				<div className={paramsStyles.iconWrapper}>
					<PointValueMediaParamIcon icon={icon} point={point} xid={xid} isDisabled={disabledActions} />
				</div>
			)}
		</div>
	);
};

const SetButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
	<IconButton className={styles.setpointButton} onClick={onClick} size='small' disabled={disabled}>
		<SettingsOutlined color={disabled ? 'disabled' : 'secondary'} />
	</IconButton>
);

export const formatTime = (hours: number) => {
	const pad = (num: number) => String(num).padStart(2, '0');
	const roundedHours = Math.floor(hours);
	const minutes = Math.round((hours - roundedHours) * 60);
	return `${pad(roundedHours)}:${pad(minutes)}`;
};

export default MediaParam;
