import * as React from 'react';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { Link } from 'react-router-dom';
import styles from './MediaEventsListItemCell.module.scss';

const MediaEventsListItemDeviceCell: React.FunctionComponent<
	SuperTableCustomCellProps<Reference>
> = ({ value, row }) => {
	return (
		<>
			{value ? (
				<Link
					className={styles.deviceLink}
					to={`/media/${value.uuid}/readings/total`}
				>
					{value.name}
				</Link>
			) : (
				'---'
			)}
		</>
	);
};

export default MediaEventsListItemDeviceCell;
