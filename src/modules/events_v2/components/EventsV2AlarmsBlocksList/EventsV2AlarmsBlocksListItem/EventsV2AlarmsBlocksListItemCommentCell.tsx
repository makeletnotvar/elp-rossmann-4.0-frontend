import { CommentOutlined } from '@mui/icons-material';
import { Tooltip, Zoom } from '@mui/material';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import styles from './EventsV2AlarmsBlocksListItemCell.module.scss';

const EventsV2AlarmsBlocksListItemCommentCell: React.FunctionComponent<SuperTableCustomCellProps<Reference>> = ({ value }) => {
	return (
		<div className={styles.comment}>
			{value && (
				<Zoom in={true}>
					<Tooltip style={{ maxWidth: 300, color: '#0000008a' }} title={`${value}`} enterDelay={100}>
						<CommentOutlined fontSize='inherit' />
					</Tooltip>
				</Zoom>
			)}
		</div>
	);
};

export default EventsV2AlarmsBlocksListItemCommentCell;
