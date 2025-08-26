import { createPointRefConfig } from "modules/buildings/components/BuildingsList/buildingsListTableConfig";


export const createBuildingTableConfigFancoilParams = (index: string, title: string) => {
  return {
    [`fc_${index}_onoff`]: createPointRefConfig({
      label: `Klimakonwektor ${title} - Stan`,
      group: `fc_${index}`,
    }),
    [`fc_${index}_mode`]: createPointRefConfig({
      label: `Klimakonwektor ${title} - Tryb`,
      group: `fc_${index}`,
    }),
    [`fc_${index}_modetemp`]: createPointRefConfig({
      label: `Klimakonwektor ${title} - Tryb temperatury`,
      group: `fc_${index}`,
    }),
    [`fc_${index}_tset`]: createPointRefConfig({
      label: `Klimakonwektor ${title} - Temp zadana`,
      group: `fc_${index}`,
      unit: `°C`,
    }),
    [`fc_${index}_tmain`]: createPointRefConfig({
      label: `Klimakonwektor ${title} - Temp wiodąca`,
      group: `fc_${index}`,
      unit: `°C`,
    }),
    [`fc_${index}_vent`]: createPointRefConfig({
      label: `Klimakonwektor ${title} - Wentylatory`,
      group: `fc_${index}`,
    }),
    [`fc_${index}_y1`]: createPointRefConfig({
      label: `Klimakonwektor ${title} - Zawór nagrzewnicy`,
      group: `fc_${index}`,
    }),
    [`fc_${index}_y1`]: createPointRefConfig({
      label: `Klimakonwektor ${title} - Zawór chłodnicy`,
      group: `fc_${index}`,
    }),
    [`fc_${index}_com`]: createPointRefConfig({
      label: `Klimakonwektor ${title} - Komunikacja`,
      group: `fc_${index}`,
    }),
  };
};
