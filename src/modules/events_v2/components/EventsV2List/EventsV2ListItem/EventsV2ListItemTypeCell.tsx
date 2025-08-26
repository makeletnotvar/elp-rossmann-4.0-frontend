import { DevicesOutlined, DeviceUnknownOutlined, WarningOutlined } from '@mui/icons-material';
import { SvgIconProps, Tooltip } from '@mui/material';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { EventV2Type } from 'modules/events_v2/types/eventV2-type.type';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventsV2ListItemCell.module.scss';

type IconsType = {
	[type in EventV2Type]: React.ComponentType<SvgIconProps>;
};

function EventIcon({ value }: { value: EventV2Type }) {
	const icons: IconsType = {
		NONE: DeviceUnknownOutlined,
		DEVICE_POINT_ALARM: DevicesOutlined,
	};
	const Icon = icons[value];
	return Icon ? <Icon /> : <WarningOutlined />;
}

const EventsV2ListItemTypeCell: React.FunctionComponent<SuperTableCustomCellProps<EventV2Type>> = ({ value }) => {
	const { t } = useTranslation();

	return (
		<Tooltip title={t(`events.params.type_values.${value}`)}>
			<span className={styles.type}>
				<EventIcon value={value} />
			</span>
		</Tooltip>
	);
};

export default EventsV2ListItemTypeCell;
