/* eslint-disable no-async-promise-executor */
import { IconButton } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { API } from 'api/axios';
import viewsAPI from 'api/endpoints/viewsAPI';
import memoizee from 'memoizee';
import SelectDialogContainer, { SelectItemType } from 'modules/common/components/Dialogs/SelectDialog/SelectDialogContainer';
import { useView } from 'modules/common/redux/view';
import * as React from 'react';
import { useState } from 'react';
import styles from './DrawViewItemValue.module.scss';

interface DrawViewItemValuePointSelectorProps {
	point: null | PointReference;
	onChange: (value: string, label: string) => void;
	building?: Reference | undefined | null;
	onDelete?: () => void;
}

export const fetchAsyncPoints = memoizee(
	(buildingUUID: string, q: string) =>
		new Promise<SelectItemType[]>(async (resolve, reject) => {
			try {
				const response = await API.get(viewsAPI.selectBuildingPoints(buildingUUID, q));
				resolve(response.data.points);
			} catch (err: any) {
				reject(err);
			}
		})
);

const DrawViewItemValuePointSelector: React.FC<DrawViewItemValuePointSelectorProps> = ({ point, onChange, onDelete, building }) => {
	const [open, setOpen] = useState<boolean>(false);
	const { view } = useView();
	const changeHandler = (value: string, label: string) => {
		onChange(value, label);
	};

	const q = '';
	const buildingUUID = building ? building.uuid : '';

	return (
		<div className={styles.container}>
			<a className={styles.selectPointLink} onClick={() => setOpen(true)}>
				{point ? point.name : 'Wybierz punkt'}
			</a>
			{onDelete && point && (
				<IconButton size='small' onClick={onDelete}>
					<CloseOutlined fontSize='inherit' color='error' />
				</IconButton>
			)}
			{open && buildingUUID && (
				<SelectDialogContainer
					asyncData={fetchAsyncPoints(buildingUUID || '', q)}
					message={''}
					title={''}
					onChange={changeHandler}
					onClose={() => setOpen(false)}
					value={point ? point.uuid : ''}
				/>
			)}
		</div>
	);
};

export default DrawViewItemValuePointSelector;
