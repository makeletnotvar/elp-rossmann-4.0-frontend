import { VisibilityOffOutlined } from '@mui/icons-material';

import { AHURecType, useGetAHURecType } from 'modules/building/components/BuildingTabs/BuildingUnits/helpers/getAHURecType';
import { useProcessedData } from 'modules/common/helpers/views/useProcessedData';
import * as React from 'react';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { StyleTransformer } from 'typings/styleTransformer';
import styles from './DrawViewItemRecTemp.module.scss';

export const DRAW_VIEW_ITEM_REC_TEMP = 'rec_temp';

export interface DrawViewItemRecTempComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	title?: string;
	label?: string;
	showLabel?: boolean;
	showValue?: boolean;
	type: 'rec_temp';
	style?: CSSProperties;
	transformers?: StyleTransformer[];
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing: boolean;
	user: UserAuth | null;
	onSetImageLoading: (loadingImage: boolean) => void;
}

export const recTempTemplate: Partial<DrawViewItemRecTempComponentProps> = {
	title: '',
	type: DRAW_VIEW_ITEM_REC_TEMP,
	style: {},
};

const DrawViewItemRecTempComponent: React.FC<DrawViewItemRecTempComponentProps> = ({
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
	const recType = useGetAHURecType();
	const { t } = useTranslation();
	const POINTS_XIDS = ['b4'];
	const BASE_PATH = '/data/ahu/';

	const srcsPaths: Record<string, string[]> = {
		b4: [
			'thermometer0.png',
			'thermometer1.png',
			'thermometer2.png',
			'thermometer3.png',
			'thermometer4.png',
			'thermometer5.png',
			'thermometer6.png',
			'thermometer7.png',
			'thermometer8.png',
			'thermometer9.png',
		],
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
			<div style={{ marginTop: recType === AHURecType.ROTARY ? '-155px' : '0' }}>
				{showLabel && (
					<div className={styles.label} style={{ marginTop: recType === AHURecType.ROTARY ? '-155px' : '0' }}>
						{finalTexts.__label}
					</div>
				)}
				<div
					className={styles.empty}
					style={{
						...finalStyle,
						display: editing || user?.userType === 'DEV' ? 'block' : finalStyle.display,
					}}
					title={finalTexts.__title}
					onLoad={() => onSetImageLoading(false)}
				>
					{(editing || user?.userType === 'DEV') && finalStyle.display === 'none' && (
						<VisibilityOffOutlined style={{ position: 'absolute', top: -20, left: -20, color: '#aaa' }} />
					)}
					{t('view_editor.messages.emptyRecTemp')}
				</div>
			</div>
		);
	}

	return (
		<div className={styles.containerRecTemp} style={{ marginTop: recType === AHURecType.ROTARY ? '-155px' : '0' }}>
			{showLabel && <div className={styles.label}>{finalTexts.__label}</div>}
			<LazyLoadImage
				src={imageUrl}
				title={title}
				style={{
					...finalStyle,
					display: editing || user?.userType === 'DEV' ? 'block' : finalStyle.display,
				}}
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
		</div>
	);
};

export default DrawViewItemRecTempComponent;
