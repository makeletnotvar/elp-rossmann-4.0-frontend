import { Chip } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import styles from './TodoChip.module.scss';

interface TodoChipProps {
	label: string;
}

const TodoChip: React.FC<TodoChipProps> = ({ label }) => {
	const [open, setOpen] = useState(true);

	return <>{open && <Chip className={styles.chip} label={label} onClick={() => setOpen(false)} color='primary' size='medium' />}</>;
};

export default TodoChip;
