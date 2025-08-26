import * as React from "react";
import styles from "./BuildingData.module.scss";
import BuildingDataAC from "./BuildingDataAC/BuildingDataAC";
import BuildingDataAHU from "./BuildingDataAHU/BuildingDataAHU";
import BuildingDataCurtains from "./BuildingDataCurtains/BuildingDataCurtains";
import BuildingDataGeneral from "./BuildingDataGeneral/BuildingDataGeneral";
import { isExtendedACRequired, isFancoilsRequired, isHeatPumpsRequired } from "./buildingDataHelpers";
import BuildingDataMeters from "./BuildingDataMeters/BuildingDataMeters";
import BuildingDataSlides from "./BuildingDataSlides/BuildingDataSlides";

interface BuildingDataProps {
  building: Building;
}

const alarmClasses = {
  1: styles.alarmActive,
};

export const LazyBuildingDataHP = React.lazy(() => import("./BuildingDataHP/BuildingDataHP"));
export const LazyBuildingDataFC = React.lazy(() => import("./BuildingDataFC/BuildingDataFC"));

/**
 * Page shows all values related to buildings.
 *
 * Data flow in steps:
 * - open buildings details page
 *  - request buildings details (Building)
 *  - request builings points (Point)
 *  - starts points polling in background
 *
 * - open building data page (this page)
 *  - trying to get points related to all specified params (full view for repeat building)
 *  - ignore missing points and hide params
 *  - show and keep update params for existing points related to current building
 *
 *
 *
 */
const BuildingData: React.FC<BuildingDataProps> = ({ building }) => {
  const shouldRenderFancoils = isFancoilsRequired(building.code);
  const shouldRenderHeatPumps = isHeatPumpsRequired(building);
  const shouldRenderACExtended = isExtendedACRequired(building.code);

  return (
    <>
      <div className={styles.container} data-testid="building-data">
        <BuildingDataGeneral building={building} />
        <BuildingDataAHU building={building} />
        {shouldRenderFancoils && <LazyBuildingDataFC building={building} />}
        <BuildingDataAC building={building} extended={shouldRenderACExtended} />
        {/* Heat pumps rendered only in building where any points xid start with 'pc_' or 'hp_' */}
        {shouldRenderHeatPumps && <LazyBuildingDataHP building={building} />}
        <BuildingDataCurtains building={building} />
        <BuildingDataSlides building={building} />
        <BuildingDataMeters building={building} />
      </div>
    </>
  );
};

export default BuildingData;
