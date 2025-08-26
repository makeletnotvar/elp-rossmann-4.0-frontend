import { ClearOutlined, DoneOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import cn from 'classnames';
import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingListCommunicationCell.module.scss';

const BuildingListCommunicationCell: React.FC<SuperTableCustomCellProps> = ({ value }) => {
	const { t } = useTranslation();
	const titlePath = `general.${value ? 'ok' : 'leak'}`;
	const title = t(titlePath).toUpperCase();

	return (
		<Tooltip title={title} enterDelay={100}>
			<span className={cn(styles.communication, { [styles.fail]: value === false })}>{value === false ? <ClearOutlined /> : <DoneOutlined />}</span>
		</Tooltip>
	);
};

export default BuildingListCommunicationCell;
