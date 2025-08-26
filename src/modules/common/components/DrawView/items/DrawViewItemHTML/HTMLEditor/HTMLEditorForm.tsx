import { Box } from '@mui/material';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import { HTMLEditorDialogProps } from 'modules/common/components/DrawView/items/DrawViewItemHTML/HTMLEditor/HTMLEditorDialog';
import HTMLEditorPreview from 'modules/common/components/DrawView/items/DrawViewItemHTML/HTMLEditor/HTMLEditorPreview';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another
import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import styles from './HTMLEditor.module.scss';

const { highlight } = require('prismjs/components/prism-core');

interface HTMLEditorFormProps extends Pick<HTMLEditorDialogProps, 'html' | 'onClose' | 'onSave'> {}

const HTMLEditorForm: React.FC<HTMLEditorFormProps> = ({ html, onClose, onSave }) => {
	const [code, setCode] = useState<string>(html);

	React.useEffect(() => {
		setCode(html);
	}, [html]);

	return (
		<>
			<Box className={styles.wrapper}>
				<Box className={styles.editorContainer}>
					<label className={styles.label}>Kod</label>
					<Editor
						value={code}
						onValueChange={code => setCode(code)}
						highlight={code => highlight(code, Prism.languages.html)}
						padding={10}
						style={{
							fontFamily: '"Fira code", "Fira Mono", monospace',
							fontSize: 12,
							borderTop: '1px solid #ddd',
						}}
						textareaClassName={styles.textArea}
					/>
				</Box>
				<Box className={styles.previewContainer}>
					<HTMLEditorPreview setError={() => {}} code={code} />
				</Box>
			</Box>
			<Box mt={2} display='flex' justifyContent='center'>
				<ConfirmButton onClick={() => onSave(code)}>Zapisz</ConfirmButton>
			</Box>
		</>
	);
};

export default HTMLEditorForm;
