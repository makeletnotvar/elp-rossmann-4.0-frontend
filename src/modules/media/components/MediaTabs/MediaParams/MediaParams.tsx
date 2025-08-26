import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { pollActions } from 'modules/common/redux/poll';
import { mergePointsValues } from 'modules/data/components/DataCharts/DataChartContainerHooks';
import MediaParamsView from 'modules/media/components/MediaTabs/MediaParams/MediaParamsView';
import { useMediaParamsData } from 'modules/media/hooks/MediaParamsHooks';
import React, { useEffect, useMemo } from 'react';

interface MediaParamsProps {
	points: Point[];
}

const MediaParams: React.FC<MediaParamsProps> = ({ points }) => {
	const { data, pointsValues, status, settings, changeHandler } = useMediaParamsData();
	const dispatch = useDispatch();
	const pointsUUIDS = useMemo(() => Object.values(data).map(data => data.uuid), [data]);
	const filteredPoints = points.filter(point => point.uuid && pointsUUIDS.includes(point.uuid));

	useEffect(() => {
		if (pointsUUIDS.length > 0) {
			dispatch(pollActions.poll.request(pointsUUIDS));
		}
	}, [pointsUUIDS]);

	return <MediaParamsView points={filteredPoints} data={mergePointsValues(pointsValues)} status={status} settings={settings} onSubmit={changeHandler} />;
};

export default MediaParams;
