import { AHURecType } from 'modules/building/components/BuildingTabs/BuildingUnits/helpers/getAHURecType';
import usePointRenderedValue from 'modules/common/hooks/usePointRenderedValue';
import { usePoint } from 'modules/common/redux/points';
import useDynamicImageError from '../../DrawViewItemDynamicImage/hooks/useDynamicImageError';
import numericImageRenderer from '../../DrawViewItemDynamicImage/renderers/numericImageRenderer';
import { DynamicImageNumericSrc } from '../../DrawViewItemDynamicImage/types';

export const useRecImage = (recType: AHURecType, pointRef?: PointReference | null, pointXid?: string) => {
	const BASE_PATH = '/data/ahu/';
	const point = usePoint(pointRef && pointRef?.uuid ? pointRef?.uuid : null, pointXid);
	const renderedValue = usePointRenderedValue(point && point.uuid ? point.uuid : null, undefined, 'unknown');

	const IMAGES: Record<string, string[]> = {
		[AHURecType.CROSS]: [
			'cross_recuperator_0.png',
			'cross_recuperator_1.png',
			'cross_recuperator_2.png',
			'cross_recuperator_3.png',
			'cross_recuperator_4.png',
			'cross_recuperator_5.png',
			'cross_recuperator_6.png',
			'cross_recuperator_7.png',
			'cross_recuperator_8.png',
		],
		[AHURecType.ROTARY]: ['rotary0.png', 'rotary1.gif', 'rotary2.gif', 'rotary3.gif', 'rotary4.gif', 'rotary5.gif', 'rotary6.gif', 'rotary7.gif'],
	};

	const images = IMAGES[recType].map(file => `${BASE_PATH}${file}`);

	const { error, setError } = useDynamicImageError(images, [recType]);
	const imageUrl = numericImageRenderer(parseFloat(renderedValue) || 0, images as DynamicImageNumericSrc, { min: 0, max: 100 });

	return {
		imageUrl,
		error,
		setError,
		renderedValue,
	};
};
