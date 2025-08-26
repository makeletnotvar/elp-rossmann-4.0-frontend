import DataFooter from 'modules/data/components/DataLayout/DataFooter/DataFooter';
import * as React from 'react';
// const styles = require("./DataFooterContainer.scss");

interface DataFooterContainerProps {
	onOpen: () => void;
}

const DataFooterContainer: React.FC<DataFooterContainerProps> = ({ onOpen }) => {
	return <DataFooter onOpen={onOpen} />;
};

export default DataFooterContainer;
