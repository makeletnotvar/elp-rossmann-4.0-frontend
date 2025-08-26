import { getItemElement } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import * as React from 'react';
import { useMemo } from 'react';
import { StyleTransformerInputType } from 'typings/styleTransformer';
import EditorFormGroupParam from '../../../Forms/EditorForm/EditorFormGroupParam';
import { EditingViewStateActions } from '../../DrawViewEditor/editingState';
import { DrawViewItemStaticImageComponentProps } from './DrawViewItemStaticImageComponent';

interface DrawViewItemStaticImageEditorProps {
	item: DrawViewItemStaticImageComponentProps;
	actions: EditingViewStateActions;
	view: DrawView;
}

const DrawViewItemStaticImageEditor: React.FC<DrawViewItemStaticImageEditorProps> = ({ item, actions, view }) => {
	const changeParamHandler = (param: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { [param]: evt.currentTarget.value });
	};

	const changeCheckboxParamHandler = (param: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { [param]: evt.currentTarget.checked });
	};

	const changeStaticImage = (file: FileType | null) => {
		if (file) {
			actions.updateItemParams(item.id, { src: file.url });
		}
	};

	const changeUnitXidHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { unitXid: evt.currentTarget.value });
	};

	const image: HTMLImageElement | null = useMemo(() => {
		const wrapper = getItemElement(item.id);
		const img = wrapper ? wrapper.querySelector('img') || null : null;

		return img;
	}, [item.id, item.src]);

	return (
		<>
			<EditorFormGroup topSeparator label='view_editor.items.static_image'>
				{/* <EditorFormGroupParam label='view_editor.params.src'>
					<CustomFileInput
						value={
							item.src.startsWith('https://elp365files.blob.core.windows.net') ? item.src.replace('https://elp365files.blob.core.windows.net', '$:') : item.src
						}
						onChange={changeStaticImage}
					/>
				</EditorFormGroupParam> */}
				<EditorFormGroupParam label='view_editor.params.src'>
					<input type='text' value={item.src} onChange={changeParamHandler('src')} style={{ width: '90%' }} />
				</EditorFormGroupParam>
				<EditorFormGroupParam
					label='view_editor.params.title'
					item={item}
					view={view}
					actions={actions}
					transformerId='__title'
					inputType={StyleTransformerInputType.TEXT}
				>
					<input type='text' value={item.title} onChange={changeParamHandler('title')} style={{ width: '90%' }} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='unit_xid'>
					<input type='text' value={item.unitXid} onChange={changeUnitXidHandler} style={{ width: '90%' }} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.bgView'>
					<input type='checkbox' checked={Boolean(item.bgView)} onChange={changeCheckboxParamHandler('bgView')} />
				</EditorFormGroupParam>
				{image && (
					<>
						<EditorFormGroupParam label='view_editor.params.width'>
							{image.naturalWidth}
							<span>px</span>
						</EditorFormGroupParam>
						<EditorFormGroupParam label='view_editor.params.height'>
							{image.naturalWidth}
							<span>px</span>
						</EditorFormGroupParam>
					</>
				)}
			</EditorFormGroup>
		</>
	);
};

export default DrawViewItemStaticImageEditor;
