import { ClearOutlined, SearchOutlined } from '@mui/icons-material';
import { IconButton, InputBase, Paper } from '@mui/material';
import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventsV2Search.module.scss';

interface EventV2SearchProps {
	query: string;
	onChange: (nextFilters: Partial<SuperTableDisplaySettings>) => void;
	onReset: () => void;
}

const EventV2Search: React.FC<EventV2SearchProps> = ({ query, onChange, onReset }) => {
	const [q, setQ] = useState(query || '');
	const { t } = useTranslation();

	const searchHandler = () => {
		q.length >= 1 && onChange({ query: q });
	};

	const keyUpHandler = (evt: React.KeyboardEvent<any>) => {
		const ENTER = 13;
		evt.keyCode === ENTER && searchHandler();
	};

	return (
		<Paper className={styles.search}>
			<InputBase
				data-testid='building-search'
				value={q.slice(0, 32)}
				onChange={evt => setQ(evt.target.value)}
				className={styles.input}
				placeholder={t('general.search')}
				inputProps={{ 'aria-label': t('general.search') }}
				onKeyUp={keyUpHandler}
			/>
			<div className={styles.searchButtonsContainer}>
				{q && (
					<IconButton data-testid='building-search-button' className={styles.iconButton} aria-label='Search' onClick={searchHandler} size='small'>
						<SearchOutlined />
					</IconButton>
				)}
				{query && (
					<IconButton
						className={styles.iconButton}
						aria-label='Search'
						disabled={query.length < 1}
						onClick={() => {
							setQ('');
							onReset();
						}}
						size='small'
					>
						<ClearOutlined />
					</IconButton>
				)}
			</div>
		</Paper>
	);
};

export default EventV2Search;
