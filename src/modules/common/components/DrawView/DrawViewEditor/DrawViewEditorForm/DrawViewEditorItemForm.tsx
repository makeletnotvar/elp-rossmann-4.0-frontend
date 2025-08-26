import DrawViewEditorFormCommonParamsGroup from 'modules/common/components/DrawView/DrawViewEditor/DrawViewEditorForm/DrawViewEditorFormCommonParamsGroup';
import DrawViewEditorItemEditorProvider from 'modules/common/components/DrawView/DrawViewEditor/DrawViewEditorItemsProvider/DrawViewEditorItemEditorProvider';
import { EditingViewStateActions } from 'modules/common/components/DrawView/DrawViewEditor/editingState';
import { DrawViewItem } from 'modules/common/components/DrawView/items/items';
import * as React from 'react';
// const styles = require("./DrawViewEditorItemForm.scss");

interface DrawViewEditorItemFormProps {
	view: DrawView;
	item: DrawViewItem;
	itemEl: HTMLElement;
	actions: EditingViewStateActions;
	workspaceWidth: number;
	workspaceHeight: number;
}

const DrawViewEditorItemForm: React.FC<DrawViewEditorItemFormProps> = ({ view, item, itemEl, actions, workspaceHeight, workspaceWidth }) => {
	return (
		<>
			<DrawViewEditorFormCommonParamsGroup
				id={item.id}
				type={item.type}
				x={item.x}
				y={item.y}
				z={item.z}
				workspaceWidth={workspaceWidth || 0}
				workspaceHeight={workspaceHeight || 0}
				itemWidth={itemEl.offsetWidth}
				itemHeight={itemEl.offsetHeight}
				actions={actions}
				item={item}
				view={view}
			/>
			<DrawViewEditorItemEditorProvider item={item} actions={actions} view={view} />
		</>
	);
};

export default DrawViewEditorItemForm;
