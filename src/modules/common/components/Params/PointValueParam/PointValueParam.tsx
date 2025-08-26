import { SettingsOutlined } from '@mui/icons-material';
import { IconButton, SvgIconProps, Tooltip } from '@mui/material';
import cn from 'classnames';
import { useBuilding } from 'modules/building/containers/BuildingContainerHooks';
import PointValueParamSetter from 'modules/common/components/Params/PointValueParam/PointValueParamSetter';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { usePoint } from 'modules/common/redux/points';
import { pollActions } from 'modules/common/redux/poll';
import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { renderPointValue, renderPointValueTime } from '../../../helpers/points/renderers';
import { usePointValue } from '../../../redux/poll';
import paramsStyles from './../Params.module.scss';
import styles from './PointValueParam.module.scss';
import PointValueParamIcon from './PointValueParamIcon';

interface CustomValueClasses {
	[value: number]: string;
}

interface PointValueParamProps {
	uuid?: string;
	xid?: string;
	icon?: React.ComponentType<SvgIconProps>;
	label: string;
	className?: string;
	settable?: boolean;
	valueClasses?: CustomValueClasses;
	disabledActions?: boolean;
	hideIcon?: boolean;
	labelsClassName?: string;
	forceDisplay?: boolean;
}

const customClasses = (customValueClasses: CustomValueClasses, pointValue: PointValue): string => {
	return customValueClasses[pointValue.value] || '';
};

const PointValueParam: React.FC<PointValueParamProps> = ({
	uuid,
	xid,
	icon,
	label,
	className,
	valueClasses,
	settable,
	disabledActions,
	hideIcon = false,
	labelsClassName,
	forceDisplay,
}) => {
	const [editing, setEditing] = useState<boolean>(false);
	const [fetching, setFetching] = useState<boolean>(false);
	const { building } = useBuilding(undefined);

	const point = usePoint(uuid, xid);
	const value = usePointValue(uuid || (point ? point.uuid : '') || '');
	const dispatch = useDispatch();
	const type: PointType = point ? point.type : 'numeric';
	const valueClass: string = valueClasses && value ? customClasses(valueClasses, value) : '';

	// Render point value, return empty string if something is missing
	const renderedValue = useMemo(() => (point && value ? (point ? renderPointValue(point, value) : '') : ''), [value]);
	const tooltipLabel = renderPointValueTime(point, value);

	const isPointSettable = settable && point && point.settable;
	const isSetButtonDisabled = Boolean(building && (building.connection !== true || building.permissions !== 2));
	const showEditing = editing && isPointSettable;
	const showSetButton = settable && isPointSettable;

	/**
	 * Actions
	 */
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
		<>
			{((value || value === 0) && point) || forceDisplay ? (
				<div className={cn(paramsStyles.param, className, valueClass)}>
					{!hideIcon && (
						<div className={paramsStyles.iconWrapper}>
							<PointValueParamIcon icon={icon} type={type} point={point} isDisabled={disabledActions} />
						</div>
					)}
					<div className={cn(paramsStyles.labelsWrapper, labelsClassName)}>
						<Tooltip title={label || ''}>
							<label className={paramsStyles.label}>{label || 'Punkt'}</label>
						</Tooltip>
						<div className={paramsStyles.value}>
							{point && (value || value === 0) ? (
								showEditing ? (
									<PointValueParamSetter value={value.value} point={point} onCancel={cancelHandler} onSave={saveHandler} fetching={fetching} />
								) : (
									<Tooltip title={tooltipLabel} enterDelay={100}>
										<span>{renderedValue}</span>
									</Tooltip>
								)
							) : (
								'--'
							)}
						</div>
					</div>
					{!showEditing && showSetButton && <SetButton onClick={editHandler} disabled={isSetButtonDisabled} />}
				</div>
			) : null}
		</>
	);
};

const SetButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
	<IconButton className={styles.setpointButton} onClick={onClick} size='small' disabled={disabled}>
		<SettingsOutlined fontSize='inherit' color={disabled ? 'disabled' : 'secondary'} />
	</IconButton>
);

export default PointValueParam;
