import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import SelectDialog from './SelectDialog';

export type SelectItemType = {
	uuid: string;
	name: string;
};

export interface SelectDialogContainerProps {
	asyncData: Promise<SelectItemType[]>;
	value: string | undefined;
	title: string;
	message?: string;
	onClose: () => void;
	onChange: (value: string, label: string) => void;
	selectPlaceholder?: string;
	disabled?: boolean;
}

export const useSelectorData = (asyncHandler: Promise<SelectItemType[]>) => {
	const [fetched, setFetched] = useState<boolean>(false);
	const [fetching, setFetching] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [data, setData] = useState<SelectItemType[]>([]);

	useEffect(() => {
		setFetching(true);
		asyncHandler
			.then(_data => {
				setData(_data);
				setFetched(true);
				setFetching(false);
			})
			.catch(() => {
				setFetched(false);
				setFetching(false);
				setError(true);
			});
	}, []);

	return {
		fetching,
		fetched,
		data,
		error,
	};
};

const SelectDialogContainer: React.FC<SelectDialogContainerProps> = ({
	asyncData,
	value = '',
	onClose,
	onChange,
	title,
	message,
	selectPlaceholder,
	disabled,
}) => {
	const { fetched, data } = useSelectorData(asyncData);

	const changeHandler = useCallback(
		(value: string, label: string) => {
			onChange(value, label);
			onClose();
		},
		[data]
	);

	return (
		<>
			{fetched && (
				<SelectDialog
					open={fetched}
					data={data}
					onClose={onClose}
					onConfirm={changeHandler}
					title={title}
					message={message}
					selectPlaceholder={selectPlaceholder}
					value={value}
					disabled={disabled}
				/>
			)}
		</>
	);
};

export default SelectDialogContainer;
