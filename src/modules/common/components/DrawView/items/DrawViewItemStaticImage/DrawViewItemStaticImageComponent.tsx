import { VisibilityOffOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { processItemStyleWithTransformers, processItemTextWithTransformers } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import { useItemStyleTransfomers } from 'modules/common/components/StyleTransformer/helpers/transformer';
import { viewActions } from 'modules/common/redux/view';
import * as React from 'react';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { StyleTransformer } from 'typings/styleTransformer';
import { getPixelColorFromImage } from '../../helpers/getPixelColorFromImage';
import styles from './DrawViewItemStaticImage.module.scss';

export const DRAW_VIEW_ITEM_STATIC_IMAGE = 'static_image';

export interface DrawViewItemStaticImageComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	pointRef: PointReference | null;
	title?: string;
	src: string;
	type: 'static_image';
	style?: CSSProperties;
	bgView?: boolean;
	transformers?: StyleTransformer[];
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing: boolean;
	unitXid: string;
	user: UserAuth | null;
	onSetImageLoading: (loadingImage: boolean) => void;
}

export const staticImageTemplate: Partial<DrawViewItemStaticImageComponentProps> = {
	title: '',
	src: '',
	type: DRAW_VIEW_ITEM_STATIC_IMAGE,
	style: {},
};

const DrawViewItemStaticImageComponent: React.FC<DrawViewItemStaticImageComponentProps> = ({
	src,
	title,
	id,
	style,
	editing,
	transformers: viewTransformers,
	setActive,
	unitXid,
	user,
	onSetImageLoading,
	bgView,
}) => {
	const [error, setError] = useState<boolean>(false);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	useEffect(() => setError(!src), [src, id]);

	const classNames = useMemo(() => cn(styles.image, { [styles.hidden]: error }), [id, src, error]);
	const { transformers, values } = useItemStyleTransfomers(viewTransformers);

	const finalStyle: CSSProperties | undefined = useMemo(
		() => processItemStyleWithTransformers(style, id, transformers, values, setActive),
		[style, transformers, id, values]
	);
	const finalTexts: any | undefined = useMemo(
		() => processItemTextWithTransformers({ title: title }, id, transformers, values, setActive),
		[title, id, transformers, values]
	);

	const doubleClickHandler = () => {
		unitXid && dispatch(viewActions.setUnit(unitXid));
	};

	const handleImageLoad = () => {
		onSetImageLoading(false);
		if (bgView) {
			getPixelColorFromImage(src).then(color => {
				document.documentElement.style.setProperty('--bg_view_versionV2', color as string);
			});
		}
	};

	useEffect(() => {
		return () => {
			document.documentElement.style.removeProperty('--bg_view_versionV2');
		};
	}, []);

	if (error || !src) {
		<div
			className={styles.empty}
			style={{
				...finalStyle,
				cursor: unitXid && !editing ? 'pointer' : 'auto',
				display: editing || user?.userType === 'DEV' ? 'block' : finalStyle.display,
			}}
			onLoad={() => {
				onSetImageLoading(false);
			}}
			onDoubleClick={!editing ? doubleClickHandler : undefined}
		>
			{(editing || user?.userType === 'DEV') && finalStyle.display === 'none' && (
				<VisibilityOffOutlined style={{ position: 'absolute', top: -20, left: -20, color: '#aaa' }} />
			)}
			{t('view_editor.messages.emptyImage')}
		</div>;
	}

	return (
		//    <img
		//     src={`/${import.meta.env.VITE_APP_FILES_MAIN_FOLDER}/${src}`}
		//     title={title}
		//     style={finalStyle}
		//     className={classNames}
		//     onError={evt => setError(true)}
		// />
		// <>
		// 	<LazyLoadImage
		// 		src={`/${import.meta.env.VITE_APP_FILES_MAIN_FOLDER}/${src}`}
		// 		title={finalTexts.__title}
		// 		style={{
		// 			...finalStyle,
		// 			cursor: unitXid && !editing ? 'pointer' : 'auto',
		// 			display: editing || user?.userType === 'DEV' ? 'block' : finalStyle.display,
		// 		}}
		// 		className={classNames}
		// 		onError={() => {
		// 			onSetImageLoading(false);
		// 			setError(true);
		// 		}}
		// 		onDoubleClick={!editing ? doubleClickHandler : undefined}
		// 		beforeLoad={() => onSetImageLoading(true)}
		// 		onLoad={() => onSetImageLoading(false)}
		// 	/>
		// 	{(editing || user?.userType === 'DEV') && finalStyle.display === 'none' && (
		// 		<VisibilityOffOutlined style={{ position: 'absolute', top: -20, left: -20, color: '#aaa' }} />
		// 	)}
		// </>
		<>
			<img
				src={src}
				title={finalTexts.__title}
				style={{
					...finalStyle,
					cursor: unitXid && !editing ? 'pointer' : 'auto',
					display: editing || user?.userType === 'DEV' ? 'block' : finalStyle.display,
				}}
				className={classNames}
				onError={() => {
					onSetImageLoading(false);
					setError(true);
				}}
				onDoubleClick={!editing ? doubleClickHandler : undefined}
				onLoad={handleImageLoad}
			/>
			{(editing || user?.userType === 'DEV') && finalStyle.display === 'none' && (
				<VisibilityOffOutlined style={{ position: 'absolute', top: -20, left: -20, color: '#aaa' }} />
			)}
		</>
	);
};

export default DrawViewItemStaticImageComponent;
