import cn from 'classnames';
import ResizeWrapper from 'modules/common/components/DrawView/DrawViewEditor/DrawViewEditorItemWrapper/ResizeWrapper';
import { DrawViewEditorItemsProviderProps } from 'modules/common/components/DrawView/DrawViewEditor/DrawViewEditorItemsProvider/DrawViewEditorItemsProvider';
import { useStyle } from 'modules/common/components/DrawView/DrawViewItemWrapper/useStyle';
import items from 'modules/common/components/DrawView/items/items';
import { useItemStyleTransfomers } from 'modules/common/components/StyleTransformer/helpers/transformer';
import * as React from 'react';
import { useMemo } from 'react';
import { processItemNumberWithTransformers } from '../helpers/items';
import styles from './DrawViewEditorItemWrapper.module.scss';

interface DrawViewEditorItemWrapperProps extends DrawViewEditorItemsProviderProps {
	children?: React.ReactNode;
}

const DrawViewEditorItemWrapper: React.FC<DrawViewEditorItemWrapperProps> = ({
	item,
	onSelect,
	isSelected,
	children,
	setActive,
	handleClick,
	select,
	selected,
}) => {
	const { transformers, values } = useItemStyleTransfomers(item.transformers);
	const finalNumbers: any | undefined = useMemo(
		() => processItemNumberWithTransformers({ x: item.x, y: item.y, z: item.z }, item.id, transformers, values, setActive),
		[item, transformers, values]
	);
	const internalStyle = useStyle({ ...item, x: finalNumbers.__x, y: finalNumbers.__y, z: finalNumbers.__z });
	const classNames = cn(styles.wrapper, {
		[styles.selected]: isSelected,
		[item.classes || '']: Boolean(item.classes),
	});
	const def = items[item.type];

	return (
		<div
			className={classNames}
			style={internalStyle}
			onClick={onSelect}
			onContextMenu={evt => {
				select(selected.length > 1 ? [...selected, item.id] : [item.id]);
				handleClick(evt, 'VIEW_ITEM', item);
			}}
			data-selected={isSelected}
			data-item-id={item.id}
			data-pos-x={finalNumbers.__x}
			data-pos-y={finalNumbers.__y}
			data-width={item.style && item.style.width}
			data-height={item.style && item.style.height}
		>
			{children}
			{isSelected && def && def.resizable && <ResizeWrapper />}
		</div>
	);
};

export default DrawViewEditorItemWrapper;
