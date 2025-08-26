import pollReducer, { PollState } from 'modules/common/redux/poll';
import { IModule } from 'redux-dynamic-modules';
import pointsReducer, { PointsState } from '../../common/redux/points';
import { chartDataReducer, ChartDataData } from 'modules/data/redux/chartData';
import { ExtendedState } from 'vredux';
import { ChartStatsData, chartStatsReducer } from 'modules/data/redux/chartStats';
import { ChartPreviewData, chartPreviewReducer } from 'modules/data/redux/chartPreview';
import { ChartConfigsData, chartConfigsReducer } from 'modules/data/redux/chartConfigs';

export interface DataRootState {
    poll: PollState;
    points: PointsState;
    chartData: ExtendedState<ChartDataData>;
    chartPreview: ExtendedState<ChartPreviewData>;
    chartStats: ExtendedState<ChartStatsData>;
    chartConfigs: ExtendedState<ChartConfigsData>;
}

export const getDataModule = (): IModule<DataRootState> => ({
    id: "data",
    reducerMap: {
        poll: pollReducer,
        points: pointsReducer,
        chartData: chartDataReducer,
        chartPreview: chartPreviewReducer,
        chartStats: chartStatsReducer,
        chartConfigs: chartConfigsReducer,
    },
    initialActions: [
        { type: 'INIT_DATA_MODULE' }
    ],
});