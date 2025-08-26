import React from 'react';
import styles from '../BuildingUnitsList.module.scss';
import AcIcon from './BuildingUnitsListIcons/AcIcon';
import AhuIcon from './BuildingUnitsListIcons/AhuIcon';
import CurIcon from './BuildingUnitsListIcons/CurIcon';
import FcIcon from './BuildingUnitsListIcons/FcIcon';
import GeneralIcon from './BuildingUnitsListIcons/GeneralIcon';
import MIcon from './BuildingUnitsListIcons/MIcon';
import WHIcon from './BuildingUnitsListIcons/WHIcon';

interface BuildingUnitsListIconProps {
	xid: string;
}

const BuildingUnitsListIcon: React.FC<BuildingUnitsListIconProps> = ({ xid }) => {
	const ICON: any = {
		ac: AcIcon,
		fc: FcIcon,
		cur: CurIcon,
		cur2: CurIcon,
		m: MIcon,
		ahu: AhuIcon,
		ahu2: AhuIcon,
		pc: WHIcon,
	};

	const IconComponent = ICON[xid?.split('_')[0]] || GeneralIcon;

	return <IconComponent className={styles.icon} />;
};

export default BuildingUnitsListIcon;
