import { useDispatch } from "modules/common/helpers/redux/useActions";
import { useChartConfigsState, chartConfigsActions, ChartConfigUpdateResponse } from "modules/data/redux/chartConfigs";
import { useEffect, useCallback, useState } from "react";

export function useDataConfigs(setPointsHandler: (points: string[]) => void, providedActiveConfig?: string) {
    const { data: { active: activeConfig } } = useChartConfigsState();
    const dispatch = useDispatch();
    const { data: { configs = [] }, status } = useChartConfigsState();

    useEffect(() => {
        dispatch(chartConfigsActions.fetch());
    }, []);

    const setActiveConfig = useCallback((uuid: string) => {
        dispatch(chartConfigsActions.select(uuid));
    }, []);

    const loadConfig = useCallback((uuid: string) => {
        const config = configs.find(config => config.uuid === uuid);
        if (config) {
            setPointsHandler(config.points || []);
            setActiveConfig(uuid);
        }
    }, [configs]);

    const addHandler = useCallback((name: string) => {
        const config: Partial<ChartConfig> = {
            name,
            points: []
        };
        dispatch(chartConfigsActions.add(config));
    }, []);

    const deleteHandler = useCallback(() => {
        if (activeConfig) {
            dispatch(chartConfigsActions.remove(activeConfig));
        }
    }, [activeConfig]);

    const editHandler = useCallback((nextConfig: Partial<ChartConfig>) => {
        if (activeConfig) {
            const config: ChartConfig | undefined = configs.find(c => c.uuid === activeConfig);
            dispatch(chartConfigsActions.update({ ...config, ...nextConfig }));
        }
    }, [activeConfig])

    return {
        configs,
        status,
        loadConfig,
        activeConfig,
        resetActiveConfigHandler: () => setActiveConfig(''),
        addHandler,
        deleteHandler,
        editHandler
    }
} 