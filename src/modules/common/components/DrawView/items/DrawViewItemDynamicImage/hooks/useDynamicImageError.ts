import { isValidImageFilePath } from 'helpers/files';
import { DynamicImageEnumSrc, DynamicImageNumericSrc } from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/types';
import { useEffect, useState } from 'react';

export default (
	srcs: DynamicImageNumericSrc | DynamicImageEnumSrc,
	deps: any[],
	onSetImageLoading?: (loadingImage: boolean) => void,
	minImagesCount: number | undefined = 2
) => {
	const [error, setError] = useState<boolean>(false);

	// Effect
	useEffect(() => {
		const imagesCount = srcs instanceof Array ? srcs.length : Object.keys(srcs).length;
		const images = srcs instanceof Array ? srcs : Object.values(srcs);

		if (!srcs || imagesCount < minImagesCount || !images.every(isValidImageFilePath)) {
			onSetImageLoading && onSetImageLoading(false);
			setError(true);
		} else {
			setError(false);
		}
	}, [...deps, srcs, minImagesCount]);

	return { error, setError };
};
