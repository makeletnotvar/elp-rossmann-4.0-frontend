import { Menu, MenuItem } from '@mui/material';
import { AddCircle, ChevronLeftOutlined, ChevronRightOutlined, ExpandLessOutlined, ExpandMoreOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { processItemStyleWithTransformers, processItemTextWithTransformers } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import { useItemStyleTransfomers } from 'modules/common/components/StyleTransformer/helpers/transformer';
import { viewActions } from 'modules/common/redux/view';
import * as React from 'react';
import { CSSProperties, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StyleTransformer } from 'typings/styleTransformer';
import { EditingViewStateActions } from '../../DrawViewEditor/editingState';
import { DrawViewItem } from '../items';
import './DrawViewItemPipe.module.scss';
import styles from './DrawViewItemPipe.module.scss';
import DrawViewItemPipeArrow from './DrawViewItemPipeArrow';

export const DRAW_VIEW_ITEM_PIPE = 'pipe';

export interface DrawViewItemPipeComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	pointRef: PointReference | null;
	type: 'pipe';
	direction: 'left' | 'right' | 'up' | 'down';
	rotate: number;
	label: string;
	description: string;
	style?: CSSProperties;
	x: number;
	y: number;
	actions: EditingViewStateActions;
	select: (items: number[]) => void;
	editing: boolean;
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	transformers?: StyleTransformer[];
	unitXid: string;
}

export const pipeTemplate: Partial<DrawViewItemPipeComponentProps> = {
	type: DRAW_VIEW_ITEM_PIPE,
	label: '',
	direction: 'right',
	style: {
		width: 300,
		height: 10,
		opacity: 1,
		rotate: '0',
		fontSize: 14,
		background: '#bbb',
		color: '#000',
	},
};

const DrawViewItemPipeComponent: React.FC<DrawViewItemPipeComponentProps> = ({
	id,
	style,
	label,
	direction,
	description,
	actions,
	x,
	y,
	setActive,
	select,
	editing,
	unitXid,
	transformers: viewTransformers,
}) => {
	const [menuPosition, setMenuPosition] = useState<any>(null);
	const [isAddButtonVisible, setIsAddButtonVisible] = useState<boolean>(false);

	const dispatch = useDispatch();

	const { transformers, values } = useItemStyleTransfomers(viewTransformers);
	const finalStyle: CSSProperties | undefined = useMemo(
		() => processItemStyleWithTransformers(style, id, transformers, values, setActive),
		[style, transformers, id, values]
	);
	const finalTexts: any | undefined = useMemo(
		() => processItemTextWithTransformers({ label: label, description: description }, id, transformers, values, setActive),
		[label, description, id, transformers, values]
	);

	const UNDEFINED_TEMPLATE = undefined;
	const isParentRight = direction === 'right';
	const isParentLeft = direction === 'left';
	const isParentUp = direction === 'up';
	const isParentDown = direction === 'down';
	const isParentVertical = isParentDown || isParentUp;
	const isParentHorizontal = isParentLeft || isParentRight;
	const parsedStyleHeight = Number(finalStyle.height);
	const parsedStyleWidth = Number(finalStyle.width);

	const addItemHandler = useCallback(
		(itemType: string, template?: any, style?: any, initialDir?: any) => () => {
			const isVertical = initialDir === 'up' || initialDir === 'down';
			const isHorizontal = initialDir === 'left' || initialDir === 'right';

			const position = {
				x:
					isVertical && isParentRight
						? x + parsedStyleWidth - parsedStyleHeight
						: isVertical && isParentLeft
						? x
						: initialDir === 'right' && isParentVertical
						? x
						: initialDir === 'left' && isParentVertical
						? x - parsedStyleHeight + parsedStyleWidth
						: initialDir === 'left'
						? x - parsedStyleWidth
						: initialDir === 'right'
						? x + parsedStyleWidth
						: x,
				y:
					isHorizontal && isParentDown
						? y + parsedStyleHeight
						: isHorizontal && isParentUp
						? y - parsedStyleWidth
						: initialDir === 'down' && isParentHorizontal
						? y + parsedStyleHeight
						: initialDir === 'up' && isParentHorizontal
						? y - parsedStyleWidth
						: initialDir === 'down'
						? y + parsedStyleHeight
						: initialDir === 'up'
						? y - parsedStyleHeight
						: y,
			};

			const templatePipe = {
				style: {
					width: finalStyle.width,
					height: finalStyle.height,
					opacity: finalStyle.opacity,
					rotate: finalStyle.rotate,
					fontSize: finalStyle.fontSize,
					background: finalStyle.background,
					color: finalStyle.color,
					...style,
				},
			};
			actions.addItem(itemType, position, template ? template : { ...templatePipe, direction: initialDir }).then((item: DrawViewItem) => select([item.id]));
			setMenuPosition(null);
			setIsAddButtonVisible(false);
		},
		[x, y, finalStyle, direction]
	);

	const handleClick = (evt: React.MouseEvent) => {
		if (!menuPosition) {
			setMenuPosition({
				top: evt.pageY,
				left: evt.pageX,
			});
		}
	};

	const doubleClickHandler = () => {
		unitXid && dispatch(viewActions.setUnit(unitXid));
	};

	const ADD_STYLE = {
		up: {
			top: '0%',
			left: '50%',
			transform: `translate(-50%, 0%)`,
		},
		down: {
			bottom: '0%',
			left: '50%',
			transform: `translate(-50%, 0%)`,
		},
		left: {
			top: '50%',
			left: '0%',
			transform: `translate(0%, -50%)`,
		},
		right: {
			top: '50%',
			right: '0%',
			transform: `translate(0%, -50%)`,
		},
	};

	return (
		<>
			<div
				title={finalTexts.__description}
				className={cn(styles.pipe)}
				style={
					{
						alignItems: isParentLeft ? 'flex-start' : isParentRight ? 'flex-end' : 'center',
						justifyContent: isParentUp ? 'start' : isParentDown ? 'end' : 'center',
						...finalStyle,
						cursor: unitXid && !editing ? 'pointer' : 'auto',
						display: editing ? 'block' : finalStyle.display,
					} || {}
				}
				onDoubleClick={!editing ? doubleClickHandler : undefined}
				onMouseEnter={() => setIsAddButtonVisible(true)}
				onMouseLeave={() => setIsAddButtonVisible(false)}
			>
				{editing && finalStyle.display === 'none' && <VisibilityOffOutlined style={{ position: 'absolute', top: -20, left: -20, color: '#aaa' }} />}
				<DrawViewItemPipeArrow direction={direction} color={'#ffff66'} size={isParentHorizontal ? parsedStyleHeight / 20 : parsedStyleWidth / 20} />
				{editing && (
					<>
						{isAddButtonVisible && (
							<div onClick={handleClick}>
								<AddCircle
									style={{
										background: '#000',
										borderRadius: '50%',
										opacity: 0.8,
										color: '#ffff66',
										cursor: 'pointer',
										position: 'absolute',
										...ADD_STYLE[direction],
									}}
								/>
								<Menu
									className={styles.menu}
									open={Boolean(menuPosition)}
									onClose={() => setMenuPosition(null)}
									anchorReference='anchorPosition'
									anchorPosition={menuPosition}
								>
									<MenuItem
										className={styles.menuItem}
										onClick={addItemHandler(
											DRAW_VIEW_ITEM_PIPE,
											UNDEFINED_TEMPLATE,
											{
												width: isParentVertical ? finalStyle.width : finalStyle.height,
												height: isParentVertical ? finalStyle.height : finalStyle.width,
											},
											'up'
										)}
									>
										<ExpandLessOutlined />
									</MenuItem>
									<MenuItem
										className={styles.menuItem}
										onClick={addItemHandler(
											DRAW_VIEW_ITEM_PIPE,
											UNDEFINED_TEMPLATE,
											{
												width: isParentHorizontal ? finalStyle.width : finalStyle.height,
												height: isParentHorizontal ? finalStyle.height : finalStyle.width,
											},
											'right'
										)}
									>
										<ChevronRightOutlined />
									</MenuItem>
									<MenuItem
										className={styles.menuItem}
										onClick={addItemHandler(
											DRAW_VIEW_ITEM_PIPE,
											UNDEFINED_TEMPLATE,
											{
												width: isParentHorizontal ? finalStyle.width : finalStyle.height,
												height: isParentHorizontal ? finalStyle.height : finalStyle.width,
											},
											'left'
										)}
									>
										<ChevronLeftOutlined />
									</MenuItem>
									<MenuItem
										className={styles.menuItem}
										onClick={addItemHandler(
											DRAW_VIEW_ITEM_PIPE,
											UNDEFINED_TEMPLATE,
											{
												width: isParentVertical ? finalStyle.width : finalStyle.height,
												height: isParentVertical ? finalStyle.height : finalStyle.width,
											},
											'down'
										)}
									>
										<ExpandMoreOutlined />
									</MenuItem>
								</Menu>
							</div>
						)}
						{/* <span>{finalTexts.__label}</span> */}
					</>
				)}
			</div>
		</>
	);
};

export default DrawViewItemPipeComponent;
