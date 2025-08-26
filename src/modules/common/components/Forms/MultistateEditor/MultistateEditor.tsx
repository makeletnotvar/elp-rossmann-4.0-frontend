import { AddOutlined } from '@mui/icons-material';
import { IconButton, List, ListSubheader } from '@mui/material';
import { arrayStatesToObject, useMultistateEditor } from 'modules/common/components/Forms/MultistateEditor/MultistateEditorHooks';
import MultistateStateEditorComponent from 'modules/common/components/Forms/MultistateEditor/MultistateStateEditorComponent';
import * as React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MultistateEditor.module.scss';

export interface MultistateValue {
	[key: number]: string;
}

export type MultistateState = { key: number; value: string };
export type MultistateStates = MultistateState[];

interface MultistateEditorProps {
	value: MultistateValue;
	onChange: (nextValue: MultistateValue) => void;
}

const MultistateEditor: React.FC<MultistateEditorProps> = ({ value, onChange }) => {
	const { t } = useTranslation();
	const { states } = useMultistateEditor(value);

	const removeHandler = useCallback(
		(index: number) => {
			const nextStates = states.filter((state, i) => i !== index);
			onChange(arrayStatesToObject(nextStates));
		},
		[states]
	);

	const changeHandler = useCallback(
		(index: number) => (state: { key: number; value: string }) => {
			const nextStates = [...states];
			nextStates[index] = state;
			const objectStates = arrayStatesToObject(nextStates);
			onChange(objectStates);
		},
		[states]
	);

	const addHandler = useCallback(() => {
		const maxKey = Math.max(...states.map(s => s.key));
		const nextKey = isFinite(maxKey) ? maxKey + 1 : 1;
		const nextStates = [...states, { key: maxKey + 1, value: `Stan ${nextKey}` }];
		const objectStates = arrayStatesToObject(nextStates);
		onChange(objectStates);
	}, [states]);

	return (
		<div>
			<List
				className={styles.states}
				subheader={
					<ListSubheader className={styles.header}>
						<label>
							{t('general.states')} ({states.length})
						</label>
						<IconButton size='small' onClick={addHandler}>
							<AddOutlined />
						</IconButton>
					</ListSubheader>
				}
			>
				{states.map((state, index) => (
					<MultistateStateEditorComponent key={index} state={state} onRemove={() => removeHandler(index)} onChange={changeHandler(index)} />
				))}
			</List>
		</div>
	);
};

export default MultistateEditor;
