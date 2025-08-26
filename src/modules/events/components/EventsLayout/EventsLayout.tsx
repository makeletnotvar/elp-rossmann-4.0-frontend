import * as React from "react";
import { Route, Switch } from "react-router-dom";
import EventsListContainer from "../EventsList/EventsListContainer";

const EventsLayout: React.FC = () => {
  return (
    <Switch>
      <Route path="/events-v2/:uuid?" component={EventsListContainer} />
    </Switch>
  );
};

export default EventsLayout;
