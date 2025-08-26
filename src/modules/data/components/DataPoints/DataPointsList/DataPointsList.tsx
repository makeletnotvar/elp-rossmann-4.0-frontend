import { List, ListSubheader, Skeleton, Typography } from '@mui/material';
import Loader from 'modules/common/components/Loaders/Loader';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { DataPointsProps } from './../DataPoints';
import styles from './DataPointsList.module.scss';
import DataPointsListItem from './DataPointsListItem';
import DataPointsListTitleLabel from './DataPointsListTitleLabel';

interface DataPointsListProps extends Pick<DataPointsProps, 'points' | 'fetched' | 'fetching' | 'onRemove'> {
	//
}

const DataPointsList: React.FC<DataPointsListProps> = ({ points, fetching, onRemove }) => {
	const { t } = useTranslation();

	return (
		<List
			className={styles.list}
			subheader={
				<ListSubheader className={styles.subheader}>
					<Typography className={styles.title}>
						<DataPointsListTitleLabel count={points.length} fetching={fetching} />
					</Typography>
				</ListSubheader>
			}
		>
			{fetching && points.length === 0 ? (
				<Loader label={t('data.messages.loading_points')} />
			) : (
				points.map(point => <DataPointsListItem point={point} key={point.uuid} onRemove={() => point.uuid && onRemove(point.uuid)} />)
			)}
			{!fetching && points.length === 0 && <span className={styles.empty}>{t('data.messages.no_points')}</span>}
			{fetching && points.length > 0 && <Skeleton variant='text' width='100%' />}
		</List>
	);
};

export default DataPointsList;
