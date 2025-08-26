import React from 'react';
import CompaniesMenu from './CompaniesMenu';

const CompaniesMenuContainer: React.FC<{ isNew: boolean }> = ({ isNew }) => {
	return <CompaniesMenu isNew={isNew} />;
};

export default CompaniesMenuContainer;
