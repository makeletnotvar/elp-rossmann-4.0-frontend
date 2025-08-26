import HPParamsGroup from "modules/building/components/BuildingTabs/BuildingData/BuildingDataHP/HPParamsGroup";
import Params from "modules/common/components/Params/Params";
import * as React from "react";
import { useTranslation } from "react-i18next";

interface BuildingDataHPProps {
  building: Building;
}

const BuildingDataHP: React.FC<BuildingDataHPProps> = ({ building }) => {
  const { t } = useTranslation();

  /**
   * Jeżeli jest pc_slv2 to pc_s2 wyświetlamy jako Master
   * pc_slv2
   *
   */

  const isSlaveExists = (index: string | number) => {
    const isExists = Object.keys(building.pointsXidsRefs || {}).findIndex((xid) => xid === `pc_slv${index}_com`) > 1;
    return isExists;
  };

  return (
    <Params title={t("project.heatpumps")} hideCount>
      <HPParamsGroup building={building} xidRef="c" title={`${t("project.cash_area")} ${isSlaveExists("c") ? " - master " : ""}`} />
      <HPParamsGroup building={building} xidRef="slvc" title={`${t("project.cash_area")} - slave`} />
      <HPParamsGroup building={building} xidRef="s2" title={`${t("project.area_number")} ${isSlaveExists(2) ? " - master " : ""} 2`} />
      <HPParamsGroup building={building} xidRef="slv2" title={`${t("project.area_number")} - slave 2`} />
      <HPParamsGroup building={building} xidRef="s3" title={`${t("project.area_number")} ${isSlaveExists(3) ? " - master " : ""} 3`} />
      <HPParamsGroup building={building} xidRef="slv3" title={`${t("project.area_number")} - slave 3`} />
      <HPParamsGroup building={building} xidRef="s4" title={`${t("project.area_number")} ${isSlaveExists(4) ? " - master " : ""} 4`} />
      <HPParamsGroup building={building} xidRef="slv4" title={`${t("project.area_number")} - slave 4`} />
      <HPParamsGroup building={building} xidRef="s5" title={`${t("project.area_number")} ${isSlaveExists(5) ? " - master " : ""} 5`} />
      <HPParamsGroup building={building} xidRef="slv5" title={`${t("project.area_number")} - slave 5`} />
      <HPParamsGroup building={building} xidRef="s6" title={`${t("project.area_number")} ${isSlaveExists(6) ? " - master " : ""} 6`} />
      <HPParamsGroup building={building} xidRef="slv6" title={`${t("project.area_number")} - slave 6`} />
      <HPParamsGroup building={building} xidRef="s7" title={`${t("project.area_number")} ${isSlaveExists(7) ? " - master " : ""} 7`} />
      <HPParamsGroup building={building} xidRef="slv7" title={`${t("project.area_number")} - slave 7`} />
      <HPParamsGroup building={building} xidRef="s8" title={`${t("project.area_number")} ${isSlaveExists(8) ? " - master " : ""} 8`} />
      <HPParamsGroup building={building} xidRef="slv8" title={`${t("project.area_number")} - slave 8`} />
      <HPParamsGroup building={building} xidRef="s9" title={`${t("project.area_number")} ${isSlaveExists(9) ? " - master " : ""} 9`} />
      <HPParamsGroup building={building} xidRef="slv9" title={`${t("project.area_number")} - slave 9`} />
      <HPParamsGroup building={building} xidRef="z" title={`${t("project.backroom")} ${isSlaveExists("z") ? " - master " : ""}`} />
      <HPParamsGroup building={building} xidRef="slvz" title={`${t("project.backroom")} - slave`} />
      <HPParamsGroup building={building} xidRef="m" title={`${t("project.warehouse")} ${isSlaveExists("m") ? " - master " : ""}`} />
      <HPParamsGroup building={building} xidRef="slvm" title={`${t("project.warehouse")} - slave`} />
    </Params>
  );
};

export default BuildingDataHP;
