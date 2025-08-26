import cn from 'classnames';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { viewActions } from 'modules/common/redux/view';
import * as React from 'react';
import { CSSProperties, useMemo } from 'react';
import { StyleTransformer } from 'typings/styleTransformer';
import styles from './DrawViewItemHTML.module.scss';

export const DRAW_VIEW_ITEM_HTML = 'html';

export interface DrawViewItemHTMLComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	pointRef: PointReference | null;
	label: string;
	type: 'html';
	html: string;
	style: CSSProperties;
	unitXid: string;
	transformers?: StyleTransformer[];
	editing?: boolean;
}

const DEFAULT_CODE = JSON.stringify({ html: `<div style="color:#00F;text-decoration:underline">\n  Nowy komponent HTML\n</div>` });

export const htmlTemplate: Partial<DrawViewItemHTMLComponentProps> = {
	label: '',
	type: DRAW_VIEW_ITEM_HTML,
	html: DEFAULT_CODE,
	unitXid: '',
	style: {},
};

const DrawViewItemHTMLComponent: React.FC<DrawViewItemHTMLComponentProps> = ({ label, id, html, unitXid, editing }) => {
	const dispatch = useDispatch();

	// Classnames and styles
	const classNames = useMemo(
		() =>
			cn(styles.label, {
				[styles.empty]: label.length === 0,
			}),
		[label.length === 0]
	);

	const htmlContent = {
		__html: JSON.parse(html).html || DEFAULT_CODE,
	};

	const doubleClickHandler = () => {
		unitXid && dispatch(viewActions.setUnit(unitXid));
	};

	return (
		<div
			onDoubleClick={!editing ? doubleClickHandler : undefined}
			style={{ cursor: unitXid ? 'pointer' : 'auto' }}
			className={classNames}
			dangerouslySetInnerHTML={htmlContent}
		></div>
	);
};

export default DrawViewItemHTMLComponent;
