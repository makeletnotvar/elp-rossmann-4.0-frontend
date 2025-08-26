import UserPassword from "modules/user/components/UserTabs/UserPassword/UserPassword";
import { UserRouteProps } from "modules/user/types/types";
import * as React from "react";
import useRouter from "use-react-router";

const UserPasswordContainer: React.FC = () => {
    const {match: {params: {userUUID}}} = useRouter<UserRouteProps>();

    return (
        <UserPassword />
    );
};

export default UserPasswordContainer;