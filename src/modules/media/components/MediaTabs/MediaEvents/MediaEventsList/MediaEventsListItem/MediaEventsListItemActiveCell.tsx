import { ClearOutlined, ErrorOutlined as ErrorIcon } from '@mui/icons-material';
import { Chip } from '@mui/material';
import cn from 'classnames';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MediaEventsListItemCell.module.scss';

const MediaEventsListItemActiveCell: React.FunctionComponent<SuperTableCustomCellProps<EventPriority>> = ({ value }) => {
	const { t } = useTranslation();
	const label = value ? t('general.active') : t('general.inactive');

	return <Chip label={label} size='small' icon={value ? <ErrorIcon /> : <ClearOutlined />} className={cn(styles.status, { [styles.active]: value })} />;
};

export default MediaEventsListItemActiveCell;
