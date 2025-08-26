import { Typography } from '@mui/material';
import { Formik } from 'formik';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another
import React from 'react';
import Editor from 'react-simple-code-editor';
import { StyleTransformerInputType, StyleTransformer as StyleTransformerType } from 'typings/styleTransformer';
import styles from './TransformationTypeScript.module.scss';
const { highlight } = require('prismjs/components/prism-core');

interface TransformationTypeScriptProps {
	point: Point;
	inputType: StyleTransformerInputType;
	transformerEnumValues?: { key: string; value: string }[];
	values: StyleTransformerType;
	setFieldValue: {
		(
			field: 'transformerId' | 'pointRef' | 'type' | 'name' | 'config' | 'pointType' | 'active' | 'styleTransformerInputType',
			value: any,
			shouldValidate?: boolean | undefined
		): void;
		(field: string, value: any): void;
	};
}

const TransformationTypeScript: React.FC<TransformationTypeScriptProps> = () => {
	const submitHandler = () => {};

	return (
		<div className={styles.container}>
			<Typography variant='body1'>Transformacja skryptu: </Typography>
			<Formik initialValues={({ code: '' } as { code: string }) || {}} onSubmit={submitHandler}>
				{props => {
					const { values, handleSubmit, setFieldValue } = props;

					const updateScriptCode = (inputValue: string) => {
						setFieldValue('code', inputValue);
					};

					return (
						<form onSubmit={handleSubmit}>
							<div className={styles.stateContainer}>
								<Editor
									value={values.code}
									onValueChange={code => updateScriptCode(code)}
									highlight={code => highlight(code, Prism.languages.javascript)}
									padding={10}
									style={{
										fontFamily: '"Fira code", "Fira Mono", monospace',
										fontSize: 12,
										borderTop: '1px solid #ddd',
									}}
								/>
							</div>
						</form>
					);
				}}
			</Formik>
		</div>
	);
};

export default TransformationTypeScript;
