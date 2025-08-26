import { Avatar, Fab, IconButton, Paper, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { AddOutlined, EditOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { useBuildingState } from 'modules/building/redux/building';
import BuildingListAlarmsCell from 'modules/buildings/components/BuildingsList/custom/BuildingListAlarmsCell/BuildingListAlarmsCell';
import { AuthDev, AuthDevOrAdmin } from 'modules/common/components/Auth/Auth';
import { useApp } from 'modules/common/selectors/app';
import { getEventsPriorityName } from 'modules/events_v2/helpers/eventsV2';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingUnitsList.module.scss';
import BuildingUnitsListIcon from './BuildingUnitsListIcon/BuildingUnitsListIcon';

interface BuildingUnitsListProps {
	units: Unit[];
	buildingUUID?: string;
	disabled: boolean;
	selectedXid?: string;
	onSelect: (xid: string) => void;
	onEdit?: (xid: string) => void;
	onAdd?: () => void;
}

const BuildingUnitsList: React.FC<BuildingUnitsListProps> = ({ units, buildingUUID, disabled, selectedXid = '', onSelect, onEdit, onAdd }) => {
	const { t } = useTranslation();
	const { building } = useBuildingState();

	const addHandler = () => {
		onAdd && onAdd();
	};
	const theme = useTheme();
	const isMobileSize = useMediaQuery(theme.breakpoints.down('xs'));

	const { events } = useApp();

	const getUnitState = (unit: Unit) => {
		const unitEvents = (events || []).filter(
			event => event.building.uuid === buildingUUID && unit.xid?.toLocaleLowerCase() === event.unitXid?.toLocaleLowerCase()
		);

		let hasConnectionAlarm = unitEvents.some(event => {
			return event.code?.toLocaleLowerCase().includes('com');
		});

		if (unit.xid === 'ahu') {
			hasConnectionAlarm = unitEvents.some(event => {
				return event.code?.toLocaleLowerCase().includes('com') && !event.code?.toLocaleLowerCase().includes('fc');
			});
		}

		return {
			unitEvents,
			online: !hasConnectionAlarm && building?.connection,
		};
	};

	return (
		<Paper className={styles.container} elevation={0}>
			<div className={styles.header}>
				<label style={{ fontWeight: 500, fontSize: '0.9em' }}>
					{t('buildings.units.devices')} <span style={{ opacity: 0.5 }}>({(units || []).length})</span>
				</label>
				<div>
					<AuthDevOrAdmin>
						{isMobileSize && onEdit && (
							<IconButton
								data-testid='building-units-edit-button'
								size='small'
								style={{ marginRight: '15px' }}
								onClick={() => onEdit(selectedXid)}
								disabled={disabled}
							>
								<EditOutlined />
							</IconButton>
						)}
					</AuthDevOrAdmin>
					<AuthDev>
						{!disabled && onAdd && (
							<Fab data-testid='building-add-group-button' className={styles.addIconFab} color='primary' onClick={addHandler} disabled={disabled}>
								<AddOutlined className={styles.addIcon} />
							</Fab>
						)}
					</AuthDev>
				</div>
			</div>
			<div className={styles.content}>
				{units.map(unit => {
					const { unitEvents, online } = getUnitState(unit);
					return (
						<div
							data-testid={`building-units-list-${unit.xid}`}
							key={unit.xid}
							className={cn(styles.item, { [styles.selected]: unit.xid === selectedXid })}
							onClick={() => onSelect(unit.xid)}
						>
							<div className={styles.left}>
								<BuildingUnitsListIcon xid={unit.xid} />
							</div>
							<div className={styles.center}>
								<Tooltip title={unit.name}>
									<div className={styles.name}>{unit.name}</div>
								</Tooltip>
								<div className={styles.xid}>{unit.xid}</div>
							</div>
							<div className={styles.right}>
								{(unitEvents || []).length > 0 && (
									<BuildingListAlarmsCell
										disabledLink
										count={(unitEvents || []).length}
										maxPriority={getEventsPriorityName(Math.max(...unitEvents.map(event => event.priorityIndex)))}
										buildingUUID={''}
									/>
								)}
								{online !== null && (
									<Tooltip title={online ? t('buildings.units.device_connected') : t('buildings.units.device_not_connected')}>
										<Avatar className={cn(styles.avatar, { [styles.online]: online })} children={<></>} />
									</Tooltip>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</Paper>
	);
};

export default BuildingUnitsList;
