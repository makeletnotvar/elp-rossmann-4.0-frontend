import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { INSTALLATION_COMPANY_NEW } from '../constants/company';
import { companyActions, useCompanyState } from '../redux/company';

export const useCompany = (companyUUID?: string, isNew?: boolean) => {
	const { company, fetched } = useCompanyState();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!isNew) {
			const isAlreadyFetched = company && company.uuid === companyUUID;
			const isBuildingCreateAction = companyUUID === 'add' || companyUUID === INSTALLATION_COMPANY_NEW;
			const isFetchingDisabled = companyUUID === null;

			if (isAlreadyFetched || isBuildingCreateAction || isFetchingDisabled) {
				//
			} else {
				if (companyUUID) {
					dispatch(companyActions.getSingle.request(companyUUID));
				}
			}
		}
	}, [companyUUID, isNew]);

	return {
		company,
		fetched,
	};
};
