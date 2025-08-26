import { StyleTransformersRenderer } from 'modules/common/components/StyleTransformer/renderers/StyleTransformersRenderer';
import { CSSProperties } from 'react';
import { StyleTransformer } from 'typings/styleTransformer';
import { DrawViewItem } from '../../items/items';

export function getItemsElements(itemsIndexes: number[]): HTMLElement[] {
	return itemsIndexes.map(index => document.querySelector(`[data-item-id="${index}"]`)).filter(el => el !== null) as HTMLElement[];
}

export function getItem(items: DrawViewItem[], itemId: number): DrawViewItem | undefined {
	return items.find(item => item.id === itemId);
}

export function getItemElement(itemIndex: number): HTMLElement | null {
	return document.querySelector(`[data-item-id="${itemIndex}"]`);
}

export function processItemStyle(style: CSSProperties): CSSProperties {
	const nextStyle: CSSProperties = {};

	if (style.width !== undefined) {
		nextStyle.width = style.width || 'auto';
	}

	if (style.height !== undefined) {
		nextStyle.height = style.height || 'auto';
	}

	return { ...style, ...nextStyle };
}

export function processItemStyleWithTransformers(
	style: CSSProperties | undefined,
	id: number,
	transformers: StyleTransformer[],
	values: { [uuid: string]: number },
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
): CSSProperties {
	let nextStyle: CSSProperties = {};

	if (style && style.width !== undefined) {
		nextStyle.width = style.width || 'auto';
	}

	if (style && style.height !== undefined) {
		nextStyle.height = style.height || 'auto';
	}

	if (transformers.length) {
		const styleTransformersStyle = StyleTransformersRenderer.extendStyleWithStyleTransformers(
			style,
			id,
			transformers,
			values,
			setActive ? setActive : () => console.log()
		);
		nextStyle = { ...nextStyle, ...styleTransformersStyle };
	}

	return { ...style, ...nextStyle };
}

export function processItemTextWithTransformers(
	texts: { [key: string]: string | undefined },
	id: number,
	transformers: StyleTransformer[],
	values: { [uuid: string]: number },
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
) {
	let nextText = Object.entries(texts).reduce((acc, [key, value]) => {
		return {
			...acc,
			[`__${key}`]: value,
		};
	}, {});

	if (transformers.length) {
		const styleTransformersText = StyleTransformersRenderer.extendTextWithStyleTransformers(
			texts,
			id,
			transformers,
			values,
			setActive ? setActive : () => console.log()
		);
		nextText = { ...nextText, styleTransformersText };
	}

	return nextText;
}

export function processItemNumberWithTransformers(
	numbers: { [key: string]: number | undefined },
	id: number,
	transformers: StyleTransformer[],
	values: { [uuid: string]: number },
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
) {
	let nextNumber = Object.entries(numbers).reduce((acc, [key, value]) => {
		return {
			...acc,
			[`__${key}`]: value,
		};
	}, {});

	if (transformers.length) {
		const styleTransformersText = StyleTransformersRenderer.extendNumberWithStyleTransformers(
			numbers,
			id,
			transformers,
			values,
			setActive ? setActive : () => console.log()
		);
		nextNumber = { ...nextNumber, ...styleTransformersText };
	}
	return nextNumber;
}
