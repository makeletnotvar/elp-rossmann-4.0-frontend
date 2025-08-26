import { AssignmentOutlined, DevicesOutlined, LinearScaleOutlined, SettingsOutlined, TimelineOutlined } from '@mui/icons-material';
import { IconButton, ListItemText, Menu, MenuItem, SvgIconProps } from '@mui/material';
import { DAY_TS } from 'helpers/date';
import { useBuilding } from 'modules/building/containers/BuildingContainerHooks';
import { AuthDev, AuthDevOrAdmin } from 'modules/common/components/Auth/Auth';
import * as React from 'react';
import useRouter from 'use-react-router';
import styles from './PointValueParam.module.scss';

interface PointValueParamIconProps {
	icon?: React.ComponentType<SvgIconProps>;
	type: PointType;
	point?: Point | null;
	isStatic?: boolean;
	isDisabled?: boolean;
}

type ParamsIcons = {
	[key in PointType]: React.ComponentType<SvgIconProps>;
};

const PointValueParamIcon: React.FC<PointValueParamIconProps> = ({ icon: Icon, type, point, isStatic, isDisabled }) => {
	const paramsIcons: ParamsIcons = {
		enum: LinearScaleOutlined,
		numeric: TimelineOutlined,
	};

	const ParamIcon = Icon || paramsIcons[type] || SettingsOutlined;

	return (
		<>
			{point && !isDisabled ? (
				<PointValueParamIconContext point={point!}>
					<ParamIcon />
				</PointValueParamIconContext>
			) : (
				<IconButton size='small' disabled>
					<ParamIcon style={{ opacity: isStatic ? 0.6 : 1 }} />
				</IconButton>
			)}
		</>
	);
};

const PointValueParamIconContext: React.FC<{ point: Point; children: React.ReactNode }> = ({ point, children }) => {
	const { building } = useBuilding(point.buildingUUID);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const { history } = useRouter();
	const showChartDataLinks = point.archive;

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleChart = (days: number) => () => {
		const nowTs = Date.now();
		const fromTs = nowTs - DAY_TS * days;
		history.push(`/data/?from=${fromTs}&p=${point.uuid}&to=${nowTs}&ref=point`);
	};

	const handleEdit = () => {
		if (building && building.devices) {
			const device = building.devices[0];

			if (device) {
				history.push(`/device/${device.uuid}/points/${point.uuid}`);
			}
		}
	};

	const handleOpenDevice = () => {
		if (building && building.devices) {
			const device = building.devices[0];

			if (device) {
				history.push(`/device/${device.uuid}/info`);
			}
		}
	};

	const handleShowHistory = () => {
		if (building && building.devices) {
			const device = building.devices[0];
			if (device) {
				history.push(`/users-audits?building=${building.uuid}&point=${point.uuid}&type=SETPOINT`);
			}
		}
	};

	return (
		<React.Fragment>
			<IconButton size='small' onClick={handleClick}>
				{children}
			</IconButton>
			<Menu id='point-value-context-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} className={styles.menu}>
				{showChartDataLinks && (
					<React.Fragment>
						<MenuItem className={styles.menuItem} dense onClick={handleChart(1)}>
							<TimelineOutlined />
							<ListItemText primary='Wykres 1 dzień' />
						</MenuItem>
						<MenuItem className={styles.menuItem} dense onClick={handleChart(7)}>
							<TimelineOutlined />
							<ListItemText primary='Wykres 7 dni' />
						</MenuItem>
						<MenuItem className={styles.menuItem} dense onClick={handleChart(30)}>
							<TimelineOutlined />
							<ListItemText primary='Wykres 30 dni' />
						</MenuItem>
					</React.Fragment>
				)}
				<AuthDev>
					<MenuItem className={styles.menuItem} dense onClick={handleOpenDevice}>
						<DevicesOutlined />
						<ListItemText primary='Urządzenie' />
					</MenuItem>
					<MenuItem className={styles.menuItem} dense onClick={handleEdit}>
						<SettingsOutlined />
						<ListItemText primary='Edytuj punkt' />
					</MenuItem>
				</AuthDev>
				{point.settable && (
					<AuthDevOrAdmin>
						<MenuItem className={styles.menuItem} dense onClick={handleShowHistory}>
							<AssignmentOutlined />
							<ListItemText primary='Historia zmian' />
						</MenuItem>
					</AuthDevOrAdmin>
				)}
			</Menu>
		</React.Fragment>
	);
};

export default PointValueParamIcon;
