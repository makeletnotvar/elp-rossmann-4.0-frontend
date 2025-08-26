import DebugDialog from 'modules/common/debug/components/DebugDialog';
import * as React from 'react';
// const styles = require("./DebugContainer.scss");

export interface DebugContainerProps {
	open: boolean;
	onClose: () => void;
}

const DebugContainer: React.FC<DebugContainerProps> = ({ open, onClose }) => {
	return <DebugDialog open={open} onClose={onClose} />;
};

export default DebugContainer;
