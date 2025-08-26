import React from 'react';
import { CompanyEditContainerProps } from './CompanyEditContainer';
import CompanyEditFormContainer from './CompanyEditForm/CompanyEditFormContainer';

interface CompanyEditProps extends CompanyEditContainerProps {}

const CompanyEdit: React.FC<CompanyEditProps> = ({ isNew, company }) => {
	return <CompanyEditFormContainer isNew={isNew} company={company} />;
};

export default CompanyEdit;
