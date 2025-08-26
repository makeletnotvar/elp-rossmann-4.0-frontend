import { FormControl, IconButton, InputAdornment, InputLabel } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { API } from 'api/axios';
import companiesAPI from 'api/endpoints/companiesAPI';
import cn from 'classnames';
import SelectDialogContainer, { SelectDialogContainerProps, SelectItemType } from 'modules/common/components/Dialogs/SelectDialog/SelectDialogContainer';
import { StyledInput } from 'modules/common/components/Forms/StyledTextField/StyledTextField';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './BuildingEdit.module.scss';

interface BuildingEditServiceCompanyParamProps {
	serviceCompany:
		| {
				name: string;
				uuid: string;
		  }
		| null
		| undefined;

	onChange: (ob: { uuid: string; name: string }) => void;
	onDelete: () => void;
	testId?: string;
}

const BuildingEditServiceCompanyParam: React.FC<BuildingEditServiceCompanyParamProps> = ({ serviceCompany, onChange, onDelete, testId }) => {
	const { history } = useRouter();
	const { t } = useTranslation();
	const [dialogOpen, setDialogOpen] = useState(false);

	const confirmHandler = useCallback((value: string, label: string) => {
		onChange({ uuid: value, name: label });
	}, []);

	return (
		<>
			<div className={cn(styles.serviceCompany)}>
				{serviceCompany ? (
					<FormControl>
						<InputLabel htmlFor='standard-adornment'>Firma serwisowa</InputLabel>
						<StyledInput
							id='standard-adornment'
							placeholder='Wybierz'
							data-testid={testId}
							inputProps={{ readOnly: true }}
							onClick={() => setDialogOpen(true)}
							value={serviceCompany.name}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										onClick={evt => {
											evt.stopPropagation();
											onDelete();
										}}
									>
										<CloseOutlined />
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>
				) : (
					<FormControl>
						<InputLabel htmlFor='standard-adornment'>Firma serwisowa</InputLabel>
						<StyledInput
							style={{ color: '#ddd' }}
							id='standard-adornment'
							data-testid={testId}
							value={'Wybierz...'}
							placeholder='Wybierz...'
							inputProps={{ readOnly: true }}
							onClick={() => setDialogOpen(true)}
						/>
					</FormControl>
				)}
			</div>
			{dialogOpen && (
				<BuildingEditServiceCompanyParamSelect
					onClose={() => setDialogOpen(false)}
					onChange={confirmHandler}
					value={serviceCompany ? serviceCompany.uuid : undefined}
				/>
			)}
		</>
	);
};

interface BuildingEditServiceCompanyParamSelectProps extends Pick<SelectDialogContainerProps, 'value' | 'onChange' | 'onClose'> {}

export const fetchCompaniesList = () =>
	new Promise<SelectItemType[]>(async (resolve, reject) => {
		try {
			const response = await API.get(companiesAPI.getCompaniesList());
			resolve(response.data.companies);
		} catch (err: any) {
			reject(err);
		}
	});

const BuildingEditServiceCompanyParamSelect: React.FC<BuildingEditServiceCompanyParamSelectProps> = ({ value, onChange, onClose }) => {
	const { t } = useTranslation();

	return (
		<SelectDialogContainer
			asyncData={fetchCompaniesList()}
			onClose={onClose}
			onChange={onChange}
			value={value}
			title={t('buildings.messages.serviceCompany_reference')}
			message={t('buildings.messages.select_serviceCompany')}
		/>
	);
};
interface BuildingEditServiceCompanyParamButtonProps {
	isEmpty: boolean;
	onDelete: () => void;
}

const BuildingEditServiceCompanyParamButtons: React.FC<BuildingEditServiceCompanyParamButtonProps> = ({ isEmpty, onDelete }) => {
	return (
		<>
			{!isEmpty && (
				<IconButton onClick={onDelete} size='small'>
					<CloseOutlined />
				</IconButton>
			)}
		</>
	);
};

export default BuildingEditServiceCompanyParam;
