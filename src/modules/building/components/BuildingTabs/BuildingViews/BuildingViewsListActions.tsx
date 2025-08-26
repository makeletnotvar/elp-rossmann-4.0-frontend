import { DeleteOutlined, EditOutlined, ImageOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import React from 'react';
import { useTranslation } from 'react-i18next';

const BuildingViewsListActions: React.FC<any> = ({ uuid, onMore, onEdit, onRemove }) => {
	const { t } = useTranslation();

	return (
		<>
			<AuthDev>
				<Tooltip title={t('general.delete')} placement='bottom'>
					<IconButton size='small' onClick={() => onRemove(uuid)}>
						<DeleteOutlined fontSize='inherit' />
					</IconButton>
				</Tooltip>
				<Tooltip title={t('general.edit')} placement='bottom'>
					<IconButton size='small' onClick={() => onEdit(uuid)}>
						<EditOutlined fontSize='inherit' />
					</IconButton>
				</Tooltip>
			</AuthDev>
			<Tooltip title={t('general.show')} placement='bottom'>
				<IconButton size='small' onClick={() => onMore(uuid)}>
					<ImageOutlined fontSize='inherit' />
				</IconButton>
			</Tooltip>
		</>
	);
};

export default BuildingViewsListActions;
