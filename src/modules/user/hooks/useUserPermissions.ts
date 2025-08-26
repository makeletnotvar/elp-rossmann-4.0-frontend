import { API } from 'api/axios';
import usersAPI from 'api/endpoints/usersAPI';
import { useCallback, useEffect, useState } from 'react';

type UserBuildingsResponse = {
	userBuildings: {
		uuid: string; // uuid budynku
		name: string; // nazwa budynku
		permissions: number; // rodzaj dostępu (określone w opisie na górze)
	}[];
};

const useUserPermissionsAdd = (userUUID: string, callback: any) => {
	return useCallback(
		(userPermissionsFormProps: UserBuildingPermissionFormProps) => {
			const request = async () => {
				try {
					const response = await API.post<UserBuildingPermission>(usersAPI.addUserBuilding(userUUID), userPermissionsFormProps);
					const { name, uuid, permissions } = response.data;
					callback({ name, uuid, permissions });
				} catch (err: any) {
					//
				}
			};
			request();
		},
		[userUUID, callback]
	);
};

const useUserPermissionsRemove = (userUUID: string, callback: any) => {
	return useCallback(
		(buildingUUID: string) => {
			const request = async () => {
				try {
					const response = await API.delete(usersAPI.removeUserBuilding(userUUID, buildingUUID));
					callback(buildingUUID);
				} catch (err: any) {
					//
				}
			};
			request();
		},
		[userUUID, callback]
	);
};

export default (userUUID: string) => {
	const [permissions, setPermissions] = useState<UserBuildingPermission[]>([]);
	const [error, setError] = useState<string>('');
	const onAdd = useUserPermissionsAdd(userUUID, (nextBuildingPermission: UserBuildingPermission) => {
		setPermissions([...permissions, nextBuildingPermission]);
	});
	const onRemove = useUserPermissionsRemove(userUUID, (_buildingUUID: string) => {
		setPermissions(permissions.filter(({ uuid }) => _buildingUUID !== uuid));
	});

	useEffect(() => {
		const request = async () => {
			try {
				const response = await API.get<UserBuildingsResponse>(usersAPI.getUserBuildings(userUUID));
				if (response && response.data && response.data.userBuildings) {
					setPermissions(response.data.userBuildings);
				}
			} catch (err: any) {
				setError(String(err));
			}
		};
		request();
	}, [userUUID]);

	return {
		permissions,
		error,
		onAdd,
		onRemove,
	};
};
