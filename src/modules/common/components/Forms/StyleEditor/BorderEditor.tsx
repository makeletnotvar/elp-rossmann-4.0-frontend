import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import EditorFormGroupParam from 'modules/common/components/Forms/EditorForm/EditorFormGroupParam';
import ColorSelector from 'modules/common/components/Forms/StyleEditor/ColorSelector';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleTransformerInputType } from 'typings/styleTransformer';
import { EditingViewStateActions } from '../../DrawView/DrawViewEditor/editingState';
import { DrawViewItem } from '../../DrawView/items/items';
// const styles = require("./BorderEditor.scss");

interface BorderEditorProps {
	show: boolean;
	border?: string;
	radius?: number;
	id: number;
	onChange: (param: string, value: any) => void;
	view?: DrawView;
	item?: DrawViewItem;
	actions?: EditingViewStateActions;
	disabled?: boolean;
}

const BorderEditor: React.FC<BorderEditorProps> = ({ id, show, border, radius, onChange, item, view, actions, disabled }) => {
	const [width, setWidth] = useState<number | undefined>(0);
	const [style, setStyle] = useState<string | undefined>('none');
	const [color, setColor] = useState<string | undefined>();

	useEffect(() => {
		if (border) {
			const splittedBorder = border.split(' ');
			if (splittedBorder.length === 3) {
				const [_width, _style, _color] = splittedBorder;
				setStyle(_style);
				setWidth(parseInt(_width));
				setColor(_color);
			}
		} else {
			setWidth(undefined);
			setStyle(undefined);
			setColor(undefined);
		}
	}, [id, border]);

	useEffect(() => {
		if (width !== undefined && style !== undefined && color !== undefined) onChange('border', `${width || 0}px ${style || 'solid'} ${color || '#000000'}`);
	}, [width, style, color]);

	return (
		<EditorFormGroup topSeparator label='view_editor.params.border' show={show}>
			<EditorFormGroupParam
				label='view_editor.params.border_width'
				item={item}
				view={view}
				actions={actions}
				transformerId='borderWidth'
				inputType={StyleTransformerInputType.NUMBER}
			>
				<input disabled={disabled} type='number' value={width} min='0' max='20' step='1' onChange={evt => setWidth(Number(evt.currentTarget.value))} />
				<span>px</span>
			</EditorFormGroupParam>
			<EditorFormGroupParam
				label='view_editor.params.border_color'
				item={item}
				view={view}
				show={!disabled}
				actions={actions}
				transformerId='borderColor'
				inputType={StyleTransformerInputType.COLOR}
			>
				<ColorSelector id={id} color={color} onChange={value => setColor(value)} />
			</EditorFormGroupParam>
			<EditorFormGroupParam
				label='view_editor.params.border_style'
				item={item}
				view={view}
				actions={actions}
				transformerId={'borderStyle'}
				inputType={StyleTransformerInputType.ENUM}
				transformerEnumValues={[
					{
						key: 'none',
						value: 'none',
					},
					{
						key: 'solid',
						value: 'solid',
					},
					{
						key: 'dotted',
						value: 'dotted',
					},
					{
						key: 'dashed',
						value: 'dashed',
					},
					{
						key: 'double',
						value: 'double',
					},
				]}
			>
				<select disabled={disabled} value={style} onChange={evt => setStyle(evt.currentTarget.value)}>
					<option value='none'>none</option>
					<option value='solid'>solid</option>
					<option value='dotted'>dotted</option>
					<option value='dashed'>dashed</option>
					<option value='double'>double</option>
				</select>
			</EditorFormGroupParam>
			<EditorFormGroupParam
				label='view_editor.params.border_radius'
				item={item}
				view={view}
				actions={actions}
				transformerId='borderRadius'
				inputType={StyleTransformerInputType.NUMBER}
			>
				<input
					disabled={disabled}
					type='number'
					value={radius}
					min='0'
					max='100'
					step='1'
					onChange={evt => onChange('borderRadius', Number(evt.currentTarget.value))}
				/>
			</EditorFormGroupParam>
		</EditorFormGroup>
	);
};

export default BorderEditor;
