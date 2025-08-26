import { useAuth } from "modules/common/selectors/auth";
import UserPasswordForm from "modules/user/components/UserTabs/UserPassword/UserPasswordForm/UserPasswordForm";
import { usePasswordUpdate } from "modules/user/hooks/usePasswordUpdate";
import * as React from "react";
import { Redirect } from "react-router-dom";
// import "./ExpiredPasswordLayout.scss";

interface UserPasswordFormContainerProps { }

const UserPasswordFormContainer: React.FC<UserPasswordFormContainerProps> = ({ }) => {
    const IS_UPDATE_MYSELF = true;
    const { user } = useAuth();
    const { errorMessage, status, updatePassword } = usePasswordUpdate(IS_UPDATE_MYSELF);

    const handleSubmit = (passwords: UserPasswordChangeProps) => {
        if (user) {
            return updatePassword(passwords, user.uuid);
        }
    }

    if (!user) {
        return null;
    }

    if (!user.passwordExpired) {
        return <Redirect to='/login' />
    }

    return (
        <UserPasswordForm
            userLabel={user.username}
            userType={user.type!}
            isChangingMyself={true}
            onSubmit={handleSubmit}
            status={status}
            errorMessage={errorMessage}
            title='Twoje hasło wygasło, musisz zmienić swoje hasło na nowe'
        />
    );
};

export default UserPasswordFormContainer;