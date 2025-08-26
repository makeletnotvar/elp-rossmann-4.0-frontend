import { DynamicImageNumericSrc } from "modules/common/components/DrawView/items/DrawViewItemDynamicImage/types";

export default (value: number, srcs: DynamicImageNumericSrc, valueRender: NumericRender): string => {
    let imageUrl = '';
    const { min = 0, max = 100 } = valueRender;
    const imagesCount = srcs.length;
    const maxIndex = imagesCount - 1;

    let currentImageIndex = 0;

    // Image index calculate relatively from value to min-max ratio
    currentImageIndex = Math.round((value - min) / (max - min) * imagesCount);

    // To prevent using first index image in values near to 0 like 0.0043.
    const MIN_VALUE_TO_FIRST_INDEX: number = 0.1;

    currentImageIndex = value <= MIN_VALUE_TO_FIRST_INDEX
        ? 0
        : currentImageIndex > maxIndex
            ? maxIndex
            : currentImageIndex <= 1
                ? 1
                : currentImageIndex;

    imageUrl = srcs[currentImageIndex];

    return imageUrl;
};