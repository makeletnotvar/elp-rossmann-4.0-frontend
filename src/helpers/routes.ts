import { Pages } from 'config/pages';

export const isCurrentRoute = (route: string | undefined, pathname: string, pages: Pages) => {
	if (route) {
		const lowerCaseRoute = route.toLocaleLowerCase().split('?')[0];
		const lowerCasePathname = pathname.toLocaleLowerCase().substring(1); // with removed starting "/" char
		const matched = lowerCasePathname.startsWith(lowerCaseRoute);

		// There is a case like "building" / "buildings" where routes must be checked if there is exact the same
		const exact = lowerCasePathname.length === lowerCaseRoute.length || lowerCasePathname[lowerCaseRoute.length] === '/';

		return matched && exact;
	}
	return false;
};

export const isParentRoute = (route: string | undefined, pathname: string, pages: Pages) => {
	if (route) {
		const lowerCaseRoute = route.toLocaleLowerCase();
		const lowerCasePathRoute = pathname.toLocaleLowerCase().substring(1).split('/')[0];
		return pages[lowerCasePathRoute] && pages[lowerCasePathRoute].menuRelation === lowerCaseRoute;
	}
	return false;
};
