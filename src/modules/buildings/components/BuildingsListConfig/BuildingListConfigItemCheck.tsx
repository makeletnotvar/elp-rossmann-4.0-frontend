import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingsListConfig.module.scss';

interface BuildingListConfigItemCheckProps {
	label: string;
	checked: boolean;
	disabled?: boolean;
	onChange: (evt: any) => void;
	hidden?: boolean;
}

const BuildingListConfigItemCheck: React.FC<BuildingListConfigItemCheckProps> = ({ label, disabled, checked, onChange, hidden }) => {
	const { t } = useTranslation();

	return (
		<FormControl className={cn(styles.param, { [styles.hidden]: hidden })}>
			<FormControlLabel control={<Checkbox checked={checked} disabled={disabled} color='primary' onChange={onChange} />} label={t(label)} />
		</FormControl>
	);
};

export default BuildingListConfigItemCheck;
