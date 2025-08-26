import { pages } from "config/pages";

export const getStartPageRoute = () => {
    const DEFAULT_ROUTE = 'buildings';
    const startPage = Object
        .values(pages)
        .find(page => page.isMainPage);

    return `/${startPage && startPage.route ? startPage.route : DEFAULT_ROUTE}`;
        
};