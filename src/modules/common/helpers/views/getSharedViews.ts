export const getSharedViews = (view: ViewType, user: UserAuth | null) => {
	if (user?.type === 'DEV') {
		return true;
	}

	if (view.shared === true) {
		return true;
	}

	return false;
};
