import cn from 'classnames';
import { processItemStyleWithTransformers, processItemTextWithTransformers } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import useDynamicImage from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/hooks/useDynamicImage';
import useDynamicImageError from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/hooks/useDynamicImageError';
import { useItemStyleTransfomers } from 'modules/common/components/StyleTransformer/helpers/transformer';
import usePointRenderedValue from 'modules/common/hooks/usePointRenderedValue';
import { CSSProperties, useMemo } from 'react';
import styles from '../../components/DrawView/items/DrawViewItemDynamicImage/DrawViewItemDynamicImage.module.scss';

interface useItemRenderProps {
	imageSet: string[];
	viewTransformers: any;
	style: any;
	point?: Point | null;
	id: number;
	label?: string;
	title?: string;
	onSetImageLoading: (loadingImage: boolean) => void;
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing?: boolean;
}

export const useItemRender = ({ imageSet, point, viewTransformers, style, id, label, title, onSetImageLoading, setActive, editing }: useItemRenderProps) => {
	const { error, setError } = useDynamicImageError(imageSet, [point, id], onSetImageLoading);
	const { imageUrl } = useDynamicImage(imageSet, point && point.uuid ? point.uuid : null, undefined, editing);
	const { transformers, values } = useItemStyleTransfomers(viewTransformers);
	const renderedValue = usePointRenderedValue(point && point.uuid ? point.uuid : null);

	const finalStyle: CSSProperties | undefined = useMemo(
		() => processItemStyleWithTransformers(style, id, transformers, values, setActive),
		[style, transformers, id, values]
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
