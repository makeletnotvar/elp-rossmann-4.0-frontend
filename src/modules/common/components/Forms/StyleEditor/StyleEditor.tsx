import { getInputNumberValue } from 'modules/common/components/DrawView/DrawViewEditor/helpers/editor';
import { DrawViewItem, StyleEditorParam } from 'modules/common/components/DrawView/items/items';
import BorderEditor from 'modules/common/components/Forms/StyleEditor/BorderEditor';
import ColorSelector from 'modules/common/components/Forms/StyleEditor/ColorSelector';
import SizeEditor from 'modules/common/components/Forms/StyleEditor/SizeEditor';
import TextEditor from 'modules/common/components/Forms/StyleEditor/TextEditor';
import * as React from 'react';
import { CSSProperties, useCallback } from 'react';
import { StyleTransformerInputType } from 'typings/styleTransformer';
import { EditingViewStateActions } from '../../DrawView/DrawViewEditor/editingState';
import { DrawViewItemValueComponentProps } from '../../DrawView/items/DrawViewItemValue/DrawViewItemValueComponent';
import EditorFormGroup from '../EditorForm/EditorFormGroup';
import EditorFormGroupParam from '../EditorForm/EditorFormGroupParam';

interface StyleEditorProps {
	id: number;
	style: CSSProperties;
	styleConfig: StyleEditorParam[];
	onChange: (param: string, value: any) => void;
	item: DrawViewItem;
	view: DrawView;
	actions: EditingViewStateActions;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ style: itemStyle, onChange, id, styleConfig, item, view, actions }) => {
	const isTemplate =
		Boolean((item as DrawViewItemValueComponentProps)?.template) && (item as DrawViewItemValueComponentProps)?.template?.toLocaleLowerCase().includes('2');

	const { padding, opacity, rotate, display, ...refreshedItemStyle } = React.useMemo(() => {
		const { padding, opacity, rotate, display, ...refreshedItemStyle } = {
			padding: 0,
			opacity: 1,
			rotate: 0,
			display: 'block',
			...itemStyle,
		};

		return {
			padding,
			opacity,
			rotate,
			display,
			...refreshedItemStyle,
		};
	}, [id, itemStyle]);

	const changeNumberHandler = useCallback(
		(param: string) => (evt: any) => {
			onChange(param, getInputNumberValue(evt.currentTarget as HTMLInputElement));
		},
		[refreshedItemStyle, id]
	);

	return (
		<>
			<TextEditor
				id={id}
				show={styleConfig.includes('text')}
				fontWeight={(refreshedItemStyle.fontWeight as string) || 'normal'}
				fontSize={(refreshedItemStyle.fontSize as number) || 0}
				fontStyle={refreshedItemStyle.fontStyle || 'normal'}
				textDecoration={(refreshedItemStyle.textDecoration as any) || 'none'}
				textAlign={refreshedItemStyle.textAlign || 'left'}
				onChangeNumber={changeNumberHandler}
				onChange={onChange}
				disabled={isTemplate}
			/>
			<EditorFormGroup
				label='view_editor.params.style'
				show={
					styleConfig.includes('color') ||
					styleConfig.includes('background') ||
					styleConfig.includes('opacity') ||
					styleConfig.includes('padding') ||
					styleConfig.includes('rotate')
				}
			>
				<EditorFormGroupParam
					label='view_editor.params.color'
					show={!isTemplate && styleConfig.includes('color')}
					item={item}
					view={view}
					actions={actions}
					transformerId='color'
					inputType={StyleTransformerInputType.COLOR}
				>
					<ColorSelector id={id} color={refreshedItemStyle.color} onChange={value => onChange('color', value)} />
				</EditorFormGroupParam>
				<EditorFormGroupParam
					label='view_editor.params.visibility'
					item={item}
					view={view}
					actions={actions}
					transformerId='display'
					inputType={StyleTransformerInputType.ENUM}
					transformerEnumValues={[
						{
							key: 'none',
							value: 'none',
						},
						{
							key: 'block',
							value: 'block',
						},
					]}
				>
					<input
						disabled={isTemplate}
						type='checkbox'
						checked={display === 'block' ? true : false}
						onChange={evt => onChange('display', evt.target.checked ? 'block' : 'none')}
					/>
				</EditorFormGroupParam>
				<EditorFormGroupParam
					label='view_editor.params.background'
					show={!isTemplate && styleConfig.includes('background')}
					item={item}
					view={view}
					actions={actions}
					transformerId='background'
					inputType={StyleTransformerInputType.COLOR}
				>
					<ColorSelector id={id} color={refreshedItemStyle.background as string} onChange={value => onChange('background', value)} />
				</EditorFormGroupParam>
				<EditorFormGroupParam
					label='view_editor.params.opacity'
					show={styleConfig.includes('opacity')}
					item={item}
					view={view}
					actions={actions}
					transformerId='opacity'
					inputType={StyleTransformerInputType.NUMBER}
				>
					<input disabled={isTemplate} type='number' value={opacity} min='0' max='1' step='0.05' onChange={changeNumberHandler('opacity')} />
				</EditorFormGroupParam>
				<EditorFormGroupParam
					label='view_editor.params.padding'
					show={styleConfig.includes('padding')}
					item={item}
					view={view}
					actions={actions}
					transformerId='padding'
					inputType={StyleTransformerInputType.NUMBER}
				>
					<input disabled={isTemplate} type='number' value={padding} min='0' max='100' step='1' onChange={changeNumberHandler('padding')} />
					<span>px</span>
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.rotate' show={styleConfig.includes('rotate')}>
					<input disabled={isTemplate} type='number' value={rotate} min='0' max='360' step='1' onChange={changeNumberHandler('rotate')} />
					<span>°</span>
				</EditorFormGroupParam>
			</EditorFormGroup>
			<SizeEditor
				id={id}
				item={item}
				view={view}
				actions={actions}
				show={styleConfig.includes('size')}
				width={isTemplate && !(item as DrawViewItemValueComponentProps)?.template?.toLocaleLowerCase().includes('rol2') ? 0 : refreshedItemStyle.width || 0}
				height={isTemplate && !(item as DrawViewItemValueComponentProps)?.template?.toLocaleLowerCase().includes('rol2') ? 99 : refreshedItemStyle.height || 0}
				onChange={changeNumberHandler}
				disabled={isTemplate && !(item as DrawViewItemValueComponentProps)?.template?.toLocaleLowerCase().includes('rol2')}
			/>
			<BorderEditor
				id={id}
				show={styleConfig.includes('border')}
				border={(refreshedItemStyle.border as string) || ''}
				onChange={onChange}
				item={item}
				view={view}
				actions={actions}
				disabled={isTemplate}
			/>
		</>
	);
};

export default StyleEditor;
