import cn from 'classnames';
import { AuditListRoutingPagitnationProps } from 'modules/audit/components/AuditList/AuditListHook';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { renderPointValue } from 'modules/common/helpers/points/renderers';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../AuditList.module.scss';
import { AuditListBuildingContextMenu } from '../AuditListRefsCell';

const AuditListSetPointRefsCell: React.FC<
	SuperTableCustomCellProps<SetpointAuditEventDetails> & { updateSettingsDataHandler: (ob: Partial<AuditListRoutingPagitnationProps>) => void }
> = ({ value, updateSettingsDataHandler }) => {
	const { t } = useTranslation();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	return (
		<>
			<span>
				{t('audit.messages.parameter_change', { where: '' })}
				<a
					className={cn(styles.link, { [styles.emptyBuilding]: !value.building || !value.point })}
					onClick={() =>
						value.building && value.point && updateSettingsDataHandler({ type: 'SETPOINT', building: value.building.uuid, point: value.point.uuid })
					}
				>
					{value.point.name}
				</a>
				{t('audit.messages.in_building')}
				<a
					className={styles.link}
					onClick={() =>
						updateSettingsDataHandler({
							building: value.building.uuid,
							user: null as any,
							point: null as any,
							type: 'SETPOINT',
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
				{t('audit.messages.from')}
				<strong>{renderPointValue(value.point, { value: value.previousValue, ts: -1 })}</strong>
				{t('audit.messages.on')}
				<strong>{renderPointValue(value.point, { value: value.nextValue, ts: -1 })}</strong>
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

export default AuditListSetPointRefsCell;
