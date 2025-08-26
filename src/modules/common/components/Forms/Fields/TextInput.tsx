import { FormControl } from '@mui/material';
import * as React from 'react';
// const styles = require("./TextInput.scss");

interface TextInputProps {}

// Use for FORMIK
const TextInput: React.FC<TextInputProps> = () => {
	return (
		<FormControl>
			<div>TextInput</div>
		</FormControl>
	);
};

export default TextInput;
