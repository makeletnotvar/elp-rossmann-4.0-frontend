import { API } from 'api/axios';
import usersAPI from 'api/endpoints/usersAPI';
import { useRequestStatus } from 'modules/common/hooks/useRequestStatus';
import { useCallback } from 'react';

export const usePasswordUpdate = (isChangingMyself: boolean) => {
	const { status, errorMessage, setFetching, setFailure, reset, setSuccess } = useRequestStatus();
	/**
	 *
	 * If @param uuid is provided, password will update for given user uuid,
	 * in other case new password will apply for current login user
	 *
	 */
	const updatePassword = useCallback((passwords: UserPasswordChangeProps, userUUID?: string) => {
		const shouldLogoutAfterSuccess = isChangingMyself;

		const fetchRequest = async () => {
			reset();
			setFetching();

			let request = isChangingMyself ? usersAPI.updateOwnPassword() : usersAPI.updatePassword(userUUID!);

			const requestBody = {
				new: passwords.newPassword,
				current: passwords.currentPassword,
			};

			try {
				const response = await API.put<any>(request, requestBody);
				if (response.status > 204) {
					throw new Error('Nie można zaktualizować hasła');
				}
				setSuccess();
			} catch (err: any) {
				setFailure(String(err));
			}
		};

		return fetchRequest();
	}, []);

	return {
		updatePassword,
		status,
		errorMessage,
	};
};
