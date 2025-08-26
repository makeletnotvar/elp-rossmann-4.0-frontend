import { StyleTransformerOperator } from 'typings/styleTransformer';

export const OPERATORS_FUNCTIONS = {
	[StyleTransformerOperator.EQUAL]: (input: number, value: number): boolean => input === value,
	[StyleTransformerOperator.GREATER]: (input: number, value: number): boolean => value > input,
	[StyleTransformerOperator.GREATER_EQUAL]: (input: number, value: number): boolean => value >= input,
	[StyleTransformerOperator.LOWER]: (input: number, value: number): boolean => value < input,
	[StyleTransformerOperator.LOWER_EQUAL]: (input: number, value: number): boolean => value <= input,
};
