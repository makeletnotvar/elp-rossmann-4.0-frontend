import { VisibilityOffOutlined } from '@mui/icons-material';

import { useProcessedData } from 'modules/common/helpers/views/useProcessedData';
import * as React from 'react';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { StyleTransformer } from 'typings/styleTransformer';
import styles from '../DrawViewItemDynamicImage/DrawViewItemDynamicImage.module.scss';

export const DRAW_VIEW_ITEM_HEATER = 'heater';

export interface DrawViewItemHeaterComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	title?: string;
	label?: string;
	showLabel?: boolean;
	showValue?: boolean;
	type: 'heater';
	style?: CSSProperties;
	transformers?: StyleTransformer[];
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing: boolean;
	user: UserAuth | null;
	onSetImageLoading: (loadingImage: boolean) => void;
}

export const heaterTemplate: Partial<DrawViewItemHeaterComponentProps> = {
	title: '',
	type: DRAW_VIEW_ITEM_HEATER,
	style: {},
};

const DrawViewItemHeaterComponent: React.FC<DrawViewItemHeaterComponentProps> = ({
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
	const { t } = useTranslation();
	const POINTS_XIDS = ['hepwr', 'gaspwr', 'y1', 'hwpwr'];
	const BASE_PATH = '/data/ahu/';

	const srcsPaths: Record<string, string[]> = {
		hepwr: ['HE0.png', 'HE1.png', 'HE2.png', 'HE3.png', 'HE4.png', 'HE5.png', 'HE6.png'],
		gaspwr: ['HE0.png', 'HE1.png', 'HE2.png', 'HE3.png', 'HE4.png', 'HE5.png', 'HE6.png'],
		hwpwr: ['HW0.png', 'HW1.png', 'HW2.png', 'HW3.png', 'HW4.png', 'HW5.png', 'HW6.png'],
		y1: ['HW0.png', 'HW1.png', 'HW2.png', 'HW3.png', 'HW4.png', 'HW5.png', 'HW6.png'],
		default: ['HW0.png', 'HW1.png', 'HW2.png', 'HW3.png', 'HW4.png', 'HW5.png', 'HW6.png'],
	};

	const { classNames, error, setError, imageUrl, renderedValue, finalStyle, finalTexts } = useProcessedData({
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

export default DrawViewItemHeaterComponent;
