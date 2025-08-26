import { createUrl } from 'api/helpers';
import queryString from 'query-string';

const companiesAPI = {
	getMany: (settings: any) => createUrl(`/companies?${queryString.stringify(settings)}`),
	getSingle: (uuid: string) => createUrl(`/companies/${uuid}`),
	getDetails: (uuid: string) => createUrl(`/companies/${uuid}/details`),
	getCompaniesList: () => createUrl(`/companies/list`),
	update: (uuid: string) => createUrl(`/companies/${uuid}`),
	delete: (uuid: string) => createUrl(`/companies/${uuid}`),
	add: () => createUrl('/companies'),
};

export default companiesAPI;
