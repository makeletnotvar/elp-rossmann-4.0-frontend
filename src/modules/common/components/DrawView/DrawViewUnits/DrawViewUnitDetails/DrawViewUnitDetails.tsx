import { Box, Tab, Tabs } from '@mui/material';
import DrawViewUnitDetailsParams from 'modules/common/components/DrawView/DrawViewUnits/DrawViewUnitDetails/DrawViewUnitDetailsParams';
import DrawViewUnitDetailsPoints from 'modules/common/components/DrawView/DrawViewUnits/DrawViewUnitDetails/DrawViewUnitDetailsPoints';
import { usePoints } from 'modules/common/redux/points';
import * as React from 'react';
import { useMemo, useState } from 'react';
import styles from './../DrawViewUnits.module.scss';

interface DrawViewUnitDetailsProps {
	unit: Unit;
}

const DrawViewUnitDetails: React.FC<DrawViewUnitDetailsProps> = ({ unit }) => {
	const [tab, setTab] = useState(0);
	const { points } = usePoints();

	const unitXidFilter = (point: Point) => {
		if (point.unitXid !== undefined) {
			if ((point.unitXid || '?').toLowerCase() === (unit.xid || '_').toLowerCase()) {
				return true;
			}
		}
		return false;
	};

	const unitXidPoints = useMemo(() => {
		return points.filter(unitXidFilter);
	}, [points, unit.xid]);

	return (
		<div className={styles.container}>
			<section className={styles.header}>
				<h1 data-xid={unit.xid}>{unit.name}</h1>
			</section>
			<Box sx={{ height: 'calc(100% - 72px)' }}>
				<Tabs value={tab} onChange={(ev, value) => setTab(value)} aria-label='basic tabs example'>
					<Tab label={`Punkty (${unitXidPoints.length})`} />
					<Tab label={`Parametry (${unit.params.length})`} />
					<Tab label={`Dokumentacja (3)`} />
				</Tabs>
				{tab === 0 && <DrawViewUnitDetailsPoints points={unitXidPoints} />}
				{tab === 1 && <DrawViewUnitDetailsParams unit={unit} />}
			</Box>
		</div>
	);
};

export default DrawViewUnitDetails;
