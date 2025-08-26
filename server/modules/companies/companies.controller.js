const apiCatcher = require('../../errors/apiCatcher');
const { companiesService } = require('./companies.service');

class CompaniesController {
	async addCompany(req, res) {
		try {
			const company = await companiesService.addCompany(req.body.company);
			res.status(200).json(company);
		} catch (err) {
			apiCatcher(err, res);
		}
	}

	async getCompanies(req, res) {
		try {
			const companies = await companiesService.getCompanies(req.query);
			res.status(200).json(companies);
		} catch (err) {
			apiCatcher(err, res);
		}
	}

	async getCompany(req, res) {
		try {
			const company = await companiesService.getCompany(req.params.uuid);
			res.status(200).json(company);
		} catch (err) {
			apiCatcher(err, res);
		}
	}

	async getCompanyDetails(req, res) {
		try {
			const companyDetails = await companiesService.getCompanyDetails(req.params.uuid);
			res.status(200).json(companyDetails);
		} catch (err) {
			apiCatcher(err, res);
		}
	}

	async getCompaniesList(req, res) {
		try {
			const companiesList = await companiesService.getCompaniesList();
			res.status(200).json(companiesList);
		} catch (err) {
			apiCatcher(err, res);
		}
	}

	async updateCompany(req, res) {
		try {
			const company = await companiesService.updateCompany(req.params.uuid, req.body.company);
			res.status(200).json(company);
		} catch (err) {
			apiCatcher(err, res);
		}
	}

	async deleteCompany(req, res) {
		try {
			const company = await companiesService.deleteCompany(req.params.uuid);
			res.status(200).json(company);
		} catch (err) {
			apiCatcher(err, res);
		}
	}
}

module.exports = {
	companiesController: new CompaniesController(),
};
