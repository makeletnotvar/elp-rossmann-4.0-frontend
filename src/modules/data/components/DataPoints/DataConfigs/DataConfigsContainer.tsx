import ConfirmDialog, { useConfirm } from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import DataConfigs from 'modules/data/components/DataPoints/DataConfigs/DataConfigs';
import { useDataConfigs } from 'modules/data/components/DataPoints/DataConfigs/DataConfigsHooks';
import * as React from 'react';

interface DataConfigsContainerProps {
	onPointsSet: (nextPoints: string[]) => void;
	config?: string;
}

const DataConfigsContainer: React.FC<DataConfigsContainerProps> = ({ onPointsSet, config }) => {
	const { configs, loadConfig, status, activeConfig, deleteHandler, addHandler, editHandler, resetActiveConfigHandler } = useDataConfigs(onPointsSet, config);
	const { isOpen, openHandler, closeHandler, confirmHandler } = useConfirm(deleteHandler);

	return (
		<>
			<DataConfigs
				configs={configs}
				onLoadConfig={loadConfig}
				activeConfig={activeConfig}
				onResetActiveConfig={resetActiveConfigHandler}
				onDelete={openHandler}
				onEdit={editHandler}
				onAdd={addHandler}
			/>
			<ConfirmDialog title='Usuwanie listy punktów' message='Czy na pewno chcesz usunąć?' open={isOpen} onCancel={closeHandler} onConfirm={confirmHandler} />
		</>
	);
};

export default DataConfigsContainer;
