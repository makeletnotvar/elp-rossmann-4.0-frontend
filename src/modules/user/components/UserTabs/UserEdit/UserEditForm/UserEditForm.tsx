import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { Formik } from 'formik';
import { isAdmin, isDev } from 'helpers/users';
import { BuildingEditSelectField } from 'modules/building/components/BuildingTabs/BuildingEdit/BuildingEdit';
import ClearButton from 'modules/common/components/Buttons/ClearButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import DeleteButton from 'modules/common/components/Buttons/DeleteButton';
import ConfirmDialog, { useConfirmDialog } from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import { StyledTextField } from 'modules/common/components/Forms/StyledTextField/StyledTextField';
import Params from 'modules/common/components/Params/Params';
import useMailTestMessage from 'modules/user/hooks/useMailTestMessage';
import useUserForm from 'modules/user/hooks/useUserForm';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserEditCompanyParam from './UserEditCompanyParam';
import styles from './UserEditForm.module.scss';
import userValidationSchema from './userValidationSchema';

interface UserEditFormProps {
	user: UserEditableProps;
	isNew: boolean;
	isMyself: boolean;
	onSubmit: (values: UserEditableProps) => void;
	onDelete: () => void;
	userType: UserType | null; // current logged user
}

const UserEditForm: React.FC<UserEditFormProps> = ({ user, userType: loggedUserType, isNew: isCreateForm, isMyself, onSubmit, onDelete }) => {
	const editingUserType = user.type!;
	const { t } = useTranslation();
	const { closeConfirm, openConfirm, isConfirm } = useConfirmDialog();
	const [isCustomEmailAddressFieldActive, setCustomEmailFieldAddress] = useState<boolean>(Boolean(user.emailNotificationsAddress));
	const { sendTestMessage, isSending: isSendingTestMessage } = useMailTestMessage();

	const { typeFieldDisabled, mailFieldDisabled, activeFieldVisible, deleteButtonVisible, userBuildingAllFieldVisible } = useUserForm(
		user.type!,
		loggedUserType,
		isCreateForm,
		isMyself
	);

	const userTypeOptions = isDev(loggedUserType) ? ['USER', 'ADMIN', 'DEV'] : isAdmin(loggedUserType) ? ['USER', 'ADMIN'] : ['USER'];

	const confirmedDeleteHandler = useCallback(() => {
		onDelete();
		closeConfirm();
	}, []);

	return (
		<div className={styles.container}>
			<Formik initialValues={user} onSubmit={onSubmit} validationSchema={userValidationSchema}>
				{props => {
					const { handleSubmit, handleChange, values, errors, touched, setFieldValue, handleReset, isSubmitting, isValid } = props;
					const toggleNotificationsPriority = (priority: EventPriority) => () => {
						const current = values.emailNotifications || [];
						const nextValue = current.includes(priority) ? current.filter(p => p !== priority) : [...current, priority];

						setFieldValue('emailNotifications', nextValue);
					};

					const handleCustomEmailToggle = () => {
						const nextState = !isCustomEmailAddressFieldActive;
						setCustomEmailFieldAddress(nextState);
						if (nextState === false) {
							setFieldValue('emailNotificationsAddress', '');
						}
					};

					return (
						<form onSubmit={handleSubmit}>
							<Params title='Identyfikacja' hideCount className={styles.params} collapsable={false}>
								<StyledTextField
									data-testid='user-label'
									id='label'
									value={values.label}
									placeholder={t('users.label')}
									label={t('users.label')}
									onChange={handleChange}
									helperText={errors.label && touched.label ? t(errors.label as string) : null}
									error={Boolean(errors.label && touched.label)}
								/>
								<StyledTextField
									data-testid='user-username'
									id='mail'
									value={values.mail}
									disabled={mailFieldDisabled}
									placeholder={t('users.mail')}
									label={t('users.mail')}
									onChange={handleChange}
									helperText={errors.mail && touched.mail ? t(errors.mail as string) : null}
									error={Boolean(errors.mail && touched.mail)}
								/>
							</Params>
							<Params title='Uprawnienia' hideCount className={styles.params} collapsable={false}>
								<BuildingEditSelectField
									disabled={typeFieldDisabled}
									id='type'
									label='users.type'
									testId='user-type'
									value={values.type as string}
									values={userTypeOptions}
									translationPath='users.types'
									onChange={(value: string) => {
										setFieldValue('type', value);
										setFieldValue('company', null);
									}}
								/>
								{activeFieldVisible && (
									<FormControlLabel
										disabled={isMyself}
										label={t('users.active')}
										control={
											<Checkbox
												data-testid='user-active-checkbox'
												id='bypass'
												checked={values.active}
												onChange={evt => setFieldValue('active', evt.target.checked)}
											/>
										}
									/>
								)}
								{userBuildingAllFieldVisible && (
									<FormControlLabel
										label={values.company ? t('users.user_buildings_all_company', { company: values.company.name }) : t('users.user_buildings_all')}
										control={
											<Checkbox
												id='userBuildingsAll'
												data-testid='user-userBuildingsAll-checkbox'
												checked={Boolean(values.userBuildingsAll)}
												onChange={evt => setFieldValue('userBuildingsAll', evt.target.checked)}
											/>
										}
									/>
								)}
							</Params>
							{values.type === 'USER' && (
								<UserEditCompanyParam
									disabled={!isDev(loggedUserType) && !isAdmin(loggedUserType) && isMyself}
									testId='add-company-button'
									company={values.company}
									onChange={ob => setFieldValue('company', ob)}
									onDelete={() => setFieldValue('company', null)}
								/>
							)}
							<Params title='Powiadomienia e-mail' hideCount className={styles.params} collapsable={false}>
								<FormControlLabel
									label={'Bez klasy'}
									control={<Checkbox id='NONE' checked={(values.emailNotifications || []).includes('NONE')} onChange={toggleNotificationsPriority('NONE')} />}
								/>
								<FormControlLabel
									label={'Informacja'}
									control={
										<Checkbox
											id='INFORMATION'
											checked={(values.emailNotifications || []).includes('INFORMATION')}
											onChange={toggleNotificationsPriority('INFORMATION')}
										/>
									}
								/>
								<FormControlLabel
									label={'Pilny'}
									control={
										<Checkbox id='URGENT' checked={(values.emailNotifications || []).includes('URGENT')} onChange={toggleNotificationsPriority('URGENT')} />
									}
								/>
								<FormControlLabel
									label={'Krytyczny'}
									control={
										<Checkbox
											id='critical'
											checked={(values.emailNotifications || []).includes('CRITICAL')}
											onChange={toggleNotificationsPriority('CRITICAL')}
										/>
									}
								/>
								<FormControlLabel
									label={'Zagrożenia życia'}
									control={
										<Checkbox
											id='life_safety'
											checked={(values.emailNotifications || []).includes('LIFE_SAFETY')}
											onChange={toggleNotificationsPriority('LIFE_SAFETY')}
										/>
									}
								/>
								<Box width='100%' display='flex' alignSelf='center' style={{ paddingLeft: '11px' }}>
									<FormControlLabel
										label='Wyślij powiadomienia na inny adres (niż ten podany w koncie)'
										control={<Checkbox id='notifications_mail_different' checked={isCustomEmailAddressFieldActive} onChange={handleCustomEmailToggle} />}
									/>
									<StyledTextField
										id='emailNotificationsAddress'
										value={values.emailNotificationsAddress}
										disabled={!isCustomEmailAddressFieldActive}
										placeholder={t('users.mail')}
										label={t('users.mail')}
										onChange={handleChange}
										helperText={errors.emailNotificationsAddress && touched.emailNotificationsAddress ? t(errors.mail as string) : null}
										error={Boolean(errors.emailNotificationsAddress && touched.emailNotificationsAddress)}
									/>
								</Box>
							</Params>
							<div className={styles.actions}>
								{deleteButtonVisible && (
									<DeleteButton testId='delete-user-button' onClick={openConfirm}>
										{t('general.delete')}
									</DeleteButton>
								)}
								<ClearButton onClick={handleReset}>{t('general.clear')}</ClearButton>
								<ConfirmButton testId='save-user-button' disabled={!isValid || isSubmitting}>
									{t(`general.${isCreateForm ? (isSubmitting ? 'creating' : 'create') : isSubmitting ? 'saving' : 'save'}`)}
									{isSubmitting && '...'}
								</ConfirmButton>
								<ConfirmDialog
									title={t('users.messages.deleting_user')}
									message={`${t('users.messages.sure_to_delete_user')}?`}
									open={isConfirm}
									onCancel={closeConfirm}
									onConfirm={confirmedDeleteHandler}
								/>
							</div>
						</form>
					);
				}}
			</Formik>
		</div>
	);
};

export default UserEditForm;
