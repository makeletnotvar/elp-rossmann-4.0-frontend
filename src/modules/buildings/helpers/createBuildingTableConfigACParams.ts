import { createPointRefConfig } from "modules/buildings/components/BuildingsList/buildingsListTableConfig"

export const createBuildingTableConfigACParams = function(index: string, title: string){
    return {
        [`${index}_onoff`]: createPointRefConfig({
            label: `Klimatyzator ${title} - Stan`,
            group: `${index}`
        }),
        [`${index}_mode`]: createPointRefConfig({
            label: `Klimatyzator ${title} - Tryb`,
            group: `${index}`
        }),
        [`${index}_speed`]: createPointRefConfig({
            label: `Klimatyzator ${title} - Prędkość`,
            group: `${index}`
        }),
        [`${index}_treg`]: createPointRefConfig({
            label: `Klimatyzator ${title} - Temperatura`,
            unit: `°C`,
            group: `${index}`
        }),
        [`${index}_vanes`]: createPointRefConfig({
            label: `Klimatyzator ${title} - Łopatki`,
            unit: `°C`,
            group: `${index}`
        }),
        [`${index}_alarm`]: createPointRefConfig({
            label: `Klimatyzator ${title} - Alarm`,
            group: `${index}`
        }),
        [`${index}_com`]: createPointRefConfig({
            label: `Klimatyzator ${title} - Komunikacja`,
            group: `${index}`
        }),
    }
}