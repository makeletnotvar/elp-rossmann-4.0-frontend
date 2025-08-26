import { IModule } from 'redux-dynamic-modules';
import pointsReducer, { PointsState } from '../../common/redux/points';
import { ExtendedState } from '../../../vredux';
import { consumptionReducer, ConsumptionDataData } from 'modules/consumption/redux/consumption';

export interface ConsumptionRootState {
    points: PointsState;
    consumption: ExtendedState<ConsumptionDataData>;
}

export const getConsumptionModule = (): IModule<ConsumptionRootState> => ({
    id: "consumption",
    reducerMap: {
        points: pointsReducer,
        consumption: consumptionReducer
    },
    initialActions: [
        { type: 'INIT_DATA_MODULE' }
    ],
});