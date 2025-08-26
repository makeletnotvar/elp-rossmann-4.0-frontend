import { Box, Paper, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { default as classNames } from 'classnames';
import { useBuilding } from 'modules/building/containers/BuildingContainerHooks';
import { CustomIcon } from 'modules/common/components/CustomIcon/CustomIcon';
import PointValueParamIcon2 from 'modules/common/components/Params/PointValueParam/PointValueParamIcon2';
import PointValueParamSetter2 from 'modules/common/components/Params/PointValueParam/PointValueParamSetter2';
import { renderPointValue, renderPointValueTime } from 'modules/common/helpers/points/renderers';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { usePoint } from 'modules/common/redux/points';
import { pollActions, usePointValue } from 'modules/common/redux/poll';
import { theme } from 'modules/common/theme/materialTheme';
import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import styles from './DrawViewItemParamPointValue.module.scss';

interface DrawViewItemParamPointValueProps {
	uuid?: string;
	xid?: string;
	label: string;
	className?: string;
	settable?: boolean;
	hideIcon?: boolean;
	buildingUUID?: string;
	width?: number;
	editing?: boolean;
}

const DrawViewItemParamPointValue: React.FC<DrawViewItemParamPointValueProps> = ({
	uuid,
	xid,
	label,
	className,
	settable,
	hideIcon = false,
	buildingUUID,
	width,
	editing,
}) => {
	const { building } = useBuilding(buildingUUID);
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

	return point || editing ? (
		<div className={styles.param} style={{ width: width || 240 }}>
			<Paper className={classNames(styles.paper, className, { [styles.mobile]: isMobileSize })} elevation={0} square>
				<Box className={styles.topRow}>
					<Box className={styles.labelBox}>
						<CustomIcon style={{ fontSize: '0.75rem', marginTop: '-1px' }} point={point} nameToFilter={label} />
						<Tooltip title={label || point?.name || point?.fullName || 'Parametr'} placement='top'>
							<Typography className={classNames(styles.labelText)} style={{ maxWidth: width ? `${width - 80}px` : '170px' }}>
								{label || point?.name || point?.fullName || 'Parametr'}
							</Typography>
						</Tooltip>
					</Box>
					{!hideIcon && (
						<PointValueParamIcon2 point={point} isPointSettable={isPointSettable} isArchivePoint={isArchivePoint} onSetPointButton={() => setIsEditing(true)} />
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
			{point && (value?.value || value?.value === 0) && isEditingDisplay && (
				<PointValueParamSetter2 value={value.value} point={point} onCancel={() => setIsEditing(false)} onSave={saveHandler} fetching={isFetching} />
			)}
		</div>
	) : null;
};

export default DrawViewItemParamPointValue;
