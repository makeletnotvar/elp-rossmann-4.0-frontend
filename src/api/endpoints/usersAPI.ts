import { createUrl } from 'api/helpers';
import queryString from 'query-string';

const usersAPI = {
	getUsers: () => createUrl(`/users`),
	getUser: (uuid: string) => createUrl(`/users/${uuid}`),
	createUser: () => createUrl(`/users/`),
	updateUser: (uuid: string) => createUrl(`/users/${uuid}`),
	removeUser: (uuid: string) => createUrl(`/users/${uuid}`),
	updatePassword: (uuid: string) => createUrl(`/users/${uuid}/password`),
	updateOwnPassword: () => createUrl(`/user/password`),
	getAuditEvents: (auditSettings: AuditRequestSettings) => createUrl(`/users-audits?${queryString.stringify(auditSettings)}`),
	postAuditVHMISetpoint: () => createUrl(`/users-audits/vhmi-setpoint`),
	getUserBuildings: (userUUID: string) => createUrl(`/users/${userUUID}/buildings`),
	addUserBuilding: (userUUID: string) => createUrl(`/users/${userUUID}/buildings`),
	removeUserBuilding: (userUUID: string, buildingUUID: string) => createUrl(`/users/${userUUID}/buildings/${buildingUUID}`),
	sendUserMailMessageTest: (mailAddress: string) => createUrl(`/users/email-test-message/${mailAddress}`),
	getUsersList: (q: string) => createUrl(`/users/list?${queryString.stringify({ q })}`),
};

export default usersAPI;
