import Content from 'modules/common/components/Layout/Content/Content';
import DataChartContainer from 'modules/data/components/DataCharts/DataChartContainer';
import BottomDrawer from 'modules/data/components/DataLayout/BottomDrawer';
import DataFooter from 'modules/data/components/DataLayout/DataFooter/DataFooter';
import React, { useState } from 'react';
import styles from './DataLayout.module.scss';

interface DataLayoutProps {}

const DataLayout: React.FC<DataLayoutProps> = () => {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<Content className={styles.container}>
			<BottomDrawer {...{ open, setOpen }} />
			<DataChartContainer />
			<DataFooter onOpen={() => setOpen(true)} />
		</Content>
	);
};

export default DataLayout;
