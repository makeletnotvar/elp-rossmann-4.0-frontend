import { CloseOutlined } from '@mui/icons-material';
import { IconButton, ListItem, ListItemAvatar, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import PointTypeIcon from 'modules/common/components/Points/PointIcon/PointTypeIcon';
import { isEnumPoint, isNumericPoint } from 'modules/common/helpers/points/points';
import {} from 'modules/data/helpers/charts';
import { getChartLineColor } from 'modules/data/helpers/chartsColors';
import * as React from 'react';
import styles from './DataPointsList.module.scss';

interface DataPointsListItemProps {
	point: Point;
	onRemove: () => void;
}

/**
 *
 * Point details depeneded on point type:
 * - enum - all states keys with comma separated (i.e. 0,1,2,3,4,5,6)
 * - numeric - unit
 *
 */
const getDetails = (point: Point): string => {
	if (point && point.customRender) {
		if (isNumericPoint(point)) {
			return (point.customRender as NumericRender).suffix || '-';
		} else if (isEnumPoint(point)) {
			return Object.keys((point.customRender as EnumRender).states).join(',');
		}
	}
	return '-';
};

const DataPointsListItem: React.FC<DataPointsListItemProps> = ({ point, onRemove }) => {
	const details = getDetails(point);
	const color = getChartLineColor(point.uuid!);
	const theme = useTheme();
	const isMobileSize = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<ListItem className={styles.item}>
			<ListItemAvatar className={styles.icon}>
				<PointTypeIcon type={point.type} />
			</ListItemAvatar>
			<ListItemText className={styles.color}>
				<span style={{ background: color }}></span>
			</ListItemText>
			<ListItemText className={styles.name}>{point.name || point.registerName}</ListItemText>
			<ListItemText className={styles.building}>{point.building ? point.building.name : 'no ref building'}</ListItemText>
			{!isMobileSize && <ListItemText className={styles.unit}>{details}</ListItemText>}
			<ListItemText className={styles.action}>
				<IconButton className={styles.button} color='default' size='small' onClick={onRemove}>
					<CloseOutlined />
				</IconButton>
			</ListItemText>
		</ListItem>
	);
};

export default DataPointsListItem;
