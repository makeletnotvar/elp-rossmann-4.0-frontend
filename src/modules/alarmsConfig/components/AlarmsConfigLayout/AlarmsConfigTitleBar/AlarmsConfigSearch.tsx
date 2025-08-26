import { IconButton, InputBase, Paper } from '@mui/material';
import { ClearOutlined, SearchOutlined } from '@mui/icons-material';
import { UI } from 'config/ui';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AlarmsConfigTitleBar.module.scss';

interface AlarmsConfigSearchProps {
	query: string;
	queryParam: string;
	onSearch: () => void;
	onReset: () => void;
	onChange: (nextQuery: string) => void;
}

const AlarmsConfigSearch: React.FC<AlarmsConfigSearchProps> = ({ query, queryParam, onChange, onSearch, onReset }) => {
	const { t } = useTranslation();

	const keyUpHandler = (evt: React.KeyboardEvent<any>) => {
		const ENTER = 13;
		evt.keyCode === ENTER && onSearch();
	};

	return (
		<Paper className={styles.search} elevation={0}>
			<InputBase
				data-testid='alarm-search'
				value={query.slice(0, 32)}
				onChange={evt => onChange(evt.target.value)}
				className={styles.input}
				placeholder={t('general.search')}
				inputProps={{ 'aria-label': t('general.search') }}
				onKeyUp={keyUpHandler}
			/>
			<div className={styles.searchButtonsContainer}>
				{query && (
					<IconButton data-testid='alarm-search-button' className={styles.iconButton} aria-label='Search' onClick={onSearch} size='small'>
						<SearchOutlined />
					</IconButton>
				)}
				{queryParam && (
					<IconButton className={styles.iconButton} aria-label='Search' disabled={query.length < UI.SEARCH.QUERY_MIN_LENGTH} onClick={onReset} size='small'>
						<ClearOutlined />
					</IconButton>
				)}
			</div>
		</Paper>
	);
};

export default AlarmsConfigSearch;
