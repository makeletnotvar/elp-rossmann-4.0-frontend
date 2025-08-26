import { ADMIN, DEV, USER } from "constants/user";

const useUserForm = (editingUserType: UserType, loggedUserType: UserType, isCreatingForm: boolean, self: boolean) => {
    /**
     * User @type is enabled only if user is DEV, but not editing self account.
     * User type could be set only by DEV.
     * ADMIN users always could create new USER accounts only.
     */
    const typeFieldDisabled = loggedUserType !== DEV || self;

    /**
     * E-mail could be update only in create user form when new user is creating (not on update)
     */
    const mailFieldDisabled = !isCreatingForm;

    /**
     * User @active could be updated from ADMIN or dev USERS, but not for self account.
     */
    const activeFieldVisible = !self && ((loggedUserType === DEV ) || (loggedUserType === ADMIN && editingUserType !== DEV));
        

    /**
     * User @userBuildingAll param is visible for any editing USER by DEV or ADMIN account
     */
    const userBuildingAllFieldVisible = (loggedUserType === DEV || loggedUserType === ADMIN) && editingUserType === USER;


    /**
     * Delete button is visible when:
     * - account is updating, not creating
     * - logged user is DEV, but not for self account
     * - logged user is ADMIN, editing user is ADMIN/USER, but not for self account
     */
    const deleteButtonVisible =
        !isCreatingForm
        && !self
        && (((loggedUserType === DEV) || (loggedUserType === ADMIN)) && editingUserType !== DEV);

    /**
     * Return 
     */
    return {
        typeFieldDisabled,
        mailFieldDisabled,
        activeFieldVisible,
        userBuildingAllFieldVisible,
        deleteButtonVisible
    };
}

export default useUserForm;