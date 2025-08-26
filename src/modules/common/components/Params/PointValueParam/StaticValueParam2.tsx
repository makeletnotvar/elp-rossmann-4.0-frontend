import { Box, Paper, Tooltip, Typography, useMediaQuery } from '@mui/material';
import classNames from 'classnames';
import { theme } from 'modules/common/theme/materialTheme';
import React, { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { CustomIcon } from '../../CustomIcon/CustomIcon';
import styles from './StaticValueParam2.module.scss';

interface StaticValueParam2Props {
	value?: string;
	label?: string;
	title?: string;
	link?: string;
	icon?: string;
	style?: CSSProperties;
	custom?: React.ReactNode;
	className?: string;
}

const StaticValueParam2: React.FC<StaticValueParam2Props> = ({ label, value, link, icon, title, style, custom, className }) => {
	const isMobileSize = useMediaQuery(theme.breakpoints.down('xs'));

	return (
		<Paper className={classNames(styles.paper, className, { [styles.mobile]: isMobileSize })} style={style} elevation={0} square>
			<Box className={styles.topRow}>
				<Box className={styles.labelBox}>
					<CustomIcon name={icon} style={{ fontSize: '0.75rem', marginTop: '-1px' }} />
					<Tooltip title={label || 'Parametr'} placement='top'>
						<Typography className={styles.labelText}>{label || 'Parametr'}</Typography>
					</Tooltip>
				</Box>
			</Box>
			<Box className={styles.valueRow}>
				<Tooltip title={title || ''}>
					<Typography className={styles.valueText}>
						{link ? (
							<Link to={link} className={styles.link}>
								{value}
							</Link>
						) : custom ? (
							custom
						) : (
							value
						)}
					</Typography>
				</Tooltip>
			</Box>
		</Paper>
	);
};

export default StaticValueParam2;
