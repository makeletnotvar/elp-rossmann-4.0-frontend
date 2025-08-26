import { CategoryOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import useRouter from 'use-react-router';

const EventsV2ListItemUnitCell: React.FunctionComponent<SuperTableCustomCellProps<Reference>> = ({ value, row }) => {
	const { history } = useRouter();

	return value && row?.building?.uuid ? (
		<AuthDev>
			<Tooltip title={'Przejdź do urządzenia'}>
				<IconButton size='small' onClick={() => history.push(`/building/${row?.building?.uuid}/units/${value}`)}>
					<CategoryOutlined fontSize='inherit' />
				</IconButton>
			</Tooltip>
		</AuthDev>
	) : null;
};

export default EventsV2ListItemUnitCell;
