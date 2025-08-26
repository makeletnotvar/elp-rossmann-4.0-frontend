import { createUrl } from "api/helpers";

 const authAPI = {
    login: () => createUrl('/auth/login'),
    verify: () => createUrl('/auth/verify'),
    logout: () => createUrl('/auth/logout'),
    refreshToken: () => createUrl('/auth/token'),   
};

export default authAPI;