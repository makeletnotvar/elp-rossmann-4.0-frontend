import { Slider } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import styles from './DrawView.module.scss';

interface DrawViewZoomProps {
	zoom: number;
	onReset: () => void;
	onSlider: (value: number) => void;
	setShow: (show: boolean) => void;
	setMouseEntered: (mouseEntered: boolean) => void;
}

const CustomSlider = styled(Slider)(() => ({
	color: '#205de0',
	height: 3,
	padding: '13px 0',

	'& .MuiSlider-track': {
		height: 3,
		borderRadius: 2,
	},

	'& .MuiSlider-thumb': {
		height: 15,
		width: 15,
		backgroundColor: '#fff',
		border: '1px solid currentColor',
		marginTop: -6,
		marginLeft: -8,
		boxShadow: 'none',
		color: '#fff',
		'&:focus, &:hover, &:active': {
			boxShadow: 'none',
		},
	},
}));

const DrawViewZoom: React.FC<DrawViewZoomProps> = ({ zoom, onReset, onSlider, setShow, setMouseEntered }) => {
	return (
		<div
			className={styles.zoomContainer}
			onMouseEnter={() => {
				setMouseEntered(true);
				setShow(true);
			}}
			onMouseLeave={() => {
				setMouseEntered(false);
				setShow(false);
			}}
		>
			<div className={styles.zoom}>
				<CustomSlider min={10} max={300} value={Number((zoom * 100).toFixed(0))} onChange={(_, value) => onSlider(value as number)} />
				<div className={styles.zoomInfo}>
					<label>
						ZOOM <strong>{(zoom * 100).toFixed(0)}%</strong>
					</label>
					<a onClick={onReset}>Reset</a>
				</div>
			</div>
		</div>
	);
};

export default DrawViewZoom;
