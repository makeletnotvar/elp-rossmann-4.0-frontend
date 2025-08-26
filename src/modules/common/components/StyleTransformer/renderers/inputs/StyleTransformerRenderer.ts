import { StyleTransformerOperator, StyleTransformerStatesConfig } from 'typings/styleTransformer';
import { OPERATORS_FUNCTIONS } from './StyleTransformerOperatorsFunctions';

export class StyleTransformerRenderer {
	public static getNumericValueOperatorResult<T = any>(config: StyleTransformerStatesConfig, value: number): T | null {
		const currentValueState = config.states.find(state => {
			const operator = state.operator as StyleTransformerOperator;
			const operatorFunction = OPERATORS_FUNCTIONS[operator];
			const operatorResult = operatorFunction(Number(state.input), value);
			return operatorResult;
		});

		if (currentValueState) {
			return (currentValueState.value as T) || null;
		} else {
			return null;
		}
	}
}
