import { ADMIN, DEV, USER } from "constants/user";
import { useAuth } from "modules/common/selectors/auth";

/**
 * 
 * 
 * 
 * 
 * @param loggedUser - current logged
 * @param targetUser - current editing user
 */
const useUserAuth = (loggedUser: UserType | null, targetUser: UserType) => {
    const { user } = useAuth();
    const userType: UserType = (loggedUser || (user ? user.type : USER)) as UserType;
    let authorized = false;

    if (user && user.type) {
        if (user.type === DEV) {
            authorized = true;
        } else if (user.type === ADMIN) {
            authorized = targetUser !== DEV;
        }
    }

    return authorized;
}

export default useUserAuth;