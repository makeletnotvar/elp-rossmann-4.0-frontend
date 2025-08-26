import * as React from 'react';
import { CSSProperties } from 'react';
import { StyleTransformer } from 'typings/styleTransformer';
import styles from './DrawViewItemParam.module.scss';
import DrawViewItemParamPointValue from './DrawViewItemParamPointValue/DrawViewItemParamPointValue';

export const DRAW_VIEW_ITEM_PARAM = 'param';

export interface DrawViewItemParamComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	pointRef: PointReference | null;
	pointXid?: string;
	type: 'param';
	label: string;
	style?: CSSProperties;
	transformers?: StyleTransformer[];
	editing?: boolean;
}

export const paramTemplate: Partial<DrawViewItemParamComponentProps> = {
	type: DRAW_VIEW_ITEM_PARAM,
	style: {
		width: 240,
		height: 54,
	},
};

const DrawViewItemParamComponent: React.FC<DrawViewItemParamComponentProps> = ({ pointRef, width, label, pointXid, editing }) => {
	return pointRef || pointXid ? (
		<DrawViewItemParamPointValue
			width={width || 240}
			label={label || pointRef?.name || 'Parametr'}
			xid={pointXid}
			uuid={pointRef?.uuid || ''}
			editing={editing}
			settable
		/>
	) : (
		<div className={styles.emptyParam}>Brak punktu</div>
	);
};

export default DrawViewItemParamComponent;
