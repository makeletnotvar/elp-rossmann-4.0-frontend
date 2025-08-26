import ACParamsGroup from "modules/building/components/BuildingTabs/BuildingData/BuildingDataAC/ACParamsGroups";
import Params from "modules/common/components/Params/Params";
import * as React from "react";
import { useTranslation } from "react-i18next";

interface BuildingDataACProps {
  building: Building;
  extended: boolean;
}

export const LazyBuildingDataACExtended = React.lazy(() => import("./BuildingDataACExtended"));

const BuildingDataAC: React.FC<BuildingDataACProps> = ({ building, extended }) => {
  const { t } = useTranslation();

  return (
    <Params wrapperStyle={{ paddingLeft: "21px" }} title={t("project.ac")} hideCount>
      <ACParamsGroup title={`${t("project.cash_area")}`} xidRef="c" building={building} />
      <ACParamsGroup title={`${t("project.cash_area")} 2`} xidRef="c2" building={building} />
      <ACParamsGroup title={`${t("project.cash_witr")}`} xidRef="witr_c" building={building} />
      <ACParamsGroup title={`${t("project.cash_witr")} 2`} xidRef="witr_c2" building={building} />
      <ACParamsGroup title={`${t("project.area_number")} 1`} xidRef="s1" building={building} />
      <ACParamsGroup title={`${t("project.area_number")} 2`} xidRef="s2" building={building} />
      <ACParamsGroup title={`${t("project.area_number")} 3`} xidRef="s3" building={building} />
      <ACParamsGroup title={`${t("project.area_number")} 4`} xidRef="s4" building={building} />
      <ACParamsGroup title={`${t("project.area_number")} 5`} xidRef="s5" building={building} />
      <ACParamsGroup title={`${t("project.area_number")} 6`} xidRef="s6" building={building} />
      <ACParamsGroup title={`${t("project.witr_area")} 1`} xidRef="witr_s1" building={building} />
      <ACParamsGroup title={`${t("project.witr_area")} 2`} xidRef="witr_s2" building={building} />
      <ACParamsGroup title={`${t("project.witr_area")} 3`} xidRef="witr_s3" building={building} />
      <ACParamsGroup title={`${t("project.witr_area")} 4`} xidRef="witr_s4" building={building} />
      <ACParamsGroup title={`${t("project.witr_area")} 5`} xidRef="witr_s5" building={building} />
      <ACParamsGroup title={`${t("project.witr_area")} 6`} xidRef="witr_s6" building={building} />
      <ACParamsGroup title={`${t("project.area_number")} 7`} xidRef="s7" building={building} />
      <ACParamsGroup title={`${t("project.area_number")} 8`} xidRef="s8" building={building} />
      <ACParamsGroup title={`${t("project.area_number")} 9`} xidRef="s9" building={building} />
      <ACParamsGroup title={`${t("project.area_number")} 10`} xidRef="s10" building={building} />
      <ACParamsGroup title={`${t("project.area_number")} 10`} xidRef="s10" building={building} />
      <ACParamsGroup title={`${t("project.area_number")}`} xidRef="og_s1" building={building} />
      <ACParamsGroup title={`${t("project.area_number")} 2`} xidRef="og_s2" building={building} />
      {/* {extended && <LazyBuildingDataACExtended building={building} />} */}
      <ACParamsGroup title={`${t("project.backroom")}`} xidRef="z" building={building} />
      <ACParamsGroup title={`${t("project.backroom")} 2`} xidRef="z2" building={building} />
      <ACParamsGroup title={`${t("project.billing_room")}`} xidRef="r" building={building} />
      <ACParamsGroup title={`${t("project.billing_room")}`} xidRef="pr" building={building} />
      <ACParamsGroup title={`${t("project.warehouse")}`} xidRef="mag" building={building} />
      <ACParamsGroup title={`${t("project.warehouse")}`} xidRef="m" building={building} />
      <ACParamsGroup title={`${t("project.social_room")}`} xidRef="soc" building={building} />
      <ACParamsGroup title={`${t("project.communication_room")}`} xidRef="kom" building={building} />
    </Params>
  );
};

export default BuildingDataAC;
