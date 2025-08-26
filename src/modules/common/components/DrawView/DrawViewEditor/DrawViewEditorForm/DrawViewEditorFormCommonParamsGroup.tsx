import { getInputNumberValue } from 'modules/common/components/DrawView/DrawViewEditor/helpers/editor';
import * as React from 'react';
import { StyleTransformerInputType } from 'typings/styleTransformer';
import EditorFormGroup from '../../../Forms/EditorForm/EditorFormGroup';
import EditorFormGroupParam from '../../../Forms/EditorForm/EditorFormGroupParam';
import { DrawViewItem } from '../../items/items';
import { EditingViewStateActions } from '../editingState';
// const styles = require("./DrawViewEditorFormCommonParamsGroupParams.scss");

interface DrawViewEditorFormCommonParamsGroupProps extends Pick<DrawViewItem, 'id' | 'x' | 'y' | 'z' | 'type'> {
	workspaceWidth: number;
	workspaceHeight: number;
	itemWidth: number;
	itemHeight: number;
	actions: EditingViewStateActions;
	item: DrawViewItem;
	view: DrawView;
}

const DrawViewEditorFormCommonParamsGroup: React.FC<DrawViewEditorFormCommonParamsGroupProps> = ({
	id,
	x,
	y,
	z,
	type,
	workspaceHeight,
	workspaceWidth,
	itemWidth,
	itemHeight,
	actions,
	item,
	view,
}) => {
	const updateNumberParam = React.useCallback(
		(param: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const value = getInputNumberValue(event.currentTarget as HTMLInputElement);
			actions.updateItemParams(id, { [param]: value });
		},
		[id, x, y, z]
	);

	/**
	 * We need to skip some parameter, which won't be duplicated
	 */
	const { id: _id, type: _type, x: _x, y: _y, z: _z, pointRef, ...itemExport } = item as any;

	const updateCodeHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const code = evt.currentTarget.value;

		/**
		 *
		 * In case where object is not valid (catching JSON parse error)
		 *
		 */
		try {
			const importItem = JSON.parse(code);
			actions.updateItemParams(id, importItem);
		} catch (err: any) {
			// nothing
		}
	};

	return (
		<EditorFormGroup label='view_editor.params.general'>
			<EditorFormGroupParam label='view_editor.params.id'>{id}</EditorFormGroupParam>
			<EditorFormGroupParam label='view_editor.params.type'>{type}</EditorFormGroupParam>
			<EditorFormGroupParam
				label='view_editor.params.x'
				item={item}
				view={view}
				actions={actions}
				transformerId='__x'
				inputType={StyleTransformerInputType.NUMBER}
			>
				<input type='number' min={1} max={workspaceWidth - itemWidth} value={x} onChange={updateNumberParam('x')} />
				<span>px</span>
			</EditorFormGroupParam>
			<EditorFormGroupParam
				label='view_editor.params.y'
				item={item}
				view={view}
				actions={actions}
				transformerId='__y'
				inputType={StyleTransformerInputType.NUMBER}
			>
				<input type='number' min={1} max={workspaceHeight - itemHeight} value={y} onChange={updateNumberParam('y')} />
				<span>px</span>
			</EditorFormGroupParam>
			<EditorFormGroupParam
				label='view_editor.params.z'
				item={item}
				view={view}
				actions={actions}
				transformerId='__z'
				inputType={StyleTransformerInputType.NUMBER}
			>
				<input type='number' min={1} max={999} value={z} onChange={updateNumberParam('z')} />
			</EditorFormGroupParam>
			<EditorFormGroupParam label='view_editor.params.code'>
				<input type='text' value={JSON.stringify(itemExport)} onChange={updateCodeHandler} style={{ width: '90%' }} />
			</EditorFormGroupParam>
			<EditorFormGroupParam label='view_editor.params.classes'>
				<input
					type='text'
					value={item.classes}
					onChange={evt => actions.updateItemParams(id, { classes: evt.currentTarget.value || '' })}
					style={{ width: '90%' }}
				/>
			</EditorFormGroupParam>
		</EditorFormGroup>
	);
};

export default DrawViewEditorFormCommonParamsGroup;
