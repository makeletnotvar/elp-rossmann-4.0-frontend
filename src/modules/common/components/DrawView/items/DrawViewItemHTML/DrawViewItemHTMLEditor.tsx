import HTMLEditorContainer from 'modules/common/components/DrawView/items/DrawViewItemHTML/HTMLEditor/HTMLEditorContainer';
import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import * as React from 'react';
import EditorFormGroupParam from '../../../Forms/EditorForm/EditorFormGroupParam';
import { EditingViewStateActions } from '../../DrawViewEditor/editingState';
import { DrawViewItemHTMLComponentProps } from './DrawViewItemHTMLComponent';

interface DrawViewItemHTMLEditorProps {
	item: DrawViewItemHTMLComponentProps;
	actions: EditingViewStateActions;
}

const DrawViewItemHTMLEditor: React.FC<DrawViewItemHTMLEditorProps> = ({ item, actions }) => {
	const changeLabelHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { label: evt.currentTarget.value });
	};

	const changeUnitXidHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { unitXid: evt.currentTarget.value });
	};

	return (
		<>
			<EditorFormGroup topSeparator label='view_editor.items.html'>
				<EditorFormGroupParam label='view_editor.params.label'>
					<input type='text' value={item.label} onChange={changeLabelHandler} style={{ width: '90%' }} autoFocus />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='unit_xid'>
					<input type='text' value={item.unitXid} onChange={changeUnitXidHandler} style={{ width: '90%' }} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.html'>
					<HTMLEditorContainer item={item} actions={actions} />
				</EditorFormGroupParam>
			</EditorFormGroup>
		</>
	);
};

export default DrawViewItemHTMLEditor;
