import { UserEditContainerProps } from "modules/user/components/UserTabs/UserEdit/UserEditContainer";
import * as React from "react";
import UserEditFormContainer from "./UserEditForm/UserEditFormContainer";

interface UserEditProps extends UserEditContainerProps {}

const UserEdit: React.FC<UserEditProps> = ({isNew}) => {
    return (
        <UserEditFormContainer isNew={isNew}/>
    );
};

export default UserEdit;