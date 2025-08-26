import DevicesListContainer from 'modules/devices/components/DevicesList/DevicesListContainer';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styles from './DevicesLayout.module.scss';

interface DevicesLayoutProps {}

const DevicesLayout: React.FC<DevicesLayoutProps> = () => {
	return (
		<div className={styles.container}>
			<Switch>
				<Redirect exact from='/devices' to='/devices/list?o=0&s=20&d=asc&p=name' />
				<Route path='/devices/list' component={DevicesListContainer} />
			</Switch>
		</div>
	);
};

export default DevicesLayout;
