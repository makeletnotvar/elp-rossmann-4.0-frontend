import { UsersRouteProps } from 'modules/users/types/types';
import { useCallback } from 'react';
import useRouter from 'use-react-router';

const useUserMenu = () => {
	const {
		history,
		match: {
			params: { userUUID, tab: activeTab },
		},
	} = useRouter<UsersRouteProps>();

	const clickTabHandler = useCallback(
		(tab: string) => {
			if (tab !== activeTab) {
				history.push(`/user/${userUUID}/${tab}`);
			}
		},
		[activeTab]
	);

	return {
		activeTab,
		userUUID,
		clickTabHandler,
	};
};

export default useUserMenu;
