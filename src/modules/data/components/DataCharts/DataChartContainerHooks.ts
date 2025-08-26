import { usePointsWithLoad, usePoints, pointsActions } from "modules/common/redux/points";
import useRouter from "use-react-router";
import { arrayize, entriesToObjectReducer, nArray } from "helpers/data";
import queryString from 'query-string';
import { useCallback, useMemo } from "react";
import { useChartDataState, chartDataActions } from '../../redux/chartData';
import { useEffect } from 'react';
import { useDispatch } from '../../../common/helpers/redux/useActions';
import { useChartStatsState, chartStatsActions } from "modules/data/redux/chartStats";
import { pollActions } from "modules/common/redux/poll";
import { isEnumPoint } from "modules/common/helpers/points/points";
import { useAuth } from "modules/common/selectors/auth";

const MAX_COMBINED_CHARTS = 6;
const MAX_COMBINED_CHARTS_FOR_DEV = 11;

export type DataURLParams = {
    p?: string[];
    from?: number;
    to?: number;
    c?: string;
}

export function useDataRouter() {
    const { history, location: { search } } = useRouter();
    const {user} = useAuth();
    const maxCombinedCharts = user?.type === "DEV" ? MAX_COMBINED_CHARTS_FOR_DEV : MAX_COMBINED_CHARTS;
    const { pointsUUIDs, from, to, config } = useMemo(() => {
        const { p, c, from, to } = queryString.parse(search);

        return {
            pointsUUIDs: p ? arrayize(p).slice(0, maxCombinedCharts - 1) : [],
            from: Number(from),
            to: Number(to),
            config: String(c) || undefined
        };
    }, [search]);

    const changeHandler = (points: string[], from: number, to: number, config?: string) => {
        const urlParams: DataURLParams = {
            p: points.slice(0, maxCombinedCharts - 1),
            from,
            to,
            c: config
        };

        history.push(`/data?${queryString.stringify(urlParams)}`);
    };

    return {
        pointsUUIDs,
        from: Number(from),
        to: Number(to),
        config,
        changeHandler
    };
}


export function useSpecifiedDataPoints(uuids: string[]) {
    const MERGE_POINTS = false;
    const dispatch = useDispatch();
    const { points, fetched, fetching, error } = usePoints();

    useEffect(() => {
        const IS_INTERVAL_CALL = false;
        dispatch(pointsActions.get.request(uuids, MERGE_POINTS));
        dispatch(pollActions.poll.request(uuids, IS_INTERVAL_CALL));
    }, [uuids]);

    const mappedPoints = (
        uuids
            .map(uuid => points.find(p => p.uuid === uuid))
            .filter(point => point !== undefined) as Point[]
    );

    return {
        points: mappedPoints,
        fetched,
        fetching,
        error
    }
}




export function usePointsValues(pointsUUIDs: string[], from: number, to: number) {
    const { data: { values }, status } = useChartDataState();
    const dispatch = useDispatch();

    useEffect(() => {
        if (pointsUUIDs.length) {
            dispatch(chartDataActions.fetch({ points: pointsUUIDs, from, to }))
        }
    }, [pointsUUIDs, from, to]);

    const getValues = (uuid: string | undefined): DataPointValue[] => {
        if (uuid) {
            const pointValues = values[uuid];
            return pointValues || [];
        } else {
            return [];
        }
    };

    return {
        status,
        getValues,
        values
    }
}

export const useDataPointsStatistics = (pointsUUIDs: string[], from: number, to: number) => {
    const { data: { statistics }, status } = useChartStatsState();
    const dispatch = useDispatch();

    useEffect(() => {
        if (pointsUUIDs.length) {
            dispatch(chartStatsActions.fetch({ points: pointsUUIDs, from, to }))
        }
    }, [pointsUUIDs, from, to]);

    return { statistics, status };
}


function getChartPointGroupIdentifier(point: Point): string | undefined {
    return isEnumPoint(point)
        ? 'enum'
        : point.customRender && (point.customRender as NumericRender).suffix
            ? (point.customRender as NumericRender).suffix
            : point.uuid;;
}

export type SplittedCharts = {
    points: Point[];
    values: PointsValues;
}[];

export type ReducedSplitCharts = {
    [identifier: string]: {
        points: Point[];
        values: PointsValues;
    }
}

/**
 * It gets chart selected points UUIDs and collect those points objects and values,
 * based on values that server responsed
 */
export function splitDataIntoMergedCharts(pointsUUIDs: string[], allPoints: Point[], values: PointsValues): SplittedCharts {

    const points: Point[] = <Point[]>pointsUUIDs
        .map(uuid => allPoints.find(p => p.uuid === uuid))
        .filter(p => p !== undefined)

    // Reduce into key-value object @ReducedSplitCharts
    const splittedPoints = points.reduce(
        (ob: ReducedSplitCharts, nextPoint: Point, index: number) => {
            if (nextPoint && nextPoint.uuid) {
                const mergeGroupIdentifier = getChartPointGroupIdentifier(nextPoint) || index.toString();

                if (!ob[mergeGroupIdentifier]) {
                    ob[mergeGroupIdentifier] = {
                        points: [],
                        values: {}
                    }
                }

                ob[mergeGroupIdentifier] = {
                    points: [...(ob[mergeGroupIdentifier].points || []), nextPoint],
                    values: {
                        ...(ob[mergeGroupIdentifier].values || {}),
                        [nextPoint.uuid]: values[nextPoint.uuid] || []
                    }
                }
            }
            return ob
        }, {} as ReducedSplitCharts);

    const splittedPointsArray: SplittedCharts = Object.values(splittedPoints);

    return splittedPointsArray;
}

/**
 * It merge point values to recharts friendly common objects array.
 * {
 *  'point1': [{ts: 1, value: 1}, {ts: 2, value: 2}]
 *  'point2': [{ts: 1, value: 11}, {ts: 2, value: 12}]
 * }
 * 
 * to
 * 
 * [
 *  {ts: 1, point1: 1, point2: 11},
 *  {ts: 1, point1: 2, point2: 12}
 * ]
 * 
 */
export function mergePointsValues(pointsValues: PointsValues): MergedDataPointsValue[] {
    const timestampGroupValues: { [ts: number]: { [uuid: string]: number | null | undefined } } = {};
    const pointsUUIDs = Object.keys(pointsValues);

    // Iterate points
    for (let i = 0; i < pointsUUIDs.length; i++) {
        const uuid = pointsUUIDs[i];
        const values = pointsValues[uuid];

        // Iterate every point's value
        for (let j = 0; j < values.length; j++) {
            const { ts, value } = values[j];

            if (!timestampGroupValues[ts]) { timestampGroupValues[ts] = {} };

            timestampGroupValues[ts][uuid] = value;
        }
    }

    const mergedPointsValues: MergedDataPointsValue[] = Object.entries(timestampGroupValues)
        .map(([ts, values]) => ({ ...values, ts: Number(ts) }))
        .sort((a, b) => a.ts - b.ts);

    return mergedPointsValues;
}

/**
 * 
 * It generates fake values for enum points.
 * It's used as workaround for Y axis tooltips order.
 * Chart lines for enum's configured as "category" type has various tooltips order, depends on first values.
 * We need to simulate correct order on hidden chart line to force order in related Y axis.
 * 
 * @param pointsValues 
 */
export function getEnumOrderedStatesFakeValues(points: Point[], startTs: number): MergedDataPointsValue[]{
    const fakePointValues: MergedDataPointsValue[] = [];
    const enumPoints = points.filter(isEnumPoint);
    const pointsEnumsValues: Map<string, number[]> = new Map<string, number[]>();   // [uuid: value[]] map
    let maxEnumStateCount = 0;
    
    /**
     * Get ENUM states keys for each point and keep it in @pointsEnumsValues map
     * 
     * states {"0": "Stop", "1": "1 Gear", "2": "2 Gear"} => [uuid: [0,1,2]]
     * 
     */ 
    enumPoints.forEach(
        enumPoint => {
            const render = enumPoint.customRender as EnumRender;
            
            if(render.states && enumPoint.uuid){
                const enumStateValues: number[] = Object.keys(render.states).map(Number);

                if(enumStateValues.length > maxEnumStateCount){
                    maxEnumStateCount = enumStateValues.length;
                }
                pointsEnumsValues.set(`$${enumPoint.uuid}`, enumStateValues);
            }
        }
    );

    /**
     * 
     * Iterate for max enum state count to create n @MergedDataPointsValue objects
     * 
     */
    nArray(maxEnumStateCount).forEach(
        (_, index) => {
            /**
             * Create new @MergedDataPointsValue object
             * Values has to be placed at the begin, so it means
             * that @ts param will be related to request timestamp range (start)
             */
            
            let timeValues: MergedDataPointsValue = {
                ts: startTs - index
            };

            /**
             * For each iteration, iterate all points and get those states keys if exists.
             */
            [...pointsEnumsValues.keys()].forEach(
                enumPointUUID => {
                    const pointStates: number[] | undefined = pointsEnumsValues.get(enumPointUUID);
                    
                    if(pointStates){
                        const pointStateValue: number = pointStates[index];
                        
                        if(pointStateValue !== undefined){
                            timeValues[enumPointUUID] = pointStateValue;
                        }
                    }
                }
            );

            fakePointValues.push(timeValues);
        }
    )

    return fakePointValues;
}


/**
 * Find common max and min timestamp in all points values series
 */
export function getDataTimeRange(pointsValues: PointsValues): [number, number] {
    let from = -1;
    let to = -1;

    Object.values(pointsValues).forEach(
        (pointValues: DataPointValue[]) => {
            for (let pv of pointValues) {
                if (pv.ts < from || from === -1) {
                    from = pv.ts
                } else if (pv.ts > to || to === -1) {
                    to = pv.ts;
                }
            }
        }
    );

    return [from, to];
}

/**
 * Extend all points values series with null-value timestamp to keep the same time range.
 * This is helpfull to synchronize multiple charts data series
 */
export function extendValuesWithCommonTimeRange(values: PointsValues, commonFromTs: number, commonToTs: number): PointsValues {
    return Object.entries(values)
        .map(([key, pointValues]: [string, DataPointValue[]]) => {
            let extendedPointValues: DataPointValue[] = pointValues;
            const firstValue = extendedPointValues[0];
            const lastValue = extendedPointValues[extendedPointValues.length - 1];

            if (commonFromTs > -1 && firstValue.ts !== commonFromTs) {
                extendedPointValues.unshift({ ts: commonFromTs, value: null });
            }

            if (commonToTs > -1 && lastValue.ts !== commonToTs) {
                extendedPointValues.push({ ts: commonToTs, value: null });
            }

            return [
                key, extendedPointValues
            ]
        }).reduce(entriesToObjectReducer, {});
}