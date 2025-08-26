import { ClearOutlined } from '@mui/icons-material';
import { IconButton, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { MultistateState } from 'modules/common/components/Forms/MultistateEditor/MultistateEditor';
import React from 'react';
import styles from './MultistateEditor.module.scss';

interface MultistateStateEditorComponentProps {
	state: MultistateState;
	onRemove: () => void;
	onChange: (nextState: MultistateState) => void;
}

const MultistateStateEditorComponent: React.FC<MultistateStateEditorComponentProps> = ({ state, onRemove, onChange }) => {
	return (
		<ListItem className={styles.state}>
			<ListItemAvatar className={styles.action}>
				<IconButton onClick={onRemove} size='small'>
					<ClearOutlined />
				</IconButton>
			</ListItemAvatar>
			<ListItemText>
				<input
					type='number'
					value={state.key}
					min='0'
					max='9999'
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => onChange({ ...state, key: Number(evt.currentTarget.value) })}
					className={styles.key}
				/>
			</ListItemText>
			<ListItemText>
				<input
					type='text'
					value={state.value}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => onChange({ ...state, value: evt.currentTarget.value })}
					placeholder='value'
					className={styles.value}
				/>
			</ListItemText>
		</ListItem>
	);
};

export default MultistateStateEditorComponent;
