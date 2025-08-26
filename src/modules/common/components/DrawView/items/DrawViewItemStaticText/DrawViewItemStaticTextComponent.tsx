import { VisibilityOffOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { processItemStyleWithTransformers, processItemTextWithTransformers } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import { useItemStyleTransfomers } from 'modules/common/components/StyleTransformer/helpers/transformer';
import * as React from 'react';
import { CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleTransformer } from 'typings/styleTransformer';
import styles from './DrawViewItemStaticText.module.scss';

export const DRAW_VIEW_ITEM_STATIC_TEXT = 'static_text';

export interface DrawViewItemStaticTextComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	pointRef: PointReference | null;
	label: string;
	type: 'static_text';
	style?: CSSProperties;
	css?: string;
	transformers?: StyleTransformer[];
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing: boolean;
	user: UserAuth | null;
}

export const staticTextTemplate: Partial<DrawViewItemStaticTextComponentProps> = {
	label: '',
	type: DRAW_VIEW_ITEM_STATIC_TEXT,
	style: {},
};

const DrawViewItemStaticTextComponent: React.FC<DrawViewItemStaticTextComponentProps> = ({
	id,
	label,
	style,
	transformers: viewTransformers,
	editing,
	setActive,
	user,
}) => {
	const { t } = useTranslation();

	const classNames = useMemo(
		() =>
			cn(styles.label, {
				[styles.empty]: label.length === 0,
			}),
		[label.length === 0]
	);

	const { transformers, values } = useItemStyleTransfomers(viewTransformers);
	const finalStyle: CSSProperties | undefined = useMemo(
		() => processItemStyleWithTransformers(style, id, transformers, values, setActive),
		[style, id, transformers, values]
	);
	const finalTexts: any | undefined = useMemo(
		() => processItemTextWithTransformers({ label: label || t('view_editor.messages.emptyLabel') }, id, transformers, values, setActive),
		[label, id, transformers, values]
	);

	return (
		<div className={classNames} style={{ ...finalStyle, display: editing || user?.userType === 'DEV' ? 'block' : finalStyle.display } || {}}>
			{(editing || user?.userType === 'DEV') && finalStyle.display === 'none' && (
				<VisibilityOffOutlined style={{ position: 'absolute', top: -20, left: -20, color: '#aaa' }} />
			)}
			<label>{finalTexts.__label}</label>
		</div>
	);
};

export default DrawViewItemStaticTextComponent;
