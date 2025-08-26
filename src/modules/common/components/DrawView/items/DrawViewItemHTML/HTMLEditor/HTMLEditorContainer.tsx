import { EditingViewStateActions } from 'modules/common/components/DrawView/DrawViewEditor/editingState';
import { DrawViewItemHTMLComponentProps } from 'modules/common/components/DrawView/items/DrawViewItemHTML/DrawViewItemHTMLComponent';
import HTMLEditorDialog from 'modules/common/components/DrawView/items/DrawViewItemHTML/HTMLEditor/HTMLEditorDialog';
import * as React from 'react';
import { useState } from 'react';
import styles from './HTMLEditor.module.scss';

interface HTMLEditorContainerProps {
	item: DrawViewItemHTMLComponentProps;
	actions: EditingViewStateActions;
}

const HTMLEditorContainer: React.FC<HTMLEditorContainerProps> = ({ item, actions }) => {
	const [isOpen, setOpen] = useState<boolean>(false);

	const saveHandler = (html: string) => {
		const encodedHTML = JSON.stringify({ html });
		actions.updateItemParams(item.id, { html: encodedHTML });
		setOpen(false);
	};

	return (
		<>
			<a className={styles.link} onClick={() => setOpen(true)}>
				Edytuj kod
			</a>
			{isOpen && <HTMLEditorDialog open={isOpen} html={JSON.parse(item.html).html} onClose={() => setOpen(false)} onSave={saveHandler} />}
		</>
	);
};

export default HTMLEditorContainer;
