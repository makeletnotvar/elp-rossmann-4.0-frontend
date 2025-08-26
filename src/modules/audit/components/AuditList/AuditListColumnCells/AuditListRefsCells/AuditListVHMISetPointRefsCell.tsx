import cn from 'classnames';
import { AuditListRoutingPagitnationProps } from 'modules/audit/components/AuditList/AuditListHook';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../AuditList.module.scss';
import { AuditListBuildingContextMenu } from '../AuditListRefsCell';

const AuditListVHMISetPointRefsCell: React.FC<
	SuperTableCustomCellProps<VirtualHMISetpointAuditEventDetails> & { updateSettingsDataHandler: (ob: Partial<AuditListRoutingPagitnationProps>) => void }
> = ({ value, updateSettingsDataHandler }) => {
	const { t } = useTranslation();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	return (
		<>
			<span>
				{t('audit.messages.parameter_change', { where: 'VirtualHMI' })}
				<a
					className={cn(styles.link, { [styles.emptyBuilding]: !value.building || !value.point })}
					onClick={() =>
						value.building && value.point && updateSettingsDataHandler({ type: 'VIRTUAL_HMI_SETPOINT', building: value.building.uuid, point: value.point.uuid })
					}
				>
					{value.param}
				</a>
				{value.building && (
					<>
						{t('audit.messages.in_building')}
						<a
							className={styles.link}
							onClick={() =>
								updateSettingsDataHandler({
									building: value.building.uuid,
									user: null as any,
									point: null as any,
									type: 'VIRTUAL_HMI_SETPOINT',
									toTs: null as any,
								})
							}
							onContextMenu={evt => {
								evt.preventDefault();
								setAnchorEl(evt.currentTarget);
							}}
						>
							{value.building.name}
						</a>
					</>
				)}
				{t('audit.messages.from')}
				<strong>{!isNaN(Number(value.previousValue)) ? Number(Number(value.previousValue).toFixed(1)) : value.previousValue}</strong>
				{t('audit.messages.on')}
				<strong>{!isNaN(Number(value.nextValue)) ? Number(Number(value.nextValue).toFixed(1)) : value.nextValue}</strong>
			</span>
			<AuditListBuildingContextMenu
				value={value}
				anchorEl={anchorEl}
				isMenuOpen={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				updateSettingsDataHandler={updateSettingsDataHandler}
			/>
		</>
	);
};

export default AuditListVHMISetPointRefsCell;
