import { buildingUnitsActions, useBuildingUnitsState } from "modules/building/redux/buildingUnits";
import ConfirmDialog, { useConfirmDialog } from "modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog";
import { useDispatch } from "modules/common/helpers/redux/useActions";
import * as React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useRouter from "use-react-router";
import styles from "./BuildingUnits.module.scss";
import BuildingUnitsContent from "./BuildingUnitsContent/BuildingUnitsContent";
import BuildingUnitsList from "./BuildingUnitsList/BuildingUnitsList";

interface BuildingUnitsProps {
  building: Building | undefined;
}

const BuildingUnits: React.FC<BuildingUnitsProps> = ({ building }) => {
  const {
    history,
    match: {
      params: { xid: unitXid, action },
    },
  } = useRouter<{ uuid: string; xid?: string; action?: string }>();
  const { t } = useTranslation();
  const { units = [], fetched } = useBuildingUnitsState();
  const { closeConfirm, openConfirm, isConfirm, set, data } = useConfirmDialog();
  const dispatch = useDispatch();
  const isEditing = action === "edit";

  useEffect(() => {
    if (building) {
      dispatch(buildingUnitsActions.get.request(building.uuid));
    }
  }, []);

  const openHandler = (xid: string, isEditing?: boolean): void => {
    if (action !== "edit" && building) {
      history.push(`/building/${building.uuid}/units/${xid}${isEditing ? "/edit" : ""}`);
    }
  };

  const editHandler = (xid: string) => {
    openHandler(xid, true);
  };

  const closeEditHandler = (editedUnitXid?: string) => {
    if ((building && unitXid) || (building && editedUnitXid)) {
      history.push(`/building/${building.uuid}/units/${editedUnitXid || unitXid}`);
      history.go(0);
    }
  };

  const addHandler = async () => {
    if (building) {
      const index = units.length;
      const xid = `new_${index}`;
      dispatch(
        buildingUnitsActions.add.request(
          building.uuid,
          {
            name: `${t("buildings.units.new_device")} ${index}`,
            xid,
            params: [],
          },
          () => {
            history.push(`/building/${building.uuid}/units/${xid}/edit`);
          }
        )
      );
    }
  };

  const confirmHandler = (xid: string, name: string): void => {
    if (building) {
      openConfirm();
      set({ xid, name });
    }
  };

  const removeHandler = (): void => {
    if (building) {
      dispatch(buildingUnitsActions.remove.request(building.uuid, data.xid));
      closeConfirm();
      history.push(`/building/${building.uuid}/units`);
    }
  };

  useEffect(() => {
    const shouldDefaultyOpenFirstUnit = fetched && units.length > 0 && unitXid === undefined && building;
    if (shouldDefaultyOpenFirstUnit) {
      openHandler(units[0].xid);
    }
  }, [units, unitXid, isEditing]);

  const selectedUnit = units.find((unit: Unit) => unit && unit.xid === unitXid);

  return (
    <div className={styles.container}>
      <BuildingUnitsList buildingUUID={building?.uuid} units={units} onSelect={openHandler} onEdit={editHandler} onAdd={addHandler} disabled={isEditing} selectedXid={unitXid} />
      {selectedUnit && building && (
        <BuildingUnitsContent unit={selectedUnit} isEditing={isEditing} onRemove={confirmHandler} onEdit={editHandler} onClose={closeEditHandler} buildingUUID={building.uuid} />
      )}
      <ConfirmDialog
        title={t("buildings.units.delete_device")}
        message={`${t("buildings.units.sure_to_delete_device")} ${data?.name}?`}
        open={isConfirm}
        onCancel={closeConfirm}
        onConfirm={removeHandler}
        testId="building-units-dialog-confirm"
      />
    </div>
  );
};

export default BuildingUnits;
