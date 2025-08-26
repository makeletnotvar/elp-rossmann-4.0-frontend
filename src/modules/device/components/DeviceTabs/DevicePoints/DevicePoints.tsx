import DevicePointEditContainer from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointEdit/DevicePointEditContainer';
import { usePointDelete } from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointEdit/DevicePointEditHooks';
import { usePointsImport } from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsHooks';
import DevicePointsImportContainer from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsImport/DevicePointsImportContainer';
import DevicePointsList from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsList';
import * as React from 'react';
import { useCallback } from 'react';
import useRouter from 'use-react-router';
import styles from './DevicePoints.module.scss';

export interface DevicePointsProps {
	points: Point[];
	sortingDir: 'desc' | 'asc' | undefined;
	sortingParam: string;
	onUpdateSettings: (ob: any) => void;
}

const DevicePoints: React.FC<DevicePointsProps> = ({ points, sortingDir, sortingParam, onUpdateSettings }) => {
	const {
		history,
		match: {
			params: { uuid, pointUUID },
		},
	} = useRouter<{ uuid: string; pointUUID: string }>();
	const { importActive, setImportActive } = usePointsImport();
	const { deleteHandler } = usePointDelete();

	const editHandler = useCallback((editingPointUUID: string) => {
		history.push(`/device/${uuid}/points/${editingPointUUID}`);
	}, []);

	return (
		<div className={styles.container}>
			<DevicePointsList
				points={points}
				onEdit={editHandler}
				onDelete={deleteHandler}
				onImport={() => setImportActive(true)}
				sortingDir={sortingDir}
				sortingParam={sortingParam}
				onUpdateSettings={onUpdateSettings}
			/>
			<DevicePointEditContainer uuid={pointUUID} isNew={false} onDelete={deleteHandler} />
			<DevicePointsImportContainer deviceUUID={uuid} onClose={() => setImportActive(false)} open={importActive} />
		</div>
	);
};

export default DevicePoints;
