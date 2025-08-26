import { ClearOutlined, SearchOutlined } from '@mui/icons-material';
import { IconButton, InputBase, Paper } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingsTitleBar.module.scss';

interface BuildingsSearchProps {
	query: string;
	queryParam: string;
	onSearch: () => void;
	onReset: () => void;
	onChange: (nextQuery: string) => void;
}

const BuildingsSearch: React.FC<BuildingsSearchProps> = ({ query, queryParam, onChange, onSearch, onReset }) => {
	const { t } = useTranslation();

	const keyUpHandler = (evt: React.KeyboardEvent<any>) => {
		const ENTER = 13;
		evt.keyCode === ENTER && onSearch();
	};

	return (
		<Paper className={styles.search}>
			<InputBase
				data-testid='building-search'
				value={query.slice(0, 32)}
				onChange={evt => onChange(evt.target.value)}
				className={styles.input}
				placeholder={t('general.search')}
				inputProps={{ 'aria-label': t('general.search') }}
				onKeyUp={keyUpHandler}
			/>
			<div className={styles.searchButtonsContainer}>
				{query && (
					<IconButton data-testid='building-search-button' className={styles.iconButton} aria-label='Search' onClick={onSearch} size='small'>
						<SearchOutlined />
					</IconButton>
				)}
				{queryParam && (
					<IconButton className={styles.iconButton} aria-label='Search' disabled={query.length < 1} onClick={onReset} size='small'>
						<ClearOutlined />
					</IconButton>
				)}
			</div>
		</Paper>
	);
};

export default BuildingsSearch;
