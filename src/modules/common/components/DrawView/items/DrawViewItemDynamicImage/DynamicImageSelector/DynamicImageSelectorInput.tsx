import * as React from 'react';
import styles from './DynamicImageSelectorInput.module.scss';

interface DynamicImageSelectorInputProps {
	isReady: boolean;
	count: number;
	onClick: () => void;
}

const DynamicImageSelectorInput: React.FC<DynamicImageSelectorInputProps> = ({ isReady, count, onClick }) => {
	return (
		<React.Fragment>
			{isReady ? (
				<span className={styles.link} onClick={onClick}>
					Obrazów: {count}
				</span>
			) : (
				<span className={styles.info}>Najpierw wybierz punkt</span>
			)}
		</React.Fragment>
	);
};

export default DynamicImageSelectorInput;
