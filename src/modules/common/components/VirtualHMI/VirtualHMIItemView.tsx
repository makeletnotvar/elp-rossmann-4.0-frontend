import React from 'react';
import styles from './VirtualHMI.module.scss';

interface VirtualHMIItemViewProps {
	children: React.ReactNode;
}

const VirtualHMIItemView: React.FC<VirtualHMIItemViewProps> = ({ children }) => {
	return (
		<>
			{/* <div
				style={{
					display: isLoading ? 'flex' : 'none',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					width: '100%',
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					backgroundColor: 'rgba(0, 0, 0, 0.05)',
					zIndex: 9999,
				}}
			>
				<Loader />
			</div> */}
			<div className={styles.vhmiContainer}>{children}</div>
		</>
	);
};

export default VirtualHMIItemView;
