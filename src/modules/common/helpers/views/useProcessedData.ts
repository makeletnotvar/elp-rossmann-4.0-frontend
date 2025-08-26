import cn from 'classnames';
import { processItemStyleWithTransformers, processItemTextWithTransformers } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import useDynamicImage from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/hooks/useDynamicImage';
import useDynamicImageError from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/hooks/useDynamicImageError';
import { useItemStyleTransfomers } from 'modules/common/components/StyleTransformer/helpers/transformer';
import usePointRenderedValue from 'modules/common/hooks/usePointRenderedValue';
import { CSSProperties, useMemo } from 'react';
import styles from '../../components/DrawView/items/DrawViewItemDynamicImage/DrawViewItemDynamicImage.module.scss';
import { useCurrentBuildingPoint } from '../points/useCurrentBuildingPoint';

interface useProcessedDataProps {
	POINTS_XIDS: string | string[];
	srcsPaths: Record<string, string[]>;
	BASE_PATH: string;
	viewTransformers: any;
	style: any;
	id: number;
	label?: string;
	title?: string;
	onSetImageLoading: (loadingImage: boolean) => void;
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing?: boolean;
}

export const useProcessedData = ({
	POINTS_XIDS,
	srcsPaths,
	BASE_PATH,
	viewTransformers,
	style,
	id,
	label,
	title,
	onSetImageLoading,
	setActive,
	editing,
}: useProcessedDataProps) => {
	const xidsArray = Array.isArray(POINTS_XIDS) ? POINTS_XIDS : [POINTS_XIDS];
	const point = useCurrentBuildingPoint(xidsArray);

	const srcs = point
		? (srcsPaths[point?.xid || ''] || 'default').map(srcPath => `${BASE_PATH}${srcPath}`)
		: srcsPaths['default']
		? srcsPaths['default'].map(srcPath => `${BASE_PATH}${srcPath}`)
		: [];

	const { error, setError } = useDynamicImageError(srcs, [point, id], onSetImageLoading);
	const { imageUrl } = useDynamicImage(srcs, point && point.uuid ? point.uuid : null, undefined, editing);
	const { transformers, values } = useItemStyleTransfomers(viewTransformers);
	const renderedValue = usePointRenderedValue(point && point.uuid ? point.uuid : null);

	const finalStyle: CSSProperties | undefined = useMemo(
		() => processItemStyleWithTransformers(style, id, transformers, values, setActive),
		[style, id, transformers, values]
	);

	const finalTexts: any | undefined = useMemo(
		() => processItemTextWithTransformers({ label, title }, id, transformers, values, setActive),
		[label, title, id, transformers, values]
	);

	const classNames = useMemo(
		() =>
			cn(styles.image, {
				[styles.hidden]: error,
				[styles.empty]: point === null && !imageUrl,
			}),
		[error, point, imageUrl]
	);

	return {
		error,
		setError,
		imageUrl,
		renderedValue,
		finalStyle,
		finalTexts,
		classNames,
	};
};
