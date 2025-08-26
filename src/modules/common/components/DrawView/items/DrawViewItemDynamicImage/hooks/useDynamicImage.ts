import { isArray } from 'lodash';
import enumImageRenderer from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/renderers/enumImageRenderer';
import numericImageRenderer from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/renderers/numericImageRenderer';
import { DynamicImageEnumSrc, DynamicImageNumericSrc } from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/types';
import { ENUM, NUMERIC } from 'modules/common/helpers/points/points';
import { usePoint } from 'modules/common/redux/points';
import { usePointValue } from 'modules/common/redux/poll';
import { useEffect, useMemo, useState } from 'react';

export default (
	srcs: DynamicImageNumericSrc | DynamicImageEnumSrc,
	pointUUID: string | null,
	pointXid?: string,
	editing?: boolean
): { imageUrl: string | null } => {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const memoizedSrcs = useMemo(() => srcs, [JSON.stringify(srcs)]);

	const point = usePoint(pointUUID || null, pointXid);
	const pointValue = usePointValue(point?.uuid || null);
	const pointType: PointType | undefined = point?.type;

	useEffect(() => {
		if (editing || (point && pointType)) {
			const defaultUrl = isArray(memoizedSrcs) ? memoizedSrcs[0] : Object.values(memoizedSrcs)[0];
			setImageUrl(prev => (prev !== defaultUrl ? defaultUrl : prev));
		} else {
			setImageUrl(null);
		}
	}, [editing, point, pointType, memoizedSrcs]);

	useEffect(() => {
		if (point && pointType) {
			let url: string | null = null;
			if (pointType === NUMERIC) {
				url = numericImageRenderer(pointValue?.value || 0, memoizedSrcs as DynamicImageNumericSrc, point.customRender as NumericRender);
			} else if (pointType === ENUM) {
				url = enumImageRenderer(pointValue?.value || 0, memoizedSrcs as DynamicImageEnumSrc);
			}

			if (url !== imageUrl) {
				setImageUrl(url);
			}
		}
	}, [memoizedSrcs, pointValue?.value, pointType, point, imageUrl]);

	return { imageUrl };
};
