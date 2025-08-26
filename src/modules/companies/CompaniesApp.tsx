// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import CompaniesLayout from './components/CompaniesLayout/CompaniesLayout';
import { getCompaniesModule } from './redux';

const CompaniesApp: React.FC = () => {
	return (
		<DynamicModuleLoader modules={[getCompaniesModule()]}>
			<CompaniesLayout />
		</DynamicModuleLoader>
	);
};

export default CompaniesApp;
