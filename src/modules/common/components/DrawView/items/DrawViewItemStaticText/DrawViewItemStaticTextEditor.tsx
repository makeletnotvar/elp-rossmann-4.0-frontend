import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import * as React from 'react';
import { StyleTransformerInputType } from 'typings/styleTransformer';
import EditorFormGroupParam from '../../../Forms/EditorForm/EditorFormGroupParam';
import { EditingViewStateActions } from '../../DrawViewEditor/editingState';
import { DrawViewItemStaticTextComponentProps } from './DrawViewItemStaticTextComponent';

interface DrawViewItemStaticTextEditorProps {
	item: DrawViewItemStaticTextComponentProps;
	actions: EditingViewStateActions;
	view: DrawView;
}

const DrawViewItemStaticTextEditor: React.FC<DrawViewItemStaticTextEditorProps> = ({ item, actions, view }) => {
	const changeLabelHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { label: evt.currentTarget.value });
	};

	return (
		<>
			<EditorFormGroup topSeparator label='view_editor.items.static_text'>
				<EditorFormGroupParam
					label='view_editor.params.label'
					item={item}
					view={view}
					actions={actions}
					transformerId='__label'
					inputType={StyleTransformerInputType.TEXT}
				>
					<input type='text' value={item.label} onChange={changeLabelHandler} style={{ width: '90%' }} autoFocus />
				</EditorFormGroupParam>
			</EditorFormGroup>
		</>
	);
};

export default DrawViewItemStaticTextEditor;
