import { BubbleChartOutlined, DevicesOutlined, HouseOutlined, NotificationsActiveOutlined, VpnKeyOutlined } from '@mui/icons-material';
import { Tooltip, Typography } from '@mui/material';
import { AuditEventTypeEnum } from 'modules/audit/helpers/data';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../AuditList.module.scss';

const AuditListTypeCell: React.FC<SuperTableCustomCellProps> = ({ value }) => {
	const { t } = useTranslation();
	const title = t(`audit.types.${value}`);

	const TYPE_ICON: any = {
		[AuditEventTypeEnum.LOGIN]: VpnKeyOutlined,
		[AuditEventTypeEnum.SETPOINT]: BubbleChartOutlined,
		[AuditEventTypeEnum.VIRTUAL_HMI]: DevicesOutlined,
		[AuditEventTypeEnum.BUILDING_UPDATE]: HouseOutlined,
		[AuditEventTypeEnum.EVENT_ACKNOWLEDGE]: NotificationsActiveOutlined,
		[AuditEventTypeEnum.VIRTUAL_HMI_SETPOINT]: DevicesOutlined,
	};

	const TypeIcon = TYPE_ICON[value];

	return (
		<Tooltip title={title} enterDelay={100}>
			<div className={styles.typeContainer}>
				<TypeIcon className={styles.typeIcon} size='small' />
				<Typography style={{ fontSize: '0.75rem', lineHeight: 1.9 }}>{title}</Typography>
			</div>
		</Tooltip>
	);
};

export default AuditListTypeCell;
