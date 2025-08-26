import { Config, createModule } from "vredux";
import { API } from "api/axios";
import useSelector from "modules/common/helpers/redux/useSelector";
import { DataRootState } from "modules/data/redux";
import { RequestChartDataSettings } from "modules/data/redux/chartData";
import dataAPI from "api/endpoints/dataAPI";

export interface ChartPreviewData {
    values: PointsValues;
}

export interface ChartPreviewResponse {
    values: PointsValues;
}

export interface RequestChartPreviewSettings extends RequestChartDataSettings {
    limit: number;
};

const config: Config<ChartPreviewData> = {
    name: 'chartPreview',
    initialData: {
        values: {}
    },
    actions: {
        'fetch': async (data, settings: RequestChartPreviewSettings) => {
            const response = await API.get<ChartPreviewResponse>(dataAPI.getChartPreview(settings));
            return {...data, values: { ...data.values, ...response.data.values }};
        },
        'reset': (data) => {
            return config.initialData
        }
    }
};

export const {reducer: chartPreviewReducer, actions: chartPreviewActions} = createModule<ChartPreviewData>(config);
export const useChartPreviewState = () => useSelector((state: DataRootState) => state.chartPreview);