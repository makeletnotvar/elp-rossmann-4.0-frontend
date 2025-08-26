import { DevicesOutlined, LinearScaleOutlined, SettingsOutlined, TimelineOutlined } from '@mui/icons-material';
import { Button, ListItemText, Menu, MenuItem, SvgIconProps } from '@mui/material';
import { DAY_TS } from 'helpers/date';
import { useBuilding } from 'modules/building/containers/BuildingContainerHooks';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import * as React from 'react';
import useRouter from 'use-react-router';
import styles from './DrawViewItemParamPointValue.module.scss';

interface DrawViewItemParamPointValueIconProps {
	icon?: React.ComponentType<SvgIconProps>;
	type: PointType;
	point?: Point | null;
	isStatic?: boolean;
	isDisabled?: boolean;
}

type ParamsIcons = {
	[key in PointType]: React.ComponentType<SvgIconProps>;
};

const DrawViewItemParamPointValueIcon: React.FC<DrawViewItemParamPointValueIconProps> = ({ icon: Icon, type, point, isStatic, isDisabled }) => {
	const paramsIcons: ParamsIcons = {
		enum: LinearScaleOutlined,
		numeric: TimelineOutlined,
	};

	const ParamIcon = Icon || paramsIcons[type] || SettingsOutlined;

	return (
		<>
			{point && !isDisabled ? (
				<DrawViewItemParamPointValueIconContext point={point!}>
					<ParamIcon />
				</DrawViewItemParamPointValueIconContext>
			) : (
				<Button disabled className={styles.button}>
					<ParamIcon style={{ opacity: 0.2 }} />
				</Button>
			)}
		</>
	);
};

const DrawViewItemParamPointValueIconContext: React.FC<{ point: Point; children?: React.ReactNode }> = ({ point, children }) => {
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

	return (
		<React.Fragment>
			<Button style={{ minWidth: 20, padding: '3px 3px' }} onClick={handleClick} className={styles.button}>
				{children}
			</Button>

			{showChartDataLinks && (
				<Menu id='point-value-context-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} className={styles.menu}>
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
					<AuthDev>
						<MenuItem className={styles.menuItem} dense onClick={handleOpenDevice}>
							<DevicesOutlined />
							<ListItemText primary='Urządzenie' />
						</MenuItem>
					</AuthDev>
					<AuthDev>
						<MenuItem className={styles.menuItem} dense onClick={handleEdit}>
							<SettingsOutlined />
							<ListItemText primary='Edytuj punkt' />
						</MenuItem>
					</AuthDev>
				</Menu>
			)}
		</React.Fragment>
	);
};

export default DrawViewItemParamPointValueIcon;
