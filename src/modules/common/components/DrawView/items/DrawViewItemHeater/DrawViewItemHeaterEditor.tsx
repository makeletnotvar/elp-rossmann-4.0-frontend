import EditorFormGroup from 'modules/common/components/Forms/EditorForm/EditorFormGroup';
import { renderPointValue } from 'modules/common/helpers/points/renderers';
import { useCurrentBuildingPoint } from 'modules/common/helpers/points/useCurrentBuildingPoint';
import { usePointValue } from 'modules/common/redux/poll';
import React, { useMemo } from 'react';
import { StyleTransformerInputType } from 'typings/styleTransformer';
import EditorFormGroupParam from '../../../Forms/EditorForm/EditorFormGroupParam';
import { EditingViewStateActions } from '../../DrawViewEditor/editingState';
import { DrawViewItemHeaterComponentProps } from './DrawViewItemHeaterComponent';

export interface DrawViewItemHeaterEditorProps {
	item: DrawViewItemHeaterComponentProps;
	actions: EditingViewStateActions;
	view: DrawView;
}

const DrawViewItemHeaterEditor: React.FC<DrawViewItemHeaterEditorProps> = ({ item, actions, view }) => {
	const POINTS_XIDS = ['hepwr', 'gaspwr', 'y1', 'hwpwr'];
	const point = useCurrentBuildingPoint(POINTS_XIDS);

	const rawPointValue = usePointValue(point ? point.uuid : '');
	const renderedValue = useMemo(() => {
		return point && rawPointValue ? renderPointValue(point, rawPointValue) : null;
	}, [rawPointValue, point]);

	const changeParamHandler = (param: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { [param]: evt.currentTarget.value });
	};

	const changeCheckboxParamHandler = (param: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		actions.updateItemParams(item.id, { [param]: evt.currentTarget.checked });
	};

	return (
		<>
			<EditorFormGroup topSeparator label='view_editor.items.heater'>
				<EditorFormGroupParam label='view_editor.params.value_type'>{point && point.type}</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.rendered_value'>{renderedValue && renderedValue}</EditorFormGroupParam>
				<EditorFormGroupParam label='view_editor.params.raw_value'>{rawPointValue && rawPointValue.value}</EditorFormGroupParam>
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
			</EditorFormGroup>
		</>
	);
};

export default DrawViewItemHeaterEditor;
