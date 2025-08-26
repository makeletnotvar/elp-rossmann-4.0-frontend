import { CloseOutlined } from '@mui/icons-material';
import { FormControl, IconButton, InputAdornment, InputLabel } from '@mui/material';
import { API } from 'api/axios';
import companiesAPI from 'api/endpoints/companiesAPI';
import cn from 'classnames';
import SelectDialogContainer, { SelectDialogContainerProps, SelectItemType } from 'modules/common/components/Dialogs/SelectDialog/SelectDialogContainer';
import { StyledInput } from 'modules/common/components/Forms/StyledTextField/StyledTextField';
import Params from 'modules/common/components/Params/Params';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UserEditForm.module.scss';

interface UserEditCompanyParamProps {
	company:
		| {
				name: string;
				uuid: string;
		  }
		| null
		| undefined;

	onChange: (ob: { uuid: string; name: string }) => void;
	onDelete: () => void;
	testId?: string;
	disabled?: boolean;
}

const UserEditCompanyParam: React.FC<UserEditCompanyParamProps> = ({ company, onChange, disabled, onDelete, testId }) => {
	const { t } = useTranslation();
	const [dialogOpen, setDialogOpen] = useState(false);

	const confirmHandler = useCallback((value: string, label: string) => {
		onChange({ uuid: value, name: label });
	}, []);

	return (
		<>
			<Params title={t('users.company')} className={cn(styles.params, styles.company)} hideCount collapsable={false}>
				{company ? (
					<FormControl>
						<InputLabel htmlFor='standard-adornment'>Firma </InputLabel>
						<StyledInput
							disabled={disabled}
							id='standard-adornment'
							placeholder='Wybierz'
							data-testid={testId}
							inputProps={{ readOnly: true }}
							onClick={() => setDialogOpen(true)}
							value={company.name}
							endAdornment={
								!disabled && (
									<InputAdornment position='end'>
										<IconButton
											disabled={disabled}
											onClick={evt => {
												evt.stopPropagation();
												onDelete();
											}}
										>
											<CloseOutlined />
										</IconButton>
									</InputAdornment>
								)
							}
						/>
					</FormControl>
				) : (
					<FormControl>
						<InputLabel htmlFor='standard-adornment'>Firma</InputLabel>
						<StyledInput
							disabled={disabled}
							style={{ color: '#ddd' }}
							id='standard-adornment'
							value={'Wybierz...'}
							data-testid={testId}
							placeholder='Wybierz...'
							inputProps={{ readOnly: true }}
							onClick={() => setDialogOpen(true)}
						/>
					</FormControl>
				)}
			</Params>
			{dialogOpen && <UserEditCompanyParamSelect onClose={() => setDialogOpen(false)} onChange={confirmHandler} value={company ? company.uuid : undefined} />}
		</>
	);
};

interface UserEditCompanyParamSelectProps extends Pick<SelectDialogContainerProps, 'value' | 'onChange' | 'onClose'> {}

export const fetchCompaniesList = () =>
	new Promise<SelectItemType[]>(async (resolve, reject) => {
		try {
			const response = await API.get(companiesAPI.getCompaniesList());
			resolve(response.data.companies);
		} catch (err: any) {
			reject(err);
		}
	});

const UserEditCompanyParamSelect: React.FC<UserEditCompanyParamSelectProps> = ({ value, onChange, onClose }) => {
	const { t } = useTranslation();

	return (
		<SelectDialogContainer
			asyncData={fetchCompaniesList()}
			onClose={onClose}
			onChange={onChange}
			value={value}
			title={t('users.messages.company_reference')}
			message={t('users.messages.select_company')}
		/>
	);
};

export default UserEditCompanyParam;
