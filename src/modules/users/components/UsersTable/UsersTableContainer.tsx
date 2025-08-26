import UsersTable from 'modules/users/components/UsersTable/UsersTable';
import * as React from 'react';

interface UsersTableContainerProps {
	users: User[];
	query: string;
	fetching: boolean;
}

const UsersTableContainer: React.FC<UsersTableContainerProps> = ({ users, query, fetching }) => {
	return <UsersTable users={users} query={query} fetching={fetching} />;
};

export default UsersTableContainer;
