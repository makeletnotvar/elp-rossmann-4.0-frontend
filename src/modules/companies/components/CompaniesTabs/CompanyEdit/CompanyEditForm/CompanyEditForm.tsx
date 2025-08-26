import { Formik } from 'formik';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import DeleteButton from 'modules/common/components/Buttons/DeleteButton';
import ConfirmDialog, { useConfirmDialog } from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import { StyledTextField } from 'modules/common/components/Forms/StyledTextField/StyledTextField';
import Params from 'modules/common/components/Params/Params';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CompanyEditForm.module.scss';
import companyValidationSchema from './CompanyValidationSchema';

interface CompanyEditFormProps {
	company: CompanyEditableProps;
	isNew: boolean;
	onSubmit: (values: CompanyEditableProps) => void;
	onDelete: () => void;
}

const CompanyEditForm: React.FC<CompanyEditFormProps> = ({ company, isNew, onSubmit, onDelete }) => {
	const { t } = useTranslation();
	const { closeConfirm, openConfirm, isConfirm } = useConfirmDialog();

	const confirmedDeleteHandler = useCallback(() => {
		onDelete();
		closeConfirm();
	}, []);

	return (
		<div className={styles.container}>
			<Formik initialValues={company} onSubmit={onSubmit} validationSchema={companyValidationSchema}>
				{props => {
					const { handleSubmit, handleChange, values, errors, touched, isSubmitting, isValid } = props;
					return (
						<form onSubmit={handleSubmit}>
							<Params title='Identyfikacja' hideCount className={styles.params} collapsable={false}>
								<StyledTextField
									id='name'
									data-testid='company-name'
									value={values.name}
									placeholder={t('companies.params.name')}
									label={t('companies.params.name')}
									onChange={handleChange}
									helperText={errors.name && touched.name ? t(errors.name as string) : null}
									error={Boolean(errors.name && touched.name)}
								/>
							</Params>
							<div className={styles.actions}>
								{!isNew && (
									<DeleteButton testId='delete-company-button' onClick={openConfirm}>
										{t('general.delete')}
									</DeleteButton>
								)}
								<ConfirmButton testId='save-company-button' disabled={!isValid || isSubmitting}>
									{t(`general.${isNew ? (isSubmitting ? 'creating' : 'create') : isSubmitting ? 'saving' : 'save'}`)}
									{isSubmitting && '...'}
								</ConfirmButton>
								<ConfirmDialog
									title={t('companies.messages.deleting_company')}
									message={`${t('companies.messages.sure_to_delete_company')}?`}
									open={isConfirm}
									onCancel={closeConfirm}
									onConfirm={confirmedDeleteHandler}
									testId='confirm-delete-company-button'
								/>
							</div>
						</form>
					);
				}}
			</Formik>
		</div>
	);
};

export default CompanyEditForm;
