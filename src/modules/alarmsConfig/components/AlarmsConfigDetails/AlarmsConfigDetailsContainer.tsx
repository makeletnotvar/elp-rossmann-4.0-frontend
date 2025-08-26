import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import AlarmsConfigDetails from './AlarmsConfigDetails';

interface AlarmsConfigDetailsContainerProps {
	onClose: () => void;
}

const AlarmsConfigDetailsContainer: React.FC<AlarmsConfigDetailsContainerProps> = ({ onClose }) => {
	return (
		<Switch>
			<Route exact path='/alarmsConfig/add' render={() => <AlarmsConfigDetails isNew onClose={onClose} />} />
			<Route exact path='/alarmsConfig/:code' render={() => <AlarmsConfigDetails onClose={onClose} />} />
		</Switch>
	);
};

export default AlarmsConfigDetailsContainer;
