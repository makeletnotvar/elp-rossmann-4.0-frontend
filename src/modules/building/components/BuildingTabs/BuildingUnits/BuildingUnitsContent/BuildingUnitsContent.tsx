import { Fab, Paper, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { AuthDev, AuthDevOrAdmin } from 'modules/common/components/Auth/Auth';
import { usePoints } from 'modules/common/redux/points';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingUnitsContent.module.scss';
import BuildingUnitsContentAlarms from './BuildingUnitsContentAlarms/BuildingUnitsContentAlarms';
import BuildingUnitsContentDevicesParams from './BuildingUnitsContentDevicesParams/BuildingUnitsContentDevicesParams';
import BuildingUnitsContentDevicesPoints from './BuildingUnitsContentDevicesPoints/BuildingUnitsContentDevicesPoints';

interface BuildingUnitsContentProps {
	unit: Unit;
	isEditing?: boolean;
	onRemove?: (xid: string, name: string) => void;
	onEdit?: (xid: string) => void;
	onClose?: (editedUnitXid?: string) => void;
	buildingUUID: string;
}

const BuildingUnitsContent: React.FC<BuildingUnitsContentProps> = ({ unit, isEditing, onEdit, onRemove, onClose, buildingUUID }) => {
	const { points } = usePoints();
	const { t } = useTranslation();
	const theme = useTheme();
	const isMobileSize = useMediaQuery(theme.breakpoints.down('xs'));

	const unitXidFilter = (point: Point) => {
		if (point.unitXid !== undefined) {
			return (point.unitXid || '??').toLowerCase() === (unit.xid || '?_?').toLowerCase();
		}
		return false;
	};

	const unitsPoints = points.filter(unitXidFilter);

	return (
		<div className={styles.container}>
			{!isMobileSize && (
				<Paper className={styles.header} elevation={1}>
					<div className={styles.wrapper}>
						<span className={styles.name}>{unit.name}</span>
						<AuthDev>
							<span className={styles.xid}>{unit.xid}</span>
						</AuthDev>
					</div>
					{!isEditing && (
						<AuthDevOrAdmin>
							<div className={styles.editButton}>
								{!isMobileSize && onEdit && (
									<>
										<Tooltip title={t('general.edit')}>
											<Fab
												data-testid='building-units-edit-button'
												className={styles.addIconFab}
												aria-label='Add'
												onClick={() => onEdit(unit.xid)}
												size='small'
												color='primary'
											>
												<EditOutlined className={styles.addIcon} />
											</Fab>
										</Tooltip>
									</>
								)}
							</div>
						</AuthDevOrAdmin>
					)}
				</Paper>
			)}
			<div className={styles.contentContainer}>
				<div className={styles.params}>
					{!isEditing && <BuildingUnitsContentDevicesPoints unitsPoints={unitsPoints} />}
					<BuildingUnitsContentDevicesParams unit={unit} isEditing={isEditing} onClose={onClose} onRemove={onRemove} buildingUUID={buildingUUID} />
				</div>
				<div className={styles.alarms}>
					<BuildingUnitsContentAlarms unitXid={unit.xid} buildingUUID={buildingUUID} />
				</div>
			</div>
		</div>
	);
};

export default BuildingUnitsContent;
