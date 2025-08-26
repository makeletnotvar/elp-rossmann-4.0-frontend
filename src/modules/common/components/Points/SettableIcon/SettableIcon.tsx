import { SettingsOutlined } from '@mui/icons-material';
import cn from 'classnames';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SettableIcon.module.scss';

interface SettableIconProps {
	settable?: boolean | undefined;
	settableRegister?: boolean | undefined;
	className?: string;
}

const SettableIcon: React.FC<SettableIconProps> = ({ settable = false, settableRegister = false, className }) => {
	const { t } = useTranslation();
	return (
		<span className={cn(styles.settableIcon, className)} title={t('general.settable')}>
			<SettingsOutlined className={cn(styles.icon, { [styles.active]: settable, [styles.register]: settableRegister })} />
		</span>
	);
};

export default SettableIcon;
