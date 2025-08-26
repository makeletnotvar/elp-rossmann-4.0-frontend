import { createUrl } from "api/helpers";

export const pollAPI = {
  getPoll: () => createUrl(`/poll`),
  setpoint: () => createUrl(`/poll/setpoint`),
};

export default pollAPI;
