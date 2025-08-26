import BuildingMenuEventsIcon from 'modules/building/components/BuildingLayout/BuildingMenu/BuildingMenuEventsIcons/BuildingMenuEventsIcon';
import { useBuildingState } from 'modules/building/redux/building';
import * as React from 'react';
// const styles = require("./BuildingMenuEventsIcon.scss");

interface BuildingMenuEventsIconContainerProps {
	active: boolean;
	onClick: () => void;
}

const BuildingMenuEventsIconContainer: React.FC<BuildingMenuEventsIconContainerProps> = ({ active, onClick }) => {
	const { building } = useBuildingState();

	return building && <BuildingMenuEventsIcon active={active} building={building} onClick={onClick} />;
};

export default BuildingMenuEventsIconContainer;
