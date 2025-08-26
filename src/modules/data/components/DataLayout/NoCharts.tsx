import { ArrowDownwardOutlined } from '@mui/icons-material';
import { Snackbar } from '@mui/material';
import LastChartsContainer from 'modules/data/components/LastCharts/LastChartsContainer';
import * as React from 'react';
import styles from './DataLayout.module.scss';

interface NoChartsProps {}

const NoCharts: React.FC<NoChartsProps> = () => {
	return (
		<>
			<LastChartsContainer />
			<Snackbar
				open={true}
				className={styles.snackbar}
				message={'Klknij aby wygenerować wykres'}
				action={<ArrowDownwardOutlined />}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			/>
		</>
	);
};

export default NoCharts;
