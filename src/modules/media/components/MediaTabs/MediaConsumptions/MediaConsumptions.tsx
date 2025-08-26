import MediaConsumptionsView from 'modules/media/components/MediaTabs/MediaConsumptions/MediaConsumptionsView';
import { useMediaConsumptionsData } from 'modules/media/hooks/MediaConsumptionsHooks';
import React from 'react';

const MediaConsumptions: React.FC = () => {
	const { consumptionData, consumptionValues, status, settings, changeHandler } = useMediaConsumptionsData();

	return <MediaConsumptionsView data={consumptionValues} status={status} settings={settings} onSubmit={changeHandler} />;
};

export default MediaConsumptions;
