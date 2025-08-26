import { ADMIN, DEV, USER } from "constants/user";

export const isUser = (userType: UserType): boolean => {
    return userType === USER;
}

export const isAdmin = (userType: UserType): boolean => {
    return userType === ADMIN;
}

export const isDev = (userType: UserType) => {
    return userType === DEV;
}

export const isAdminOrDev = (userType: UserType): boolean => {
    return isAdmin(userType) || isDev(userType);
}

type CompareUsersUserType = User | UserAuth | undefined | null;

export const compareUsers = (userA: CompareUsersUserType, userB: CompareUsersUserType): boolean => {
    return Boolean(userA && userB && (userA.username === userB.username));
}