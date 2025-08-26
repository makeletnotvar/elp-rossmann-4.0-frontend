import * as React from 'react';
import styles from './DrawViewEditorItemWrapper.module.scss';

interface ResizeWrapperProps {}

const ResizeWrapper: React.FC<ResizeWrapperProps> = () => {
	return <div data-resize className={styles.resize} />;
};

export default ResizeWrapper;
