import { DynamicImageSrcs } from "modules/common/components/DrawView/items/DrawViewItemDynamicImage/types";

export default (srcs: DynamicImageSrcs): DynamicImageSrcs => {
    if (Array.isArray(srcs)) {
        return srcs.filter(src => src !== '')
    } else if (srcs instanceof Object) {
        return srcs;
    } else {
        return srcs;
    }
}