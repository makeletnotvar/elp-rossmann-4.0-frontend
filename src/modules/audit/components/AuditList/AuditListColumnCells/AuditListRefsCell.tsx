import { FilterListOutlined, HomeOutlined } from '@mui/icons-material';
import { ListItemText, Menu, MenuItem } from '@mui/material';
import { AuditListRoutingPagitnationProps } from 'modules/audit/components/AuditList/AuditListHook';
import { AuditEventTypeEnum } from 'modules/audit/helpers/data';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import useRouter from 'use-react-router';
import styles from '../AuditList.module.scss';
import AuditListBuildingUpdateRefsCell from './AuditListRefsCells/AuditListBuildingUpdateRefsCell';
import AuditListEventAcknowledgeRefsCell from './AuditListRefsCells/AuditListEventAcknowledgeRefsCell';
import AuditListLoginRefsCell from './AuditListRefsCells/AuditListLoginRefsCell';
import AuditListSetPointRefsCell from './AuditListRefsCells/AuditListSetPointRefsCell';
import AuditListVHMISetPointRefsCell from './AuditListRefsCells/AuditListVHMISetPointRefsCell';
import AuditListVirtualHMIRefsCell from './AuditListRefsCells/AuditListVirtualHMIRefsCell';

export const AuditListBuildingContextMenu: React.FC<
	SuperTableCustomCellProps & {
		updateSettingsDataHandler: (ob: Partial<AuditListRoutingPagitnationProps>) => void;
		isMenuOpen: boolean;
		onClose: () => void;
		anchorEl: HTMLElement | null;
	}
> = ({ value, updateSettingsDataHandler, isMenuOpen, onClose, anchorEl }) => {
	const { history } = useRouter();

	return (
		<Menu
			className={styles.menu}
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'center',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			open={isMenuOpen}
			onClose={onClose}
		>
			<MenuItem className={styles.menuItem} onClick={() => history.push(`/building/${value.building.uuid}/info`)}>
				<HomeOutlined />
				<ListItemText primary='Przejdź do budynku' />
			</MenuItem>
			<MenuItem
				className={styles.menuItem}
				onClick={() =>
					updateSettingsDataHandler({
						building: value.building.uuid,
						user: null as any,
						point: null as any,
						type: null as any,
						toTs: null as any,
					})
				}
			>
				<FilterListOutlined />
				<ListItemText primary='Filtruj według budynku' />
			</MenuItem>
		</Menu>
	);
};

const AuditListRefsCell: React.FC<SuperTableCustomCellProps & { updateSettingsDataHandler: (ob: Partial<AuditListRoutingPagitnationProps>) => void }> = ({
	value,
	row,
	updateSettingsDataHandler,
}) => {
	const REF_COMPONENT: any = {
		[AuditEventTypeEnum.LOGIN]: AuditListLoginRefsCell,
		[AuditEventTypeEnum.SETPOINT]: AuditListSetPointRefsCell,
		[AuditEventTypeEnum.VIRTUAL_HMI]: AuditListVirtualHMIRefsCell,
		[AuditEventTypeEnum.BUILDING_UPDATE]: AuditListBuildingUpdateRefsCell,
		[AuditEventTypeEnum.EVENT_ACKNOWLEDGE]: AuditListEventAcknowledgeRefsCell,
		[AuditEventTypeEnum.VIRTUAL_HMI_SETPOINT]: AuditListVHMISetPointRefsCell,
	};

	const RefComponent = REF_COMPONENT[row.type];

	return <RefComponent value={value} updateSettingsDataHandler={updateSettingsDataHandler} />;
};

export default AuditListRefsCell;
