import { StyleTransformerInputType } from 'typings/styleTransformer';
import TransformationTypeComponentColor from './TransformationTypeComponentColor';
import TransformationTypeComponentEnum from './TransformationTypeComponentEnum';
import TransformationTypeComponentNumber from './TransformationTypeComponentNumber';
import TransformationTypeComponentText from './TransformationTypeComponentText';

export const StyleTransformerInput = {
	[StyleTransformerInputType.COLOR]: TransformationTypeComponentColor,
	[StyleTransformerInputType.ENUM]: TransformationTypeComponentEnum,
	[StyleTransformerInputType.NUMBER]: TransformationTypeComponentNumber,
	[StyleTransformerInputType.TEXT]: TransformationTypeComponentText,
};
