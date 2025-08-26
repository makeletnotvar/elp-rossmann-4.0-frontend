import cn from 'classnames';
import * as React from 'react';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleTransformerInputType } from 'typings/styleTransformer';
import { EditingViewStateActions } from '../../DrawView/DrawViewEditor/editingState';
import { DrawViewItem } from '../../DrawView/items/items';
import StyleTransformer from '../../StyleTransformer/StyleTransformer';
import styles from './EditorForm.module.scss';

interface EditorFormGroupParamProps {
	children?: React.ReactNode;
	className?: string;
	label: string;
	rawLabel?: string;
	style?: CSSProperties;
	labelStyle?: CSSProperties;
	containerStyle?: CSSProperties;
	show?: boolean;
	view?: DrawView;
	item?: DrawViewItem;
	actions?: EditingViewStateActions;
	transformerId?: string;
	index?: number;
	inputType?: StyleTransformerInputType;
	transformerEnumValues?: { key: string; value: string }[];
}

const EditorFormGroupParam: React.FC<EditorFormGroupParamProps> = props => {
	return props.show !== false ? <EditorFormGroupParamContent {...props} /> : null;
};

const EditorFormGroupParamContent: React.FC<EditorFormGroupParamProps> = ({
	className,
	children,
	label,
	style,
	labelStyle,
	containerStyle,
	index,
	show,
	rawLabel,
	item,
	view,
	actions,
	transformerId,
	inputType,
	transformerEnumValues,
}) => {
	const { t } = useTranslation();
	const isActiveStyleTransformer = transformerId && inputType && view && item && actions;

	return (
		<div className={cn(styles.param, className)} style={style}>
			{isActiveStyleTransformer ? (
				<StyleTransformer
					view={view}
					actions={actions}
					item={item}
					transformerId={transformerId}
					inputType={inputType}
					transformerEnumValues={transformerEnumValues}
				/>
			) : (
				<div style={{ width: '26px' }}></div>
			)}
			<div className={styles.label} style={labelStyle}>
				{rawLabel || index ? `${t(label)} ${index}` : t(label)}
			</div>
			<div className={styles.inputContainer} style={containerStyle}>
				{children}
			</div>
		</div>
	);
};

export default EditorFormGroupParam;
