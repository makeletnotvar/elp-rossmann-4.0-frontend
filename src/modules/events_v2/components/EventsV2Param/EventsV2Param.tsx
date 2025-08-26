import { InfoOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import cn from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './EventsV2Param.module.scss';

interface EventsV2ParamProps {
	label: string;
	value?: string | number | null;
	secondValue?: string | number | null;
	unitValue?: string;
	secondUnitValue?: string;
	details?: string | number;
	link?: string;
	fullWidth?: boolean;
}

const EventsV2Param: React.FC<EventsV2ParamProps> = ({ label, link, value, unitValue, details, secondValue, secondUnitValue, fullWidth }) => {
	return (
		<div className={cn(styles.instanceParam, { [styles.fullWidth]: fullWidth })}>
			<Tooltip title={label}>
				<span className={styles.title}>{label}</span>
			</Tooltip>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3px', height: '18px' }}>
				{link ? (
					<Link to={link} className={cn(styles.value, styles.link, { [styles.fullWidth]: fullWidth })}>
						{value}
					</Link>
				) : (
					<span className={cn(styles.value, { [styles.fullWidth]: fullWidth })}>{value}</span>
				)}
				{unitValue && (value || value === 0) && <span className={styles.unitValue}>{unitValue}</span>}
				{secondValue && (
					<>
						<span className={styles.value}>{secondValue}</span>
						{secondUnitValue && (secondValue || secondValue === 0) && <span className={styles.unitValue}>{secondUnitValue}</span>}
					</>
				)}
				{details && (
					<Tooltip title={details}>
						<IconButton color='primary' size='small'>
							<InfoOutlined style={{ fontSize: '0.813rem' }} fontSize='inherit' />
						</IconButton>
					</Tooltip>
				)}
			</div>
		</div>
	);
};

export default EventsV2Param;
