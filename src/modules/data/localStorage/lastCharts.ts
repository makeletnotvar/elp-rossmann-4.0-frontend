import _ from "lodash";

export type LastChartConfig = {
    points: Reference[];
    fromTs?: number | undefined;
    toTs?: number | undefined;
};

class LastCharts {
    private static readonly LAST_CHARTS_LOCALSTORAGE_ID: string = '_LCLI_';
    private static CHARTS_MAX_COUNT: number = 10;

    static read(): LastChartConfig[] | null {
        const data = localStorage.getItem(this.LAST_CHARTS_LOCALSTORAGE_ID);
        return data ? JSON.parse(data) : null;
    }

    static save(configs: LastChartConfig[]) {
        localStorage.setItem(this.LAST_CHARTS_LOCALSTORAGE_ID, JSON.stringify(configs));
    }

    static reset(): void {
        localStorage.removeItem(this.LAST_CHARTS_LOCALSTORAGE_ID);
    }

    static findIndex(configs: LastChartConfig[], configToFind: LastChartConfig): number {
        const configToFindPointsUUIDS = configToFind.points.map(p => p.uuid);

        if (configToFindPointsUUIDS.length === 0) {
            return -1;
        } else {
            const foundIndex = configs.findIndex(
                nextConfig => {
                    const nextConfigPointsUUIDs = nextConfig.points.map(p => p.uuid);
                    const hasEqualsUUIDs = _.isEqual(_.sortBy(nextConfigPointsUUIDs), _.sortBy(configToFindPointsUUIDS));
                    const hasEqualsCount = configToFindPointsUUIDS.length === nextConfigPointsUUIDs.length;


                    return hasEqualsCount && hasEqualsUUIDs;
                }
            );
            return foundIndex;
        }
    }

    static add(points: Reference[], fromTs?: number, toTs?: number): void {
        let nextData: LastChartConfig[] = [];
        const nextConfig = { points, fromTs, toTs };
        const currentData = this.read();

        if (currentData) {
            nextData = currentData;
            const swapConfigIndex = this.findIndex(nextData, nextConfig);

            if (swapConfigIndex > -1) {
                nextData.splice(swapConfigIndex, 1);
            } else if (nextData.length >= this.CHARTS_MAX_COUNT) {
                nextData.shift();
            }
        }

        nextData.push({ points, fromTs, toTs });
        this.save(nextData);
    }
}

const lastCharts = LastCharts;
export default lastCharts;