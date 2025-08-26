import { compareUsers } from "helpers/users";
import { useAuth } from "modules/common/selectors/auth";
import { usePasswordUpdate } from "modules/user/hooks/usePasswordUpdate";
import { useUserState } from "modules/user/redux/user";
import * as React from "react";
import UserPasswordForm from "./UserPasswordForm";

const UserPasswordFormContainer: React.FC = () => {
    const { user: loggedUser } = useAuth();
    const { user } = useUserState();
    const isChangingMyself = compareUsers(user, loggedUser);
    const {errorMessage, status, updatePassword} = usePasswordUpdate(isChangingMyself);


    const handleSubmit = (passwords: UserPasswordChangeProps) => {
        if(user){
            return updatePassword(passwords, user.uuid);
        }
    }

    return (
        <>
            {
                loggedUser && user
                    ? <UserPasswordForm
                        userLabel={user.label || user.username}
                        userType={loggedUser.type!}
                        isChangingMyself={isChangingMyself}
                        onSubmit={handleSubmit}
                        status={status}
                        errorMessage={errorMessage}
                    />
                    : null
            }
        </>
    );
};

export default UserPasswordFormContainer;