const { fakeUUID } = require('../../fakeData');

let _companies = [
	{
		uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebn',
		name: 'FI - Wrocław',
	},
	{
		uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebb',
		name: 'FS - Wrocław',
	},
];

class CompaniesService {
	sort = (param, dir) => (a, b) => {
		return a[param] > b[param] ? (dir === 'desc' ? -1 : 1) : b[param] > a[param] ? (dir === 'desc' ? 1 : -1) : 0;
	};

	async generateTempCompanies(settings) {
		const { dir: d, q, p } = settings;
		const offset = Number(settings.o);
		const rowsPerPage = Number(settings.s);

		let data = {
			companies: _companies,
			countAll: _companies.length,
			count: _companies.length,
		};

		if (q && q.length > 2) {
			data.companies = data.companies.filter(company => `${company.name}`.toLowerCase().includes(q.toLowerCase()));
		}

		data.companies = data.companies.sort(this.sort(p, d));
		data.count = data.companies.length;
		data.companies = data.companies.slice(offset * rowsPerPage, (offset + 1) * rowsPerPage);

		return data;
	}

	async addCompany(body) {
		_companies.push({
			...body,
			uuid: fakeUUID(),
		});

		const data = {
			company: _companies[_companies.length - 1],
		};
		return data;
	}

	async getCompanies(settings) {
		const companies = this.generateTempCompanies(settings);
		return companies;
	}

	async getCompany(uuid) {
		const data = {
			company: _companies.find(company => company.uuid === uuid),
		};
		return data;
	}

	async getCompanyDetails(uuid) {
		const data = {
			companyDetails: {
				users: [{ uuid: 'xxxx-user-abcd-efgh-0dev', name: 'dev@el-piast.com' }],
				buildingsAsInstallation: [{ uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd', name: 'B - Wrocław' }],
				buildingsAsService: [{ uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd', name: 'B - Wrocław' }],
			},
		};
		return data;
	}

	async getCompanyDetails(uuid) {
		const data = {
			companyDetails: {
				users: [{ uuid: 'xxxx-user-abcd-efgh-0dev', name: 'dev@el-piast.com' }],
				buildingsAsInstallation: [{ uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd', name: 'B - Wrocław' }],
				buildingsAsService: [{ uuid: '6ca727c5-48e8-47cc-8665-1e9fc2df3ebd', name: 'B - Wrocław' }],
			},
		};
		return data;
	}

	async getCompaniesList() {
		const data = {
			companies: _companies,
		};
		return data;
	}

	async updateCompany(uuid, body) {
		const data = {
			company: { ..._companies[0], body },
		};
		_companies = [{ ..._companies[0], body }];
		return data;
	}

	async deleteCompany(uuid) {
		const data = {
			company: _companies[0],
		};
		_companies = [];
		return data;
	}
}

module.exports = {
	companiesService: new CompaniesService(),
};
