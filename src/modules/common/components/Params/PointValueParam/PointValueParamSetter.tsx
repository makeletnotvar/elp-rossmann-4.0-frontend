import { CheckOutlined, CloseOutlined } from '@mui/icons-material';
import { Box, CircularProgress, IconButton } from '@mui/material';
import Setter from 'modules/common/components/Params/Setters/Setter';
import * as React from 'react';
import { useState } from 'react';
import styles from './PointValueParam.module.scss';

interface PointValueParamSetterProps {
	point: Point;
	value: number;
	fetching: boolean;
	onSave: (nextValue: number) => void;
	onCancel: () => void;
	format?: 'hour';
}

const PointValueParamSetter: React.FC<PointValueParamSetterProps> = ({ point, value, fetching, onSave, onCancel, format }) => {
	const [editorValue, setEditorValue] = useState<number>(value);

	return (
		<div className={styles.container}>
			<Setter
				{...{
					point,
					format,
					value: editorValue,
					onChange: setEditorValue,
					disabled: fetching,
				}}
			/>
			{fetching ? <FacebookProgress /> : <SetterActions onCancel={onCancel} onSave={() => onSave(editorValue)} />}
		</div>
	);
};

function SetterActions(props: any) {
	const { onCancel, onSave } = props;
	return (
		<div className={styles.actions}>
			<IconButton onClick={onCancel} size='small'>
				<CloseOutlined fontSize='inherit' className={styles.cancelIcon} />
			</IconButton>
			<IconButton onClick={onSave} size='small'>
				<CheckOutlined fontSize='inherit' className={styles.confirmIcon} />
			</IconButton>
		</div>
	);
}

function FacebookProgress() {
	return (
		<Box sx={{ position: 'relative', marginLeft: 1 }}>
			<CircularProgress variant='determinate' value={100} size={24} thickness={4} sx={{ color: '#eef3fd' }} />
			<CircularProgress
				variant='indeterminate'
				disableShrink
				size={24}
				thickness={4}
				sx={{
					color: '#6798e5',
					position: 'absolute',
					left: 0,
					top: 0,
					animationDuration: '550ms',
				}}
			/>
		</Box>
	);
}

export default PointValueParamSetter;
