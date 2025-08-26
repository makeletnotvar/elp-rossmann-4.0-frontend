import { CSSProperties } from 'react';

export interface StyleTransformerBase {
	transformerId?: string; //@TODO CSSPropertyName
	pointRef?: PointReference | null;
	pointType?: PointType | null;
	active?: boolean;
	name?: string;
	styleTransformerInputType?: StyleTransformerInputType;
	type?: StyleTransformerType;
}
interface StyleTransformerStates extends StyleTransformerBase {
	type: StyleTransformerType.STATES;
	config: StyleTransformerStatesConfig;
}

interface StyleTransformerTransition extends StyleTransformerBase {
	type: StyleTransformerType.TRANSITION;
	config: StyleTransformerTransitionConfig;
}

interface StyleTransformerScript extends StyleTransformerBase {
	type: StyleTransformerType.SCRIPT;
	config: StyleTransformerScriptConfig;
}

export type StyleTransformer = StyleTransformerStates | StyleTransformerTransition | StyleTransformerScript;

export interface StyleTransformerStatesConfig {
	states: StyleTransformerConfigState[];
}
export interface StyleTransformerTransitionConfig {
	start: StyleTransformerConfigTransition;
	end: StyleTransformerConfigTransition;
}
export interface StyleTransformerScriptConfig {
	script: string;
}

export interface StyleTransformerConfigState {
	input: number;
	operator?: StyleTransformerOperator;
	value: string | undefined;
}

export interface StyleTransformerConfigTransition {
	input: number;
	value: string | undefined;
}

export enum StyleTransformerInputType {
	COLOR = 'COLOR',
	TEXT = 'TEXT',
	NUMBER = 'NUMBER',
	ENUM = 'ENUM',
}

export enum StyleTransformerType {
	STATES = 'STATES',
	TRANSITION = 'TRANSITION',
	SCRIPT = 'SCRIPT',
}

export enum StyleTransformerOperator {
	EQUAL = 'EQUAL',
	GREATER = 'GREATER',
	GREATER_EQUAL = 'GREATER_EQUAL',
	LOWER = 'LOWER',
	LOWER_EQUAL = 'LOWER_EQUAL',
}

export type CSSPropertiesWithCustomParams = CSSProperties & { [key: string]: string | number | null };
