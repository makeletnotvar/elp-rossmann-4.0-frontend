import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import EditorFormGroupParam from 'modules/common/components/Forms/EditorForm/EditorFormGroupParam';
import * as React from 'react';
import { StyleTransformerInputType } from 'typings/styleTransformer';
// const styles = require("./SizeEditor.scss");

interface SizeEditorProps {
	show: boolean;
	onChange: (param: string) => (evt: any) => void;
	width: number | string | undefined;
	height: number | string | undefined;
	id: number;
	item: any;
	view: any;
	actions: any;
	disabled?: boolean;
}

const SizeEditor: React.FC<SizeEditorProps> = ({ id, show, height, width, onChange, item, view, actions, disabled }) => {
	return show ? (
		<EditorFormGroup label='view_editor.params.size'>
			<EditorFormGroupParam
				label='view_editor.params.width'
				item={item}
				view={view}
				actions={actions}
				transformerId='width'
				inputType={StyleTransformerInputType.NUMBER}
			>
				<input disabled={disabled} type='number' value={width} min='0' max='1920' step='1' onChange={onChange('width')} />
				<span>px</span>
			</EditorFormGroupParam>
			<EditorFormGroupParam
				label='view_editor.params.height'
				item={item}
				view={view}
				actions={actions}
				transformerId='height'
				inputType={StyleTransformerInputType.NUMBER}
			>
				<input disabled={disabled} type='number' value={height} min='0' max='1080' step='1' onChange={onChange('height')} />
				<span>px</span>
			</EditorFormGroupParam>
		</EditorFormGroup>
	) : null;
};

export default SizeEditor;
