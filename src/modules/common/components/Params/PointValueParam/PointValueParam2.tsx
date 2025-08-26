import { Box, Paper, Tooltip, Typography, useMediaQuery } from '@mui/material';
import classNames from 'classnames';
import { useBuilding } from 'modules/building/containers/BuildingContainerHooks';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { usePoint } from 'modules/common/redux/points';
import { pollActions } from 'modules/common/redux/poll';
import { theme } from 'modules/common/theme/materialTheme';
import React, { useCallback, useMemo, useState } from 'react';
import { renderPointValue, renderPointValueTime } from '../../../helpers/points/renderers';
import { usePointValue } from '../../../redux/poll';
import { CustomIcon } from '../../CustomIcon/CustomIcon';
import styles from './PointValueParam2.module.scss';
import PointValueParamIcon2 from './PointValueParamIcon2';
import PointValueParamSetter2 from './PointValueParamSetter2';

interface PointValueParam2Props {
	uuid?: string;
	xid?: string;
	icon?: MuiIconType;
	label: string;
	settable?: boolean;
	disabledActions?: boolean;
	hideIcon?: boolean;
	className?: string;
}

const PointValueParam2: React.FC<PointValueParam2Props> = ({ uuid, xid, label, settable, hideIcon = false, className }) => {
	const { building } = useBuilding(undefined);
	const point = usePoint(uuid, xid);
	const value = usePointValue(uuid || (point ? point.uuid : '') || '');
	const renderedValue = useMemo(() => (point && value ? renderPointValue(point, value) || '' : ''), [point, value]);
	const isMobileSize = useMediaQuery(theme.breakpoints.down('xs'));

	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);

	const dispatch = useDispatch();

	const tooltipLabel = renderPointValueTime(point, value);

	const hasPermissions = Boolean(building && building.connection === true && building.permissions === 2);
	const isPointSettable = settable && Boolean(point && point.settable) && hasPermissions;
	const isArchivePoint = Boolean(point && point.archive);

	const isEditingDisplay = isEditing && Boolean(isPointSettable);

	const saveHandler = useCallback(
		(nextValue: number) => {
			setIsFetching(true);
			const request = async () => {
				await dispatch(pollActions.setpoint.request(point!.uuid!, nextValue));
				setIsEditing(false);
				setIsFetching(false);
			};
			request();
		},
		[point]
	);

	return (
		<>
			{point && (
				<Paper className={classNames(styles.paper, className, { [styles.mobile]: isMobileSize })} elevation={0} square>
					<Box className={styles.topRow}>
						<Box className={styles.labelBox}>
							<CustomIcon style={{ fontSize: '0.75rem', marginTop: '-1px' }} point={point} nameToFilter={label} />
							<Tooltip title={label || point?.name || point?.fullName || 'Parametr'} placement='top'>
								<Typography className={styles.labelText}>{label || point?.name || point?.fullName || 'Parametr'}</Typography>
							</Tooltip>
						</Box>
						{!hideIcon && (
							<PointValueParamIcon2
								point={point}
								isPointSettable={isPointSettable}
								isArchivePoint={isArchivePoint}
								onSetPointButton={() => setIsEditing(true)}
							/>
						)}
					</Box>
					<Box className={styles.valueRow}>
						{point && (value?.value || value?.value === 0) ? (
							<Tooltip title={tooltipLabel}>
								<Typography onClick={() => isPointSettable && setIsEditing(true)} className={isPointSettable ? styles.settableValue : styles.valueText}>
									{renderedValue}
								</Typography>
							</Tooltip>
						) : (
							'---'
						)}
					</Box>
				</Paper>
			)}
			{point && (value?.value || value?.value === 0) && isEditingDisplay && (
				<PointValueParamSetter2 value={value.value} point={point} onCancel={() => setIsEditing(false)} onSave={saveHandler} fetching={isFetching} />
			)}
		</>
	);
};

export default PointValueParam2;
