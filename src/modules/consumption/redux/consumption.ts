import { API } from "api/axios";
import consumptionAPI from "api/endpoints/consumptionAPI";
import useSelector from "modules/common/helpers/redux/useSelector";
import { ConsumptionRootState } from "modules/consumption/redux";
import { Config, createModule } from "vredux";
import { MONTH } from '../constants/periods';

export interface ConsumptionDataData {
    period?: ConsumptionDatePeriodType;
    from?: number;
    to?: number;
    offset?: number;
    data: ConsumptionData;
    building?: Reference;
}

export interface ConsumptionDataResponse {
    data: ConsumptionData;
    building: Reference;
}

const config: Config<ConsumptionDataData> = {
    name: 'consumption',
    initialData: {
        data: [],
    },
    actions: {
        'fetch': async (data, settings: ConsumptionDataRequestSettings) => {
            const { building, offset = 1, period = MONTH, from, to } = settings;
            const response = await API.get<ConsumptionDataResponse>(consumptionAPI.getData({ ...settings, from, to, offset, building, period }));
            return {
                ...data,
                data: prepareData(response.data.data),
                from,
                to,
                building: response.data.building,
                offset,
                period
            };
        },
        'reset': (data) => {
            return config.initialData
        }
    }
};

const MIN_CONSUMPTION = 0;
const MAX_CONSUMPTION = 500000;
const INVALID_CONSUMPTION_VALUE_REPLACEMENT = 0;

const isConsumptionValid = (consumption: number): boolean => {
    return consumption < MIN_CONSUMPTION && consumption > MAX_CONSUMPTION;
};

const replaceInvalidConsumption = (consumption: number): number => {
    const isValid = isConsumptionValid(consumption);
    return isValid
        ? consumption
        : INVALID_CONSUMPTION_VALUE_REPLACEMENT;
}

/**
 * We need to add index to all items to identify it
 * Then we need to ignored data
 */
export const prepareData = (dataItems: ConsumptionDataItem[]): ConsumptionDataItem[] => {
    return dataItems
        .map((dataItem, index) => {

            const nextDataItem: ConsumptionDataItem = {
                ...dataItem,
                consumption: replaceInvalidConsumption(dataItem.consumption)
            };

            return {
                ...dataItem,
                index
            }
        })
}

export const { reducer: consumptionReducer, actions: consumptionActions } = createModule<ConsumptionDataData>(config);
export const useConsumptionState = () => useSelector((state: ConsumptionRootState) => state.consumption);


