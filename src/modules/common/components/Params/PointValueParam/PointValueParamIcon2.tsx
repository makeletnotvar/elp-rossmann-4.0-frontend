import { AssignmentOutlined, DevicesOutlined, MoreVertOutlined, SettingsOutlined, TimelineOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { DAY_TS } from 'helpers/date';
import { useBuilding } from 'modules/building/containers/BuildingContainerHooks';
import moment from 'moment';
import React from 'react';
import useRouter from 'use-react-router';
import CustomContextMenu from '../../CustomContextMenu/CustomContextMenu';

interface PointValueParamIcon2Props {
	point?: Point | null;
	onSetPointButton?: () => void;
	isArchivePoint?: boolean;
	isPointSettable?: boolean;
}

const PointValueParamIcon2: React.FC<PointValueParamIcon2Props> = ({ point, isPointSettable, onSetPointButton, isArchivePoint }) => {
	return (
		<>
			{point ? (
				<PointValueParamIcon2Context point={point} isPointSettable={isPointSettable} isArchivePoint={isArchivePoint} onSetPointButton={onSetPointButton}>
					<MoreVertOutlined fontSize='inherit' />
				</PointValueParamIcon2Context>
			) : (
				<IconButton
					size='small'
					disabled
					style={{
						position: 'absolute',
						top: '50%',
						right: '5%',
						transform: 'translate(-5%, -50%)',
					}}
				>
					<MoreVertOutlined fontSize='inherit' style={{ opacity: 0.2 }} />
				</IconButton>
			)}
		</>
	);
};

const PointValueParamIcon2Context: React.FC<{
	point: Point;
	isPointSettable?: boolean;
	isArchivePoint?: boolean;
	onSetPointButton?: () => void;
	isDisabledSetPointButton?: boolean;
	children?: React.ReactNode;
}> = ({ point, isPointSettable, onSetPointButton, isArchivePoint, children }) => {
	const { building } = useBuilding(point.buildingUUID);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const { history } = useRouter();

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
			const device = building.devices.find(device => device.uuid === point.device?.uuid);

			if (device) {
				history.push(`/device/${device.uuid}/points/${point.uuid}`);
			}
		}
	};

	const handleHistory = () => {
		history.push(
			`/users-audits?fromTs=${moment(moment.now()).add(-7, 'days').add(4, 'hour').toDate().getTime()}&building=${building?.uuid}&o=0&point=${
				point?.uuid
			}&type=SETPOINT`
		);
	};

	const handleOpenDevice = () => {
		if (building && building.devices) {
			const device = building.devices.find(device => device.uuid === point.device?.uuid);

			if (device) {
				history.push(`/device/${device.uuid}/info`);
			}
		}
	};

	return (
		<React.Fragment>
			<IconButton
				style={{
					position: 'absolute',
					top: '50%',
					right: '5%',
					transform: 'translate(-5%, -50%)',
				}}
				size='small'
				onClick={handleClick}
			>
				{children}
			</IconButton>
			<CustomContextMenu
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={handleClose}
				menuItems={[
					{
						label: 'Ustaw wartość',
						onClick: () => onSetPointButton && onSetPointButton(),
						icon: SettingsOutlined,
						disabled: !isPointSettable,
						hideSeparator: true,
					},
					{
						label: 'Wykres 1 dzień',
						onClick: handleChart(1),
						icon: TimelineOutlined,
						disabled: !isArchivePoint,
						hideSeparator: true,
					},
					{
						label: 'Wykres 7 dni',
						onClick: handleChart(7),
						icon: TimelineOutlined,
						disabled: !isArchivePoint,
						hideSeparator: true,
					},
					{
						label: 'Wykres 30 dni',
						onClick: handleChart(30),
						icon: TimelineOutlined,
						disabled: !isArchivePoint,
					},
					{
						label: 'Urządzenie',
						onClick: handleOpenDevice,
						devOnly: true,
						icon: DevicesOutlined,
						hideSeparator: true,
					},
					{
						label: 'Edytuj punkt',
						onClick: handleEdit,
						devOnly: true,
						icon: SettingsOutlined,
					},
					{
						label: 'Historia zmian',
						onClick: handleHistory,
						devOrAdminOnly: true,
						icon: AssignmentOutlined,
						disabled: !isPointSettable,
					},
				]}
			/>
		</React.Fragment>
	);
};

export default PointValueParamIcon2;
