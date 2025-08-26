import { AuditListRoutingPagitnationProps } from 'modules/audit/components/AuditList/AuditListHook';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../AuditList.module.scss';
import { AuditListBuildingContextMenu } from '../AuditListRefsCell';

const AuditListBuildingUpdateRefsCell: React.FC<
	SuperTableCustomCellProps<BuildingUpdateEventDetails> & { updateSettingsDataHandler: (ob: Partial<AuditListRoutingPagitnationProps>) => void }
> = ({ value, updateSettingsDataHandler }) => {
	const { t } = useTranslation();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	return (
		<>
			<span>
				{t('audit.messages.change')}
				{t('audit.messages.in_building')}
				<a
					className={styles.link}
					onClick={() =>
						updateSettingsDataHandler({
							building: value.building.uuid,
							user: null as any,
							point: null as any,
							type: null as any,
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

export default AuditListBuildingUpdateRefsCell;
