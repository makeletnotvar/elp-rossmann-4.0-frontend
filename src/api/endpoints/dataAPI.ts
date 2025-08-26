import { RequestChartDataSettings } from "modules/data/redux/chartData";
import { createUrl } from "api/helpers";
import queryString from 'query-string';
import { RequestChartPreviewSettings } from "modules/data/redux/chartPreview";

const dataAPI = {
    getChartData: ({ from, to, points }: RequestChartDataSettings) => createUrl(`/data?${queryString.stringify({ from, to, p: points })}`),
    getChartPreview: ({ from, to, points, limit}: RequestChartPreviewSettings) => createUrl(`/data/preview?${queryString.stringify({ from, to, p: points, limit })}`),
    getChartStats: ({ from, to, points }: RequestChartDataSettings) => createUrl(`/data/stats?${queryString.stringify({ from, to, p: points })}`),
    getChartConfigs: () => createUrl(`/data/configs`),
    updateChartConfig: (uuid: string) => createUrl(`/data/config/${uuid}`),
    removeChartConfig: (uuid: string) => createUrl(`/data/config/${uuid}`),
    addChartConfig: () => createUrl(`/data/config`),
    getDataPoints: (q: string, building?: string) => createUrl(`/data/points?q=${q}&building=${building}`)
};

export default dataAPI;