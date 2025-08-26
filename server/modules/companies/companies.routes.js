const { companiesController } = require('./companies.controller');

module.exports = {
	useCompanies: router => {
		router.post('/companies', companiesController.addCompany);
		router.get('/companies', companiesController.getCompanies);
		router.get('/companies/list', companiesController.getCompaniesList);
		router.get('/companies/:uuid', companiesController.getCompany);
		router.get('/companies/:uuid/details', companiesController.getCompanyDetails);
		router.put('/companies/:uuid', companiesController.updateCompany);
		router.delete('/companies/:uuid', companiesController.deleteCompany);
	},
};
