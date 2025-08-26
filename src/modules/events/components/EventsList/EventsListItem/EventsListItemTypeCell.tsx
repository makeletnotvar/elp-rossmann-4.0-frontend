import { Devices, DeviceUnknown, Warning } from '@mui/icons-material';
import { SvgIconProps, Tooltip } from '@mui/material';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventsListItemCell.module.scss';

type IconsType = {
	[type in EventType]: React.ComponentType<SvgIconProps>;
};

function EventIcon({ value }: { value: EventType }) {
	const icons: IconsType = {
		NONE: DeviceUnknown,
		DEVICE_POINT_ALARM: Devices,
	};
	const Icon = icons[value];
	return Icon ? <Icon /> : <Warning />;
}

const EventsListItemTypeCell: React.FunctionComponent<SuperTableCustomCellProps<EventType>> = ({ value }) => {
	const { t } = useTranslation();

	return (
		<Tooltip title={t(`events.params.type_values.${value}`)}>
			<span className={styles.type}>
				<EventIcon value={value} />
			</span>
		</Tooltip>
	);
};

export default EventsListItemTypeCell;
