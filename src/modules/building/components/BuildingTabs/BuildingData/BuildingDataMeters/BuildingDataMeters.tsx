import { checkBuildingPointExists } from "modules/building/helpers/building";
import Params from "modules/common/components/Params/Params";
import PointValueParam2 from "modules/common/components/Params/PointValueParam/PointValueParam2";
import StaticValueParam2 from "modules/common/components/Params/PointValueParam/StaticValueParam2";
import * as React from "react";
import { useTranslation } from "react-i18next";

interface BuildingDataMetersProps {
  building: Building;
}

const BuildingDataMeters: React.FC<BuildingDataMetersProps> = ({ building }) => {
  const { t } = useTranslation();
  const { consumptions } = building;

  const last1 = consumptions?.last1 === undefined ? t("general.nodata") : consumptions?.last1 || 0;
  const last7 = consumptions?.last7 === undefined ? t("general.nodata") : consumptions?.last7 || 0;
  const last30 = consumptions?.last30 === undefined ? t("general.nodata") : consumptions?.last30 || 0;

  return (
    <Params wrapperStyle={{ paddingLeft: "21px" }} title={t(`project.energy_meter`)} collapsed={false} hideCount communicationAlarmPointRef={`m_com`}>
      <StaticValueParam2 label={t("points.meter_last_day")} value={`${last1} kWh`} />
      <StaticValueParam2 label={t("points.meter_last_week")} value={`${last7} kWh`} />
      <StaticValueParam2 label={t("points.meter_last_month")} value={`${last30} kWh`} />
      <PointValueParam2 label={t("points.meter_sum_act")} xid="consumption" />
      <PointValueParam2 label={t("points.meter_sum_react")} xid="m_sum_react" />
      <PointValueParam2 label={t("points.meter_l1")} xid="m_l1" />
      <PointValueParam2 label={t("points.meter_l2")} xid="m_l2" />
      <PointValueParam2 label={t("points.meter_l3")} xid="m_l3" />
      <PointValueParam2 label={t("points.meter_pow1")} xid="m_pow1" />
      <PointValueParam2 label={t("points.meter_pow2")} xid="m_pow2" />
      <PointValueParam2 label={t("points.meter_pow3")} xid="m_pow3" />
      <PointValueParam2 label={t("points.meter_pow_avg_act")} xid="m_pow_avg_act" />
      <PointValueParam2 label={t("points.connection")} xid="m_com" />
      <Params
        wrapperStyle={{ paddingLeft: "21px" }}
        title={`Obdwód 2 - 3F - Kurtyna, Klimakonwektor, Centrala`}
        collapsed={false}
        hideCount
        communicationAlarmPointRef={`m_com`}
        display={checkBuildingPointExists(building, "consumption_2")}
      >
        <PointValueParam2 label={t("points.meter_sum_act")} xid="consumption_2" />
        <PointValueParam2 label={t("points.meter_sum_react")} xid="m_sum_react_2" />
        <PointValueParam2 label={t("points.meter_l1")} xid="m_l1_2" />
        <PointValueParam2 label={t("points.meter_l2")} xid="m_l2_2" />
        <PointValueParam2 label={t("points.meter_l3")} xid="m_l3_2" />
        <PointValueParam2 label={t("points.meter_pow1")} xid="m_pow1_2" />
        <PointValueParam2 label={t("points.meter_pow2")} xid="m_pow2_2" />
        <PointValueParam2 label={t("points.meter_pow3")} xid="m_pow3_2" />
        <PointValueParam2 label={t("points.meter_pow_avg_act")} xid="m_pow_avg_act_2" />
      </Params>
      <Params
        wrapperStyle={{ paddingLeft: "21px" }}
        title={`Obdwód 3 - 3F - Klimatyzatory`}
        collapsed={false}
        hideCount
        communicationAlarmPointRef={`m_com`}
        display={checkBuildingPointExists(building, "consumption_3")}
      >
        <PointValueParam2 label={t("points.meter_sum_act")} xid="consumption_3" />
        <PointValueParam2 label={t("points.meter_sum_react")} xid="m_sum_react_3" />
        <PointValueParam2 label={t("points.meter_l1")} xid="m_l1_3" />
        <PointValueParam2 label={t("points.meter_l2")} xid="m_l2_3" />
        <PointValueParam2 label={t("points.meter_l3")} xid="m_l3_3" />
        <PointValueParam2 label={t("points.meter_pow1")} xid="m_pow1_3" />
        <PointValueParam2 label={t("points.meter_pow2")} xid="m_pow2_3" />
        <PointValueParam2 label={t("points.meter_pow3")} xid="m_pow3_3" />
        <PointValueParam2 label={t("points.meter_pow_avg_act")} xid="m_pow_avg_act_3" />
      </Params>
    </Params>
  );
};

export default BuildingDataMeters;
