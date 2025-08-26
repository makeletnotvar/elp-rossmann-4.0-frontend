import { USER } from "constants/user";

const initialUser: UserEditableProps = {
    uuid: '',
    type: USER,
    active: false,
    mail: '',
    label: '',
    userBuildingsAll: false,
    emailNotifications: [],
    emailNotificationsAddress: '',
    
};

export default initialUser;