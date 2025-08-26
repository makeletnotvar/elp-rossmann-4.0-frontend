import { processXid } from 'helpers/processXid';
import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import * as React from 'react';
import EditorFormGroupParam from '../../../Forms/EditorForm/EditorFormGroupParam';
import { EditingViewStateActions } from '../../DrawViewEditor/editingState';
import DrawViewItemValuePointSelector from '../DrawViewItemValue/DrawViewItemValuePointSelector';
import { DrawViewItemParamComponentProps } from './DrawViewItemParamComponent';

interface DrawViewItemParamEditorProps {
	item: DrawViewItemParamComponentProps;
	view: DrawView;
	actions: EditingViewStateActions;
}

const DrawViewItemParamEditor: React.FC<DrawViewItemParamEditorProps> = ({ item, actions, view }) => {
	const updateRefPoint = (value: string, label: string) => {
		actions.updateItemParams(item.id, { pointRef: { uuid: value, name: label } });
	};

	const changeParamHandler = (param: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { [param]: evt.currentTarget.value });
	};

	const changeParamNumberHandler = (param: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { [param]: Number(evt.currentTarget.value) });
	};

	const changePointXidHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { pointXid: processXid(evt.currentTarget.value) });
	};

	return (
		<>
			<EditorFormGroup topSeparator label='view_editor.items.param'>
				<EditorFormGroupParam label='view_editor.params.point'>
					<DrawViewItemValuePointSelector
						building={view.building}
						point={item.pointRef}
						onChange={updateRefPoint}
						onDelete={() => actions.updateItemParams(item.id, { pointRef: null })}
					/>
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.pointXid'>
					<input type='text' value={item.pointXid} onChange={changePointXidHandler} style={{ width: '90%' }} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.label'>
					<input type='text' value={item.label} onChange={changeParamHandler('label')} style={{ width: '90%' }} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.width' item={item} view={view}>
					<input type='number' min={240} value={item.width || 240} onChange={changeParamNumberHandler('width')} style={{ width: '90%' }} />
				</EditorFormGroupParam>
			</EditorFormGroup>
		</>
	);
};

export default DrawViewItemParamEditor;
