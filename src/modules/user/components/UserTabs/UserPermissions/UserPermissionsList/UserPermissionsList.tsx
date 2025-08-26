import { DeleteOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import SuperTable, { SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import styles from './UserPermissionsList.module.scss';

interface UserPermissionsListProps {
	permissions: UserBuildingPermission[];
	onRemove: (uuid: string) => void;
}

interface UserPermissionsListActions extends Pick<UserPermissionsListProps, 'onRemove'> {}

export const permissionTypeStrings: any = {
	0: 'Brak',
	1: 'Odczyt',
	2: 'Zapis/Odczyt',
};

const createPermissionsTableColumnsConfig = ({ onRemove }: UserPermissionsListActions): SuperTableDataColumns => ({
	name: {
		label: 'Nazwa',
		disabledSorting: true,
	},
	permissions: {
		label: 'Uprawnienia',
		tdClassName: styles.permissions,
		disabledSorting: true,
		custom: ({ value }) => <>{permissionTypeStrings[value]}</>,
	},
	uuid: {
		label: 'Akcje',
		disabledSorting: true,
		tdClassName: styles.actions,
		thClassName: styles.actions,
		align: 'right',
		custom: ({ value }) => (
			<>
				<Tooltip title='Usuń uprawnienia do budynku'>
					<IconButton color='default' size='small' onClick={() => onRemove(value)}>
						<DeleteOutlined fontSize='inherit' />
					</IconButton>
				</Tooltip>
			</>
		),
	},
});

const UserPermissionsList: React.FC<UserPermissionsListProps> = ({ permissions, onRemove }) => {
	return (
		<div>
			<SuperTable className={styles.table} data={permissions} columns={createPermissionsTableColumnsConfig({ onRemove })} hidePagination={true} />
		</div>
	);
};

export default UserPermissionsList;
