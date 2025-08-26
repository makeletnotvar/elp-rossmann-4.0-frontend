import { ShowChartOutlined } from '@mui/icons-material';
import { IconButton, ListItemText, Menu, MenuItem, SvgIconProps } from '@mui/material';
import { DAY_TS } from 'helpers/date';
import * as React from 'react';
import useRouter from 'use-react-router';
import styles from './PointValueParam.module.scss';

interface PointValueMediaParamIconProps {
	icon?: React.ComponentType<SvgIconProps>;
	point: Point | null;
	xid?: string;
	isDisabled?: boolean;
}

const PointValueMediaParamIcon: React.FC<PointValueMediaParamIconProps> = ({ icon: Icon, point, xid, isDisabled }) => {
	const ParamIcon = Icon || ShowChartOutlined;

	return (
		<>
			{point && xid && !isDisabled ? (
				<PointValueMediaParamIconContext xid={xid}>
					<ParamIcon />
				</PointValueMediaParamIconContext>
			) : (
				<IconButton size='small' disabled>
					<ParamIcon
						style={{
							opacity: !point || !xid || isDisabled ? 0.2 : 1,
						}}
					/>
				</IconButton>
			)}
		</>
	);
};

const PointValueMediaParamIconContext: React.FC<{ xid: string; children: React.ReactNode }> = ({ xid, children }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const {
		history,
		match: {
			params: { deviceUUID },
		},
	} = useRouter<{ deviceUUID: string }>();

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleChart = (days: number) => () => {
		const nowTs = Date.now();
		const fromTs = nowTs - DAY_TS * days;
		history.push(`/media/${deviceUUID}/params?fromTs=${fromTs}&p=${xid}&toTs=${nowTs}`);
	};

	return (
		<React.Fragment>
			<IconButton size='small' onClick={handleClick}>
				{children}
			</IconButton>
			<Menu id='point-value-context-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} className={styles.menu}>
				<MenuItem className={styles.menuItem} dense onClick={handleChart(1)}>
					<ShowChartOutlined />
					<ListItemText primary='Wykres 1 dzień' />
				</MenuItem>
				<MenuItem className={styles.menuItem} dense onClick={handleChart(7)}>
					<ShowChartOutlined />
					<ListItemText primary='Wykres 7 dni' />
				</MenuItem>
				<MenuItem className={styles.menuItem} dense onClick={handleChart(30)}>
					<ShowChartOutlined />
					<ListItemText primary='Wykres 30 dni' />
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
};

export default PointValueMediaParamIcon;
