import items, { DrawViewItem, StyleEditorParam } from 'modules/common/components/DrawView/items/items';
import StyleEditor from 'modules/common/components/Forms/StyleEditor/StyleEditor';
import * as React from 'react';
import { EditingViewStateActions } from '../editingState';
// const styles = require("./DrawViewEditorItemEditorProvider.scss");

export interface DrawViewEditorItemEditorProviderProps {
	item: DrawViewItem;
	actions: EditingViewStateActions;
	view: DrawView;
}

const DrawViewEditorItemEditorProvider: React.FC<DrawViewEditorItemEditorProviderProps> = ({ item, actions, view }) => {
	const EditorComponent = items[item.type].editorComponent;
	const styleConfig: StyleEditorParam[] = items[item.type].styles || [];

	const displayStyleEditor = styleConfig.length > 0;
	return (
		<>
			{EditorComponent && <EditorComponent item={item} actions={actions} view={view} />}
			{displayStyleEditor && (
				<StyleEditor
					id={item.id}
					style={item.style || {}}
					styleConfig={styleConfig}
					onChange={(param, value) => actions.updateItemStyle(item.id, { [param]: value })}
					item={item}
					view={view}
					actions={actions}
				/>
			)}
		</>
	);
};

export default DrawViewEditorItemEditorProvider;
