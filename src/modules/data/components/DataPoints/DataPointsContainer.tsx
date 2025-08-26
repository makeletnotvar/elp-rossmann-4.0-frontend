import { API } from 'api/axios';
import dataAPI from 'api/endpoints/dataAPI';
import { SelectItemType } from 'modules/common/components/Dialogs/SelectDialog/SelectDialogContainer';
import ChartSettings from 'modules/data/components/DataLayout/ChartSettings/ChartSettings';
import DataConfigsContainer from 'modules/data/components/DataPoints/DataConfigs/DataConfigsContainer';
import DataPoints from 'modules/data/components/DataPoints/DataPoints';
import { useConfigsSave, useDataPoints } from 'modules/data/components/DataPoints/DataPointsHooks';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataPointsSelector from './DataPointsSelector/DataPointsSelector';

interface DataPointsContainerProps {
	setOpen: (nextValue: boolean) => void;
}

const fetchAsyncPoints = (usedPoints: string[], q: string) =>
	new Promise<SelectItemType[]>(async (resolve, reject) => {
		try {
			const response = await API.get(dataAPI.getDataPoints(q));
			resolve(response.data.points.filter((p: Reference) => !usedPoints.includes(p.uuid)));
		} catch (err: any) {
			reject(err);
		}
	});

const DataPointsContainer: React.FC<DataPointsContainerProps> = ({ setOpen }) => {
	const {
		// State full points
		points,
		fetched,
		fetching,

		// Temporary Refs
		pointsRefs,
		setPointsRefs,
		addHandler,
		removeHandler,

		// Date
		fromDate,
		setFromDate,
		toDate,
		setToDate,
		days,
		minDate,
		maxDate,

		config,
		// from,
		// to,

		// Generate
		generateHandler,
	} = useDataPoints();

	const [lastSelectedBuilding, setLastSelectedBuilding] = useState<string | null>(null);
	const [selectPointDialogOpen, setSelectPointDialogOpen] = useState<boolean>(false);
	const [query, setQuery] = useState('');
	const { t } = useTranslation();

	// Saving hook
	const { isSaveEnabled, saveHandler, isSaving } = useConfigsSave();

	return (
		<>
			<DataConfigsContainer onPointsSet={setPointsRefs} config={config} />
			<DataPoints
				{...{
					points,
					fetched,
					fetching,
					onRemove: removeHandler,
					onAdd: () => setSelectPointDialogOpen(true),
					onListSave: points => saveHandler({ points }),
					isSaving,
					isListSaveEnabled: isSaveEnabled,
				}}
			/>
			<ChartSettings
				onGenerate={generateHandler}
				onClose={() => setOpen(false)}
				pointsUUIDs={pointsRefs}
				{...{ fromDate, setFromDate, toDate, setToDate, days, minDate, maxDate }}
			/>

			{selectPointDialogOpen && (
				<DataPointsSelector
					currentSelectedPoints={pointsRefs}
					onAdd={addHandler}
					onBuildingSelect={setLastSelectedBuilding}
					lastSelectedBuilding={lastSelectedBuilding}
					onClose={() => setSelectPointDialogOpen(false)}
				/>
			)}
		</>
	);
};

export default DataPointsContainer;
