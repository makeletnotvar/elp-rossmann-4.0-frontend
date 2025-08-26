import { FormControl, IconButton, InputAdornment, InputLabel } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { API } from 'api/axios';
import usersAPI from 'api/endpoints/usersAPI';
import cn from 'classnames';
import SelectDialogContainer, { SelectDialogContainerProps, SelectItemType } from 'modules/common/components/Dialogs/SelectDialog/SelectDialogContainer';
import { StyledInput } from 'modules/common/components/Forms/StyledTextField/StyledTextField';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './BuildingEdit.module.scss';

interface BuildingEditAdministratorParamProps {
	administrator:
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

const BuildingEditAdministratorParam: React.FC<BuildingEditAdministratorParamProps> = ({ administrator, onChange, onDelete, testId }) => {
	const { history } = useRouter();
	const { t } = useTranslation();
	const [dialogOpen, setDialogOpen] = useState(false);

	const confirmHandler = useCallback((value: string, label: string) => {
		onChange({ uuid: value, name: label });
	}, []);

	return (
		<>
			<div className={cn(styles.administrator)}>
				{administrator ? (
					<FormControl>
						<InputLabel htmlFor='standard-adornment'>Administrator BMS</InputLabel>
						<StyledInput
							id='standard-adornment'
							placeholder='Wybierz'
							data-testid={testId}
							inputProps={{ readOnly: true }}
							onClick={() => setDialogOpen(true)}
							value={administrator.name}
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
						<InputLabel htmlFor='standard-adornment'>Administrator BMS</InputLabel>
						<StyledInput
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
			</div>
			{dialogOpen && (
				<BuildingEditAdministratorParamSelect
					onClose={() => setDialogOpen(false)}
					onChange={confirmHandler}
					value={administrator ? administrator.uuid : undefined}
				/>
			)}
		</>
	);
};

interface BuildingEditAdministratorParamSelectProps extends Pick<SelectDialogContainerProps, 'value' | 'onChange' | 'onClose'> {}

export const fetchUsersList = () =>
	new Promise<SelectItemType[]>(async (resolve, reject) => {
		try {
			const response = await API.get(usersAPI.getUsersList(''));
			resolve(response.data.users);
		} catch (err: any) {
			reject(err);
		}
	});

const BuildingEditAdministratorParamSelect: React.FC<BuildingEditAdministratorParamSelectProps> = ({ value, onChange, onClose }) => {
	const { t } = useTranslation();

	return (
		<SelectDialogContainer
			asyncData={fetchUsersList()}
			onClose={onClose}
			onChange={onChange}
			value={value}
			title={t('buildings.messages.administrator_reference')}
			message={t('buildings.messages.select_administrator')}
		/>
	);
};
interface BuildingEditAdministratorParamButtonProps {
	isEmpty: boolean;
	onDelete: () => void;
}

const BuildingEditAdministratorParamButtons: React.FC<BuildingEditAdministratorParamButtonProps> = ({ isEmpty, onDelete }) => {
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

export default BuildingEditAdministratorParam;
