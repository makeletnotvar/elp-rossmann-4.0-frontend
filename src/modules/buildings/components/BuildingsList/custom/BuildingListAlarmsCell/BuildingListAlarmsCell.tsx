import { getBuildingEventsPath } from "modules/events/helpers/events";
import EventsV2ListItemPriorityCell from "modules/events_v2/components/EventsV2List/EventsV2ListItem/EventsV2ListItemPriorityCell";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface BuildingListAlarmsCellProps {
  count: number;
  maxPriority: EventPriority;
  buildingUUID: string;
  disabledLink?: boolean;
}

const BuildingListAlarmsCell: React.FC<BuildingListAlarmsCellProps> = ({ count, maxPriority, buildingUUID, disabledLink }) => {
  const { t } = useTranslation();

  const label = count.toString();
  const translatedMaxPriority = t(`events.params.priority_values.${maxPriority}`);
  const title = t(`events.messages.events_count_details`, { count, maxPriority: translatedMaxPriority });

  return !disabledLink ? (
    <Link to={getBuildingEventsPath(buildingUUID)} style={{ textDecoration: "none" }}>
      <EventsV2ListItemPriorityCell value={maxPriority} label={label} title={title} count={count} />
    </Link>
  ) : (
    <EventsV2ListItemPriorityCell disabledLink={disabledLink} value={maxPriority} label={label} title={title} count={count} />
  );
};

export default BuildingListAlarmsCell;
