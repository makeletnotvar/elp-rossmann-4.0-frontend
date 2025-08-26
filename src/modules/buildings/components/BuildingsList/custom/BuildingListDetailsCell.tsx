import { Tooltip, Typography, Zoom } from '@mui/material';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';

const BuildingListDetailsCell: React.FunctionComponent<SuperTableCustomCellProps> = ({ value }) => {
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -30 }}>
			{value && (
				<Zoom in={true} timeout={100}>
					<Tooltip
						style={{ maxWidth: 400, color: '#0000008a' }}
						title={<Typography style={{ whiteSpace: 'pre-line', fontSize: 12 }}>{value}</Typography>}
						enterDelay={100}
					>
						<span style={{ maxWidth: 530, textOverflow: 'ellipsis', overflow: 'hidden', display: 'inline-block' }}>{value}</span>
					</Tooltip>
				</Zoom>
			)}
		</div>
	);
};

export default BuildingListDetailsCell;
