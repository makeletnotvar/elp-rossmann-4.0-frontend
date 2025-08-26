import DrawViewEditorItemWrapper from 'modules/common/components/DrawView/DrawViewEditor/DrawViewEditorItemWrapper/DrawViewEditorItemWrapper';
import { EditingViewStateActions } from 'modules/common/components/DrawView/DrawViewEditor/editingState';
import items, { DrawViewItem } from 'modules/common/components/DrawView/items/items';
import { ErrorBoundaryFallback } from 'modules/common/components/ErrorBoundaryFallback/ErrorBoundaryFallback';
import { useAuth } from 'modules/common/selectors/auth';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
// const styles = require("./DrawViewEditorItemsProvider.scss");

export interface DrawViewEditorItemsProviderProps {
	item: DrawViewItem;
	isSelected: boolean;
	onSelect: (evt: React.MouseEvent<HTMLDivElement>) => void;
	actions: EditingViewStateActions;
	select: (items: number[]) => void;
	setActive: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing: boolean;
	handleClick: (evt: React.MouseEvent, type: string, item?: DrawViewItem) => void;
	selected: number[];
	onSetImageLoading: (loadingImage: boolean) => void;
	buildingUUID?: string;
}

const DrawViewEditorItemsProvider: React.FC<DrawViewEditorItemsProviderProps> = props => {
	const { user } = useAuth();
	const { item, actions, select, editing, setActive, onSetImageLoading, buildingUUID } = props;
	const ItemComponent = items[item.type]?.component;

	return (
		<DrawViewEditorItemWrapper {...props} setActive={setActive}>
			<ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
				{ItemComponent ? (
					<ItemComponent
						{...item}
						item={item}
						onSetImageLoading={onSetImageLoading}
						setActive={setActive}
						user={user}
						actions={actions}
						select={select}
						editing={editing}
						buildingUUID={buildingUUID}
					/>
				) : (
					'Item provider error'
				)}
			</ErrorBoundary>
		</DrawViewEditorItemWrapper>
	);
};

export default DrawViewEditorItemsProvider;
