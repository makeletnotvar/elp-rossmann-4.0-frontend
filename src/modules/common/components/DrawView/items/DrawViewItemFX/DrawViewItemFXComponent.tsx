import { VisibilityOffOutlined } from '@mui/icons-material';

import { useItemRender } from 'modules/common/helpers/views/useItemRender';
import { usePoint } from 'modules/common/redux/points';
import * as React from 'react';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { StyleTransformer } from 'typings/styleTransformer';
import styles from '../DrawViewItemDynamicImage/DrawViewItemDynamicImage.module.scss';
import { useFXImageSet } from './useFXImageSet';

export const DRAW_VIEW_ITEM_FX = 'fx';

export interface DrawViewItemFXComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	title?: string;
	label?: string;
	showLabel?: boolean;
	showValue?: boolean;
	type: 'fx';
	style?: CSSProperties;
	transformers?: StyleTransformer[];
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing: boolean;
	user: UserAuth | null;
	xidPreffixFilter?: string;
	onSetImageLoading: (loadingImage: boolean) => void;
}

export const fxTemplate: Partial<DrawViewItemFXComponentProps> = {
	title: '',
	type: DRAW_VIEW_ITEM_FX,
	style: {},
};

const DrawViewItemFXComponent: React.FC<DrawViewItemFXComponentProps> = ({
	title,
	id,
	style,
	showLabel,
	showValue,
	setActive,
	label,
	xidPreffixFilter,
	editing,
	user,
	transformers: viewTransformers,
	onSetImageLoading,
}) => {
	const { t } = useTranslation();
	const point = usePoint(null, xidPreffixFilter);
	const { imageSet, width, height } = useFXImageSet(xidPreffixFilter + 'mode');

	const { classNames, error, setError, imageUrl, renderedValue, finalStyle, finalTexts } = useItemRender({
		imageSet,
		point,
		viewTransformers,
		style: { ...style, width, height },
		id,
		label,
		title,
		onSetImageLoading,
		setActive,
		editing,
	});

	if (!imageUrl) {
		return null;
	}

	if (error) {
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
					{t('view_editor.messages.emptyHeater')}
				</div>
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

export default DrawViewItemFXComponent;
