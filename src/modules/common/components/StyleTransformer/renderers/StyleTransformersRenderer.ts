import { CSSProperties } from 'react';
import { StyleTransformerInputType, StyleTransformer as StyleTransformerType } from 'typings/styleTransformer';
import { StyleTransformerColorRenderer } from './inputs/StyleTransformerColorRenderer';
import { TransformerNumberRenderer } from './inputs/TransformerNumberRenderer';
import { TransformerTextRenderer } from './inputs/TransformerTextRenderer';
// item.id -
export class StyleTransformersRenderer {
	private static renderStyle(
		transformers: StyleTransformerType[],
		id: number,
		values: { [uuid: string]: number },
		setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
	): CSSProperties {
		const TRANSFORMERS = {
			[StyleTransformerInputType.COLOR]: StyleTransformerColorRenderer.getStyleTransformerStyle,
			[StyleTransformerInputType.ENUM]: StyleTransformerColorRenderer.getStyleTransformerStyle,
			[StyleTransformerInputType.NUMBER]: StyleTransformerColorRenderer.getStyleTransformerStyle,
			[StyleTransformerInputType.TEXT]: StyleTransformerColorRenderer.getStyleTransformerStyle,
		};

		const styleTransformerStyle: CSSProperties = transformers.reduce((acc, transformer) => {
			if (transformer.pointRef?.uuid && transformer.styleTransformerInputType && transformer.active && !transformer.transformerId?.startsWith('__')) {
				const styleTransformer = TRANSFORMERS[transformer.styleTransformerInputType];
				const styleTransformerStyle: CSSProperties = styleTransformer(transformer, id, values[transformer.pointRef.uuid], setActive);
				return { ...acc, ...styleTransformerStyle };
			} else {
				return { ...acc };
			}
		}, {} as CSSProperties);
		return styleTransformerStyle;
	}

	public static extendStyleWithStyleTransformers(
		style: CSSProperties = {},
		id: number,
		transformers: StyleTransformerType[],
		values: { [uuid: string]: number },
		setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
	): CSSProperties {
		const styleTransformerStyle = StyleTransformersRenderer.renderStyle(transformers, id, values, setActive);
		const nextStyle = { ...style, ...styleTransformerStyle };
		return nextStyle as CSSProperties;
	}

	public static extendTextWithStyleTransformers(
		texts: { [key: string]: string | undefined },
		id: number,
		transformers: StyleTransformerType[],
		values: { [uuid: string]: number },
		setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
	) {
		const styleTransformerTexts = transformers.reduce((acc, transformer) => {
			if (transformer.pointRef?.uuid && transformer.styleTransformerInputType && transformer.active && transformer.transformerId?.startsWith('__')) {
				const styleTransformerText = TransformerTextRenderer.getTransformerText(texts, id, transformer, values[transformer.pointRef.uuid], setActive);
				return { ...acc, [transformer.transformerId as string]: styleTransformerText };
			} else {
				return {
					...acc,
					...Object.entries(texts).reduce((acc, [key, value]) => {
						return {
							...acc,
							[`__${key}`]: value,
						};
					}, {}),
				};
			}
		}, {});

		return styleTransformerTexts;
	}

	public static extendNumberWithStyleTransformers(
		numbers: { [key: string]: number | undefined },
		id: number,
		transformers: StyleTransformerType[],
		values: { [uuid: string]: number },
		setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
	) {
		const styleTransformerTexts = transformers.reduce((acc, transformer) => {
			if (transformer.pointRef?.uuid && transformer.styleTransformerInputType && transformer.active && transformer.transformerId?.startsWith('__')) {
				const styleTransformerNumber = TransformerNumberRenderer.getTransformerNumber(numbers, id, transformer, values[transformer.pointRef.uuid], setActive);
				return { ...acc, [transformer.transformerId as string]: styleTransformerNumber };
			} else {
				return {
					...acc,
					...Object.entries(numbers).reduce((acc, [key, value]) => {
						return {
							...acc,
							[`__${key}`]: value,
						};
					}, {}),
				};
			}
		}, {});
		return styleTransformerTexts;
	}
}
