import { VisibilityOffOutlined } from '@mui/icons-material';
import { useProcessedData } from 'modules/common/helpers/views/useProcessedData';
import * as React from 'react';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { StyleTransformer } from 'typings/styleTransformer';
import styles from '../DrawViewItemDynamicImage/DrawViewItemDynamicImage.module.scss';

export const DRAW_VIEW_ITEM_AHU = 'ahu';

export interface DrawViewItemAhuComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	title?: string;
	label?: string;
	showLabel?: boolean;
	showValue?: boolean;
	type: 'ahu';
	style?: CSSProperties;
	transformers?: StyleTransformer[];
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing?: boolean;
	user: UserAuth | null;
	onSetImageLoading: (loadingImage: boolean) => void;
}

export const ahuTemplate: Partial<DrawViewItemAhuComponentProps> = {
	title: '',
	type: DRAW_VIEW_ITEM_AHU,
	style: {},
};

const DrawViewItemAhuComponent: React.FC<DrawViewItemAhuComponentProps> = ({
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
	const POINTS_XIDS = ['pwrsup', 'pwrexh', 'throt'];
	const BASE_PATH = '/data/ahu/';

	const srcsPaths: Record<string, string[]> = {
		pwrsup: ['Fan_supply0.png', 'Fan_supply1.gif', 'Fan_supply2.gif', 'Fan_supply3.gif', 'Fan_supply4.gif'],
		pwrexh: ['Fan_exhaust0.png', 'Fan_exhaust1.gif', 'Fan_exhaust2.gif', 'Fan_exhaust3.gif', 'Fan_exhaust4.gif'],
		throt: [
			'dumper_0.png',
			'dumper_1.png',
			'dumper_2.png',
			'dumper_3.png',
			'dumper_4.png',
			'dumper_5.png',
			'dumper_6.png',
			'dumper_7.png',
			'dumper_8.png',
			'dumper_9.png',
		],
		default: ['filter0.png', 'filter0.png'],
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
					{t('view_editor.messages.emptyAhu')}
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

export default DrawViewItemAhuComponent;
