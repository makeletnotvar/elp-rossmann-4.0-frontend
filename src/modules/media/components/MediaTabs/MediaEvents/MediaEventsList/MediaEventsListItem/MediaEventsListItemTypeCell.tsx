import { DevicesOutlined, DeviceUnknownOutlined, WarningOutlined } from '@mui/icons-material';
import { SvgIconProps, Tooltip } from '@mui/material';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MediaEventsListItemCell.module.scss';

type IconsType = {
	[type in EventType]: React.ComponentType<SvgIconProps>;
};

function EventIcon({ value }: { value: EventType }) {
	const icons: IconsType = {
		NONE: DeviceUnknownOutlined,
		DEVICE_POINT_ALARM: DevicesOutlined,
	};
	const Icon = icons[value];
	return Icon ? <Icon /> : <WarningOutlined />;
}

const MediaEventsListItemTypeCell: React.FunctionComponent<SuperTableCustomCellProps<EventType>> = ({ value }) => {
	const { t } = useTranslation();

	return (
		<Tooltip title={t(`media.params.type_values.${value}`)}>
			<span className={styles.type}>
				<EventIcon value={value} />
			</span>
		</Tooltip>
	);
};

export default MediaEventsListItemTypeCell;
