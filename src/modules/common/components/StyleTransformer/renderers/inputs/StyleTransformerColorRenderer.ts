import { CSSProperties } from 'react';
import { StyleTransformer, StyleTransformerStatesConfig, StyleTransformerTransitionConfig, StyleTransformerType } from 'typings/styleTransformer';
import { StyleTransformerRenderer } from './StyleTransformerRenderer';

export class StyleTransformerColorRenderer {
	static renderStatesStyle(
		transformer: StyleTransformer,
		id: number,
		value: number,
		setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
	): CSSProperties {
		let stateCSSPropertyValue: string | number | null = null;
		const transformerConfig = transformer.config as StyleTransformerStatesConfig;

		if (transformerConfig && transformerConfig.states && transformerConfig.states.length > 0) {
			if ((transformer.pointType as string) === 'enum') {
				const currentValueState = transformerConfig.states.find(state => state.input === value);
				if (currentValueState) {
					stateCSSPropertyValue = currentValueState.value || null;
				}
			} else if ((transformer.pointType as string) === 'numeric') {
				stateCSSPropertyValue = StyleTransformerRenderer.getNumericValueOperatorResult<string>(transformerConfig, value);
			}

			if (stateCSSPropertyValue !== null) {
				setActive(String(`${id}_${transformer.transformerId}`), stateCSSPropertyValue);
				return {
					[transformer.transformerId as string]: stateCSSPropertyValue,
				};
			} else {
				setActive(String(`${id}_${transformer.transformerId}`), null);
				return {};
			}
		} else {
			setActive(String(`${id}_${transformer.transformerId}`), null);
			return {};
		}
	}

	static interpolateColor(color1: string, color2: string, factor: number): string {
		const hex = (x: number): string => {
			const hexValue = Math.round(x).toString(16);
			return hexValue.length === 1 ? '0' + hexValue : hexValue;
		};

		const rgb1 = color1.match(/\w\w/g)?.map(hex => parseInt(hex, 16)) || [255, 255, 255];
		const rgb2 = color2.match(/\w\w/g)?.map(hex => parseInt(hex, 16)) || [255, 0, 0];

		const interpolatedColor = rgb1.map((channel, index) => Math.round(channel + factor * (rgb2[index] - channel)));

		return `#${hex(interpolatedColor[0])}${hex(interpolatedColor[1])}${hex(interpolatedColor[2])}`;
	}

	static transition(
		transformer: StyleTransformer,
		id: number,
		value: number,
		setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
	): CSSProperties {
		const transformerConfig = transformer.config as StyleTransformerTransitionConfig;
		if (transformerConfig && transformerConfig.start && transformerConfig.end) {
			const { start, end } = transformerConfig;
			const lowerState = value <= start.input ? start : end;
			const higherState = value > start.input ? start : end;
			const factor = (value - lowerState.input) / (higherState.input - lowerState.input);
			const interpolatedColor = StyleTransformerColorRenderer.interpolateColor(lowerState.value as string, higherState.value as string, factor);

			setActive(String(`${id}_${transformer.transformerId}`), interpolatedColor);
			return {
				[transformer.transformerId as string]: interpolatedColor,
			};
		} else {
			setActive(String(`${id}_${transformer.transformerId}`), null);
			return {};
		}
	}

	public static getStyleTransformerStyle(
		transformer: StyleTransformer,
		id: number,
		value: number,
		setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
	): CSSProperties {
		const CSS_PROPERTIES_TRANSFORMERS = {
			[StyleTransformerType.STATES]: StyleTransformerColorRenderer.renderStatesStyle,
			[StyleTransformerType.TRANSITION]: StyleTransformerColorRenderer.transition,
		};
		const CSSPropertiesTransformer = (CSS_PROPERTIES_TRANSFORMERS as any)[transformer.type as StyleTransformerType];
		const CSSProperties = CSSPropertiesTransformer(transformer, id, value, setActive);

		return CSSProperties;
	}
}
