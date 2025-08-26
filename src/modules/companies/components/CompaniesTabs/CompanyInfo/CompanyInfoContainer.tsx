import React from 'react';
import CompanyInfo from './CompanyInfo';

interface CompanyInfoContainerProps {
	company: CompanyWithDetails;
}

const CompanyInfoContainer: React.FC<CompanyInfoContainerProps> = ({ company }) => {
	return <CompanyInfo company={company} />;
};

export default CompanyInfoContainer;
