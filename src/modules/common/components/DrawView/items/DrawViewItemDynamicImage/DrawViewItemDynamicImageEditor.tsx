import { processXid } from 'helpers/processXid';
import { getItemElement } from 'modules/common/components/DrawView/DrawViewEditor/helpers/items';
import DynamicImageSelectorContainer from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/DynamicImageSelector/DynamicImageSelectorContainer';
import { DynamicImageSrcs } from 'modules/common/components/DrawView/items/DrawViewItemDynamicImage/types';
import DrawViewItemValuePointSelector from 'modules/common/components/DrawView/items/DrawViewItemValue/DrawViewItemValuePointSelector';
import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import { renderPointValue } from 'modules/common/helpers/points/renderers';
import { usePoint } from 'modules/common/redux/points';
import { usePointValue } from 'modules/common/redux/poll';
import * as React from 'react';
import { useMemo } from 'react';
import { StyleTransformerInputType } from 'typings/styleTransformer';
import EditorFormGroupParam from '../../../Forms/EditorForm/EditorFormGroupParam';
import { EditingViewStateActions } from '../../DrawViewEditor/editingState';
import { DrawViewItemDynamicImageComponentProps } from './DrawViewItemDynamicImageComponent';

export interface DrawViewItemDynamicImageEditorProps {
	item: DrawViewItemDynamicImageComponentProps;
	actions: EditingViewStateActions;
	view: DrawView;
}

const DrawViewItemStaticImageEditor: React.FC<DrawViewItemDynamicImageEditorProps> = ({ item, actions, view }) => {
	const point = usePoint(item?.pointRef?.uuid || null, item.pointXid);
	const rawPointValue = usePointValue(point?.uuid || null);

	const renderedValue = useMemo(() => {
		return point && rawPointValue ? renderPointValue(point, rawPointValue) : null;
	}, [rawPointValue, point]);

	const imageDomElement: HTMLImageElement | null = useMemo(() => {
		const wrapper = getItemElement(item.id);
		const img = wrapper ? wrapper.querySelector('img') || null : null;

		return img;
	}, [item.id, item.srcs]);

	const updateRefPoint = (value: string, label: string) => {
		actions.updateItemParams(item.id, { pointRef: { uuid: value, name: label } });
	};

	const changeParamHandler = (param: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		if (param === 'pointXid') {
			actions.updateItemParams(item.id, { [param]: processXid(evt.currentTarget?.value || '') });
		} else {
			actions.updateItemParams(item.id, { [param]: evt.currentTarget.value });
		}
	};

	const changeCheckboxParamHandler = (param: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { [param]: evt.currentTarget.checked });
	};

	return (
		<>
			<EditorFormGroup topSeparator label='view_editor.items.dynamic_image'>
				<EditorFormGroupParam label='view_editor.params.point'>
					<DrawViewItemValuePointSelector
						building={view.building}
						point={item.pointRef}
						onChange={updateRefPoint}
						onDelete={() => actions.updateItemParams(item.id, { pointRef: null })}
					/>
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.pointXid'>
					<input type='text' value={item.pointXid} onChange={changeParamHandler('pointXid')} style={{ width: '90%' }} />
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.value_type'>{point && point.type}</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.rendered_value'>{renderedValue && renderedValue}</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.raw_value'>{rawPointValue && rawPointValue.value}</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.srcs'>
					<DynamicImageSelectorContainer
						item={item}
						onChange={(srcs: DynamicImageSrcs) => actions.updateItemParams(item.id, { srcs })}
						pointType={point ? point.type : null}
					/>
				</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.showLabel'>
					<input type='checkbox' checked={Boolean(item.showLabel)} onChange={changeCheckboxParamHandler('showLabel')} />
				</EditorFormGroupParam>

				{item.showLabel && (
					<EditorFormGroupParam
						label='view_editor.params.labelOverwrite'
						item={item}
						view={view}
						actions={actions}
						transformerId='__label'
						inputType={StyleTransformerInputType.TEXT}
					>
						<input type='text' value={item.label} onChange={changeParamHandler('label')} style={{ width: '90%' }} />
					</EditorFormGroupParam>
				)}
				<EditorFormGroupParam label='view_editor.params.showValue'>
					<input type='checkbox' checked={Boolean(item.showValue)} onChange={changeCheckboxParamHandler('showValue')} />
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
				{imageDomElement && (
					<>
						<EditorFormGroupParam label='view_editor.params.width'>
							{imageDomElement.naturalWidth}
							<span>px</span>
						</EditorFormGroupParam>
						<EditorFormGroupParam label='view_editor.params.height'>
							{imageDomElement.naturalWidth}
							<span>px</span>
						</EditorFormGroupParam>
					</>
				)}
			</EditorFormGroup>
		</>
	);
};

export default DrawViewItemStaticImageEditor;
