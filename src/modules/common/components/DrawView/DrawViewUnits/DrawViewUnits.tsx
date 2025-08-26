import { Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery } from '@mui/material';
import { CategoryOutlined, CloseOutlined } from '@mui/icons-material';
import BuildingUnitsContent from 'modules/building/components/BuildingTabs/BuildingUnits/BuildingUnitsContent/BuildingUnitsContent';
import BuildingUnitsList from 'modules/building/components/BuildingTabs/BuildingUnits/BuildingUnitsList/BuildingUnitsList';
import { useBuildingUnitsState } from 'modules/building/redux/buildingUnits';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { viewActions } from 'modules/common/redux/view';
import { theme } from 'modules/common/theme/materialTheme';
import * as React from 'react';
import { useState } from 'react';
import styles from './DrawViewUnits.module.scss';

interface DrawViewUnitsProps {
	unitXid: string;
	buildingUUID?: string;
}

const DrawViewUnits: React.FC<DrawViewUnitsProps> = ({ unitXid, buildingUUID }) => {
	const [selectedUnit, setSelectedUnit] = useState<string>(unitXid);
	const dispatch = useDispatch();
	const { units = [] } = useBuildingUnitsState();

	const closeHandler = () => {
		dispatch(viewActions.setUnit(undefined));
	};

	const unit = units.find(unit => unit.xid === selectedUnit);

	return (
		<Dialog open={Boolean(unitXid && unit)} maxWidth='xl' fullWidth onClose={closeHandler} fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<DialogTitle className={styles.title}>
				<CategoryOutlined />
				<label>Urządzenia</label>
				<IconButton size='small' className={styles.closeButton} onClick={closeHandler}>
					<CloseOutlined fontSize='inherit' />
				</IconButton>
			</DialogTitle>
			<DialogContent className={styles.container}>
				<BuildingUnitsList buildingUUID={buildingUUID} units={units} onSelect={xid => setSelectedUnit(xid)} disabled={false} selectedXid={selectedUnit} />
				{selectedUnit && unit && buildingUUID && <BuildingUnitsContent unit={unit} isEditing={false} buildingUUID={buildingUUID} />}
			</DialogContent>
		</Dialog>
	);
};

export default DrawViewUnits;
