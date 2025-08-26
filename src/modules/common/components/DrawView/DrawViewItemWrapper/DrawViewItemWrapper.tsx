import cn from 'classnames';
import { DrawViewItem } from 'modules/common/components/DrawView/items/items';
import * as React from 'react';
import { useMemo } from 'react';
import { useItemStyleTransfomers } from '../../StyleTransformer/helpers/transformer';
import { processItemNumberWithTransformers } from '../DrawViewEditor/helpers/items';
import styles from './DrawViewItemWrapper.module.scss';
import { useStyle } from './useStyle';

interface DrawViewItemWrapperProps {
	children?: React.ReactNode;
	item: DrawViewItem;
	setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
}

const DrawViewItemWrapper: React.FC<DrawViewItemWrapperProps> = ({ item, children, setActive }) => {
	const { transformers, values } = useItemStyleTransfomers(item.transformers);
	const finalNumbers: any | undefined = useMemo(
		() => processItemNumberWithTransformers({ x: item.x, y: item.y, z: item.z }, item.id, transformers, values, setActive),
		[item, transformers, values]
	);

	const style = useStyle({ ...item, x: finalNumbers.__x, y: finalNumbers.__y, z: finalNumbers.__z });

	const classNames = cn(styles.item, {
		[item.classes || '']: Boolean(item.classes),
	});

	return (
		<div className={classNames} style={style}>
			{children}
		</div>
	);
};

export default DrawViewItemWrapper;
