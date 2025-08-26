import { StyleTransformer, StyleTransformerStatesConfig, StyleTransformerType } from 'typings/styleTransformer';
import { StyleTransformerRenderer } from './StyleTransformerRenderer';

export class TransformerNumberRenderer {
	static renderStatesNumber(
		numbers: { [key: string]: number | undefined },
		id: number,
		transformer: StyleTransformer,
		value: number,
		setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
	): number {
		let stateValue: number | null = null;

		const transformerConfig = transformer.config as StyleTransformerStatesConfig;

		if (transformerConfig && transformerConfig.states && transformerConfig.states.length > 0) {
			if ((transformer.pointType as string) === 'enum') {
				const currentValueState = transformerConfig.states.find(state => state.input === value);
				if (currentValueState) {
					stateValue = Number(currentValueState.value) || null;
				}
			} else if ((transformer.pointType as string) === 'numeric') {
				stateValue = Number(StyleTransformerRenderer.getNumericValueOperatorResult<string>(transformerConfig, value));
			}

			if (stateValue !== null) {
				setActive(String(`${id}_${transformer.transformerId}`), stateValue);
				return Number(stateValue);
			} else {
				setActive(String(`${id}_${transformer.transformerId}`), null);
				return Number(numbers[String(transformer.transformerId?.split('__')[1])]) || -1;
			}
		} else {
			setActive(String(`${id}_${transformer.transformerId}`), null);
			return Number(numbers[String(transformer.transformerId?.split('__')[1])]) || -1;
		}
	}

	public static getTransformerNumber(
		numbers: { [key: string]: number | undefined },
		id: number,
		transformer: StyleTransformer,
		value: number,
		setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void
	): string {
		const NUMBER_TRANSFORMERS = {
			[StyleTransformerType.STATES]: TransformerNumberRenderer.renderStatesNumber,
		};
		const numberTransformer = (NUMBER_TRANSFORMERS as any)[transformer.type as StyleTransformerType];
		const nextNumber = numberTransformer(numbers, id, transformer, value, setActive);

		return nextNumber;
	}
}
