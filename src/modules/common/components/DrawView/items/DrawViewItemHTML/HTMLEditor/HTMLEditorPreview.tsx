import useValidatedHTML from 'modules/common/components/DrawView/items/DrawViewItemHTML/hooks/useHTMLValidation';
import * as React from 'react';
import { useEffect } from 'react';
import styles from './HTMLEditorPreview.module.scss';

interface HTMLEditorPreviewProps {
	code: string;
	setError: (message: string | null) => void;
}

const HTMLEditorPreview: React.FC<HTMLEditorPreviewProps> = ({ code, setError }) => {
	const error: string | null = useValidatedHTML(code);

	const htmlContent = {
		__html: code,
	};

	useEffect(() => {
		setError(error);
	}, [error]);

	return (
		<>
			<label className={styles.label}>Podgląd</label>
			<div className={styles.previewWrapper}>
				<div className={styles.preview}>
					{error ? <label className={styles.error}>{error}</label> : <div dangerouslySetInnerHTML={htmlContent} />}
				</div>
			</div>
		</>
	);
};

export default HTMLEditorPreview;
