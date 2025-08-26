import { Fab, Tooltip } from '@mui/material';
import { AddOutlined, NotificationsOutlined } from '@mui/icons-material';
import { UI } from 'config/ui';
import AlarmsConfigSearch from 'modules/alarmsConfig/components/AlarmsConfigLayout/AlarmsConfigTitleBar/AlarmsConfigSearch';
import { useAlarmsConfigState } from 'modules/alarmsConfig/redux/alarmsConfig';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AlarmsConfigTitleBar.module.scss';

interface AlarmsConfigTitleBarProps {
	query: string;
	onSearch: (query: string) => void;
	onReset: () => void;
	onOpen: (code?: string) => void;
}

const AlarmsConfigTitleBar: React.FC<AlarmsConfigTitleBarProps> = ({ query, onSearch, onReset, onOpen }) => {
	const [q, setQ] = useState(query || '');
	const { t } = useTranslation();
	const { countAll } = useAlarmsConfigState();

	const countLabel = countAll > -1 ? ' (' + countAll + ')' : '';
	const label = `${t('alarmsConfig.alarmsConfig_list')}${countLabel}`;

	const searchHandler = () => {
		q.length >= UI.SEARCH.QUERY_MIN_LENGTH ? onSearch(q) : onReset();
	};

	return (
		<TitleBar label={label} icon={NotificationsOutlined}>
			<AlarmsConfigSearch
				onChange={setQ}
				query={q}
				queryParam={query}
				onSearch={searchHandler}
				onReset={() => {
					setQ('');
					onReset();
				}}
			/>
			<Tooltip title={t('alarmsConfig.messages.add_new_alarmConfig')}>
				<Fab data-testid='alarmConfig-add-button' className={styles.addIconFab} aria-label='Add' onClick={() => onOpen()} size='small' color='primary'>
					<AddOutlined className={styles.addIcon} />
				</Fab>
			</Tooltip>
		</TitleBar>
	);
};

export default AlarmsConfigTitleBar;
