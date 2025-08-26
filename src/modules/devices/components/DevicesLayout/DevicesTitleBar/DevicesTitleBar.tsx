import { AddOutlined, ClearOutlined, DevicesOutlined, SearchOutlined } from '@mui/icons-material';
import { Fab, IconButton, InputBase, Paper, Tooltip } from '@mui/material';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DevicesTitleBar.module.scss';

interface DevicesTitleBarProps {
	onSearch: (q: string) => void;
	onResetSearch: () => void;
	onAdd: () => void;
	query: string;
}

const DevicesTitleBar: React.FC<DevicesTitleBarProps> = ({ query, onSearch, onResetSearch, onAdd }) => {
	const [q, setQ] = useState(query || '');
	const { t } = useTranslation();

	const keyUpHandler = (evt: React.KeyboardEvent<any>) => {
		const ENTER = 13;
		evt.keyCode === ENTER && searchHandler();
	};

	const searchHandler = () => {
		q.length >= 1 && onSearch(q);
	};

	return (
		<div>
			<TitleBar label={t('devices.devices_list')} icon={DevicesOutlined}>
				<>
					<Paper className={styles.search}>
						<InputBase
							value={q.slice(0, 32)}
							onChange={evt => setQ(evt.target.value)}
							className={styles.input}
							placeholder={t('general.search')}
							inputProps={{ 'aria-label': t('general.search') }}
							onKeyUp={keyUpHandler}
						/>
						<div className={styles.searchButtonsContainer}>
							{q && (
								<IconButton className={styles.iconButton} aria-label='Search' onClick={searchHandler} size='small'>
									<SearchOutlined />
								</IconButton>
							)}
							{query && (
								<IconButton
									className={styles.iconButton}
									aria-label='Search'
									onClick={() => {
										setQ('');
										onResetSearch();
									}}
									size='small'
								>
									<ClearOutlined />
								</IconButton>
							)}
						</div>
					</Paper>
					<div style={{ display: 'flex', gap: '10px' }}>
						<Tooltip title={t('devices.messages.add_new_device')}>
							<Fab data-testid='devices-add-button' className={styles.addButton} aria-label='Add' onClick={onAdd} size='small' color='primary'>
								<AddOutlined />
							</Fab>
						</Tooltip>
					</div>
				</>
			</TitleBar>
		</div>
	);
};

export default DevicesTitleBar;
