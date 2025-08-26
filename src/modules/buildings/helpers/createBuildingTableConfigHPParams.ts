import { createPointRefConfig } from "modules/buildings/components/BuildingsList/buildingsListTableConfig";

export const createBuildingTableConfigHPParams = function (
  index: string,
  title: string
) {
  return {
    [`${index}_onoff`]: createPointRefConfig({
      label: `Pompa ciepła ${title} - Stan`,
      group: `${index}`,
    }),
    [`${index}_mode`]: createPointRefConfig({
      label: `Pompa ciepła ${title} - Tryb`,
      group: `${index}`,
    }),
    [`${index}_tset`]: createPointRefConfig({
      label: `Pompa ciepła ${title} - Temperatura zadana`,
      group: `${index}`,
    }),
    [`${index}_tmain`]: createPointRefConfig({
      label: `Pompa ciepła ${title} - Temperatura wiodąca`,
      unit: `°C`,
      group: `${index}`,
    }),
    [`${index}_vent`]: createPointRefConfig({
      label: `Pompa ciepła ${title} - Wentylator`,
      group: `${index}`,
    }),
    [`${index}_spr1`]: createPointRefConfig({
      label: `Pompa ciepła ${title} - Sprężarka 1`,
      group: `${index}`,
    }),
    [`${index}_spr2`]: createPointRefConfig({
      label: `Pompa ciepła ${title} - Sprężarka 2`,
      group: `${index}`,
    }),
    [`${index}_heat`]: createPointRefConfig({
      label: `Pompa ciepła ${title} - Zawór grzanie`,
      group: `${index}`,
    }),
    [`${index}_cool`]: createPointRefConfig({
      label: `Pompa ciepła ${title} - Zawór chłodzenie`,
      group: `${index}`,
    }),
    [`${index}_valve`]: createPointRefConfig({
      label: `Pompa ciepła ${title} - Tryb temperatury`,
      group: `${index}`,
    }),
    [`${index}_alarm`]: createPointRefConfig({
      label: `Pompa ciepła ${title} - Alarm`,
      group: `${index}`,
    }),
    [`${index}_com`]: createPointRefConfig({
      label: `Pompa ciepła ${title} - Komunikacja`,
      group: `${index}`,
    }),
  };
};
