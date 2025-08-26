import { DrawViewItemDynamicImageComponentProps } from "modules/common/components/DrawView/items/DrawViewItemDynamicImage/DrawViewItemDynamicImageComponent";

export const getItemSrcsCount = (item: DrawViewItemDynamicImageComponentProps): number => {
    const sources = item.srcs;

    if (Array.isArray(sources)) {
        return sources.length;
    } else if (sources instanceof Object) {
        return Object.values(sources).length;
    } else {
        return -1;
    }
}

export default getItemSrcsCount;