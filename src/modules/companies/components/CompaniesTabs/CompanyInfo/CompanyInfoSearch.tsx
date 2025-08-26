import { ClearOutlined } from '@mui/icons-material';
import { IconButton, InputBase } from '@mui/material';
import { UI } from 'config/ui';
import { debounce } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CompanyInfo.module.scss';

interface CompanyInfoSearchProps {
	query: string;
	onChange: (nextQuery: string) => void;
	onSearch: () => void;
	onReset: () => void;
}

const CompanyInfoSearch: React.FC<CompanyInfoSearchProps> = ({ query, onChange, onSearch, onReset }) => {
	const { t } = useTranslation();

	const debouncedSearch = useCallback(
		debounce(() => {
			onSearch();
		}, 1000),
		[onSearch]
	);

	useEffect(() => {
		debouncedSearch();
		return debouncedSearch.cancel;
	}, [query, debouncedSearch]);

	return (
		<div className={styles.search}>
			<InputBase
				value={query.slice(0, 32)}
				onChange={evt => onChange(evt.target.value)}
				className={styles.input}
				placeholder={t('general.search')}
				inputProps={{ 'aria-label': t('general.search') }}
			/>
			<div className={styles.searchButtonsContainer}>
				<IconButton className={styles.iconButton} aria-label='Reset' disabled={query.length < UI.SEARCH.QUERY_MIN_LENGTH} onClick={onReset} size='small'>
					<ClearOutlined />
				</IconButton>
			</div>
		</div>
	);
};

export default CompanyInfoSearch;
