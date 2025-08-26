import { t } from 'i18next';
import ConfirmDialog, { useConfirm } from 'modules/common/components/Dialogs/ConfirmDialog/ConfirmDialog';
import SuperTable, { SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { useViews } from 'modules/common/redux/views';
import { useAuth } from 'modules/common/selectors/auth';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingViews.module.scss';
import BuildingViewsAddIcon from './BuildingViewsAddIcon';
import { useBuildingViews } from './BuildingViewsHooks';
import BuildingViewsListActions from './BuildingViewsListActions';
import BuildingViewsViewLink from './BuildingViewsViewLink';

interface BuildingViewsProps {
	building: Building;
}

const getDynamicColumns = (user: UserAuth | null): SuperTableDataColumns => ({
	name: {
		label: 'view_editor.params.name',
		searchable: true,
		custom: BuildingViewsViewLink as any,
	},
	subtitle: {
		label: 'view_editor.params.subtitle',
	},
	shared: {
		label: 'view_editor.params.shared',
		hidden: user?.type !== 'DEV',
		custom: ({ value }) => (value ? t('general.yes') : t('general.no')),
	},
	version: {
		label: 'view_editor.params.version',
		hidden: user?.type !== 'DEV',
	},
});

const BuildingViews: React.FC<BuildingViewsProps> = ({ building }) => {
	const { user } = useAuth();
	const { views } = useViews();
	const { t } = useTranslation();
	const { moreHandler, editHandler, removeHandler, addHandler } = useBuildingViews();
	const { closeHandler, confirmHandler, isOpen, openHandler } = useConfirm(removeHandler);

	return (
		<>
			<SuperTable
				data={views}
				columns={getDynamicColumns(user)}
				onUpdateSettings={console.log}
				hidePagination={true}
				translator={t}
				wrapperClassName={styles.wrapper}
				rowActions={({ uuid }) => (
					<BuildingViewsListActions
						{...{
							uuid,
							onMore: moreHandler,
							onEdit: editHandler,
							onRemove: openHandler,
						}}
					/>
				)}
				footer={<BuildingViewsAddIcon onAdd={addHandler} buildingUUID={building.uuid} />}
			/>
			<ConfirmDialog
				title={t('buildings.messages.deleting_building_view')}
				message={t('buildings.messages.sure_to_delete_building_view')}
				onConfirm={confirmHandler}
				onCancel={closeHandler}
				open={isOpen}
			/>
		</>
	);
};

export default BuildingViews;
