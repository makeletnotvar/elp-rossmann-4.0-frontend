import { ArchiveOutlined } from '@mui/icons-material';
import cn from 'classnames';
import * as React from 'react';
import styles from './ArchiveIcon.module.scss';

interface ArchiveIconProps {
	archive: boolean;
	isSuggested: boolean;
}

const ArchiveIcon: React.FC<ArchiveIconProps> = ({ archive, isSuggested }) => {
	let title: string = `Archive: ${archive ? 'on' : 'off'}`;

	if (isSuggested) {
		title = 'Archive should be enabled!';
	}

	return (
		<span className={styles.archiveIcon} title={title}>
			<ArchiveOutlined className={cn(styles.icon, { [styles.active]: archive, [styles.suggested]: !archive && isSuggested })} />
		</span>
	);
};

export default ArchiveIcon;
