import { MANUFAKTURA_CODE } from "config/system";
import Params from "modules/common/components/Params/Params";
import PointValueParam2 from "modules/common/components/Params/PointValueParam/PointValueParam2";
import * as React from "react";
import { useTranslation } from "react-i18next";

interface BuildingDataGeneralProps {
  building: Building;
}
const BuildingDataGeneral: React.FC<BuildingDataGeneralProps> = ({ building }) => {
  const { t } = useTranslation();

  const isManufaktura = building.code === String(MANUFAKTURA_CODE);

  return (
    <Params wrapperStyle={{ paddingLeft: "21px" }} title={t("buildings.devices.settings")} hideCount collapsed={false}>
      <PointValueParam2 label={t(`points.mode`)} xid="mode" />
      <PointValueParam2 label={t(`points.workmode`)} xid="workmode" settable />
      <PointValueParam2 label={t(`points.unitstate`)} xid="unitstate" />
      <PointValueParam2 label={t(`points.unitstate_ahu2`)} xid="unitstate_ahu2" />
      <PointValueParam2 label={t(`points.seasonact`)} xid="seasonact" />
      <PointValueParam2 label={t(`points.tseto`)} xid="tseto" settable />
      <PointValueParam2 label={t(`points.tseto_2`)} xid="tseto_2" settable />
      <PointValueParam2 label={t(`points.temp_o2`)} xid="temp_o2" />
      <PointValueParam2 label={t(`points.tsetpar`)} xid="tsetpar" settable />
      <PointValueParam2 label={t(`points.tsetpiet`)} xid="tsetpiet" settable />
      <PointValueParam2 label={t(`points.tset_klim`)} xid="tset_klim" settable />
      <PointValueParam2 label={t(`points.tmain_kasy`)} xid="tmain_kasy" />
      <PointValueParam2 label={t(`points.tset_witr`)} xid="tset_witr" settable />
      <PointValueParam2 label={t(`points.tmain_witr`)} xid="tmain_witr" />
      <PointValueParam2 label={t(`points.tset_sluice`)} xid="fc_sl_tset_auto" settable />
      <PointValueParam2 label={t(`points.tmain_sluice`)} xid="fc_sl_tmain" />
      <PointValueParam2 label={t(`points.tavrpar`)} xid="tavrpar" settable />
      <PointValueParam2 label={t(`points.tavrpiet`)} xid="tavrpiet" settable />
      <PointValueParam2 label={t(`Temperatura zadana sala sprzedaży`)} xid="ac_s2og_tset" settable />
      <PointValueParam2 label={t(`Temperatura sali sprzedaży`)} xid="ac_s2og_treg" />
      <PointValueParam2 label={t(`Temperatura zadana sala sprzedaży góra`)} xid="ac_s3og_tset" settable />
      <PointValueParam2 label={t(`Temperatura sali sprzedaży góra`)} xid="ac_s3og_treg" />
      <PointValueParam2 label={t(`Temperatura zadana pomieszczenia socjalnego`)} xid="ac_soc_tset_auto" settable />
      <PointValueParam2 label={t(`Temperatura pomieszczenia socjalnego`)} xid="ac_soc_tmain" />
      <PointValueParam2 label={t(`Temperatura zadana pomieszczenia rozliczeń`)} xid="ac_pr_tset_auto" settable />
      <PointValueParam2 label={t(`Temperatura pomieszczenia rozliczeń`)} xid="ac_pr_tmain" />
      <PointValueParam2 label={t(`Temperatura zadana pomieszczenia komunikacji`)} xid="ac_kom_tset_auto" settable />
      <PointValueParam2 label={t(`Temperatura pomieszczenia komunikacji`)} xid="ac_kom_tmain" />
      {isManufaktura ? (
        <>
          <PointValueParam2 label={t(`points.tavrk`)} xid="tavrk" />
          <PointValueParam2 label={t(`points.tavro`)} xid="tavro" />
        </>
      ) : (
        <PointValueParam2 label={t(`points.tavr`)} xid="tavr" />
      )}
      <PointValueParam2 label={t(`points.z_tset`)} xid="ac_z_tset_auto" settable />
      <PointValueParam2 label={t(`points.z_tmain`)} xid="ac_z_tmain" />
      {
        // Nie ma jednej kanałówki na zaplecze, tylko poszczególne klimatyzatory typu split dlatego rozróżnienie zapl i z (temat 2520)
      }
      <PointValueParam2 label={t(`points.z_tset`)} xid="ac_zapl_tset_auto" settable />
      <PointValueParam2 label={t(`points.z_tmain`)} xid="ac_zapl_tmain" />
      <PointValueParam2 label={t(`points.m_tmain`)} xid={"ac_m_tmain"} />
      <PointValueParam2 label={`${t(`points.z_tset`)} 2`} xid="ac_z2_tset_auto" settable />
      <PointValueParam2 label={`${t(`points.z_tmain`)} 2`} xid="ac_z2_tmain" />
      <PointValueParam2 label={t(`points.m_tset`)} xid={"ac_m_tset_auto"} settable />
      <PointValueParam2 label={t(`points.fc_tset`)} xid={"fc_m_tset_auto"} settable />
      <PointValueParam2 label={t(`points.fc_tset`)} xid={"fc_m_tmainr"} />
    </Params>
  );
};

export default BuildingDataGeneral;
