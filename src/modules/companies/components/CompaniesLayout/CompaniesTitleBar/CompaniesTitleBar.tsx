import { AddOutlined, ClearOutlined, SearchOutlined } from '@mui/icons-material';
import { Fab, IconButton, InputBase, Paper, Tooltip } from '@mui/material';
import { UI } from 'config/ui';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import EngineerIcon from 'modules/common/icons/EngineerIcon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CompaniesTitleBar.module.scss';

interface CompaniesTitleBarProps {
	onSearch: (q: string) => void;
	onResetSearch: () => void;
	onAdd: () => void;
	query: string;
}

const CompaniesTitleBar: React.FC<CompaniesTitleBarProps> = ({ query, onSearch, onResetSearch, onAdd }) => {
	const [q, setQ] = useState(query || '');

	const { t } = useTranslation();

	const keyUpHandler = (evt: React.KeyboardEvent<any>) => {
		const ENTER = 13;
		evt.keyCode === ENTER && searchHandler();
	};

	const searchHandler = () => {
		q.length > UI.SEARCH.QUERY_MIN_LENGTH && onSearch(q);
	};

	return (
		<div>
			<TitleBar label={t('companies.companies_list')} icon={EngineerIcon}>
				<>
					<Paper className={styles.search}>
						<InputBase
							data-testid='company-search'
							value={q.slice(0, 32)}
							onChange={evt => setQ(evt.target.value)}
							className={styles.input}
							placeholder={t('general.search')}
							inputProps={{ 'aria-label': t('general.search') }}
							onKeyUp={keyUpHandler}
						/>
						<div className={styles.searchButtonsContainer}>
							{q && (
								<IconButton data-testid='company-search-button' className={styles.iconButton} aria-label='Search' onClick={searchHandler} size='small'>
									<SearchOutlined />
								</IconButton>
							)}
							{query && (
								<IconButton
									className={styles.iconButton}
									aria-label='Search'
									onClick={() => {
										onResetSearch();
										setQ('');
									}}
									size='small'
								>
									<ClearOutlined />
								</IconButton>
							)}
						</div>
					</Paper>
					<div style={{ display: 'flex', gap: '10px' }}>
						<Tooltip title={t('companies.messages.add_new_company')}>
							<Fab data-testid='add-company-button' color='primary' onClick={onAdd} size='small' className={styles.addButton}>
								<AddOutlined />
							</Fab>
						</Tooltip>
					</div>
				</>
			</TitleBar>
		</div>
	);
};

export default CompaniesTitleBar;
