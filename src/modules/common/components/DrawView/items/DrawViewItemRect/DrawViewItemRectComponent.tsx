import { VisibilityOffOutlined } from '@mui/icons-material';
import { processItemStyleWithTransformers } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import { useItemStyleTransfomers } from 'modules/common/components/StyleTransformer/helpers/transformer';
import * as React from 'react';
import { CSSProperties, useMemo } from 'react';
import { StyleTransformer } from 'typings/styleTransformer';
import styles from './DrawViewItemRect.module.scss';

export const DRAW_VIEW_ITEM_RECT = 'rect';

export interface DrawViewItemRectComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	pointRef: PointReference | null;
	type: 'rect';
	style?: CSSProperties;
	transformers?: StyleTransformer[];
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing: boolean;
	user: UserAuth | null;
}

export const rectTemplate: Partial<DrawViewItemRectComponentProps> = {
	type: DRAW_VIEW_ITEM_RECT,
	style: {
		width: 100,
		height: 100,
		background: '#e4e932',
	},
};

const DrawViewItemRectComponent: React.FC<DrawViewItemRectComponentProps> = ({ id, style, editing, transformers: viewTransformers, setActive, user }) => {
	// Final style
	const { transformers, values } = useItemStyleTransfomers(viewTransformers);
	const finalStyle: CSSProperties | undefined = useMemo(
		() => processItemStyleWithTransformers(style, id, transformers, values, setActive),
		[style, transformers, id, values]
	);

	return (
		<div className={styles.rect} style={{ ...finalStyle, display: editing || user?.userType === 'DEV' ? 'block' : finalStyle.display }}>
			{(editing || user?.userType === 'DEV') && finalStyle.display === 'none' && (
				<VisibilityOffOutlined style={{ position: 'absolute', top: -20, left: -20, color: '#aaa' }} />
			)}
		</div>
	);
};

export default DrawViewItemRectComponent;
