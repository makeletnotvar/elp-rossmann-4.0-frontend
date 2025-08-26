import { createUrl } from 'api/helpers';

const alarmsConfigAPI = {
	getMany: () => createUrl(`/alarms-config`),
	getSingle: (code: string) => createUrl(`/alarms-config/${code}`),
	add: () => createUrl('/alarms-config'),
	update: (code: string) => createUrl(`/alarms-config/${code}`),
	delete: (code: string) => createUrl(`/alarms-config/${code}`),
};

export default alarmsConfigAPI;
