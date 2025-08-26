import FCParamsGroup from "modules/building/components/BuildingTabs/BuildingData/BuildingDataFC/FCParamsGroups";
import Params from "modules/common/components/Params/Params";
import * as React from "react";
import { useTranslation } from "react-i18next";

interface BuildingDataFCProps {
  building: Building;
}

const FANCOILS_MAX_NUMBER = 20;
const FANCOILS_WITR_MAX_NUMBER = 6;

const BuildingDataFC: React.FC<BuildingDataFCProps> = ({ building }) => {
  const { t } = useTranslation();

  return (
    <Params title={t("project.fancoils")} hideCount data-testid="fc-group">
      <FCParamsGroup xidPrefix={`fc_c`} building={building} title={t("project.cash_area")} />
      <FCParamsGroup xidPrefix={`fc_c2`} building={building} title={`${t("project.cash_area")} 2`} />
      {Array.from({ length: FANCOILS_MAX_NUMBER }, (_, i) => i + 1).map((index) => {
        return <FCParamsGroup key={index} xidPrefix={`fc_s${index}`} building={building} title={`${t("project.area_number")} ${index}`} />;
      })}
      <FCParamsGroup xidPrefix={`fc_witr_c`} building={building} title={t("project.cash_witr")} />
      <FCParamsGroup xidPrefix={`fc_witr_c2`} building={building} title={`${t("project.cash_witr")} 2`} />
      {Array.from({ length: FANCOILS_WITR_MAX_NUMBER }, (_, i) => i + 1).map((index) => {
        return <FCParamsGroup key={index} xidPrefix={`fc_witr_s${index}`} building={building} title={`${t("project.witr_area")} ${index}`} />;
      })}
      <FCParamsGroup xidPrefix={`fc_og`} building={building} title={t("project.area_number")} />
      <FCParamsGroup xidPrefix={`fc_m`} building={building} title={t("project.warehouse")} />
      <FCParamsGroup xidPrefix={`fc_z`} building={building} title={t("project.backroom")} />
      <FCParamsGroup xidPrefix={`fc_sl`} building={building} title={t("project.sluice_room")} />
      <FCParamsGroup xidPrefix={`fc_pr`} building={building} title={t("project.billing_room")} />
      <FCParamsGroup xidPrefix={`fc_soc`} building={building} title={t("project.social_room")} />
    </Params>
  );
};

export default BuildingDataFC;
