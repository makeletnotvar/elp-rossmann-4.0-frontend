import UserEdit from "modules/user/components/UserTabs/UserEdit/UserEdit";
import * as React from "react";

export interface UserEditContainerProps {
    isNew?: boolean;
}

const UserEditContainer: React.FC<UserEditContainerProps> = ({isNew}) => {
    return (
        <UserEdit isNew={isNew}/>
    );
};

export default UserEditContainer;