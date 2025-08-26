import BuildingMenuEventsIconView from 'modules/building/components/BuildingLayout/BuildingMenu/BuildingMenuEventsIcons/BuildingMenuEventsIconView';
import { getEventsPriorityName } from 'modules/events_v2/helpers/eventsV2';
import * as React from 'react';
// const styles = require("./BuildingMenuEventsIcon.scss");

interface BuildingMenuEventsIconProps {
	building: Building;
	onClick: (uuid: string) => void;
	active: boolean;
}

const useBuildingEventsIconData = (building: Building) => {
	// Handling alarms count and max priority async

	// const alarmsCount = usePointValue(building.alarmsCount || null);
	// const alarmsMaxPriority = usePointValue(building.alarmsMaxPriority || null);

	// const alarmsCountValue = alarmsCount ? alarmsCount.value : null;
	// const alarmsMaxPriorityValue = alarmsMaxPriority ? alarmsMaxPriority.value : null;

	const alarmsCountValue = Number(building.alarmsCount);
	const buildingMaxPriority: number = building ? Number(building.alarmsMaxPriority) || 0 : 0;
	const alarmsMaxPriorityValueString = getEventsPriorityName(buildingMaxPriority);

	return {
		alarmsCountValue,
		alarmsMaxPriorityValueString,
	};
};

const BuildingMenuEventsIcon: React.FC<BuildingMenuEventsIconProps> = ({ active, building, onClick }) => {
	const { alarmsCountValue, alarmsMaxPriorityValueString } = useBuildingEventsIconData(building);

	return (
		<BuildingMenuEventsIconView
			onClick={() => building.uuid && onClick(building.uuid)}
			alarmsCount={alarmsCountValue || 0}
			alarmsMaxPriority={alarmsMaxPriorityValueString || 'NONE'}
			active={active}
		/>
	);
};

export default BuildingMenuEventsIcon;
