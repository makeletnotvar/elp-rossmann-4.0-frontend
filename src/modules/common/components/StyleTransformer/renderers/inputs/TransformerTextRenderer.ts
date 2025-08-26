import { StyleTransformer, StyleTransformerStatesConfig, StyleTransformerType } from 'typings/styleTransformer';
import { StyleTransformerRenderer } from './StyleTransformerRenderer';

export class TransformerTextRenderer {
	static renderStatesText(
		texts: { [key: string]: string | undefined },
		id: number,
		transformer: StyleTransformer,
		value: number,
		setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
	): string {
		let stateValue: string | null = null;

		const transformerConfig = transformer.config as StyleTransformerStatesConfig;

		if (transformerConfig && transformerConfig.states && transformerConfig.states.length > 0) {
			if ((transformer.pointType as string) === 'enum') {
				const currentValueState = transformerConfig.states.find(state => state.input === value);
				if (currentValueState) {
					stateValue = currentValueState.value || null;
				}
			} else if ((transformer.pointType as string) === 'numeric') {
				stateValue = StyleTransformerRenderer.getNumericValueOperatorResult<string>(transformerConfig, value);
			}

			if (stateValue !== null) {
				setActive(String(`${id}_${transformer.transformerId}`), stateValue);
				return stateValue;
			} else {
				setActive(String(`${id}_${transformer.transformerId}`), null);
				return texts[String(transformer.transformerId?.split('__')[1])] || '';
			}
		} else {
			setActive(String(`${id}_${transformer.transformerId}`), null);
			return texts[String(transformer.transformerId?.split('__')[1])] || '';
		}
	}

	public static getTransformerText(
		texts: { [key: string]: string | undefined },
		id: number,
		transformer: StyleTransformer,
		value: number,
		setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
	): string {
		const TEXT_TRANSFORMERS = {
			[StyleTransformerType.STATES]: TransformerTextRenderer.renderStatesText,
		};
		const textTransformer = (TEXT_TRANSFORMERS as any)[transformer.type as StyleTransformerType];
		const nextText = textTransformer(texts, id, transformer, value, setActive);

		return nextText;
	}
}
