import { AddOutlined, ClearOutlined, PeopleOutlined, SearchOutlined } from '@mui/icons-material';
import { Fab, IconButton, InputBase, Paper } from '@mui/material';
import { UI } from 'config/ui';
import { AuthDevOrAdmin, AuthUser } from 'modules/common/components/Auth/Auth';
import Content from 'modules/common/components/Layout/Content/Content';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import { useAuth } from 'modules/common/selectors/auth';
import UsersTableContainer from 'modules/users/components/UsersTable/UsersTableContainer';
import { useUsers } from 'modules/users/redux/users';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import useRouter from 'use-react-router';
import styles from './UsersLayout.module.scss';

interface UsersLayoutProps {}

const UsersLayout: React.FC<UsersLayoutProps> = () => {
	const [query, setQuery] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<User[]>([]);

	const { t } = useTranslation();
	const { history } = useRouter();
	const { user } = useAuth();

	const { users, fetching, fetched } = useUsers();

	const addHandler = useCallback(() => {
		history.push('/user/add/new');
	}, []);

	const onSearch = (query: string): void => {
		const filteredResults = users.filter(user => `${user.username}`.toLowerCase().includes(query.toLowerCase()));
		setQuery(query);
		setSearchResults(filteredResults);
	};

	const onReset = (): void => {
		onSearch('');
		setSearchQuery('');
		setSearchResults([]);
	};

	const searchHandler = () => {
		searchQuery.length >= UI.SEARCH.QUERY_MIN_LENGTH ? onSearch(searchQuery) : onReset();
	};

	const keyUpHandler = (evt: React.KeyboardEvent<any>) => {
		const ENTER = 13;
		evt.keyCode === ENTER && searchHandler();
	};

	return (
		<>
			<AuthUser>{user && user.uuid && <Redirect from='/users' to={`/user/${user.uuid}/info`} />}</AuthUser>
			<div className={styles.container}>
				<TitleBar label={t('users.users_list')} icon={PeopleOutlined}>
					<Paper className={styles.search} elevation={0}>
						<InputBase
							data-testid='user-search'
							value={searchQuery.slice(0, 32)}
							onChange={evt => setSearchQuery(evt.target.value)}
							className={styles.input}
							placeholder={t('general.search')}
							inputProps={{ 'aria-label': t('general.search') }}
							onKeyUp={keyUpHandler}
						/>
						<div className={styles.searchButtonsContainer}>
							{searchQuery && (
								<IconButton data-testid='user-search-button' className={styles.iconButton} aria-label='Search' onClick={searchHandler} size='small'>
									<SearchOutlined />
								</IconButton>
							)}
							{query && (
								<IconButton
									className={styles.iconButton}
									aria-label='Search'
									disabled={query.length < UI.SEARCH.QUERY_MIN_LENGTH}
									onClick={onReset}
									size='small'
								>
									<ClearOutlined />
								</IconButton>
							)}
						</div>
					</Paper>
					<UsersTitleDetailsContent onAdd={addHandler} />
				</TitleBar>
				<Content>
					<UsersTableContainer users={searchResults.length > 0 ? searchResults : query.length > 0 ? [] : users} query={query} fetching={fetching} />
				</Content>
			</div>
		</>
	);
};

const UsersTitleDetailsContent: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
	return (
		<div style={{ display: 'flex', gap: '10px' }}>
			<AuthDevOrAdmin>
				<Fab data-testid='add-user-button' color='primary' onClick={onAdd} size='small' className={styles.addButton}>
					<AddOutlined />
				</Fab>
			</AuthDevOrAdmin>
		</div>
	);
};

export default UsersLayout;
