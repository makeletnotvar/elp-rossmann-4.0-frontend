import { VisibilityOffOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { AHURecType, useGetAHURecType } from 'modules/building/components/BuildingTabs/BuildingUnits/helpers/getAHURecType';
import { processItemStyleWithTransformers, processItemTextWithTransformers } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import { useItemStyleTransfomers } from 'modules/common/components/StyleTransformer/helpers/transformer';
import { viewActions } from 'modules/common/redux/view';
import * as React from 'react';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { StyleTransformer } from 'typings/styleTransformer';
import styles from '../DrawViewItemStaticImage/DrawViewItemStaticImage.module.scss';

export const DRAW_VIEW_ITEM_FILTER = 'filter';

export interface DrawViewItemFilterComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	pointRef: PointReference | null;
	title?: string;
	src: string;
	type: 'filter';
	style?: CSSProperties;
	transformers?: StyleTransformer[];
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing: boolean;
	unitXid: string;
	user: UserAuth | null;
	onSetImageLoading: (loadingImage: boolean) => void;
}

export const filterTemplate: Partial<DrawViewItemFilterComponentProps> = {
	title: '',
	src: '',
	type: DRAW_VIEW_ITEM_FILTER,
	style: {},
};

const DrawViewItemFilterComponent: React.FC<DrawViewItemFilterComponentProps> = ({
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
}) => {
	const recType = useGetAHURecType();
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

	return (
		<>
			{error || !src ? (
				<div
					className={styles.empty}
					style={{
						...finalStyle,
						cursor: unitXid && !editing ? 'pointer' : 'auto',
						display: editing || user?.userType === 'DEV' ? 'block' : finalStyle.display,
						marginTop: recType === AHURecType.ROTARY ? '150px' : '0',
					}}
					onLoad={() => onSetImageLoading(false)}
					onDoubleClick={!editing ? doubleClickHandler : undefined}
				>
					{(editing || user?.userType === 'DEV') && finalStyle.display === 'none' && (
						<VisibilityOffOutlined style={{ position: 'absolute', top: -20, left: -20, color: '#aaa' }} />
					)}
					{t('view_editor.messages.emptyImage')}
				</div>
			) : (
				<div style={{ marginTop: recType === AHURecType.ROTARY ? '150px' : '0' }}>
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
						onLoad={() => onSetImageLoading(false)}
					/>
					{(editing || user?.userType === 'DEV') && finalStyle.display === 'none' && (
						<VisibilityOffOutlined style={{ position: 'absolute', top: -20, left: -20, color: '#aaa' }} />
					)}
				</div>
			)}
		</>
	);
};

export default DrawViewItemFilterComponent;
