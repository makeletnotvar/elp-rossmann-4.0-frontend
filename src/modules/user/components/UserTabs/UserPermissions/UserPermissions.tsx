import { Typography } from '@mui/material';
import { USER } from 'constants/user';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import { useUserState } from 'modules/user/redux/user';
import * as React from 'react';
import { useState } from 'react';
import UserPermissionsForm from './UserPermissionsForm/UserPermissionsForm';
import UserPermissionsList from './UserPermissionsList/UserPermissionsList';

interface UserPermissionsProps {
	permissions: UserBuildingPermission[];
	onRemove: (buildingUUID: string) => void;
	onAdd: (buildingPermissionsFormProps: UserBuildingPermissionFormProps) => void;
}

const UserPermissions: React.FC<UserPermissionsProps> = ({ permissions, onRemove, onAdd }) => {
	const { user } = useUserState();
	const [isAddFormActive, setAddFormActive] = useState<boolean>(false);
	/**
	 * User permissions module is disabled if editing user:
	 * - is not USER type
	 * - has enabled "userBuildingsAll" option
	 */
	const isDisabled = user && (user.type !== USER || user.userBuildingsAll);
	return (
		<div className='container'>
			{isDisabled ? (
				<Typography variant='subtitle1'>
					Użytkownik ma przydzielone pełne prawa do wszystkich budynków{user?.company?.name ? ` firmy ${user?.company?.name}` : ''}. Aby przydzielić szczegółowe
					uprawnienia do wybranych budynków zmień opcję "Dostęp do wszystkich budynków
					{user?.company?.name ? ` firmy ${user?.company?.name}` : ''}" w zakładce Edycja Budynku. Możesz to zrobić tylko dla użytkownika typu <b>USER</b>.
				</Typography>
			) : (
				<>
					<UserPermissionsList permissions={permissions} onRemove={onRemove} />
					{isAddFormActive ? (
						<UserPermissionsForm
							buildingPermissions={permissions}
							companyUUID={user?.company?.uuid}
							onAdd={(buildingPermissionsFormProps: UserBuildingPermissionFormProps) => {
								onAdd(buildingPermissionsFormProps);
								setAddFormActive(false);
							}}
						/>
					) : (
						<div style={{ display: 'flex', justifyContent: 'flex-end', padding: 8 }}>
							<ConfirmButton testId='add-user-permissions-button' noSubmit color='primary' onClick={() => setAddFormActive(true)}>
								Dodaj uprawnienia
							</ConfirmButton>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default UserPermissions;
