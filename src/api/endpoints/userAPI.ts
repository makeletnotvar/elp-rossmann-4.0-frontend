import { createUrl } from "api/helpers";

export const userAPI = {
    changePassword: () => createUrl(`/user/password`)
}

export default userAPI;