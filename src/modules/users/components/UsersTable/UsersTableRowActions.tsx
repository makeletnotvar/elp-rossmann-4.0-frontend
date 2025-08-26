import { MoreHorizOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const UsersTableRowActions = (userType: UserType | null, history: any) => (rowData: Partial<User>) => {
	const { uuid } = rowData;

	const clickHandler = () => {
		history.push(`/user/${uuid}/info`);
	};

	return (
		<>
			<IconButton data-testid={`user-more-button-${rowData.uuid}`} size='small' onClick={clickHandler}>
				<MoreHorizOutlined fontSize='inherit' />
			</IconButton>
		</>
	);
};
export default UsersTableRowActions;
