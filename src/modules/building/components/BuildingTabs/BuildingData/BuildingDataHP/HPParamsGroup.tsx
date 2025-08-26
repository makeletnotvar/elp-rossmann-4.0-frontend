import { checkBuildingPointExists } from "modules/building/helpers/building";
import Params from "modules/common/components/Params/Params";
import PointValueParam2 from "modules/common/components/Params/PointValueParam/PointValueParam2";
import * as React from "react";
import { useTranslation } from "react-i18next";

interface HPParamsGroupProps {
  building: Building;
  title: string;
  xidRef: string;
}

const HPParamsGroup: React.FC<HPParamsGroupProps> = ({ title, building, xidRef }) => {
  const { t } = useTranslation();

  return (
    <>
      <Params
        title={title}
        collapsed
        hideCount
        display={checkBuildingPointExists(building, `pc_${xidRef}_com`)}
        summaryAlarmPointRef={`pc_${xidRef}_alarm`}
        communicationAlarmPointRef={`pc_${xidRef}_com`}
      >
        <PointValueParam2 label={t(`points.ac_onoff`)} xid={`pc_${xidRef}_onoffr`} />
        <PointValueParam2 label={t(`points.ac_mode`)} xid={`pc_${xidRef}_mode`} />
        <PointValueParam2 label={t(`points.fc_tset`)} xid={`pc_${xidRef}_tset`} />
        <PointValueParam2 label={t(`points.fc_tmain`)} xid={`pc_${xidRef}_tmain`} />
        <PointValueParam2 label={t(`points.hp_tsup`)} xid={`pc_${xidRef}_tsup`} />
        <PointValueParam2 label={t(`points.hp_tsupwater`)} xid={`pc_${xidRef}_tsupwater`} />
        <PointValueParam2 label={t(`points.hp_tbackwater`)} xid={`pc_${xidRef}_tbackwater`} />
        <PointValueParam2 label={t(`points.fc_vent`)} xid={`pc_${xidRef}_vent`} />
        <PointValueParam2 label={t(`points.hp_spr`)} xid={`pc_${xidRef}_spr`} />
        <PointValueParam2 label={t(`points.hp_spr`) + " 1"} xid={`pc_${xidRef}_spr1`} />
        <PointValueParam2 label={t(`points.hp_spr`) + " 2"} xid={`pc_${xidRef}_spr2`} />
        <PointValueParam2 label={t(`points.hp_heat`)} xid={`pc_${xidRef}_heat`} />
        <PointValueParam2 label={t(`points.hp_cool`)} xid={`pc_${xidRef}_cool`} />
        <PointValueParam2 label={t(`points.hp_valve`)} xid={`pc_${xidRef}_valve`} />
        <PointValueParam2 label={t(`points.ac_alarm`)} xid={`pc_${xidRef}_alarm`} />
        <PointValueParam2 label={t(`points.ac_com`)} xid={`pc_${xidRef}_com`} />
      </Params>
    </>
  );
};

export default HPParamsGroup;
