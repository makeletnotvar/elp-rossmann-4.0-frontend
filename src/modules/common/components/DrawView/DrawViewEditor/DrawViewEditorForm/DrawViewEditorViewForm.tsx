import { UI } from 'config/ui';
import { EditingViewStateActions } from 'modules/common/components/DrawView/DrawViewEditor/editingState';
import JSClipboard from 'modules/common/components/DrawView/DrawViewEditor/helpers/JSClipboard';
import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import EditorFormGroupParam from 'modules/common/components/Forms/EditorForm/EditorFormGroupParam';
import ColorSelector from 'modules/common/components/Forms/StyleEditor/ColorSelector';
import * as React from 'react';
import { useCallback } from 'react';
// const styles = require("./DrawViewEditorViewForm.scss");

interface DrawViewEditorViewFormProps {
	view: DrawView;
	actions: EditingViewStateActions;
}

const DrawViewEditorViewForm: React.FC<DrawViewEditorViewFormProps> = ({ view, actions }) => {
	const updateHandler = useCallback(
		(param: string, config: boolean = false, fn: any = null) =>
			(evt: React.ChangeEvent<HTMLInputElement>) => {
				const value = evt.currentTarget.value;
				const renderedValue = fn ? fn(value) : null;
				actions.updateViewParam(param, renderedValue || value, config);
			},

		[view]
	);

	const updateBackgroundHandler = useCallback(
		(param: string, config: boolean = false, fn: any = null, value: string) => {
			const renderedValue = fn ? fn(value) : null;
			actions.updateViewParam(param, renderedValue || value, config);
		},

		[view]
	);

	const copyExportHandler = useCallback(() => {
		JSClipboard.copyObjectWithoutIdentifier(view);
	}, [view]);

	return (
		<>
			<EditorFormGroup label='view_editor.params.view_settings'>
				<EditorFormGroupParam label='view_editor.params.uuid'>{view.uuid}</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.user'>{view.user ? view.user.name : '?'}</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.building'>{view.building ? view.building.name : '?'}</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.name'>
					<input type='text' value={view.name} style={{ width: '90%' }} onChange={updateHandler('name', false)} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.shared'>
					<input type='checkbox' checked={view.shared || false} onChange={evt => actions.updateViewParam('shared', evt.target.checked, false)} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.version'>
					<input
						type='number'
						value={view.version}
						style={{ width: '90%' }}
						onChange={evt => actions.updateViewParam('version', Number(evt.target.value), false)}
					/>
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.export'>
					<button style={{ padding: '1px 3px', fontSize: '8pt' }} onClick={copyExportHandler}>
						Kopiuj do schowka
					</button>
				</EditorFormGroupParam>
			</EditorFormGroup>
			<EditorFormGroup label='view_editor.params.size'>
				<EditorFormGroupParam label='view_editor.params.width'>
					<input type='number' min={100} max={5000} value={view.config!.width} onChange={updateHandler('width', true, Number)} />
					<span>px</span>
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.height'>
					<input type='number' min={100} max={999} value={view.config!.height} onChange={updateHandler('height', true, Number)} />
					<span>px</span>
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.zoom'>
					<input
						type='number'
						min={UI.VIEW_EDITOR.ZOOM_MIN_PERCENT}
						max={UI.VIEW_EDITOR.ZOOM_MAX_PERCENT}
						value={view.config!.zoom}
						onChange={updateHandler('zoom', true, Number)}
					/>
					<span>%</span>
				</EditorFormGroupParam>
			</EditorFormGroup>
			<EditorFormGroup label='style'>
				<EditorFormGroupParam label='view_editor.params.background'>
					<ColorSelector id={0} color={view.config!.background || ''} onChange={value => updateBackgroundHandler('background', true, String, value)} />
				</EditorFormGroupParam>
			</EditorFormGroup>
		</>
	);
};

export default DrawViewEditorViewForm;
