import { VisibilityOffOutlined } from '@mui/icons-material';
import { useProcessedData } from 'modules/common/helpers/views/useProcessedData';
import * as React from 'react';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { StyleTransformer } from 'typings/styleTransformer';
import styles from '../DrawViewItemDynamicImage/DrawViewItemDynamicImage.module.scss';

export const DRAW_VIEW_ITEM_COOLER = 'cooler';

export interface DrawViewItemCoolerComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	title?: string;
	label?: string;
	showLabel?: boolean;
	showValue?: boolean;
	type: 'cooler';
	style?: CSSProperties;
	transformers?: StyleTransformer[];
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing: boolean;
	user: UserAuth | null;
	onSetImageLoading: (loadingImage: boolean) => void;
}

export const coolerTemplate: Partial<DrawViewItemCoolerComponentProps> = {
	title: '',
	type: DRAW_VIEW_ITEM_COOLER,
	style: {},
};

const DrawViewItemCoolerComponent: React.FC<DrawViewItemCoolerComponentProps> = ({
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
	const POINTS_XIDS = ['dxpwr', 'freonpwr'];
	const BASE_PATH = '/data/ahu/';

	const srcsPaths: Record<string, string[]> = {
		dxpwr: ['CX0.png', 'CX1.png', 'CX2.png', 'CX3.png', 'CX4.png', 'CX5.png'],
		freonpwr: ['CX0.png', 'CX1.png', 'CX2.png', 'CX3.png', 'CX4.png', 'CX5.png'],
		default: ['CX0.png', 'CX1.png', 'CX2.png', 'CX3.png', 'CX4.png', 'CX5.png'],
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
					{t('view_editor.messages.emptyCooler')}
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

export default DrawViewItemCoolerComponent;
