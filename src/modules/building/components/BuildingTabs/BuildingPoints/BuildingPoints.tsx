import { IconButton, Tooltip } from '@mui/material';
import { SettingsOutlined } from '@mui/icons-material';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import SuperTable, { SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import PointTypeIcon from 'modules/common/components/Points/PointIcon/PointTypeIcon';
import { renderPointTime, renderPointValue } from 'modules/common/helpers/points/renderers';
import { usePoll } from 'modules/common/redux/poll';
import * as React from 'react';
import { useCallback } from 'react';
import useRouter from 'use-react-router';
import styles from './BuildingPoints.module.scss';
import { useBuildingPoints } from './buildingPointsHooks';

interface BuildingPointsProps {
	building: Building;
}

const BuildingPoints: React.FC<BuildingPointsProps> = ({ building }) => {
	const poll = usePoll();
	const { points, onUpdateSettings, sortingDir, sortingParam } = useBuildingPoints();
	const { history } = useRouter();

	const getPointValue = (uuid: string): PointValue | null => {
		if (poll && poll.data) {
			const pv: PointValue | null = poll.data.pointsValues[uuid];
			return pv || null;
		}
		return null;
	};

	const columns: SuperTableDataColumns<Point> = {
		id: {
			label: '',
			tdClassName: styles.id,
			custom: ({ index }) => <>{index}</>,
			hidden: true,
		},
		type: {
			label: 'Typ',
			tdClassName: styles.type,
			custom: ({ value }) => <PointTypeIcon type={value} />,
			align: 'right',
		},
		name: {
			label: 'Nazwa',
			tdClassName: styles.name,
			custom: ({ value }) => <>{value || 'Undefined name'}</>,
		},
		xid: {
			label: 'XID',
			tdClassName: styles.xid,
		},
		uuid3: {
			label: 'Czas',
			tdClassName: styles.time,
			disabledSorting: true,
			custom: ({ value, row }) => {
				const pv = getPointValue(row.uuid);
				const time = renderPointTime(pv);
				return <>{time}</>;
			},
		},
		uuid2: {
			label: 'Wartość liczbowa',
			tdClassName: styles.pureValue,
			disabledSorting: true,
			custom: ({ value, row }) => {
				const pv = getPointValue(row.uuid);
				return <>{pv ? pv.value : '--'}</>;
			},
		},
		uuid: {
			label: 'Wartość',
			disabledSorting: true,
			tdClassName: styles.value,
			custom: ({ value, row }) => {
				const pv = getPointValue(row.uuid);
				const renderedValue = renderPointValue(row, pv, '--');
				return <>{renderedValue}</>;
			},
		},
	};

	const onClickPoint = useCallback((rowData: any) => {
		if (building && building.devices) {
			history.push(`/device/${building?.devices[0]?.uuid}/points/${rowData?.uuid}`);
		}
	}, []);

	return (
		<div className={styles.container}>
			<SuperTable
				data={Object.values(points)}
				columns={columns}
				hidePagination={true}
				searchable
				wrapperClassName={styles.wrapper}
				sortable
				onUpdateSettings={onUpdateSettings}
				sortingDir={sortingDir}
				sortingParam={sortingParam}
				rowActions={rowData => (
					<AuthDev>
						<Tooltip title='Edycja punktu'>
							<IconButton size='small' onClick={() => onClickPoint(rowData)}>
								<SettingsOutlined fontSize='inherit' />
							</IconButton>
						</Tooltip>
					</AuthDev>
				)}
			/>
		</div>
	);
};

export default BuildingPoints;
