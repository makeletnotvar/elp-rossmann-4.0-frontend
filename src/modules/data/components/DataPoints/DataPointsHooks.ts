import { DAY_TS, YEAR_TS } from "helpers/date";
import { useDispatch } from "modules/common/helpers/redux/useActions";
import { usePointsWithLoad } from "modules/common/redux/points";
import { useDataRouter } from "modules/data/components/DataCharts/DataChartContainerHooks";
import { chartConfigsActions, useChartConfigsState } from "modules/data/redux/chartConfigs";
import moment from 'moment';
import { useCallback, useMemo, useState } from "react";
import useRouter from "use-react-router";
import { isFetching } from "vredux";
import lastCharts from "modules/data/localStorage/lastCharts";
import { useBuildingsState } from 'modules/buildings/redux/buildings';


export function useDataPoints(activeConfig?: string) {
    const LOAD_POINTS_WITH_POLL_INIT = true;

    // Routing hook
    const { pointsUUIDs: urlPoints, from, to, config, changeHandler: updateChartURLRoute } = useDataRouter();

    // Current point UUIDs
    const [pointsRefs, setPointsRefs] = useState<string[]>(urlPoints);

    // Load points
    const { points, fetched, fetching } = usePointsWithLoad(pointsRefs, LOAD_POINTS_WITH_POLL_INIT);

    // Time range
    const initialFromDate = new Date(from || Date.now() - DAY_TS); // one day even if definied in url
    const [fromDate, setFromDate] = useState(initialFromDate);
    const [toDate, setToDate] = useState(new Date());


    /**
     * Remove point
     */
    const removeHandler = (removePointUUID: string) => {
        setPointsRefs(pointsRefs.filter(uuid => uuid !== removePointUUID))
    }

    /**
     * Add new point
     */
    const addHandler = (uuid: string) => {
        setPointsRefs([...pointsRefs, uuid]);
    }

    /**
     * Generate chart
     * It calls chart generating by change url path with router
     */
    const generateHandler = () => {

        const getPointFullName = (p: Point) => {
            let fullName = '';

            if (p.building && p.building.name) {
                fullName = p.building.name + ' - ';
            }

            fullName += String(p.name || p.xid);

            return fullName;
        }

        const pointsReferences = (
            pointsRefs
                .map(uuid => points.find(p => p.uuid === uuid))
                .filter(p => !!p)
                .map((p: any) => ({ name: getPointFullName(p), uuid: p.uuid })) as Reference[]
        );

        const fromTs = new Date(fromDate).getTime();
        const toTs = new Date(toDate).getTime();
        lastCharts.add(pointsReferences, fromTs, toTs);
        updateChartURLRoute(pointsRefs, fromTs, toTs, activeConfig);
    }

    const days = useMemo(() => {
        return moment(fromDate).diff(moment(toDate), 'days');
    }, [fromDate, toDate]);

    const maxDate = new Date();

    const fullPoints: Point[] = pointsRefs.map(uuid => points.find(p => p.uuid === uuid)).filter(p => !!p) as Point[];

    return {
        fromDate,
        toDate,
        setFromDate,
        setToDate,
        days,
        maxDate,
        minDate: new Date(Date.now() - YEAR_TS),
        from,
        to,
        config,
        points: fullPoints,
        fetched,
        fetching,
        pointsRefs,
        removeHandler,
        addHandler,
        generateHandler,
        setPointsRefs
    };
}


export function useConfigsSave() {
    const { data: { configs, active }, status } = useChartConfigsState();
    const dispatch = useDispatch();


    const saveHandler = useCallback((nextConfig: Partial<ChartConfig>) => {
        const config = configs.find(c => c.uuid === active);
        if (active && config) {
            dispatch(chartConfigsActions.update({
                ...config,
                ...nextConfig,
                uuid: active
            }));
        }
    }, [active]);

    return {
        isSaveEnabled: Boolean(active),
        saveHandler,
        isSaving: isFetching(status)
    }
}

export const getPointFullName = (p: Point) => {
    let fullName = '';

    if (p.building && p.building.name) {
        fullName = p.building.name + ' - ';
    }
    fullName += String(p.name || p.xid);

    return fullName;
};