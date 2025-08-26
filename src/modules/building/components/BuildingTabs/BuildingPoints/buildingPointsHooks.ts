import { orderBy } from "lodash";
import { SuperTableDisplaySettings } from "modules/common/components/Layout/SuperTable/SuperTable";
import { usePoints } from "modules/common/redux/points";
import { useCallback, useEffect, useState } from "react";

export const useBuildingPoints = () => { 
    const pointsState = usePoints();
    const initialPoints: Point[] = pointsState ? pointsState.points : [];

    const [points, setPoints] = useState<Point[]>([]);
    const [sortingDir, setSortingDir] = useState<'asc' | 'desc'>('asc');
    const [sortingParam, setSortingParam] = useState<string>('name');

    /**
     * Update sorting props
     */
    const updateSettingsHandler = useCallback((ob: Partial<SuperTableDisplaySettings>) => {
        if (ob.sortingDir && ob.sortingDir !== sortingDir) {
            setSortingDir(ob.sortingDir);
        }

        if (ob.sortingParam && ob.sortingParam !== sortingParam) {
            setSortingParam(ob.sortingParam);
        }
    }, [sortingDir, sortingParam]);


    /**
     * Initial values or update when sorting props changes
     */
    useEffect(() => {
        const sortedPoints = orderBy(initialPoints, [sortingParam], [sortingDir]);
        setPoints(sortedPoints);
    }, [JSON.stringify(initialPoints), sortingDir, sortingParam]);
    

    return {
        points,
        onUpdateSettings: updateSettingsHandler,
        sortingDir,
        sortingParam
    };
}