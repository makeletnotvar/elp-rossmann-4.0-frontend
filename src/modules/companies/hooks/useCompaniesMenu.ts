import { useCallback } from 'react';
import useRouter from 'use-react-router';

const useCompaniesMenu = () => {
	const {
		history,
		match: {
			params: { uuid, tab: activeTab },
		},
	} = useRouter<{ uuid: string; tab: string }>();

	const clickTabHandler = useCallback(
		(tab: string) => {
			if (tab !== activeTab) {
				history.push(`/companies/${uuid}/${tab}`);
			}
		},
		[activeTab]
	);

	return {
		activeTab,
		clickTabHandler,
	};
};

export default useCompaniesMenu;
