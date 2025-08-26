import { Fab } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import cn from 'classnames';
import TagsParam from 'modules/common/components/Params/Tags/TagsParam';
import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import styles from './TagsEditor.module.scss';

interface TagsEditorProps {
	value: string[] | undefined;
	onChange: (nextValue: string[]) => void;
}

const TagsEditor: React.FC<TagsEditorProps> = ({ value, onChange }) => {
	const [text, setText] = useState<string>('');

	const deleteHandler = useCallback(
		(deletingTag: string) => {
			const nextValue = (value || []).filter(tag => tag !== deletingTag);
			onChange(nextValue);
		},
		[value]
	);

	const addHandler = useCallback(() => {
		if (text) {
			const nextValue = [...(value || []), text];
			onChange(nextValue);
			setText('');
		}
	}, [text, value]);

	const isValid = useMemo(() => {
		return !text.includes(' ');
	}, [text]);

	return (
		<TagsParam tags={value} deletable={true} onDelete={deleteHandler}>
			<div className={cn(styles.tagsEditor, { [styles.error]: !isValid })}>
				<input type='text' value={text} onChange={evt => setText(evt.currentTarget.value)} />
				<Fab variant='extended' size='small' color='primary' aria-label='add' className={styles.addButton} disabled={!text || !isValid} onClick={addHandler}>
					<AddOutlined />
				</Fab>
			</div>
		</TagsParam>
	);
};

export default TagsEditor;
