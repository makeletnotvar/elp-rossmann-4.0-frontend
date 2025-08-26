import { DEV, FULL } from "constants/user";
import { isCurrentRoute, isParentRoute } from "helpers/routes";
import useRouter from "use-react-router";
import { Page, pages } from "../../../config/pages";
import { useApp } from "../selectors/app";
import { useAccountType, useAuth } from "../selectors/auth";
import styles from "./PageList.module.scss";

export interface UserPageListItem extends Pick<Page, "title" | "icon" | "moduleType"> {
  isActive: boolean;
  disabled: boolean;
  premiumMarked: boolean;
  route?: string;
  devOnly?: boolean;
  badge?: string;
  className?: string;
  absoluteRoute?: string;
}

export const useUserPagesList = (): UserPageListItem[] => {
  const accountType: AccountType = useAccountType();
  const { location } = useRouter();
  const { currentModule } = useApp();
  const { user } = useAuth();
  const isDevUserLogged = user && user.type === DEV;
  const userPageList = Object.values(pages);
  const isPremiumUser = accountType === FULL;
  const { alarmsCount, alarmsMaxPriority } = useApp();

  const pagesFilter = (page: Page) => {
    const isNotConfiguredAsIgnored = page.ignoreInMenu !== true;
    const isCustomAuthPermitted = !page.customAuth || (user && page.customAuth(user));
    const devPermitted = !(page.devOnly && !isDevUserLogged);
    const permitted = devPermitted && isCustomAuthPermitted;

    return isNotConfiguredAsIgnored && permitted;
  };

  return userPageList.filter(pagesFilter).map(({ title, icon, moduleType, premiumOnly, absoluteRoute, route, disabled: disabledInConfig, devOnly, menuRelation }) => {
    const isActive = isCurrentRoute(route, location.pathname, pages) || isParentRoute(route, location.pathname, pages);
    const authDisabled = devOnly && !isDevUserLogged;
    const disabled = Boolean((premiumOnly && !isPremiumUser) || disabledInConfig);
    const premiumMarked = Boolean(!isPremiumUser && premiumOnly);
    const mappedRoute = premiumMarked ? "premium" : route;
    const isEventsRoute = route === "events" || route === "events-v2";
    let badge;
    let className;

    if (isEventsRoute) {
      badge = isEventsRoute && alarmsCount && alarmsCount > 0 ? (alarmsCount > 99 ? "+99" : String(alarmsCount)) : "";
      className = styles[`level${alarmsMaxPriority}`];
    }

    return {
      title,
      moduleType,
      icon,
      isActive,
      disabled,
      premiumMarked,
      route: mappedRoute,
      absoluteRoute,
      devOnly,
      badge,
      className,
    };
  });
};

export const useCurrentPage = (): Page | null => {
  const {
    location: { pathname },
  } = useRouter();
  const userPages = Object.values(pages);

  return userPages.find((page) => Boolean(page.route && pathname.toLowerCase().includes(page.route))) || null;
};
