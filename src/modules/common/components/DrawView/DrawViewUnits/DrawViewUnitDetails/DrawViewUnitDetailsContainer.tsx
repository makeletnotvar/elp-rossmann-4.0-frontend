import * as React from 'react';
import DrawViewUnitDetails from './DrawViewUnitDetails';
// import "./DrawViewUnitDetailsContainer.scss";

interface DrawViewUnitDetailsContainerProps {
	unit: Unit;
}

const DrawViewUnitDetailsContainer: React.FC<DrawViewUnitDetailsContainerProps> = ({ unit }) => {
	return (
		<>
			<DrawViewUnitDetails unit={unit} />
		</>
	);
};

export default DrawViewUnitDetailsContainer;
