import { MoreHorizOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';

const MediaListRowActions = (rowData: any) => {
	const { history } = useRouter();
	const { t } = useTranslation();

	const clickHandler = useCallback(() => {
		history.push(`/media/${rowData.uuid}/readings/total`);
	}, []);

	return (
		<>
			<Tooltip title={t('general.details')} placement='bottom'>
				<span>
					<IconButton size='small' onClick={clickHandler}>
						<MoreHorizOutlined fontSize='inherit' />
					</IconButton>
				</span>
			</Tooltip>
		</>
	);
};

export default MediaListRowActions;
