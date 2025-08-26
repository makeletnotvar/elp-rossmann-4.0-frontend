import { useDispatch } from 'modules/common/helpers/redux/useActions';
import useAsyncCallback from 'modules/common/hooks/useAsyncCallback';
import { UINotificationsActions } from 'modules/common/redux/uiNotifications';
import { useAuth, useUserType } from 'modules/common/selectors/auth';
import initialUser from 'modules/user/constants/initialUser';
import { useUserState } from 'modules/user/redux/user';
import { usersActions } from 'modules/users/redux/users';
import * as React from 'react';
import useRouter from 'use-react-router';
import UserEditForm from './UserEditForm';
// import "./UserEditFormContianer.scss";

interface UserEditFormContainerProps {
	isNew?: boolean;
}

const UserEditFormContainer: React.FC<UserEditFormContainerProps> = ({ isNew }) => {
	const { user } = useUserState();
	const { user: loggedUser } = useAuth();
	const userType = useUserType();
	const isMyself = Boolean(user && loggedUser && user.username === loggedUser.username);
	const dispatch = useDispatch();
	const { history } = useRouter();

	const editingUser: UserEditableProps | null = isNew
		? initialUser
		: user
		? ({
				uuid: user.uuid,
				type: user.type,
				active: user.active,
				mail: user.username,
				label: user.label,
				userBuildingsAll: user.userBuildingsAll,
				emailNotifications: user.emailNotifications,
				emailNotificationsAddress: user.emailNotificationsAddress,
				company: user.company,
		  } as UserEditableProps)
		: null;

	const deleteHandler = useAsyncCallback(async () => {
		if (!isNew && user) {
			let notification = null;
			try {
				await dispatch(usersActions.remove.request(user.uuid));
				notification = { message: 'Użytkownik został usunięty', variant: 'success' };
			} catch (error) {
				notification = { message: 'Wystąpił błąd: ' + error, variant: 'error' };
			} finally {
				dispatch(UINotificationsActions.add(notification));
				history.push('/users/');
			}
		}
	});

	const submitHandler = useAsyncCallback(async (values: UserEditableProps, { setSubmitting }: any) => {
		const finalUser = { ...values };
		let responseUser = null;

		const action = isNew ? usersActions.add.request : usersActions.update.request;

		let notification = {
			message: isNew ? 'Użytkownik został dodany' : 'Użytkownik został zaktualizowany',
			variant: 'success',
		};

		try {
			responseUser = await dispatch(action(finalUser));
			isNew && responseUser && history.push(`/users/${responseUser.uuid}/info`);
		} catch (error) {
			notification = { message: 'Wystąpił błąd: ' + error, variant: 'error' };
		} finally {
			dispatch(UINotificationsActions.add(notification));
			setSubmitting(false);

			// Redirect after success
			if (isNew && responseUser) {
				history.push(`/user/${responseUser.uuid}/info`);
			}
		}
	});

	return (
		<>
			{editingUser ? (
				<UserEditForm user={editingUser} onSubmit={submitHandler} onDelete={deleteHandler} userType={userType} isNew={Boolean(isNew)} isMyself={isMyself} />
			) : (
				'Nie można wyświetlić formularza edycji'
			)}
		</>
	);
};

export default UserEditFormContainer;
