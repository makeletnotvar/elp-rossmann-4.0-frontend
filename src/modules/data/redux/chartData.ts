import { API } from "api/axios";
import dataAPI from "api/endpoints/dataAPI";
import useSelector from "modules/common/helpers/redux/useSelector";
import { DataRootState } from "modules/data/redux";
import { Config, createModule } from "vredux";

export interface ChartDataData {
    values: PointsValues;
}

export interface ChartDataDataResponse {
    values: PointsValues;
}

export type RequestChartDataSettings = {
    from: number;
    to: number;
    points: string[];
};

const config: Config<ChartDataData> = {
    name: 'chartData',
    initialData: {
        values: {}
    },
    actions: {
        'fetch': async (data, settings: RequestChartDataSettings) => {
            const response = await API.get<ChartDataDataResponse>(dataAPI.getChartData(settings));
            return {...data, values: { ...data.values, ...response.data.values }};
        },
        'reset': (data) => {
            return config.initialData
        }
    }
};

export const {reducer: chartDataReducer, actions: chartDataActions} = createModule<ChartDataData>(config);
export const useChartDataState = () => useSelector((state: DataRootState) => state.chartData);