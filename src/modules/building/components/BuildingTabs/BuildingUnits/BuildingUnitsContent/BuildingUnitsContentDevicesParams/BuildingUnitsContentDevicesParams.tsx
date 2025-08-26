import { Paper } from '@mui/material';
import { EditOutlined, FormatListBulletedOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BuildingUnitsEditor from '../../BuildingUnitsEditor/BuildingUnitsEditor';
import styles from '../BuildingUnitsContent.module.scss';
import BuildingUnitsParams from '../BuildingUnitsParams';

interface BuildingUnitsContentDevicesParamsProps {
	unit: Unit;
	isEditing?: boolean;
	onClose?: (editedUnitXid?: string) => void;
	onRemove?: (xid: string, name: string) => void;
	buildingUUID: string;
}

const BuildingUnitsContentDevicesParams: React.FC<BuildingUnitsContentDevicesParamsProps> = ({ unit, isEditing, onClose, onRemove, buildingUUID }) => {
	const { t } = useTranslation();
	return (
		<Paper className={cn(styles.content, { [styles.isEditing]: isEditing })} elevation={1}>
			{isEditing ? (
				<AuthDev>
					<div className={styles.label}>
						{<EditOutlined fontSize='inherit' />}
						<span>{t('buildings.units.device_edit')}</span>
					</div>
				</AuthDev>
			) : (
				<div className={styles.label}>
					{<FormatListBulletedOutlined fontSize='inherit' />}
					<span>
						{t('buildings.units.device_params')} <span style={{ opacity: 0.5 }}>({(unit?.params || []).length})</span>
					</span>
				</div>
			)}

			{isEditing && onClose && onRemove ? (
				<BuildingUnitsEditor unit={unit} onClose={onClose} onRemove={onRemove} buildingUUID={buildingUUID} />
			) : (unit?.params || []).length > 0 ? (
				<BuildingUnitsParams params={unit.params || []} />
			) : (
				<div className={styles.noResults}>{t('buildings.units.no_devices_params')}</div>
			)}
		</Paper>
	);
};

export default BuildingUnitsContentDevicesParams;
