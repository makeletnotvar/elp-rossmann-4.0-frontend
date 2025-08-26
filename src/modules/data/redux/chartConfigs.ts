import { API } from "api/axios";
import dataAPI from "api/endpoints/dataAPI";
import useSelector from "modules/common/helpers/redux/useSelector";
import { DataRootState } from "modules/data/redux";
import { Config, createModule } from "vredux";
import { updateArrayItem, removeArrayItem } from "helpers/state";

export interface ChartConfigsData {
    configs: ChartConfig[];
    active?: string | undefined;
}

export interface ChartConfigsResponse {
    configs: ChartConfig[];
}

export interface ChartConfigUpdateResponse {
    config: ChartConfig;
}

const config: Config<ChartConfigsData> = {
    name: 'chartConfigs',
    initialData: {
        configs: [],
        active: undefined
    },
    actions: {
        'fetch': async (data, { }) => {
            const response = await API.get<ChartConfigsResponse>(dataAPI.getChartConfigs());
            return { ...data, configs: response.data.configs };
        },
        'update': async (data, config: Partial<ChartConfig>) => {
            const response = await API.put<ChartConfigUpdateResponse>(dataAPI.updateChartConfig(config.uuid!), { config });
            return {
                ...data,
                configs: updateArrayItem<ChartConfig>(data.configs, 'uuid', config.uuid, response.data.config)
            };
        },
        'add': async (data, config: Partial<ChartConfig>) => {
            const response = await API.post<ChartConfigUpdateResponse>(dataAPI.addChartConfig(), { config });
            return {
                ...data,
                configs: [...data.configs, response.data.config],
                active: response.data.config.uuid || undefined
            };
        },
        'remove': async (data, uuid) => {
            const response = await API.delete<ChartConfigUpdateResponse>(dataAPI.removeChartConfig(uuid));
            return {
                ...data,
                configs: removeArrayItem<ChartConfig>(data.configs, 'uuid', uuid)
            };
        },
        'reset': (data) => {
            return config.initialData
        },
        'select': (data, uuid) => {
            return {...data, active: uuid}
        },
        'resetSelection': (data) => {
            return { ...data, active: undefined }
        }
    }
};
export const { reducer: chartConfigsReducer, actions: chartConfigsActions } = createModule<ChartConfigsData>(config);
export const useChartConfigsState = () => useSelector((state: DataRootState) => state.chartConfigs);