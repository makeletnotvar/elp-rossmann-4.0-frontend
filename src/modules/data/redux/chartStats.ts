import { API } from "api/axios";
import dataAPI from "api/endpoints/dataAPI";
import useSelector from "modules/common/helpers/redux/useSelector";
import { DataRootState } from "modules/data/redux";
import { Config, createModule } from "vredux";
import { RequestChartDataSettings } from "modules/data/redux/chartData";

export interface ChartStatsData {
    statistics: ChartDataPointsStatistics;
}

export interface ChartStatsResponse {
    statistics: ChartDataPointsStatistics;
}

const config: Config<ChartStatsData> = {
    name: 'chartStats',
    initialData: {
        statistics: {}
    },
    actions: {
        'fetch': async (data, settings: RequestChartDataSettings) => {
            const response = await API.get<ChartStatsResponse>(dataAPI.getChartStats(settings));
            return {...data, statistics: { ...data.statistics, ...response.data.statistics }};
        },
        'reset': (data) => {
            return config.initialData
        }
    }
};

export const {reducer: chartStatsReducer, actions: chartStatsActions} = createModule<ChartStatsData>(config);
export const useChartStatsState = () => useSelector((state: DataRootState) => state.chartStats);