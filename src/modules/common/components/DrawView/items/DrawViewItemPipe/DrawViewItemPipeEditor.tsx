import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import ColorSelector from 'modules/common/components/Forms/StyleEditor/ColorSelector';
import * as React from 'react';
import { useCallback } from 'react';
import { StyleTransformerInputType } from 'typings/styleTransformer';
import EditorFormGroupParam from '../../../Forms/EditorForm/EditorFormGroupParam';
import { EditingViewStateActions } from '../../DrawViewEditor/editingState';
import { getInputNumberValue } from '../../DrawViewEditor/helpers/editor';
import { DrawViewItemPipeComponentProps } from './DrawViewItemPipeComponent';

interface DrawViewItemPipeEditorProps {
	item: DrawViewItemPipeComponentProps;
	view: DrawView;
	actions: EditingViewStateActions;
}

const DrawViewItemPipeEditor: React.FC<DrawViewItemPipeEditorProps> = ({ item, actions, view }) => {
	const changeLabelHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { label: evt.currentTarget.value });
	};

	const changeDescriptionHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { description: evt.currentTarget.value });
	};

	const changeDirectionHandler = (direction: any) => {
		actions.updateItemParams(item.id, { direction });
		actions.updateItemStyle(item.id, {
			width:
				(direction === 'up' || direction === 'down') && item.direction === 'right'
					? item.style?.height
					: (direction === 'up' || direction === 'down') && item.direction === 'left'
					? item.style?.height
					: direction === 'right' && (item.direction === 'down' || item.direction === 'up')
					? item.style?.height
					: direction === 'left' && (item.direction === 'down' || item.direction === 'up')
					? item.style?.height
					: item.style?.width,
			height:
				(direction === 'up' || direction === 'down') && item.direction === 'right'
					? item.style?.width
					: (direction === 'up' || direction === 'down') && item.direction === 'left'
					? item.style?.width
					: direction === 'right' && (item.direction === 'down' || item.direction === 'up')
					? item.style?.width
					: direction === 'left' && (item.direction === 'down' || item.direction === 'up')
					? item.style?.width
					: item.style?.height,
		});
	};

	const changeColorHandler = (param: string, value: string) => {
		actions.updateItemStyle(item.id, { [param]: value });
	};

	const changeNumberHandler = useCallback(
		(param: string) => (evt: any) => {
			actions.updateItemStyle(item.id, { [param]: getInputNumberValue(evt.currentTarget as HTMLInputElement) });
		},
		[actions, item.id]
	);

	const changeUnitXidHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { unitXid: evt.currentTarget.value });
	};

	return (
		<>
			<EditorFormGroup topSeparator label='view_editor.items.pipe'>
				<EditorFormGroupParam label='Tytuł' item={item} view={view} actions={actions} transformerId='__label' inputType={StyleTransformerInputType.TEXT}>
					<input type='text' value={item.label} onChange={changeLabelHandler} style={{ width: '90%' }} />
				</EditorFormGroupParam>
				{/* <EditorFormGroupParam label='Opis' item={item} view={view} actions={actions} transformerId='__description' inputType={StyleTransformerInputType.TEXT}>
					<input type='text' value={item.description} onChange={changeDescriptionHandler} style={{ width: '90%' }} />
				</EditorFormGroupParam> */}
				<EditorFormGroupParam label='Kolor tekstu' item={item} view={view} actions={actions} transformerId='color' inputType={StyleTransformerInputType.COLOR}>
					<ColorSelector id={item.id} color={item.style?.color as string} onChange={value => changeColorHandler('color', value)} />
				</EditorFormGroupParam>
				<EditorFormGroupParam
					label='Kolor tła'
					item={item}
					view={view}
					actions={actions}
					transformerId='background'
					inputType={StyleTransformerInputType.COLOR}
				>
					<ColorSelector id={item.id} color={item.style?.background as string} onChange={value => changeColorHandler('background', value)} />
				</EditorFormGroupParam>
				<EditorFormGroupParam
					label='Przeźroczystość'
					item={item}
					view={view}
					actions={actions}
					transformerId='opacity'
					inputType={StyleTransformerInputType.TEXT}
				>
					<input type='number' value={item.style?.opacity} min='0' max='1' step='0.05' onChange={changeNumberHandler('opacity')} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label={item.direction === 'up' || item.direction === 'down' ? 'Szerokość' : 'Długość'}>
					<input type='number' value={item.style?.width} step='1' onChange={changeNumberHandler('width')} />
					<span>px</span>
				</EditorFormGroupParam>
				<EditorFormGroupParam label={item.direction === 'up' || item.direction === 'down' ? 'Długość' : 'Szerokość'}>
					<input type='number' value={item.style?.height} step='1' onChange={changeNumberHandler('height')} />
					<span>px</span>
				</EditorFormGroupParam>
				<EditorFormGroupParam label='Rotacja'>
					<select value={item.direction} onChange={evt => changeDirectionHandler(evt.currentTarget.value as any)}>
						<option value='up'>Góra</option>
						<option value='right'>Prawo</option>
						<option value='left'>Lewo</option>
						<option value='down'>Dół</option>
					</select>
				</EditorFormGroupParam>
				<EditorFormGroupParam label='unit_xid'>
					<input type='text' value={item.unitXid} onChange={changeUnitXidHandler} style={{ width: '90%' }} />
				</EditorFormGroupParam>
			</EditorFormGroup>
		</>
	);
};

export default DrawViewItemPipeEditor;
