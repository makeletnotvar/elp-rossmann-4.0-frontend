import { ExpandLessOutlined, ExpandMoreOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import cn from 'classnames';
import { sortBy } from 'lodash';
import DateCell from 'modules/common/components/Tables/DateCell';
import { useAuth } from 'modules/common/selectors/auth';
import UserTableActivityCell from 'modules/users/components/UsersTable/UserTableActivityCell';
import UserTableUserTypeCell from 'modules/users/components/UsersTable/UserTableUserTypeCell';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import useRouter from 'use-react-router';
import styles from './UsersTable.module.scss';

interface UsersTableProps {
	users: User[];
	query: string;
	fetching: boolean;
}

interface Column<T> {
	label: string;
	key: keyof T | 'actions';
	custom?: (row: T, user: any, onClick: any) => React.ReactNode;
	sortable?: boolean;
	align?: 'center' | 'right';
}

const columns: Column<User>[] = [
	{
		key: 'type',
		label: 'users.type',
		custom: row => <UserTableUserTypeCell value={row.type} row={row} />,
		sortable: true,
		align: 'center',
	},
	{ key: 'label', label: 'users.label', custom: row => <Link to={`/user/${row.uuid}/info`}>{row?.label}</Link> },
	{ key: 'active', label: 'users.activity', custom: row => <UserTableActivityCell value={row.active} />, sortable: true },
	{
		key: 'company',
		label: 'project.company',
		custom: (row, user) =>
			row?.company?.uuid && user?.type === 'DEV' ? <Link to={`/companies/${row.company.uuid}/info`}>{row.company.name}</Link> : row?.company?.name || '',
	},
	{ key: 'lastLoginTs', label: 'users.lastLogin', custom: row => <DateCell value={row.lastLoginTs} /> },
	{ key: 'addTs', label: 'users.addTime', custom: row => <DateCell value={row.addTs} />, sortable: true },
	{ key: 'editTs', label: 'users.editTime', custom: row => <DateCell value={row.editTs} />, sortable: true },
	{
		key: 'actions',
		label: 'Akcje',
		custom: (row, user, onClick) => (
			<IconButton data-testid={`user-more-button-${row.uuid}`} size='small' onClick={() => onClick(row.uuid)}>
				<MoreHorizOutlined fontSize='inherit' />
			</IconButton>
		),
		align: 'right',
	},
];

const useSortedUsers = (users: User[]) => {
	const [dir, setDir] = React.useState<'asc' | 'desc'>('asc');
	const [param, setParam] = React.useState<keyof User>('username');

	const updateHandler = (nextSettings: Partial<any>) => {
		setDir(nextSettings.sortingDir || dir);
		setParam((nextSettings.sortingParam as keyof User) || param);
	};

	const sortedUsers = React.useMemo(() => {
		return dir === 'desc' ? sortBy(users, param).reverse() : sortBy(users, param);
	}, [users, dir, param]);

	return { dir, param, updateHandler, sortedUsers };
};

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
	const { t } = useTranslation();
	const { user } = useAuth();
	const { history } = useRouter();
	const { dir, param, updateHandler, sortedUsers } = useSortedUsers(users);
	const [listHeight, setListHeight] = React.useState(window.innerHeight - 142);

	React.useEffect(() => {
		const updateHeight = () => setListHeight(window.innerHeight - 142);
		window.addEventListener('resize', updateHeight);
		return () => window.removeEventListener('resize', updateHeight);
	}, []);

	const handleSort = (key: keyof User) => {
		updateHandler({ sortingDir: param === key && dir === 'asc' ? 'desc' : 'asc', sortingParam: key });
	};

	const clickHandler = (uuid: string) => {
		history.push(`/user/${uuid}/info`);
	};

	return (
		<div className={cn(styles.containerTable, { [styles.isQuery]: (sortedUsers || []).length === 0 })}>
			<div className={`${styles.header} ${styles.headerRow}`}>
				{columns.map(column => (
					<div
						key={column.key as string}
						className={cn(styles.cell, {
							[styles.sortable]: column.sortable,
							[styles.center]: column.align === 'center',
							[styles.right]: column.align === 'right',
							[styles.nameCell]: column.key === 'label' || column.key === 'company',
							[styles.typeCell]: column.key === 'type',
						})}
						onClick={() => column.sortable && handleSort(column.key as keyof User)}
					>
						{t(column.label)}
						{column.sortable && param === column.key && (dir === 'asc' ? <ExpandLessOutlined /> : <ExpandMoreOutlined />)}
					</div>
				))}
			</div>
			<List height={listHeight} itemCount={sortedUsers.length} itemSize={35} width={'100%'}>
				{({ index, style }) => (
					<div className={styles.row} style={{ ...style, width: 'fit-content', minWidth: '100%' }}>
						{columns.map(column => (
							<div
								key={column.key as string}
								className={cn(styles.cell, {
									[styles.sortable]: column.sortable,
									[styles.center]: column.align === 'center',
									[styles.right]: column.align === 'right',
									[styles.nameCell]: column.key === 'label' || column.key === 'company',
									[styles.typeCell]: column.key === 'type',
									[styles.textEllipsis]: column.key === 'label' || column.key === 'company',
								})}
							>
								{column.custom ? column.custom(sortedUsers[index], user, clickHandler) : sortedUsers[index][column.key as keyof User]}
							</div>
						))}
					</div>
				)}
			</List>
		</div>
	);
};

export default UsersTable;
