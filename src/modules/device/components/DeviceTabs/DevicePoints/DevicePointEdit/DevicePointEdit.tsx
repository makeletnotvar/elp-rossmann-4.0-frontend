import { Paper } from '@mui/material';
import PointTypeIcon from 'modules/common/components/Points/PointIcon/PointTypeIcon';
import SettableIcon from 'modules/common/components/Points/SettableIcon/SettableIcon';
import DevicePointEditForm from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointEdit/DevicePointEditForm';
import * as React from 'react';
import styles from './DevicePointEdit.module.scss';

interface DevicePointEditProps {
	point: Point;
	isNew: boolean;
	onSave: (point: Point) => void;
	onDelete: (uuid: string) => void;
}

const DevicePointEdit: React.FC<DevicePointEditProps> = ({ point, isNew, onSave, onDelete }) => (
	<Paper className={styles.container}>
		<div className={styles.title}>
			<PointTypeIcon type={point.type} className={styles.typeIcon} />
			<label>{point ? point.name : '?'}</label>
			<SettableIcon settable={point.settable} className={styles.settableIcon} />
		</div>
		<DevicePointEditForm point={point} isNew={isNew} onSave={onSave} onDelete={onDelete} />
	</Paper>
);

export default DevicePointEdit;
