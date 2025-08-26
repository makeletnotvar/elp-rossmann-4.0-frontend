// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import { DynamicModuleLoader } from "redux-dynamic-modules";
import EventsV2AppView from "./EventsV2AppView";
import { getAlarmsBlocksModule, getEventV2HeatmapsModule, getEventV2HistoryModule, getEventV2InstanceModule, getEventsV2Module } from "./redux/index";

const EventsV2App: React.FC = () => {
  return (
    <DynamicModuleLoader modules={[getEventsV2Module(), getAlarmsBlocksModule(), getEventV2InstanceModule(), getEventV2HistoryModule(), getEventV2HeatmapsModule()]}>
      <EventsV2AppView />
    </DynamicModuleLoader>
  );
};

export default EventsV2App;
