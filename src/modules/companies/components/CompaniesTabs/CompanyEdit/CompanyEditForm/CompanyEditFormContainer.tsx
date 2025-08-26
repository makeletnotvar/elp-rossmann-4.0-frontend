import { useDispatch } from 'modules/common/helpers/redux/useActions';
import useAsyncCallback from 'modules/common/hooks/useAsyncCallback';
import initialCompany from 'modules/companies/constants/initialCompany';
import { companiesActions } from 'modules/companies/redux/companies';
import React from 'react';
import useRouter from 'use-react-router';
import { CompanyEditContainerProps } from '../CompanyEditContainer';
import CompanyEditForm from './CompanyEditForm';

interface CompanyEditFormContainerProps extends CompanyEditContainerProps {}

const CompanyEditFormContainer: React.FC<CompanyEditFormContainerProps> = ({ isNew, company }) => {
	const dispatch = useDispatch();
	const { history } = useRouter();
	const formCompany: CompanyEditableProps | null = isNew ? initialCompany : company;

	const deleteHandler = useAsyncCallback(async () => {
		if (!isNew) {
			try {
				await dispatch(companiesActions.delete.request(formCompany.uuid));
			} catch (error) {
				//
			} finally {
				history.push('/companies');
			}
		}
	});

	const submitHandler = useAsyncCallback(async (values: CompanyEditableProps, { setSubmitting }: any) => {
		const finalCompany = { ...values };
		let responseInitialCompany = null;

		const action = isNew ? companiesActions.add.request : companiesActions.update.request;
		try {
			responseInitialCompany = await dispatch(action(finalCompany));
			isNew && responseInitialCompany && history.push(`/users/${responseInitialCompany.uuid}/info`);
		} catch (error) {
			//
		} finally {
			setSubmitting(false);
			if (isNew && responseInitialCompany) {
				history.push(`/companies/${responseInitialCompany.uuid}/info`);
			}
		}
	});

	return <CompanyEditForm company={formCompany} onSubmit={submitHandler} onDelete={deleteHandler} isNew={Boolean(isNew)} />;
};

export default CompanyEditFormContainer;
