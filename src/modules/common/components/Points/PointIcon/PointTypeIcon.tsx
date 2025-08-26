import { LinearScaleOutlined, ShowChartOutlined } from '@mui/icons-material';
import cn from 'classnames';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PointTypeIcon.module.scss';

interface PointTypeIconProps extends Pick<Point, 'type'> {
	className?: string;
	settable?: boolean;
}

const PointTypeIcon: React.FC<PointTypeIconProps> = ({ type, className, settable }) => {
	const { t } = useTranslation();
	const title = t(`general.${type}`);

	return (
		<span title={title} className={styles.icon}>
			{type === 'numeric' ? (
				<ShowChartOutlined fontSize='small' className={cn(styles.numeric, className)} />
			) : (
				<LinearScaleOutlined fontSize='small' className={cn(styles.enum, className)} />
			)}
		</span>
	);
};

export default PointTypeIcon;
