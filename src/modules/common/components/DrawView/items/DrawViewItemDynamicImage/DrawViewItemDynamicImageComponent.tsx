import { VisibilityOffOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { processItemStyleWithTransformers, processItemTextWithTransformers } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import useDynamicImage from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/hooks/useDynamicImage';
import useDynamicImageError from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/hooks/useDynamicImageError';
import { DynamicImageEnumSrc, DynamicImageNumericSrc } from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/types';
import { useItemStyleTransfomers } from 'modules/common/components/StyleTransformer/helpers/transformer';
import usePointRenderedValue from 'modules/common/hooks/usePointRenderedValue';
import * as React from 'react';
import { CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { StyleTransformer } from 'typings/styleTransformer';
import styles from './DrawViewItemDynamicImage.module.scss';

export const DRAW_VIEW_ITEM_DYNAMIC_IMAGE = 'dynamic_image';

export interface DrawViewItemDynamicImageComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	pointRef: PointReference | null;
	pointXid?: string;
	title?: string;
	label?: string;
	showLabel?: boolean;
	showValue?: boolean;
	srcs: DynamicImageNumericSrc | DynamicImageEnumSrc;
	type: 'dynamic_image';
	style?: CSSProperties;
	transformers?: StyleTransformer[];
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing: boolean;
	user: UserAuth | null;
	onSetImageLoading: (loadingImage: boolean) => void;
}

export const dynamicImageTemplate: Partial<DrawViewItemDynamicImageComponentProps> = {
	pointRef: null,
	pointXid: '',
	title: '',
	srcs: [],
	type: DRAW_VIEW_ITEM_DYNAMIC_IMAGE,
	style: {},
};

/**
 * @TODO!!
 *
 * Add error handling with messages.
 *
 *
 */
const DrawViewItemDynamicImageComponent: React.FC<DrawViewItemDynamicImageComponentProps> = ({
	pointRef,
	pointXid,
	srcs,
	title,
	id,
	style,
	showLabel,
	showValue,
	setActive,
	label,
	editing,
	user,
	transformers: viewTransformers,
	onSetImageLoading,
}) => {
	const { error, setError } = useDynamicImageError(srcs, [pointRef, pointXid, id], onSetImageLoading);
	const { imageUrl } = useDynamicImage(srcs, pointRef?.uuid || null, pointXid, editing);
	const { t } = useTranslation();
	const renderedValue = usePointRenderedValue(pointRef?.uuid || null, pointXid);

	const { transformers, values } = useItemStyleTransfomers(viewTransformers);
	const finalStyle: CSSProperties | undefined = useMemo(
		() => processItemStyleWithTransformers(style, id, transformers, values, setActive),
		[style, transformers, id, values]
	);
	const finalTexts: any | undefined = useMemo(
		() => processItemTextWithTransformers({ label: label, title: title }, id, transformers, values, setActive),
		[label, title, id, transformers, values]
	);

	const classNames = useMemo(
		() =>
			cn(styles.image, {
				[styles.hidden]: error,
				[styles.empty]: !pointXid && pointRef === null,
			}),
		[id, srcs, error, pointXid, pointRef]
	);

	if (!imageUrl) {
		return null;
	}

	if (error || (!pointXid && pointRef === null)) {
		return (
			<>
				{showLabel && <div className={styles.label}>{finalTexts.__label}</div>}
				<div
					className={styles.empty}
					style={{ ...finalStyle, display: editing || user?.userType === 'DEV' ? 'block' : finalStyle.display }}
					title={finalTexts.__title}
					onLoad={() => onSetImageLoading(false)}
				>
					{(editing || user?.userType === 'DEV') && finalStyle.display === 'none' && (
						<VisibilityOffOutlined style={{ position: 'absolute', top: -20, left: -20, color: '#aaa' }} />
					)}
					{t('view_editor.messages.emptyDynamicImage')}
				</div>
				{showValue && <div className={styles.value}>{renderedValue}</div>}
			</>
		);
	}

	return (
		<>
			{showLabel && <div className={styles.label}>{finalTexts.__label}</div>}
			<LazyLoadImage
				src={imageUrl}
				title={title}
				style={{ ...finalStyle, display: editing || user?.userType === 'DEV' ? 'block' : finalStyle.display }}
				className={classNames}
				onError={() => {
					onSetImageLoading(false);
					setError(true);
				}}
				beforeLoad={() => {
					onSetImageLoading(true);
				}}
				onLoad={() => {
					onSetImageLoading(false);
				}}
			/>
			{(editing || user?.userType === 'DEV') && finalStyle.display === 'none' && (
				<VisibilityOffOutlined style={{ position: 'absolute', top: -20, left: -20, color: '#aaa' }} />
			)}
			{showValue && <div className={styles.value}>{renderedValue}</div>}
		</>
	);
};

export default DrawViewItemDynamicImageComponent;
