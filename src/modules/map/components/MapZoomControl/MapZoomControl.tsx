import { AddOutlined, RemoveOutlined, ZoomInOutlined } from '@mui/icons-material';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import React from 'react';
import styles from './MapZoomControl.module.scss';

interface MapZoomControlProps {
	mapZoomIn: (e: any) => void;
	mapZoomOut: (e: any) => void;
	zoom: number;
}

const MapZoomControl: React.FC<MapZoomControlProps> = ({ mapZoomIn, mapZoomOut, zoom }) => {
	return (
		<Paper className={styles.container} elevation={0}>
			<Box p={0.5} className={styles.content}>
				<IconButton className={styles.item} size='small' onClick={mapZoomIn}>
					<AddOutlined />
				</IconButton>
				<IconButton className={styles.item} size='small' onClick={mapZoomOut}>
					<RemoveOutlined />
				</IconButton>
				<Typography className={styles.itemZoom} style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
					<ZoomInOutlined style={{ fontSize: '1rem' }} />
					{((zoom / 15) * 100).toFixed(0)}%
				</Typography>
			</Box>
		</Paper>
	);
};

export default MapZoomControl;
