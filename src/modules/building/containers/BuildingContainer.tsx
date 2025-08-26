import BuildingLayout from "modules/building/components/BuildingLayout/BuildingLayout";
import { useBuilding, useBuildingPoints } from "modules/building/containers/BuildingContainerHooks";
import { Route, Switch } from "react-router-dom";
import useRouter from "use-react-router";

const BuildingContainer = () => {
  const {
    match: {
      params: { uuid },
    },
  } = useRouter<{ uuid: string }>();
  const { building } = useBuilding(uuid);
  useBuildingPoints();

  return (
    <Switch>
      <Route path="/building/:uuid/:tab?" render={() => <BuildingLayout building={building || undefined} />} />
    </Switch>
  );
};

export default BuildingContainer;
