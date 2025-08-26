import React from 'react';
import CompanyEdit from './CompanyEdit';

export interface CompanyEditContainerProps {
	company: Company;
	isNew?: boolean;
}

const CompanyEditContainer: React.FC<CompanyEditContainerProps> = ({ isNew, company }) => {
	return <CompanyEdit company={company} isNew={isNew} />;
};

export default CompanyEditContainer;
