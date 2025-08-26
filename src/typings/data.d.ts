type DataPointValue = {
    ts: number;
    value: number | null | undefined;
};

type MergedDataPointsValue = {
    ts: number;
    [key: string]: number | null | undefined;
};

type PointsValues = {
    [pointUUID: string]: DataPointValue[]
}



type MergedDataPointsValues<T = any> = MergedDataPointsValue[];

type ChartPointValue = {
    x: number;
    y: number | null | undefined;
}

type ChartDataPointStatistics = {
    min: number;
    max: number;
    avg: number;
    count: number;
    countAll: number;
}

type ChartDataPointsStatistics = {
    [pointUUID: string]: ChartDataPointStatistics
}

type ChartConfig = {
    uuid: string;
    name: string;
    points: string[];       // uuids
    addTs: number;
}