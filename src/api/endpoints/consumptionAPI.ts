import { createUrl } from "api/helpers";
import queryString from 'query-string';

const consumptionAPI = {
    getData: ({ building, period, from, to, offset, xid = 'consumption' }: ConsumptionDataRequestSettings) =>
        createUrl(`/data/consumption?${queryString.stringify({ building, period, from, to, offset, xid })}`),
}

export default consumptionAPI;