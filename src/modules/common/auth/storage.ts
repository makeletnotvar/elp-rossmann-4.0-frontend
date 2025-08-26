
const USER_SESSION_STORAGE_ATTRIBUTE = '_us3r';

const storage = localStorage;

export const setSessionStorageUser = (username: string) => {
    storage.setItem(USER_SESSION_STORAGE_ATTRIBUTE, username);
};

export const getSessionStorageUser = (): string | null => {
    return storage.getItem(USER_SESSION_STORAGE_ATTRIBUTE);
};

export const clearSessionStorageUser = (withLoginPageRedirect: boolean = false) => {
    storage.removeItem(USER_SESSION_STORAGE_ATTRIBUTE);
    if (withLoginPageRedirect) {
        setTimeout(() => window.location.href = "/login", 100);
    }
}