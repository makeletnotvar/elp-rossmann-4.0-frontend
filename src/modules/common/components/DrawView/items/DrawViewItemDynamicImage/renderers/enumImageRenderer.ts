import { DynamicImageEnumSrc } from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/types';

export default (value: number, srcs: DynamicImageEnumSrc): string => {
	const MIN_INDEX = 0;
	// get max key value
	const maxIndex = Math.max(...Object.keys(srcs).map(parseInt)) - 1;
	let imageIndex = Math.round(value);

	imageIndex = imageIndex > maxIndex ? maxIndex : imageIndex < MIN_INDEX ? MIN_INDEX : imageIndex;

	return srcs[imageIndex];
};
