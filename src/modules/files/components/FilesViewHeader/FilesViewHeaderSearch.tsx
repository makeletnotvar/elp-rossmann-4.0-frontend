import { ClearOutlined, SearchOutlined } from '@mui/icons-material';
import { IconButton, InputBase, Paper } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FilesViewHeaderSearch.module.scss';

interface FilesViewHeaderSearchProps {
	query: string;
	onChange: (nextQuery: string) => void;
	onSearch: () => void;
	onReset: () => void;
}

const FilesViewHeaderSearch: React.FC<FilesViewHeaderSearchProps> = ({ query, onChange, onSearch, onReset }) => {
	const { t } = useTranslation();

	const keyUpHandler = (evt: React.KeyboardEvent<any>) => {
		const ENTER = 13;
		evt.keyCode === ENTER && onSearch();
	};

	return (
		<Paper className={styles.search} elevation={0}>
			<InputBase
				value={query.slice(0, 32)}
				onChange={evt => onChange(evt.target.value)}
				className={styles.input}
				placeholder={t('general.search')}
				inputProps={{ 'aria-label': t('general.search') }}
				onKeyUp={keyUpHandler}
			/>
			<div className={styles.searchButtonsContainer}>
				<IconButton className={styles.iconButton} aria-label='Search' onClick={onSearch} size='small'>
					<SearchOutlined />
				</IconButton>

				<IconButton className={styles.iconButton} aria-label='Search' onClick={onReset} size='small'>
					<ClearOutlined />
				</IconButton>
			</div>
		</Paper>
	);
};

export default FilesViewHeaderSearch;
